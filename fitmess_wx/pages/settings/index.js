const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    settings: {
      weeklyGoal: 5
    },
    showModal: false,
    importData: ''
  },

  onLoad() {
    const settings = Storage.getSettings();
    this.setData({ settings: { weeklyGoal: settings.weeklyGoal || 5 } });
  },

  goToAnalysis() {
    wx.navigateTo({ url: '/pages/analysis/index' });
  },

  goToExercise() {
    wx.navigateTo({ url: '/pages/exercise/index' });
  },

  setWeeklyGoal(e) {
    const goal = parseInt(e.detail.value) || 5;
    const settings = { ...this.data.settings, weeklyGoal: goal };
    this.setData({ settings });
    Storage.saveSettings(settings);
    Utils.showToast('设置已保存');
  },

  exportData() {
    const data = Storage.exportData();
    if (data) {
      wx.setClipboardData({
        data: data,
        success: () => {
          Utils.showToast('数据已复制到剪贴板');
        }
      });
    } else {
      Utils.showToast('导出失败');
    }
  },

  showImportModal() {
    this.setData({ showModal: true, importData: '' });
  },

  closeModal() {
    this.setData({ showModal: false, importData: '' });
  },

  setImportData(e) {
    this.setData({ importData: e.detail.value });
  },

  importData() {
    if (!this.data.importData.trim()) {
      Utils.showToast('请输入数据');
      return;
    }

    const result = Storage.importData(this.data.importData);
    if (result.success) {
      Utils.showToast(result.message);
      this.closeModal();
    } else {
      Utils.showToast(result.message);
    }
  },

  clearAllData() {
    Utils.showModal('确认清除', '确定要清除所有数据吗？此操作不可恢复。').then((confirm) => {
      if (confirm) {
        Storage.clearAllData();
        Utils.showToast('数据已清除');
      }
    });
  }
});