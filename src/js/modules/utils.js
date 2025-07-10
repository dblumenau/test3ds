// Utility function to update step status
export function updateStep(stepId, status) {
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
export function updateStatus(message, isError = false) {
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
export function addApiResponse(title, data) {
    const responseDiv = document.getElementById('apiResponses');
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    
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
export function base64url(input) {
    const base64 = btoa(input);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Generate purchase date
export function generatePurchaseDate() {
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
export function parsePAN(pan) {
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