class PopupManager {
    constructor() {
        this.settings = {
            displayCount: 6,
            displayFormat: 'grid',
            showFavicons: true
        };
        this.init();
    }

    async init() {
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
            console.error('加载设置失败:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ shortcutSettings: this.settings });
            this.showMessage('设置已保存！');
            
            // 通知新标签页更新
            chrome.tabs.query({ url: 'chrome://newtab/*' }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.reload(tab.id);
                });
            });
        } catch (error) {
            console.error('保存设置失败:', error);
            this.showMessage('保存失败，请重试');
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

        // 实时更新设置
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});