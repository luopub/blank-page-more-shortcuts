class NewTabManager {
    constructor() {
        this.settings = {
            displayCount: 50,
            displayFormat: 'grid',
            showFavicons: true
        };
        this.allShortcuts = [];
        this.init();
    }

    async init() {
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
            console.error('加载设置失败:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ shortcutSettings: this.settings });
            await this.loadShortcuts();
        } catch (error) {
            console.error('保存设置失败:', error);
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

        // 搜索框事件监听
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
            this.showMessage('设置已保存！');
        });

        cancelSettingsBtn.addEventListener('click', () => {
            this.updateSettingsUI();
            settingsPanel.classList.add('hidden');
        });

        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.add('hidden');
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
        container.innerHTML = '<div class="loading">加载中...</div>';

        try {
            const historyItems = await this.getRecentHistory();
            console.log('获取到的历史记录数量:', historyItems.length);
            const shortcuts = this.processHistoryItems(historyItems);
            console.log('处理后的快捷方式数量:', shortcuts.length);
            this.allShortcuts = shortcuts;
            this.renderShortcuts(shortcuts);
        } catch (error) {
            console.error('加载快捷方式失败:', error);
            container.innerHTML = '<div class="error">加载失败，请刷新页面重试</div>';
        }
    }

    async getRecentHistory() {
        return new Promise((resolve, reject) => {
            chrome.history.search({
                text: '',
                maxResults: 10000,
                startTime: 0  // 从最早的时间开始
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
        // 过滤掉无效的URL
        const validItems = historyItems.filter(item =>
            item.url &&
            !item.url.startsWith('chrome://') &&
            !item.url.startsWith('chrome-extension://') &&
            !item.url.startsWith('moz-extension://') &&
            !item.url.startsWith('edge://') &&
            !item.url.startsWith('about:') &&
            item.title
        );

        console.log('过滤后的有效历史记录数量:', validItems.length);

        // 按访问时间排序
        validItems.sort((a, b) => b.lastVisitTime - a.lastVisitTime);

        // 去重（相同域名只保留最新的）
        const uniqueItems = [];
        const seenDomains = new Set();

        for (const item of validItems) {
            try {
                const domain = new URL(item.url).hostname;
                if (!seenDomains.has(domain)) {
                    seenDomains.add(domain);
                    uniqueItems.push(item);
                    if (uniqueItems.length >= this.settings.displayCount) {
                        break;
                    }
                }
            } catch (e) {
                // 如果URL解析失败，跳过
                console.warn('URL解析失败:', item.url, e);
                continue;
            }
        }

        console.log('去重后的唯一域名数量:', uniqueItems.length);
        console.log('设置中要求显示的数量:', this.settings.displayCount);

        return uniqueItems;
    }

    renderShortcuts(shortcuts) {
        const container = document.getElementById('shortcutsContainer');

        if (shortcuts.length === 0) {
            container.innerHTML = '<div class="no-shortcuts">暂无快捷方式</div>';
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

        // 绑定图片加载事件，实现多级回退
        const favicons = container.querySelectorAll('.favicon-img');
        favicons.forEach(favicon => {
            const useFetch = favicon.getAttribute('data-use-fetch') === 'true';
            const faviconUrl = favicon.getAttribute('data-favicon-url');

            // 对于内网地址，使用fetch获取并转换为data URL
            if (useFetch && faviconUrl) {
                this.fetchFaviconAsDataURL(favicon, faviconUrl).then(dataUrl => {
                    if (dataUrl) {
                        favicon.src = dataUrl;
                        console.log('图标加载成功 (fetch):', faviconUrl);
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
                console.log('图标加载成功:', e.target.src);
            });
        });
    }

    async fetchFaviconAsDataURL(imgElement, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn('Favicon请求失败:', url, response.status);
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
            console.warn('获取favicon失败:', url, error);
            return null;
        }
    }

    tryNextSource(imgElement) {
        const sources = JSON.parse(imgElement.getAttribute('data-sources') || '[]');
        const defaultIcon = imgElement.getAttribute('data-default');

        console.log('图标加载失败，当前源:', imgElement.src);
        console.log('剩余备用源:', sources.length);

        if (sources.length > 0) {
            const nextSource = sources.shift();
            imgElement.setAttribute('data-sources', JSON.stringify(sources));

            // 检查下一个源是否也需要使用fetch（内网HTTP地址）
            try {
                const urlObj = new URL(nextSource);
                if (nextSource.startsWith('http://') && this.isPrivateIP(urlObj.hostname)) {
                    imgElement.setAttribute('data-use-fetch', 'true');
                    imgElement.setAttribute('data-favicon-url', nextSource);
                    this.fetchFaviconAsDataURL(imgElement, nextSource).then(dataUrl => {
                        if (dataUrl) {
                            imgElement.src = dataUrl;
                            console.log('图标加载成功 (fetch):', nextSource);
                        } else {
                            this.tryNextSource(imgElement);
                        }
                    });
                } else {
                    imgElement.src = nextSource;
                    console.log('尝试备用源:', nextSource);
                }
            } catch (e) {
                console.warn('URL解析失败:', nextSource);
                imgElement.src = nextSource;
            }
        } else if (defaultIcon) {
            imgElement.src = defaultIcon;
            console.log('使用默认图标');
        }
    }

    createShortcutHTML(item) {
        if (!this.settings.showFavicons) {
            return `
                <a href="${item.url}" class="shortcut-item">
                    <div class="shortcut-info">
                        <div class="shortcut-title" title="${item.title}">${item.title}</div>
                        <div class="shortcut-url" title="${item.url}">${new URL(item.url).hostname}</div>
                    </div>
                </a>
            `;
        }

        const urlObj = new URL(item.url);
        const domain = urlObj.hostname;
        const protocol = urlObj.protocol;
        const port = urlObj.port;
        
        const firstLetter = domain.charAt(0).toUpperCase();
        
        // 生成首字母作为备用图标
        const defaultIcon = this.generateLetterIcon(firstLetter);
        
        // 构建正确的favicon基础URL（包含协议和端口）
        const originBase = `${protocol}//${domain}${port ? ':' + port : ''}`;
        
        // 检测是否是内网IP或本地地址
        const isPrivateIP = this.isPrivateIP(domain);
        const originalFaviconUrl = `${originBase}/favicon.ico`;
        
        // 多个图标服务源 - 内网地址优先使用原始网站，公网地址优先使用第三方服务
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

        // 对于内网地址，使用fetch绕过CORS
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

        return `
            <a href="${item.url}" class="shortcut-item">
                ${favicon}
                <div class="shortcut-info">
                    <div class="shortcut-title" title="${item.title}">${item.title}</div>
                    <div class="shortcut-url" title="${item.url}">${domain}</div>
                </div>
            </a>
        `;
    }

    generateLetterIcon(letter) {
        // 生成彩色字母图标
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
        const color = colors[letter.charCodeAt(0) % colors.length];
        return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${color}"/><text x="50%" y="50%" font-size="18" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${letter}</text></svg>`)}`;
    }

    isPrivateIP(domain) {
        // 检测是否是内网IP或本地地址
        if (domain === 'localhost' || domain === '127.0.0.1' || domain === '::1') {
            return true;
        }
        
        // 检查IPv4内网地址范围
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
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new NewTabManager();
});