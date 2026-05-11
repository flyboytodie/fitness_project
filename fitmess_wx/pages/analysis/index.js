const Storage = require('../../utils/storage.js');

Page({
  data: {
    totalWorkouts: 0,
    totalSets: 0,
    totalWeight: 0,
    partStats: [],
    frequencyData: []
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    const workouts = Storage.getWorkouts();
    
    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => sum + (w.sets || 0), 0);
    const totalWeight = workouts.reduce((sum, w) => {
      return sum + (w.exercises || []).reduce((es, e) => {
        return es + e.weight * e.totalReps;
      }, 0);
    }, 0);

    const partStats = this.calculatePartStats(workouts);
    const frequencyData = this.calculateFrequency(workouts);

    const maxCount = frequencyData.length > 0 ? Math.max(...frequencyData.map(d => d.count)) : 0;
    this.setData({
      totalWorkouts,
      totalSets,
      totalWeight: Math.round(totalWeight),
      partStats,
      frequencyData,
      maxCount
    });
  },

  calculatePartStats(workouts) {
    const partCounts = {};
    workouts.forEach(w => {
      w.parts.forEach(part => {
        partCounts[part] = (partCounts[part] || 0) + 1;
      });
    });
    
    return Object.entries(partCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / workouts.length) * 100)
    })).sort((a, b) => b.count - a.count);
  },

  calculateFrequency(workouts) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const counts = new Array(7).fill(0);
    
    workouts.forEach(w => {
      const day = new Date(w.date).getDay();
      counts[day]++;
    });
    
    return weekDays.map((day, index) => ({
      day,
      count: counts[index],
      max: Math.max(...counts)
    }));
  },

  goBack() {
    wx.navigateBack();
  }
});