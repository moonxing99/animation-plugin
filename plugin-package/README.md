# MasterGo 动效插件安装指南

## 📦 插件包结构

```
plugin-package/
├── manifest.json      # 插件配置文件
├── index.html         # 插件主入口文件
└── README.md          # 安装说明
```

## 🚀 安装步骤

### 方法一：通过MasterGo插件市场安装（推荐）

1. **打包插件**
   ```bash
   # 在plugin-package目录中
   zip -r animation-plugin.zip *
   ```

2. **上传到MasterGo**
   - 登录MasterGo开发者平台
   - 进入插件管理页面
   - 点击"上传插件"
   - 选择打包好的zip文件
   - 填写插件信息并提交审核

### 方法二：本地开发安装

1. **准备文件**
   - 确保 `manifest.json` 和 `index.html` 在同一目录
   - 文件结构必须正确

2. **在MasterGo中安装**
   - 打开MasterGo
   - 进入插件开发界面（如截图所示）
   - 选择"上传manifest.json文件"
   - 选择 `plugin-package/manifest.json`
   - 点击"下一步"

3. **开发调试**
   - MasterGo会自动加载插件
   - 可以在设计稿中测试插件功能
   - 修改代码后刷新即可看到效果

## 🛠 开发注意事项

### manifest.json 配置说明

```json
{
  "name": "动效插件",           // 插件显示名称
  "id": "animation-effects-plugin", // 插件唯一标识
  "version": "1.0.0",        // 版本号
  "main": "index.html",      // 入口文件
  "permissions": [           // 所需权限
    "read-selection",
    "modify-selection",
    "access-document"
  ]
}
```

### 权限说明

- `read-selection`: 读取选中元素
- `modify-selection`: 修改选中元素
- `access-document`: 访问文档内容

## 🔧 实际集成要点

### 1. MasterGo API调用

在实际开发中，需要替换演示中的模拟功能：

```javascript
// 替换元素选择功能
function getSelectedElements() {
  // 调用MasterGo API获取选中元素
  return mastergo.selection.getElements();
}

// 替换效果应用功能
function applyEffectToElements(elements, effectType) {
  // 调用MasterGo API应用效果
  elements.forEach(element => {
    mastergo.effects.apply(element, effectType);
  });
}
```

### 2. 事件监听

```javascript
// 监听选区变化
mastergo.on('selectionchange', function(selection) {
  updateSelectedElements(selection.elements);
});

// 监听文档变化
mastergo.on('documentchange', function() {
  refreshPluginUI();
});
```

## 🎯 功能实现清单

### 已实现功能
- [x] 插件基础框架
- [x] UI界面设计
- [x] 效果选择系统
- [x] 参数配置面板
- [x] 代码导出功能
- [x] 演示模式

### 待集成功能
- [ ] MasterGo API调用
- [ ] 实际元素选择
- [ ] 真实效果应用
- [ ] 插件状态持久化
- [ ] 错误处理完善

## 📋 测试清单

安装后请测试以下功能：

1. **基础功能**
   - [ ] 插件能否正常加载
   - [ ] UI界面是否正常显示
   - [ ] 按钮点击是否有响应

2. **核心功能**
   - [ ] 元素选择功能
   - [ ] 效果应用功能
   - [ ] 参数调节功能
   - [ ] 代码导出功能

3. **兼容性测试**
   - [ ] 不同操作系统
   - [ ] 不同浏览器
   - [ ] 不同MasterGo版本

## 🆘 常见问题

### Q: 插件无法加载
A: 检查manifest.json格式是否正确，确保所有必需字段都已填写

### Q: 功能无响应
A: 确认已授予相应权限，在MasterGo插件设置中检查权限配置

### Q: 效果不生效
A: 检查MasterGo API调用是否正确，确认元素选择是否准确

## 📞 技术支持

如有问题请联系：
- 邮箱: your-email@example.com
- 文档: https://your-docs-url.com
- 社区: MasterGo开发者社区

---
**注意**: 此为开发版本，实际使用前请根据MasterGo最新API文档进行适配。