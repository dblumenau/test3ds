import { updateStep, updateStatus, base64url } from './utils.js';
import { getSelectedCardNumber } from './ui.js';
import { setState, getStateValue } from './state.js';

// 3DS Method
export async function perform3DSMethod() {
    updateStep('step-3dsmethod', 'active');
    updateStatus('Performing 3DS Method...');
    setState('threeDSMethodCompleted', false);
    
    // Update the 3DS Method container to show loading state
    document.getElementById('methodPlaceholder').innerHTML = `
        <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <p class="text-lg font-medium text-gray-300">3DS Method Running</p>
            <p class="text-sm mt-2 text-gray-400">Collecting device information...</p>
        </div>
    `;
    document.getElementById('threeDSMethodIframe').classList.add('hidden');
    
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        let resolved = false;
        
        // 3DS Method completion is detected by server-side notification, not postMessage
        // The ACS will POST to threeDSMethodNotificationURL when complete
        // We'll use both postMessage listening and polling to check if the notification was received
        let pollCount = 0;
        const maxPolls = 25; // 25 polls over 10 seconds (400ms intervals)
        
        // Add postMessage listener to detect completion message from echo server iframe
        const messageHandler = (event) => {
            console.log('🔔 DETAILED MESSAGE RECEIVED:');
            console.log('  - Origin:', event.origin);
            console.log('  - Data type:', typeof event.data);
            console.log('  - Data:', event.data);
            console.log('  - Source:', event.source);
            
            // Log the full structure of the data in multiple ways
            if (typeof event.data === 'object' && event.data !== null) {
                console.log('  - Data keys:', Object.keys(event.data));
                
                // Try to stringify in chunks to avoid truncation
                try {
                    const jsonString = JSON.stringify(event.data, null, 2);
                    console.log('  - JSON Length:', jsonString.length);
                    
                    // Split into chunks if too long
                    if (jsonString.length > 1000) {
                        console.log('  - Large JSON detected, splitting into chunks:');
                        const chunks = jsonString.match(/.{1,1000}/g);
                        chunks.forEach((chunk, index) => {
                            console.log(`    Chunk ${index + 1}:`, chunk);
                        });
                    } else {
                        console.log('  - Full data structure:', jsonString);
                    }
                } catch (error) {
                    console.log('  - Error stringifying data:', error);
                    // Fallback: log individual properties
                    console.log('  - Individual properties:');
                    Object.keys(event.data).forEach(key => {
                        console.log(`    ${key}:`, event.data[key]);
                    });
                }
            }
            
            // Check if it's from echo.localhost
            if (event.origin === 'http://echo.localhost' && event.data) {
                console.log('✅ Echo server message detected - analyzing structure...');
                
                const currentTransactionId = getStateValue('threeDSServerTransID');
                console.log('🔍 Looking for transaction ID:', currentTransactionId);
                
                // Parse the Laravel Request data structure
                let foundTransactionId = null;
                
                // The Laravel echo server sends $details->toArray() which is the request data
                // It should contain threeDSMethodData as a base64-encoded JSON string
                if (event.data.threeDSMethodData) {
                    console.log('📍 Found threeDSMethodData:', event.data.threeDSMethodData);
                    try {
                        // Decode the base64 data to get the transaction ID
                        const decodedData = JSON.parse(atob(event.data.threeDSMethodData));
                        console.log('📝 Decoded 3DS Method data:', decodedData);
                        foundTransactionId = decodedData.threeDSServerTransID;
                        console.log('📍 Extracted transaction ID:', foundTransactionId);
                    } catch (error) {
                        console.log('❌ Error decoding threeDSMethodData:', error);
                    }
                }
                
                // Fallback: Search through all properties recursively
                if (!foundTransactionId) {
                    console.log('🔍 Fallback: searching recursively for transaction ID...');
                    const searchForTransactionId = (obj, path = '') => {
                        if (typeof obj !== 'object' || obj === null) return;
                        
                        for (const [key, value] of Object.entries(obj)) {
                            const currentPath = path ? `${path}.${key}` : key;
                            
                            if (key === 'threeDSServerTransID' && value === currentTransactionId) {
                                console.log(`📍 Found transaction ID at path: ${currentPath} = ${value}`);
                                foundTransactionId = value;
                                return;
                            }
                            
                            if (typeof value === 'object' && value !== null) {
                                searchForTransactionId(value, currentPath);
                            }
                        }
                    };
                    
                    searchForTransactionId(event.data);
                }
                
                // Check if we found our transaction ID
                if (foundTransactionId === currentTransactionId) {
                    console.log('🎉 3DS Method completion detected via postMessage from echo server!');
                    resolved = true;
                    if (timeoutId) clearTimeout(timeoutId);
                    
                    // Clean up listener
                    window.removeEventListener('message', messageHandler);
                    
                    // Update visual feedback for success
                    document.getElementById('methodPlaceholder').innerHTML = `
                        <div class="text-center">
                            <div class="text-4xl mb-2 text-green-400">✅</div>
                            <div class="text-lg font-medium text-green-300">3DS Method Complete</div>
                            <div class="text-sm text-gray-400 mt-1">Device fingerprinting successful</div>
                        </div>
                    `;
                    
                    // Hide the container after a brief delay
                    setTimeout(() => {
                        document.getElementById('methodContainer').classList.add('hidden');
                    }, 1500);
                    
                    updateStep('step-3dsmethod', 'completed');
                    updateStatus('3DS Method completed successfully');
                    setState('threeDSMethodCompleted', true);
                    resolve();
                    return;
                } else {
                    console.log('❌ Transaction ID not found or mismatch');
                    console.log('  - Expected:', currentTransactionId);
                    console.log('  - Found:', foundTransactionId);
                }
            } else {
                console.log('❌ Message not from echo.localhost or no data');
            }
        };
        
        // Add the message listener
        window.addEventListener('message', messageHandler);
        console.log('👂 Listening for postMessage events from 3DS Method iframe...');
        
        // COMMENTED OUT: Polling is no longer needed since we have postMessage detection
        // const checkCompletion = async () => {
        //     pollCount++;
        //     console.log(`🔍 Checking 3DS Method completion (poll ${pollCount}/${maxPolls})`);
        //     
        //     try {
        //         // Check the echo server dashboard for our transaction ID
        //         const response = await fetch('http://echo.localhost/dashboard', {
        //             method: 'GET'
        //         });
        //         
        //         if (response.ok) {
        //             const html = await response.text();
        //             
        //             // Check if our transaction ID appears in the dashboard
        //             const currentTransactionId = getStateValue('threeDSServerTransID');
        //             if (html.includes(currentTransactionId)) {
        //                 console.log('🎉 3DS Method completion detected via echo server dashboard!');
        //                 resolved = true;
        //                 if (timeoutId) clearTimeout(timeoutId);
        //                 
        //                 // Update visual feedback for success
        //                 document.getElementById('methodPlaceholder').innerHTML = `
        //                     <div class="text-center">
        //                         <div class="text-4xl mb-2 text-green-400">✅</div>
        //                         <div class="text-lg font-medium text-green-300">3DS Method Complete</div>
        //                         <div class="text-sm text-gray-400 mt-1">Device fingerprinting successful</div>
        //                     </div>
        //                 `;
        //                 
        //                 // Hide the container after a brief delay
        //                 setTimeout(() => {
        //                     document.getElementById('methodContainer').classList.add('hidden');
        //                 }, 1500);
        //                 
        //                 updateStep('step-3dsmethod', 'completed');
        //                 updateStatus('3DS Method completed successfully');
        //                 setState('threeDSMethodCompleted', true);
        //                 resolve();
        //                 return;
        //             }
        //         }
        //     } catch (error) {
        //         console.log('Poll error (will continue):', error);
        //     }
        //     
        //     // Continue polling if not resolved and within limits
        //     if (!resolved && pollCount < maxPolls) {
        //         setTimeout(checkCompletion, 400); // Check every 400ms
        //     }
        // };
        
        console.log('👂 Starting 3DS Method with postMessage detection...');
        
        // Create 3DS Method data
        const methodData = {
            threeDSServerTransID: getStateValue('threeDSServerTransID'),
            threeDSMethodNotificationURL: 'http://echo.localhost/echo/3ds-method-notification'
        };
        
        // Base64 URL encode the data
        const encodedData = base64url(JSON.stringify(methodData));
        document.getElementById('threeDSMethodData').value = encodedData;
        
        // Submit form to iframe
        const form = document.getElementById('threeDSMethodForm');
        form.action = getStateValue('threeDSMethodURL');
        form.target = 'threeDSMethodIframe';
        form.method = 'POST';
        form.submit();
        
        // Show the iframe (method will load in it)
        document.getElementById('threeDSMethodIframe').classList.remove('hidden');
        console.log('📝 3DS Method form submitted to iframe');
        
        // COMMENTED OUT: No longer need polling - using postMessage detection
        // setTimeout(checkCompletion, 400); // Start first poll after 400ms
        
        // Determine timeout based on test case
        const cardNumber = getSelectedCardNumber();
        const lastFour = cardNumber.slice(-4);
        const is3DSMethodTimeout = lastFour[1] === '2';
        const timeout = is3DSMethodTimeout ? 10000 : 10000; // Always 10 seconds per spec
        
        // Timeout after configured time
        timeoutId = setTimeout(() => {
            if (!resolved) {
                console.log('⏰ 3DS Method timed out after', timeout/1000, 'seconds');
                resolved = true;
                window.removeEventListener('message', messageHandler);
                
                // Update visual feedback for timeout
                document.getElementById('methodPlaceholder').innerHTML = `
                    <div class="text-center">
                        <div class="text-4xl mb-2 text-yellow-400">⏱️</div>
                        <div class="text-lg font-medium text-yellow-300">3DS Method Timeout</div>
                        <div class="text-sm text-gray-400 mt-1">Will proceed with authentication</div>
                    </div>
                `;
                
                // Hide the container after a brief delay
                setTimeout(() => {
                    document.getElementById('methodContainer').classList.add('hidden');
                }, 1500);
                
                updateStep('step-3dsmethod', 'completed');
                updateStatus(`3DS Method timed out (${timeout/1000}s) - will use "N" for threeDSCompInd`);
                setState('threeDSMethodCompleted', false); // Mark as not completed
                resolve();
            }
        }, timeout);
    });
}