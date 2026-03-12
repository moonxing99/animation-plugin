# MasterGo 动效插件安装说明

## 📦 安装包内容

```
installation-package/
├── manifest.json          # 插件配置文件（需修改main字段）
├── plugin.html           # 插件主文件（需托管）
├── HOSTING-GUIDE.md     # 托管部署指南
└── README.md            # 本说明文件
```

## 🚀 安装步骤

### 第一步：托管插件文件

由于MasterGo不支持直接上传HTML文件，您需要先将插件文件托管到网络上。

**推荐免费托管平台**：
- GitHub Pages（推荐）
- Vercel
- Netlify
- Firebase Hosting

### 第二步：获取托管URL

托管后获得类似这样的URL：
```
https://your-username.github.io/animation-plugin/plugin.html
```

### 第三步：修改manifest.json

将获得的URL填入manifest.json的main字段：

```json
{
  "name": "动效插件",
  "id": "com.example.animation",
  "version": "1.3.0",
  "main": "YOUR_HOSTED_URL_HERE",
  "permissions": ["document", "selection"]
}
```

### 第四步：安装到MasterGo

1. 在MasterGo中打开插件管理界面
2. 选择"上传manifest.json"
3. 选择修改后的manifest.json文件
4. 点击安装

## 🎯 使用说明

### 基本操作流程
1. **初始化插件** - 点击"初始化插件"按钮
2. **选择元素** - 在MasterGo中选中要添加动效的元素
3. **选择效果** - 在插件中选择动效类型
4. **调整参数** - 设置动画时长和缓动函数
5. **生成代码** - 点击生成动画代码
6. **导出使用** - 复制代码到您的项目中

### 支持的效果类型
- ✨ **出现动画** - 元素淡入和滑入效果
- 👆 **悬停效果** - 鼠标悬停交互反馈
- 🖱️ **点击效果** - 按钮点击视觉反馈
- ➡️ **滑入效果** - 元素从侧边滑入

## 🔧 技术说明

### 插件特点
- 无需安装额外依赖
- 纯前端实现
- 响应式设计
- 支持代码导出

### 兼容性
- 支持最新版本MasterGo
- 兼容现代浏览器
- 移动端友好

## 📞 技术支持

如遇问题请参考：
- `HOSTING-GUIDE.md` - 详细的托管部署说明
- 查看浏览器控制台错误信息
- 联系技术支持邮箱

---
**注意**: 请务必先完成文件托管并正确配置manifest.json中的URL后再进行安装。