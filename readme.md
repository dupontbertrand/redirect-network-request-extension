Resource Override Chrome Extension
==================================

Description
-----------

This Chrome extension allows users to override network requests by replacing specific URLs with custom ones. It is particularly useful for local development, API mocking, or testing different content sources.

Features
--------

-   Add multiple override rules for a single main URL.

-   Activate or deactivate rules individually.

-   Edit or delete existing rules.

-   Persistent storage to retain rules across sessions.

-   User-friendly interface accessible from a separate tab, not a popup.

Installation
------------

### 1\. Download the Extension Files

Clone or download this repository to your local machine:

`git clone https://github.com/dupontbertrand/redirect-network-request-extension.git`

### 2\. Load the Extension in Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.

2.  Enable "Developer mode" (toggle in the top-right corner).

3.  Click "Load unpacked".

4.  Select the folder where you downloaded the extension.

The extension should now appear in your Chrome toolbar.

Usage
-----

1.  Click on the extension icon to open the management page.

2.  Enter the following details:

    -   **Main Page URL**: The base page where the rule applies.

    -   **Network URL**: The request URL you want to override.

    -   **Replacement URL**: The new URL that will replace the original request.

    -   **Activate Rule**: A checkbox to enable or disable the rule.

3.  Click "Add Rule" to save it.

4.  The list of active rules appears below. You can:

    -   Edit any rule directly in the list.

    -   Toggle activation on/off with the checkbox.

    -   Delete a rule by clicking ❌.

Permissions
-----------

This extension requires the following permissions:

-   `storage`: To save and manage the redirection rules.

-   `declarativeNetRequest`: To modify network requests and apply the redirection rules.

-   `host_permissions`: To operate on all URLs (`<all_urls>`).

License
-------

This project is open-source and available under the MIT License.