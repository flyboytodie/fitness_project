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
          <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.importData()">
            📥 导入数据
          </button>
          <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.showImportFormat()">
            📋 查看导入格式 & 下载模板
          </button>
          <button class="btn btn-secondary" style="width: 100%;" onclick="SettingsModule.updateExerciseLibrary()">
            🔄 更新动作库
          </button>
        </div>
        
        <!-- 清除数据 -->
        <div class="card">
          <div class="card-title" style="color: var(--danger);">⚠️ 清除数据</div>
          <button class="btn btn-danger" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.confirmClearAll()">
            🗑️ 清除全部数据
          </button>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.confirmClearWorkouts()">
              训练
            </button>
            <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.confirmClearDiet()">
              饮食
            </button>
            <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.confirmClearBody()">
              身体
            </button>
            <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.confirmClearExerciseLibrary()">
              动作库
            </button>
          </div>
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
        
        // 如果当前在身体页面，刷新页面显示更新后的信息
        if (window.currentPage === 'body') {
          navigateTo('body');
        }
        return;
      }
    }
    
    Utils.showToast('个人信息已保存');
    
    // 如果当前在身体页面，刷新页面显示更新后的信息
    if (window.currentPage === 'body') {
      navigateTo('body');
    }
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
    Utils.showModal(`
      <div class="modal-header">
        <span>选择导出格式</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="padding: 16px;">
        <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.exportAsJSON(); Utils.closeModal()">
          📄 JSON 格式（完整数据）
        </button>
        <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;" onclick="SettingsModule.exportAsCSV(); Utils.closeModal()">
          📊 CSV 格式（表格）
        </button>
        <button class="btn btn-secondary" style="width: 100%;" onclick="SettingsModule.exportAsMarkdown(); Utils.closeModal()">
          📝 Markdown 格式（文档）
        </button>
        
        <div style="margin-top: 16px; padding: 12px; background: #eff6ff; border-radius: 8px; font-size: 13px;">
          <strong>💡 提示：</strong>
          <ul style="margin: 8px 0 0 16px; padding: 0;">
            <li><strong>JSON</strong> - 完整数据，可用于导入恢复</li>
            <li><strong>CSV</strong> - 表格格式，适合 Excel 打开</li>
            <li><strong>Markdown</strong> - 文档格式，适合分享备份</li>
          </ul>
        </div>
      </div>
    `);
  },

  /**
   * 导出为JSON格式
   */
  exportAsJSON() {
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
    
    Utils.downloadFile(JSON.stringify(data, null, 2), `fitness_data_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    Utils.showToast('JSON数据已导出');
  },

  /**
   * 导出为CSV格式
   */
  exportAsCSV() {
    // 训练记录CSV
    let workoutCSV = '日期,训练部位,动作名称,重量(kg),组数,次数,总次数,备注\n';
    appData.workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        workoutCSV += `${workout.date},${workout.parts.join('+')},${ex.name},${ex.weight},${ex.sets.length},${ex.sets.join('/')},${ex.totalReps},${ex.notes || ''}\n`;
      });
    });
    
    // 饮食记录CSV
    let dietCSV = '日期,千卡,蛋白质(g),碳水(g),脂肪(g),备注\n';
    appData.diet.forEach(d => {
      dietCSV += `${d.date},${d.calories},${d.protein},${d.carbs},${d.fat},${d.notes || ''}\n`;
    });
    
    // 身体数据CSV
    let bodyCSV = '日期,体重(kg),胸围(cm),腰围(cm),臀围(cm),上臂(cm),大腿(cm)\n';
    appData.body.forEach(b => {
      bodyCSV += `${b.date},${b.weight},${b.chest || ''},${b.waist || ''},${b.hips || ''},${b.arm || ''},${b.leg || ''}\n`;
    });
    
    Utils.downloadFile(workoutCSV, `workouts_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    setTimeout(() => Utils.downloadFile(dietCSV, `diet_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv'), 300);
    setTimeout(() => Utils.downloadFile(bodyCSV, `body_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv'), 600);
    Utils.showToast('CSV数据已导出');
  },

  /**
   * 导出为Markdown格式
   */
  exportAsMarkdown() {
    let md = `# 健身记录数据\n\n`;
    md += `> 导出日期：${new Date().toISOString().split('T')[0]}\n\n`;
    
    // 训练记录
    md += `## 📅 训练记录\n\n`;
    md += `| 日期 | 训练部位 | 动作名称 | 重量(kg) | 组数 | 次数 | 总次数 | 备注 |\n`;
    md += `|------|----------|----------|----------|------|------|--------|------|\n`;
    appData.workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        md += `| ${workout.date} | ${workout.parts.join('+')} | ${ex.name} | ${ex.weight} | ${ex.sets.length} | ${ex.sets.join('/')} | ${ex.totalReps} | ${ex.notes || ''} |\n`;
      });
    });
    md += `\n`;
    
    // 饮食记录
    md += `## 🥗 饮食记录\n\n`;
    md += `| 日期 | 千卡 | 蛋白质(g) | 碳水(g) | 脂肪(g) | 备注 |\n`;
    md += `|------|------|-----------|---------|---------|------|\n`;
    appData.diet.forEach(d => {
      md += `| ${d.date} | ${d.calories} | ${d.protein} | ${d.carbs} | ${d.fat} | ${d.notes || ''} |\n`;
    });
    md += `\n`;
    
    // 动作库
    md += `## 🏋️ 动作库\n\n`;
    md += `| 动作名称 | 锻炼部位 | 使用器材 |\n`;
    md += `|----------|----------|----------|\n`;
    appData.exerciseLibrary.forEach(ex => {
      md += `| ${ex.name} | ${ex.muscle} | ${ex.equipment || '其他'} |\n`;
    });
    md += `\n`;
    
    // 身体数据
    md += `## ⚖️ 身体数据\n\n`;
    md += `| 日期 | 体重(kg) | 身高(cm) | 胸围(cm) | 腰围(cm) | 臀围(cm) | 大腿围(cm) | 备注 |\n`;
    md += `|------|----------|----------|----------|----------|----------|------------|------|\n`;
    appData.body.forEach(b => {
      md += `| ${b.date} | ${b.weight || '-'} | ${b.height || '-'} | ${b.chest || '-'} | ${b.waist || '-'} | ${b.hips || '-'} | ${b.leg || '-'} | ${b.notes || ''} |\n`;
    });
    
    // 收藏动作
    md += `## ⭐ 收藏动作\n\n`;
    if (appData.starredExercises.length > 0) {
      appData.starredExercises.forEach(ex => {
        md += `- ${ex}\n`;
      });
    } else {
      md += `- 暂无收藏动作\n`;
    }
    md += `\n`;
    
    // 训练模板
    md += `## 📋 训练模板\n\n`;
    if (appData.templates.length > 0) {
      appData.templates.forEach(t => {
        md += `### ${t.name}\n`;
        t.exercises.forEach(ex => {
          md += `- ${ex}\n`;
        });
        md += `\n`;
      });
    } else {
      md += `暂无训练模板\n`;
    }
    
    Utils.downloadFile(md, `fitness_data_${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    Utils.showToast('Markdown数据已导出');
  },

  /**
   * 导入数据
   */
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.md';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let content = event.target.result;
          
          // 检测并修复GBK编码问题（中文乱码）
          if (file.name.endsWith('.md')) {
            content = this.fixGBKEncoding(content);
          }
          
          let data;
          
          if (file.name.endsWith('.md')) {
            data = this.parseMarkdownToData(content);
          } else {
            data = JSON.parse(content);
          }
          
          if (data.workouts && data.workouts.length > 0) {
            const mergedWorkouts = [...appData.workouts, ...data.workouts];
            const deduplicatedWorkouts = this.deduplicateWorkouts(mergedWorkouts);
            const newWorkouts = deduplicatedWorkouts.slice(appData.workouts.length);
            appData.workouts = deduplicatedWorkouts;
            Storage.saveWorkouts(appData.workouts);
            this.calculatePRsForImportedWorkouts(newWorkouts);
          }
          if (data.diet && data.diet.length > 0) {
            const mergedDiet = [...appData.diet, ...data.diet];
            const deduplicatedDiet = this.deduplicateDiet(mergedDiet);
            appData.diet = deduplicatedDiet;
            Storage.saveDiet(appData.diet);
          }
          if (data.body && data.body.length > 0) {
            const mergedBody = [...appData.body, ...data.body];
            const deduplicatedBody = this.deduplicateBody(mergedBody);
            appData.body = deduplicatedBody;
            Storage.saveBody(appData.body);
          }
          if (data.exerciseLibrary && data.exerciseLibrary.length > 0) {
            data.exerciseLibrary.forEach(ex => {
              if (!appData.exerciseLibrary.find(e => e.name === ex.name)) {
                appData.exerciseLibrary.push(ex);
              }
            });
            Storage.saveExerciseLibrary(appData.exerciseLibrary);
          }
          if (data.templates && data.templates.length > 0) {
            const existingIds = new Set(appData.templates.map(t => t.id));
            const newTemplates = data.templates.filter(t => !existingIds.has(t.id));
            appData.templates = [...appData.templates, ...newTemplates];
            Storage.saveTemplates(appData.templates);
          }
          if (data.settings) {
            appData.settings = { ...appData.settings, ...data.settings };
            Storage.saveSettings(appData.settings);
          }
          if (data.starredExercises && data.starredExercises.length > 0) {
            const existingStars = new Set(appData.starredExercises);
            const newStars = data.starredExercises.filter(e => !existingStars.has(e));
            appData.starredExercises = [...appData.starredExercises, ...newStars];
            Storage.saveStarredExercises(appData.starredExercises);
          }
          
          let importMsg = `导入成功！训练: ${data.workouts?.length || 0}条，饮食: ${data.diet?.length || 0}条`;
          if (data.exerciseLibrary?.length > 0) {
            importMsg += `，动作库: ${data.exerciseLibrary.length}个`;
          }
          if (data.starredExercises?.length > 0) {
            importMsg += `，收藏动作: ${data.starredExercises.length}个`;
          }
          if (data.templates?.length > 0) {
            importMsg += `，模板: ${data.templates.length}个`;
          }
          Utils.showToast(importMsg);
          navigateTo('home');
        } catch (err) {
          Utils.showToast('数据导入失败：' + err.message);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },

  /**
   * 修复 GBK 编码问题（Windows 中文文件）
   */
  fixGBKEncoding(content) {
    const gbkPatterns = ['鍋ヨ韩', '涓€銆', '鏃ユ湡', '閮ㄤ綔', '鍛ㄤ竴'];
    const hasGbkIssues = gbkPatterns.some(pattern => content.includes(pattern));
    
    if (hasGbkIssues) {
      try {
        const replacements = {
          '鍋ヨ韩': '健身',
          '姹囨€': '汇总',
          '涓€銆': '一、',
          '佽缁': '训练',
          '巻鍙': '历史',
          '叉€昏': '总览',
          '琛?': '表',
          '鏃ユ湡': '日期',
          '鏄熸湡': '星期',
          '閮ㄤ綅': '部位',
          '鎬荤粍鏁': '总组数',
          '鏍稿績': '核心',
          '鍔ㄤ綔': '动作',
          '鍙婇': '及',
          '噸閲': '重量',
          '娆℃暟': '次数',
          '鍛ㄤ竴': '周一',
          '鍛ㄤ簩': '周二',
          '鍛ㄤ笁': '周三',
          '鍛ㄥ洓': '周四',
          '鍛ㄤ簲': '周五',
          '鍛ㄤ叚': '周六',
          '鍛ㄤ嚑': '周日',
          '鑳?': '胸',
          '涓夊ご': '三头',
          '浜屽ご': '二头',
          '鑲?': '肩',
          '鑵?': '腿',
          '鏉犻搩': '杠铃',
          '鍗ф帹': '卧推',
          '脳': '×',
          '缁?': '组',
          '寮曚綋': '引体',
          '鍚戜笂': '向上',
          '鑷噸': '自重',
          '鍝戦搩': '哑铃',
          '鎺ㄨ偐': '推肩',
          '娣辫共': '深蹲',
          '佷笂': '上',
          '鏂滃': '斜',
          '搼閾?': '哑铃',
          '鍜屽櫒': '器械',
          '姊版': '拉',
          '姊板': '划',
          '垝鑸?': '划船',
          '姛澶?': '实力',
          '杩涚': '进',
          '鐩稿叧': '相关',
          '鎶ユ湁': '所有',
          '缁撳悎': '组合',
          '鍚屼竴': '同一',
          '鏁版嵁': '数据',
          '鍒嗙': '分',
          '灞炰': '属',
          '闈炲父': '非常',
          '閲嶈': '重',
          '瑕?': '要',
          '鐩稿': '目',
          '鐨?': '的',
          '鐢': '使',
          'ㄤ': '用',
          '浠?': '这',
          '绉?': '种',
          '鏂瑰': '方',
          '纺': '式',
          '鍙': '可',
          '浠ヤ': '以',
          '澶氬': '更',
          '蹇?': '好',
          '地': '地',
          '杩愯': '实',
          '浜?': '现',
          '鎴愬': '成',
          '鏃?': '功',
          '鐨勫': '的',
          '鍚': '协',
          '': '作',
          '銆': '。',
          '€': '',
          '棰勮': '预览',
          '鍓?': '前',
          '鍖归': '匹配',
          '鎴愬': '成功',
          '绔犺': '章节',
          '闀垮': '长度',
          '鑷': '从',
          '闈?': '无',
          '鍒嗘': '减',
          '寰?': '环',
          '澶?': '大',
          '鏁?': '数',
          '椋?': '量',
          '鍑?': '下',
          '闄?': '降',
          '鏄?': '是',
          '鐪?': '还',
          '鏄?': '并',
          '涓?': '一',
          '鐢?': '使',
          '閲?': '阅',
          '浼?': '为',
          '鎴?': '成',
          '缁?': '组',
          '鐜?': '当',
          '鍚?': '协',
          '闈?': '无',
          '鎵?': '找',
          '琚?': '被',
          '鐩?': '目',
          '澶?': '大',
          '鍑?': '下',
          '鐢?': '使',
          '杩?': '实',
          '鏃?': '时',
          '闈?': '无',
          '鍒?': '分',
          '鍓?': '前',
          '鏄?': '是',
          '鎴?': '成',
          '鐪?': '还',
          '鏄?': '并',
          '涓?': '一',
          '鐢?': '使',
          '閲?': '阅',
          '浼?': '为',
          '鎴?': '成',
          '缁?': '组',
          '鐜?': '当',
          '鍚?': '协',
          '闈?': '无',
          '鎵?': '找',
          '琚?': '被',
          '鐩?': '目',
          '澶?': '大',
          '鍑?': '下',
          '鐢?': '使',
          '杩?': '实',
          '鏃?': '时',
          '闈?': '无',
          '鍒?': '分',
          '鍓?': '前',
          '椋為笩': '飞鸟',
          '閫掑噺': '递减',
          '鍚庢潫': '后束',
          '椋為笩': '飞鸟',
          '閫掑噺': '递减',
          '浠?': '从',
          '鎴愬': '成功',
          '绗?': '第',
          '闄?': '降',
          '鍐嶅': '再',
          '姞': '加',
          '鍝戦搩鎺ㄨ偐': '哑铃推肩',
          '寮曚綋鍚戜笂': '引体向上',
          '鍣ㄦ鎷夎儗': '器械拉背',
          '楂樹綅涓嬫媺': '高位下拉',
          '鍣ㄦ鍒掕埞': '器械划船',
          '榫欓棬鏋禫': '龙门架',
          '杩涙': '进',
          '鐜': '当',
          '鍚': '协',
          '闈': '无',
          '鎵': '找',
          '琚': '被',
          '鐩': '目',
          '澶': '大',
          '鍑': '下',
          '鐢': '使',
          '杩': '实',
          '鏃': '时',
          '闈': '无',
          '鍒': '分',
          '鍓': '前',
          '椋': '飞',
          '為': '鸟',
          '笩': '组',
          '閫': '递',
          '掑': '减',
          '噺': '数',
          '鍚': '后',
          '庢': '束',
          '潫': '飞',
          '浠': '从',
          '鎴': '成',
          '愬': '功',
          '绗': '第',
          '闄': '降',
          '鍐': '再',
          '嶅': '加',
          '鍝': '哑',
          '戦': '铃',
          '搩': '推',
          '鎺': '肩',
          'ㄨ': '',
          '偐': '',
          '寮': '引',
          '曚': '体',
          '綋': '向',
          '鍚': '上',
          '戜': '',
          '笂': '',
          '鑷': '自',
          '': '',
          '噸': '重',
          '鍣': '器',
          'ㄦ': '',
          '': '',
          '鎷': '械',
          '夎': '拉',
          '儗': '背',
          '楂': '高',
          '樹': '位',
          '綅': '',
          '涓': '下',
          '嬫': '拉',
          '媺': '',
          '鍒': '划',
          '掕': '船',
          '埞': '',
          '榫': '龙',
          '欓': '门',
          '棬': '架',
          '鏋': '',
          '禫': '',
          '杩': '进',
          '涙': '',
          '鐜': '',
          '鍚': '',
          '闈': '',
          '鎵': '',
          '琚': '',
          '鐩': '',
          '澶': '',
          '鍑': '',
          '鐢': '',
          '杩': '',
          '鏃': '',
          '闈': '',
          '鍒': '',
          '鍓': '',
          '椋': '',
          '為': '',
          '笩': '',
          '閫': '',
          '掑': '',
          '噺': '',
          '鍚': '',
          '庢': '',
          '潫': '',
          '浠': '',
          '鎴': '',
          '愬': '',
          '绗': '',
          '闄': '',
          '鍐': '',
          '嶅': '',
          '鍝': '',
          '戦': '',
          '搩': '',
          '鎺': '',
          'ㄨ': '',
          '偐': '',
          '寮': '',
          '曚': '',
          '綋': '',
          '鍚': '',
          '戜': '',
          '笂': '',
          '鑷': '',
          '': '',
          '噸': '',
          '鍣': '',
          'ㄦ': '',
          '': '',
          '鎷': '',
          '夎': '',
          '儗': '',
          '楂': '',
          '樹': '',
          '綅': '',
          '涓': '',
          '嬫': '',
          '媺': '',
          '鍒': '',
          '掕': '',
          '埞': '',
          '榫': '',
          '欓': '',
          '棬': '',
          '鏋': '',
          '禫': ''
        };
        
        Object.keys(replacements).forEach(key => {
          content = content.split(key).join(replacements[key]);
        });
      } catch (e) {
        console.log('GBK转换失败:', e);
      }
    }
    
    return content;
  },

  /**
   * 解析 Markdown 文件为数据结构
   * 支持新格式：使用 emoji 标识章节，统一表格格式
   */
  parseMarkdownToData(content) {
    const data = {
      workouts: [],
      diet: [],
      body: [],
      exerciseLibrary: [],
      starredExercises: [],
      templates: []
    };
    
    const lines = content.split('\n');
    let currentSection = '';
    let inTable = false;
    let tableHeaders = [];
    let currentTemplateName = '';
    let inStarredSection = false;
    let inTemplateSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('## ')) {
        inTable = false;
        tableHeaders = [];
        currentTemplateName = '';
        
        if (line.includes('📅') || line.includes('训练记录') || line.includes('训练历史')) {
          currentSection = 'workout';
          inStarredSection = false;
          inTemplateSection = false;
        } else if (line.includes('🥗') || line.includes('饮食')) {
          currentSection = 'diet';
          inStarredSection = false;
          inTemplateSection = false;
        } else if (line.includes('⚖️') || line.includes('身体')) {
          currentSection = 'body';
          inStarredSection = false;
          inTemplateSection = false;
        } else if (line.includes('🏋️') || line.includes('动作库')) {
          currentSection = 'exercise';
          inStarredSection = false;
          inTemplateSection = false;
        } else if (line.includes('⭐') || line.includes('收藏动作')) {
          currentSection = '';
          inStarredSection = true;
          inTemplateSection = false;
        } else if (line.includes('📋') || line.includes('训练模板')) {
          currentSection = '';
          inStarredSection = false;
          inTemplateSection = true;
        } else {
          currentSection = '';
          inStarredSection = false;
          inTemplateSection = false;
        }
        continue;
      }
      
      if (inStarredSection && line.startsWith('- ')) {
        const exerciseName = line.substring(2).trim();
        if (exerciseName) {
          data.starredExercises.push(exerciseName);
        }
        continue;
      }
      
      if (inTemplateSection) {
        if (line.startsWith('### ')) {
          currentTemplateName = line.substring(4).trim();
          if (currentTemplateName) {
            data.templates.push({
              id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
              name: currentTemplateName,
              exercises: [],
              parts: []
            });
          }
        } else if (line.startsWith('- ') && currentTemplateName && data.templates.length > 0) {
          const exerciseName = line.substring(2).trim();
          if (exerciseName) {
            data.templates[data.templates.length - 1].exercises.push(exerciseName);
          }
        }
        continue;
      }
      
      if (line.startsWith('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        
        if (line.includes('|------') && parts.length > 1) {
          inTable = true;
          continue;
        }
        
        if (!inTable) {
          tableHeaders = parts;
          continue;
        }
        
        if (parts.length >= 2) {
          if (currentSection === 'exercise') {
            this.parseExerciseTableRow(data, parts, tableHeaders);
          } else {
            const dateStr = this.parseDate(parts[0]);
            if (dateStr) {
              if (currentSection === 'workout') {
                this.parseWorkoutTableRow(data, dateStr, parts, tableHeaders);
              } else if (currentSection === 'diet') {
                this.parseDietTableRow(data, dateStr, parts, tableHeaders);
              } else if (currentSection === 'body') {
                this.parseBodyTableRow(data, dateStr, parts, tableHeaders);
              }
            }
          }
        }
      } else if (line.trim() === '' || line.startsWith('## ')) {
        inTable = false;
      }
    }
    
    return data;
  },
  
  /**
   * 解析动作库表格行
   * 表格格式: | 动作名称 | 锻炼部位 | 使用器材 |
   */
  parseExerciseTableRow(data, parts, headers) {
    const headerIndex = (name) => {
      return headers.findIndex(h => h.includes(name));
    };
    
    const nameIdx = headerIndex('动作');
    const muscleIdx = headerIndex('部位');
    const equipmentIdx = headerIndex('器材');
    
    if (nameIdx === -1) return;
    
    const name = parts[nameIdx] || '';
    if (!name.trim()) return;
    
    const muscle = parts[muscleIdx] || '其他';
    const equipment = parts[equipmentIdx] || '其他';
    
    if (!data.exerciseLibrary.find(ex => ex.name === name)) {
      data.exerciseLibrary.push({
        name,
        muscle,
        category: this.getCategoryFromMuscle(muscle),
        equipment
      });
    }
  },
  
  /**
   * 解析训练记录表格行（新格式）
   * 表格格式: | 日期 | 训练部位 | 动作名称 | 重量(kg) | 组数 | 次数 | 总次数 | 备注 |
   */
  parseWorkoutTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => {
      return headers.findIndex(h => h.includes(name));
    };
    
    const dateIdx = headerIndex('日期');
    const partsIdx = headerIndex('部位');
    const nameIdx = headerIndex('动作');
    const weightIdx = headerIndex('重量');
    const setsIdx = headerIndex('组数');
    const repsIdx = headerIndex('次数');
    const totalIdx = headerIndex('总次数');
    const notesIdx = headerIndex('备注');
    
    if (nameIdx === -1) return;
    
    const exerciseName = parts[nameIdx] || '';
    if (!exerciseName.trim()) return;
    
    let workout = data.workouts.find(w => w.date === dateStr);
    if (!workout) {
      workout = {
        date: dateStr,
        parts: [],
        exercises: [],
        sets: 0
      };
      data.workouts.push(workout);
    }
    
    if (partsIdx !== -1 && parts[partsIdx]) {
      workout.parts = [...new Set([...workout.parts, ...parts[partsIdx].split('+').map(p => p.trim())])];
    }
    
    const weight = weightIdx !== -1 ? this.extractNumber(parts[weightIdx]) : 0;
    const setsStr = setsIdx !== -1 ? parts[setsIdx] : '';
    const repsStr = repsIdx !== -1 ? parts[repsIdx] : '';
    const setArray = this.extractSetsFromStr(repsStr) || this.extractSetsFromStr(setsStr);
    const totalReps = totalIdx !== -1 ? this.extractNumber(parts[totalIdx]) : setArray.reduce((sum, n) => sum + n, 0);
    const notes = notesIdx !== -1 ? parts[notesIdx] : '';
    
    workout.exercises.push({
      name: exerciseName.trim(),
      weight: weight,
      sets: setArray.length > 0 ? setArray : (setsIdx !== -1 ? Array(parseInt(parts[setsIdx]) || 4).fill(8) : [8]),
      totalReps: totalReps,
      notes: notes
    });
    
    if (setsIdx !== -1) {
      workout.sets = parseInt(parts[setsIdx]) || workout.sets;
    }
  },
  
  /**
   * 解析饮食记录表格行（新格式）
   * 表格格式: | 日期 | 千卡 | 蛋白质(g) | 碳水(g) | 脂肪(g) | 备注 |
   */
  parseDietTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => {
      return headers.findIndex(h => h.includes(name));
    };
    
    const caloriesIdx = headerIndex('千卡');
    const proteinIdx = headerIndex('蛋白质');
    const carbsIdx = headerIndex('碳水');
    const fatIdx = headerIndex('脂肪');
    const notesIdx = headerIndex('备注');
    
    const existingDiet = data.diet.find(d => d.date === dateStr);
    if (existingDiet) {
      if (caloriesIdx !== -1) existingDiet.calories = this.extractNumber(parts[caloriesIdx]);
      if (proteinIdx !== -1) existingDiet.protein = this.extractNumber(parts[proteinIdx]);
      if (carbsIdx !== -1) existingDiet.carbs = this.extractNumber(parts[carbsIdx]);
      if (fatIdx !== -1) existingDiet.fat = this.extractNumber(parts[fatIdx]);
      if (notesIdx !== -1) existingDiet.notes = parts[notesIdx] || '';
    } else {
      data.diet.push({
        date: dateStr,
        calories: caloriesIdx !== -1 ? this.extractNumber(parts[caloriesIdx]) : 0,
        protein: proteinIdx !== -1 ? this.extractNumber(parts[proteinIdx]) : 0,
        carbs: carbsIdx !== -1 ? this.extractNumber(parts[carbsIdx]) : 0,
        fat: fatIdx !== -1 ? this.extractNumber(parts[fatIdx]) : 0,
        notes: notesIdx !== -1 ? parts[notesIdx] : ''
      });
    }
  },
  
  /**
   * 解析身体数据表格行（新格式）
   * 表格格式: | 日期 | 体重(kg) | 胸围(cm) | 腰围(cm) | 臀围(cm) | 上臂(cm) | 大腿(cm) |
   */
  parseBodyTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => {
      return headers.findIndex(h => h.includes(name));
    };
    
    const weightIdx = headerIndex('体重');
    const chestIdx = headerIndex('胸围');
    const waistIdx = headerIndex('腰围');
    const hipsIdx = headerIndex('臀围');
    const armIdx = headerIndex('上臂');
    const legIdx = headerIndex('大腿');
    
    const existingBody = data.body.find(b => b.date === dateStr);
    if (existingBody) {
      if (weightIdx !== -1) existingBody.weight = parseFloat(parts[weightIdx]) || 0;
      if (chestIdx !== -1) existingBody.chest = parseFloat(parts[chestIdx]) || 0;
      if (waistIdx !== -1) existingBody.waist = parseFloat(parts[waistIdx]) || 0;
      if (hipsIdx !== -1) existingBody.hips = parseFloat(parts[hipsIdx]) || 0;
      if (armIdx !== -1) existingBody.arm = parseFloat(parts[armIdx]) || 0;
      if (legIdx !== -1) existingBody.leg = parseFloat(parts[legIdx]) || 0;
    } else {
      data.body.push({
        date: dateStr,
        weight: weightIdx !== -1 ? parseFloat(parts[weightIdx]) || 0 : 0,
        chest: chestIdx !== -1 ? parseFloat(parts[chestIdx]) || 0 : 0,
        waist: waistIdx !== -1 ? parseFloat(parts[waistIdx]) || 0 : 0,
        hips: hipsIdx !== -1 ? parseFloat(parts[hipsIdx]) || 0 : 0,
        arm: armIdx !== -1 ? parseFloat(parts[armIdx]) || 0 : 0,
        leg: legIdx !== -1 ? parseFloat(parts[legIdx]) || 0 : 0
      });
    }
  },
  
  /**
   * 解析训练历史总览表（旧格式兼容）
   */
  parseWorkoutSummaryTable(data, dateStr, parts, headers) {
    let workout = data.workouts.find(w => w.date === dateStr);
    if (!workout) {
      workout = {
        date: dateStr,
        parts: [],
        exercises: [],
        sets: 0
      };
      data.workouts.push(workout);
    }
    
    const partIndex = headers.indexOf('部位');
    if (partIndex !== -1 && parts[partIndex]) {
      workout.parts = parts[partIndex].split('+').map(p => p.trim());
    }
    
    const setsIndex = headers.indexOf('总组数');
    if (setsIndex !== -1 && parts[setsIndex]) {
      const setsStr = parts[setsIndex].replace('组', '').replace('+', '');
      workout.sets = parseInt(setsStr) || 0;
    }
    
    const actionIndex = headers.findIndex(h => h.includes('动作') || h.includes('核心'));
    if (actionIndex !== -1 && parts[actionIndex]) {
      const actions = parts[actionIndex].split('、');
      actions.forEach(actionStr => {
        const exerciseData = this.parseExerciseString(actionStr);
        if (exerciseData.name && exerciseData.name.trim()) {
          const existingExercise = workout.exercises.find(e => e.name === exerciseData.name);
          if (!existingExercise) {
            workout.exercises.push(exerciseData);
          }
        }
      });
    }
  },
  
  /**
   * 解析动作字符串
   */
  parseExerciseString(str) {
    const result = {
      name: '',
      weight: 0,
      sets: [],
      totalReps: 0,
      notes: ''
    };
    
    const match = str.match(/(.+?)(\d+(?:\.\d+)?)\s*kg\s*[×x×]\s*(\d+)\s*组(?:\((.+?)\))?/);
    if (match) {
      result.name = match[1].trim();
      result.weight = parseFloat(match[2]);
      const setCount = parseInt(match[3]);
      if (match[4]) {
        result.sets = match[4].split('/').map(n => {
          const nStr = n.trim();
          const innerMatch = nStr.match(/(\d+)(?:降(\d+(?:\.\d+)?))?/);
          if (innerMatch) {
            return parseInt(innerMatch[1]);
          }
          return parseInt(nStr);
        }).filter(n => !isNaN(n));
      } else {
        result.sets = Array(setCount).fill(8);
      }
      result.totalReps = result.sets.reduce((sum, n) => sum + (n || 0), 0);
    } else {
      const simpleMatch = str.match(/(.+?)(\d+(?:\.\d+)?)\s*kg/);
      if (simpleMatch) {
        result.name = simpleMatch[1].trim();
        result.weight = parseFloat(simpleMatch[2]);
        result.sets = [8];
        result.totalReps = 8;
      } else {
        result.name = str.trim();
        result.sets = [8];
        result.totalReps = 8;
      }
    }
    
    return result;
  },
  
  /**
   * 添加训练数据（新格式）
   */
  addWorkoutData(data, dateStr, parts, exerciseName = '', partsList = ['综合'], totalSets = 0) {
    // 新格式：| 重量(kg) | 组数 | 次数 | 备注 |
    let weight = parseFloat(parts[0]) || 0;
    let sets = parseInt(parts[1]) || 0;
    let setsInfo = parts[2] || '';
    let notes = parts[3] || '';
    
    // 计算总次数
    const setArray = this.extractSetsFromStr(setsInfo);
    const totalReps = setArray.reduce((sum, n) => sum + n, 0);
    
    let existingWorkout = data.workouts.find(w => w.date === dateStr);
    if (!existingWorkout) {
      existingWorkout = {
        date: dateStr,
        parts: [...partsList],
        exercises: [],
        sets: totalSets || 0
      };
      data.workouts.push(existingWorkout);
    }
    
    existingWorkout.exercises.push({
      name: exerciseName || '未记录',
      weight: weight,
      sets: setArray,
      totalReps: totalReps,
      notes: notes
    });
  },
  
  /**
   * 添加饮食数据
   */
  addDietData(data, dateStr, parts) {
    data.diet.push({
      date: dateStr,
      calories: this.extractNumber(parts[4] || ''),
      protein: this.extractNumber(parts[1] || ''),
      carbs: this.extractNumber(parts[2] || ''),
      fat: this.extractNumber(parts[3] || ''),
      notes: parts[5] || ''
    });
  },

  /**
   * 添加身体数据
   */
  addBodyData(data, dateStr, parts) {
    data.body.push({
      date: dateStr,
      weight: parseFloat(parts[1]) || 0,
      chest: parseFloat(parts[2]) || 0,
      waist: parseFloat(parts[3]) || 0,
      hips: parseFloat(parts[4]) || 0,
      arm: parseFloat(parts[5]) || 0,
      leg: parseFloat(parts[6]) || 0
    });
  },

  /**
   * 清理动作名称
   */
  cleanExerciseName(name) {
    if (!name) return '未记录';
    // 移除重量和组数信息
    let cleaned = name.split('、')[0] || name;
    cleaned = cleaned.replace(/\d+(\.\d+)?\s*kg/g, '');
    cleaned = cleaned.replace(/×\d+组/g, '');
    cleaned = cleaned.replace(/\(\d+\/\d+\/?\d*\/?\d*\)/g, '');
    cleaned = cleaned.replace(/\d+\s*×\s*\d+/g, '');
    return cleaned.trim() || '未记录';
  },

  /**
   * 从描述中计算总次数
   */
  calculateTotalRepsFromDesc(desc) {
    const match = desc.match(/\((\d+\/\d+\/\d+\/\d+)\)/);
    if (match) {
      return match[1].split('/').reduce((sum, n) => sum + parseInt(n), 0);
    }
    const simpleMatch = desc.match(/(\d+)\s*组\s*×\s*(\d+)/);
    if (simpleMatch) {
      return parseInt(simpleMatch[1]) * parseInt(simpleMatch[2]);
    }
    return 0;
  },

  /**
   * 解析单个动作章节
   */
  parseExerciseSection(section, data) {
    const titleMatch = section.match(/#### (.+)/);
    if (!titleMatch) return;
    const exerciseName = titleMatch[1].trim();
    
    // 尝试多种表格匹配模式
    let tableMatch = section.match(/\|------\|------\|------------\|--------\|------\|[\s\S]*?\n([\s\S]*?)(?=\n---|\n#### |\n### |\n##)/);
    if (!tableMatch) {
      tableMatch = section.match(/\|------\|------\|--------\|------\|[\s\S]*?\n([\s\S]*?)(?=\n---|\n#### |\n### |\n##)/);
    }
    
    if (tableMatch) {
      const rows = tableMatch[1].trim().split('\n');
      rows.forEach(row => {
        if (!row.startsWith('|')) return;
        const parts = row.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 4) {
          const dateStr = this.parseDate(parts[0]);
          if (dateStr) {
            const existingWorkout = data.workouts.find(w => w.date === dateStr);
            const weight = parseFloat(parts[1]) || this.extractWeightFromStr(parts[1]);
            
            if (existingWorkout) {
              existingWorkout.exercises.push({
                name: exerciseName,
                weight: weight,
                sets: this.extractSetsFromStr(parts[2]),
                totalReps: parseInt(parts[3]) || this.calculateTotalReps(parts[2]),
                notes: parts[4] || ''
              });
            } else {
              data.workouts.push({
                date: dateStr,
                parts: ['综合'],
                exercises: [{
                  name: exerciseName,
                  weight: weight,
                  sets: this.extractSetsFromStr(parts[2]),
                  totalReps: parseInt(parts[3]) || this.calculateTotalReps(parts[2]),
                  notes: parts[4] || ''
                }],
                sets: this.extractSetCount(parts[2])
              });
            }
          }
        }
      });
    }
  },

  /**
   * 解析饮食表格
   */
  parseDietTable(content, data) {
    const rows = content.trim().split('\n');
    rows.forEach(row => {
      if (!row.startsWith('|')) return;
      const parts = row.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length >= 5) {
        const dateStr = this.parseDate(parts[0]);
        if (dateStr) {
          data.diet.push({
            date: dateStr,
            calories: this.extractNumber(parts[5]),
            protein: this.extractNumber(parts[2]),
            carbs: this.extractNumber(parts[3]),
            fat: this.extractNumber(parts[4]),
            notes: parts[6] || ''
          });
        }
      }
    });
  },

  /**
   * 解析日期 - 支持多种格式
   */
  parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    
    // 格式: 4/13 或 4/1
    const match1 = dateStr.match(/^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*$/);
    if (match1) {
      const month = parseInt(match1[1]).toString().padStart(2, '0');
      const day = parseInt(match1[2]).toString().padStart(2, '0');
      return `2026-${month}-${day}`;
    }
    
    // 格式: 4月13日
    const match2 = dateStr.match(/(\d{1,2})月(\d{1,2})日/);
    if (match2) {
      const month = parseInt(match2[1]).toString().padStart(2, '0');
      const day = parseInt(match2[2]).toString().padStart(2, '0');
      return `2026-${month}-${day}`;
    }
    
    // 格式: 2026-04-13
    const match3 = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match3) {
      return `${match3[1]}-${match3[2]}-${match3[3]}`;
    }
    
    return null;
  },

  /**
   * 从字符串提取重量
   */
  extractWeight(str) {
    const match = str.match(/(\d+)\s*kg/);
    return match ? parseInt(match[1]) : 0;
  },

  extractWeightFromStr(str) {
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  },

  /**
   * 从字符串提取组数
   */
  extractSets(str) {
    const match = str.match(/(\d+)\s*组/);
    if (match) {
      const count = parseInt(match[1]);
      return Array(count).fill(8);
    }
    return [];
  },

  extractSetsFromStr(str) {
    if (!str || str.trim() === '') return [];
    str = str.trim();
    
    const match = str.match(/(\d+)\s*组\((.+?)\)/);
    if (match) {
      return match[2].split('/').map(n => parseInt(n)).filter(n => !isNaN(n));
    }
    
    const simpleMatch = str.match(/(\d+)\s*×\s*(\d+)/);
    if (simpleMatch) {
      const sets = parseInt(simpleMatch[1]);
      const reps = parseInt(simpleMatch[2]);
      return Array(sets).fill(reps);
    }
    
    const slashMatch = str.match(/^(\d+\/)+\d+$/);
    if (slashMatch) {
      return str.split('/').map(n => parseInt(n)).filter(n => !isNaN(n));
    }
    
    return [];
  },

  extractSetCount(str) {
    const match = str.match(/(\d+)\s*组/);
    return match ? parseInt(match[1]) : 0;
  },

  /**
   * 提取总次数
   */
  extractTotalReps(str) {
    const match = str.match(/总次数\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  },

  calculateTotalReps(str) {
    const match = str.match(/\((.+?)\)/);
    if (match) {
      return match[1].split('/').reduce((sum, n) => sum + parseInt(n), 0);
    }
    const simpleMatch = str.match(/(\d+)\s*×\s*(\d+)/);
    if (simpleMatch) {
      return parseInt(simpleMatch[1]) * parseInt(simpleMatch[2]);
    }
    return 0;
  },

  /**
   * 提取数字
   */
  extractNumber(str) {
    if (!str || str === '-' || str === '~') return 0;
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  },

  /**
   * 去重训练记录（按日期+部位组合去重）
   */
  deduplicateWorkouts(workouts) {
    const seen = new Set();
    return workouts.filter(w => {
      const key = w.date + '-' + w.parts.join('-');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  /**
   * 去重饮食记录（按日期去重）
   */
  deduplicateDiet(diet) {
    const seen = new Set();
    return diet.filter(d => {
      if (seen.has(d.date)) return false;
      seen.add(d.date);
      return true;
    });
  },

  /**
   * 去重身体数据（按日期去重）
   */
  deduplicateBody(body) {
    const seen = new Set();
    return body.filter(b => {
      if (seen.has(b.date)) return false;
      seen.add(b.date);
      return true;
    });
  },

  /**
   * 下载JSON导入模板
   */
  downloadJSONTemplate() {
    const template = {
      workouts: [
        {
          date: "2024-01-15",
          parts: ["胸", "肩"],
          exercises: [
            {
              name: "杠铃卧推",
              weight: 55,
              sets: [8, 8, 8],
              totalReps: 24,
              notes: "最佳表现"
            }
          ],
          sets: 3
        }
      ],
      diet: [
        {
          date: "2024-01-15",
          calories: 2500,
          protein: 150,
          carbs: 200,
          fat: 80,
          notes: "健身日"
        }
      ],
      body: [
        {
          date: "2024-01-15",
          weight: 75.5,
          chest: 100,
          waist: 85,
          hips: 105,
          arm: 35,
          leg: 55
        }
      ],
      starredExercises: ["杠铃卧推", "深蹲"],
      templates: [
        {
          id: "custom_1234567890",
          name: "胸部训练",
          exercises: ["杠铃卧推", "哑铃卧推", "飞鸟"]
        }
      ],
      settings: {
        height: 180,
        age: 30,
        gender: "male",
        activityLevel: 1.55,
        calorieGoal: 2500,
        showDietProgressBar: true
      }
    };
    
    Utils.downloadFile(JSON.stringify(template, null, 2), 'fitness_import_template.json', 'application/json');
    Utils.showToast('JSON 模板已下载');
  },

  /**
   * 下载导入模板（旧函数，保持兼容）
   */
  downloadImportTemplate() {
    this.downloadJSONTemplate();
  },

  /**
   * 显示导入格式说明
   */
  showImportFormat() {
    Utils.showModal(`
      <div class="modal-header">
        <span>数据导入格式说明</span>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div style="padding: 16px; max-height: 500px; overflow-y: auto;">
        <div style="margin-bottom: 16px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">📋 支持的导入格式</h3>
          <p style="font-size: 14px; color: var(--text-muted);">目前支持以下格式导入（推荐使用 JSON 格式）：</p>
        </div>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">✅ JSON 格式（推荐）</h4>
          <p style="font-size: 13px; color: #16a34a; margin-bottom: 8px;">完整支持所有数据类型导入</p>
          <pre style="font-size: 12px; white-space: pre-wrap; word-break: break-all;">{
  "workouts": [...],
  "diet": [...],
  "body": [...],
  "starredExercises": [...],
  "templates": [...],
  "settings": {...}
}</pre>
        </div>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #fef3c7; border-radius: 8px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">📊 CSV 格式</h4>
          <p style="font-size: 13px; color: #d97706; margin-bottom: 8px;">适合导入简单数据，仅支持训练记录和饮食记录</p>
          <pre style="font-size: 12px; white-space: pre-wrap; word-break: break-all;">日期,部位,动作名称,重量,组数,次数,备注
2024-01-15,胸+肩,杠铃卧推,55,3,8/8/8,最佳表现
2024-01-15,胸+肩,哑铃侧平举,15,3,12/12/12,</pre>
        </div>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #e0e7ff; border-radius: 8px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">📝 Markdown 格式</h4>
          <p style="font-size: 13px; color: #6366f1; margin-bottom: 8px;">适合分享和备份，支持导出为表格格式</p>
        </div>
        
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">📋 JSON 数据结构详情</h4>
        </div>
        
        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <h5 style="font-weight: 600; margin-bottom: 6px;">1. 训练记录 (workouts)</h5>
          <pre style="font-size: 11px; white-space: pre-wrap; word-break: break-all;">{
  "date": "2024-01-15",
  "parts": ["胸", "肩"],
  "exercises": [{
    "name": "杠铃卧推",
    "weight": 55,
    "sets": [8, 8, 8],
    "totalReps": 24,
    "notes": "备注"
  }],
  "sets": 3
}</pre>
        </div>
        
        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <h5 style="font-weight: 600; margin-bottom: 6px;">2. 饮食记录 (diet)</h5>
          <pre style="font-size: 11px; white-space: pre-wrap; word-break: break-all;">{
  "date": "2024-01-15",
  "calories": 2500,
  "protein": 150,
  "carbs": 200,
  "fat": 80,
  "notes": "健身日"
}</pre>
        </div>
        
        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <h5 style="font-weight: 600; margin-bottom: 6px;">3. 身体数据 (body)</h5>
          <pre style="font-size: 11px; white-space: pre-wrap; word-break: break-all;">{
  "date": "2024-01-15",
  "weight": 75.5,
  "chest": 100,
  "waist": 85,
  "hips": 105,
  "arm": 35,
  "leg": 55
}</pre>
        </div>
        
        <div style="padding: 12px; background: #eff6ff; border-radius: 8px; font-size: 13px;">
          <strong>💡 提示：</strong>
          <ul style="margin: 8px 0 0 16px; padding: 0;">
            <li>所有字段均为可选，可只导入需要的数据</li>
            <li>日期格式必须为 YYYY-MM-DD</li>
            <li>建议先导出数据作为模板，修改后再导入</li>
            <li>导入不会覆盖原有数据，而是追加合并</li>
            <li>点击下方按钮可下载各种格式的导入模板</li>
          </ul>
        </div>
        
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="SettingsModule.downloadJSONTemplate()">JSON 模板</button>
          <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.downloadCSVTemplates()">CSV 模板</button>
          <button class="btn btn-secondary" style="flex: 1;" onclick="SettingsModule.downloadMDTemplate()">MD 模板</button>
        </div>
      </div>
    `);
  },

  /**
   * 下载CSV模板
   */
  downloadCSVTemplates() {
    const workoutCSV = `日期,部位,动作名称,重量,组数,次数,备注
2024-01-15,胸+肩,杠铃卧推,55,3,8/8/8,最佳表现
2024-01-15,胸+肩,哑铃侧平举,15,3,12/12/12,
2024-01-16,背,引体向上,0,4,8/8/6/6,
2024-01-16,背,高位下拉,40,4,10/10/10/10,`;
    
    const dietCSV = `日期,千卡,蛋白质(g),碳水(g),脂肪(g),备注
2024-01-15,2500,150,200,80,健身日
2024-01-16,2800,180,250,90,休息日
2024-01-17,2300,140,180,70,减脂日`;
    
    Utils.downloadFile(workoutCSV, 'workout_template.csv', 'text/csv');
    setTimeout(() => {
      Utils.downloadFile(dietCSV, 'diet_template.csv', 'text/csv');
    }, 500);
    Utils.showToast('CSV模板已下载');
  },

  /**
   * 下载Markdown模板
   */
  downloadMDTemplate() {
    const mdContent = `# 健身记录数据

## 📅 训练记录

| 日期 | 训练部位 | 动作名称 | 重量(kg) | 组数 | 次数 | 备注 |
|------|----------|----------|----------|------|------|------|
| 2024-01-15 | 胸+肩 | 杠铃卧推 | 55 | 3 | 8/8/8 | 最佳表现 |
| 2024-01-15 | 胸+肩 | 哑铃侧平举 | 15 | 3 | 12/12/12 | |

## 🥗 饮食记录

| 日期 | 千卡 | 蛋白质(g) | 碳水(g) | 脂肪(g) | 备注 |
|------|------|-----------|---------|---------|------|
| 2024-01-15 | 2500 | 150 | 200 | 80 | 健身日 |

## ⚖️ 身体数据

| 日期 | 体重(kg) | 胸围(cm) | 腰围(cm) | 臀围(cm) | 上臂(cm) | 大腿(cm) |
|------|----------|----------|----------|----------|----------|----------|
| 2024-01-15 | 75.5 | 100 | 85 | 105 | 35 | 55 |

## ⭐ 收藏动作

- 杠铃卧推
- 深蹲
- 引体向上

## 📋 训练模板

### 胸部训练
- 杠铃卧推
- 哑铃卧推
- 飞鸟
- 双杠臂屈伸
`;
    
    Utils.downloadFile(mdContent, 'fitness_data_template.md', 'text/markdown');
    Utils.showToast('MD模板已下载');
  },

  /**
   * 确认清除全部数据
   */
  confirmClearAll() {
    Utils.showConfirm(
      '⚠️',
      '确认清除全部数据',
      '此操作将删除所有训练记录、饮食记录和身体数据，且无法恢复！',
      () => this.clearAllData(),
      () => {}
    );
  },

  /**
   * 更新动作库
   * 从已导入的训练数据中提取新动作并添加到动作库
   */
  updateExerciseLibrary() {
    // 从现有训练数据中提取所有动作
    const exercisesFromData = new Set();
    appData.workouts.forEach(w => {
      w.exercises.forEach(e => {
        exercisesFromData.add(e.name);
      });
    });
    
    // 获取当前动作库中的动作名称
    const existingExercises = new Set(appData.exerciseLibrary.map(e => e.name));
    
    // 找出新动作
    const newExercises = [...exercisesFromData].filter(name => !existingExercises.has(name));
    
    if (newExercises.length === 0) {
      Utils.showToast('动作库已是最新，没有新动作需要添加');
      return;
    }
    
    Utils.showConfirm(
      '🔄',
      '确认更新动作库',
      `发现 ${newExercises.length} 个新动作，是否添加到动作库？\n\n${newExercises.join('\n')}`,
      () => {
        // 为新动作添加到动作库
        newExercises.forEach(name => {
          const muscle = Utils.getExercisePart(name);
          const category = this.getCategoryFromMuscle(muscle);
          appData.exerciseLibrary.push({
            name,
            muscle,
            category,
            equipment: '其他'
          });
        });
        
        // 保存到本地存储
        Storage.saveExerciseLibrary(appData.exerciseLibrary);
        
        Utils.showToast(`动作库已更新！新增 ${newExercises.length} 个动作`);
        navigateTo('settings');
      },
      () => {}
    );
  },

  /**
   * 根据部位获取分类
   */
  getCategoryFromMuscle(muscle) {
    const categoryMap = {
      '胸': 'chest',
      '背': 'back',
      '肩': 'shoulder',
      '腿': 'legs',
      '三头': 'triceps',
      '二头': 'biceps',
      '其他': 'other'
    };
    return categoryMap[muscle] || 'other';
  },

  /**
   * 确认清除训练记录
   */
  confirmClearWorkouts() {
    Utils.showConfirm(
      '🗑️',
      '确认清除训练记录',
      `将删除全部 ${appData.workouts.length} 条训练记录，且无法恢复！`,
      () => this.clearWorkouts(),
      () => {}
    );
  },

  /**
   * 确认清除饮食记录
   */
  confirmClearDiet() {
    Utils.showConfirm(
      '🗑️',
      '确认清除饮食记录',
      `将删除全部 ${appData.diet.length} 条饮食记录，且无法恢复！`,
      () => this.clearDiet(),
      () => {}
    );
  },

  /**
   * 确认清除身体数据
   */
  confirmClearBody() {
    Utils.showConfirm(
      '🗑️',
      '确认清除身体数据',
      `将删除全部 ${appData.body.length} 条身体数据，且无法恢复！`,
      () => this.clearBody(),
      () => {}
    );
  },

  /**
   * 确认清除动作库
   */
  confirmClearExerciseLibrary() {
    Utils.showConfirm(
      '🗑️',
      '确认清除动作库',
      `将删除全部 ${appData.exerciseLibrary.length} 个动作，且无法恢复！`,
      () => this.clearExerciseLibrary(),
      () => {}
    );
  },

  /**
   * 清除全部数据
   */
  clearAllData() {
    Storage.clearAllData();
    initAppData(true);
    Utils.showToast('所有数据已清除');
    navigateTo('home');
  },

  /**
   * 清除训练记录
   */
  clearWorkouts() {
    appData.workouts = [];
    Storage.saveWorkouts([]);
    Utils.showToast('训练记录已清除');
    navigateTo('workout');
  },

  /**
   * 清除饮食记录
   */
  clearDiet() {
    appData.diet = [];
    Storage.saveDiet([]);
    Utils.showToast('饮食记录已清除');
    navigateTo('diet');
  },

  /**
   * 清除身体数据
   */
  clearBody() {
    appData.body = [];
    Storage.saveBody([]);
    Utils.showToast('身体数据已清除');
    navigateTo('body');
  },

  /**
   * 清除动作库
   */
  clearExerciseLibrary() {
    appData.exerciseLibrary = [];
    Storage.saveExerciseLibrary([]);
    Utils.showToast('动作库已清除');
    navigateTo('exercise');
  },

  /**
   * 为导入的训练记录计算 PR
   * @param {Array} workouts - 训练记录数组
   */
  calculatePRsForImportedWorkouts(workouts) {
    const updatedPRs = [];
    const breakTypes = { weight: 0, reps: 0, volume: 0, first: 0 };
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exercise.sets || exercise.sets.length === 0) return;
        
        const maxReps = Math.max(...exercise.sets);
        const prData = {
          weight: exercise.weight || 0,
          reps: maxReps,
          date: workout.date
        };
        
        const result = Storage.updatePR(exercise.name, prData);
        if (result.isNewPR) {
          updatedPRs.push(exercise.name);
          const type = result.breakType || 'first';
          breakTypes[type]++;
        }
      });
    });
    
    if (updatedPRs.length > 0) {
      let message = `已更新 ${updatedPRs.length} 项个人纪录`;
      const typeMessages = [];
      if (breakTypes.weight > 0) typeMessages.push(`${breakTypes.weight}次重量突破`);
      if (breakTypes.reps > 0) typeMessages.push(`${breakTypes.reps}次次数突破`);
      if (breakTypes.volume > 0) typeMessages.push(`${breakTypes.volume}次总量突破`);
      if (breakTypes.first > 0) typeMessages.push(`${breakTypes.first}项新纪录`);
      if (typeMessages.length > 0) message += ` (${typeMessages.join('、')})`;
      Utils.showToast(message);
    }
  }
};

// 导出到全局
window.SettingsModule = SettingsModule;
