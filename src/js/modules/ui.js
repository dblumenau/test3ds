import { testPANs } from './constants.js';
import { parsePAN, updateStatus, updateStep } from './utils.js';
import { resetState, getStateValue, setState } from './state.js';
export { showTestCardReference, hideTestCardReference } from './ui-reference.js';

// Update test info display
export function updateTestInfo() {
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
        // Parse PAN to get supported versions
        const config = parsePAN(pan);
        const supportedVersions = config ? config.messageVersions : ['2.1.0', '2.2.0', '2.3.1'];
        
        testInfoDiv.innerHTML = `
            <h4>Test Information</h4>
            <p><strong>Description:</strong> ${testInfo.description}</p>
            <p class="expectation"><strong>Expected Behavior:</strong> ${testInfo.expectation}</p>
            <p class="version"><strong>Supported Versions:</strong> ${supportedVersions.join(', ')}</p>
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
export function getSelectedCardNumber() {
    const select = document.getElementById('cardNumber');
    if (select.value === 'custom') {
        return document.getElementById('customCardNumber').value;
    }
    return select.value;
}

// Populate dropdown with test cards
export function populateTestCardDropdown() {
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
export function resetDemo() {
    // Reset all global variables
    resetState();
    
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
}