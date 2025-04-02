// Function to update the redirection rules
function updateRules() {
    chrome.storage.local.get("rules", function(data) {
      let rules = data.rules || [];
      let newRules = rules.map((rule, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "redirect", redirect: { url: rule.replacementUrl } },
        condition: { urlFilter: rule.networkUrl, resourceTypes: ["xmlhttprequest", "sub_frame", "script", "main_frame"] }
      }));

      // Apply the new rules
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: newRules.map(rule => rule.id),
        addRules: newRules
      });
    });
  }
  
  // Listens for changes to update rules live
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.rules) {
      updateRules();
    }
  });
  
  // Load the rules on startup
  chrome.runtime.onInstalled.addListener(() => {
    updateRules();
  });
