/**
 * 工具函数模块
 * 包含通用的工具函数
 */

const Utils = {
  /**
   * 获取一周的开始日期
   * @param {Date} date - 日期对象
   * @returns {Date} - 本周周一的日期对象
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },

  /**
   * 格式化日期为中文格式
   * @param {string} dateStr - ISO日期字符串
   * @returns {string} - 格式化后的日期字符串
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[date.getDay()];
    return `${month}月${day}日 周${weekDay}`;
  },

  /**
   * 显示Toast提示
   * @param {string} message - 提示消息
   * @param {string} actionText - 操作按钮文本
   * @param {Function} actionCallback - 操作回调函数
   * @param {number} duration - 显示时长（毫秒）
   */
  showToast(message, actionText, actionCallback, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    if (actionText && actionCallback) {
      toast.innerHTML = `
        <span>${message}</span>
        <button>${actionText}</button>
      `;
      const button = toast.querySelector('button');
      button.onclick = () => {
        toast.remove();
        actionCallback();
      };
    } else {
      toast.innerHTML = `
        <span>${message}</span>
      `;
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * 显示确认对话框
   * @param {string} icon - 图标emoji
   * @param {string} title - 标题
   * @param {string} message - 消息内容
   * @param {Function} onConfirm - 确认回调
   * @param {Function} onCancel - 取消回调
   */
  showConfirm(icon, title, message, onConfirm, onCancel) {
    const id = 'confirm-' + Date.now();
    const confirmBox = document.createElement('div');
    confirmBox.className = 'modal-overlay';
    confirmBox.innerHTML = `
      <div class="modal-content" style="max-width: 320px;">
        <div class="confirm-icon">${icon}</div>
        <div class="confirm-title">${title}</div>
        <div class="confirm-message">${message}</div>
        <div class="confirm-actions">
          <button class="btn btn-secondary" onclick="Utils.closeConfirm('${id}', false)">取消</button>
          <button class="btn btn-danger" onclick="Utils.closeConfirm('${id}', true)">确认</button>
        </div>
      </div>
    `;
    confirmBox.id = id;
    document.body.appendChild(confirmBox);
    
    window['confirmCallback_' + id] = { onConfirm, onCancel };
  },

  /**
   * 关闭确认对话框
   * @param {string} id - 对话框ID
   * @param {boolean} confirmed - 是否确认
   */
  closeConfirm(id, confirmed) {
    const el = document.getElementById(id);
    if (el) el.remove();
    
    const callbacks = window['confirmCallback_' + id];
    if (callbacks) {
      if (confirmed && callbacks.onConfirm) {
        callbacks.onConfirm();
      } else if (!confirmed && callbacks.onCancel) {
        callbacks.onCancel();
      }
      delete window['confirmCallback_' + id];
    }
  },

  /**
   * 显示模态框
   * @param {string} content - 模态框内容
   * @param {boolean} closeOnOverlayClick - 是否点击空白区域关闭（默认为true）
   */
  showModal(content, closeOnOverlayClick = true) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        ${content}
      </div>
    `;
    
    // 添加点击空白区域关闭功能
    if (closeOnOverlayClick) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          this.closeModal();
        }
      });
    }
    
    document.body.appendChild(overlay);
  },

  /**
   * 关闭模态框
   */
  closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  },

  /**
   * 生成唯一ID
   * @returns {string} - 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 防抖函数
   * @param {Function} fn - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} - 防抖后的函数
   */
  debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * 节流函数
   * @param {Function} fn - 要节流的函数
   * @param {number} interval - 间隔时间（毫秒）
   * @returns {Function} - 节流后的函数
   */
  throttle(fn, interval = 300) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * 计算BMI
   * @param {number} weight - 体重（kg）
   * @param {number} height - 身高（cm）
   * @returns {number} - BMI值
   */
  calculateBMI(weight, height) {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  },

  /**
   * 获取BMI分类
   * @param {number} bmi - BMI值
   * @returns {string} - BMI分类
   */
  getBMICategory(bmi) {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '偏胖';
    return '肥胖';
  },

  /**
   * 计算每日总热量消耗（BMR * 活动系数）
   * @param {object} data - 身体数据
   * @returns {number} - 每日总热量消耗
   */
  calculateTDEE(data) {
    if (!data.weight || !data.height || !data.age) return 0;
    
    // Mifflin-St Jeor 公式
    let bmr;
    if (data.gender === 'female') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    }
    
    // 活动系数
    const activityFactor = data.activityLevel || 1.2;
    return Math.round(bmr * activityFactor);
  }
};

// 导出到全局
window.Utils = Utils;