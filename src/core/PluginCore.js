/**
 * 插件核心管理器
 * 负责插件的基础功能、状态管理和事件系统
 */

class PluginCore {
  constructor() {
    this.config = {
      // 默认配置
      animationDuration: 300,
      easingFunction: 'ease-in-out',
      autoPreview: true,
      codeExportFormat: 'css'
    };
    
    this.state = {
      selectedElements: [],
      currentEffect: null,
      isPreviewMode: false,
      history: []
    };
    
    this.eventListeners = new Map();
    this.masterGoAPI = null;
  }

  /**
   * 初始化插件核心
   */
  async init() {
    try {
      // 尝试连接MasterGo API
      await this.connectToMasterGo();
      
      // 加载本地配置
      this.loadLocalConfig();
      
      // 初始化事件系统
      this.initEventSystem();
      
      console.log('PluginCore initialized');
    } catch (error) {
      console.error('PluginCore initialization failed:', error);
      throw error;
    }
  }

  /**
   * 连接到MasterGo API
   */
  async connectToMasterGo() {
    // 模拟MasterGo API连接
    // 实际开发中需要根据MasterGo提供的API文档实现
    this.masterGoAPI = {
      getSelectedElements: () => [],
      applyEffect: (element, effect) => {},
      previewEffect: (effect) => {}
    };
    
    // 监听选区变化
    setInterval(() => {
      this.checkSelectionChange();
    }, 100);
  }

  /**
   * 检查选区是否发生变化
   */
  checkSelectionChange() {
    // 模拟选区变化检测
    const currentSelection = this.masterGoAPI.getSelectedElements();
    if (JSON.stringify(currentSelection) !== JSON.stringify(this.state.selectedElements)) {
      this.state.selectedElements = currentSelection;
      this.emit('selectionChange', currentSelection);
    }
  }

  /**
   * 加载本地配置
   */
  loadLocalConfig() {
    try {
      const savedConfig = localStorage.getItem('mastergo-animation-config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('Failed to load local config:', error);
    }
  }

  /**
   * 保存配置到本地
   */
  saveConfig() {
    try {
      localStorage.setItem('mastergo-animation-config', JSON.stringify(this.config));
      this.emit('configChange', this.config);
    } catch (error) {
      console.warn('Failed to save config:', error);
    }
  }

  /**
   * 初始化事件系统
   */
  initEventSystem() {
    // 事件系统已通过Map初始化
  }

  /**
   * 添加事件监听器
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * 移除事件监听器
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * 设置配置
   */
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  /**
   * 获取当前状态
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 更新状态
   */
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.addToHistory(this.state);
  }

  /**
   * 添加到历史记录
   */
  addToHistory(state) {
    this.state.history.push(JSON.parse(JSON.stringify(state)));
    // 限制历史记录数量
    if (this.state.history.length > 50) {
      this.state.history.shift();
    }
  }

  /**
   * 撤销操作
   */
  undo() {
    if (this.state.history.length > 1) {
      this.state.history.pop(); // 移除当前状态
      const previousState = this.state.history[this.state.history.length - 1];
      this.state = { ...previousState };
      return true;
    }
    return false;
  }

  /**
   * 销毁插件核心
   */
  destroy() {
    this.eventListeners.clear();
    this.saveConfig();
    console.log('PluginCore destroyed');
  }
}

export default PluginCore;