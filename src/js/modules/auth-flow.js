import { updateStep, updateStatus, addApiResponse } from './utils.js';
import { getSelectedCardNumber } from './ui.js';
import { getState, setState, getStateValue, updateState } from './state.js';
import { performAuth, performChallenge, performPostAuth } from './auth-flow-handlers.js';
import { perform3DSMethod } from './auth-3ds-method.js';

// Main authentication flow
export async function startAuthentication() {
    const cardNumber = getSelectedCardNumber();
    if (!cardNumber || cardNumber === 'custom') {
        alert('Please enter a card number');
        return;
    }
    
    // Reset all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed', 'error');
    });
    
    // Reset global variables
    updateState({
        threeDSServerTransID: null,
        acsTransID: null,
        acsURL: null,
        threeDSMethodURL: null,
        dsTransID: null,
        messageVersion: '2.1.0',
        supportedVersions: [],
        threeDSMethodCompleted: false
    });
    
    // Clear API responses
    document.getElementById('apiResponses').innerHTML = '<em>API responses will appear here...</em>';
    
    // Disable button during processing
    document.getElementById('startAuthBtn').disabled = true;
    
    try {
        // Step 1: Pre-Authentication
        const preauthSuccess = await performPreAuth(cardNumber);
        
        // If pre-auth failed (e.g., not enrolled), stop here
        if (!preauthSuccess) {
            console.log('Pre-auth failed, stopping flow');
            return;
        }
        
        // Step 2: 3DS Method (if available)
        if (getStateValue('threeDSMethodURL')) {
            await perform3DSMethod();
        } else {
            updateStep('step-3dsmethod', 'completed');
            updateStatus('No 3DS Method URL provided, skipping...');
        }
        
        // Step 3: Authentication
        await performAuth(cardNumber);
        
        // Step 4: Handle Challenge (if required)
        if (getStateValue('acsURL')) {
            const alreadyProcessed = await performChallenge();
            
            // Step 5: Get final result (only if not already processed during challenge)
            if (!alreadyProcessed) {
                await performPostAuth();
            }
        }
        
    } catch (error) {
        console.error('Authentication error:', error);
        updateStatus(`Error: ${error.message}`, true);
    } finally {
        document.getElementById('startAuthBtn').disabled = false;
    }
}

// Pre-Authentication
export async function performPreAuth(cardNumber) {
    updateStep('step-preauth', 'active');
    updateStatus('Performing pre-authentication check...');
    
    const response = await fetch('/api/3ds/preauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            acctNumber: cardNumber
        })
    });
    
    const data = await response.json();
    addApiResponse('Pre-Authentication Response', data);
    
    if (!response.ok) {
        updateStep('step-preauth', 'error');
        
        // Check if it's a not enrolled response
        if (data.errorCode === '305' || (data.errorDescription && data.errorDescription.includes('not enrolled'))) {
            updateStatus('❌ Card not enrolled for 3D Secure', true);
            // Mark subsequent steps as not applicable
            updateStep('step-3dsmethod', 'error');
            updateStep('step-auth', 'error');
            updateStep('step-challenge', 'error');
            updateStep('step-postauth', 'error');
            // Return false to indicate flow should stop
            return false;
        }
        
        throw new Error(data.errorDescription || 'Pre-authentication failed');
    }
    
    setState('threeDSServerTransID', data.threeDSServerTransID);
    setState('threeDSMethodURL', data.threeDSMethodURL);
    setState('dsTransID', data.dsTransID);
    
    // Extract supported versions from pre-auth response
    let supportedVersions = [];
    if (data.acsProtocolVersions && Array.isArray(data.acsProtocolVersions)) {
        // Use the versions explicitly supported by the ACS
        supportedVersions = data.acsProtocolVersions.map(v => v.version);
        console.log('ACS Protocol Versions:', data.acsProtocolVersions);
    } else if (data.acsStartProtocolVersion && data.acsEndProtocolVersion) {
        // Fallback: Determine which versions are supported based on range
        const startParts = data.acsStartProtocolVersion.split('.').map(n => parseInt(n));
        const endParts = data.acsEndProtocolVersion.split('.').map(n => parseInt(n));
        
        const allVersions = ['2.1.0', '2.2.0', '2.3.1'];
        supportedVersions = allVersions.filter(v => {
            const vParts = v.split('.').map(n => parseInt(n));
            // Check if version is within range
            const afterStart = vParts[0] > startParts[0] || 
                              (vParts[0] === startParts[0] && vParts[1] > startParts[1]) ||
                              (vParts[0] === startParts[0] && vParts[1] === startParts[1] && vParts[2] >= startParts[2]);
            const beforeEnd = vParts[0] < endParts[0] || 
                             (vParts[0] === endParts[0] && vParts[1] < endParts[1]) ||
                             (vParts[0] === endParts[0] && vParts[1] === endParts[1] && vParts[2] <= endParts[2]);
            return afterStart && beforeEnd;
        });
    }
    
    setState('supportedVersions', supportedVersions);
    
    // Select appropriate version based on test card and ACS support
    if (supportedVersions.length > 0) {
        // Check if this is a test card with specific version requirements
        const lastFour = cardNumber.slice(-4);
        const firstDigit = lastFour[0];
        
        let requiredVersions = [];
        switch(firstDigit) {
            case '0': requiredVersions = ['2.1.0', '2.2.0', '2.3.1']; break;
            case '1': requiredVersions = ['2.1.0']; break;
            case '2': requiredVersions = ['2.2.0']; break;
            case '3': requiredVersions = ['2.3.1']; break;
            default: requiredVersions = supportedVersions;
        }
        
        // Find the highest version that is both required by the test card and supported by ACS
        const validVersions = supportedVersions.filter(v => requiredVersions.includes(v));
        
        let messageVersion;
        if (validVersions.length > 0) {
            messageVersion = validVersions[validVersions.length - 1];
        } else {
            // Fallback to highest supported version
            messageVersion = supportedVersions[supportedVersions.length - 1];
        }
        
        setState('messageVersion', messageVersion);
        console.log('ACS supported:', supportedVersions, 'Test requires:', requiredVersions, 'Selected:', messageVersion);
        updateStatus(`Pre-auth successful. Using version ${messageVersion}. Transaction ID: ${data.threeDSServerTransID}`);
    } else {
        // Default to 2.2.0 if no specific version info
        setState('messageVersion', '2.2.0');
        updateStatus(`Pre-auth successful. Using default version 2.2.0. Transaction ID: ${data.threeDSServerTransID}`);
    }
    
    updateStep('step-preauth', 'completed');
    return true; // Success
}