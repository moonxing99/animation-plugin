# MasterGo 动效插件安装向导

## 🎯 快速安装步骤

### 第一步：准备插件文件
✅ 插件文件已准备好，位于：
- `mastergo-animation-plugin/animation-plugin.zip` (打包版本)
- `mastergo-animation-plugin/plugin-package/` (源文件版本)

### 第二步：选择安装方式

#### 方式一：通过MasterGo插件市场（推荐）
1. 登录 [MasterGo开发者平台](https://mastergo.com/developer)
2. 进入"我的插件"页面
3. 点击"创建新插件"
4. 上传 `animation-plugin.zip` 文件
5. 填写插件信息并提交审核

#### 方式二：本地开发测试
1. 打开MasterGo应用
2. 进入插件开发界面（如您截图所示）
3. 选择"上传manifest.json文件"
4. 选择 `mastergo-animation-plugin/plugin-package/manifest.json`
5. 点击"下一步"完成安装

### 第三步：使用插件
1. 在MasterGo中打开任意设计文件
2. 在插件面板中找到"动效插件"
3. 点击启动插件
4. 按照界面提示操作

## 📋 插件功能预览

安装后您可以使用以下功能：

### 🎨 核心功能
- **元素选择**: 框选设计稿中的任意元素
- **效果应用**: 为选中元素添加交互动效
- **参数调节**: 自定义动画时长、缓动函数等
- **实时预览**: 在设计稿中直接查看效果
- **代码导出**: 生成可用于开发的CSS/JS代码

### 🎯 支持的效果类型
- ✨ 出现动画
- 👆 悬停效果  
- 🖱️ 点击效果
- ➡️ 滑入效果

## 🔧 开发者说明

### 项目结构
```
mastergo-animation-plugin/
├── src/                 # 源代码目录
├── plugin-package/      # 插件发布包
│   ├── manifest.json    # 插件配置文件
│   ├── index.html       # 插件入口文件
│   └── README.md        # 安装说明
├── animation-plugin.zip # 打包的插件文件
├── demo-files/          # 演示文件
└── documentation/       # 文档目录
```

### 技术栈
- **核心**: 原生JavaScript ES6+
- **构建**: Webpack 5
- **样式**: CSS3 + 现代布局
- **兼容**: 支持最新浏览器

### API集成要点
实际部署时需要集成MasterGo官方API：

```javascript
// 元素选择API
const selectedElements = await mastergo.selection.getElements();

// 效果应用API  
await mastergo.effects.apply(elements, effectConfig);

// 文档操作API
await mastergo.document.modify(elements, modifications);
```

## 🎮 演示版本体验

在正式安装前，您可以先体验演示版本：

1. **启动开发服务器**:
   ```bash
   cd mastergo-animation-plugin
   npm install
   npm run dev
   ```

2. **访问演示页面**:
   - 主演示: http://localhost:3000/fixed-demo.html
   - 插件界面: http://localhost:3000/mg-plugin.html

## 📞 技术支持

### 开发文档
- MasterGo插件开发文档: [官方文档链接]
- Web API参考: [API文档链接]

### 常见问题
1. **插件加载失败**: 检查manifest.json格式
2. **功能无响应**: 确认API权限已授予
3. **效果不显示**: 验证元素选择是否正确

### 联系方式
- 技术支持邮箱: support@example.com
- 开发者社区: [社区链接]
- GitHub仓库: [仓库链接]

---
**版本信息**: v1.0.0
**最后更新**: 2026年3月11日
**兼容性**: MasterGo v1.0+ | Chrome 80+ | Firefox 75+