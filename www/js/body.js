/**
 * 身体数据模块
 * 包含身体数据相关的所有逻辑
 */

const BodyModule = {
  /**
   * 渲染身体数据页面
   */
  renderBodyPage() {
    const bodyRecords = appData.body.slice(-10).reverse();
    const latestBody = appData.body.length > 0 ? appData.body[appData.body.length - 1] : null;
    
    const bmi = latestBody && latestBody.weight && appData.settings.height 
      ? Utils.calculateBMI(latestBody.weight, appData.settings.height) 
      : 0;
    
    return `
      <div class="page active">
        <div class="page-header">
          <h1>身体数据</h1>
          <div class="header-actions">
            <button class="btn btn-primary" onclick="BodyModule.openAddBodyModal()">
              ➕ 添加记录
            </button>
          </div>
        </div>
        
        <!-- 当前状态卡片 -->
        <div class="card">
          <div class="card-title">当前状态</div>
          <div class="body-summary">
            <div class="body-stat">
              <div class="stat-value">${latestBody ? latestBody.weight : '—'}</div>
              <div class="stat-label">体重(kg)</div>
            </div>
            <div class="body-stat">
              <div class="stat-value">${appData.settings.height || '—'}</div>
              <div class="stat-label">身高(cm)</div>
            </div>
            <div class="body-stat">
              <div class="stat-value ${this.getBMIColorClass(bmi)}">${bmi}</div>
              <div class="stat-label">BMI</div>
            </div>
            <div class="body-stat">
              <div class="stat-value">${latestBody ? Utils.getBMICategory(bmi) : '—'}</div>
              <div class="stat-label">身体状态</div>
            </div>
          </div>
        </div>
        
        <!-- 记录列表 -->
        ${bodyRecords.length > 0 ? `
          <div class="body-list">
            ${bodyRecords.map(b => `
              <div class="card" onclick="BodyModule.showBodyDetail('${b.date}')">
                <div class="body-header">
                  <div class="body-date">${Utils.formatDate(b.date)}</div>
                  <div class="body-weight">${b.weight}kg</div>
                </div>
                <div class="body-content">
                  ${b.chest ? `<div>胸围: ${b.chest}cm</div>` : ''}
                  ${b.waist ? `<div>腰围: ${b.waist}cm</div>` : ''}
                  ${b.hips ? `<div>臀围: ${b.hips}cm</div>` : ''}
                  ${b.arm ? `<div>上臂: ${b.arm}cm</div>` : ''}
                  ${b.leg ? `<div>大腿: ${b.leg}cm</div>` : ''}
                </div>
                <div class="body-actions">
                  <button class="btn btn-sm" onclick="event.stopPropagation(); BodyModule.editBody('${b.date}')">编辑</button>
                  <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); BodyModule.deleteBody('${b.date}')">删除</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div style="font-size: 48px; margin-bottom: 16px;">⚖️</div>
            <div style="font-weight: 600; margin-bottom: 8px;">还没有身体数据</div>
            <div style="color: var(--text-muted);">点击上方按钮开始记录</div>
          </div>
        `}
      </div>
    `;
  },

  /**
   * 获取BMI颜色类
   * @param {number} bmi - BMI值
   * @returns {string} - CSS类名
   */
  getBMIColorClass(bmi) {
    if (bmi < 18.5) return 'bmi-under';
    if (bmi < 24) return 'bmi-normal';
    if (bmi < 28) return 'bmi-over';
    return 'bmi-obese';
  },

  /**
   * 打开添加身体数据模态框
   */
  openAddBodyModal() {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = appData.body.find(b => b.date === today);
    
    Utils.showModal(`
      <div class="modal-header">
        <span>${todayRecord ? '编辑今日记录' : '添加身体数据'}</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <form id="bodyForm" onsubmit="BodyModule.saveBody(event)">
        <div class="input-group">
          <label>日期</label>
          <input type="date" name="date" value="${today}" required>
        </div>
        
        <div class="input-group">
          <label>体重(kg)</label>
          <input type="number" name="weight" step="0.1" placeholder="如：70.5" value="${todayRecord?.weight || ''}" required>
        </div>
        
        <div class="input-row">
          <div class="input-group" style="flex: 1;">
            <label>胸围(cm)</label>
            <input type="number" name="chest" placeholder="胸围" value="${todayRecord?.chest || ''}">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>腰围(cm)</label>
            <input type="number" name="waist" placeholder="腰围" value="${todayRecord?.waist || ''}">
          </div>
        </div>
        
        <div class="input-row">
          <div class="input-group" style="flex: 1;">
            <label>臀围(cm)</label>
            <input type="number" name="hips" placeholder="臀围" value="${todayRecord?.hips || ''}">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>上臂(cm)</label>
            <input type="number" name="arm" placeholder="上臂" value="${todayRecord?.arm || ''}">
          </div>
        </div>
        
        <div class="input-group">
          <label>大腿围(cm)</label>
          <input type="number" name="leg" placeholder="大腿围" value="${todayRecord?.leg || ''}">
        </div>
        
        <button type="submit" class="btn btn-primary">保存</button>
      </form>
    `);
  },

  /**
   * 保存身体数据
   * @param {Event} e - 表单提交事件
   */
  saveBody(e) {
    e.preventDefault();
    
    const form = e.target;
    const date = form.date.value;
    const weight = parseFloat(form.weight.value) || 0;
    const chest = parseInt(form.chest.value) || 0;
    const waist = parseInt(form.waist.value) || 0;
    const hips = parseInt(form.hips.value) || 0;
    const arm = parseInt(form.arm.value) || 0;
    const leg = parseInt(form.leg.value) || 0;
    
    const record = {
      date,
      weight,
      chest,
      waist,
      hips,
      arm,
      leg
    };
    
    const existingIndex = appData.body.findIndex(b => b.date === date);
    
    if (existingIndex >= 0) {
      appData.body[existingIndex] = record;
      Storage.updateBody(date, record);
      Utils.showToast('身体数据已更新');
    } else {
      appData.body.push(record);
      Storage.addBody(record);
      Utils.showToast('身体数据已保存');
    }
    
    Utils.closeModal();
    navigateTo('body');
  },

  /**
   * 删除身体数据
   * @param {string} date - 日期
   */
  deleteBody(date) {
    Utils.showConfirm('🗑️', '确认删除', '确定要删除这条身体数据吗？此操作可以撤销。', () => {
      const record = appData.body.find(b => b.date === date);
      appData.body = Storage.deleteBody(date);
      
      Utils.showToast('身体数据已删除', '撤销', () => {
        appData.body.push(record);
        Storage.addBody(record);
        Utils.showToast('已恢复身体数据');
      });
      
      navigateTo('body');
    });
  },

  /**
   * 编辑身体数据
   * @param {string} date - 日期
   */
  editBody(date) {
    Utils.closeModal();
    this.openAddBodyModal();
  },

  /**
   * 显示身体数据详情
   * @param {string} date - 日期
   */
  showBodyDetail(date) {
    const record = appData.body.find(b => b.date === date);
    if (!record) return;
    
    Utils.showModal(`
      <div class="modal-header">
        <span>${Utils.formatDate(record.date)}</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="body-detail">
        <div class="detail-section">
          <div class="detail-label">体重</div>
          <div class="detail-value large">${record.weight} <span class="unit">kg</span></div>
        </div>
        <div class="detail-section">
          <div class="detail-label">身体维度</div>
          <div class="dimension-grid">
            ${record.chest ? `<div>胸围: ${record.chest}cm</div>` : ''}
            ${record.waist ? `<div>腰围: ${record.waist}cm</div>` : ''}
            ${record.hips ? `<div>臀围: ${record.hips}cm</div>` : ''}
            ${record.arm ? `<div>上臂: ${record.arm}cm</div>` : ''}
            ${record.leg ? `<div>大腿: ${record.leg}cm</div>` : ''}
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="Utils.closeModal(); BodyModule.editBody('${date}')">编辑</button>
        <button class="btn btn-danger" onclick="Utils.closeModal(); BodyModule.deleteBody('${date}')">删除</button>
      </div>
    `);
  }
};

// 导出到全局
window.BodyModule = BodyModule;