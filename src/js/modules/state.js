// Global state management
const state = {
    threeDSServerTransID: null,
    acsTransID: null,
    acsURL: null,
    threeDSMethodURL: null,
    dsTransID: null,
    messageVersion: '2.1.0',
    supportedVersions: [],
    threeDSMethodCompleted: false,
    activeCheckInterval: null
};

// Getter functions
export function getState() {
    return state;
}

export function getStateValue(key) {
    return state[key];
}

// Setter functions
export function setState(key, value) {
    state[key] = value;
}

export function updateState(updates) {
    Object.assign(state, updates);
}

// Reset state to initial values
export function resetState() {
    state.threeDSServerTransID = null;
    state.acsTransID = null;
    state.acsURL = null;
    state.threeDSMethodURL = null;
    state.dsTransID = null;
    state.messageVersion = '2.1.0';
    state.supportedVersions = [];
    state.threeDSMethodCompleted = false;
    
    // Clear any active intervals
    if (state.activeCheckInterval) {
        clearInterval(state.activeCheckInterval);
        state.activeCheckInterval = null;
    }
}