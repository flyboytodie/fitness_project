const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: { workout: null },
  
  onLoad(options) {
    if (options.date) {
      this.loadWorkout(options.date);
    }
  },
  
  loadWorkout(date) {
    const workouts = Storage.getWorkouts();
    const workout = workouts.find(w => w.date === date);
    if (workout) {
      this.setData({
        workout: {
          date: workout.date,
          dateStr: Utils.formatDateCN(workout.date),
          parts: workout.parts.join('+'),
          exercises: workout.exercises.map(e => ({
            name: e.name,
            weight: e.weight,
            sets: e.sets,
            totalReps: e.totalReps
          }))
        }
      });
    }
  },
  
  goBack() {
    wx.navigateBack();
  }
});