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
    chrome.storage.local.get(["pageUrl", "networkUrl", "replacementUrl"], function(data) {
        document.getElementById("pageUrl").value = data.pageUrl || '';
        document.getElementById("networkUrl").value = data.networkUrl || '';
        document.getElementById("replacementUrl").value = data.replacementUrl || '';
    });
}

// Adds a new rule
document.getElementById("addRule").addEventListener("click", function() {
    let pageUrl = document.getElementById("pageUrl").value;
    let networkUrl = document.getElementById("networkUrl").value;
    let replacementUrl = document.getElementById("replacementUrl").value;

    if (pageUrl && networkUrl && replacementUrl) {
        if (!isValidUrl(replacementUrl)) {
            console.error("Invalid replacement URL:", replacementUrl);
            alert("Invalid replacement URL. Please enter a valid HTTP or HTTPS URL.");
            return;
        }

        chrome.storage.local.get("rules", function(data) {
            let rules = data.rules || [];
            rules.push({ pageUrl, networkUrl, replacementUrl });

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
        rules.splice(index, 1); // Removes the rule at the given index

        chrome.storage.local.set({ rules }, function() {
            loadRules();
        });
    });
}

// Updates a rule when the user modifies a field
function updateRule(index, field, value) {
    chrome.storage.local.get("rules", function(data) {
        let rules = data.rules || [];
        if (rules[index]) {
            rules[index][field] = value;
            chrome.storage.local.set({ rules });
        }
    });
}

// Loads saved rules
function loadRules() {
    chrome.storage.local.get("rules", function(data) {
        const rules = data.rules || [];
        const list = document.getElementById("rulesList");
        list.innerHTML = "";

        rules.forEach((rule, index) => {
            let div = document.createElement("div");
            div.className = "rule";
            div.innerHTML = `
                <input type="text" value="${rule.pageUrl}" class="edit-pageUrl" data-index="${index}">
                <input type="text" value="${rule.networkUrl}" class="edit-networkUrl" data-index="${index}">
                <input type="text" value="${rule.replacementUrl}" class="edit-replacementUrl" data-index="${index}">
                <button class="delete-btn" data-index="${index}">❌</button>
            `;
            list.appendChild(div);
        });

        // Adds event listeners to inputs to update rules in real time
        document.querySelectorAll(".edit-pageUrl").forEach(input => {
            input.addEventListener("input", function() {
                updateRule(this.dataset.index, "pageUrl", this.value);
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

        // Adds event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                deleteRule(this.dataset.index);
            });
        });
    });
}

// Loads fields and rules when the popup opens
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();
    loadRules();
    saveInput("pageUrl");
    saveInput("networkUrl");
    saveInput("replacementUrl");
});
