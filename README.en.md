# Blank Page Shortcuts Chrome Extension

> 🚀 A feature-rich Chrome browser extension that displays shortcuts to recently visited websites on the new tab page, with support for custom display formats and quantities.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Language](https://img.shields.io/badge/languages-7-green)

## Keywords

Chrome extension, new tab, shortcuts, bookmarks, history manager, browser tools, productivity, customization, multilingual, Manifest V3, website launcher, quick access

## Features

- 🎯 **Smart Shortcuts**: Automatically fetches recently visited websites, deduplicated by domain
- ⚙️ **Flexible Settings**: Support for customizing display count (10-50) and format (grid/list/card)
- 🔍 **Instant Search**: Built-in search box for quickly filtering and finding shortcuts
- 📜 **History View**: Click on a domain to view all visited pages under that website
- 🎨 **Beautiful UI**: Modern design with responsive layout
- 💾 **Persistent Settings**: Settings are automatically saved and restored on next open
- 🔧 **Dual Control**: Supports both in-page settings and extension popup settings
- 🌐 **Website Icons**: Intelligent favicon loading, supports internal network IP addresses
- 🌍 **Multi-language Support**: Supports Chinese, English, German, French, Spanish, Japanese, and Korean
- 📊 **Page Count**: Displays the number of historical pages for each domain

## Installation

1. Download or clone this project to your local machine
2. Open Chrome browser and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the project folder
6. Extension installation complete

## Usage Guide

### Basic Usage
- After installation, open a new tab to see the shortcuts
- Click on any shortcut to directly access the corresponding website

### Settings
1. **In-page Settings**: Click the ⚙️ button in the top right corner
2. **Extension Popup Settings**: Click the extension icon in the browser toolbar

### Search Function
- Type keywords in the search box to filter shortcuts in real-time
- Supports searching both website titles and URLs
- Press Enter or simply start typing to trigger search

### History View
- Click on a domain with multiple historical pages to open a history modal
- The modal displays all visited pages under that domain (up to 30)
- Shows page title, URL path, and visit time
- Supports ESC key or clicking outside to close the modal

### Configurable Options
- **Display Count**: 10, 20, 30, 40, or 50 items
- **Display Format**:
  - Grid Layout: Neat grid arrangement
  - List Layout: Vertical list display
  - Card Layout: Large card style
- **Website Icons**: Enable/disable favicon display

## File Structure

```
blank-page-more-shortcuts/
├── manifest.json          # Extension configuration file
├── newtab.html           # New tab page HTML
├── popup.html            # Extension popup HTML
├── styles/
│   ├── newtab.css        # New tab page styles
│   └── popup.css         # Popup styles
├── scripts/
│   ├── newtab.js         # New tab page logic
│   └── popup.js          # Popup logic
├── icons/                # Extension icons (to be added)
└── README.md             # Documentation
```

## Technical Implementation

### Core Technologies
- **Manifest V3**: Uses the latest Chrome extension API
- **Chrome Storage API**: Persistent storage for user settings
- **Chrome History API**: Access browser history
- **Chrome i18n API**: Multi-language support
- **Modern JavaScript**: ES6+ syntax, modular design
- **Fetch API**: Supports icon loading for internal network IPs

### Main Functional Modules
1. **Settings Management**: Load, save, and sync user configurations
2. **History Processing**: Fetch, filter, and deduplicate recently visited websites
3. **Domain History Management**: Save list of historical pages for each domain (up to 30)
4. **Search Function**: Real-time filtering and searching of shortcuts
5. **Modal System**: Display historical pages under a domain
6. **Icon Loading System**: Multi-level fallback mechanism, supports internal IPs and multiple icon sources
7. **UI Rendering**: Dynamically generate shortcut interface based on settings
8. **Event Handling**: User interaction and settings updates

## Permissions

The extension requires the following permissions:
- `storage`: Save user settings
- `tabs`: Access tab information
- `history`: Read browser history

## Development

### Local Development
1. After making code changes, click the refresh button on `chrome://extensions/` page
2. Open a new tab to see the changes

### Customizing Styles
- Modify `styles/newtab.css` to adjust page styles
- Modify `styles/popup.css` to adjust popup styles

### Extending Features
- Add new JavaScript modules in the `scripts/` directory
- Modify `manifest.json` to add necessary permissions

## Notes

1. The extension can only access history for regular web pages, not Chrome internal pages
2. History fetching is limited to a maximum of 10,000 records
3. Each domain saves a maximum of 30 historical pages
4. Website icons are fetched from multiple third-party services (Yandex, Google, DuckDuckGo)
5. Icons for internal network IPs are fetched via fetch and converted to dataURL, which may affect loading speed
6. When icon loading fails, a colorful icon based on the first letter is displayed as a fallback

## Version Information

- **Version**: 1.0.0
- **Compatibility**: Chrome 88+
- **Supported Languages**: Chinese (Simplified), English, German, French, Spanish, Japanese, Korean
- **Last Updated**: January 2026

## License

MIT License

## Related Tags

`#chrome-extension` `#new-tab` `#bookmarks` `#browser-extension` `#productivity` `#manifest-v3` `#multilingual` `#shortcut-manager` `#history-manager` `#customization`

---

## Contributing

Issues and Pull Requests are welcome!

## Links

- [中文 README](README.md)
- [Deutsche README](README.de.md)
- [Español README](README.es.md)
- [Français README](README.fr.md)
- [日本語 README](README.ja.md)
- [한국어 README](README.ko.md)

---

### Other Chrome Extensions You Might Like

If you enjoy this extension, you might also be interested in:

- Productivity tool extensions
- Bookmark management extensions
- Browser experience optimization extensions

### Support

If this extension helps you, please give it a ⭐️ Star!
