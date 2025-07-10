// Test PANs for version 2.x only configurations
export const testPANsV2 = {
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