import { updateStep, updateStatus, addApiResponse, base64url } from './utils.js';
import { getStateValue, setState } from './state.js';

// Challenge Flow
export async function performChallenge() {
    updateStep('step-challenge', 'active');
    updateStatus('Starting challenge flow...');
    
    // Show the challenge iframe and hide placeholder
    document.getElementById('challengePlaceholder').classList.add('hidden');
    document.getElementById('challengeIframe').classList.remove('hidden');
    
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
        // Check periodically for completion
        const checkInterval = setInterval(async () => {
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
                
                const data = await response.json();
                
                if (data.messageType === 'RReq') {
                    // Challenge completed
                    clearInterval(checkInterval);
                    setState('activeCheckInterval', null);
                    updateStep('step-challenge', 'completed');
                    updateStatus('Challenge completed successfully');
                    resolve();
                }
            } catch (error) {
                // Still waiting for completion
            }
        }, 2000); // Check every 2 seconds
        
        setState('activeCheckInterval', checkInterval);
        
        // Timeout after 5 minutes
        setTimeout(() => {
            if (getStateValue('activeCheckInterval')) {
                clearInterval(getStateValue('activeCheckInterval'));
                setState('activeCheckInterval', null);
            }
            updateStep('step-challenge', 'error');
            updateStatus('Challenge timed out', true);
            resolve();
        }, 300000);
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