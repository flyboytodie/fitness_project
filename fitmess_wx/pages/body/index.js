const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    latestRecord: null,
    records: []
  },
  
  onLoad() { this.loadBody(); },
  onShow() { this.loadBody(); },
  
  loadBody() {
    const body = Storage.getBody();
    if (body.length > 0) {
      const latest = body[body.length - 1];
      const bmi = Utils.calculateBMI(latest.weight, latest.height);
      const bmiStatus = Utils.getBMIStatus(bmi);
      const bmr = Math.round((10 * latest.weight) + (6.25 * latest.height) - (5 * 30));
      
      this.setData({
        latestRecord: {
          weight: latest.weight,
          height: latest.height,
          bmi: bmi,
          bmiText: bmiStatus.text,
          bmiColor: bmiStatus.color,
          bodyFat: latest.bodyFat || '--',
          muscle: latest.muscle || '--',
          bmr: bmr,
          date: Utils.formatDateCN(latest.date)
        },
        records: body.reverse().map(r => ({
          id: r.id,
          date: Utils.formatDateCN(r.date),
          weight: r.weight,
          bmi: Utils.calculateBMI(r.weight, r.height)
        }))
      });
    }
  },
  
  goToAdd() {
    wx.navigateTo({ url: '/pages/body/add' });
  },
  
  viewRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/body/detail?id=${id}` });
  }
});