const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: { record: null, previousRecord: null, comparison: {} },
  
  onLoad(options) {
    if (options.id) {
      this.loadRecord(options.id);
    }
  },
  
  loadRecord(id) {
    const body = Storage.getBody();
    const record = body.find(r => r.id == id);
    
    if (record) {
      const index = body.findIndex(r => r.id == id);
      const previousRecord = index > 0 ? body[index - 1] : null;
      
      const bmi = Utils.calculateBMI(record.weight, record.height);
      const bmiStatus = Utils.getBMIStatus(bmi);
      const bmr = Math.round((10 * record.weight) + (6.25 * record.height) - (5 * 30));
      
      let comparison = {};
      if (previousRecord) {
        const prevBmi = Utils.calculateBMI(previousRecord.weight, previousRecord.height);
        comparison = {
          weightChange: (record.weight - previousRecord.weight).toFixed(1),
          bmiChange: (parseFloat(bmi) - parseFloat(prevBmi)).toFixed(1),
          dateDiff: previousRecord.date
        };
      }
      
      this.setData({
        record: {
          id: record.id,
          date: Utils.formatDateCN(record.date),
          weight: record.weight,
          height: record.height,
          bmi: bmi,
          bmiText: bmiStatus.text,
          bmiColor: bmiStatus.color,
          bodyFat: record.bodyFat || '--',
          muscle: record.muscle || '--',
          bmr: bmr
        },
        previousRecord: previousRecord ? {
          date: Utils.formatDateCN(previousRecord.date),
          weight: previousRecord.weight,
          bmi: prevBmi
        } : null,
        comparison
      });
    }
  },
  
  deleteRecord() {
    const id = this.data.record.id;
    Utils.showModal('确认删除', `确定要删除${this.data.record.date}的记录吗？`).then((confirm) => {
      if (confirm) {
        const body = Storage.getBody().filter(r => r.id != id);
        Storage.saveBody(body);
        Utils.showToast('已删除');
        setTimeout(() => {
          wx.switchTab({ url: '/pages/body/index' });
        }, 1500);
      }
    });
  },
  
  goBack() {
    wx.navigateBack();
  }
});