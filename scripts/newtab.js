class NewTabManager {
    constructor() {
        this.settings = {
            displayCount: 50,
            displayFormat: 'grid',
            showFavicons: true
        };
        this.allShortcuts = [];
        this.domainHistory = new Map(); // Store list of historical pages for each domain
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

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });

        // Translate titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.title = message;
            }
        });
    }

    async init() {
        this.initI18n();
        await this.loadSettings();
        this.setupEventListeners();
        await this.loadShortcuts();
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
            await this.loadShortcuts();
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    updateSettingsUI() {
        document.getElementById('displayCount').value = this.settings.displayCount;
        document.getElementById('displayFormat').value = this.settings.displayFormat;
        document.getElementById('showFavicons').checked = this.settings.showFavicons;
    }

    setupEventListeners() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        const saveSettingsBtn = document.getElementById('saveSettings');
        const cancelSettingsBtn = document.getElementById('cancelSettings');
        const searchInput = document.getElementById('searchInput');

        // Search box event listener
        searchInput.addEventListener('input', (e) => {
            this.filterShortcuts(e.target.value);
        });

        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });

        saveSettingsBtn.addEventListener('click', async () => {
            this.settings.displayCount = parseInt(document.getElementById('displayCount').value);
            this.settings.displayFormat = document.getElementById('displayFormat').value;
            this.settings.showFavicons = document.getElementById('showFavicons').checked;
            
            await this.saveSettings();
            settingsPanel.classList.add('hidden');
            this.showMessage(chrome.i18n.getMessage('settingsSaved'));
        });

        cancelSettingsBtn.addEventListener('click', () => {
            this.updateSettingsUI();
            settingsPanel.classList.add('hidden');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.add('hidden');
            }
            // Close modal when clicking outside
            const modal = document.getElementById('historyModal');
            if (modal && e.target === modal) {
                this.closeHistoryModal();
            }
        });

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeHistoryModal();
            }
        });
    }

    filterShortcuts(searchText) {
        if (!searchText.trim()) {
            this.renderShortcuts(this.allShortcuts);
            return;
        }

        const lowerSearchText = searchText.toLowerCase();
        const filteredShortcuts = this.allShortcuts.filter(item => {
            const title = item.title.toLowerCase();
            const url = item.url.toLowerCase();
            return title.includes(lowerSearchText) || url.includes(lowerSearchText);
        });

        this.renderShortcuts(filteredShortcuts);
    }

    async loadShortcuts() {
        const container = document.getElementById('shortcutsContainer');
        container.innerHTML = `<div class="loading">${chrome.i18n.getMessage('loading')}</div>`;

        try {
            const historyItems = await this.getRecentHistory();
            console.log('Number of history records retrieved:', historyItems.length);
            const shortcuts = this.processHistoryItems(historyItems);
            console.log('Number of shortcuts after processing:', shortcuts.length);
            this.allShortcuts = shortcuts;
            this.renderShortcuts(shortcuts);
        } catch (error) {
            console.error('Failed to load shortcuts:', error);
            container.innerHTML = `<div class="error">${chrome.i18n.getMessage('loadFailed')}</div>`;
        }
    }

    async getRecentHistory() {
        return new Promise((resolve, reject) => {
            chrome.history.search({
                text: '',
                maxResults: 10000,
                startTime: 0  // Start from the earliest time
            }, (results) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(results);
                }
            });
        });
    }

    processHistoryItems(historyItems) {
        // Filter out invalid URLs
        const validItems = historyItems.filter(item =>
            item.url &&
            !item.url.startsWith('chrome://') &&
            !item.url.startsWith('chrome-extension://') &&
            !item.url.startsWith('moz-extension://') &&
            !item.url.startsWith('edge://') &&
            !item.url.startsWith('about:') &&
            item.title
        );

        console.log('Number of valid history records after filtering:', validItems.length);

        // Sort by visit time
        validItems.sort((a, b) => b.lastVisitTime - a.lastVisitTime);

        // Count unique pages for each domain (deduplicate by URL) and save page list
        const domainPageCount = new Map();
        const domainPageMap = new Map(); // Temporary Map for deduplication, key is domain, value is Map<url, page>

        for (const item of validItems) {
            try {
                const domain = new URL(item.url).hostname;

                // Count deduplicated URL count
                if (!domainPageCount.has(domain)) {
                    domainPageCount.set(domain, new Set());
                }
                domainPageCount.get(domain).add(item.url);

                // Use Map to ensure URL deduplication while retaining latest page information
                if (!domainPageMap.has(domain)) {
                    domainPageMap.set(domain, new Map());
                }
                const urlMap = domainPageMap.get(domain);

                // Only keep the latest visit record for this URL
                if (!urlMap.has(item.url)) {
                    urlMap.set(item.url, {
                        url: item.url,
                        title: item.title,
                        lastVisitTime: item.lastVisitTime
                    });
                }
            } catch (e) {
                console.warn('URL parsing failed:', item.url, e);
                continue;
            }
        }

        // Convert Map to array and sort by visit time, keep at most 30 pages per domain
        domainPageMap.forEach((urlMap, domain) => {
            const pages = Array.from(urlMap.values());
            pages.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
            this.domainHistory.set(domain, pages.slice(0, 30));
        });

        // Deduplicate (only keep the latest for each domain)
        const uniqueItems = [];
        const seenDomains = new Set();

        for (const item of validItems) {
            try {
                const domain = new URL(item.url).hostname;
                if (!seenDomains.has(domain)) {
                    seenDomains.add(domain);
                    // Add page count to item
                    item.pageCount = domainPageCount.get(domain).size;
                    // Save domain info for opening history modal when clicked
                    item.domain = domain;
                    uniqueItems.push(item);
                    if (uniqueItems.length >= this.settings.displayCount) {
                        break;
                    }
                }
            } catch (e) {
                // Skip if URL parsing fails
                console.warn('URL parsing failed:', item.url, e);
                continue;
            }
        }

        console.log('Number of unique domains after deduplication:', uniqueItems.length);
        console.log('Number of items requested in settings:', this.settings.displayCount);

        return uniqueItems;
    }

    renderShortcuts(shortcuts) {
        const container = document.getElementById('shortcutsContainer');

        if (shortcuts.length === 0) {
            container.innerHTML = `<div class="no-shortcuts">${chrome.i18n.getMessage('noShortcuts')}</div>`;
            return;
        }

        const shortcutsHTML = shortcuts.map(item => this.createShortcutHTML(item)).join('');

        let wrapperClass = '';
        switch (this.settings.displayFormat) {
            case 'grid':
                wrapperClass = 'shortcuts-grid';
                break;
            case 'list':
                wrapperClass = 'shortcuts-list';
                break;
            case 'card':
                wrapperClass = 'shortcuts-card';
                break;
        }

        container.innerHTML = `<div class="${wrapperClass}">${shortcutsHTML}</div>`;

        // Bind shortcut click events
        const shortcutItems = container.querySelectorAll('.shortcut-item');
        shortcutItems.forEach((item, index) => {
            const shortcutData = shortcuts[index];
            if (shortcutData.pageCount > 1) {
                // Open history modal when multiple pages exist
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openHistoryModal(shortcutData);
                });
            } else {
                // Open page directly when only one page exists
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = shortcutData.url;
                });
            }
        });

        // Bind image loading events, implement multi-level fallback
        const favicons = container.querySelectorAll('.favicon-img');
        favicons.forEach(favicon => {
            const useFetch = favicon.getAttribute('data-use-fetch') === 'true';
            const faviconUrl = favicon.getAttribute('data-favicon-url');

            // For intranet addresses, use fetch to get and convert to data URL
            if (useFetch && faviconUrl) {
                this.fetchFaviconAsDataURL(favicon, faviconUrl).then(dataUrl => {
                    if (dataUrl) {
                        favicon.src = dataUrl;
                        // console.log('Icon loaded successfully (fetch):', faviconUrl);
                    } else {
                        this.tryNextSource(favicon);
                    }
                });
                return;
            }

            favicon.addEventListener('error', (e) => {
                this.tryNextSource(e.target);
            });

            favicon.addEventListener('load', (e) => {
                // console.log('图标加载成功:', e.target.src);
            });
        });
    }

    async fetchFaviconAsDataURL(imgElement, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn('Favicon request failed:', url, response.status);
                return null;
            }

            const blob = await response.blob();
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.warn('Failed to fetch favicon:', url, error);
            return null;
        }
    }

    tryNextSource(imgElement) {
        const sources = JSON.parse(imgElement.getAttribute('data-sources') || '[]');
        const defaultIcon = imgElement.getAttribute('data-default');

        console.log('Icon loading failed, current source:', imgElement.src);
        console.log('Remaining backup sources:', sources.length);

        if (sources.length > 0) {
            const nextSource = sources.shift();
            imgElement.setAttribute('data-sources', JSON.stringify(sources));

            // Check if next source also needs to use fetch (intranet HTTP address)
            try {
                const urlObj = new URL(nextSource);
                if (nextSource.startsWith('http://') && this.isPrivateIP(urlObj.hostname)) {
                    imgElement.setAttribute('data-use-fetch', 'true');
                    imgElement.setAttribute('data-favicon-url', nextSource);
                    this.fetchFaviconAsDataURL(imgElement, nextSource).then(dataUrl => {
                        if (dataUrl) {
                            imgElement.src = dataUrl;
                            // console.log('Icon loaded successfully (fetch):', nextSource);
                        } else {
                            this.tryNextSource(imgElement);
                        }
                    });
                } else {
                    imgElement.src = nextSource;
                    console.log('Trying backup source:', nextSource);
                }
            } catch (e) {
                console.warn('URL parsing failed:', nextSource);
                imgElement.src = nextSource;
            }
        } else if (defaultIcon) {
            imgElement.src = defaultIcon;
            console.log('Using default icon');
        }
    }

    createShortcutHTML(item) {
        if (!this.settings.showFavicons) {
            // Remove href attribute, store in data-url instead
            return `
                <div class="shortcut-item" data-url="${item.url}" data-domain="${item.domain}" data-page-count="${item.pageCount}">
                    <div class="shortcut-info">
                        <div class="shortcut-title" title="${item.title}">${item.title}</div>
                        <div class="shortcut-url" title="${item.url}">${new URL(item.url).hostname}</div>
                    </div>
                    <div class="page-count-badge" title="${item.pageCount} ${chrome.i18n.getMessage('historicalPages')}">${item.pageCount}</div>
                </div>
            `;
        }

        const urlObj = new URL(item.url);
        const domain = urlObj.hostname;
        const protocol = urlObj.protocol;
        const port = urlObj.port;
        
        const firstLetter = domain.charAt(0).toUpperCase();

        // Generate first letter as fallback icon
        const defaultIcon = this.generateLetterIcon(firstLetter);

        // Build correct favicon base URL (including protocol and port)
        const originBase = `${protocol}//${domain}${port ? ':' + port : ''}`;

        // Detect if it's an intranet IP or local address
        const isPrivateIP = this.isPrivateIP(domain);
        const originalFaviconUrl = `${originBase}/favicon.ico`;

        // Multiple icon service sources - intranet addresses prioritize original website, public addresses prioritize third-party services
        const iconSources = isPrivateIP ? [
            originalFaviconUrl,
            `https://favicon.yandex.net/favicon/${domain}`,
            `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=32`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`
        ] : [
            `https://favicon.yandex.net/favicon/${domain}`,
            `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=32`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            originalFaviconUrl
        ];

        // For intranet addresses, use fetch to bypass CORS
        const useFetch = isPrivateIP ? 'true' : 'false';

        const favicon = `
            <div class="shortcut-favicon favicon-container">
                <img class="favicon-img"
                     src="${useFetch === 'true' ? defaultIcon : iconSources[0]}"
                     data-sources='${JSON.stringify(iconSources.slice(1))}'
                     data-default="${defaultIcon}"
                     data-use-fetch="${useFetch}"
                     data-favicon-url="${useFetch === 'true' ? iconSources[0] : ''}"
                     alt=""
                     crossorigin="anonymous">
            </div>
        `;

        // Remove href attribute, store in data-url instead
        return `
            <div class="shortcut-item" data-url="${item.url}" data-domain="${item.domain}" data-page-count="${item.pageCount}">
                ${favicon}
                <div class="shortcut-info">
                    <div class="shortcut-title" title="${item.title}">${item.title}</div>
                    <div class="shortcut-url" title="${item.url}">${domain}</div>
                </div>
                <div class="page-count-badge" title="${item.pageCount} ${chrome.i18n.getMessage('historicalPages')}">${item.pageCount}</div>
            </div>
        `;
    }

    generateLetterIcon(letter) {
        // Generate colored letter icon
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
        const color = colors[letter.charCodeAt(0) % colors.length];
        return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${color}"/><text x="50%" y="50%" font-size="18" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${letter}</text></svg>`)}`;
    }

    isPrivateIP(domain) {
        // Detect if it's an intranet IP or local address
        if (domain === 'localhost' || domain === '127.0.0.1' || domain === '::1') {
            return true;
        }

        // Check IPv4 intranet address ranges
        const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        const match = domain.match(ipv4Regex);

        if (match) {
            const [, first, second] = match.map(Number);

            // 10.0.0.0 - 10.255.255.255
            if (first === 10) return true;

            // 172.16.0.0 - 172.31.255.255
            if (first === 172 && second >= 16 && second <= 31) return true;

            // 192.168.0.0 - 192.168.255.255
            if (first === 192 && second === 168) return true;
        }
        
        return false;
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'toast-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    openHistoryModal(shortcutData) {
        const domain = shortcutData.domain;
        const pages = this.domainHistory.get(domain) || [];

        if (pages.length === 0) {
            // If no historical pages, navigate directly
            window.location.href = shortcutData.url;
            return;
        }

        // Create modal HTML
        const modalHTML = `
            <div id="historyModal" class="history-modal">
                <div class="history-modal-content">
                    <div class="history-modal-header">
                        <h3 class="history-modal-title">${chrome.i18n.getMessage('historyModalTitle', new URL(shortcutData.url).hostname)}</h3>
                        <button class="close-modal-btn" title="${chrome.i18n.getMessage('closeModal')}">×</button>
                    </div>
                    <div class="history-modal-body">
                        <div class="history-pages-list">
                            ${pages.map((page, index) => `
                                <a href="${page.url}" class="history-page-item" title="${page.title}">
                                    <div class="history-page-index">${index + 1}</div>
                                    <div class="history-page-info">
                                        <div class="history-page-title">${page.title || chrome.i18n.getMessage('noTitle')}</div>
                                        <div class="history-page-url">${new URL(page.url).pathname}</div>
                                    </div>
                                    <div class="history-page-time">${this.formatTime(page.lastVisitTime)}</div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('historyModal');
        const closeBtn = modal.querySelector('.close-modal-btn');

        closeBtn.addEventListener('click', () => this.closeHistoryModal());
    }

    closeHistoryModal() {
        const modal = document.getElementById('historyModal');
        if (modal) {
            modal.remove();
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) {
            return chrome.i18n.getMessage('justNow');
        }
        // Less than 1 hour
        if (diff < 3600000) {
            return chrome.i18n.getMessage('minutesAgo', Math.floor(diff / 60000).toString());
        }
        // Less than 1 day
        if (diff < 86400000) {
            return chrome.i18n.getMessage('hoursAgo', Math.floor(diff / 3600000).toString());
        }
        // Less than 7 days
        if (diff < 604800000) {
            return chrome.i18n.getMessage('daysAgo', Math.floor(diff / 86400000).toString());
        }
        // Format date
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NewTabManager();
});