const KEYS = {
  WORKOUTS: 'fitness_workouts',
  DIET: 'fitness_diet',
  BODY: 'fitness_body',
  EXERCISE_LIBRARY: 'fitness_exercise_library',
  SETTINGS: 'fitness_settings'
};

const DEFAULT_EXERCISES = [
  { name: '杠铃卧推', muscle: '胸', category: 'chest', equipment: '杠铃' },
  { name: '哑铃卧推', muscle: '胸', category: 'chest', equipment: '哑铃' },
  { name: '推胸机', muscle: '胸', category: 'chest', equipment: '器械' },
  { name: '引体向上', muscle: '背', category: 'back', equipment: '单杠' },
  { name: '高位下拉', muscle: '背', category: 'back', equipment: '器械' },
  { name: '划船机', muscle: '背', category: 'back', equipment: '器械' },
  { name: '哑铃推肩', muscle: '肩', category: 'shoulder', equipment: '哑铃' },
  { name: '侧平举', muscle: '肩', category: 'shoulder', equipment: '哑铃' },
  { name: '深蹲', muscle: '腿', category: 'legs', equipment: '杠铃' },
  { name: '腿举', muscle: '腿', category: 'legs', equipment: '器械' },
  { name: '腿弯举', muscle: '腿', category: 'legs', equipment: '器械' },
  { name: '绳索下压', muscle: '三头', category: 'triceps', equipment: '绳索' },
  { name: '哑铃弯举', muscle: '二头', category: 'biceps', equipment: '哑铃' },
  { name: '杠铃弯举', muscle: '二头', category: 'biceps', equipment: '杠铃' }
];

module.exports = {
  KEYS,

  init() {
    try {
      const existing = wx.getStorageSync(KEYS.EXERCISE_LIBRARY);
      if (!existing) {
        wx.setStorageSync(KEYS.EXERCISE_LIBRARY, JSON.stringify(DEFAULT_EXERCISES));
      }
    } catch (e) {
      console.error('Storage init error:', e);
    }
  },

  getWorkouts() {
    try {
      const data = wx.getStorageSync(KEYS.WORKOUTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveWorkouts(workouts) {
    try {
      wx.setStorageSync(KEYS.WORKOUTS, JSON.stringify(workouts));
      return true;
    } catch (e) {
      return false;
    }
  },

  getDiet() {
    try {
      const data = wx.getStorageSync(KEYS.DIET);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveDiet(diet) {
    try {
      wx.setStorageSync(KEYS.DIET, JSON.stringify(diet));
      return true;
    } catch (e) {
      return false;
    }
  },

  getBody() {
    try {
      const data = wx.getStorageSync(KEYS.BODY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveBody(body) {
    try {
      wx.setStorageSync(KEYS.BODY, JSON.stringify(body));
      return true;
    } catch (e) {
      return false;
    }
  },

  getExerciseLibrary() {
    try {
      const data = wx.getStorageSync(KEYS.EXERCISE_LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveExerciseLibrary(exercises) {
    try {
      wx.setStorageSync(KEYS.EXERCISE_LIBRARY, JSON.stringify(exercises));
      return true;
    } catch (e) {
      return false;
    }
  },

  getSettings() {
    try {
      const data = wx.getStorageSync(KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveSettings(settings) {
    try {
      wx.setStorageSync(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      return false;
    }
  },

  clearAllData() {
    Object.values(KEYS).forEach(key => {
      wx.removeStorageSync(key);
    });
    this.init();
  },

  exportData() {
    try {
      const data = {
        workouts: this.getWorkouts(),
        diet: this.getDiet(),
        body: this.getBody(),
        settings: this.getSettings(),
        exerciseLibrary: this.getExerciseLibrary(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error('Export error:', e);
      return null;
    }
  },

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.workouts && Array.isArray(data.workouts)) {
        this.saveWorkouts(data.workouts);
      }
      if (data.diet && Array.isArray(data.diet)) {
        this.saveDiet(data.diet);
      }
      if (data.body && Array.isArray(data.body)) {
        this.saveBody(data.body);
      }
      if (data.settings && typeof data.settings === 'object') {
        this.saveSettings(data.settings);
      }
      if (data.exerciseLibrary && Array.isArray(data.exerciseLibrary)) {
        this.saveExerciseLibrary(data.exerciseLibrary);
      }
      
      return { success: true, message: '导入成功' };
    } catch (e) {
      console.error('Import error:', e);
      return { success: false, message: '导入失败：' + e.message };
    }
  },

  getAllData() {
    return {
      workouts: this.getWorkouts(),
      diet: this.getDiet(),
      body: this.getBody(),
      settings: this.getSettings(),
      exerciseLibrary: this.getExerciseLibrary()
    };
  }
};