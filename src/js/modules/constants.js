import { testPANsV2 } from './test-pans-v2.js';

// Test PAN Configuration
// Systematically covers all permutations from sandbox.rst
// Pattern: Last 4 digits ABCD where:
// A = Message version (0=all, 1=v2.1, 2=v2.2, 3=v2.3)
// B = 3DS Method (0=included, 1=none, 2=timeout)
// C = ARes outcome (0-6=frictionless, 7=challenge)
// D = Challenge type (0=auto-pass, 1=auto-fail, 2=manual) when C=7
const testPANsAllVersions = {
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
    }
};

// Merge all test PANs
export const testPANs = {
    ...testPANsAllVersions,
    ...testPANsV2
};