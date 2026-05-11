const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    date: '',
    time: '',
    name: '',
    serving: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  },

  onLoad() {
    const now = new Date();
    this.setData({
      date: Utils.getToday(),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    });
  },

  selectDate(e) {
    this.setData({ date: e.detail.value });
  },

  selectTime(e) {
    this.setData({ time: e.detail.value });
  },

  setName(e) {
    this.setData({ name: e.detail.value });
  },

  setServing(e) {
    this.setData({ serving: e.detail.value });
  },

  setCalories(e) {
    this.setData({ calories: e.detail.value });
  },

  setProtein(e) {
    this.setData({ protein: e.detail.value });
  },

  setCarbs(e) {
    this.setData({ carbs: e.detail.value });
  },

  setFat(e) {
    this.setData({ fat: e.detail.value });
  },

  saveDiet() {
    if (!this.data.name.trim()) {
      Utils.showToast('请输入食物名称');
      return;
    }

    const dietItem = {
      id: Date.now(),
      date: this.data.date,
      time: this.data.time,
      name: this.data.name.trim(),
      serving: parseFloat(this.data.serving) || 0,
      calories: parseInt(this.data.calories) || 0,
      protein: parseFloat(this.data.protein) || 0,
      carbs: parseFloat(this.data.carbs) || 0,
      fat: parseFloat(this.data.fat) || 0
    };

    const diet = Storage.getDiet();
    diet.push(dietItem);
    Storage.saveDiet(diet);

    Utils.showToast('饮食记录已保存');
    setTimeout(() => {
      wx.switchTab({ url: '/pages/diet/index' });
    }, 1500);
  },

  goBack() {
    wx.navigateBack();
  }
});