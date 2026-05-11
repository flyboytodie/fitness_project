const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    date: '',
    weight: '',
    height: '',
    bodyFat: '',
    muscle: ''
  },

  onLoad() {
    this.setData({ date: Utils.getToday() });
  },

  selectDate(e) {
    this.setData({ date: e.detail.value });
  },

  setWeight(e) {
    this.setData({ weight: e.detail.value });
  },

  setHeight(e) {
    this.setData({ height: e.detail.value });
  },

  setBodyFat(e) {
    this.setData({ bodyFat: e.detail.value });
  },

  setMuscle(e) {
    this.setData({ muscle: e.detail.value });
  },

  saveBody() {
    const weight = parseFloat(this.data.weight);
    const height = parseFloat(this.data.height);
    
    if (!weight || !height) {
      Utils.showToast('请输入体重和身高');
      return;
    }

    const bmi = Utils.calculateBMI(weight, height);
    
    const bodyRecord = {
      id: Date.now(),
      date: this.data.date,
      weight: weight,
      height: height,
      bmi: parseFloat(bmi),
      bodyFat: parseFloat(this.data.bodyFat) || null,
      muscle: parseFloat(this.data.muscle) || null
    };

    const body = Storage.getBody();
    body.push(bodyRecord);
    Storage.saveBody(body);

    Utils.showToast('身体数据已保存');
    setTimeout(() => {
      wx.switchTab({ url: '/pages/body/index' });
    }, 1500);
  },

  goBack() {
    wx.navigateBack();
  }
});