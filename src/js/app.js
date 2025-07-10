import { populateTestCardDropdown, updateTestInfo, resetDemo, showTestCardReference, hideTestCardReference } from './modules/ui.js';
import { updateStatus } from './modules/utils.js';
import { startAuthentication } from './modules/auth-flow.js';

// Initialize on page load
window.addEventListener('load', () => {
    populateTestCardDropdown();
    
    // Auto-select the manual challenge test card
    const select = document.getElementById('cardNumber');
    select.value = '4000100511110072';
    
    updateStatus('Ready to start authentication...');
    updateTestInfo();
});

// Expose functions to global scope for HTML event handlers
window.updateTestInfo = updateTestInfo;
window.startAuthentication = startAuthentication;
window.resetDemo = resetDemo;
window.showTestCardReference = showTestCardReference;
window.hideTestCardReference = hideTestCardReference;