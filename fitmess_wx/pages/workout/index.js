const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: { workouts: [] },
  
  onLoad() { this.loadWorkouts(); },
  onShow() { this.loadWorkouts(); },
  
  loadWorkouts() {
    const workouts = Storage.getWorkouts();
    this.setData({
      workouts: workouts.reverse().map(w => ({
        date: w.date,
        dateStr: Utils.formatDateCN(w.date),
        parts: w.parts.join('+'),
        exercises: w.exercises.map(e => ({
          name: e.name,
          weight: e.weight,
          sets: e.sets || []
        }))
      }))
    });
  },
  
  openAddWorkoutModal() {
    wx.navigateTo({ url: '/pages/workout/add' });
  },
  
  viewWorkout(e) {
    const date = e.currentTarget.dataset.date;
    wx.navigateTo({ url: `/pages/workout/detail?date=${date}` });
  }
});