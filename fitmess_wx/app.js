const Storage = require('./utils/storage.js');

App({
  onLaunch() {
    Storage.init();
  },

  onShow() {},

  onHide() {}
});