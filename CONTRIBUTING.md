# 贡献指南

感谢您对"空白页快捷方式"Chrome扩展的兴趣！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果您发现了bug或有功能建议，请：

1. 检查[Issues](../../issues)页面，确认问题是否已被报告
2. 如果是新的问题，请创建一个新的Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 重现步骤
   - 预期行为
   - 实际行为
   - 截图（如果适用）
   - 您的Chrome版本和操作系统

### 提交代码

1. **Fork** 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 **Pull Request**

### 开发指南

#### 本地开发

1. 克隆仓库到本地
2. 在Chrome浏览器中打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

#### 修改代码

- **HTML文件**: 修改 `newtab.html` 或 `popup.html`
- **样式文件**: 修改 `styles/newtab.css` 或 `styles/popup.css`
- **脚本文件**: 修改 `scripts/newtab.js` 或 `scripts/popup.js`
- **多语言**: 修改 `_locales/[语言代码]/messages.json`

#### 代码规范

- 使用ES6+语法
- 遵循现有代码风格
- 添加必要的注释
- 确保代码在Chrome 88+上正常运行

### 添加新语言

1. 在 `_locales/` 目录下创建新的语言文件夹（例如：`ru/`）
2. 创建 `messages.json` 文件，参考其他语言的文件结构
3. 翻译所有必需的消息键
4. 在 `manifest.json` 的 `default_locale` 中更新默认语言（如果需要）

## 开发环境要求

- Chrome浏览器（版本88或更高）
- 代码编辑器（推荐VS Code）
- Git

## 项目结构

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
├── _locales/             # 多语言文件
│   ├── en/              # 英语
│   ├── zh_CN/           # 中文（简体）
│   └── ...              # 其他语言
├── icons/               # 扩展图标
└── README.md            # 说明文档
```

## 测试

在提交Pull Request之前，请确保：

- [ ] 代码在Chrome浏览器中正常工作
- [ ] 所有现有功能正常工作
- [ ] 新功能已经过测试
- [ ] 没有控制台错误
- [ ] 代码遵循项目风格指南

## 提交信息规范

请使用清晰的提交信息：

```
feat: 添加网格布局选项
fix: 修复图标加载问题
docs: 更新README文档
style: 优化CSS样式
refactor: 重构历史记录处理逻辑
test: 添加单元测试
chore: 更新依赖
```

## 问题反馈

如果您有任何问题或建议，请通过[GitHub Issues](../../issues)联系我们。

## 许可证

通过贡献代码，您同意您的贡献将使用MIT许可证进行授权。
