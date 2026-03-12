/**
 * 效果管理器
 * 负责各种动画效果的定义、应用和管理
 */

// 导入效果组件
import ClickEffect from '../components/ClickEffect.js';
import CarouselEffect from '../components/CarouselEffect.js';

class EffectManager {
  constructor() {
    this.pluginCore = null;
    this.effects = new Map();
    this.appliedEffects = new Map();
    this.previewMode = false;
  }

  /**
   * 初始化效果管理器
   */
  async init(pluginCore) {
    this.pluginCore = pluginCore;
    
    // 注册内置效果
    this.registerBuiltInEffects();
    
    console.log('EffectManager initialized with', this.effects.size, 'effects');
  }

  /**
   * 注册内置效果
   */
  registerBuiltInEffects() {
    // 点击缩放效果
    this.registerEffect('click-scale', {
      name: '点击缩放',
      category: 'click',
      description: '元素被点击时产生缩放效果',
      parameters: {
        scale: { type: 'number', default: 0.9, min: 0.5, max: 1.5 },
        duration: { type: 'number', default: 200, min: 50, max: 1000 }
      },
      apply: this.applyClickScale.bind(this),
      generateCSS: this.generateClickScaleCSS.bind(this),
      generateJS: this.generateClickScaleJS.bind(this)
    });

    // 悬停淡入效果
    this.registerEffect('hover-fade', {
      name: '悬停淡入',
      category: 'hover',
      description: '鼠标悬停时元素淡入显示',
      parameters: {
        opacity: { type: 'number', default: 1, min: 0, max: 1 },
        duration: { type: 'number', default: 300, min: 100, max: 2000 }
      },
      apply: this.applyHoverFade.bind(this),
      generateCSS: this.generateHoverFadeCSS.bind(this),
      generateJS: this.generateHoverFadeJS.bind(this)
    });

    // 滑入效果
    this.registerEffect('slide-in', {
      name: '滑入效果',
      category: 'transition',
      description: '元素从指定方向滑入显示',
      parameters: {
        direction: { type: 'select', default: 'left', options: ['left', 'right', 'top', 'bottom'] },
        distance: { type: 'number', default: 100, min: 0, max: 500 },
        duration: { type: 'number', default: 500, min: 100, max: 3000 }
      },
      apply: this.applySlideIn.bind(this),
      generateCSS: this.generateSlideInCSS.bind(this),
      generateJS: this.generateSlideInJS.bind(this)
    });

    // 轮播效果
    this.registerEffect('carousel', {
      name: '轮播效果',
      category: 'carousel',
      description: '多个元素轮播展示',
      parameters: {
        autoplay: { type: 'boolean', default: true },
        interval: { type: 'number', default: 3000, min: 1000, max: 10000 },
        indicators: { type: 'boolean', default: true }
      },
      apply: this.applyCarousel.bind(this),
      generateCSS: this.generateCarouselCSS.bind(this),
      generateJS: this.generateCarouselJS.bind(this)
    });
  }

  /**
   * 注册新的效果
   */
  registerEffect(id, effectDefinition) {
    this.effects.set(id, {
      id,
      ...effectDefinition,
      createdAt: new Date()
    });
  }

  /**
   * 获取所有效果
   */
  getAllEffects() {
    return Array.from(this.effects.values());
  }

  /**
   * 根据分类获取效果
   */
  getEffectsByCategory(category) {
    return this.getAllEffects().filter(effect => effect.category === category);
  }

  /**
   * 获取效果定义
   */
  getEffect(id) {
    return this.effects.get(id);
  }

  /**
   * 应用效果到元素
   */
  applyEffect(element, effectId, parameters = {}) {
    const effect = this.getEffect(effectId);
    if (!effect) {
      throw new Error(`Effect ${effectId} not found`);
    }

    // 合并默认参数和传入参数
    const finalParams = { ...effect.parameters, ...parameters };
    
    // 应用效果
    effect.apply(element, finalParams);
    
    // 记录已应用的效果
    if (!this.appliedEffects.has(element.id)) {
      this.appliedEffects.set(element.id, []);
    }
    this.appliedEffects.get(element.id).push({
      effectId,
      parameters: finalParams,
      appliedAt: new Date()
    });

    return true;
  }

  /**
   * 更新可用效果列表（根据选中元素类型）
   */
  updateAvailableEffects(selectedElements) {
    // 根据选中元素的类型和属性，过滤出适用的效果
    // 这里可以根据实际需求实现更复杂的逻辑
    console.log('Updating available effects for', selectedElements.length, 'elements');
  }

  /**
   * 应用配置到所有效果
   */
  applyConfig(config) {
    // 当全局配置改变时，更新所有效果的默认参数
    this.effects.forEach(effect => {
      if (effect.parameters.duration) {
        effect.parameters.duration.default = config.animationDuration;
      }
      if (effect.parameters.easing) {
        effect.parameters.easing.default = config.easingFunction;
      }
    });
  }

  // === 具体效果实现 ===

  /**
   * 点击缩放效果实现
   */
  applyClickScale(element, params) {
    // 移除之前的事件监听器
    if (element._scaleHandler) {
      element.removeEventListener('mousedown', element._scaleHandler);
      element.removeEventListener('mouseup', element._scaleHandler);
      element.removeEventListener('mouseleave', element._scaleHandler);
    }

    // 创建新的事件处理器
    const handleMouseDown = () => {
      element.style.transform = `scale(${params.scale})`;
      element.style.transition = `transform ${params.duration}ms ease-in-out`;
    };

    const handleMouseUp = () => {
      element.style.transform = 'scale(1)';
    };

    // 绑定事件
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    // 保存引用以便清理
    element._scaleHandler = { handleMouseDown, handleMouseUp };
  }

  /**
   * 生成点击缩放CSS代码
   */
  generateClickScaleCSS(params) {
    return `
      .click-scale-effect {
        transition: transform ${params.duration}ms ease-in-out;
        cursor: pointer;
      }
      
      .click-scale-effect:active {
        transform: scale(${params.scale});
      }
    `;
  }

  /**
   * 生成点击缩放JavaScript代码
   */
  generateClickScaleJS(params) {
    return `
      function applyClickScale(element) {
        element.addEventListener('mousedown', function() {
          this.style.transform = 'scale(${params.scale})';
        });
        
        element.addEventListener('mouseup', function() {
          this.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
      }
    `;
  }

  /**
   * 悬停淡入效果实现
   */
  applyHoverFade(element, params) {
    // 设置初始状态
    element.style.opacity = '0';
    element.style.transition = `opacity ${params.duration}ms ease-in-out`;
    
    // 移除之前的事件监听器
    if (element._fadeHandler) {
      element.removeEventListener('mouseenter', element._fadeHandler);
      element.removeEventListener('mouseleave', element._fadeHandler);
    }

    // 创建事件处理器
    const handleMouseEnter = () => {
      element.style.opacity = params.opacity.toString();
    };

    const handleMouseLeave = () => {
      element.style.opacity = '0';
    };

    // 绑定事件
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // 保存引用
    element._fadeHandler = { handleMouseEnter, handleMouseLeave };
  }

  /**
   * 生成悬停淡入CSS代码
   */
  generateHoverFadeCSS(params) {
    return `
      .hover-fade-effect {
        opacity: 0;
        transition: opacity ${params.duration}ms ease-in-out;
      }
      
      .hover-fade-effect:hover {
        opacity: ${params.opacity};
      }
    `;
  }

  /**
   * 生成悬停淡入JavaScript代码
   */
  generateHoverFadeJS(params) {
    return `
      function applyHoverFade(element) {
        element.style.opacity = '0';
        
        element.addEventListener('mouseenter', function() {
          this.style.opacity = '${params.opacity}';
        });
        
        element.addEventListener('mouseleave', function() {
          this.style.opacity = '0';
        });
      }
    `;
  }

  /**
   * 滑入效果实现
   */
  applySlideIn(element, params) {
    // 设置初始位置
    const directions = {
      left: { transform: `translateX(-${params.distance}px)` },
      right: { transform: `translateX(${params.distance}px)` },
      top: { transform: `translateY(-${params.distance}px)` },
      bottom: { transform: `translateY(${params.distance}px)` }
    };

    const initialStyle = directions[params.direction] || directions.left;
    element.style.transform = initialStyle.transform;
    element.style.opacity = '0';
    element.style.transition = `all ${params.duration}ms ease-in-out`;

    // 延迟一段时间后执行动画
    setTimeout(() => {
      element.style.transform = 'translateX(0) translateY(0)';
      element.style.opacity = '1';
    }, 100);
  }

  /**
   * 生成滑入效果CSS代码
   */
  generateSlideInCSS(params) {
    const directions = {
      left: `-translateX(${params.distance}px)`,
      right: `translateX(${params.distance}px)`,
      top: `-translateY(${params.distance}px)`,
      bottom: `translateY(${params.distance}px)`
    };

    const transformValue = directions[params.direction] || directions.left;

    return `
      .slide-in-effect {
        transform: ${transformValue};
        opacity: 0;
        transition: all ${params.duration}ms ease-in-out;
      }
      
      .slide-in-effect.animate {
        transform: translateX(0) translateY(0);
        opacity: 1;
      }
    `;
  }

  /**
   * 生成滑入效果JavaScript代码
   */
  generateSlideInJS(params) {
    return `
      function applySlideIn(element) {
        // 初始状态设置
        element.style.opacity = '0';
        
        // 延迟执行动画
        setTimeout(function() {
          element.style.opacity = '1';
          element.classList.add('animate');
        }, 100);
      }
    `;
  }

  /**
   * 轮播效果实现
   */
  applyCarousel(container, params) {
    // 这是一个更复杂的效果，需要容器和多个子元素
    console.log('Applying carousel effect to container:', container);
    // 具体实现将在后续完善
  }

  /**
   * 生成轮播效果CSS代码
   */
  generateCarouselCSS(params) {
    return `
      /* 轮播效果CSS代码将在这里生成 */
      .carousel-container {
        position: relative;
        overflow: hidden;
      }
    `;
  }

  /**
   * 生成轮播效果JavaScript代码
   */
  generateCarouselJS(params) {
    return `
      /* 轮播效果JavaScript代码将在这里生成 */
      function initCarousel(container) {
        // 轮播初始化逻辑
      }
    `;
  }

  /**
   * 预览效果
   */
  previewEffect(effectId, parameters = {}) {
    const effect = this.getEffect(effectId);
    if (!effect) return;

    // 创建预览元素
    const previewArea = document.getElementById('preview-area');
    if (!previewArea) return;

    // 清空预览区域
    previewArea.innerHTML = '';

    // 创建预览元素
    const previewElement = document.createElement('div');
    previewElement.className = 'preview-element';
    previewElement.textContent = effect.name;
    previewElement.style.cssText = `
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, #4F46E5, #818CF8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      cursor: pointer;
      margin: 20px auto;
    `;

    previewArea.appendChild(previewElement);

    // 应用效果
    effect.apply(previewElement, parameters);
  }

  /**
   * 生成代码
   */
  generateCode(effectId, format = 'css') {
    const effect = this.getEffect(effectId);
    if (!effect) return '';

    const config = this.pluginCore.getConfig();
    const params = {};
    
    // 从效果参数中提取默认值
    Object.keys(effect.parameters).forEach(key => {
      params[key] = effect.parameters[key].default;
    });

    // 应用全局配置
    if (params.duration) {
      params.duration = config.animationDuration;
    }
    if (params.easing) {
      params.easing = config.easingFunction;
    }

    switch (format) {
      case 'css':
        return effect.generateCSS(params);
      case 'js':
        return effect.generateJS(params);
      case 'html':
        return this.generateFullHTML(effect, params);
      default:
        return effect.generateCSS(params);
    }
  }

  /**
   * 生成完整的HTML示例
   */
  generateFullHTML(effect, params) {
    const cssCode = effect.generateCSS(params);
    const jsCode = effect.generateJS(params);
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${effect.name} 效果示例</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    <div class="${effect.id}-effect" id="demo-element">
        ${effect.name} 示例
    </div>
    
    <script>
        ${jsCode}
        
        // 应用效果到元素
        document.addEventListener('DOMContentLoaded', function() {
            const element = document.getElementById('demo-element');
            apply${effect.name.replace(/\s/g, '')}(element);
        });
    </script>
</body>
</html>
    `;
  }

  /**
   * 销毁效果管理器
   */
  destroy() {
    // 清理所有应用的效果和事件监听器
    this.appliedEffects.clear();
    this.effects.clear();
    console.log('EffectManager destroyed');
  }
}

export default EffectManager;