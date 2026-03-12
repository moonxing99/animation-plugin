# MasterGo 动效插件托管部署指南

## 🎯 解决方案概述

由于MasterGo不支持直接上传HTML文件，我们提供以下几种部署方案：

## 🚀 方案一：在线托管（推荐）

### 1. 使用免费托管服务
将插件部署到以下任一平台：
- **GitHub Pages** (免费)
- **Vercel** (免费) 
- **Netlify** (免费)
- **Firebase Hosting** (免费)

### 2. 部署步骤（以GitHub Pages为例）

1. **创建GitHub仓库**
   ```bash
   # 创建新的仓库
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/animation-plugin.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库Settings
   - 找到Pages选项
   - 选择分支并启用

3. **获取部署URL**
   - 通常是: `https://yourusername.github.io/animation-plugin/hosted-plugin.html`

### 3. 更新manifest.json
```json
{
  "name": "动效插件",
  "id": "com.example.hosted-animation",
  "version": "1.3.0",
  "main": "https://yourusername.github.io/animation-plugin/hosted-plugin.html",
  "permissions": ["document", "selection"]
}
```

## 📦 方案二：本地服务器部署

### 1. 启动本地服务器
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server

# 或使用PHP
php -S localhost:8000
```

### 2. 更新manifest.json
```json
{
  "main": "http://localhost:8000/hosted-plugin.html"
}
```

## 🔧 方案三：企业内部部署

### 1. 公司内网部署
- 部署到公司内部服务器
- 使用内网域名访问
- 确保网络安全策略允许访问

### 2. CDN加速部署
- 上传到CDN服务商
- 使用CDN URL作为main字段
- 提供更好的访问速度

## 📋 完整部署清单

### 必需文件
- ✅ `hosted-plugin.html` - 主插件文件
- ✅ `web-manifest.json` - 插件配置文件
- ✅ 部署说明文档

### 部署步骤
1. 选择合适的托管平台
2. 上传插件文件
3. 获取访问URL
4. 更新manifest.json中的main字段
5. 在MasterGo中安装manifest.json

### 测试验证
- [ ] 插件能够正常加载
- [ ] 所有功能按钮响应正常
- [ ] 代码生成功能工作
- [ ] 导出功能可用

## 🎮 使用流程

### 安装阶段
1. 将 `web-manifest.json` 上传到MasterGo
2. 插件会自动从指定URL加载HTML文件
3. 等待插件初始化完成

### 使用阶段
1. 在MasterGo中选中设计元素
2. 在插件界面选择动效类型
3. 调整动画参数
4. 生成并导出代码

## 🆘 常见问题

### Q: 插件加载缓慢怎么办？
A: 使用CDN加速或选择更快的托管服务

### Q: 无法访问托管URL？
A: 检查网络连接和防火墙设置

### Q: 功能不完整？
A: 确认使用的是最新版本的插件文件

## 📞 技术支持

- 邮箱: support@example.com
- 文档: https://your-docs-url.com
- 社区: MasterGo开发者社区

---
**推荐**: 使用GitHub Pages进行免费托管，简单快捷且稳定可靠。