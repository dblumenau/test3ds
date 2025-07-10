// Test PAN Configuration
// Systematically covers all permutations from sandbox.rst
// Pattern: Last 4 digits ABCD where:
// A = Message version (0=all, 1=v2.1, 2=v2.2, 3=v2.3)
// B = 3DS Method (0=included, 1=none, 2=timeout)
// C = ARes outcome (0-6=frictionless, 7=challenge)
// D = Challenge type (0=auto-pass, 1=auto-fail, 2=manual) when C=7
const testPANs = {
    // Special case - Not enrolled
    '9000100111111111': {
        description: 'Not enrolled',
        expectation: 'Fails at pre-auth with not enrolled response',
        category: 'enrollment'
    },
    
    // === All Versions (0xxx) + 3DS Method included (x0xx) ===
    '4000100511110003': {
        description: 'All versions + 3DS Method + Frictionless Y',
        expectation: '3DS Method completes, then frictionless success',
        category: 'frictionless'
    },
    '4000100511110013': {
        description: 'All versions + 3DS Method + Frictionless N',
        expectation: '3DS Method completes, then frictionless failure',
        category: 'frictionless'
    },
    '4000100511110023': {
        description: 'All versions + 3DS Method + Frictionless A',
        expectation: '3DS Method completes, then frictionless attempted',
        category: 'frictionless'
    },
    '4000100511110033': {
        description: 'All versions + 3DS Method + Frictionless R',
        expectation: '3DS Method completes, then frictionless rejected',
        category: 'frictionless'
    },
    '4000100511110043': {
        description: 'All versions + 3DS Method + Frictionless I',
        expectation: '3DS Method completes, then frictionless info only (v2.2+)',
        category: 'frictionless'
    },
    '4000100511110053': {
        description: 'All versions + 3DS Method + Frictionless U',
        expectation: '3DS Method completes, then frictionless unable to auth',
        category: 'frictionless'
    },
    '4000100511110063': {
        description: 'All versions + 3DS Method + DS timeout',
        expectation: '3DS Method completes, then DS timeout error',
        category: 'error'
    },
    '4000100511110070': {
        description: 'All versions + 3DS Method + Challenge auto-pass',
        expectation: '3DS Method completes, challenge auto-passes with Y',
        category: 'challenge'
    },
    '4000100511110071': {
        description: 'All versions + 3DS Method + Challenge auto-fail',
        expectation: '3DS Method completes, challenge auto-fails with N',
        category: 'challenge'
    },
    '4000100511110072': {
        description: 'All versions + 3DS Method + Challenge manual',
        expectation: '3DS Method completes, requires manual challenge interaction',
        category: 'challenge'
    },
    
    // === All Versions (0xxx) + No 3DS Method (x1xx) ===
    '4000100511110103': {
        description: 'All versions + No 3DS Method + Frictionless Y',
        expectation: 'No 3DS Method, frictionless success',
        category: 'frictionless'
    },
    '4000100511110113': {
        description: 'All versions + No 3DS Method + Frictionless N',
        expectation: 'No 3DS Method, frictionless failure',
        category: 'frictionless'
    },
    '4000100511110123': {
        description: 'All versions + No 3DS Method + Frictionless A',
        expectation: 'No 3DS Method, frictionless attempted',
        category: 'frictionless'
    },
    '4000100511110133': {
        description: 'All versions + No 3DS Method + Frictionless R',
        expectation: 'No 3DS Method, frictionless rejected',
        category: 'frictionless'
    },
    '4000100511110143': {
        description: 'All versions + No 3DS Method + Frictionless I',
        expectation: 'No 3DS Method, frictionless info only (v2.2+)',
        category: 'frictionless'
    },
    '4000100511110153': {
        description: 'All versions + No 3DS Method + Frictionless U',
        expectation: 'No 3DS Method, frictionless unable to auth',
        category: 'frictionless'
    },
    '4000100511110163': {
        description: 'All versions + No 3DS Method + DS timeout',
        expectation: 'No 3DS Method, DS timeout error',
        category: 'error'
    },
    '4000100511110170': {
        description: 'All versions + No 3DS Method + Challenge auto-pass',
        expectation: 'No 3DS Method, challenge auto-passes with Y',
        category: 'challenge'
    },
    '4000100511110171': {
        description: 'All versions + No 3DS Method + Challenge auto-fail',
        expectation: 'No 3DS Method, challenge auto-fails with N',
        category: 'challenge'
    },
    '4000100511110172': {
        description: 'All versions + No 3DS Method + Challenge manual',
        expectation: 'No 3DS Method, requires manual challenge interaction',
        category: 'challenge'
    },
    
    // === All Versions (0xxx) + 3DS Method timeout (x2xx) ===
    '4000100511110203': {
        description: 'All versions + 3DS Method timeout + Frictionless Y',
        expectation: '3DS Method times out (10s), then frictionless success',
        category: 'frictionless'
    },
    '4000100511110213': {
        description: 'All versions + 3DS Method timeout + Frictionless N',
        expectation: '3DS Method times out (10s), then frictionless failure',
        category: 'frictionless'
    },
    '4000100511110223': {
        description: 'All versions + 3DS Method timeout + Frictionless A',
        expectation: '3DS Method times out (10s), then frictionless attempted',
        category: 'frictionless'
    },
    '4000100511110233': {
        description: 'All versions + 3DS Method timeout + Frictionless R',
        expectation: '3DS Method times out (10s), then frictionless rejected',
        category: 'frictionless'
    },
    '4000100511110243': {
        description: 'All versions + 3DS Method timeout + Frictionless I',
        expectation: '3DS Method times out (10s), then frictionless info only (v2.2+)',
        category: 'frictionless'
    },
    '4000100511110253': {
        description: 'All versions + 3DS Method timeout + Frictionless U',
        expectation: '3DS Method times out (10s), then frictionless unable to auth',
        category: 'frictionless'
    },
    '4000100511110263': {
        description: 'All versions + 3DS Method timeout + DS timeout',
        expectation: '3DS Method times out (10s), then DS timeout error',
        category: 'error'
    },
    '4000100511110270': {
        description: 'All versions + 3DS Method timeout + Challenge auto-pass',
        expectation: '3DS Method times out (10s), challenge auto-passes with Y',
        category: 'challenge'
    },
    '4000100511110271': {
        description: 'All versions + 3DS Method timeout + Challenge auto-fail',
        expectation: '3DS Method times out (10s), challenge auto-fails with N',
        category: 'challenge'
    },
    '4000100511110272': {
        description: 'All versions + 3DS Method timeout + Challenge manual',
        expectation: '3DS Method times out (10s), requires manual challenge interaction',
        category: 'challenge'
    },
    
    // === Version 2.1 only (1xxx) ===
    '4000100511111003': {
        description: 'v2.1 only + 3DS Method + Frictionless Y',
        expectation: 'v2.1 only, 3DS Method completes, frictionless success',
        category: 'version-specific'
    },
    '4000100511111013': {
        description: 'v2.1 only + 3DS Method + Frictionless N',
        expectation: 'v2.1 only, 3DS Method completes, frictionless failure',
        category: 'version-specific'
    },
    '4000100511111070': {
        description: 'v2.1 only + 3DS Method + Challenge auto-pass',
        expectation: 'v2.1 only, 3DS Method completes, challenge auto-passes',
        category: 'version-specific'
    },
    '4000100511111071': {
        description: 'v2.1 only + 3DS Method + Challenge auto-fail',
        expectation: 'v2.1 only, 3DS Method completes, challenge auto-fails',
        category: 'version-specific'
    },
    '4000100511111072': {
        description: 'v2.1 only + 3DS Method + Challenge manual',
        expectation: 'v2.1 only, 3DS Method completes, manual challenge required',
        category: 'version-specific'
    },
    '4000100511111103': {
        description: 'v2.1 only + No 3DS Method + Frictionless Y',
        expectation: 'v2.1 only, no 3DS Method, frictionless success',
        category: 'version-specific'
    },
    '4000100511111172': {
        description: 'v2.1 only + No 3DS Method + Challenge manual',
        expectation: 'v2.1 only, no 3DS Method, manual challenge required',
        category: 'version-specific'
    },
    '4000100511111203': {
        description: 'v2.1 only + 3DS Method timeout + Frictionless Y',
        expectation: 'v2.1 only, 3DS Method times out, frictionless success',
        category: 'version-specific'
    },
    '4000100511111272': {
        description: 'v2.1 only + 3DS Method timeout + Challenge manual',
        expectation: 'v2.1 only, 3DS Method times out, manual challenge required',
        category: 'version-specific'
    },
    
    // === Version 2.2 only (2xxx) ===
    '4000100511112003': {
        description: 'v2.2 only + 3DS Method + Frictionless Y',
        expectation: 'v2.2 only, 3DS Method completes, frictionless success',
        category: 'version-specific',
        isDocumented: true  // This is a documented example
    },
    '4000100511112013': {
        description: 'v2.2 only + 3DS Method + Frictionless N',
        expectation: 'v2.2 only, 3DS Method completes, frictionless failure',
        category: 'version-specific'
    },
    '4000100511112043': {
        description: 'v2.2 only + 3DS Method + Frictionless I',
        expectation: 'v2.2 only, 3DS Method completes, info only status',
        category: 'version-specific'
    },
    '4000100511112070': {
        description: 'v2.2 only + 3DS Method + Challenge auto-pass',
        expectation: 'v2.2 only, 3DS Method completes, challenge auto-passes',
        category: 'version-specific'
    },
    '4000100511112071': {
        description: 'v2.2 only + 3DS Method + Challenge auto-fail',
        expectation: 'v2.2 only, 3DS Method completes, challenge auto-fails',
        category: 'version-specific'
    },
    '4000100511112072': {
        description: 'v2.2 only + 3DS Method + Challenge manual',
        expectation: 'v2.2 only, 3DS Method completes, manual challenge required',
        category: 'version-specific'
    },
    '4000100511112103': {
        description: 'v2.2 only + No 3DS Method + Frictionless Y',
        expectation: 'v2.2 only, no 3DS Method, frictionless success',
        category: 'version-specific'
    },
    '4000100511112143': {
        description: 'v2.2 only + No 3DS Method + Frictionless I',
        expectation: 'v2.2 only, no 3DS Method, info only status',
        category: 'version-specific'
    },
    '4000100511112172': {
        description: 'v2.2 only + No 3DS Method + Challenge manual',
        expectation: 'v2.2 only, no 3DS Method, manual challenge required',
        category: 'version-specific'
    },
    '4000100511112203': {
        description: 'v2.2 only + 3DS Method timeout + Frictionless Y',
        expectation: 'v2.2 only, 3DS Method times out, frictionless success',
        category: 'version-specific'
    },
    '4000100511112243': {
        description: 'v2.2 only + 3DS Method timeout + Frictionless I',
        expectation: 'v2.2 only, 3DS Method times out, info only status',
        category: 'version-specific'
    },
    '4000100511112272': {
        description: 'v2.2 only + 3DS Method timeout + Challenge manual',
        expectation: 'v2.2 only, 3DS Method times out, manual challenge required',
        category: 'version-specific'
    },
    
    // === Version 2.3 only (3xxx) ===
    '4000100511113003': {
        description: 'v2.3 only + 3DS Method + Frictionless Y',
        expectation: 'v2.3.1 only, 3DS Method completes, frictionless success',
        category: 'version-specific'
    },
    '4000100511113070': {
        description: 'v2.3 only + 3DS Method + Challenge auto-pass',
        expectation: 'v2.3.1 only, 3DS Method completes, challenge auto-passes',
        category: 'version-specific'
    },
    '4000100511113172': {
        description: 'v2.3 only + No 3DS Method + Challenge manual',
        expectation: 'v2.3.1 only, no 3DS Method, manual challenge required',
        category: 'version-specific'
    },
    
    // === Documented examples from sandbox.rst ===
    '5000100411110203': {
        description: 'EXAMPLE: 3DS Method timeout v2.1-2.2',
        expectation: '3DS Method times out, then frictionless success (Y)',
        category: 'documented-example',
        isDocumented: true
    },
    '6000100611111103': {
        description: 'EXAMPLE: Frictionless no 3DS Method v2.1',
        expectation: 'No 3DS Method, frictionless success (Y)',
        category: 'documented-example',
        isDocumented: true
    },
    '3000100811111072': {
        description: 'EXAMPLE: Manual challenge v2.1',
        expectation: '3DS Method completes, manual challenge interaction required',
        category: 'documented-example',
        isDocumented: true
    },
    '7000100911112070': {
        description: 'EXAMPLE: Auto challenge pass v2.2',
        expectation: '3DS Method completes, challenge auto-passes with Y',
        category: 'documented-example',
        isDocumented: true
    },
    '3000101011111071': {
        description: 'EXAMPLE: Auto challenge fail v2.1',
        expectation: '3DS Method completes, challenge auto-fails with N',
        category: 'documented-example',
        isDocumented: true
    }
};

// Global variables
let threeDSServerTransID = null;
let acsTransID = null;
let acsURL = null;
let threeDSMethodURL = null;
let dsTransID = null;
let messageVersion = '2.1.0';
let supportedVersions = [];

// Utility function to update step status
function updateStep(stepId, status) {
    const step = document.getElementById(stepId);
    // Remove all status classes
    step.classList.remove('active', 'completed', 'error', 'bg-3ds-primary', 'text-white', 'shadow-md', 'scale-105', 'bg-3ds-success', 'bg-3ds-danger');
    
    // Add base step class
    step.classList.add('step');
    
    // Add status-specific classes
    if (status === 'active') {
        step.classList.add('active', 'bg-3ds-primary', 'text-white', 'shadow-md', 'scale-105');
    } else if (status === 'completed') {
        step.classList.add('completed', 'bg-3ds-success', 'text-white');
    } else if (status === 'error') {
        step.classList.add('error', 'bg-3ds-danger', 'text-white');
    }
}

// Utility function to update status message
function updateStatus(message, isError = false) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    
    // Remove any existing color classes
    statusDiv.classList.remove('bg-gray-100', 'text-gray-900', 'bg-red-50', 'text-red-900', 'bg-gray-800', 'text-gray-300', 'bg-red-900/30', 'text-red-400');
    
    if (isError) {
        statusDiv.classList.add('bg-red-900/30', 'text-red-400');
    } else {
        statusDiv.classList.add('bg-gray-800', 'text-gray-300');
    }
}

// Utility function to add API response
function addApiResponse(title, data) {
    const responseDiv = document.getElementById('apiResponses');
    const timestamp = new Date().toLocaleTimeString();
    
    // Format the JSON with proper indentation
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a container for the timestamp and title
    const entryContainer = document.createElement('div');
    entryContainer.className = 'mb-4';
    
    // Add timestamp and title
    const header = document.createElement('div');
    header.className = 'text-sm text-gray-400 mb-1';
    header.textContent = `[${timestamp}] ${title}`;
    entryContainer.appendChild(header);
    
    // Create pre/code elements for syntax highlighting
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-json';
    code.textContent = jsonString;
    pre.appendChild(code);
    
    // Apply syntax highlighting
    hljs.highlightElement(code);
    
    // Add the highlighted code to the container
    entryContainer.appendChild(pre);
    
    // Check if this is the first response
    if (responseDiv.innerHTML.includes('<em>API responses will appear here...</em>')) {
        responseDiv.innerHTML = '';
    }
    
    // Append the new entry
    responseDiv.appendChild(entryContainer);
    
    // Auto-scroll to the bottom to show the latest message
    responseDiv.scrollTop = responseDiv.scrollHeight;
}

// Base64 URL encoding function
function base64url(input) {
    const base64 = btoa(input);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Generate purchase date
function generatePurchaseDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return year + month + day + hours + minutes + seconds;
}

// Parse PAN to determine test behavior
function parsePAN(pan) {
    if (pan.length < 4) return null;
    
    const lastFour = pan.slice(-4);
    const digits = lastFour.split('').map(d => parseInt(d));
    
    const config = {
        messageVersions: [],
        threeDSMethod: 'none',
        outcome: 'unknown',
        challengeType: null
    };
    
    // 1st digit - Message version
    switch(digits[0]) {
        case 0: config.messageVersions = ['2.1.0', '2.2.0', '2.3.1']; break;
        case 1: config.messageVersions = ['2.1.0']; break;
        case 2: config.messageVersions = ['2.2.0']; break;
        case 3: config.messageVersions = ['2.3.1']; break;
    }
    
    // 2nd digit - 3DS Method
    switch(digits[1]) {
        case 0: config.threeDSMethod = 'included'; break;
        case 1: config.threeDSMethod = 'none'; break;
        case 2: config.threeDSMethod = 'timeout'; break;
    }
    
    // 3rd digit - ARes outcome
    switch(digits[2]) {
        case 0: config.outcome = 'frictionless-y'; break;
        case 1: config.outcome = 'frictionless-n'; break;
        case 2: config.outcome = 'frictionless-a'; break;
        case 3: config.outcome = 'frictionless-r'; break;
        case 4: config.outcome = 'frictionless-i'; break;
        case 5: config.outcome = 'frictionless-u'; break;
        case 6: config.outcome = 'ds-timeout'; break;
        case 7: config.outcome = 'challenge'; break;
    }
    
    // 4th digit - Challenge type (if 3rd digit is 7)
    if (digits[2] === 7) {
        switch(digits[3]) {
            case 0: config.challengeType = 'auto-pass'; break;
            case 1: config.challengeType = 'auto-fail'; break;
            case 2: config.challengeType = 'manual'; break;
        }
    }
    
    return config;
}

// Update test info display
function updateTestInfo() {
    const select = document.getElementById('cardNumber');
    const customInput = document.getElementById('customCardNumber');
    const testInfoDiv = document.getElementById('testInfo');
    
    if (select.value === 'custom') {
        customInput.classList.remove('hidden');
        testInfoDiv.innerHTML = '<p>Enter a custom test PAN above. The last 4 digits determine the test behavior.</p>';
        return;
    } else {
        customInput.classList.add('hidden');
    }
    
    const pan = select.value;
    const testInfo = testPANs[pan];
    
    if (testInfo) {
        testInfoDiv.innerHTML = `
            <h4>Test Information</h4>
            <p><strong>Description:</strong> ${testInfo.description}</p>
            <p class="expectation"><strong>Expected Behavior:</strong> ${testInfo.expectation}</p>
            <p class="version"><strong>Supported Versions:</strong> ${testInfo.supportedVersions.join(', ')}</p>
        `;
    } else {
        // Parse PAN for custom configuration
        const config = parsePAN(pan);
        if (config) {
            let expectation = 'Based on PAN pattern: ';
            if (config.outcome === 'challenge' && config.challengeType) {
                expectation += `Challenge (${config.challengeType})`;
            } else {
                expectation += config.outcome.replace('-', ' ');
            }
            
            testInfoDiv.innerHTML = `
                <h4>Test Configuration (Auto-detected)</h4>
                <p class="expectation"><strong>Expected Behavior:</strong> ${expectation}</p>
                <p class="version"><strong>Message Versions:</strong> ${config.messageVersions.join(', ')}</p>
                <p><strong>3DS Method:</strong> ${config.threeDSMethod}</p>
            `;
        }
    }
}

// Get selected card number
function getSelectedCardNumber() {
    const select = document.getElementById('cardNumber');
    if (select.value === 'custom') {
        return document.getElementById('customCardNumber').value;
    }
    return select.value;
}

// Main authentication flow
async function startAuthentication() {
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
    threeDSServerTransID = null;
    acsTransID = null;
    acsURL = null;
    threeDSMethodURL = null;
    dsTransID = null;
    messageVersion = '2.1.0';
    supportedVersions = [];
    threeDSMethodCompleted = false;
    
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
        if (threeDSMethodURL) {
            await perform3DSMethod();
        } else {
            updateStep('step-3dsmethod', 'completed');
            updateStatus('No 3DS Method URL provided, skipping...');
        }
        
        // Step 3: Authentication
        await performAuth(cardNumber);
        
        // Step 4: Handle Challenge (if required)
        if (acsURL) {
            await performChallenge();
            
            // Step 5: Get final result
            await performPostAuth();
        }
        
    } catch (error) {
        console.error('Authentication error:', error);
        updateStatus(`Error: ${error.message}`, true);
    } finally {
        document.getElementById('startAuthBtn').disabled = false;
    }
}

// Pre-Authentication
async function performPreAuth(cardNumber) {
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
    
    threeDSServerTransID = data.threeDSServerTransID;
    threeDSMethodURL = data.threeDSMethodURL;
    dsTransID = data.dsTransID;
    
    // Extract supported versions from pre-auth response
    supportedVersions = [];
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
    
    // Select appropriate version based on test card and ACS support
    if (supportedVersions.length > 0) {
        // Check if this is a test card with specific version requirements
        const cardNumber = getSelectedCardNumber();
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
        
        if (validVersions.length > 0) {
            messageVersion = validVersions[validVersions.length - 1];
        } else {
            // Fallback to highest supported version
            messageVersion = supportedVersions[supportedVersions.length - 1];
        }
        
        console.log('ACS supported:', supportedVersions, 'Test requires:', requiredVersions, 'Selected:', messageVersion);
        updateStatus(`Pre-auth successful. Using version ${messageVersion}. Transaction ID: ${threeDSServerTransID}`);
    } else {
        // Default to 2.2.0 if no specific version info
        messageVersion = '2.2.0';
        updateStatus(`Pre-auth successful. Using default version ${messageVersion}. Transaction ID: ${threeDSServerTransID}`);
    }
    
    updateStep('step-preauth', 'completed');
    return true; // Success
}

// Global variable to track 3DS Method completion
let threeDSMethodCompleted = false;

// 3DS Method
async function perform3DSMethod() {
    updateStep('step-3dsmethod', 'active');
    updateStatus('Performing 3DS Method...');
    threeDSMethodCompleted = false;
    
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
                threeDSMethodCompleted = true;
                resolve();
            }
        };
        
        // Set up completion handler
        window.addEventListener('message', methodComplete);
        
        // Create 3DS Method data
        const methodData = {
            threeDSServerTransID: threeDSServerTransID,
            threeDSMethodNotificationURL: 'http://echo.localhost/echo/3ds-method-notification'
        };
        
        // Base64 URL encode the data
        const encodedData = base64url(JSON.stringify(methodData));
        document.getElementById('threeDSMethodData').value = encodedData;
        
        // Submit form to iframe
        const form = document.getElementById('threeDSMethodForm');
        form.action = threeDSMethodURL;
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
                threeDSMethodCompleted = false; // Mark as not completed
                resolve();
            }
        }, timeout);
    });
}

// Authentication Request
async function performAuth(cardNumber) {
    // Guard: Don't proceed without a valid transaction ID
    if (!threeDSServerTransID) {
        console.error('Cannot perform auth without threeDSServerTransID');
        return;
    }
    
    updateStep('step-auth', 'active');
    updateStatus('Sending authentication request...');
    
    const authData = {
        threeDSServerTransID: threeDSServerTransID,
        acctNumber: cardNumber,
        cardExpiryDate: "2410",
        acquirerBIN: "123456",
        acquirerMerchantID: "merchant123456",
        mcc: "5411",
        merchantCountryCode: "840",
        merchantName: "Test Merchant",
        messageType: "AReq",
        messageVersion: messageVersion,
        messageCategory: "01",
        deviceChannel: "02",
        threeDSCompInd: threeDSMethodURL ? (threeDSMethodCompleted ? "Y" : "N") : "U",
        threeDSRequestorURL: "https://merchant.example.com",
        threeDSRequestorAuthenticationInd: "01",
        threeDSRequestorChallengeInd: "03",
        browserAcceptHeader: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        browserIP: "192.168.1.11",
        browserJavaEnabled: true,
        browserJavascriptEnabled: true,
        browserLanguage: "en-US",
        browserColorDepth: "24",
        browserScreenHeight: "1080",
        browserScreenWidth: "1920",
        browserTZ: "-300",
        browserUserAgent: navigator.userAgent,
        notificationURL: "http://echo.localhost/echo/notification",
        transType: "01",
        purchaseAmount: "10000",
        purchaseCurrency: "840",
        purchaseExponent: "2",
        purchaseDate: generatePurchaseDate(),
        cardholderName: "Test Cardholder",
        email: "test@example.com",
        mobilePhone: {
            cc: "1",
            subscriber: "2125551234"
        },
        billAddrCity: "New York",
        billAddrCountry: "840",
        billAddrLine1: "123 Main Street",
        billAddrPostCode: "10001",
        billAddrState: "NY"
    };
    
    const response = await fetch('/api/3ds/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    });
    
    const data = await response.json();
    addApiResponse('Authentication Response', data);
    
    if (!response.ok) {
        updateStep('step-auth', 'error');
        
        // Check for DS timeout
        if (data.errorCode === '402' || (data.errorDescription && data.errorDescription.includes('timeout'))) {
            updateStatus('DS timeout occurred', true);
            updateStep('step-challenge', 'error');
            updateStep('step-postauth', 'error');
            return;
        }
        
        // Check if this is related to not enrolled card
        if (data.errorCode === '301' && data.errorDescription && data.errorDescription.includes('No transaction found')) {
            // This happens when auth is called without a valid pre-auth transaction
            // Don't update status as it should already show not enrolled message
            return;
        }
        
        // Check for JSON validation errors
        if (data.errorCode === '203' && data.errorDescription === 'Invalid JSON') {
            updateStatus(`❌ Authentication failed: ${data.errorDetail || 'Invalid request format'}`, true);
            updateStep('step-challenge', 'error');
            updateStep('step-postauth', 'error');
            return;
        }
        
        // Check for invalid ThreeDSCompInd error
        if (data.errorCode === '305' && data.errorDescription === 'Invalid ThreeDSCompInd') {
            updateStatus(`❌ Authentication failed: ${data.errorDetail || data.errorDescription}`, true);
            updateStep('step-challenge', 'error');
            updateStep('step-postauth', 'error');
            return;
        }
        
        // Check for unsupported message version error
        if (data.errorCode === '102' && data.errorDescription === 'Unsupported message version') {
            updateStatus(`❌ Authentication failed: ${data.errorDetail || data.errorDescription}`, true);
            updateStep('step-challenge', 'error');
            updateStep('step-postauth', 'error');
            return;
        }
        
        throw new Error(data.errorDescription || 'Authentication failed');
    }
    
    if (data.transStatus === 'C') {
        // Challenge required
        acsURL = data.acsURL;
        acsTransID = data.acsTransID;
        updateStep('step-auth', 'completed');
        updateStatus('Authentication requires challenge');
    } else {
        // Frictionless flow
        updateStep('step-auth', 'completed');
        updateStep('step-challenge', 'completed');
        updateStep('step-postauth', 'completed');
        
        // Update status based on transaction status
        let statusMessage = '';
        let isError = false;
        
        switch(data.transStatus) {
            case 'Y':
                statusMessage = '✅ Frictionless authentication successful';
                break;
            case 'N':
                statusMessage = '❌ Frictionless authentication failed';
                isError = true;
                break;
            case 'A':
                statusMessage = '⚠️ Authentication attempted';
                break;
            case 'R':
                statusMessage = '🚫 Authentication rejected';
                isError = true;
                break;
            case 'I':
                statusMessage = 'ℹ️ Information only (v2.2+)';
                break;
            case 'U':
                statusMessage = '❓ Unable to authenticate';
                break;
            default:
                statusMessage = `Authentication completed with status: ${data.transStatus}`;
        }
        
        updateStatus(statusMessage, isError);
    }
}

// Challenge Flow
async function performChallenge() {
    updateStep('step-challenge', 'active');
    updateStatus('Starting challenge flow...');
    
    // Show the challenge iframe and hide placeholder
    document.getElementById('challengePlaceholder').classList.add('hidden');
    document.getElementById('challengeIframe').classList.remove('hidden');
    
    // Create CReq data
    const creqData = {
        threeDSServerTransID: threeDSServerTransID,
        acsTransID: acsTransID,
        messageVersion: messageVersion,
        messageType: "CReq",
        challengeWindowSize: "05"
    };
    
    // Base64 URL encode the CReq
    const encodedCreq = base64url(JSON.stringify(creqData));
    document.getElementById('creqData').value = encodedCreq;
    
    // Submit challenge form to iframe
    const form = document.getElementById('challengeForm');
    form.action = acsURL;
    form.target = 'challengeIframe';
    form.method = 'POST';
    form.submit();
    
    updateStatus('Challenge submitted. Please complete the challenge in the iframe below.');
    
    // For manual challenge (card ending in 72), user must interact
    // We'll need to wait for completion
    return new Promise((resolve) => {
        // Check periodically for completion
        window.activeCheckInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/3ds/postauth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        threeDSServerTransID: threeDSServerTransID
                    })
                });
                
                const data = await response.json();
                
                if (data.messageType === 'RReq') {
                    // Challenge completed
                    clearInterval(window.activeCheckInterval);
                    window.activeCheckInterval = null;
                    updateStep('step-challenge', 'completed');
                    updateStatus('Challenge completed successfully');
                    resolve();
                }
            } catch (error) {
                // Still waiting for completion
            }
        }, 2000); // Check every 2 seconds
        
        // Timeout after 5 minutes
        setTimeout(() => {
            if (window.activeCheckInterval) {
                clearInterval(window.activeCheckInterval);
                window.activeCheckInterval = null;
            }
            updateStep('step-challenge', 'error');
            updateStatus('Challenge timed out', true);
            resolve();
        }, 300000);
    });
}

// Post-Authentication
async function performPostAuth() {
    updateStep('step-postauth', 'active');
    updateStatus('Retrieving final authentication result...');
    
    const response = await fetch('/api/3ds/postauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            threeDSServerTransID: threeDSServerTransID
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

// Populate dropdown with test cards
function populateTestCardDropdown() {
    const select = document.getElementById('cardNumber');
    
    // Clear existing options
    select.innerHTML = '';
    
    // Group test cards by category
    const categories = {};
    Object.entries(testPANs).forEach(([pan, info]) => {
        if (!categories[info.category]) {
            categories[info.category] = [];
        }
        categories[info.category].push({ pan, ...info });
    });
    
    // Define category order and labels
    const categoryOrder = [
        { key: 'enrollment', label: 'Enrollment Tests' },
        { key: 'frictionless', label: 'Frictionless Flows' },
        { key: 'challenge', label: 'Challenge Flows' },
        { key: 'error', label: 'Error Cases' },
        { key: 'version-specific', label: 'Version Specific Tests' },
        { key: 'documented-example', label: 'Documented Examples' }
    ];
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a test card...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Create optgroups for each category
    categoryOrder.forEach(({ key, label }) => {
        if (categories[key] && categories[key].length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = label;
            
            // Sort cards within category
            categories[key].sort((a, b) => a.pan.localeCompare(b.pan));
            
            categories[key].forEach(card => {
                const option = document.createElement('option');
                option.value = card.pan;
                
                // Create concise label showing key pattern info
                const lastFour = card.pan.slice(-4);
                let label = `${card.pan} - ${card.description}`;
                
                // Add checkmark for documented examples
                if (card.isDocumented) {
                    label += ' ✓';
                }
                
                option.textContent = label;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        }
    });
    
    // Add custom PAN option at the end
    const customOptgroup = document.createElement('optgroup');
    customOptgroup.label = 'Custom Test Configuration';
    
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Enter custom PAN...';
    customOptgroup.appendChild(customOption);
    
    select.appendChild(customOptgroup);
}

// Reset demo function
function resetDemo() {
    // Reset all global variables
    threeDSServerTransID = null;
    acsTransID = null;
    acsURL = null;
    threeDSMethodURL = null;
    dsTransID = null;
    messageVersion = '2.1.0';
    supportedVersions = [];
    threeDSMethodCompleted = false;
    
    // Reset all step indicators to default state
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed', 'error', 'bg-3ds-primary', 'text-white', 'shadow-md', 'scale-105', 'bg-3ds-success', 'bg-3ds-danger');
        step.classList.add('step');
    });
    
    // Clear API responses log
    document.getElementById('apiResponses').innerHTML = '<em>API responses will appear here...</em>';
    
    // Reset status message
    updateStatus('Ready to start authentication...');
    
    // Hide and clear challenge iframe
    document.getElementById('challengePlaceholder').classList.remove('hidden');
    document.getElementById('challengeIframe').classList.add('hidden');
    document.getElementById('challengeIframe').src = 'about:blank';
    
    // Reset dropdown to default selection
    const select = document.getElementById('cardNumber');
    if (select.options.length > 0) {
        select.selectedIndex = 0; // Select the default "Select a test card..." option
    }
    
    // Hide custom card input if it was visible
    document.getElementById('customCardNumber').classList.add('hidden');
    document.getElementById('customCardNumber').value = '';
    
    // Clear test info
    document.getElementById('testInfo').innerHTML = '';
    
    // Re-enable the start button if it was disabled
    document.getElementById('startAuthBtn').disabled = false;
    
    // Clear any active intervals/timeouts that might be running
    // Note: This is a safeguard - proper cleanup should happen in the authentication flow
    if (window.activeCheckInterval) {
        clearInterval(window.activeCheckInterval);
        window.activeCheckInterval = null;
    }
}

// Show test card reference modal
function showTestCardReference() {
    const modal = document.getElementById('testCardModal');
    const content = document.getElementById('testCardReferenceContent');
    
    // Build the reference table content
    content.innerHTML = `
        <div class="mb-6">
            <h4 class="text-lg font-semibold mb-2">🎭 Understanding Test Card Patterns</h4>
            <p class="text-gray-600 mb-4">
                Test cards use the last 4 digits to control behavior. Each digit has a specific meaning:
            </p>
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="pattern-digit">1st</div>
                    <h5 class="font-semibold mt-2">Version</h5>
                    <ul class="text-sm text-gray-600 mt-1">
                        <li><strong>0:</strong> All versions</li>
                        <li><strong>1:</strong> v2.1 only</li>
                        <li><strong>2:</strong> v2.2 only</li>
                        <li><strong>3:</strong> v2.3 only</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="pattern-digit">2nd</div>
                    <h5 class="font-semibold mt-2">3DS Method</h5>
                    <ul class="text-sm text-gray-600 mt-1">
                        <li><strong>0:</strong> ✅ Included</li>
                        <li><strong>1:</strong> ❌ None</li>
                        <li><strong>2:</strong> ⏱️ Timeout</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="pattern-digit">3rd</div>
                    <h5 class="font-semibold mt-2">Outcome</h5>
                    <ul class="text-sm text-gray-600 mt-1">
                        <li><strong>0-6:</strong> Frictionless</li>
                        <li><strong>7:</strong> 🎯 Challenge</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="pattern-digit">4th</div>
                    <h5 class="font-semibold mt-2">Challenge Type</h5>
                    <p class="text-sm text-gray-600 mt-1">(When 3rd = 7)</p>
                    <ul class="text-sm text-gray-600">
                        <li><strong>0:</strong> 🤖 Auto-pass</li>
                        <li><strong>1:</strong> 🚫 Auto-fail</li>
                        <li><strong>2:</strong> 👆 Manual</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3">📦 Frictionless Flow Outcomes</h4>
            <table class="reference-table">
                <thead>
                    <tr>
                        <th class="w-20">Pattern</th>
                        <th class="w-24">Status</th>
                        <th>Description</th>
                        <th class="w-32">Example PAN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>xx0x</code></td>
                        <td><span class="outcome-badge outcome-success">✅ Success (Y)</span></td>
                        <td>Authentication successful - Transaction approved</td>
                        <td><code>...0003</code></td>
                    </tr>
                    <tr>
                        <td><code>xx1x</code></td>
                        <td><span class="outcome-badge outcome-failure">❌ Failed (N)</span></td>
                        <td>Authentication failed - Transaction denied</td>
                        <td><code>...0013</code></td>
                    </tr>
                    <tr>
                        <td><code>xx2x</code></td>
                        <td><span class="outcome-badge outcome-warning">⚠️ Attempted (A)</span></td>
                        <td>Authentication attempted but not completed</td>
                        <td><code>...0023</code></td>
                    </tr>
                    <tr>
                        <td><code>xx3x</code></td>
                        <td><span class="outcome-badge outcome-failure">🚫 Rejected (R)</span></td>
                        <td>Authentication rejected by issuer</td>
                        <td><code>...0033</code></td>
                    </tr>
                    <tr>
                        <td><code>xx4x</code></td>
                        <td><span class="outcome-badge outcome-info">ℹ️ Info Only (I)</span></td>
                        <td>Informational only (v2.2+ required)</td>
                        <td><code>...0043</code></td>
                    </tr>
                    <tr>
                        <td><code>xx5x</code></td>
                        <td><span class="outcome-badge outcome-warning">❓ Unable (U)</span></td>
                        <td>Unable to authenticate</td>
                        <td><code>...0053</code></td>
                    </tr>
                    <tr>
                        <td><code>xx6x</code></td>
                        <td><span class="outcome-badge outcome-error">🕒 DS Timeout</span></td>
                        <td>Directory Server timeout error</td>
                        <td><code>...0063</code></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3">🎯 Challenge Flow Types</h4>
            <table class="reference-table">
                <thead>
                    <tr>
                        <th class="w-20">Pattern</th>
                        <th class="w-32">Type</th>
                        <th>Description</th>
                        <th class="w-32">Example PAN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>xx70</code></td>
                        <td><span class="outcome-badge outcome-success">🤖 Auto-Pass</span></td>
                        <td>Challenge automatically completes with success - No user action needed</td>
                        <td><code>...0070</code></td>
                    </tr>
                    <tr>
                        <td><code>xx71</code></td>
                        <td><span class="outcome-badge outcome-failure">🚫 Auto-Fail</span></td>
                        <td>Challenge automatically fails - Simulates authentication failure</td>
                        <td><code>...0071</code></td>
                    </tr>
                    <tr>
                        <td><code>xx72</code></td>
                        <td><span class="outcome-badge outcome-info">👆 Manual</span></td>
                        <td>Requires user interaction - Click checkbox to complete</td>
                        <td><code>...0072</code></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3">🌟 Special Test Cases</h4>
            <table class="reference-table">
                <thead>
                    <tr>
                        <th>Test Card</th>
                        <th>Description</th>
                        <th>Expected Behavior</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>9000100111111111</code></td>
                        <td><span class="outcome-badge outcome-error">🚫 Not Enrolled</span></td>
                        <td>Card is not enrolled for 3D Secure - Fails at pre-authentication</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg">
            <h5 class="font-semibold text-blue-900 mb-2">💡 Pro Tips</h5>
            <ul class="text-sm text-blue-800 space-y-1">
                <li>• Use <strong>0xxx</strong> patterns to test with all supported versions</li>
                <li>• Use <strong>x2xx</strong> patterns to test 3DS Method timeout scenarios (10s delay)</li>
                <li>• Use <strong>xx72</strong> patterns for manual challenge testing with user interaction</li>
                <li>• The "I" status (Information Only) requires v2.2 or higher to work properly</li>
                <li>• Custom PANs follow the same pattern rules - experiment freely!</li>
            </ul>
        </div>
    `;
    
    // Show the modal
    modal.classList.remove('hidden');
}

// Hide test card reference modal
function hideTestCardReference() {
    const modal = document.getElementById('testCardModal');
    modal.classList.add('hidden');
}

// Initialize on page load
window.addEventListener('load', () => {
    populateTestCardDropdown();
    updateStatus('Ready to start authentication...');
    updateTestInfo();
});