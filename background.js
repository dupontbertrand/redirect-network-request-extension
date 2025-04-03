// Function to update the redirection rules
function updateRules() {
    chrome.storage.local.get("rules", function (data) {
        let rules = data.rules || [];

        // Supprimer toutes les anciennes règles
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map((_, index) => index + 1), // Supprime toutes les règles
        }, () => {
            // Ne réajouter que les règles actives
            let activeRules = rules
                .filter(rule => rule.isActive) // Ne garde que les règles activées
                .map((rule, index) => ({
                    id: index + 1,
                    priority: 1,
                    action: { type: "redirect", redirect: { url: rule.replacementUrl } },
                    condition: { urlFilter: rule.networkUrl, resourceTypes: ["xmlhttprequest", "sub_frame", "script", "main_frame"] }
                }));

            // Ajoute uniquement les règles actives
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: activeRules
            }, () => {
                console.log("Updated active rules:", activeRules);
            });
        });
    });
}
// Listen for messages from the page
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateRules") {
        updateRules();
    }
});


// Listens for changes to update rules live
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.rules) {
        updateRules();
    }
});

// Load the rules on startup
chrome.runtime.onInstalled.addListener(() => {
    updateRules();
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});