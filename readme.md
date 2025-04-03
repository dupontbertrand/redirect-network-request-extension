# Resource Override Chrome Extension

## Description
This Chrome extension allows users to override network requests by replacing specific URLs with custom ones. This is particularly useful for local development, API mocking, or testing different content sources.

## Features
- Add rules to replace specific URLs in network requests.
- Edit or delete existing rules.
- Persistent storage to retain rules across sessions.
- Easy-to-use popup interface.

## Installation
### 1. Download the Extension Files
Clone or download this repository to your local machine.
```sh
 git clone https://github.com/dupontbertrand/redirect-network-request-extension.git
```

### 2. Load the Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" (toggle in the top-right corner).
3. Click "Load unpacked".
4. Select the folder where you downloaded the extension.

The extension should now appear in your Chrome toolbar.

## Usage
1. Click on the extension icon to open the popup.
2. Enter the following details:
   - **Main Page URL**: The page where the rule applies.
   - **URL to Replace**: The network request URL you want to override.
   - **New URL**: The URL that will replace the original request.
3. Click "Add Rule".
4. Your rules will be listed below. You can edit or delete them anytime.

## Permissions
This extension requires the following permissions:
- `storage`: To save and manage the redirection rules.
- `declarativeNetRequest`: To modify network requests and apply the redirection rules.
- `host_permissions`: To operate on all URLs (`<all_urls>`).

## License
This project is open-source and available under the MIT License.

