/**
 * 饮食记录模块
 * 包含饮食相关的所有逻辑
 */

const DietModule = {
  // 当前页码
  currentPage: 1,
  
  // 每页大小
  pageSize: 10,
  
  /**
   * 渲染饮食页面
   */
  renderDietPage() {
    const showProgressBar = appData.settings.showDietProgressBar !== undefined ? appData.settings.showDietProgressBar : true;
    
    const { data: dietRecords, totalPages } = Utils.paginate(appData.diet, this.currentPage, this.pageSize);
    const today = new Date().toISOString().split('T')[0];
    const todayDiet = appData.diet.find(d => d.date === today);
    
    const weeklyData = this.getWeeklyDietData();
    
    return `
      <div class="page active">
        <div class="page-header">
          <h1>饮食记录</h1>
          <div class="header-actions">
            <button class="btn btn-primary" onclick="DietModule.openAddDietModal()">
              ➕ 记录饮食
            </button>
          </div>
        </div>
        
        <!-- 今日统计卡片 -->
        <div class="card">
          <div class="card-title">今日摄入</div>
          <div class="diet-summary">
            <div class="diet-stat">
              <div class="stat-value">${todayDiet ? todayDiet.calories : 0}</div>
              <div class="stat-label">千卡</div>
            </div>
            <div class="diet-stat">
              <div class="stat-value">${todayDiet ? todayDiet.protein : 0}</div>
              <div class="stat-label">蛋白质(g)</div>
            </div>
            <div class="diet-stat">
              <div class="stat-value">${todayDiet ? todayDiet.carbs : 0}</div>
              <div class="stat-label">碳水(g)</div>
            </div>
            <div class="diet-stat">
              <div class="stat-value">${todayDiet ? todayDiet.fat : 0}</div>
              <div class="stat-label">脂肪(g)</div>
            </div>
          </div>
          <div class="calorie-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min((todayDiet?.calories || 0) / appData.settings.calorieGoal * 100, 100)}%"></div>
            </div>
            <div class="progress-text">目标: ${appData.settings.calorieGoal}千卡</div>
          </div>
        </div>
        
        <!-- 本周统计 -->
        <div class="card">
          <div class="card-title">本周摄入</div>
          <div class="week-summary">
            <div class="week-stat">
              <div class="week-value">${weeklyData.avgCalories}</div>
              <div class="week-label">日均千卡</div>
            </div>
            <div class="week-stat">
              <div class="week-value">${weeklyData.daysCount}</div>
              <div class="week-label">记录天数</div>
            </div>
          </div>
        </div>
        
        <!-- 记录列表 -->
        ${dietRecords.length > 0 ? `
          <div class="diet-list">
            ${dietRecords.map(d => {
              const progressPercent = Math.min(d.calories / appData.settings.calorieGoal * 100, 100);
              return `
                <div class="card" onclick="DietModule.showDietDetail('${d.date}')">
                  <div class="diet-header">
                    <div class="diet-date">${Utils.formatDate(d.date)}</div>
                    <div class="diet-calories">${d.calories}千卡</div>
                  </div>
                  <div class="diet-content">
                    <div class="macro-row">
                      <span>🥩 ${d.protein}g蛋白质</span>
                      <span>🍞 ${d.carbs}g碳水</span>
                      <span>🥑 ${d.fat}g脂肪</span>
                    </div>
                    ${d.notes ? `<div class="diet-notes">${d.notes}</div>` : ''}
                  </div>
                  ${showProgressBar ? `
                    <div class="diet-progress">
                      <div class="mini-progress-bar">
                        <div class="mini-progress-fill" style="width: ${progressPercent}%"></div>
                      </div>
                      <div class="mini-progress-text">目标 ${appData.settings.calorieGoal}千卡</div>
                    </div>
                  ` : ''}
                  <div class="diet-actions">
                    <button class="btn btn-sm" onclick="event.stopPropagation(); DietModule.editDiet('${d.date}')">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); DietModule.deleteDiet('${d.date}')">删除</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ${Utils.renderPagination(this.currentPage, totalPages, 'Diet')}
        ` : `
          <div class="empty-state">
            <div style="font-size: 48px; margin-bottom: 16px;">🍽️</div>
            <div style="font-weight: 600; margin-bottom: 8px;">还没有饮食记录</div>
            <div style="color: var(--text-muted);">点击上方按钮开始记录饮食</div>
          </div>
        `}
      </div>
    `;
  },
  
  handlePrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      navigateTo('diet');
    }
  },
  
  handleNextPage() {
    const totalPages = Math.ceil(appData.diet.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      navigateTo('diet');
    }
  },

  /**
   * 获取本周饮食数据
   */
  getWeeklyDietData() {
    const weekStart = Utils.getWeekStart(new Date());
    const weekDiet = appData.diet.filter(d => new Date(d.date) >= weekStart);
    const totalCalories = weekDiet.reduce((sum, d) => sum + d.calories, 0);
    const daysCount = weekDiet.length;
    
    return {
      totalCalories,
      daysCount,
      avgCalories: daysCount > 0 ? Math.round(totalCalories / daysCount) : 0
    };
  },

  /**
   * 打开添加饮食模态框
   */
  openAddDietModal() {
    const today = new Date().toISOString().split('T')[0];
    const todayDiet = appData.diet.find(d => d.date === today);
    
    Utils.showModal(`
      <div class="modal-header">
        <span>${todayDiet ? '编辑今日饮食' : '记录饮食'}</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <form id="dietForm" onsubmit="DietModule.saveDiet(event)">
        <div class="input-group">
          <label>日期</label>
          <input type="date" name="date" value="${today}" required>
        </div>
        
        <div class="input-group">
          <label>千卡</label>
          <input type="number" name="calories" placeholder="如：2500" value="${todayDiet?.calories || ''}" required>
        </div>
        
        <div class="input-row">
          <div class="input-group" style="flex: 1;">
            <label>蛋白质(g)</label>
            <input type="number" name="protein" placeholder="蛋白质" value="${todayDiet?.protein || ''}">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>碳水(g)</label>
            <input type="number" name="carbs" placeholder="碳水" value="${todayDiet?.carbs || ''}">
          </div>
          <div class="input-group" style="flex: 1;">
            <label>脂肪(g)</label>
            <input type="number" name="fat" placeholder="脂肪" value="${todayDiet?.fat || ''}">
          </div>
        </div>
        
        <div class="input-group">
          <label>备注</label>
          <input type="text" name="notes" placeholder="如：今日健身日" value="${todayDiet?.notes || ''}">
        </div>
        
        <button type="submit" class="btn btn-primary">保存</button>
      </form>
    `);
  },

  /**
   * 保存饮食记录
   * @param {Event} e - 表单提交事件
   */
  saveDiet(e) {
    e.preventDefault();
    
    const form = e.target;
    const date = form.date.value;
    const calories = parseInt(form.calories.value) || 0;
    const protein = parseInt(form.protein.value) || 0;
    const carbs = parseInt(form.carbs.value) || 0;
    const fat = parseInt(form.fat.value) || 0;
    const notes = form.notes.value;
    
    const record = {
      date,
      calories,
      protein,
      carbs,
      fat,
      notes
    };
    
    const existingIndex = appData.diet.findIndex(d => d.date === date);
    
    if (existingIndex >= 0) {
      appData.diet[existingIndex] = record;
      Storage.updateDiet(date, record);
      Utils.showToast('饮食记录已更新');
    } else {
      appData.diet.push(record);
      Storage.addDiet(record);
      Utils.showToast('饮食记录已保存');
    }
    
    Utils.closeModal();
    navigateTo('diet');
  },

  /**
   * 删除饮食记录
   * @param {string} date - 日期
   */
  deleteDiet(date) {
    Utils.showConfirm('🗑️', '确认删除', '确定要删除这条饮食记录吗？此操作可以撤销。', () => {
      const record = appData.diet.find(d => d.date === date);
      appData.diet = Storage.deleteDiet(date);
      
      Utils.showToast('饮食记录已删除', '撤销', () => {
        appData.diet.push(record);
        Storage.addDiet(record);
        Utils.showToast('已恢复饮食记录');
        navigateTo('diet');
      });
      
      navigateTo('diet');
    });
  },

  /**
   * 编辑饮食记录
   * @param {string} date - 日期
   */
  editDiet(date) {
    // 直接打开编辑模态框
    Utils.closeModal();
    this.openAddDietModal();
  },

  /**
   * 显示饮食详情
   * @param {string} date - 日期
   */
  showDietDetail(date) {
    const record = appData.diet.find(d => d.date === date);
    if (!record) return;
    
    Utils.showModal(`
      <div class="modal-header">
        <span>${Utils.formatDate(record.date)}</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="diet-detail">
        <div class="detail-section">
          <div class="detail-label">总热量</div>
          <div class="detail-value large">${record.calories} <span class="unit">千卡</span></div>
        </div>
        <div class="detail-section">
          <div class="detail-label">营养素</div>
          <div class="macro-grid">
            <div class="macro-item">
              <div class="macro-icon">🥩</div>
              <div class="macro-value">${record.protein}g</div>
              <div class="macro-label">蛋白质</div>
            </div>
            <div class="macro-item">
              <div class="macro-icon">🍞</div>
              <div class="macro-value">${record.carbs}g</div>
              <div class="macro-label">碳水化合物</div>
            </div>
            <div class="macro-item">
              <div class="macro-icon">🥑</div>
              <div class="macro-value">${record.fat}g</div>
              <div class="macro-label">脂肪</div>
            </div>
          </div>
        </div>
        ${record.notes ? `
          <div class="detail-section">
            <div class="detail-label">备注</div>
            <div class="detail-value">${record.notes}</div>
          </div>
        ` : ''}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="Utils.closeModal(); DietModule.editDiet('${date}')">编辑</button>
        <button class="btn btn-danger" onclick="Utils.closeModal(); DietModule.deleteDiet('${date}')">删除</button>
      </div>
    `);
  },

  /**
   * 更新热量目标
   * @param {number} value - 热量目标值
   */
  updateCalorieGoal(value) {
    appData.settings.calorieGoal = value;
    Storage.updateSettings({ calorieGoal: value });
    Utils.showToast(`目标已设置为 ${value} 千卡`);
  }
};

// 导出到全局
window.DietModule = DietModule;