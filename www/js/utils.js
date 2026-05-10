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
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.position = 'fixed';
      container.style.top = '100px';
      container.style.left = '50%';
      container.style.transform = 'translateX(-50%)';
      container.style.zIndex = '1000';
      container.style.width = '100%';
      container.style.maxWidth = '480px';
      container.style.padding = '0 16px';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = '#1E293B';
    toast.style.color = 'white';
    toast.style.padding = '14px 16px';
    toast.style.borderRadius = '10px';
    toast.style.display = 'flex';
    toast.style.justifyContent = 'space-between';
    toast.style.alignItems = 'center';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.marginBottom = '8px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.3s ease-out';
    
    if (actionText && actionCallback) {
      const toastId = 'toast-' + Date.now();
      toast.innerHTML = `
        <span style="flex: 1; font-size: 14px;">${message}</span>
        <button style="background: #2563EB; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; margin-left: 12px;" onclick="window['toastCallback_${toastId}']()">${actionText}</button>
      `;
      window['toastCallback_' + toastId] = () => {
        toast.remove();
        actionCallback();
      };
    } else {
      toast.innerHTML = `
        <span style="flex: 1; font-size: 14px;">${message}</span>
      `;
    }
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
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
    confirmBox.className = 'modal-overlay active';
    confirmBox.innerHTML = `
      <div class="modal" style="max-width: 320px;">
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
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal">
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
   * 计算基础代谢率 (BMR)
   * 使用 Mifflin-St Jeor 公式
   * @param {Object} data - 个人数据
   * @param {number} data.weight - 体重(kg)
   * @param {number} data.height - 身高(cm)
   * @param {number} data.age - 年龄
   * @param {string} data.gender - 性别 (male/female)
   * @returns {number} - BMR值
   */
  calculateBMR(data) {
    if (!data.weight || !data.height || !data.age) return 0;
    
    // Mifflin-St Jeor 公式
    if (data.gender === 'female') {
      return Math.round(10 * data.weight + 6.25 * data.height - 5 * data.age - 161);
    } else {
      return Math.round(10 * data.weight + 6.25 * data.height - 5 * data.age + 5);
    }
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
  },

  /**
   * 下载文件
   * @param {string} content - 文件内容
   * @param {string} filename - 文件名
   * @param {string} mimeType - MIME类型
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * 生成分页HTML
   * @param {number} currentPage - 当前页码（从1开始）
   * @param {number} totalPages - 总页数
   * @param {string} pageKey - 页面标识（用于区分不同页面的分页状态）
   * @returns {string} - 分页HTML
   */
  renderPagination(currentPage, totalPages, pageKey) {
    if (totalPages <= 1) return '';
    
    const prevDisabled = currentPage <= 1 ? 'disabled' : '';
    const nextDisabled = currentPage >= totalPages ? 'disabled' : '';
    
    return `
      <div class="pagination">
        <button class="btn btn-secondary pagination-btn ${prevDisabled}" onclick="${pageKey}Module.handlePrevPage()" ${prevDisabled ? 'disabled' : ''}>
          ◀ 上一页
        </button>
        <span class="pagination-info">第 ${currentPage} / ${totalPages} 页</span>
        <button class="btn btn-secondary pagination-btn ${nextDisabled}" onclick="${pageKey}Module.handleNextPage()" ${nextDisabled ? 'disabled' : ''}>
          下一页 ▶
        </button>
      </div>
    `;
  },

  /**
   * 分页数据
   * @param {Array} data - 原始数据数组
   * @param {number} currentPage - 当前页码（从1开始）
   * @param {number} pageSize - 每页大小
   * @returns {Object} - { data: 分页后数据, totalPages: 总页数 }
   */
  paginate(data, currentPage, pageSize = 10) {
    const totalPages = Math.ceil(data.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: [...data].reverse().slice(start, end),
      totalPages
    };
  },

  /**
   * 获取突破类型信息
   * @param {string} type - 突破类型
   * @returns {Object} - 突破类型信息
   */
  getBreakTypeInfo(type) {
    switch (type) {
      case 'weight': return { icon: '💪', label: '重量突破', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
      case 'reps': return { icon: '🔢', label: '次数突破', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' };
      case 'volume': return { icon: '📈', label: '总量突破', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' };
      case 'first': return { icon: '🎯', label: '首项纪录', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' };
      default: return { icon: '🏆', label: '个人纪录', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' };
    }
  },

  /**
   * 格式化日期为中文格式（修复版）
   * @param {string} dateStr - ISO日期字符串
   * @returns {string} - 格式化后的日期字符串
   */
  formatDateSafe(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekDay = weekDays[date.getDay()];
      return `${month}月${day}日 周${weekDay}`;
    } catch(e) {
      return '';
    }
  },

  /**
   * 获取动作的历史记录列表
   * @param {string} exerciseName - 动作名称
   * @returns {Array} - 历史记录列表
   */
  getExerciseHistory(exerciseName) {
    return appData.workouts
      .flatMap(w => w.exercises
        .filter(e => e.name === exerciseName)
        .map(e => ({
          date: w.date,
          weight: e.weight,
          sets: e.sets,
          maxReps: Math.max(...e.sets),
          volume: e.weight * Math.max(...e.sets)
        })))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * 分析PR的突破详情（用于个人纪录页面）
   * @param {Object} pr - PR记录
   * @returns {Object} - 突破详情
   */
  analyzePRDetail(pr) {
    const history = this.getExerciseHistory(pr.name);
    if (history.length <= 1) {
      return null;
    }
    
    const currentIndex = history.findIndex(h => h.date === pr.date);
    if (currentIndex === -1 || currentIndex === history.length - 1) {
      return null;
    }
    
    const previous = history[currentIndex + 1];
    const improvement = {};
    
    if (pr.type === 'weight') {
      improvement.value = `+${(pr.weight - previous.weight).toFixed(1)}kg`;
      improvement.percent = previous.weight > 0 ? ((pr.weight - previous.weight) / previous.weight * 100).toFixed(0) + '%' : '';
    } else if (pr.type === 'reps') {
      improvement.value = `+${pr.reps - previous.maxReps}次`;
      improvement.percent = previous.maxReps > 0 ? ((pr.reps - previous.maxReps) / previous.maxReps * 100).toFixed(0) + '%' : '';
    } else if (pr.type === 'volume') {
      const currentVolume = pr.weight * pr.reps;
      const prevVolume = previous.weight * previous.maxReps;
      improvement.value = `+${currentVolume - prevVolume}kg`;
      improvement.percent = prevVolume > 0 ? ((currentVolume - prevVolume) / prevVolume * 100).toFixed(0) + '%' : '';
    }
    
    return {
      previous: previous,
      improvement: improvement,
      historyCount: history.length
    };
  },

  /**
   * 分析训练记录的突破详情
   * @param {Object} workout - 训练记录
   * @returns {Array} - 突破详情数组
   */
  analyzeWorkoutProgress(workout) {
    const prs = Storage.getPRs();
    const progressDetails = [];
    
    workout.exercises.forEach(exercise => {
      const maxReps = Math.max(...exercise.sets);
      const currentVolume = exercise.weight * maxReps;
      const existingPR = prs[exercise.name];
      
      if (existingPR && existingPR.date === workout.date) {
        const type = existingPR.type;
        const info = this.getBreakTypeInfo(type);
        
        let previousData = null;
        let improvement = null;
        
        if (type !== 'first') {
          const previousRecords = appData.workouts
            .filter(w => w.date < workout.date)
            .map(w => ({
              ...w,
              exercises: w.exercises.filter(e => e.name === exercise.name)
            }))
            .filter(w => w.exercises.length > 0)
            .sort((a, b) => {
              const volA = a.exercises[0].weight * Math.max(...a.exercises[0].sets);
              const volB = b.exercises[0].weight * Math.max(...b.exercises[0].sets);
              return volB - volA;
            });
          
          if (previousRecords.length > 0) {
            const prevWorkout = previousRecords[0];
            const prev = prevWorkout.exercises[0];
            const prevMaxReps = Math.max(...prev.sets);
            previousData = {
              weight: prev.weight,
              reps: prevMaxReps,
              sets: prev.sets,
              volume: prev.weight * prevMaxReps,
              date: prevWorkout.date
            };
            
            if (type === 'weight') {
              improvement = {
                type: 'weight',
                value: `+${(exercise.weight - previousData.weight).toFixed(1)}kg`,
                percent: previousData.weight > 0 ? ((exercise.weight - previousData.weight) / previousData.weight * 100).toFixed(0) + '%' : ''
              };
            } else if (type === 'reps') {
              improvement = {
                type: 'reps',
                value: `+${maxReps - previousData.reps}次`,
                percent: previousData.reps > 0 ? ((maxReps - previousData.reps) / previousData.reps * 100).toFixed(0) + '%' : ''
              };
            } else if (type === 'volume') {
              improvement = {
                type: 'volume',
                value: `+${currentVolume - previousData.volume}kg`,
                percent: previousData.volume > 0 ? ((currentVolume - previousData.volume) / previousData.volume * 100).toFixed(0) + '%' : ''
              };
            }
          }
        }
        
        progressDetails.push({
          exerciseName: exercise.name,
          current: {
            weight: exercise.weight,
            reps: maxReps,
            sets: exercise.sets,
            volume: currentVolume,
            date: workout.date
          },
          previous: previousData,
          type: type,
          info: info,
          improvement: improvement
        });
      }
    });
    
    return progressDetails;
  }
};

// 导出到全局
window.Utils = Utils;