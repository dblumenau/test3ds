import { updateStep, updateStatus, addApiResponse, generatePurchaseDate } from './utils.js';
import { getState, setState, getStateValue } from './state.js';
export { performChallenge, performPostAuth } from './auth-challenge.js';

// Authentication Request
export async function performAuth(cardNumber) {
    // Guard: Don't proceed without a valid transaction ID
    if (!getStateValue('threeDSServerTransID')) {
        console.error('Cannot perform auth without threeDSServerTransID');
        return;
    }
    
    updateStep('step-auth', 'active');
    updateStatus('Sending authentication request...');
    
    // Use echo.localhost for notification URL (webhook.site causes issues with browser redirects)
    const notificationURL = "http://echo.localhost/echo/notification";
    
    const authData = {
        threeDSServerTransID: getStateValue('threeDSServerTransID'),
        acctNumber: cardNumber,
        // cardExpiryDate: "2410", // Optional - already commented
        acquirerBIN: "123456", // Required for messageCategory 01
        acquirerMerchantID: "merchant123456", // Required for messageCategory 01
        mcc: "5411", // Required for messageCategory 01
        merchantCountryCode: "840", // Required for messageCategory 01
        merchantName: "Test Merchant", // Required for messageCategory 01
        messageType: "AReq",
        messageVersion: getStateValue('messageVersion'),
        messageCategory: "01",
        deviceChannel: "02",
        threeDSCompInd: getStateValue('threeDSMethodURL') ? 
            (getStateValue('threeDSMethodCompleted') ? "Y" : "N") : "U", // Proper conditional logic
        threeDSRequestorURL: "https://merchant.example.com",
        threeDSRequestorAuthenticationInd: "01",
        threeDSRequestorChallengeInd: "03",
        browserAcceptHeader: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        browserIP: "192.168.1.11", // Optional but recommended for risk assessment
        browserJavaEnabled: true,
        browserJavascriptEnabled: true,
        browserLanguage: "en-US",
        browserColorDepth: "24",
        browserScreenHeight: "1080",
        browserScreenWidth: "1920",
        browserTZ: "-300",
        browserUserAgent: navigator.userAgent,
        notificationURL: notificationURL,
        transType: "01",
        purchaseAmount: "0",
        purchaseCurrency: "208",
        purchaseExponent: "2",
        purchaseDate: generatePurchaseDate(),
        // cardholderName: "Test Cardholder", // Optional - commented for testing
        // email: "test@example.com", // Optional - commented for testing
        // mobilePhone: { // Optional - commented for testing
        //     cc: "1",
        //     subscriber: "2125551234"
        // },
        // billAddrCity: "New York", // Optional - commented for testing
        // billAddrCountry: "840", // Optional - commented for testing
        // billAddrLine1: "123 Main Street", // Optional - commented for testing
        // billAddrPostCode: "10001", // Optional - commented for testing
        // billAddrState: "NY" // Optional - commented for testing
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
        setState('acsURL', data.acsURL);
        setState('acsTransID', data.acsTransID);
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