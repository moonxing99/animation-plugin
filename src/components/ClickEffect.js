/**
 * 点击效果组件
 * 提供多种点击交互效果
 */

class ClickEffect {
  constructor() {
    this.effects = new Map();
    this.initEffects();
  }

  /**
   * 初始化点击效果
   */
  initEffects() {
    // 1. 基础缩放效果
    this.effects.set('scale', {
      name: '缩放效果',
      apply: this.applyScaleEffect.bind(this),
      generateCSS: this.generateScaleCSS.bind(this),
      generateJS: this.generateScaleJS.bind(this),
      parameters: {
        scale: { default: 0.95, min: 0.5, max: 1.5, step: 0.05 },
        duration: { default: 150, min: 50, max: 500, step: 10 },
        easing: { default: 'ease-in-out', options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] }
      }
    });

    // 2. 颜色变化效果
    this.effects.set('color-change', {
      name: '颜色变化',
      apply: this.applyColorChangeEffect.bind(this),
      generateCSS: this.generateColorChangeCSS.bind(this),
      generateJS: this.generateColorChangeJS.bind(this),
      parameters: {
        backgroundColor: { default: '#4F46E5', type: 'color' },
        textColor: { default: '#ffffff', type: 'color' },
        duration: { default: 200, min: 50, max: 1000, step: 10 }
      }
    });

    // 3. 波纹效果
    this.effects.set('ripple', {
      name: '波纹效果',
      apply: this.applyRippleEffect.bind(this),
      generateCSS: this.generateRippleCSS.bind(this),
      generateJS: this.generateRippleJS.bind(this),
      parameters: {
        color: { default: 'rgba(79, 70, 229, 0.3)', type: 'color' },
        duration: { default: 600, min: 200, max: 1500, step: 50 }
      }
    });

    // 4. 弹跳效果
    this.effects.set('bounce', {
      name: '弹跳效果',
      apply: this.applyBounceEffect.bind(this),
      generateCSS: this.generateBounceCSS.bind(this),
      generateJS: this.generateBounceJS.bind(this),
      parameters: {
        intensity: { default: 5, min: 1, max: 20, step: 1 },
        duration: { default: 300, min: 100, max: 800, step: 20 }
      }
    });
  }

  /**
   * 应用缩放效果
   */
  applyScaleEffect(element, params) {
    // 清理之前的事件监听器
    this.cleanupEffect(element, 'scale');

    const handleMouseDown = () => {
      element.style.transform = `scale(${params.scale})`;
    };

    const handleMouseUp = () => {
      element.style.transform = 'scale(1)';
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    // 保存事件处理器引用
    element._scaleHandlers = { handleMouseDown, handleMouseUp };
  }

  /**
   * 生成缩放效果CSS
   */
  generateScaleCSS(params) {
    return `
      .click-scale {
        transition: transform ${params.duration}ms ${params.easing};
        cursor: pointer;
        user-select: none;
      }
      
      .click-scale:active {
        transform: scale(${params.scale});
      }
    `;
  }

  /**
   * 生成缩放效果JavaScript
   */
  generateScaleJS(params) {
    return `
      function applyScaleEffect(element) {
        element.addEventListener('mousedown', function(e) {
          this.style.transform = 'scale(${params.scale})';
        });
        
        element.addEventListener('mouseup', function(e) {
          this.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mouseleave', function(e) {
          this.style.transform = 'scale(1)';
        });
      }
    `;
  }

  /**
   * 应用颜色变化效果
   */
  applyColorChangeEffect(element, params) {
    this.cleanupEffect(element, 'color-change');

    // 保存原始样式
    const originalBg = getComputedStyle(element).backgroundColor;
    const originalColor = getComputedStyle(element).color;

    const handleMouseDown = () => {
      element.style.backgroundColor = params.backgroundColor;
      element.style.color = params.textColor;
      element.style.transition = `all ${params.duration}ms ease-in-out`;
    };

    const handleMouseUp = () => {
      element.style.backgroundColor = originalBg;
      element.style.color = originalColor;
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    element._colorChangeHandlers = { handleMouseDown, handleMouseUp, originalBg, originalColor };
  }

  /**
   * 生成颜色变化CSS
   */
  generateColorChangeCSS(params) {
    return `
      .click-color-change {
        transition: all ${params.duration}ms ease-in-out;
        cursor: pointer;
        user-select: none;
      }
      
      .click-color-change:active {
        background-color: ${params.backgroundColor} !important;
        color: ${params.textColor} !important;
      }
    `;
  }

  /**
   * 生成颜色变化JavaScript
   */
  generateColorChangeJS(params) {
    return `
      function applyColorChangeEffect(element) {
        const originalBg = getComputedStyle(element).backgroundColor;
        const originalColor = getComputedStyle(element).color;
        
        element.addEventListener('mousedown', function() {
          this.style.backgroundColor = '${params.backgroundColor}';
          this.style.color = '${params.textColor}';
        });
        
        element.addEventListener('mouseup', function() {
          this.style.backgroundColor = originalBg;
          this.style.color = originalColor;
        });
        
        element.addEventListener('mouseleave', function() {
          this.style.backgroundColor = originalBg;
          this.style.color = originalColor;
        });
      }
    `;
  }

  /**
   * 应用波纹效果
   */
  applyRippleEffect(element, params) {
    this.cleanupEffect(element, 'ripple');

    const handleClick = (e) => {
      // 创建波纹元素
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.backgroundColor = params.color;
      ripple.style.animationDuration = params.duration + 'ms';

      // 设置波纹位置
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      // 添加波纹到元素
      element.appendChild(ripple);

      // 移除波纹
      setTimeout(() => {
        ripple.remove();
      }, params.duration);
    };

    element.addEventListener('click', handleClick);
    element._rippleHandler = handleClick;
    element.style.overflow = 'hidden';
    element.style.position = 'relative';
  }

  /**
   * 生成波纹效果CSS
   */
  generateRippleCSS(params) {
    return `
      .click-ripple {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation ${params.duration}ms linear;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
  }

  /**
   * 生成波纹效果JavaScript
   */
  generateRippleJS(params) {
    return `
      function applyRippleEffect(element) {
        element.style.overflow = 'hidden';
        element.style.position = 'relative';
        
        element.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.backgroundColor = '${params.color}';
          ripple.style.animationDuration = '${params.duration}ms';
          
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, ${params.duration});
        });
      }
    `;
  }

  /**
   * 应用弹跳效果
   */
  applyBounceEffect(element, params) {
    this.cleanupEffect(element, 'bounce');

    let bounceCount = 0;
    const maxBounces = 3;

    const handleClick = () => {
      if (bounceCount >= maxBounces) return;
      
      bounceCount++;
      
      // 应用弹跳动画
      element.style.animation = `bounce-${bounceCount} ${params.duration}ms ease-in-out`;
      
      // 清除动画
      setTimeout(() => {
        element.style.animation = '';
        bounceCount = 0;
      }, params.duration);
    };

    element.addEventListener('click', handleClick);
    element._bounceHandler = handleClick;

    // 添加关键帧样式
    this.addBounceKeyframes(params.intensity);
  }

  /**
   * 添加弹跳关键帧
   */
  addBounceKeyframes(intensity) {
    const styleId = 'bounce-keyframes';
    if (document.getElementById(styleId)) return;

    const keyframes = document.createElement('style');
    keyframes.id = styleId;
    keyframes.textContent = `
      @keyframes bounce-1 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${intensity}px); }
      }
      
      @keyframes bounce-2 {
        0%, 100% { transform: translateY(0); }
        33% { transform: translateY(-${intensity * 0.7}px); }
        66% { transform: translateY(-${intensity * 0.3}px); }
      }
      
      @keyframes bounce-3 {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-${intensity * 0.5}px); }
        50% { transform: translateY(-${intensity * 0.2}px); }
        75% { transform: translateY(-${intensity * 0.1}px); }
      }
    `;
    
    document.head.appendChild(keyframes);
  }

  /**
   * 生成弹跳效果CSS
   */
  generateBounceCSS(params) {
    return `
      .click-bounce {
        cursor: pointer;
        user-select: none;
      }
      
      .click-bounce:active {
        animation: bounce-1 ${params.duration}ms ease-in-out;
      }
    `;
  }

  /**
   * 生成弹跳效果JavaScript
   */
  generateBounceJS(params) {
    return `
      function applyBounceEffect(element) {
        let bounceCount = 0;
        const maxBounces = 3;
        
        element.addEventListener('click', function() {
          if (bounceCount >= maxBounces) return;
          
          bounceCount++;
          this.style.animation = 'bounce-' + bounceCount + ' ${params.duration}ms ease-in-out';
          
          setTimeout(() => {
            this.style.animation = '';
            bounceCount = 0;
          }, ${params.duration});
        });
      }
    `;
  }

  /**
   * 清理效果事件监听器
   */
  cleanupEffect(element, effectType) {
    switch (effectType) {
      case 'scale':
        if (element._scaleHandlers) {
          element.removeEventListener('mousedown', element._scaleHandlers.handleMouseDown);
          element.removeEventListener('mouseup', element._scaleHandlers.handleMouseUp);
          element.removeEventListener('mouseleave', element._scaleHandlers.handleMouseUp);
          delete element._scaleHandlers;
        }
        break;
        
      case 'color-change':
        if (element._colorChangeHandlers) {
          element.removeEventListener('mousedown', element._colorChangeHandlers.handleMouseDown);
          element.removeEventListener('mouseup', element._colorChangeHandlers.handleMouseUp);
          element.removeEventListener('mouseleave', element._colorChangeHandlers.handleMouseUp);
          delete element._colorChangeHandlers;
        }
        break;
        
      case 'ripple':
        if (element._rippleHandler) {
          element.removeEventListener('click', element._rippleHandler);
          delete element._rippleHandler;
        }
        break;
        
      case 'bounce':
        if (element._bounceHandler) {
          element.removeEventListener('click', element._bounceHandler);
          delete element._bounceHandler;
        }
        break;
    }
  }

  /**
   * 获取所有点击效果
   */
  getAllEffects() {
    return Array.from(this.effects.entries()).map(([id, effect]) => ({
      id,
      name: effect.name,
      parameters: effect.parameters
    }));
  }

  /**
   * 应用指定的点击效果
   */
  applyEffect(element, effectId, parameters = {}) {
    const effect = this.effects.get(effectId);
    if (!effect) {
      throw new Error(`Click effect '${effectId}' not found`);
    }

    // 合并参数
    const finalParams = {};
    Object.keys(effect.parameters).forEach(key => {
      finalParams[key] = parameters[key] !== undefined ? 
        parameters[key] : effect.parameters[key].default;
    });

    return effect.apply(element, finalParams);
  }

  /**
   * 生成指定效果的代码
   */
  generateCode(effectId, format = 'css', parameters = {}) {
    const effect = this.effects.get(effectId);
    if (!effect) return '';

    // 合并参数
    const finalParams = {};
    Object.keys(effect.parameters).forEach(key => {
      finalParams[key] = parameters[key] !== undefined ? 
        parameters[key] : effect.parameters[key].default;
    });

    switch (format.toLowerCase()) {
      case 'css':
        return effect.generateCSS(finalParams);
      case 'js':
      case 'javascript':
        return effect.generateJS(finalParams);
      default:
        return effect.generateCSS(finalParams);
    }
  }
}

// 导出单例实例
export default new ClickEffect();