/**
 * 数据存储模块
 * 包含所有LocalStorage操作
 */

const Storage = {
  // 存储键名
  KEYS: {
    WORKOUTS: 'fitness_workouts',
    DIET: 'fitness_diet',
    BODY: 'fitness_body',
    EXERCISE_LIBRARY: 'fitness_exercises',
    STARRED_EXERCISES: 'fitness_starred',
    TEMPLATES: 'fitness_templates',
    SETTINGS: 'fitness_settings',
    LAST_WORKOUT: 'fitness_last_workout',
    PRS: 'fitness_prs'
  },

  /**
   * 初始化数据
   */
  init() {
    this.initExerciseLibrary();
    this.initSettings();
  },

  /**
   * 初始化动作库
   */
  initExerciseLibrary() {
    if (!localStorage.getItem(this.KEYS.EXERCISE_LIBRARY)) {
      const defaultExercises = [
        { name: '杠铃卧推', muscle: '胸', category: 'chest', equipment: '杠铃' },
        { name: '哑铃卧推', muscle: '胸', category: 'chest', equipment: '哑铃' },
        { name: '上斜哑铃推举', muscle: '胸', category: 'chest', equipment: '哑铃' },
        { name: '双杠臂屈伸', muscle: '胸', category: 'chest', equipment: '徒手' },
        { name: '俯卧撑', muscle: '胸', category: 'chest', equipment: '徒手' },
        { name: '飞鸟', muscle: '胸', category: 'chest', equipment: '哑铃' },
        { name: '引体向上', muscle: '背', category: 'back', equipment: '单杠' },
        { name: '高位下拉', muscle: '背', category: 'back', equipment: '器械' },
        { name: '划船', muscle: '背', category: 'back', equipment: '杠铃/哑铃' },
        { name: '坐姿划船', muscle: '背', category: 'back', equipment: '器械' },
        { name: '硬拉', muscle: '背', category: 'back', equipment: '杠铃' },
        { name: '山羊挺身', muscle: '背', category: 'back', equipment: '器械' },
        { name: '哑铃侧平举', muscle: '肩', category: 'shoulder', equipment: '哑铃' },
        { name: '坐姿推举', muscle: '肩', category: 'shoulder', equipment: '杠铃/器械' },
        { name: '前平举', muscle: '肩', category: 'shoulder', equipment: '哑铃' },
        { name: '俯身飞鸟', muscle: '肩', category: 'shoulder', equipment: '哑铃' },
        { name: '深蹲', muscle: '腿', category: 'legs', equipment: '杠铃' },
        { name: '弓步蹲', muscle: '腿', category: 'legs', equipment: '哑铃/徒手' },
        { name: '腿举', muscle: '腿', category: 'legs', equipment: '器械' },
        { name: '腿弯举', muscle: '腿', category: 'legs', equipment: '器械' },
        { name: '腿屈伸', muscle: '腿', category: 'legs', equipment: '器械' },
        { name: '提踵', muscle: '腿', category: 'legs', equipment: '器械' },
        { name: '弯举', muscle: '手臂', category: 'arms', equipment: '哑铃/杠铃' },
        { name: '锤式弯举', muscle: '手臂', category: 'arms', equipment: '哑铃' },
        { name: '三头下压', muscle: '手臂', category: 'arms', equipment: '绳索' },
        { name: '颈后臂屈伸', muscle: '手臂', category: 'arms', equipment: '哑铃' },
        { name: '俯卧撑', muscle: '手臂', category: 'arms', equipment: '徒手' },
        { name: '跑步', muscle: '有氧', category: 'cardio', equipment: '跑步机' },
        { name: '游泳', muscle: '有氧', category: 'cardio', equipment: '泳池' },
        { name: '骑行', muscle: '有氧', category: 'cardio', equipment: '自行车' },
        { name: '椭圆机', muscle: '有氧', category: 'cardio', equipment: '器械' }
      ];
      localStorage.setItem(this.KEYS.EXERCISE_LIBRARY, JSON.stringify(defaultExercises));
    }
  },

  /**
   * 初始化设置
   */
  initSettings() {
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const defaultSettings = {
        calorieGoal: 2500,
        weightUnit: 'kg',
        heightUnit: 'cm',
        theme: 'light'
      };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  },

  // ==================== 训练记录 ====================

  /**
   * 获取所有训练记录
   */
  getWorkouts() {
    const data = localStorage.getItem(this.KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 保存训练记录
   * @param {Array} workouts - 训练记录数组
   */
  saveWorkouts(workouts) {
    localStorage.setItem(this.KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  /**
   * 添加训练记录
   * @param {object} workout - 训练记录
   */
  addWorkout(workout) {
    const workouts = this.getWorkouts();
    workouts.push(workout);
    this.saveWorkouts(workouts);
    return workouts;
  },

  /**
   * 更新训练记录
   * @param {string} date - 日期
   * @param {object} workout - 更新的训练记录
   */
  updateWorkout(date, workout) {
    const workouts = this.getWorkouts();
    const index = workouts.findIndex(w => w.date === date);
    if (index !== -1) {
      workouts[index] = workout;
      this.saveWorkouts(workouts);
    }
    return workouts;
  },

  /**
   * 删除训练记录
   * @param {string} date - 日期
   */
  deleteWorkout(date) {
    const workouts = this.getWorkouts();
    const filtered = workouts.filter(w => w.date !== date);
    this.saveWorkouts(filtered);
    return filtered;
  },

  /**
   * 保存上次训练记录
   * @param {object} workout - 训练记录
   */
  saveLastWorkout(workout) {
    localStorage.setItem(this.KEYS.LAST_WORKOUT, JSON.stringify(workout));
  },

  /**
   * 获取上次训练记录
   */
  getLastWorkout() {
    const data = localStorage.getItem(this.KEYS.LAST_WORKOUT);
    return data ? JSON.parse(data) : null;
  },

  // ==================== 饮食记录 ====================

  /**
   * 获取所有饮食记录
   */
  getDiet() {
    const data = localStorage.getItem(this.KEYS.DIET);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 保存饮食记录
   * @param {Array} diet - 饮食记录数组
   */
  saveDiet(diet) {
    localStorage.setItem(this.KEYS.DIET, JSON.stringify(diet));
  },

  /**
   * 添加饮食记录
   * @param {object} record - 饮食记录
   */
  addDiet(record) {
    const diet = this.getDiet();
    diet.push(record);
    this.saveDiet(diet);
    return diet;
  },

  /**
   * 更新饮食记录
   * @param {string} date - 日期
   * @param {object} record - 更新的饮食记录
   */
  updateDiet(date, record) {
    const diet = this.getDiet();
    const index = diet.findIndex(d => d.date === date);
    if (index !== -1) {
      diet[index] = record;
      this.saveDiet(diet);
    }
    return diet;
  },

  /**
   * 删除饮食记录
   * @param {string} date - 日期
   */
  deleteDiet(date) {
    const diet = this.getDiet();
    const filtered = diet.filter(d => d.date !== date);
    this.saveDiet(filtered);
    return filtered;
  },

  // ==================== 身体数据 ====================

  /**
   * 获取所有身体数据
   */
  getBody() {
    const data = localStorage.getItem(this.KEYS.BODY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 保存身体数据
   * @param {Array} body - 身体数据数组
   */
  saveBody(body) {
    localStorage.setItem(this.KEYS.BODY, JSON.stringify(body));
  },

  /**
   * 添加身体数据
   * @param {object} record - 身体数据记录
   */
  addBody(record) {
    const body = this.getBody();
    body.push(record);
    this.saveBody(body);
    return body;
  },

  /**
   * 更新身体数据
   * @param {string} date - 日期
   * @param {object} record - 更新的身体数据
   */
  updateBody(date, record) {
    const body = this.getBody();
    const index = body.findIndex(b => b.date === date);
    if (index !== -1) {
      body[index] = record;
      this.saveBody(body);
    }
    return body;
  },

  /**
   * 删除身体数据
   * @param {string} date - 日期
   */
  deleteBody(date) {
    const body = this.getBody();
    const filtered = body.filter(b => b.date !== date);
    this.saveBody(filtered);
    return filtered;
  },

  // ==================== 动作库 ====================

  /**
   * 获取动作库
   */
  getExerciseLibrary() {
    const data = localStorage.getItem(this.KEYS.EXERCISE_LIBRARY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 保存动作库
   * @param {Array} exercises - 动作数组
   */
  saveExerciseLibrary(exercises) {
    localStorage.setItem(this.KEYS.EXERCISE_LIBRARY, JSON.stringify(exercises));
  },

  /**
   * 添加动作
   * @param {string} name - 动作名称
   * @param {string} category - 分类
   * @param {string} muscle - 肌群
   */
  addExercise(name, category = 'custom', muscle = '其他') {
    const exercises = this.getExerciseLibrary();
    if (!exercises.find(e => e.name === name)) {
      exercises.push({ name, muscle, category, equipment: '其他' });
      this.saveExerciseLibrary(exercises);
    }
    return exercises;
  },

  /**
   * 删除动作
   * @param {string} name - 动作名称
   */
  deleteExercise(name) {
    const exercises = this.getExerciseLibrary();
    const filtered = exercises.filter(e => e.name !== name && !e.name.startsWith('_'));
    this.saveExerciseLibrary(filtered);
    return filtered;
  },

  // ==================== 收藏动作 ====================

  /**
   * 获取收藏的动作
   */
  getStarredExercises() {
    const data = localStorage.getItem(this.KEYS.STARRED_EXERCISES);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 保存收藏的动作
   * @param {Array} exercises - 动作名称数组
   */
  saveStarredExercises(exercises) {
    localStorage.setItem(this.KEYS.STARRED_EXERCISES, JSON.stringify(exercises));
  },

  /**
   * 切换动作收藏状态
   * @param {string} name - 动作名称
   */
  toggleStarExercise(name) {
    const starred = this.getStarredExercises();
    const index = starred.indexOf(name);
    if (index !== -1) {
      starred.splice(index, 1);
    } else {
      starred.push(name);
    }
    this.saveStarredExercises(starred);
    return starred;
  },

  // ==================== 训练模板 ====================

  /**
   * 获取训练模板
   */
  getTemplates() {
    const data = localStorage.getItem(this.KEYS.TEMPLATES);
    return data ? JSON.parse(data) : this.getDefaultTemplates();
  },

  /**
   * 获取默认模板
   */
  getDefaultTemplates() {
    return [
      { id: 'template_chest', name: '胸部训练', exercises: ['杠铃卧推', '哑铃卧推', '飞鸟', '双杠臂屈伸'] },
      { id: 'template_back', name: '背部训练', exercises: ['引体向上', '高位下拉', '划船', '硬拉'] },
      { id: 'template_shoulder', name: '肩部训练', exercises: ['坐姿推举', '哑铃侧平举', '前平举', '俯身飞鸟'] },
      { id: 'template_legs', name: '腿部训练', exercises: ['深蹲', '弓步蹲', '腿举', '提踵'] },
      { id: 'template_arms', name: '手臂训练', exercises: ['弯举', '锤式弯举', '三头下压', '颈后臂屈伸'] }
    ];
  },

  /**
   * 保存训练模板
   * @param {Array} templates - 模板数组
   */
  saveTemplates(templates) {
    localStorage.setItem(this.KEYS.TEMPLATES, JSON.stringify(templates));
  },

  /**
   * 添加训练模板
   * @param {object} template - 模板对象
   */
  addTemplate(template) {
    const templates = this.getTemplates();
    templates.push(template);
    this.saveTemplates(templates);
    return templates;
  },

  /**
   * 删除训练模板
   * @param {string} id - 模板ID
   */
  deleteTemplate(id) {
    const templates = this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    this.saveTemplates(filtered);
    return filtered;
  },

  // ==================== 设置 ====================

  /**
   * 获取设置
   */
  getSettings() {
    const data = localStorage.getItem(this.KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  },

  /**
   * 保存设置
   * @param {object} settings - 设置对象
   */
  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  /**
   * 更新设置
   * @param {object} updates - 更新的设置
   */
  updateSettings(updates) {
    const settings = this.getSettings();
    const newSettings = { ...settings, ...updates };
    this.saveSettings(newSettings);
    return newSettings;
  },

  // ==================== 数据导入导出 ====================

  /**
   * 导出所有数据
   */
  exportAllData() {
    return {
      workouts: this.getWorkouts(),
      diet: this.getDiet(),
      body: this.getBody(),
      exerciseLibrary: this.getExerciseLibrary(),
      starredExercises: this.getStarredExercises(),
      templates: this.getTemplates(),
      settings: this.getSettings(),
      lastWorkout: this.getLastWorkout()
    };
  },

  /**
   * 导入数据
   * @param {object} data - 要导入的数据
   */
  importAllData(data) {
    if (data.workouts) this.saveWorkouts(data.workouts);
    if (data.diet) this.saveDiet(data.diet);
    if (data.body) this.saveBody(data.body);
    if (data.exerciseLibrary) this.saveExerciseLibrary(data.exerciseLibrary);
    if (data.starredExercises) this.saveStarredExercises(data.starredExercises);
    if (data.templates) this.saveTemplates(data.templates);
    if (data.settings) this.saveSettings(data.settings);
    if (data.lastWorkout) localStorage.setItem(this.KEYS.LAST_WORKOUT, JSON.stringify(data.lastWorkout));
  },

  /**
   * 清空所有数据
   */
  clearAllData() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  },

  /**
   * 批量保存所有数据
   * @param {object} data - 包含所有数据的对象
   */
  saveAll(data) {
    if (data.workouts) this.saveWorkouts(data.workouts);
    if (data.diet) this.saveDiet(data.diet);
    if (data.body) this.saveBody(data.body);
    if (data.exerciseLibrary) this.saveExerciseLibrary(data.exerciseLibrary);
    if (data.starredExercises) this.saveStarredExercises(data.starredExercises);
    if (data.templates) this.saveTemplates(data.templates);
    if (data.settings) this.saveSettings(data.settings);
    if (data.lastWorkout) localStorage.setItem(this.KEYS.LAST_WORKOUT, JSON.stringify(data.lastWorkout));
    if (data.prs) this.savePRs(data.prs);
  },

  /**
   * 获取个人纪录数据
   * @returns {object} - PR数据对象
   */
  getPRs() {
    const data = localStorage.getItem(this.KEYS.PRS);
    return data ? JSON.parse(data) : {};
  },

  /**
   * 保存个人纪录数据
   * @param {object} prs - PR数据对象
   */
  savePRs(prs) {
    localStorage.setItem(this.KEYS.PRS, JSON.stringify(prs));
  },

  /**
   * 更新单个动作的PR
   * @param {string} exerciseName - 动作名称
   * @param {object} prData - PR数据 { weight, reps, date }
   * @returns {boolean} - 是否打破了纪录
   */
  updatePR(exerciseName, prData) {
    const prs = this.getPRs();
    const existingPR = prs[exerciseName];
    let isNewPR = false;
    let breakType = null;

    if (!existingPR) {
      prs[exerciseName] = { ...prData, type: 'first' };
      isNewPR = true;
    } else {
      const currentVolume = prData.weight * prData.reps;
      const existingVolume = existingPR.weight * existingPR.reps;
      
      if (prData.weight > existingPR.weight) {
        prs[exerciseName] = { ...prData, type: 'weight' };
        isNewPR = true;
        breakType = 'weight';
      } else if (prData.weight === existingPR.weight && prData.reps > existingPR.reps) {
        prs[exerciseName] = { ...prData, type: 'reps' };
        isNewPR = true;
        breakType = 'reps';
      } else if (currentVolume > existingVolume) {
        prs[exerciseName] = { ...prData, type: 'volume' };
        isNewPR = true;
        breakType = 'volume';
      }
    }

    this.savePRs(prs);
    return { isNewPR, breakType };
  }
};

// 导出到全局
window.Storage = Storage;