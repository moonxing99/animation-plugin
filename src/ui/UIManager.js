/**
 * UI管理器
 * 负责用户界面的渲染和交互处理
 */

class UIManager {
  constructor() {
    this.pluginCore = null;
    this.container = null;
    this.currentView = 'main'; // main, effects, preview, export
  }

  /**
   * 初始化UI管理器
   */
  async init(pluginCore) {
    this.pluginCore = pluginCore;
    this.container = document.getElementById('plugin-container');
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    console.log('UIManager initialized');
  }

  /**
   * 渲染主界面
   */
  render() {
    return `
      <div class="plugin-wrapper">
        ${this.renderHeader()}
        ${this.renderMainContent()}
        ${this.renderFooter()}
      </div>
    `;
  }

  /**
   * 渲染头部
   */
  renderHeader() {
    return `
      <header class="plugin-header">
        <div class="header-title">
          <h1>动效插件</h1>
          <span class="version">v1.0</span>
        </div>
        <div class="header-actions">
          ${this.renderViewSwitcher()}
        </div>
      </header>
    `;
  }

  /**
   * 渲染视图切换器
   */
  renderViewSwitcher() {
    const views = [
      { id: 'main', label: '主界面', icon: '🏠' },
      { id: 'effects', label: '效果库', icon: '✨' },
      { id: 'preview', label: '预览', icon: '👁️' },
      { id: 'export', label: '导出', icon: '📦' }
    ];

    return `
      <div class="view-switcher">
        ${views.map(view => `
          <button 
            class="view-btn ${this.currentView === view.id ? 'active' : ''}"
            data-view="${view.id}"
            onclick="window.masterGoPlugin.uiManager.switchView('${view.id}')"
          >
            <span class="view-icon">${view.icon}</span>
            <span class="view-label">${view.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  /**
   * 渲染主要内容区域
   */
  renderMainContent() {
    switch (this.currentView) {
      case 'main':
        return this.renderMainView();
      case 'effects':
        return this.renderEffectsView();
      case 'preview':
        return this.renderPreviewView();
      case 'export':
        return this.renderExportView();
      default:
        return this.renderMainView();
    }
  }

  /**
   * 渲染主视图
   */
  renderMainView() {
    return `
      <main class="main-content">
        <div class="selection-panel">
          <h2>选区状态</h2>
          <div class="selection-info" id="selection-info">
            <p>请选择要添加动效的元素</p>
          </div>
        </div>

        <div class="effects-panel">
          <h2>常用效果</h2>
          <div class="effects-grid" id="effects-grid">
            ${this.renderQuickEffects()}
          </div>
        </div>

        <div class="config-panel">
          <h2>参数设置</h2>
          <div class="config-form" id="config-form">
            ${this.renderConfigForm()}
          </div>
        </div>
      </main>
    `;
  }

  /**
   * 渲染快捷效果按钮
   */
  renderQuickEffects() {
    const effects = [
      { id: 'click-scale', name: '点击缩放', icon: '🖱️' },
      { id: 'hover-fade', name: '悬停淡入', icon: '👆' },
      { id: 'slide-in', name: '滑入效果', icon: '➡️' },
      { id: 'carousel', name: '轮播效果', icon: '🔄' }
    ];

    return effects.map(effect => `
      <button class="effect-card" data-effect="${effect.id}">
        <div class="effect-icon">${effect.icon}</div>
        <div class="effect-name">${effect.name}</div>
      </button>
    `).join('');
  }

  /**
   * 渲染配置表单
   */
  renderConfigForm() {
    const config = this.pluginCore.getConfig();
    
    return `
      <div class="form-group">
        <label for="duration">动画时长 (ms)</label>
        <input type="range" id="duration" min="100" max="2000" value="${config.animationDuration}" 
               oninput="window.masterGoPlugin.uiManager.updateConfig('animationDuration', this.value)">
        <span class="config-value">${config.animationDuration}ms</span>
      </div>

      <div class="form-group">
        <label for="easing">缓动函数</label>
        <select id="easing" onchange="window.masterGoPlugin.uiManager.updateConfig('easingFunction', this.value)">
          <option value="ease-in-out" ${config.easingFunction === 'ease-in-out' ? 'selected' : ''}>ease-in-out</option>
          <option value="ease-in" ${config.easingFunction === 'ease-in' ? 'selected' : ''}>ease-in</option>
          <option value="ease-out" ${config.easingFunction === 'ease-out' ? 'selected' : ''}>ease-out</option>
          <option value="linear" ${config.easingFunction === 'linear' ? 'selected' : ''}>linear</option>
        </select>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" id="auto-preview" ${config.autoPreview ? 'checked' : ''}
                 onchange="window.masterGoPlugin.uiManager.updateConfig('autoPreview', this.checked)">
          实时预览
        </label>
      </div>
    `;
  }

  /**
   * 渲染效果库视图
   */
  renderEffectsView() {
    return `
      <main class="effects-content">
        <div class="effects-categories">
          <h2>效果分类</h2>
          <div class="category-list">
            <button class="category-btn active">全部效果</button>
            <button class="category-btn">点击效果</button>
            <button class="category-btn">悬停效果</button>
            <button class="category-btn">页面切换</button>
            <button class="category-btn">轮播效果</button>
          </div>
        </div>
        
        <div class="effects-gallery">
          <h2>效果预览</h2>
          <div class="gallery-grid">
            <!-- 效果预览卡片将在这里动态生成 -->
          </div>
        </div>
      </main>
    `;
  }

  /**
   * 渲染预览视图
   */
  renderPreviewView() {
    return `
      <main class="preview-content">
        <div class="preview-controls">
          <button class="preview-btn primary" onclick="window.masterGoPlugin.uiManager.playPreview()">
            ▶️ 播放预览
          </button>
          <button class="preview-btn" onclick="window.masterGoPlugin.uiManager.pausePreview()">
            ⏸️ 暂停
          </button>
          <button class="preview-btn" onclick="window.masterGoPlugin.uiManager.resetPreview()">
            🔄 重置
          </button>
        </div>
        
        <div class="preview-area" id="preview-area">
          <div class="preview-placeholder">
            <p>选择效果后在此预览</p>
          </div>
        </div>
      </main>
    `;
  }

  /**
   * 渲染导出视图
   */
  renderExportView() {
    return `
      <main class="export-content">
        <div class="export-options">
          <h2>导出选项</h2>
          <div class="export-formats">
            <label>
              <input type="radio" name="export-format" value="css" checked> CSS动画
            </label>
            <label>
              <input type="radio" name="export-format" value="js"> JavaScript
            </label>
            <label>
              <input type="radio" name="export-format" value="html"> 完整HTML
            </label>
          </div>
        </div>
        
        <div class="export-preview">
          <h2>代码预览</h2>
          <pre class="code-preview" id="code-preview"></pre>
        </div>
        
        <div class="export-actions">
          <button class="export-btn primary" onclick="window.masterGoPlugin.uiManager.exportCode()">
            📋 复制代码
          </button>
          <button class="export-btn" onclick="window.masterGoPlugin.uiManager.downloadCode()">
            💾 下载文件
          </button>
        </div>
      </main>
    `;
  }

  /**
   * 渲染底部
   */
  renderFooter() {
    return `
      <footer class="plugin-footer">
        <div class="footer-info">
          <span>MasterGo 动效插件</span>
          <span>•</span>
          <span>v1.0.0</span>
        </div>
        <div class="footer-actions">
          <button class="action-btn" onclick="window.masterGoPlugin.uiManager.showHelp()">
            ❓ 帮助
          </button>
          <button class="action-btn" onclick="window.masterGoPlugin.uiManager.showSettings()">
            ⚙️ 设置
          </button>
        </div>
      </footer>
    `;
  }

  /**
   * 切换视图
   */
  switchView(viewId) {
    this.currentView = viewId;
    this.container.innerHTML = this.render();
    
    // 重新绑定事件监听器
    this.bindEvents();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 绑定效果卡片点击事件
    const effectCards = this.container.querySelectorAll('.effect-card');
    effectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const effectId = e.currentTarget.dataset.effect;
        this.selectEffect(effectId);
      });
    });
  }

  /**
   * 选择效果
   */
  selectEffect(effectId) {
    // 移除之前选中的效果卡片的active状态
    this.container.querySelectorAll('.effect-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // 添加当前选中效果卡片的active状态
    const selectedCard = this.container.querySelector(`[data-effect="${effectId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('active');
    }
    
    // 通知插件核心
    this.pluginCore.updateState({ currentEffect: effectId });
    
    // 如果启用了实时预览，则立即预览
    if (this.pluginCore.getConfig().autoPreview) {
      this.previewEffect(effectId);
    }
  }

  /**
   * 预览效果
   */
  previewEffect(effectId) {
    // 这里会调用效果管理器来预览效果
    console.log('Previewing effect:', effectId);
  }

  /**
   * 更新配置
   */
  updateConfig(key, value) {
    const config = this.pluginCore.getConfig();
    config[key] = value;
    this.pluginCore.setConfig(config);
    
    // 更新UI显示
    if (key === 'animationDuration') {
      const valueElement = this.container.querySelector('.config-value');
      if (valueElement) {
        valueElement.textContent = `${value}ms`;
      }
    }
  }

  /**
   * 更新选区信息
   */
  updateSelection(selectedElements) {
    const selectionInfo = this.container.querySelector('#selection-info');
    if (selectionInfo) {
      if (selectedElements && selectedElements.length > 0) {
        selectionInfo.innerHTML = `
          <p>已选择 ${selectedElements.length} 个元素</p>
          <ul>
            ${selectedElements.map(el => `<li>${el.name || '未命名元素'}</li>`).join('')}
          </ul>
        `;
      } else {
        selectionInfo.innerHTML = '<p>请选择要添加动效的元素</p>';
      }
    }
  }

  /**
   * 播放预览
   */
  playPreview() {
    console.log('Playing preview');
  }

  /**
   * 暂停预览
   */
  pausePreview() {
    console.log('Pausing preview');
  }

  /**
   * 重置预览
   */
  resetPreview() {
    console.log('Resetting preview');
  }

  /**
   * 导出代码
   */
  exportCode() {
    console.log('Exporting code');
  }

  /**
   * 下载代码
   */
  downloadCode() {
    console.log('Downloading code');
  }

  /**
   * 显示帮助
   */
  showHelp() {
    alert('帮助文档功能待实现');
  }

  /**
   * 显示设置
   */
  showSettings() {
    alert('设置功能待实现');
  }

  /**
   * 销毁UI管理器
   */
  destroy() {
    // 清理事件监听器等
    console.log('UIManager destroyed');
  }
}

export default UIManager;