const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    date: '',
    parts: ['胸', '背', '肩', '腿', '三头', '二头', '其他'],
    selectedParts: [],
    exercises: [],
    exerciseNames: []
  },

  onLoad() {
    const today = Utils.getToday();
    const library = Storage.getExerciseLibrary();
    const names = library.map(e => e.name);
    
    this.setData({
      date: today,
      exerciseNames: names,
      exercises: [{
        id: Date.now(),
        name: '',
        weight: '',
        sets: [],
        setsStr: ''
      }]
    });
  },

  selectDate(e) {
    this.setData({ date: e.detail.value });
  },

  selectPart(e) {
    const part = e.currentTarget.dataset.part;
    const selectedParts = [...this.data.selectedParts];
    const index = selectedParts.indexOf(part);
    if (index >= 0) {
      selectedParts.splice(index, 1);
    } else {
      selectedParts.push(part);
    }
    this.setData({ selectedParts });
  },

  addExercise() {
    const exercises = [...this.data.exercises, {
      id: Date.now(),
      name: '',
      weight: '',
      sets: [],
      setsStr: ''
    }];
    this.setData({ exercises });
  },

  deleteExercise(e) {
    const id = e.currentTarget.dataset.id;
    const exercises = this.data.exercises.filter(e => e.id !== id);
    if (exercises.length === 0) {
      exercises.push({
        id: Date.now(),
        name: '',
        weight: '',
        sets: [],
        setsStr: ''
      });
    }
    this.setData({ exercises });
  },

  selectExercise(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.detail.value;
    const name = this.data.exerciseNames[index];
    const exercises = [...this.data.exercises];
    const exerciseIndex = exercises.findIndex(e => e.id === id);
    if (exerciseIndex >= 0) {
      exercises[exerciseIndex].name = name;
    }
    this.setData({ exercises });
  },

  setWeight(e) {
    const id = e.currentTarget.dataset.id;
    const weight = parseFloat(e.detail.value) || 0;
    const exercises = [...this.data.exercises];
    const index = exercises.findIndex(e => e.id === id);
    if (index >= 0) {
      exercises[index].weight = weight;
    }
    this.setData({ exercises });
  },

  setSets(e) {
    const id = e.currentTarget.dataset.id;
    const setsStr = e.detail.value;
    const sets = setsStr.split('/').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
    const exercises = [...this.data.exercises];
    const index = exercises.findIndex(e => e.id === id);
    if (index >= 0) {
      exercises[index].sets = sets;
      exercises[index].setsStr = setsStr;
    }
    this.setData({ exercises });
  },

  saveWorkout() {
    if (this.data.selectedParts.length === 0) {
      Utils.showToast('请选择训练部位');
      return;
    }

    const validExercises = this.data.exercises.filter(e => e.name && e.weight > 0 && e.sets.length > 0);
    if (validExercises.length === 0) {
      Utils.showToast('请添加至少一个有效动作');
      return;
    }

    const workout = {
      date: this.data.date,
      parts: this.data.selectedParts,
      sets: validExercises.reduce((sum, e) => sum + e.sets.length, 0),
      exercises: validExercises.map(e => ({
        name: e.name,
        weight: e.weight,
        sets: e.sets,
        totalReps: e.sets.reduce((sum, s) => sum + s, 0)
      }))
    };

    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    Storage.saveWorkouts(workouts);

    Utils.showToast('训练记录已保存');
    setTimeout(() => {
      wx.switchTab({ url: '/pages/workout/index' });
    }, 1500);
  },

  goBack() {
    wx.navigateBack();
  }
});