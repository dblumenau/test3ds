import { updateStep, updateStatus, addApiResponse, base64url } from './utils.js';
import { getStateValue, setState } from './state.js';

// Challenge Flow
export async function performChallenge() {
    updateStep('step-challenge', 'active');
    updateStatus('Starting challenge flow...');
    
    // Show the challenge iframe and hide placeholder
    document.getElementById('challengePlaceholder').classList.add('hidden');
    document.getElementById('challengeIframe').classList.remove('hidden');
    
    // Add postMessage listener to check if ACS sends any messages
    const messageHandler = (event) => {
        console.log('🔔 Message received from iframe:', {
            origin: event.origin,
            data: event.data,
            source: event.source
        });
        console.log('✅ ACS message detected:', event.data);
        // Check if it's from the ACS domain
        if (event.origin.includes('3dsecure.io') || event.origin.includes('sandbox')) {
            console.log('✅ ACS message detected:', event.data);
            updateStatus(`Received message from ACS: ${JSON.stringify(event.data)}`);
            
            // Check for various possible completion indicators
            if (event.data === 'ChallengeComplete' || 
                event.data === '3DSChallengeComplete' ||
                (typeof event.data === 'object' && event.data.messageType === 'CRes') ||
                (typeof event.data === 'string' && event.data.includes('complete'))) {
                console.log('🎉 Challenge completion detected via postMessage!');
                updateStatus('Challenge completed via postMessage!');
                // Remove listener after completion
                window.removeEventListener('message', messageHandler);
            }
        }
    };
    
    // Add the message listener
    window.addEventListener('message', messageHandler);
    console.log('👂 Listening for postMessage events from challenge iframe...');
    
    // Create CReq data
    const creqData = {
        threeDSServerTransID: getStateValue('threeDSServerTransID'),
        acsTransID: getStateValue('acsTransID'),
        messageVersion: getStateValue('messageVersion'),
        messageType: "CReq",
        challengeWindowSize: "05"
    };
    
    // Base64 URL encode the CReq
    const encodedCreq = base64url(JSON.stringify(creqData));
    document.getElementById('creqData').value = encodedCreq;
    
    // Submit challenge form to iframe
    const form = document.getElementById('challengeForm');
    form.action = getStateValue('acsURL');
    form.target = 'challengeIframe';
    form.method = 'POST';
    form.submit();
    
    updateStatus('Challenge submitted. Please complete the challenge in the iframe below.');
    
    // For manual challenge (card ending in 72), user must interact
    // We'll need to wait for completion
    return new Promise((resolve) => {
        let pollCount = 0;
        const maxInitialPolls = 3; // Allow 3 quick polls (6 seconds) before showing special handling
        
        // Check periodically for completion
        const checkInterval = setInterval(async () => {
            pollCount++;
            
            try {
                const response = await fetch('/api/3ds/postauth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        threeDSServerTransID: getStateValue('threeDSServerTransID')
                    })
                });
                
                // Handle server errors
                if (!response.ok) {
                    // For 500 errors during initial polling, this is expected
                    // The challenge might not be ready yet
                    if (response.status === 500 && pollCount <= maxInitialPolls) {
                        console.log('Challenge not ready yet, continuing to poll...');
                        return; // Continue polling
                    }
                    
                    if (response.status >= 500 && pollCount > maxInitialPolls) {
                        // Persistent server error after initial polls - stop polling
                        clearInterval(checkInterval);
                        setState('activeCheckInterval', null);
                        updateStep('step-challenge', 'error');
                        updateStatus(`Server error during post-authentication: ${response.status} ${response.statusText}`, true);
                        
                        // Hide iframe and show error in placeholder
                        document.getElementById('challengeIframe').classList.add('hidden');
                        document.getElementById('challengePlaceholder').classList.remove('hidden');
                        document.getElementById('challengePlaceholder').innerHTML = `
                            <div class="text-center">
                                <div class="text-6xl mb-4 text-red-400">❌</div>
                                <div class="text-xl text-red-300">Server Error</div>
                            </div>
                        `;
                        
                        addApiResponse('Post-Authentication Error', { 
                            status: response.status, 
                            statusText: response.statusText,
                            message: 'Server error - please check server logs'
                        });
                        resolve();
                        return;
                    }
                    // For other errors, we might want to continue polling
                }
                
                const data = await response.json();
                
                // Log the error for debugging
                if (response.status === 500) {
                    console.log('Post-auth 500 error details:', data);
                }
                
                // Check for server-side timeout first
                if (data.errorCode === '402' || data.errorCode === '405' ||
                    (data.errorDescription && 
                     (data.errorDescription.includes('timeout') || 
                      data.errorDescription.includes('timed out') ||
                      data.errorDescription.includes('Challenge timeout'))) ||
                    (data.errorDetail && 
                     (data.errorDetail.includes('timeout') || 
                      data.errorDetail.includes('timed out') ||
                      data.errorDetail.includes('Connection timeout')))) {
                    // Server-side timeout detected
                    clearInterval(checkInterval);
                    setState('activeCheckInterval', null);
                    updateStep('step-challenge', 'error');
                    
                    // Clean up postMessage listener
                    window.removeEventListener('message', messageHandler);
                    
                    // Hide iframe and show server timeout message
                    document.getElementById('challengeIframe').classList.add('hidden');
                    document.getElementById('challengePlaceholder').classList.remove('hidden');
                    document.getElementById('challengePlaceholder').innerHTML = `
                        <div class="text-center">
                            <div class="text-6xl mb-4 text-yellow-400">⏱️</div>
                            <div class="text-xl text-yellow-300">Server Timeout</div>
                            <div class="text-sm text-yellow-400 mt-2">Challenge timed out on server</div>
                        </div>
                    `;
                    
                    updateStatus('Server timeout - challenge timed out on server side', true);
                    addApiResponse('Challenge Timeout', data);
                    resolve();
                    return;
                }
                
                // Check for "not ready" errors that we should continue polling for
                if (data.errorCode === '308' || data.errorCode === '309' || 
                    (data.errorCode === '500' && data.errorDescription && 
                     (data.errorDescription.includes('not ready') || 
                      data.errorDescription.includes('Challenge not completed')))) {
                    // Challenge not completed yet - this is expected
                    if (pollCount > maxInitialPolls) {
                        updateStatus('Waiting for challenge completion... Please complete the challenge above.');
                    }
                    return; // Continue polling
                }
                
                if (data.messageType === 'RReq' || data.transStatus) {
                    // Challenge completed - we already have the final result
                    clearInterval(checkInterval);
                    setState('activeCheckInterval', null);
                    updateStep('step-challenge', 'completed');
                    
                    // Clean up postMessage listener
                    window.removeEventListener('message', messageHandler);
                    
                    // Hide the challenge iframe and show placeholder again
                    document.getElementById('challengeIframe').classList.add('hidden');
                    document.getElementById('challengeIframe').src = 'about:blank';
                    document.getElementById('challengePlaceholder').classList.remove('hidden');
                    document.getElementById('challengePlaceholder').innerHTML = `
                        <div class="text-center">
                            <div class="text-6xl mb-4">✅</div>
                            <div class="text-xl text-gray-300">Challenge Completed</div>
                        </div>
                    `;
                    
                    // Process the final result here since we already have it
                    addApiResponse('Post-Authentication Response', data);
                    updateStep('step-postauth', 'completed');
                    
                    // Display final result
                    if (data.transStatus === 'Y') {
                        updateStatus(`✅ Authentication successful! ECI: ${data.eci}, Auth Value: ${data.authenticationValue}`);
                    } else if (data.transStatus === 'N') {
                        updateStatus(`❌ Authentication failed. Status: ${data.transStatus}`, true);
                    } else {
                        updateStatus(`⚠️ Authentication completed with status: ${data.transStatus}`);
                    }
                    
                    resolve(true); // Return true to indicate we already processed the result
                }
            } catch (error) {
                // Network or parsing error - continue polling
                console.log('Poll error (will continue):', error);
            }
        }, 2000); // Check every 2 seconds
        
        setState('activeCheckInterval', checkInterval);
        
        // Timeout after 6 minutes (give server time to respond with its own timeout)
        setTimeout(() => {
            if (getStateValue('activeCheckInterval')) {
                clearInterval(getStateValue('activeCheckInterval'));
                setState('activeCheckInterval', null);
            }
            // Clean up postMessage listener on timeout
            window.removeEventListener('message', messageHandler);
            
            // Hide iframe and show timeout message
            document.getElementById('challengeIframe').classList.add('hidden');
            document.getElementById('challengePlaceholder').classList.remove('hidden');
            document.getElementById('challengePlaceholder').innerHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-4 text-yellow-400">⏱️</div>
                    <div class="text-xl text-yellow-300">Frontend Timeout</div>
                    <div class="text-sm text-yellow-400 mt-2">Server did not respond with timeout</div>
                </div>
            `;
            
            updateStep('step-challenge', 'error');
            updateStatus('Frontend timeout - server did not respond with timeout message', true);
            resolve();
        }, 360000);
    });
}

// Post-Authentication
export async function performPostAuth() {
    updateStep('step-postauth', 'active');
    updateStatus('Retrieving final authentication result...');
    
    const response = await fetch('/api/3ds/postauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            threeDSServerTransID: getStateValue('threeDSServerTransID')
        })
    });
    
    const data = await response.json();
    addApiResponse('Post-Authentication Response', data);
    
    if (!response.ok) {
        throw new Error(data.errorDescription || 'Post-authentication failed');
    }
    
    updateStep('step-postauth', 'completed');
    
    // Display final result
    if (data.transStatus === 'Y') {
        updateStatus(`✅ Authentication successful! ECI: ${data.eci}, Auth Value: ${data.authenticationValue}`);
    } else if (data.transStatus === 'N') {
        updateStatus(`❌ Authentication failed. Status: ${data.transStatus}`, true);
    } else {
        updateStatus(`⚠️ Authentication completed with status: ${data.transStatus}`);
    }
}