/**
 * 轮播效果组件
 * 提供多种轮播交互效果
 */

class CarouselEffect {
  constructor() {
    this.effects = new Map();
    this.initEffects();
  }

  /**
   * 初始化轮播效果
   */
  initEffects() {
    // 1. 基础滑动轮播
    this.effects.set('slide', {
      name: '滑动轮播',
      apply: this.applySlideCarousel.bind(this),
      generateCSS: this.generateSlideCSS.bind(this),
      generateJS: this.generateSlideJS.bind(this),
      parameters: {
        autoplay: { default: true, type: 'boolean' },
        interval: { default: 3000, min: 1000, max: 10000, step: 500 },
        showIndicators: { default: true, type: 'boolean' },
        showArrows: { default: true, type: 'boolean' },
        transitionDuration: { default: 500, min: 200, max: 2000, step: 50 }
      }
    });

    // 2. 淡入淡出轮播
    this.effects.set('fade', {
      name: '淡入淡出',
      apply: this.applyFadeCarousel.bind(this),
      generateCSS: this.generateFadeCSS.bind(this),
      generateJS: this.generateFadeJS.bind(this),
      parameters: {
        autoplay: { default: true, type: 'boolean' },
        interval: { default: 4000, min: 1000, max: 10000, step: 500 },
        showIndicators: { default: true, type: 'boolean' },
        transitionDuration: { default: 1000, min: 300, max: 3000, step: 100 }
      }
    });

    // 3. 3D翻转轮播
    this.effects.set('flip', {
      name: '3D翻转',
      apply: this.applyFlipCarousel.bind(this),
      generateCSS: this.generateFlipCSS.bind(this),
      generateJS: this.generateFlipJS.bind(this),
      parameters: {
        autoplay: { default: true, type: 'boolean' },
        interval: { default: 3500, min: 1000, max: 8000, step: 500 },
        perspective: { default: 1000, min: 500, max: 2000, step: 100 },
        transitionDuration: { default: 800, min: 400, max: 1500, step: 50 }
      }
    });
  }

  /**
   * 应用滑动轮播效果
   */
  applySlideCarousel(container, params) {
    // 验证容器
    if (!container || container.children.length === 0) {
      console.warn('Carousel container is empty or invalid');
      return;
    }

    // 清理之前的轮播实例
    this.cleanupCarousel(container, 'slide');

    // 创建轮播结构
    const carouselData = this.setupCarouselStructure(container, params);
    
    // 应用滑动样式
    this.applySlideStyles(container, carouselData, params);
    
    // 绑定控制事件
    this.bindSlideControls(carouselData, params);
    
    // 启动自动播放
    if (params.autoplay) {
      this.startAutoPlay(carouselData, params);
    }

    // 保存轮播数据
    container._carouselData = carouselData;
  }

  /**
   * 设置轮播结构
   */
  setupCarouselStructure(container, params) {
    const slides = Array.from(container.children);
    const slideCount = slides.length;
    
    // 包装容器
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    
    // 轮播轨道
    const track = document.createElement('div');
    track.className = 'carousel-track';
    
    // 包装每个幻灯片
    slides.forEach((slide, index) => {
      const slideWrapper = document.createElement('div');
      slideWrapper.className = 'carousel-slide';
      slideWrapper.dataset.index = index;
      
      // 移动原始内容
      slide.parentNode.removeChild(slide);
      slideWrapper.appendChild(slide);
      track.appendChild(slideWrapper);
    });
    
    wrapper.appendChild(track);
    container.appendChild(wrapper);
    
    // 添加指示器
    if (params.showIndicators) {
      this.addIndicators(container, slideCount, params);
    }
    
    // 添加箭头
    if (params.showArrows) {
      this.addNavigationArrows(container, params);
    }
    
    return {
      container,
      wrapper,
      track,
      slides: Array.from(track.children),
      currentIndex: 0,
      slideCount,
      autoPlayTimer: null
    };
  }

  /**
   * 应用滑动样式
   */
  applySlideStyles(container, carouselData, params) {
    const { track, slides } = carouselData;
    
    // 设置容器样式
    container.style.cssText = `
      position: relative;
      overflow: hidden;
      width: 100%;
    `;
    
    // 设置轨道样式
    track.style.cssText = `
      display: flex;
      transition: transform ${params.transitionDuration}ms ease-in-out;
      width: ${slides.length * 100}%;
    `;
    
    // 设置幻灯片样式
    slides.forEach(slide => {
      slide.style.cssText = `
        flex: 0 0 ${100 / slides.length}%;
        position: relative;
      `;
    });
  }

  /**
   * 绑定控制事件
   */
  bindSlideControls(carouselData, params) {
    const { container, slides, slideCount } = carouselData;
    
    // 指示器点击事件
    const indicators = container.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(carouselData, index, params);
      });
    });
    
    // 箭头点击事件
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousSlide(carouselData, params);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide(carouselData, params);
      });
    }
    
    // 鼠标悬停暂停自动播放
    container.addEventListener('mouseenter', () => {
      this.pauseAutoPlay(carouselData);
    });
    
    container.addEventListener('mouseleave', () => {
      if (params.autoplay) {
        this.resumeAutoPlay(carouselData, params);
      }
    });
  }

  /**
   * 添加指示器
   */
  addIndicators(container, slideCount, params) {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    for (let i = 0; i < slideCount; i++) {
      const indicator = document.createElement('button');
      indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
      indicator.dataset.index = i;
      indicatorsContainer.appendChild(indicator);
    }
    
    container.appendChild(indicatorsContainer);
  }

  /**
   * 添加导航箭头
   */
  addNavigationArrows(container, params) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.innerHTML = '‹';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.innerHTML = '›';
    
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
  }

  /**
   * 切换到指定幻灯片
   */
  goToSlide(carouselData, index, params) {
    const { track, slides, slideCount } = carouselData;
    
    // 标准化索引
    index = ((index % slideCount) + slideCount) % slideCount;
    carouselData.currentIndex = index;
    
    // 移动轨道
    const translateX = -(index * (100 / slideCount));
    track.style.transform = `translateX(${translateX}%)`;
    
    // 更新指示器
    this.updateIndicators(carouselData.container, index);
  }

  /**
   * 下一张幻灯片
   */
  nextSlide(carouselData, params) {
    const nextIndex = carouselData.currentIndex + 1;
    this.goToSlide(carouselData, nextIndex, params);
  }

  /**
   * 上一张幻灯片
   */
  previousSlide(carouselData, params) {
    const prevIndex = carouselData.currentIndex - 1;
    this.goToSlide(carouselData, prevIndex, params);
  }

  /**
   * 更新指示器状态
   */
  updateIndicators(container, activeIndex) {
    const indicators = container.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === activeIndex);
    });
  }

  /**
   * 启动自动播放
   */
  startAutoPlay(carouselData, params) {
    carouselData.autoPlayTimer = setInterval(() => {
      this.nextSlide(carouselData, params);
    }, params.interval);
  }

  /**
   * 暂停自动播放
   */
  pauseAutoPlay(carouselData) {
    if (carouselData.autoPlayTimer) {
      clearInterval(carouselData.autoPlayTimer);
      carouselData.autoPlayTimer = null;
    }
  }

  /**
   * 恢复自动播放
   */
  resumeAutoPlay(carouselData, params) {
    this.startAutoPlay(carouselData, params);
  }

  /**
   * 生成滑动轮播CSS
   */
  generateSlideCSS(params) {
    return `
      .carousel-container {
        position: relative;
        overflow: hidden;
        width: 100%;
      }
      
      .carousel-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .carousel-track {
        display: flex;
        transition: transform ${params.transitionDuration}ms ease-in-out;
      }
      
      .carousel-slide {
        flex: 0 0 auto;
        position: relative;
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
      }
    `;
  }

  /**
   * 生成滑动轮播JavaScript
   */
  generateSlideJS(params) {
    return `
      function initSlideCarousel(container) {
        const slides = container.querySelectorAll('.carousel-slide');
        const track = container.querySelector('.carousel-track');
        const indicators = container.querySelectorAll('.carousel-indicator');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        
        let currentIndex = 0;
        let autoPlayTimer = null;
        
        function goToSlide(index) {
          currentIndex = index;
          const translateX = -(index * (100 / slides.length));
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
          autoPlayTimer = setInterval(nextSlide, ${params.interval});
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
      }
    `;
  }

  /**
   * 应用淡入淡出轮播（简化版）
   */
  applyFadeCarousel(container, params) {
    console.log('Applying fade carousel effect');
    // 实现将在后续完善
  }

  /**
   * 生成淡入淡出CSS
   */
  generateFadeCSS(params) {
    return `
      .fade-carousel {
        position: relative;
      }
      
      .fade-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity ${params.transitionDuration}ms ease-in-out;
      }
      
      .fade-slide.active {
        opacity: 1;
      }
    `;
  }

  /**
   * 生成淡入淡出JavaScript
   */
  generateFadeJS(params) {
    return `
      function initFadeCarousel(container) {
        // 淡入淡出轮播实现
        console.log('Fade carousel initialized');
      }
    `;
  }

  /**
   * 应用3D翻转轮播（简化版）
   */
  applyFlipCarousel(container, params) {
    console.log('Applying flip carousel effect');
    // 实现将在后续完善
  }

  /**
   * 生成3D翻转CSS
   */
  generateFlipCSS(params) {
    return `
      .flip-carousel {
        perspective: ${params.perspective}px;
        position: relative;
      }
      
      .flip-track {
        position: relative;
        transform-style: preserve-3d;
        transition: transform ${params.transitionDuration}ms ease-in-out;
      }
    `;
  }

  /**
   * 生成3D翻转JavaScript
   */
  generateFlipJS(params) {
    return `
      function initFlipCarousel(container) {
        // 3D翻转轮播实现
        console.log('Flip carousel initialized');
      }
    `;
  }

  /**
   * 清理轮播效果
   */
  cleanupCarousel(container, effectType) {
    if (container._carouselData) {
      const { autoPlayTimer } = container._carouselData;
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
      }
      delete container._carouselData;
    }
  }

  /**
   * 获取所有轮播效果
   */
  getAllEffects() {
    return Array.from(this.effects.entries()).map(([id, effect]) => ({
      id,
      name: effect.name,
      parameters: effect.parameters
    }));
  }

  /**
   * 应用指定的轮播效果
   */
  applyEffect(container, effectId, parameters = {}) {
    const effect = this.effects.get(effectId);
    if (!effect) {
      throw new Error(`Carousel effect '${effectId}' not found`);
    }

    const finalParams = {};
    Object.keys(effect.parameters).forEach(key => {
      finalParams[key] = parameters[key] !== undefined ? 
        parameters[key] : effect.parameters[key].default;
    });

    return effect.apply(container, finalParams);
  }

  /**
   * 生成指定效果的代码
   */
  generateCode(effectId, format = 'css', parameters = {}) {
    const effect = this.effects.get(effectId);
    if (!effect) return '';

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
export default new CarouselEffect();