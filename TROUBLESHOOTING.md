# MasterGo 动效插件安装故障排除指南

## 🚨 常见错误及解决方案

### 错误1: "无法读取main文件"

**问题原因**: 
- manifest.json中的main字段指向的文件不存在
- 文件路径配置错误
- 插件包结构不符合MasterGo要求

**解决方案**:
1. 确认manifest.json配置正确:
```json
{
  "main": "src/index.html"  // 确保路径正确
}
```

2. 检查文件结构:
```
plugin/
├── manifest.json
└── src/
    └── index.html
```

3. 使用我们提供的标准包:
   - `standard-animation-plugin.zip` (推荐)
   - 或者 `plugin-package/` 目录

### 错误2: 插件加载空白

**问题原因**:
- HTML文件中有语法错误
- JavaScript执行出错
- 缺少必要的权限

**解决方案**:
1. 检查浏览器开发者工具控制台
2. 确认所有文件都已正确打包
3. 验证manifest.json权限配置

### 错误3: 功能无响应

**问题原因**:
- JavaScript事件绑定失败
- API调用错误
- DOM元素未正确加载

**解决方案**:
1. 检查JavaScript控制台错误
2. 确认DOM元素ID匹配
3. 验证事件监听器绑定

## 📦 推荐安装包

### 方案一: 标准插件包 (推荐)
文件: `standard-animation-plugin.zip`
特点:
- 符合MasterGo标准结构
- 简化的核心功能
- 稳定的代码实现

### 方案二: 完整功能包
文件: `animation-plugin.zip`
特点:
- 完整的功能实现
- 丰富的UI界面
- 更多效果选项

## 🔧 手动安装步骤

### 1. 解压插件包
```bash
unzip standard-animation-plugin.zip -d my-plugin
```

### 2. 验证文件结构
```
my-plugin/
├── manifest.json
├── src/
│   └── index.html
└── assets/
```

### 3. 在MasterGo中安装
1. 打开MasterGo插件开发界面
2. 选择"上传manifest.json"
3. 选择 `my-plugin/manifest.json`
4. 点击"下一步"

## 🎯 测试清单

安装后请按顺序测试:

### 基础测试
- [ ] 插件能否正常加载
- [ ] UI界面是否完整显示
- [ ] 所有按钮是否可点击

### 功能测试
- [ ] 元素选择功能
- [ ] 效果选择功能
- [ ] 参数调节功能
- [ ] 代码导出功能

### 兼容性测试
- [ ] 不同操作系统
- [ ] 不同浏览器版本
- [ ] 不同MasterGo版本

## 🆘 紧急联系方式

如果以上方案都无法解决问题:

1. **技术支持邮箱**: support@example.com
2. **GitHub Issues**: [项目链接]
3. **MasterGo开发者社区**: [社区链接]

## 📋 版本信息

- **当前版本**: v1.0.0
- **兼容性**: MasterGo v1.0+
- **最后更新**: 2026年3月12日

---
**注意**: 建议优先使用 `standard-animation-plugin.zip` 这个精简版本进行首次安装测试。