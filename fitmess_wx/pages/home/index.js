const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    currentDate: '',
    weekProgress: 0,
    weeklyGoal: 5,
    todayWorkout: false,
    todayCalories: 0,
    latestWeight: '',
    streak: 0,
    recentWorkouts: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const today = Utils.getToday();
    const workouts = Storage.getWorkouts();
    const diet = Storage.getDiet();
    const body = Storage.getBody();
    const settings = Storage.getSettings();

    const currentDate = Utils.formatDateCN(today);
    const weekProgress = this.calculateWeekProgress(workouts);
    const weeklyGoal = settings.weeklyGoal || 5;
    const todayWorkout = workouts.some(w => w.date === today);
    const todayDiet = diet.find(d => d.date === today);
    const todayCalories = todayDiet ? todayDiet.calories : 0;
    const latestWeight = body.length > 0 ? body[body.length - 1].weight : '';
    const streak = this.calculateStreak(workouts);
    const recentWorkouts = workouts.slice(-5).reverse().map(w => ({
      date: w.date,
      dateStr: Utils.formatDateCN(w.date),
      parts: w.parts.join('+'),
      sets: w.sets || 0
    }));

    this.setData({
      currentDate,
      weekProgress,
      weeklyGoal,
      todayWorkout,
      todayCalories,
      latestWeight,
      streak,
      recentWorkouts
    });
  },

  calculateWeekProgress(workouts) {
    const today = new Date();
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);
    
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= monday);
    const goal = 5;
    return Math.min(weekWorkouts.length / goal * 100, 100).toFixed(0);
  },

  calculateStreak(workouts) {
    if (workouts.length === 0) return 0;
    const dates = new Set(workouts.map(w => w.date));
    const today = new Date();
    let streak = 0;
    const maxDays = Math.min(30, workouts.length + 1);
    for (let i = 0; i < maxDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (dates.has(dateStr)) streak++;
      else if (i > 0) break;
    }
    return streak;
  },

  goToWorkout() {
    wx.switchTab({ url: '/pages/workout/index' });
  },

  goToDiet() {
    wx.switchTab({ url: '/pages/diet/index' });
  },

  goToBody() {
    wx.switchTab({ url: '/pages/body/index' });
  },

  showStreakInfo() {
    wx.showToast({ title: `🔥 已连续训练 ${this.data.streak} 天！`, icon: 'none' });
  },

  viewWorkout(e) {
    const date = e.currentTarget.dataset.date;
    wx.navigateTo({ url: `/pages/workout/detail?date=${date}` });
  }
});