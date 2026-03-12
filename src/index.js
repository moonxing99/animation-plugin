/**
 * MasterGo 动效插件主入口文件
 * @author Your Name
 * @version 1.0.0
 */

// 导入样式文件
import './styles/main.css';

// 导入核心模块
import PluginCore from './core/PluginCore.js';
import UIManager from './ui/UIManager.js';
import EffectManager from './effects/EffectManager.js';

class MasterGoAnimationPlugin {
  constructor() {
    this.pluginCore = null;
    this.uiManager = null;
    this.effectManager = null;
    this.isInitialized = false;
  }

  /**
   * 初始化插件
   */
  async init() {
    try {
      // 创建核心管理器实例
      this.pluginCore = new PluginCore();
      this.uiManager = new UIManager();
      this.effectManager = new EffectManager();

      // 初始化各个模块
      await this.pluginCore.init();
      await this.uiManager.init(this.pluginCore);
      await this.effectManager.init(this.pluginCore);

      // 绑定事件监听器
      this.bindEvents();

      this.isInitialized = true;
      console.log('MasterGo Animation Plugin initialized successfully');
      
      // 显示主界面
      this.showMainInterface();
      
    } catch (error) {
      console.error('Failed to initialize plugin:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * 绑定全局事件监听器
   */
  bindEvents() {
    // 监听MasterGo选区变化
    this.pluginCore.on('selectionChange', (selectedElements) => {
      this.uiManager.updateSelection(selectedElements);
      this.effectManager.updateAvailableEffects(selectedElements);
    });

    // 监听配置变化
    this.pluginCore.on('configChange', (config) => {
      this.uiManager.updateConfig(config);
      this.effectManager.applyConfig(config);
    });
  }

  /**
   * 显示主界面
   */
  showMainInterface() {
    const container = document.getElementById('plugin-container');
    if (container) {
      container.innerHTML = this.uiManager.render();
    }
  }

  /**
   * 处理初始化错误
   */
  handleInitializationError(error) {
    const container = document.getElementById('plugin-container');
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <h2>插件初始化失败</h2>
          <p>${error.message}</p>
          <button onclick="location.reload()">重新加载</button>
        </div>
      `;
    }
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return this.pluginCore ? this.pluginCore.getConfig() : null;
  }

  /**
   * 设置配置
   */
  setConfig(config) {
    if (this.pluginCore) {
      this.pluginCore.setConfig(config);
    }
  }

  /**
   * 销毁插件实例
   */
  destroy() {
    if (this.pluginCore) {
      this.pluginCore.destroy();
    }
    if (this.uiManager) {
      this.uiManager.destroy();
    }
    if (this.effectManager) {
      this.effectManager.destroy();
    }
    
    this.isInitialized = false;
    console.log('MasterGo Animation Plugin destroyed');
  }
}

// 全局暴露插件实例
window.MasterGoAnimationPlugin = MasterGoAnimationPlugin;

// 当DOM加载完成后初始化插件
document.addEventListener('DOMContentLoaded', async () => {
  const plugin = new MasterGoAnimationPlugin();
  await plugin.init();
  window.masterGoPlugin = plugin; // 便于调试
});

export default MasterGoAnimationPlugin;