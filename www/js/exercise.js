/**
 * 动作管理模块
 * 包含动作的增删改查功能
 */

const ExerciseModule = {
  currentFilter: 'all',
  searchKeyword: '',
  
  /**
   * 渲染动作管理页面
   */
  renderExercisePage() {
    const exercises = appData.exerciseLibrary;
    const categories = ['胸', '背', '肩', '腿', '三头', '二头', '其他'];
    
    const filteredExercises = this.filterExercises(exercises);
    
    return `
      <div class="page active">
        <div class="page-header">
          <h1>动作管理</h1>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" id="exerciseSearch" placeholder="搜索动作..." 
                 value="${this.searchKeyword}" onkeyup="ExerciseModule.handleSearch()">
        </div>
        
        <!-- 分类筛选 -->
        <div class="category-filter">
          <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" 
                  onclick="ExerciseModule.setFilter('all')">全部</button>
          ${categories.map(cat => `
            <button class="filter-btn ${this.currentFilter === cat ? 'active' : ''}" 
                    onclick="ExerciseModule.setFilter('${cat}')">${cat}</button>
          `).join('')}
        </div>
        
        <!-- 添加按钮 -->
        <button class="btn btn-primary" style="width: 100%; margin-bottom: 16px;" 
                onclick="ExerciseModule.showAddModal()">
          ➕ 添加动作
        </button>
        
        <!-- 动作网格 -->
        <div class="exercise-grid">
          ${filteredExercises.length > 0 ? filteredExercises.map(ex => this.renderExerciseGridItem(ex)).join('') : `
            <div style="text-align: center; padding: 40px; color: #64748B;">
              <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
              <div>暂无动作</div>
            </div>
          `}
        </div>
      </div>
    `;
  },
  
  /**
   * 渲染网格项
   */
  renderExerciseGridItem(ex) {
    const categoryColors = {
      '胸': '#EF4444',
      '背': '#10B981',
      '肩': '#3B82F6',
      '腿': '#F59E0B',
      '三头': '#8B5CF6',
      '二头': '#EC4899',
      '其他': '#64748B'
    };
    const color = categoryColors[ex.muscle] || '#64748B';
    
    return `
      <div class="exercise-grid-item" data-name="${ex.name}" onclick="ExerciseModule.showDetailModal('${ex.name}')" style="border-color: ${color}30;">
        <div class="exercise-grid-name">${ex.name}</div>
        <div class="exercise-grid-muscle" style="background: ${color}20; color: ${color};">${ex.muscle}</div>
      </div>
    `;
  },
  
  /**
   * 筛选动作
   */
  filterExercises(exercises) {
    let result = exercises;
    
    if (this.currentFilter !== 'all') {
      result = result.filter(ex => ex.muscle === this.currentFilter);
    }
    
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(ex => ex.name.toLowerCase().includes(keyword));
    }
    
    return result;
  },
  
  /**
   * 设置筛选条件
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.render();
  },
  
  /**
   * 处理搜索
   */
  handleSearch() {
    this.searchKeyword = document.getElementById('exerciseSearch').value;
    this.render();
  },
  
  /**
   * 渲染页面
   */
  render() {
    document.getElementById('app').innerHTML = this.renderExercisePage();
    document.getElementById('pageTitle').textContent = '动作管理';
  },
  
  /**
   * 显示详情弹窗
   */
  showDetailModal(name) {
    const exercise = appData.exerciseLibrary.find(ex => ex.name === name);
    if (!exercise) return;
    
    const categoryColors = {
      '胸': '#EF4444',
      '背': '#10B981',
      '肩': '#3B82F6',
      '腿': '#F59E0B',
      '三头': '#8B5CF6',
      '二头': '#EC4899',
      '其他': '#64748B'
    };
    const color = categoryColors[exercise.muscle] || '#64748B';
    
    Utils.showModal(`
      <div class="modal-header">
        <span>动作详情</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="padding: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="detail-muscle-tag" style="background: ${color}20; color: ${color};">${exercise.muscle}</div>
          <div style="font-size: 24px; font-weight: 700; margin-top: 12px;">${exercise.name}</div>
        </div>
        
        <div class="detail-info">
          <div class="detail-row">
            <span class="detail-label">锻炼部位</span>
            <span class="detail-value">${exercise.muscle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">使用器材</span>
            <span class="detail-value">${exercise.equipment || '其他'}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-top: 20px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="ExerciseModule.showEditModal('${exercise.name}'); Utils.closeModal()">
            ✏️ 编辑
          </button>
          <button class="btn btn-danger" style="flex: 1;" onclick="ExerciseModule.confirmDelete('${exercise.name}'); Utils.closeModal()">
            🗑️ 删除
          </button>
        </div>
      </div>
    `);
  },
  
  /**
   * 显示添加动作弹窗
   */
  showAddModal() {
    Utils.showModal(`
      <div class="modal-header">
        <span>添加动作</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="padding: 16px;">
        <div class="input-group">
          <label>动作名称 *</label>
          <input type="text" id="addExerciseName" placeholder="如：杠铃卧推">
        </div>
        <div class="input-group">
          <label>锻炼部位 *</label>
          <select id="addExerciseMuscle">
            <option value="胸">胸</option>
            <option value="背">背</option>
            <option value="肩">肩</option>
            <option value="腿">腿</option>
            <option value="三头">三头</option>
            <option value="二头">二头</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <button class="btn btn-primary" style="margin-top: 16px; width: 100%;" 
                onclick="ExerciseModule.addExercise()">
          添加
        </button>
      </div>
    `);
  },
  
  /**
   * 添加动作
   */
  addExercise() {
    const name = document.getElementById('addExerciseName').value.trim();
    const muscle = document.getElementById('addExerciseMuscle').value;
    
    if (!name) {
      Utils.showToast('请输入动作名称');
      return;
    }
    
    const exists = appData.exerciseLibrary.some(ex => ex.name === name);
    if (exists) {
      Utils.showToast('该动作已存在');
      return;
    }
    
    const newExercise = {
      name,
      muscle,
      category: this.getCategoryFromMuscle(muscle),
      equipment: '其他'
    };
    
    appData.exerciseLibrary.push(newExercise);
    Storage.saveExerciseLibrary(appData.exerciseLibrary);
    
    Utils.closeModal();
    Utils.showToast('动作添加成功！');
    this.render();
  },
  
  /**
   * 显示编辑动作弹窗
   */
  showEditModal(name) {
    const exercise = appData.exerciseLibrary.find(ex => ex.name === name);
    if (!exercise) return;
    
    Utils.showModal(`
      <div class="modal-header">
        <span>编辑动作</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="padding: 16px;">
        <div class="input-group">
          <label>动作名称 *</label>
          <input type="text" id="editExerciseName" value="${exercise.name}">
        </div>
        <div class="input-group">
          <label>锻炼部位 *</label>
          <select id="editExerciseMuscle">
            ${['胸', '背', '肩', '腿', '三头', '二头', '其他'].map(m => `
              <option value="${m}" ${exercise.muscle === m ? 'selected' : ''}>${m}</option>
            `).join('')}
          </select>
        </div>
        <button class="btn btn-primary" style="margin-top: 16px; width: 100%;" 
                onclick="ExerciseModule.updateExercise('${name}')">
          保存
        </button>
      </div>
    `);
  },
  
  /**
   * 更新动作
   */
  updateExercise(oldName) {
    const name = document.getElementById('editExerciseName').value.trim();
    const muscle = document.getElementById('editExerciseMuscle').value;
    
    if (!name) {
      Utils.showToast('请输入动作名称');
      return;
    }
    
    const index = appData.exerciseLibrary.findIndex(ex => ex.name === oldName);
    if (index === -1) return;
    
    const exercise = appData.exerciseLibrary[index];
    exercise.name = name;
    exercise.muscle = muscle;
    exercise.category = this.getCategoryFromMuscle(muscle);
    
    Storage.saveExerciseLibrary(appData.exerciseLibrary);
    
    Utils.closeModal();
    Utils.showToast('动作更新成功！');
    this.render();
  },
  
  /**
   * 确认删除动作
   */
  confirmDelete(name) {
    Utils.showConfirm(
      '🗑️',
      '确认删除',
      `确定要删除动作 "${name}" 吗？此操作不可恢复！`,
      () => this.deleteExercise(name),
      () => {}
    );
  },
  
  /**
   * 删除动作
   */
  deleteExercise(name) {
    const index = appData.exerciseLibrary.findIndex(ex => ex.name === name);
    if (index === -1) return;
    
    appData.exerciseLibrary.splice(index, 1);
    Storage.saveExerciseLibrary(appData.exerciseLibrary);
    
    Utils.showToast('动作删除成功！');
    this.render();
  },
  
  /**
   * 根据部位获取分类
   */
  getCategoryFromMuscle(muscle) {
    const categoryMap = {
      '胸': 'chest',
      '背': 'back',
      '肩': 'shoulder',
      '腿': 'legs',
      '三头': 'triceps',
      '二头': 'biceps',
      '其他': 'other'
    };
    return categoryMap[muscle] || 'other';
  }
};