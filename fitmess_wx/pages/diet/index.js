const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFat: 0,
    dietList: []
  },
  
  onLoad() { this.loadDiet(); },
  onShow() { this.loadDiet(); },
  
  loadDiet() {
    const today = Utils.getToday();
    const diet = Storage.getDiet();
    const todayDiet = diet.filter(d => d.date === today);
    
    const todayCalories = todayDiet.reduce((sum, d) => sum + d.calories, 0);
    const todayProtein = todayDiet.reduce((sum, d) => sum + d.protein, 0);
    const todayCarbs = todayDiet.reduce((sum, d) => sum + d.carbs, 0);
    const todayFat = todayDiet.reduce((sum, d) => sum + d.fat, 0);
    
    const dietList = diet.reverse().map(d => ({
      id: d.id,
      date: d.date,
      dateStr: Utils.formatDateCN(d.date),
      time: d.time,
      name: d.name,
      calories: d.calories,
      serving: d.serving
    }));
    
    this.setData({ todayCalories, todayProtein, todayCarbs, todayFat, dietList });
  },
  
  goToAdd() {
    wx.navigateTo({ url: '/pages/diet/add' });
  },
  
  viewDiet(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/diet/detail?id=${id}` });
  }
});