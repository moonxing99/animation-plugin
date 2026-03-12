/**
 * 实时预览系统
 * 负责效果的实时预览和交互演示
 */

class PreviewSystem {
  constructor() {
    this.previewArea = null;
    this.currentEffect = null;
    this.isPlaying = false;
    this.previewElements = new Map();
  }

  /**
   * 初始化预览系统
   */
  init() {
    this.previewArea = document.getElementById('preview-area');
    if (!this.previewArea) {
      console.warn('Preview area not found');
      return;
    }
    
    this.setupPreviewArea();
    console.log('PreviewSystem initialized');
  }

  /**
   * 设置预览区域
   */
  setupPreviewArea() {
    this.previewArea.innerHTML = `
      <div class="preview-container">
        <div class="preview-controls">
          <button class="preview-btn primary" id="play-preview">▶️ 播放</button>
          <button class="preview-btn" id="pause-preview">⏸️ 暂停</button>
          <button class="preview-btn" id="reset-preview">🔄 重置</button>
        </div>
        <div class="preview-content" id="preview-content">
          <div class="preview-placeholder">
            <div class="placeholder-icon">🎯</div>
            <p>选择效果后在此预览</p>
            <small>点击左侧效果卡片开始预览</small>
          </div>
        </div>
      </div>
    `;
    
    this.bindControlEvents();
  }

  /**
   * 绑定控制事件
   */
  bindControlEvents() {
    const playBtn = document.getElementById('play-preview');
    const pauseBtn = document.getElementById('pause-preview');
    const resetBtn = document.getElementById('reset-preview');
    
    if (playBtn) playBtn.addEventListener('click', () => this.play());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
  }

  /**
   * 设置预览效果
   */
  setEffect(effectId, parameters = {}) {
    this.currentEffect = { effectId, parameters };
    this.renderPreview(effectId, parameters);
  }

  /**
   * 渲染预览
   */
  renderPreview(effectId, parameters) {
    if (!this.previewArea) return;
    
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;
    
    // 清空之前的预览
    this.clearPreview();
    
    // 根据效果类型创建不同的预览元素
    const previewElement = this.createPreviewElement(effectId, parameters);
    previewContent.appendChild(previewElement);
    
    // 应用效果
    this.applyPreviewEffect(previewElement, effectId, parameters);
  }

  /**
   * 创建预览元素
   */
  createPreviewElement(effectId, parameters) {
    const element = document.createElement('div');
    
    // 根据效果类型设置不同样式
    if (effectId.startsWith('click')) {
      element.className = 'preview-element click-preview';
      element.textContent = '点击我';
      element.style.cssText = `
        width: 120px;
        height: 60px;
        background: linear-gradient(135deg, #4F46E5, #818CF8);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        cursor: pointer;
        margin: 20px auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        user-select: none;
      `;
    } else if (effectId.startsWith('carousel')) {
      element.className = 'preview-element carousel-preview';
      element.innerHTML = this.createCarouselPreview(parameters);
      element.style.cssText = `
        width: 300px;
        height: 200px;
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      `;
    } else if (effectId.startsWith('hover')) {
      element.className = 'preview-element hover-preview';
      element.textContent = '悬停我';
      element.style.cssText = `
        width: 120px;
        height: 60px;
        background: linear-gradient(135deg, #8B5CF6, #A78BFA);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        cursor: pointer;
        margin: 20px auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      `;
    } else {
      // 默认预览元素
      element.className = 'preview-element default-preview';
      element.textContent = effectId.replace(/-/g, ' ');
      element.style.cssText = `
        width: 150px;
        height: 80px;
        background: linear-gradient(135deg, #EC4899, #F472B6);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        margin: 20px auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
    }
    
    return element;
  }

  /**
   * 创建轮播预览
   */
  createCarouselPreview(parameters) {
    return `
      <div class="carousel-container" style="position: relative; width: 100%; height: 100%;">
        <div class="carousel-track" style="display: flex; width: 300%; height: 100%;">
          <div class="carousel-slide" style="flex: 0 0 33.33%; background: linear-gradient(45deg, #FF6B6B, #FF8E8E); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            幻灯片 1
          </div>
          <div class="carousel-slide" style="flex: 0 0 33.33%; background: linear-gradient(45deg, #4ECDC4, #6BDBC6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            幻灯片 2
          </div>
          <div class="carousel-slide" style="flex: 0 0 33.33%; background: linear-gradient(45deg, #45B7D1, #5CC7E1); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            幻灯片 3
          </div>
        </div>
        <div class="carousel-indicators" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
          <div class="indicator active" style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div>
          <div class="indicator" style="width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5);"></div>
          <div class="indicator" style="width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5);"></div>
        </div>
      </div>
    `;
  }

  /**
   * 应用预览效果
   */
  applyPreviewEffect(element, effectId, parameters) {
    // 这里应该调用实际的效果应用逻辑
    // 目前使用简化的实现
    
    if (effectId.startsWith('click')) {
      this.applyClickPreview(element, effectId, parameters);
    } else if (effectId.startsWith('carousel')) {
      this.applyCarouselPreview(element, effectId, parameters);
    } else if (effectId.startsWith('hover')) {
      this.applyHoverPreview(element, effectId, parameters);
    }
    
    // 保存引用以便清理
    this.previewElements.set(effectId, element);
  }

  /**
   * 应用点击预览效果
   */
  applyClickPreview(element, effectId, parameters) {
    // 移除之前的事件监听器
    if (element._previewHandlers) {
      element.removeEventListener('mousedown', element._previewHandlers.mousedown);
      element.removeEventListener('mouseup', element._previewHandlers.mouseup);
      element.removeEventListener('mouseleave', element._previewHandlers.mouseleave);
    }
    
    const handlers = {
      mousedown: () => {
        if (effectId.includes('scale')) {
          element.style.transform = `scale(${parameters.scale || 0.9})`;
        } else if (effectId.includes('color')) {
          element.style.backgroundColor = parameters.backgroundColor || '#10B981';
        } else if (effectId.includes('bounce')) {
          element.style.animation = `preview-bounce 0.3s ease-in-out`;
        }
      },
      mouseup: () => {
        element.style.transform = 'scale(1)';
        element.style.backgroundColor = '';
        element.style.animation = '';
      },
      mouseleave: () => {
        element.style.transform = 'scale(1)';
        element.style.backgroundColor = '';
        element.style.animation = '';
      }
    };
    
    element.addEventListener('mousedown', handlers.mousedown);
    element.addEventListener('mouseup', handlers.mouseup);
    element.addEventListener('mouseleave', handlers.mouseleave);
    
    element._previewHandlers = handlers;
    
    // 添加预览动画关键帧
    this.addPreviewKeyframes();
  }

  /**
   * 应用轮播预览效果
   */
  applyCarouselPreview(element, effectId, parameters) {
    const track = element.querySelector('.carousel-track');
    const indicators = element.querySelectorAll('.indicator');
    
    if (!track || !indicators.length) return;
    
    let currentIndex = 0;
    const slideWidth = 100 / 3; // 3 slides
    
    // 自动轮播
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % 3;
      const translateX = -(currentIndex * slideWidth);
      track.style.transform = `translateX(${translateX}%)`;
      
      // 更新指示器
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }, parameters.interval || 2000);
    
    // 保存定时器引用
    element._carouselInterval = interval;
  }

  /**
   * 应用悬停预览效果
   */
  applyHoverPreview(element, effectId, parameters) {
    element.addEventListener('mouseenter', () => {
      element.style.opacity = parameters.opacity || '0.7';
      element.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  /**
   * 添加预览动画关键帧
   */
  addPreviewKeyframes() {
    const styleId = 'preview-keyframes';
    if (document.getElementById(styleId)) return;
    
    const keyframes = document.createElement('style');
    keyframes.id = styleId;
    keyframes.textContent = `
      @keyframes preview-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    
    document.head.appendChild(keyframes);
  }

  /**
   * 播放预览
   */
  play() {
    this.isPlaying = true;
    const playBtn = document.getElementById('play-preview');
    const pauseBtn = document.getElementById('pause-preview');
    
    if (playBtn) playBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    
    console.log('Preview playing');
  }

  /**
   * 暂停预览
   */
  pause() {
    this.isPlaying = false;
    const playBtn = document.getElementById('play-preview');
    const pauseBtn = document.getElementById('pause-preview');
    
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    
    console.log('Preview paused');
  }

  /**
   * 重置预览
   */
  reset() {
    this.clearPreview();
    this.setupPreviewArea();
    this.isPlaying = false;
    
    const playBtn = document.getElementById('play-preview');
    const pauseBtn = document.getElementById('pause-preview');
    
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    
    console.log('Preview reset');
  }

  /**
   * 清空预览
   */
  clearPreview() {
    if (!this.previewArea) return;
    
    // 清理所有预览元素的事件监听器
    this.previewElements.forEach((element, effectId) => {
      if (element._previewHandlers) {
        element.removeEventListener('mousedown', element._previewHandlers.mousedown);
        element.removeEventListener('mouseup', element._previewHandlers.mouseup);
        element.removeEventListener('mouseleave', element._previewHandlers.mouseleave);
        delete element._previewHandlers;
      }
      
      if (element._carouselInterval) {
        clearInterval(element._carouselInterval);
        delete element._carouselInterval;
      }
    });
    
    this.previewElements.clear();
  }

  /**
   * 销毁预览系统
   */
  destroy() {
    this.clearPreview();
    this.previewArea = null;
    this.currentEffect = null;
    this.isPlaying = false;
    console.log('PreviewSystem destroyed');
  }
}

// 导出单例实例
export default new PreviewSystem();