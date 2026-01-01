# 空白页快捷方式 Chrome 扩展

> 🚀 一个功能丰富的Chrome浏览器扩展，在新标签页显示最近访问网站的快捷方式，支持自定义显示格式和数量。

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Language](https://img.shields.io/badge/languages-7-green)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=luopub/blank-page-more-shortcuts&type=Date)](https://star-history.com/#luopub/blank-page-more-shortcuts&Date)

## 关键词

Chrome扩展、新标签页、快捷方式、书签、历史记录、浏览器工具、 productivity、自定义、多语言、 Manifest V3

## 核心功能

- 🎯 **智能快捷方式**: 自动获取最近访问的网站，按域名去重
- ⚙️ **灵活设置**: 支持自定义显示数量（10-50个）和格式（网格/列表/卡片）
- 🔍 **即时搜索**: 内置搜索框，快速过滤和查找快捷方式
- 📜 **历史记录**: 点击域名可查看该网站下所有访问过的页面
- 🎨 **美观界面**: 现代化设计，支持响应式布局
- 💾 **设置持久化**: 设置自动保存，下次打开时保持配置
- 🔧 **双重控制**: 支持页面内设置和扩展弹窗设置
- 🌐 **网站图标**: 智能加载网站favicon，支持内网IP地址
- 🌍 **多语言支持**: 支持中文、英语、德语、法语、西班牙语、日语、韩语
- 📊 **页面计数**: 显示每个域名的历史页面数量

## 适用场景

✅ **提高生产力**: 快速访问常用网站，无需手动添加书签  
✅ **工作环境**: 快速访问开发工具、文档、项目管理系统  
✅ **学习研究**: 快速查找经常访问的学习资源和参考资料  
✅ **日常浏览**: 提升浏览体验，快速打开喜爱的网站

## 安装方法

1. 下载或克隆此项目到本地
2. 打开Chrome浏览器，进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹
6. 扩展安装完成

## 使用说明

### 基本使用
- 安装后，打开新标签页即可看到快捷方式
- 点击快捷方式可直接访问对应网站

### 设置快捷方式
1. **页面内设置**: 点击右上角的⚙️按钮
2. **扩展弹窗设置**: 点击浏览器工具栏中的扩展图标

### 搜索功能
- 在搜索框中输入关键词，实时过滤快捷方式
- 支持搜索网站标题和URL地址
- 按Enter键或直接输入即可触发搜索

### 历史记录查看
- 点击有多个历史页面的域名，会弹出历史记录模态框
- 模态框显示该域名下所有访问过的页面（最多30个）
- 显示页面标题、URL路径和访问时间
- 支持ESC键或点击外部区域关闭模态框

### 可配置选项
- **显示数量**: 10个、20个、30个、40个、50个
- **显示格式**: 
  - 网格布局：整齐的网格排列
  - 列表布局：垂直列表显示
  - 卡片布局：大卡片样式
- **网站图标**: 开启/关闭favicon显示

## 文件结构

```
blank-page-more-shortcuts/
├── manifest.json          # 扩展配置文件
├── newtab.html           # 新标签页HTML
├── popup.html            # 扩展弹窗HTML
├── styles/
│   ├── newtab.css        # 新标签页样式
│   └── popup.css         # 弹窗样式
├── scripts/
│   ├── newtab.js         # 新标签页逻辑
│   └── popup.js          # 弹窗逻辑
├── icons/                # 扩展图标（需要添加）
└── README.md             # 说明文档
```

## 技术实现

### 核心技术
- **Manifest V3**: 使用最新的Chrome扩展API
- **Chrome Storage API**: 持久化存储用户设置
- **Chrome History API**: 获取浏览器历史记录
- **Chrome i18n API**: 实现多语言支持
- **现代JavaScript**: ES6+语法，模块化设计
- **Fetch API**: 支持内网IP地址的图标加载

### 主要功能模块
1. **设置管理**: 加载、保存、同步用户配置
2. **历史记录处理**: 获取、过滤、去重最近访问的网站
3. **域名历史管理**: 保存每个域名的历史页面列表（最多30个）
4. **搜索功能**: 实时过滤和查找快捷方式
5. **模态框系统**: 显示域名下的历史记录
6. **图标加载系统**: 多级回退机制，支持内网IP和多种图标源
7. **UI渲染**: 根据设置动态生成快捷方式界面
8. **事件处理**: 用户交互和设置更新

## 权限说明

扩展需要以下权限：
- `storage`: 保存用户设置
- `tabs`: 访问标签页信息
- `history`: 读取浏览器历史记录

## 开发说明

### 本地开发
1. 修改代码后，在 `chrome://extensions/` 页面点击刷新按钮
2. 打开新标签页查看效果

### 自定义样式
- 修改 `styles/newtab.css` 调整页面样式
- 修改 `styles/popup.css` 调整弹窗样式

### 功能扩展
- 在 `scripts/` 目录下添加新的JavaScript模块
- 修改 `manifest.json` 添加必要的权限

## 注意事项

1. 扩展只能访问普通网页的历史记录，无法访问Chrome内部页面
2. 历史记录获取限制为最多10000条记录
3. 每个域名最多保存30个历史页面
4. 网站图标通过多个第三方服务获取（Yandex、Google、DuckDuckGo）
5. 内网IP地址的图标通过fetch获取并转换为dataURL，可能影响加载速度
6. 图标加载失败时会显示基于首字母的彩色图标作为回退

## 版本信息

- **版本**: 1.0.0
- **兼容性**: Chrome 88+
- **支持语言**: 中文（简体）、英语、德语、法语、西班牙语、日语、韩语
- **最后更新**: 2026年1月

## 许可证

MIT License

## 相关标签

`#chrome-extension` `#new-tab` `#bookmarks` `#browser-extension` `#productivity` `#manifest-v3` `#multilingual` `#shortcut-manager` `#history-manager` `#customization`

---

## 贡献

欢迎提交 Issue 和 Pull Request！

## 链接

- [English README](README.en.md)
- [Deutsche README](README.de.md)
- [Español README](README.es.md)
- [Français README](README.fr.md)
- [日本語 README](README.ja.md)
- [한국어 README](README.ko.md)

---

### 其他 Chrome 扩展推荐

如果您喜欢这个扩展，您可能还会对以下类型的扩展感兴趣：

- 生产力工具类扩展
- 书签管理类扩展
- 浏览体验优化类扩展

### 支持

如果这个扩展对您有帮助，请给它一个⭐️ Star！