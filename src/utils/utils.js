/**
 * 工具函数集合
 */

/**
 * 防抖函数
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深度克隆对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 生成唯一ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化时间为友好显示
 */
export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * 验证参数
 */
export function validateParameters(params, schema) {
  const errors = [];
  
  Object.keys(schema).forEach(key => {
    const param = params[key];
    const rule = schema[key];
    
    // 检查必需参数
    if (rule.required && (param === undefined || param === null)) {
      errors.push(`参数 ${key} 是必需的`);
      return;
    }
    
    // 检查类型
    if (param !== undefined && typeof param !== rule.type) {
      errors.push(`参数 ${key} 类型应该是 ${rule.type}`);
      return;
    }
    
    // 检查数值范围
    if (rule.type === 'number' && param !== undefined) {
      if (rule.min !== undefined && param < rule.min) {
        errors.push(`参数 ${key} 不能小于 ${rule.min}`);
      }
      if (rule.max !== undefined && param > rule.max) {
        errors.push(`参数 ${key} 不能大于 ${rule.max}`);
      }
    }
    
    // 检查枚举值
    if (rule.options && !rule.options.includes(param)) {
      errors.push(`参数 ${key} 必须是以下值之一: ${rule.options.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 创建CSS动画关键帧
 */
export function createKeyframes(name, frames) {
  let keyframeString = `@keyframes ${name} {\n`;
  
  Object.keys(frames).forEach(percentage => {
    keyframeString += `  ${percentage} {\n`;
    Object.keys(frames[percentage]).forEach(property => {
      keyframeString += `    ${property}: ${frames[percentage][property]};\n`;
    });
    keyframeString += `  }\n`;
  });
  
  keyframeString += `}`;
  return keyframeString;
}

/**
 * 转换驼峰命名到短横线命名
 */
export function camelToKebab(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/**
 * 转换短横线命名到驼峰命名
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 计算两个点之间的距离
 */
export function getDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 限制数值在指定范围内
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

/**
 * 检测元素是否在视口内
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 平滑滚动到指定元素
 */
export function smoothScrollTo(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * 下载文本内容为文件
 */
export function downloadText(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * 复制文本到剪贴板
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * 格式化CSS代码
 */
export function formatCSS(css) {
  return css.replace(/;/g, ';\n')
            .replace(/{/g, ' {\n')
            .replace(/}/g, '\n}\n')
            .replace(/,/g, ',\n')
            .trim();
}

/**
 * 格式化JavaScript代码
 */
export function formatJS(js) {
  // 简单的格式化，实际项目中可以使用专业的代码格式化库
  return js.replace(/;/g, ';\n')
           .replace(/{/g, ' {\n')
           .replace(/}/g, '\n}\n')
           .replace(/,/g, ',\n')
           .trim();
}

export default {
  debounce,
  throttle,
  deepClone,
  generateId,
  formatTime,
  validateParameters,
  createKeyframes,
  camelToKebab,
  kebabToCamel,
  getDistance,
  clamp,
  lerp,
  isInViewport,
  smoothScrollTo,
  downloadText,
  copyToClipboard,
  formatCSS,
  formatJS
};