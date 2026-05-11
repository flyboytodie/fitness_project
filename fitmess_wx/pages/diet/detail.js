const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: { diet: null },
  
  onLoad(options) {
    if (options.id) {
      this.loadDiet(options.id);
    }
  },
  
  loadDiet(id) {
    const diet = Storage.getDiet();
    const item = diet.find(d => d.id == id);
    if (item) {
      this.setData({
        diet: {
          id: item.id,
          date: Utils.formatDateCN(item.date),
          time: item.time,
          name: item.name,
          serving: item.serving,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        }
      });
    }
  },
  
  deleteDiet(e) {
    const id = this.data.diet.id;
    Utils.showModal('确认删除', `确定要删除"${this.data.diet.name}"吗？`).then((confirm) => {
      if (confirm) {
        const diet = Storage.getDiet().filter(d => d.id != id);
        Storage.saveDiet(diet);
        Utils.showToast('已删除');
        setTimeout(() => {
          wx.switchTab({ url: '/pages/diet/index' });
        }, 1500);
      }
    });
  },
  
  goBack() {
    wx.navigateBack();
  }
});