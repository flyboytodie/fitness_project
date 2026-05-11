module.exports = {
  getToday() {
    return new Date().toISOString().split('T')[0];
  },

  formatDate(date) {
    if (typeof date === 'string') {
      return date;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatDateCN(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    return `${month}月${day}日 ${weekDay}`;
  },

  showToast(title, icon = 'none') {
    wx.showToast({ title, icon, duration: 2000 });
  },

  showModal(title, content, confirmText = '确定', cancelText = '取消') {
    return new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        confirmText,
        cancelText,
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  },

  calculateBMI(weight, height) {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  },

  getBMIStatus(bmi) {
    if (bmi < 18.5) return { text: '偏瘦', color: '#3B82F6' };
    if (bmi < 24) return { text: '正常', color: '#10B981' };
    if (bmi < 28) return { text: '偏胖', color: '#F59E0B' };
    return { text: '肥胖', color: '#EF4444' };
  }
};