class PopupManager {
    constructor() {
        this.settings = {
            displayCount: 6,
            displayFormat: 'grid',
            showFavicons: true
        };
        this.init();
    }

    initI18n() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.textContent = message;
            }
        });
    }

    async init() {
        this.initI18n();
        await this.loadSettings();
        this.setupEventListeners();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get('shortcutSettings');
            if (result.shortcutSettings) {
                this.settings = { ...this.settings, ...result.shortcutSettings };
            }
            this.updateSettingsUI();
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ shortcutSettings: this.settings });
            this.showMessage(chrome.i18n.getMessage('settingsSaved'));

            // Notify new tab page to update
            chrome.tabs.query({ url: 'chrome://newtab/*' }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.reload(tab.id);
                });
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showMessage(chrome.i18n.getMessage('loadFailed'));
        }
    }

    updateSettingsUI() {
        document.getElementById('popupDisplayCount').value = this.settings.displayCount;
        document.getElementById('popupDisplayFormat').value = this.settings.displayFormat;
        document.getElementById('popupShowFavicons').checked = this.settings.showFavicons;
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('savePopupSettings');
        
        saveBtn.addEventListener('click', async () => {
            this.settings.displayCount = parseInt(document.getElementById('popupDisplayCount').value);
            this.settings.displayFormat = document.getElementById('popupDisplayFormat').value;
            this.settings.showFavicons = document.getElementById('popupShowFavicons').checked;
            
            await this.saveSettings();
        });

        // Real-time update settings
        document.getElementById('popupDisplayCount').addEventListener('change', (e) => {
            this.settings.displayCount = parseInt(e.target.value);
        });

        document.getElementById('popupDisplayFormat').addEventListener('change', (e) => {
            this.settings.displayFormat = e.target.value;
        });

        document.getElementById('popupShowFavicons').addEventListener('change', (e) => {
            this.settings.showFavicons = e.target.checked;
        });
    }

    showMessage(text) {
        const messageEl = document.getElementById('saveMessage');
        messageEl.textContent = text;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});