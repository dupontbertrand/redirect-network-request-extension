// Validates if a given URL is correctly formatted
function isValidUrl(url) {
    try {
        let newUrl = new URL(url);
        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch (e) {
        return false;
    }
}

// Saves input in real time
function saveInput(id) {
    document.getElementById(id).addEventListener("input", function() {
        let obj = {};
        obj[id] = this.value;
        chrome.storage.local.set(obj);
    });
}

// Retrieves saved values
function restoreInputs() {
    chrome.storage.local.get(["mainPageUrl", "networkUrl", "replacementUrl"], function(data) {
        document.getElementById("mainPageUrl").value = data.mainPageUrl || '';
        document.getElementById("networkUrl").value = data.networkUrl || '';
        document.getElementById("replacementUrl").value = data.replacementUrl || '';
    });
}

// Adds a new rule
document.getElementById("addRule").addEventListener("click", function() {
    let mainPageUrl = document.getElementById("mainPageUrl").value;
    let networkUrl = document.getElementById("networkUrl").value;
    let replacementUrl = document.getElementById("replacementUrl").value;
    let isActive = document.getElementById("isActive").checked; // Check if the rule is active

    if (mainPageUrl && networkUrl && replacementUrl) {
        if (!isValidUrl(replacementUrl)) {
            console.error("Invalid replacement URL:", replacementUrl);
            alert("Invalid replacement URL. Please enter a valid HTTP or HTTPS URL.");
            return;
        }

        chrome.storage.local.get("rules", function(data) {
            let rules = data.rules || [];

            // Add the new rule to the list
            rules.push({ mainPageUrl, networkUrl, replacementUrl, isActive });

            chrome.storage.local.set({ rules }, function() {
                loadRules();
            });
        });
    }
});

// Deletes a rule
function deleteRule(index) {
    chrome.storage.local.get("rules", function(data) {
        let rules = data.rules || [];
        let ruleToRemove = rules[index]; // Sauvegarde de la règle à supprimer
        rules.splice(index, 1); // Supprime la règle de la liste

        chrome.storage.local.set({ rules }, function() {
            loadRules();

            // Supprime la règle de chrome.declarativeNetRequest
            if (ruleToRemove) {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [index + 1] // Supprime la règle spécifique
                }, () => {
                    console.log("Rule deleted:", ruleToRemove);
                });
            }
        });
    });
}

// Updates a rule when the user modifies a field
function updateRule(index, field, value) {
    chrome.storage.local.get("rules", function(data) {
        let rules = data.rules || [];
        if (rules[index]) {
            rules[index][field] = value;
            chrome.storage.local.set({ rules }, function() {
                loadRules(); 

                // 🔥 Envoie un message au background pour mettre à jour les règles
                chrome.runtime.sendMessage({ action: "updateRules" });
            });
        }
    });
}


// Loads saved rules and applies them
function loadRules() {
    chrome.storage.local.get("rules", function(data) {
        const rules = data.rules || [];
        const list = document.getElementById("rulesList");
        list.innerHTML = "";

        rules.forEach((rule, index) => {
            let div = document.createElement("div");
            div.className = "rule";
            div.innerHTML = `
                <input type="text" value="${rule.mainPageUrl}" class="edit-mainPageUrl" data-index="${index}">
                <input type="text" value="${rule.networkUrl}" class="edit-networkUrl" data-index="${index}">
                <input type="text" value="${rule.replacementUrl}" class="edit-replacementUrl" data-index="${index}">
                <input type="checkbox" class="edit-isActive" data-index="${index}" ${rule.isActive ? 'checked' : ''}>
                <button class="delete-btn" data-index="${index}">❌</button>
            `;
            list.appendChild(div);

            // Ajoute des événements d'input pour les champs
            document.querySelectorAll(".edit-mainPageUrl").forEach(input => {
                input.addEventListener("input", function() {
                    updateRule(this.dataset.index, "mainPageUrl", this.value);
                });
            });

            document.querySelectorAll(".edit-networkUrl").forEach(input => {
                input.addEventListener("input", function() {
                    updateRule(this.dataset.index, "networkUrl", this.value);
                });
            });

            document.querySelectorAll(".edit-replacementUrl").forEach(input => {
                input.addEventListener("input", function() {
                    updateRule(this.dataset.index, "replacementUrl", this.value);
                });
            });

            document.querySelectorAll(".edit-isActive").forEach(input => {
                input.addEventListener("change", function() {
                    updateRule(this.dataset.index, "isActive", this.checked);  // Mise à jour de l'état de la règle
                });
            });

            // Ajoute des événements pour le bouton de suppression
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function() {
                    deleteRule(this.dataset.index);
                });
            });
        });
    });
}

// Loads fields and rules when the popup opens
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();
    loadRules();
    saveInput("mainPageUrl");
    saveInput("networkUrl");
    saveInput("replacementUrl");
});
