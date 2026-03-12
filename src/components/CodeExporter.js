/**
 * 代码导出系统
 * 负责将效果配置转换为可使用的代码
 */

class CodeExporter {
  constructor() {
    this.exportFormats = ['css', 'javascript', 'html'];
    this.currentEffect = null;
    this.currentParameters = {};
  }

  /**
   * 设置要导出的效果
   */
  setEffect(effectId, parameters = {}) {
    this.currentEffect = effectId;
    this.currentParameters = parameters;
  }

  /**
   * 生成指定格式的代码
   */
  generateCode(format = 'css') {
    if (!this.currentEffect) {
      return '// 请先选择一个效果';
    }

    switch (format.toLowerCase()) {
      case 'css':
        return this.generateCSS();
      case 'javascript':
      case 'js':
        return this.generateJavaScript();
      case 'html':
        return this.generateHTML();
      default:
        return this.generateCSS();
    }
  }

  /**
   * 生成CSS代码
   */
  generateCSS() {
    const effectId = this.currentEffect;
    const params = this.currentParameters;
    
    let cssCode = `/* ${effectId} 效果样式 */\n\n`;
    
    if (effectId.startsWith('click')) {
      cssCode += this.generateClickCSS(effectId, params);
    } else if (effectId.startsWith('carousel')) {
      cssCode += this.generateCarouselCSS(effectId, params);
    } else if (effectId.startsWith('hover')) {
      cssCode += this.generateHoverCSS(effectId, params);
    } else if (effectId.startsWith('slide')) {
      cssCode += this.generateSlideCSS(effectId, params);
    }
    
    return cssCode;
  }

  /**
   * 生成点击效果CSS
   */
  generateClickCSS(effectId, params) {
    let css = '';
    
    if (effectId.includes('scale')) {
      css = `
.${effectId.replace(/-/g, '_')} {
  transition: transform ${params.duration || 200}ms ease-in-out;
  cursor: pointer;
  user-select: none;
}

.${effectId.replace(/-/g, '_')}:active {
  transform: scale(${params.scale || 0.95});
}`;
    } else if (effectId.includes('color')) {
      css = `
.${effectId.replace(/-/g, '_')} {
  transition: all ${params.duration || 200}ms ease-in-out;
  cursor: pointer;
  user-select: none;
}

.${effectId.replace(/-/g, '_')}:active {
  background-color: ${params.backgroundColor || '#4F46E5'} !important;
  color: ${params.textColor || '#ffffff'} !important;
}`;
    } else if (effectId.includes('ripple')) {
      css = `
.${effectId.replace(/-/g, '_')} {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

.${effectId.replace(/-/g, '_')} .ripple {
  position: absolute;
  border-radius: 50%;
  background: ${params.color || 'rgba(79, 70, 229, 0.3)'};
  transform: scale(0);
  animation: ripple-animation ${params.duration || 600}ms linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}`;
    } else if (effectId.includes('bounce')) {
      css = `
.${effectId.replace(/-/g, '_')} {
  cursor: pointer;
  user-select: none;
}

.${effectId.replace(/-/g, '_')}:active {
  animation: bounce-effect ${params.duration || 300}ms ease-in-out;
}

@keyframes bounce-effect {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${params.intensity || 5}px); }
}`;
    }
    
    return css;
  }

  /**
   * 生成轮播效果CSS
   */
  generateCarouselCSS(effectId, params) {
    let css = '';
    
    if (effectId.includes('slide')) {
      css = `
.carousel-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}

.carousel-track {
  display: flex;
  transition: transform ${params.transitionDuration || 500}ms ease-in-out;
  width: ${params.slideCount ? params.slideCount * 100 : 300}%;
}

.carousel-slide {
  flex: 0 0 ${params.slideCount ? 100 / params.slideCount : 33.33}%;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicator.active {
  background: white;
  transform: scale(1.2);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.carousel-nav:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.carousel-prev {
  left: 20px;
}

.carousel-next {
  right: 20px;
}`;
    }
    
    return css;
  }

  /**
   * 生成悬停效果CSS
   */
  generateHoverCSS(effectId, params) {
    return `
.${effectId.replace(/-/g, '_')} {
  transition: all ${params.duration || 300}ms ease-in-out;
  cursor: pointer;
}

.${effectId.replace(/-/g, '_')}:hover {
  opacity: ${params.opacity || 0.8};
}`;
  }

  /**
   * 生成滑入效果CSS
   */
  generateSlideCSS(effectId, params) {
    const direction = params.direction || 'left';
    const distance = params.distance || 100;
    const duration = params.duration || 500;
    
    let transformValue = '';
    switch (direction) {
      case 'left':
        transformValue = `translateX(-${distance}px)`;
        break;
      case 'right':
        transformValue = `translateX(${distance}px)`;
        break;
      case 'top':
        transformValue = `translateY(-${distance}px)`;
        break;
      case 'bottom':
        transformValue = `translateY(${distance}px)`;
        break;
    }
    
    return `
.${effectId.replace(/-/g, '_')} {
  transform: ${transformValue};
  opacity: 0;
  transition: all ${duration}ms ease-in-out;
}

.${effectId.replace(/-/g, '_')}.animate {
  transform: translateX(0) translateY(0);
  opacity: 1;
}`;
  }

  /**
   * 生成JavaScript代码
   */
  generateJavaScript() {
    const effectId = this.currentEffect;
    const params = this.currentParameters;
    
    let jsCode = `// ${effectId} 效果 JavaScript 实现\n\n`;
    
    if (effectId.startsWith('click')) {
      jsCode += this.generateClickJS(effectId, params);
    } else if (effectId.startsWith('carousel')) {
      jsCode += this.generateCarouselJS(effectId, params);
    } else if (effectId.startsWith('hover')) {
      jsCode += this.generateHoverJS(effectId, params);
    } else if (effectId.startsWith('slide')) {
      jsCode += this.generateSlideJS(effectId, params);
    }
    
    return jsCode;
  }

  /**
   * 生成点击效果JavaScript
   */
  generateClickJS(effectId, params) {
    const className = effectId.replace(/-/g, '_');
    
    if (effectId.includes('scale')) {
      return `
function apply${className}(element) {
  element.addEventListener('mousedown', function() {
    this.style.transform = 'scale(${params.scale || 0.95})';
  });
  
  element.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}`;
    } else if (effectId.includes('color')) {
      return `
function apply${className}(element) {
  const originalBg = getComputedStyle(element).backgroundColor;
  const originalColor = getComputedStyle(element).color;
  
  element.addEventListener('mousedown', function() {
    this.style.backgroundColor = '${params.backgroundColor || '#4F46E5'}';
    this.style.color = '${params.textColor || '#ffffff'}';
  });
  
  element.addEventListener('mouseup', function() {
    this.style.backgroundColor = originalBg;
    this.style.color = originalColor;
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.backgroundColor = originalBg;
    this.style.color = originalColor;
  });
}`;
    } else if (effectId.includes('ripple')) {
      return `
function apply${className}(element) {
  element.style.overflow = 'hidden';
  element.style.position = 'relative';
  
  element.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.backgroundColor = '${params.color || 'rgba(79, 70, 229, 0.3)'}';
    ripple.style.animationDuration = '${params.duration || 600}ms';
    
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
    }, ${params.duration || 600});
  });
}`;
    }
    
    return `// ${effectId} 的 JavaScript 实现`;
  }

  /**
   * 生成轮播效果JavaScript
   */
  generateCarouselJS(effectId, params) {
    return `
function initCarousel(container) {
  const slides = container.querySelectorAll('.carousel-slide');
  const track = container.querySelector('.carousel-track');
  const indicators = container.querySelectorAll('.carousel-indicator');
  const prevBtn = container.querySelector('.carousel-prev');
  const nextBtn = container.querySelector('.carousel-next');
  
  let currentIndex = 0;
  let autoPlayTimer = null;
  
  function goToSlide(index) {
    currentIndex = index;
    const translateX = -(index * (${params.slideCount ? 100 / params.slideCount : 33.33}));
    track.style.transform = 'translateX(' + translateX + '%)';
    
    // 更新指示器
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }
  
  function previousSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }
  
  // 绑定指示器事件
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // 绑定箭头事件
  if (prevBtn) prevBtn.addEventListener('click', previousSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  // 自动播放
  ${params.autoplay ? `
  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, ${params.interval || 3000});
  }
  
  function pauseAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }
  
  startAutoPlay();
  
  // 鼠标悬停暂停
  container.addEventListener('mouseenter', pauseAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);
  ` : ''}
}`;
  }

  /**
   * 生成悬停效果JavaScript
   */
  generateHoverJS(effectId, params) {
    const className = effectId.replace(/-/g, '_');
    return `
function apply${className}(element) {
  element.addEventListener('mouseenter', function() {
    this.style.opacity = '${params.opacity || 0.8}';
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.opacity = '1';
  });
}`;
  }

  /**
   * 生成滑入效果JavaScript
   */
  generateSlideJS(effectId, params) {
    const className = effectId.replace(/-/g, '_');
    return `
function apply${className}(element) {
  // 初始状态
  element.style.opacity = '0';
  
  // 延迟执行动画
  setTimeout(function() {
    element.style.opacity = '1';
    element.classList.add('animate');
  }, 100);
}`;
  }

  /**
   * 生成完整的HTML示例
   */
  generateHTML() {
    const effectId = this.currentEffect;
    const params = this.currentParameters;
    
    const cssCode = this.generateCSS();
    const jsCode = this.generateJavaScript();
    
    let htmlContent = '';
    
    if (effectId.startsWith('click')) {
      htmlContent = `
  <div class="${effectId.replace(/-/g, '_')}" id="demo-element">
    点击我查看效果
  </div>`;
    } else if (effectId.startsWith('carousel')) {
      htmlContent = `
  <div class="carousel-container" id="carousel-demo">
    <div class="carousel-wrapper">
      <div class="carousel-track">
        <div class="carousel-slide" style="background: linear-gradient(45deg, #FF6B6B, #FF8E8E);">
          <h3>幻灯片 1</h3>
        </div>
        <div class="carousel-slide" style="background: linear-gradient(45deg, #4ECDC4, #6BDBC6);">
          <h3>幻灯片 2</h3>
        </div>
        <div class="carousel-slide" style="background: linear-gradient(45deg, #45B7D1, #5CC7E1);">
          <h3>幻灯片 3</h3>
        </div>
      </div>
    </div>
    <div class="carousel-indicators">
      <button class="carousel-indicator active"></button>
      <button class="carousel-indicator"></button>
      <button class="carousel-indicator"></button>
    </div>
    <button class="carousel-nav carousel-prev">‹</button>
    <button class="carousel-nav carousel-next">›</button>
  </div>`;
    } else if (effectId.startsWith('hover')) {
      htmlContent = `
  <div class="${effectId.replace(/-/g, '_')}" id="demo-element">
    悬停我查看效果
  </div>`;
    } else {
      htmlContent = `
  <div class="${effectId.replace(/-/g, '_')}" id="demo-element">
    ${effectId.replace(/-/g, ' ')} 效果示例
  </div>`;
    }
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${effectId} 效果演示</title>
    <style>
${cssCode.trim()}
    </style>
</head>
<body>
${htmlContent}
    
    <script>
${jsCode.trim()}
        
        // 初始化效果
        document.addEventListener('DOMContentLoaded', function() {
            ${this.generateInitScript(effectId)}
        });
    </script>
</body>
</html>`;
  }

  /**
   * 生成初始化脚本
   */
  generateInitScript(effectId) {
    if (effectId.startsWith('click')) {
      return `const element = document.getElementById('demo-element');
            apply${effectId.replace(/-/g, '_')}(element);`;
    } else if (effectId.startsWith('carousel')) {
      return `const carousel = document.getElementById('carousel-demo');
            initCarousel(carousel);`;
    } else if (effectId.startsWith('hover')) {
      return `const element = document.getElementById('demo-element');
            apply${effectId.replace(/-/g, '_')}(element);`;
    } else {
      return `const element = document.getElementById('demo-element');
            // 根据需要初始化效果`;
    }
  }

  /**
   * 复制代码到剪贴板
   */
  async copyCode(format = 'css') {
    const code = this.generateCode(format);
    try {
      await navigator.clipboard.writeText(code);
      return { success: true, message: '代码已复制到剪贴板' };
    } catch (error) {
      return { success: false, message: '复制失败: ' + error.message };
    }
  }

  /**
   * 下载代码文件
   */
  downloadCode(format = 'css') {
    const code = this.generateCode(format);
    const filename = `effect-${this.currentEffect || 'demo'}.${format}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  /**
   * 获取支持的导出格式
   */
  getSupportedFormats() {
    return this.exportFormats;
  }

  /**
   * 清除当前效果
   */
  clearEffect() {
    this.currentEffect = null;
    this.currentParameters = {};
  }
}

// 导出单例实例
export default new CodeExporter();