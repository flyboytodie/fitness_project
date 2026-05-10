/**
 * 设置模块
 * 包含应用设置的逻辑
 */

const SettingsModule = {
  /**
   * 渲染设置页面
   */
  renderSettingsPage() {
    const hasBasicInfo = appData.settings.height && appData.settings.age && appData.settings.gender;
    const showDietProgress = appData.settings.showDietProgressBar !== undefined ? appData.settings.showDietProgressBar : true;
    
    return `
      <div class="page active">
        <div class="page-header">
          <h1>设置</h1>
        </div>
        
        <!-- 个人信息设置 -->
        <div class="card">
          <div class="card-title">${hasBasicInfo ? '编辑个人信息' : '设置个人信息'}</div>
          <div class="info-form">
            <div class="input-row">
              <div class="input-group" style="flex: 1;">
                <label>身高(cm)</label>
                <input type="number" id="settingsHeight" value="${appData.settings.height || ''}" placeholder="身高">
              </div>
              <div class="input-group" style="flex: 1;">
                <label>年龄</label>
                <input type="number" id="settingsAge" value="${appData.settings.age || ''}" placeholder="年龄">
              </div>
            </div>
            <div class="input-row">
              <div class="input-group" style="flex: 1;">
                <label>性别</label>
                <select id="settingsGender">
                  <option value="male" ${appData.settings.gender === 'male' ? 'selected' : ''}>男</option>
                  <option value="female" ${appData.settings.gender === 'female' ? 'selected' : ''}>女</option>
                </select>
              </div>
              <div class="input-group" style="flex: 1;">
                <label>活动水平</label>
                <select id="settingsActivity">
                  <option value="1.2" ${appData.settings.activityLevel === 1.2 || !appData.settings.activityLevel ? 'selected' : ''}>久坐</option>
                  <option value="1.375" ${appData.settings.activityLevel === 1.375 ? 'selected' : ''}>轻度活动</option>
                  <option value="1.55" ${appData.settings.activityLevel === 1.55 ? 'selected' : ''}>中度活动</option>
                  <option value="1.725" ${appData.settings.activityLevel === 1.725 ? 'selected' : ''}>高度活动</option>
                  <option value="1.9" ${appData.settings.activityLevel === 1.9 ? 'selected' : ''}>极高活动</option>
                </select>
              </div>
            </div>
            <button class="btn btn-secondary" style="margin-top: 8px;" onclick="SettingsModule.savePersonalInfo()">
              保存个人信息
            </button>
          </div>
        </div>
        
        <!-- 热量目标设置 -->
        <div class="card">
          <div class="card-title">热量目标</div>
          <div class="info-form">
            <div class="input-group">
              <label>每日热量目标 (千卡)</label>
              <input type="number" id="settingsCalorieGoal" value="${appData.settings.calorieGoal || 2000}" placeholder="如：2500">
            </div>
            <button class="btn btn-secondary" style="margin-top: 8px;" onclick="SettingsModule.saveCalorieGoal()">
              保存热量目标
            </button>
          </div>
        </div>
        
        <!-- 显示设置 -->
        <div class="card">
          <div class="card-title">显示设置</div>
          <div class="toggle-item" onclick="SettingsModule.toggleDietProgress()">
            <div class="toggle-label">
              <div>饮食进度条</div>
              <div class="toggle-desc">在饮食记录列表中显示每条记录的进度条</div>
            </div>
            <div class="toggle-switch ${showDietProgress ? 'active' : ''}">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>
        
        <!-- 数据管理 -->
        <div class="card">
          <div class="card-title">数据管理</div>
          <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.exportData()">
            📤 导出数据
          </button>
          <button class="btn btn-secondary" style="width: 100%;" onclick="SettingsModule.importData()">
            📥 导入数据
          </button>
        </div>
        
        <!-- 关于 -->
        <div class="card">
          <div class="card-title">关于</div>
          <div style="text-align: center; color: var(--text-muted);">
            <div style="font-size: 24px; margin-bottom: 8px;">💪</div>
            <div style="font-weight: 600;">健身记录</div>
            <div style="font-size: 12px; margin-top: 4px;">版本 1.0.0</div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 保存个人信息
   */
  savePersonalInfo() {
    const height = parseInt(document.getElementById('settingsHeight').value) || 0;
    const age = parseInt(document.getElementById('settingsAge').value) || 0;
    const gender = document.getElementById('settingsGender').value;
    const activityLevel = parseFloat(document.getElementById('settingsActivity').value) || 1.2;
    
    appData.settings.height = height;
    appData.settings.age = age;
    appData.settings.gender = gender;
    appData.settings.activityLevel = activityLevel;
    
    Storage.updateSettings({ height, age, gender, activityLevel });
    
    if (height && age && appData.body.length > 0) {
      const latestBody = appData.body[appData.body.length - 1];
      const tdee = Utils.calculateTDEE({
        weight: latestBody.weight,
        height,
        age,
        gender,
        activityLevel
      });
      if (tdee > 0) {
        appData.settings.calorieGoal = tdee;
        Storage.updateSettings({ calorieGoal: tdee });
        document.getElementById('settingsCalorieGoal').value = tdee;
        Utils.showToast(`已根据您的信息设置目标为 ${tdee} 千卡`);
        return;
      }
    }
    
    Utils.showToast('个人信息已保存');
  },

  /**
   * 保存热量目标
   */
  saveCalorieGoal() {
    const calorieGoal = parseInt(document.getElementById('settingsCalorieGoal').value) || 2000;
    appData.settings.calorieGoal = calorieGoal;
    Storage.updateSettings({ calorieGoal });
    Utils.showToast(`热量目标已设置为 ${calorieGoal} 千卡`);
  },

  /**
   * 切换饮食进度条显示
   */
  toggleDietProgress() {
    const current = appData.settings.showDietProgressBar !== undefined ? appData.settings.showDietProgressBar : true;
    appData.settings.showDietProgressBar = !current;
    Storage.updateSettings({ showDietProgressBar: !current });
    navigateTo('settings');
  },

  /**
   * 导出数据
   */
  exportData() {
    const data = {
      workouts: appData.workouts,
      diet: appData.diet,
      body: appData.body,
      templates: appData.templates,
      settings: appData.settings,
      exerciseLibrary: appData.exerciseLibrary,
      starredExercises: appData.starredExercises,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    Utils.showToast('数据已导出');
  },

  /**
   * 导入数据
   */
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.workouts) {
            appData.workouts = data.workouts;
            Storage.saveWorkouts(data.workouts);
          }
          if (data.diet) {
            appData.diet = data.diet;
            Storage.saveDiet(data.diet);
          }
          if (data.body) {
            appData.body = data.body;
            Storage.saveBody(data.body);
          }
          if (data.templates) {
            appData.templates = data.templates;
            Storage.saveTemplates(data.templates);
          }
          if (data.settings) {
            appData.settings = { ...appData.settings, ...data.settings };
            Storage.saveSettings(appData.settings);
          }
          if (data.starredExercises) {
            appData.starredExercises = data.starredExercises;
            Storage.saveStarredExercises(data.starredExercises);
          }
          
          Utils.showToast('数据导入成功');
          navigateTo('home');
        } catch (err) {
          Utils.showToast('数据导入失败：文件格式错误');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }
};

// 导出到全局
window.SettingsModule = SettingsModule;
