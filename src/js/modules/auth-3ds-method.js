import { updateStep, updateStatus, base64url } from './utils.js';
import { getSelectedCardNumber } from './ui.js';
import { setState, getStateValue } from './state.js';

// 3DS Method
export async function perform3DSMethod() {
    updateStep('step-3dsmethod', 'active');
    updateStatus('Performing 3DS Method...');
    setState('threeDSMethodCompleted', false);
    
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        let resolved = false;
        
        // Define the completion handler function
        const methodComplete = (event) => {
            if (event.data === '3DSMethodComplete' && !resolved) {
                resolved = true;
                window.removeEventListener('message', methodComplete);
                if (timeoutId) clearTimeout(timeoutId);
                updateStep('step-3dsmethod', 'completed');
                updateStatus('3DS Method completed');
                setState('threeDSMethodCompleted', true);
                resolve();
            }
        };
        
        // Set up completion handler
        window.addEventListener('message', methodComplete);
        
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
        
        // Determine timeout based on test case
        const cardNumber = getSelectedCardNumber();
        const lastFour = cardNumber.slice(-4);
        const is3DSMethodTimeout = lastFour[1] === '2';
        const timeout = is3DSMethodTimeout ? 10000 : 10000; // Always 10 seconds per spec
        
        // Timeout after configured time
        timeoutId = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                window.removeEventListener('message', methodComplete);
                updateStep('step-3dsmethod', 'completed');
                updateStatus(`3DS Method timed out (${timeout/1000}s)`);
                setState('threeDSMethodCompleted', false); // Mark as not completed
                resolve();
            }
        }, timeout);
    });
}