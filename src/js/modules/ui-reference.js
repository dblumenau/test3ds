// Show test card reference modal
export function showTestCardReference() {
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
export function hideTestCardReference() {
    const modal = document.getElementById('testCardModal');
    modal.classList.add('hidden');
}