/**
 * 训练记录模块
 * 包含训练相关的所有逻辑
 */

const WorkoutModule = {
  // 当前选中的部位
  selectedParts: [],
  
  // 当前过滤器
  currentFilter: 'all',
  
  // 当前搜索查询
  searchQuery: '',
  
  // 当前页码
  currentPage: 1,
  
  // 每页大小
  pageSize: 10,

  /**
   * 渲染训练页面
   */
  renderWorkoutPage() {
    const { data: workouts, totalPages } = Utils.paginate(appData.workouts, this.currentPage, this.pageSize);
    
    return `
      <div class="page active">
        <div class="page-header">
          <h1>训练记录</h1>
          <div class="header-actions">
            <button class="btn btn-primary" onclick="WorkoutModule.openAddWorkoutModal()">
              ➕ 记录训练
            </button>
          </div>
        </div>
        
        <button class="btn btn-secondary" style="margin-bottom: 16px;" onclick="WorkoutModule.openTemplateModal()">
          📋 使用训练模板
        </button>
        
        ${workouts.length > 0 ? `
          <div class="workout-list">
            ${workouts.map(w => `
              <div class="card" onclick="WorkoutModule.showWorkoutDetail('${w.date}')">
                <div class="workout-header">
                  <div class="workout-date">${Utils.formatDate(w.date)}</div>
                  <div class="workout-parts">${w.parts.join('+')}</div>
                </div>
                <div class="workout-content">
                  ${w.exercises.map(e => `
                    <div class="exercise-row">
                      <span class="exercise-name">${e.name}</span>
                      <span class="exercise-weight">${e.weight}kg</span>
                      <span class="exercise-reps">${e.sets.join('/')}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="workout-footer">
                  <span>${w.sets}组 · ${w.exercises.length}个动作</span>
                  ${w.notes ? `<span>${w.notes}</span>` : ''}
                </div>
                <div class="workout-actions">
                  <button class="btn btn-sm" onclick="event.stopPropagation(); WorkoutModule.editWorkout('${w.date}')">编辑</button>
                  <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); WorkoutModule.deleteWorkout('${w.date}')">删除</button>
                </div>
              </div>
            `).join('')}
          </div>
          ${Utils.renderPagination(this.currentPage, totalPages, 'Workout')}
        ` : `
          <div class="empty-state">
            <div style="font-size: 48px; margin-bottom: 16px;">🏋️</div>
            <div style="font-weight: 600; margin-bottom: 8px;">还没有训练记录</div>
            <div style="color: var(--text-muted);">点击上方按钮开始记录你的第一次训练</div>
          </div>
        `}
      </div>
    `;
  },
  
  handlePrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      navigateTo('workout');
    }
  },
  
  handleNextPage() {
    const totalPages = Math.ceil(appData.workouts.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      navigateTo('workout');
    }
  },

  /**
   * 渲染训练编辑页面
   */
  renderWorkoutEditPage() {
    const isEdit = window.currentPage === 'workout-edit';
    const params = window.currentParams || {};
    const workoutData = isEdit && params.date 
      ? appData.workouts.find(w => w.date === params.date) 
      : null;
    
    const presets = workoutData || {
      date: new Date().toISOString().split('T')[0],
      parts: [],
      exercises: [{ name: '', weight: 0, sets: [8], totalReps: 8, notes: '' }]
    };
    
    this.selectedParts = presets.parts || [];
    const exercises = this.getFilteredExercises();
    
    // 渲染动作列表的HTML
    const exerciseHtml = workoutData && workoutData.exercises.length > 0 
      ? workoutData.exercises.map((ex, index) => {
          const exerciseId = 'ex-' + Date.now() + '-' + index;
          return `
          <div class="exercise-item" id="${exerciseId}">
            <div class="exercise-header">
              <div class="exercise-name-tag">${ex.name}</div>
              <div class="exercise-actions">
                <button type="button" class="move-btn" onclick="WorkoutModule.moveExercise('${exerciseId}', -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button type="button" class="move-btn" onclick="WorkoutModule.moveExercise('${exerciseId}', 1)" ${index === workoutData.exercises.length - 1 ? 'disabled' : ''}>↓</button>
                <button type="button" class="star-btn" id="star-${exerciseId}" 
                        onclick="WorkoutModule.toggleStarByName('${ex.name}')" 
                        style="visibility: visible;">
                  ${appData.starredExercises.includes(ex.name) ? '⭐' : '☆'}
                </button>
              </div>
            </div>
            <input type="hidden" name="exercise-${exerciseId}" value="${ex.name}">
            <div class="input-with-unit">
              <div class="input-group" style="flex:1">
                <label>重量</label>
                <input type="number" name="weight-${exerciseId}" placeholder="55" step="0.5" value="${ex.weight}">
              </div>
              <div class="input-group" style="flex:2">
                <label>次数</label>
                <input type="text" name="reps-${exerciseId}" placeholder="8/8/8/8" value="${ex.sets.join('/')}">
              </div>
            </div>
            <div class="input-group" style="margin-top: 8px;">
              <input type="text" name="notes-${exerciseId}" placeholder="备注：如最佳表现" value="${ex.notes || ''}">
            </div>
            <button type="button" class="delete-btn" onclick="WorkoutModule.removeExercise('${exerciseId}')">×</button>
          </div>
        `;
      }).join('')
      : '';
    
    return `
      <div class="page active" style="padding-bottom: 80px;">
        <div class="edit-header">
          <button class="back-btn" onclick="goBack()">←</button>
          <span class="edit-title">${isEdit ? '编辑训练' : '记录训练'}</span>
          <button class="save-btn" onclick="WorkoutModule.saveWorkoutFromPage()">保存</button>
        </div>
        
        <form id="workoutForm" onsubmit="WorkoutModule.saveWorkoutFromPage(event)">
          <div class="card">
            <div class="input-group">
              <label>训练日期</label>
              <input type="date" name="date" value="${presets.date}" required>
            </div>
          </div>
          
          <div class="card">
            <div class="input-group">
              <label>训练部位</label>
              <div class="tag-group" id="partTags">
                <span class="tag ${this.selectedParts.includes('胸') ? 'active' : ''}" data-part="胸" onclick="WorkoutModule.togglePartTag(this)">胸</span>
                <span class="tag ${this.selectedParts.includes('背') ? 'active' : ''}" data-part="背" onclick="WorkoutModule.togglePartTag(this)">背</span>
                <span class="tag ${this.selectedParts.includes('肩') ? 'active' : ''}" data-part="肩" onclick="WorkoutModule.togglePartTag(this)">肩</span>
                <span class="tag ${this.selectedParts.includes('腿') ? 'active' : ''}" data-part="腿" onclick="WorkoutModule.togglePartTag(this)">腿</span>
                <span class="tag ${this.selectedParts.includes('手臂') ? 'active' : ''}" data-part="手臂" onclick="WorkoutModule.togglePartTag(this)">手臂</span>
                <span class="tag ${this.selectedParts.includes('有氧') ? 'active' : ''}" data-part="有氧" onclick="WorkoutModule.togglePartTag(this)">有氧</span>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="input-group">
              <label>动作列表</label>
              <button type="button" class="collapse-btn" onclick="WorkoutModule.toggleExerciseList()" id="collapseBtn">
                ▼ 展开动作列表
              </button>
              <div id="exerciseSelectContainer" style="display: none;">
                <div class="search-box">
                  <input type="text" placeholder="🔍 搜索动作..." oninput="WorkoutModule.filterExercises(this.value)">
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="tag tag-filter ${this.currentFilter === 'starred' ? 'active' : ''}" onclick="WorkoutModule.setFilter('starred')">⭐ 收藏</span>
                  <span class="tag tag-filter ${this.currentFilter === 'all' ? 'active' : ''}" onclick="WorkoutModule.setFilter('all')">全部</span>
                  <span class="tag tag-filter ${this.currentFilter === 'chest' ? 'active' : ''}" onclick="WorkoutModule.setFilter('chest')">胸</span>
                  <span class="tag tag-filter ${this.currentFilter === 'back' ? 'active' : ''}" onclick="WorkoutModule.setFilter('back')">背</span>
                  <span class="tag tag-filter ${this.currentFilter === 'shoulder' ? 'active' : ''}" onclick="WorkoutModule.setFilter('shoulder')">肩</span>
                  <span class="tag tag-filter ${this.currentFilter === 'legs' ? 'active' : ''}" onclick="WorkoutModule.setFilter('legs')">腿</span>
                  <span class="tag tag-filter ${this.currentFilter === 'arms' ? 'active' : ''}" onclick="WorkoutModule.setFilter('arms')">手臂</span>
                </div>
                <div id="exerciseSelectList" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
                  ${exercises.map(e => `
                    <span class="exercise-tag ${appData.starredExercises.includes(e.name) ? 'starred' : ''}" 
                          onclick="WorkoutModule.addExerciseByName('${e.name}')">
                      ${appData.starredExercises.includes(e.name) ? '⭐' : ''}${e.name}
                    </span>
                  `).join('')}
                </div>
              </div>
              <div id="exerciseList">${exerciseHtml}</div>
              <button type="button" class="btn btn-secondary" style="margin-top: 8px;" onclick="WorkoutModule.addEmptyExercise()">
                ➕ 添加动作
              </button>
            </div>
          </div>
        </form>
        
        <div class="fixed-bottom">
          <button class="btn btn-primary" style="width: 100%;" onclick="WorkoutModule.saveWorkoutFromPage()">
            ${isEdit ? '保存修改' : '保存训练'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 添加动作到训练列表
   * @param {string} name - 动作名称
   */
  addExerciseByName(name) {
    const list = document.getElementById('exerciseList');
    const exerciseId = 'ex-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const lastEx = this.getLastExerciseData(name);
    const defaultWeight = lastEx ? lastEx.weight : 0;
    const defaultSets = lastEx ? lastEx.sets : [8, 8, 8, 8];
    
    const html = `
      <div class="exercise-item selected" id="${exerciseId}">
        <div class="exercise-header">
          <div class="exercise-name-tag">${name}</div>
          <button type="button" class="star-btn" id="star-${exerciseId}" 
                  onclick="WorkoutModule.toggleStar('${exerciseId}')" 
                  style="visibility: visible;">
            ${appData.starredExercises.includes(name) ? '⭐' : '☆'}
          </button>
        </div>
        <input type="hidden" name="exercise-${exerciseId}" value="${name}">
        <div class="input-with-unit">
          <div class="input-group" style="flex:1">
            <label>重量</label>
            <input type="number" name="weight-${exerciseId}" placeholder="55" step="0.5" value="${defaultWeight}">
          </div>
          <div class="input-group" style="flex:2">
            <label>次数</label>
            <input type="text" name="reps-${exerciseId}" placeholder="8/8/8/8" value="${defaultSets.join('/')}">
          </div>
        </div>
        <div class="input-group" style="margin-top: 8px;">
          <input type="text" name="notes-${exerciseId}" placeholder="备注：如最佳表现">
        </div>
        <button type="button" class="delete-btn" onclick="WorkoutModule.removeExercise('${exerciseId}', '${name}')">×</button>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
    
    // 更新动作标签的选中状态
    this.updateSelectedTags();
  },

  /**
   * 添加空动作输入项
   */
  addEmptyExercise() {
    const list = document.getElementById('exerciseList');
    const exerciseId = 'ex-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const exercises = this.getFilteredExercises();
    
    const html = `
      <div class="exercise-item" id="${exerciseId}">
        <div class="exercise-header">
          <select name="exercise-${exerciseId}" class="exercise-select" onchange="WorkoutModule.onExerciseSelect('${exerciseId}', this.value)">
            <option value="">➕ 选择动作</option>
            ${exercises.map(e => `
              <option value="${e.name}" ${appData.starredExercises.includes(e.name) ? 'data-starred="1"' : ''}>
                ${appData.starredExercises.includes(e.name) ? '⭐ ' : ''}${e.name}
              </option>
            `).join('')}
          </select>
          <button type="button" class="star-btn" id="star-${exerciseId}" onclick="WorkoutModule.toggleStar('${exerciseId}')" style="visibility: hidden;">☆</button>
        </div>
        <div class="input-with-unit">
          <div class="input-group" style="flex:1">
            <label>重量</label>
            <input type="number" name="weight-${exerciseId}" placeholder="55" step="0.5">
          </div>
          <div class="input-group" style="flex:2">
            <label>次数</label>
            <input type="text" name="reps-${exerciseId}" placeholder="8/8/8/8">
          </div>
        </div>
        <div class="input-group" style="margin-top: 8px;">
          <input type="text" name="notes-${exerciseId}" placeholder="备注">
        </div>
        <button type="button" class="delete-btn" onclick="WorkoutModule.removeExercise('${exerciseId}')">×</button>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
  },

  /**
   * 动作选择回调
   * @param {string} exerciseId - 动作唯一ID
   * @param {string} value - 动作名称
   */
  onExerciseSelect(exerciseId, value) {
    const starBtn = document.getElementById(`star-${exerciseId}`);
    if (value) {
      starBtn.style.visibility = 'visible';
      starBtn.textContent = appData.starredExercises.includes(value) ? '⭐' : '☆';
      starBtn.className = 'star-btn' + (appData.starredExercises.includes(value) ? ' starred' : '');
      
      const lastEx = this.getLastExerciseData(value);
      if (lastEx) {
        const item = document.getElementById(exerciseId);
        item.querySelector(`[name^="weight-"]`).value = lastEx.weight;
        item.querySelector(`[name^="reps-"]`).value = lastEx.sets.join('/');
      }
    } else {
      starBtn.style.visibility = 'hidden';
    }
  },

  /**
   * 切换收藏状态
   * @param {string} exerciseId - 动作唯一ID
   */
  toggleStar(exerciseId) {
    const item = document.getElementById(exerciseId);
    const select = item.querySelector(`[name^="exercise-"]`);
    const exerciseName = select ? select.value : item.querySelector(`[name^="exercise-"]`)?.value;
    if (!exerciseName) return;
    
    appData.starredExercises = Storage.toggleStarExercise(exerciseName);
    
    const starBtn = document.getElementById(`star-${exerciseId}`);
    starBtn.textContent = appData.starredExercises.includes(exerciseName) ? '⭐' : '☆';
    starBtn.className = 'star-btn' + (appData.starredExercises.includes(exerciseName) ? ' starred' : '');
  },

  /**
   * 获取动作的上次训练数据
   * @param {string} name - 动作名称
   */
  getLastExerciseData(name) {
    const workouts = [...appData.workouts].reverse();
    for (const w of workouts) {
      const ex = w.exercises.find(e => e.name === name);
      if (ex) return ex;
    }
    return null;
  },

  /**
   * 设置过滤器
   * @param {string} filter - 过滤器名称
   */
  setFilter(filter) {
    this.currentFilter = filter;
    const tags = document.querySelectorAll('.tag-filter');
    tags.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tag-filter[onclick="WorkoutModule.setFilter('${filter}')"]`).classList.add('active');
    this.updateExerciseSelectList();
  },

  /**
   * 过滤动作
   * @param {string} query - 搜索关键词
   */
  filterExercises(query) {
    this.searchQuery = query.toLowerCase();
    this.updateExerciseSelectList();
  },

  /**
   * 切换动作列表展开/收起
   */
  toggleExerciseList() {
    const container = document.getElementById('exerciseSelectContainer');
    const btn = document.getElementById('collapseBtn');
    
    if (container.style.display === 'none') {
      container.style.display = 'block';
      btn.textContent = '▲ 收起动作列表';
    } else {
      container.style.display = 'none';
      btn.textContent = '▼ 展开动作列表';
    }
  },

  /**
   * 获取过滤后的动作列表
   */
  getFilteredExercises() {
    let exercises = [...appData.exerciseLibrary];
    
    if (this.currentFilter === 'starred') {
      exercises = exercises.filter(e => appData.starredExercises.includes(e.name));
    } else if (this.currentFilter !== 'all') {
      exercises = exercises.filter(e => e.category === this.currentFilter);
    }
    
    if (this.searchQuery) {
      exercises = exercises.filter(e => e.name.includes(this.searchQuery));
    }
    
    exercises.sort((a, b) => {
      const aStarred = appData.starredExercises.includes(a.name);
      const bStarred = appData.starredExercises.includes(b.name);
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;
      return 0;
    });
    
    return exercises;
  },

  /**
   * 更新动作选择列表
   */
  updateExerciseSelectList() {
    const list = document.getElementById('exerciseSelectList');
    if (!list) return;
    
    const exercises = this.getFilteredExercises();
    list.innerHTML = exercises.map(e => `
      <span class="exercise-tag ${appData.starredExercises.includes(e.name) ? 'starred' : ''}" 
            onclick="WorkoutModule.addExerciseByName('${e.name}')">
        ${appData.starredExercises.includes(e.name) ? '⭐' : ''}${e.name}
      </span>
    `).join('');
  },

  /**
   * 切换部位标签
   * @param {HTMLElement} el - 标签元素
   */
  togglePartTag(el) {
    el.classList.toggle('active');
    const part = el.dataset.part;
    const index = this.selectedParts.indexOf(part);
    if (index !== -1) {
      this.selectedParts.splice(index, 1);
    } else {
      this.selectedParts.push(part);
    }
  },

  /**
   * 移除动作
   * @param {string} exerciseId - 动作唯一ID
   * @param {string} exerciseName - 动作名称（可选）
   */
  removeExercise(exerciseId, exerciseName = '') {
    const item = document.getElementById(exerciseId);
    if (item) item.remove();
    
    // 更新动作标签的选中状态
    this.updateSelectedTags();
    
    // 更新排序按钮状态
    this.updateMoveButtons();
  },

  /**
   * 移动动作位置（上下调整顺序）
   * @param {string} exerciseId - 动作唯一ID
   * @param {number} direction - 移动方向（-1=上移, 1=下移）
   */
  moveExercise(exerciseId, direction) {
    const list = document.getElementById('exerciseList');
    const item = document.getElementById(exerciseId);
    if (!list || !item) return;
    
    const items = Array.from(list.querySelectorAll('.exercise-item'));
    const currentIndex = items.indexOf(item);
    const newIndex = currentIndex + direction;
    
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const targetItem = items[newIndex];
    
    if (direction > 0) {
      targetItem.parentNode.insertBefore(item, targetItem.nextSibling);
    } else {
      targetItem.parentNode.insertBefore(item, targetItem);
    }
    
    // 更新排序按钮状态
    this.updateMoveButtons();
  },

  /**
   * 更新排序按钮的禁用状态
   */
  updateMoveButtons() {
    const list = document.getElementById('exerciseList');
    if (!list) return;
    
    const items = list.querySelectorAll('.exercise-item');
    items.forEach((item, index) => {
      const upBtn = item.querySelector('.move-btn:first-child');
      const downBtn = item.querySelector('.move-btn:last-of-type');
      
      if (upBtn) upBtn.disabled = index === 0;
      if (downBtn) downBtn.disabled = index === items.length - 1;
    });
  },

  /**
   * 按名称切换收藏状态
   * @param {string} exerciseName - 动作名称
   */
  toggleStarByName(exerciseName) {
    const index = appData.starredExercises.indexOf(exerciseName);
    if (index >= 0) {
      appData.starredExercises.splice(index, 1);
    } else {
      appData.starredExercises.push(exerciseName);
    }
    Storage.saveStarredExercises(appData.starredExercises);
    
    // 更新所有同名动作的星星按钮
    document.querySelectorAll('.star-btn').forEach(btn => {
      if (btn.onclick && btn.onclick.toString().includes(exerciseName)) {
        btn.textContent = appData.starredExercises.includes(exerciseName) ? '⭐' : '☆';
      }
    });
  },

  /**
   * 更新动作标签的选中状态
   */
  updateSelectedTags() {
    // 获取已添加的动作名称
    const addedExercises = [];
    const list = document.getElementById('exerciseList');
    if (list) {
      list.querySelectorAll('.exercise-item').forEach(item => {
        const nameInput = item.querySelector('[name^="exercise-"]');
        if (nameInput && nameInput.value) {
          addedExercises.push(nameInput.value);
        }
      });
    }
    
    // 更新标签选中状态
    const tags = document.querySelectorAll('.exercise-tag');
    tags.forEach(tag => {
      const tagName = tag.textContent.replace('⭐', '').trim();
      if (addedExercises.includes(tagName)) {
        tag.classList.add('selected');
      } else {
        tag.classList.remove('selected');
      }
    });
  },

  /**
   * 从页面保存训练
   * @param {Event} event - 表单提交事件
   */
  saveWorkoutFromPage(event) {
    if (event) event.preventDefault();
    
    const form = document.getElementById('workoutForm');
    if (!form) return;
    
    const date = form.date.value;
    const isEdit = window.currentPage === 'workout-edit';
    
    const exercises = [];
    const list = document.getElementById('exerciseList');
    list.querySelectorAll('.exercise-item').forEach(item => {
      const exerciseId = item.id;
      const name = item.querySelector(`[name^="exercise-"]`)?.value;
      const weight = parseFloat(item.querySelector(`[name^="weight-"]`)?.value) || 0;
      const repsStr = item.querySelector(`[name^="reps-"]`)?.value || '';
      const notes = item.querySelector(`[name^="notes-"]`)?.value || '';
      
      if (name) {
        const sets = repsStr.split('/').map(r => parseInt(r) || 0).filter(r => r > 0);
        const totalReps = sets.reduce((a, b) => a + b, 0);
        exercises.push({ name, weight, sets, totalReps, notes });
        
        if (!appData.exerciseLibrary.find(ex => ex.name === name)) {
          Storage.addExercise(name, 'custom', '其他');
        }
      }
    });
    
    if (exercises.length === 0) {
      Utils.showToast('请至少添加一个动作');
      return;
    }
    
    const invalidExercises = exercises.filter(e => e.sets.length === 0);
    if (invalidExercises.length > 0) {
      Utils.showToast(`请为 ${invalidExercises[0].name} 填写次数`);
      return;
    }
    
    const workout = {
      date,
      parts: this.selectedParts.length > 0 ? this.selectedParts : ['全身'],
      exercises,
      sets: exercises.reduce((sum, e) => sum + e.sets.length, 0)
    };
    
    const existingIndex = appData.workouts.findIndex(w => w.date === date);
    
    if (existingIndex >= 0 && !isEdit) {
      Utils.showConfirm('⚠️', '日期重复', '该日期已有训练记录，是否覆盖？', () => {
        this.saveAndRedirect(workout);
      });
    } else {
      this.saveAndRedirect(workout);
    }
  },

  /**
   * 保存并重定向
   * @param {object} workout - 训练记录
   */
  saveAndRedirect(workout) {
    const existingIndex = appData.workouts.findIndex(w => w.date === workout.date);
    
    if (existingIndex >= 0) {
      appData.workouts[existingIndex] = workout;
      Storage.updateWorkout(workout.date, workout);
      Utils.showToast('训练记录已更新');
    } else {
      appData.workouts.push(workout);
      Storage.addWorkout(workout);
      Storage.saveLastWorkout(workout);
      appData.lastWorkout = workout;
      Utils.showToast('训练记录已保存');
    }
    
    this.checkForPRs(workout);
    
    navigateTo('workout');
  },

  /**
   * 检查是否有 PR 突破
   * @param {object} workout - 训练记录
   */
  checkForPRs(workout) {
    const newPRs = [];
    
    workout.exercises.forEach(exercise => {
      const maxReps = Math.max(...exercise.sets);
      const prData = {
        weight: exercise.weight,
        reps: maxReps,
        date: workout.date
      };
      
      const result = Storage.updatePR(exercise.name, prData);
      if (result.isNewPR) {
        newPRs.push({ name: exercise.name, type: result.breakType });
      }
    });
    
    if (newPRs.length > 0) {
      const messages = newPRs.map(pr => {
        const typeIcon = pr.type === 'weight' ? '💪' : pr.type === 'reps' ? '🔢' : pr.type === 'volume' ? '📈' : '🎯';
        return `${typeIcon} ${pr.name}`;
      });
      Utils.showToast(`🏆 PR突破！${messages.join('、')}`, '查看纪录', () => {
        navigateTo('pr');
      }, 8000);
    }
  },

  /**
   * 保存训练（模态框版本）
   * @param {Event} e - 表单提交事件
   */
  saveWorkout(e) {
    e.preventDefault();
    // 保留原有的模态框保存逻辑
  },

  /**
   * 删除训练记录
   * @param {string} date - 日期
   */
  deleteWorkout(date) {
    Utils.showConfirm('🗑️', '确认删除', '确定要删除这条训练记录吗？此操作可以撤销。', () => {
      const workout = appData.workouts.find(w => w.date === date);
      const deletedExerciseNames = workout.exercises.map(e => e.name);
      appData.workouts = Storage.deleteWorkout(date);
      
      if (appData.lastWorkout && appData.lastWorkout.date === date) {
        appData.lastWorkout = Storage.getLastWorkout();
      }
      
      this.recalculatePRsAfterDeletion(deletedExerciseNames);
      
      Utils.showToast('训练记录已删除', '撤销', () => {
        appData.workouts.push(workout);
        Storage.addWorkout(workout);
        if (!appData.lastWorkout) {
          Storage.saveLastWorkout(workout);
          appData.lastWorkout = workout;
        }
        this.recalculatePRsAfterDeletion([]);
        Utils.showToast('已恢复训练记录');
      });
      
      navigateTo('workout');
    });
  },

  /**
   * 删除训练后重新计算PR
   * @param {Array} deletedExerciseNames - 被删除的动作名称列表
   */
  recalculatePRsAfterDeletion(deletedExerciseNames) {
    const prs = Storage.getPRs();
    let needsRecalculation = false;
    
    deletedExerciseNames.forEach(name => {
      if (prs[name]) {
        needsRecalculation = true;
      }
    });
    
    if (!needsRecalculation) return;
    
    const newPRs = {};
    appData.workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const maxReps = Math.max(...exercise.sets);
        const volume = exercise.weight * maxReps;
        
        if (!newPRs[exercise.name] || 
            exercise.weight > newPRs[exercise.name].weight ||
            (exercise.weight === newPRs[exercise.name].weight && maxReps > newPRs[exercise.name].reps) ||
            volume > (newPRs[exercise.name].weight * newPRs[exercise.name].reps)) {
          newPRs[exercise.name] = {
            weight: exercise.weight,
            reps: maxReps,
            date: workout.date,
            type: newPRs[exercise.name] ? 
              (exercise.weight > newPRs[exercise.name].weight ? 'weight' : 
               (exercise.weight === newPRs[exercise.name].weight && maxReps > newPRs[exercise.name].reps ? 'reps' : 'volume')) : 'first'
          };
        }
      });
    });
    
    Storage.savePRs(newPRs);
  },

  /**
   * 编辑训练记录
   * @param {string} date - 日期
   */
  editWorkout(date) {
    navigateTo('workout-edit', { date });
  },

  /**
   * 显示训练详情
   * @param {string} date - 日期
   */
  showWorkoutDetail(date) {
    const workout = appData.workouts.find(w => w.date === date);
    if (!workout) return;
    
    Utils.showModal(`
      <div class="modal-header">
        <span>${Utils.formatDate(workout.date)}</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="workout-detail">
        <div class="detail-section">
          <div class="detail-label">训练部位</div>
          <div class="detail-value">${workout.parts.join(' + ')}</div>
        </div>
        <div class="detail-section">
          <div class="detail-label">动作列表</div>
          <div class="exercise-list">
            ${workout.exercises.map((e, idx) => `
              <div class="exercise-detail">
                <div class="exercise-order">${idx + 1}</div>
                <div class="exercise-info">
                  <div class="exercise-name">${e.name}</div>
                  <div class="exercise-stats">${e.weight}kg × ${e.sets.join('/')}次</div>
                  ${e.notes ? `<div class="exercise-notes">${e.notes}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="detail-summary">
          共 ${workout.sets} 组，${workout.exercises.length} 个动作
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="Utils.closeModal(); WorkoutModule.editWorkout('${date}')">编辑</button>
        <button class="btn btn-danger" onclick="Utils.closeModal(); WorkoutModule.deleteWorkout('${date}')">删除</button>
      </div>
    `);
  },

  /**
   * 打开模板选择模态框
   */
  openTemplateModal() {
    const recentWorkouts = appData.workouts.slice(-5);
    
    Utils.showModal(`
      <div class="modal-header">
        <span>选择训练模板</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <button class="btn btn-secondary" style="flex: 1;" onclick="WorkoutModule.openAddTemplateModal()">
          ➕ 创建新模板
        </button>
        <button class="btn btn-primary" style="flex: 1;" onclick="WorkoutModule.createTemplateFromHistory()">
          📊 从历史创建
        </button>
      </div>
      
      ${recentWorkouts.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">📝 快速从历史训练创建模板：</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${recentWorkouts.map(w => `
              <div class="history-workout-card" onclick="WorkoutModule.createTemplateFromWorkout('${w.date}')">
                <div style="font-weight: 600;">${Utils.formatDate(w.date)}</div>
                <div style="font-size: 12px; color: var(--text-muted);">${w.parts.join('+')} · ${w.exercises.length}个动作</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div id="templateList">
        ${appData.templates.map(t => `
          <div class="template-card" onclick="WorkoutModule.selectTemplate('${t.id}')">
            <div class="template-name">${t.name}</div>
            <div class="template-desc">${t.exercises.length}个动作</div>
            <div class="template-actions">
              ${t.exercises.slice(0, 3).join('、')}...
            </div>
            ${t.id.startsWith('custom_') ? `
              <div class="action-bar" style="border-top: none; padding-top: 0; margin-top: 8px;">
                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); WorkoutModule.deleteTemplate('${t.id}')" style="color: var(--danger);">删除</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `);
  },

  /**
   * 打开添加模板模态框
   */
  openAddTemplateModal() {
    Utils.closeModal();
    Utils.showModal(`
      <div class="modal-header">
        <span>创建训练模板</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <form id="templateForm" onsubmit="WorkoutModule.saveTemplate(event)">
        <div class="input-group">
          <label>模板名称</label>
          <input type="text" name="name" placeholder="如：胸部训练" required>
        </div>
        <div class="input-group">
          <label>选择动作</label>
          <div id="templateExerciseTags">
            ${appData.exerciseLibrary.map(e => `
              <span class="tag" data-exercise="${e.name}" onclick="WorkoutModule.toggleTemplateExercise(this)">${e.name}</span>
            `).join('')}
          </div>
        </div>
        <div class="input-group">
          <label>已选择的动作</label>
          <div id="selectedTemplateExercises">
            <div style="color: var(--text-muted); font-size: 14px;">点击上方动作添加</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">保存模板</button>
      </form>
    `);
  },

  // 模板相关变量（临时）
  selectedTemplateExercises: [],

  /**
   * 切换模板动作选择
   * @param {HTMLElement} el - 标签元素
   */
  toggleTemplateExercise(el) {
    const exercise = el.dataset.exercise;
    el.classList.toggle('active');
    
    if (el.classList.contains('active')) {
      this.selectedTemplateExercises.push(exercise);
    } else {
      this.selectedTemplateExercises = this.selectedTemplateExercises.filter(e => e !== exercise);
    }
    
    this.updateSelectedTemplateExercises();
  },

  /**
   * 更新已选择的模板动作
   */
  updateSelectedTemplateExercises() {
    const container = document.getElementById('selectedTemplateExercises');
    if (this.selectedTemplateExercises.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); font-size: 14px;">点击上方动作添加</div>';
    } else {
      container.innerHTML = this.selectedTemplateExercises.map(e => `
        <span class="tag active" style="margin: 4px;" onclick="WorkoutModule.removeTemplateExercise('${e}')">${e} ×</span>
      `).join('');
    }
  },

  /**
   * 移除模板动作
   * @param {string} exercise - 动作名称
   */
  removeTemplateExercise(exercise) {
    this.selectedTemplateExercises = this.selectedTemplateExercises.filter(e => e !== exercise);
    const tag = document.querySelector(`[data-exercise="${exercise}"]`);
    if (tag) tag.classList.remove('active');
    this.updateSelectedTemplateExercises();
  },

  /**
   * 保存模板
   * @param {Event} e - 表单提交事件
   */
  saveTemplate(e) {
    e.preventDefault();
    const name = e.target.name.value;
    
    if (this.selectedTemplateExercises.length === 0) {
      Utils.showToast('请至少选择一个动作');
      return;
    }
    
    const parts = [...new Set(this.selectedTemplateExercises.map(e => {
      const ex = appData.exerciseLibrary.find(x => x.name === e);
      return ex ? ex.muscle : '其他';
    }))];
    
    const template = {
      id: 'custom_' + Date.now(),
      name,
      exercises: this.selectedTemplateExercises,
      parts
    };
    
    appData.templates = Storage.addTemplate(template);
    Utils.showToast('模板已保存');
    Utils.closeModal();
    this.selectedTemplateExercises = [];
  },

  /**
   * 删除模板
   * @param {string} id - 模板ID
   */
  deleteTemplate(id) {
    Utils.showConfirm('🗑️', '确认删除', '确定要删除这个模板吗？', () => {
      appData.templates = Storage.deleteTemplate(id);
      Utils.showToast('模板已删除');
      Utils.closeModal();
      this.openTemplateModal();
    });
  },

  /**
   * 从历史训练创建模板
   */
  createTemplateFromHistory() {
    Utils.closeModal();
    Utils.showModal(`
      <div class="modal-header">
        <span>从历史训练创建模板</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="max-height: 400px; overflow-y: auto;">
        ${appData.workouts.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${appData.workouts.slice(-10).reverse().map(w => `
              <div class="history-workout-card" onclick="WorkoutModule.createTemplateFromWorkout('${w.date}')">
                <div style="font-weight: 600;">${Utils.formatDate(w.date)}</div>
                <div style="font-size: 12px; color: var(--text-muted);">${w.parts.join('+')} · ${w.exercises.length}个动作</div>
                <div style="font-size: 12px; margin-top: 4px;">${w.exercises.map(e => e.name).join('、')}</div>
              </div>
            `).join('')}
          </div>
        ` : `<div style="text-align: center; padding: 32px; color: #999;">暂无训练记录</div>`}
      </div>
    `);
  },

  /**
   * 从指定训练创建模板
   * @param {string} date - 训练日期
   */
  createTemplateFromWorkout(date) {
    const workout = appData.workouts.find(w => w.date === date);
    if (!workout) return;
    
    const templateName = `${workout.parts.join('+')}训练模板`;
    
    const newTemplate = {
      id: 'custom_' + Date.now(),
      name: templateName,
      parts: workout.parts,
      exercises: workout.exercises.map(e => e.name),
      createdAt: new Date().toISOString()
    };
    
    appData.templates.push(newTemplate);
    Storage.saveTemplates(appData.templates);
    
    Utils.closeModal();
    Utils.showToast(`模板 "${templateName}" 创建成功！`);
    this.openTemplateModal();
  },

  /**
   * 选择模板
   * @param {string} id - 模板ID
   */
  selectTemplate(id) {
    const template = appData.templates.find(t => t.id === id);
    if (!template) return;
    
    // 使用模板创建训练
    const exercises = template.exercises.map(name => {
      const lastEx = this.getLastExerciseData(name);
      return {
        name,
        weight: lastEx ? lastEx.weight : 0,
        sets: lastEx ? lastEx.sets : [8, 8, 8, 8],
        totalReps: (lastEx ? lastEx.sets : [8, 8, 8, 8]).reduce((a, b) => a + b, 0),
        notes: ''
      };
    });
    
    const workout = {
      date: new Date().toISOString().split('T')[0],
      parts: template.parts || ['全身'],
      exercises,
      sets: exercises.reduce((sum, e) => sum + e.sets.length, 0)
    };
    
    Storage.addWorkout(workout);
    Storage.saveLastWorkout(workout);
    appData.workouts.push(workout);
    appData.lastWorkout = workout;
    
    Utils.showToast('已使用模板创建训练');
    Utils.closeModal();
    navigateTo('workout');
  },

  /**
   * 打开添加训练模态框
   * @param {object} lastWorkoutData - 上次训练数据
   */
  openAddWorkoutModal(lastWorkoutData) {
    navigateTo('workout-add');
  }
};

// 导出到全局
window.WorkoutModule = WorkoutModule;