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
    md += `> 导出日期：${new Date().toLocaleString('zh-CN')}\n\n`;
    
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
    
    // 身体数据
    md += `## ⚖️ 身体数据\n\n`;
    md += `| 日期 | 体重(kg) | 胸围(cm) | 腰围(cm) | 臀围(cm) | 上臂(cm) | 大腿(cm) |\n`;
    md += `|------|----------|----------|----------|----------|----------|----------|\n`;
    appData.body.forEach(b => {
      md += `| ${b.date} | ${b.weight} | ${b.chest || '-'} | ${b.waist || '-'} | ${b.hips || '-'} | ${b.arm || '-'} | ${b.leg || '-'} |\n`;
    });
    md += `\n`;
    
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
            appData.workouts = [...appData.workouts, ...data.workouts];
            Storage.saveWorkouts(appData.workouts);
          }
          if (data.diet && data.diet.length > 0) {
            appData.diet = [...appData.diet, ...data.diet];
            Storage.saveDiet(appData.diet);
          }
          if (data.body && data.body.length > 0) {
            appData.body = [...appData.body, ...data.body];
            Storage.saveBody(appData.body);
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
          
          Utils.showToast(`导入成功！训练: ${data.workouts?.length || 0}条，饮食: ${data.diet?.length || 0}条，身体: ${data.body?.length || 0}条`);
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
    // 检测是否是 GBK 编码（通过检测常见的 GBK 乱码特征）
    const gbkPatterns = ['鍋ヨ韩', '涓€銆', '鏃ユ湡', '閮ㄤ綔'];
    const hasGbkIssues = gbkPatterns.some(pattern => content.includes(pattern));
    
    if (hasGbkIssues) {
      // 尝试将 GBK 编码转换为 UTF-8
      try {
        // 创建一个模拟的转换
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
          '鍔ㄤ綔': '动作',
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
          '€': ''
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
   */
  parseMarkdownToData(content) {
    const data = {
      workouts: [],
      diet: [],
      body: []
    };
    
    const lines = content.split('\n');
    let currentSection = '';
    let inTable = false;
    let currentExerciseName = '';
    let tableHeaders = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 检测章节
      if (line.startsWith('## ')) {
        if (line.includes('训练') || line.includes('鍋ヨ韩') || line.includes('佽')) {
          currentSection = 'workout';
        } else if (line.includes('饮食') || line.includes('闋')) {
          currentSection = 'diet';
        } else if (line.includes('身体') || line.includes('琛')) {
          currentSection = 'body';
        } else {
          currentSection = '';
        }
        inTable = false;
        currentExerciseName = '';
        continue;
      }
      
      // 检测动作名称 (#### )
      if (line.startsWith('#### ')) {
        currentExerciseName = line.substring(5).trim();
        inTable = false;
        tableHeaders = [];
        continue;
      }
      
      // 检测表格开始
      if (line.startsWith('|') && !line.includes('|------')) {
        if (!inTable) {
          inTable = true;
          tableHeaders = line.split('|').map(p => p.trim()).filter(p => p);
        } else {
          const parts = line.split('|').map(p => p.trim()).filter(p => p);
          if (parts.length >= 2) {
            const dateStr = this.parseDate(parts[0]);
            if (dateStr) {
              // 判断是训练表还是饮食表
              if (currentSection === 'workout' || (currentExerciseName && parts.length >= 4)) {
                this.addWorkoutData(data, dateStr, parts, currentExerciseName);
              } else if (currentSection === 'diet') {
                this.addDietData(data, dateStr, parts);
              }
            }
          }
        }
      }
      
      // 检测表格分隔线
      if (line.startsWith('|------')) {
        inTable = true;
        continue;
      }
    }
    
    return data;
  },
  
  /**
   * 添加训练数据
   */
  addWorkoutData(data, dateStr, parts, exerciseName = '') {
    // 如果没有指定动作名称，从描述中提取
    let name = exerciseName || this.cleanExerciseName(parts[4] || parts[1] || '');
    let weight = parseFloat(parts[1]) || this.extractWeight(parts[4] || parts[1] || '');
    let setsInfo = parts[2] || parts[4] || '';
    let totalReps = parseInt(parts[3]) || this.calculateTotalReps(setsInfo);
    let sets = this.extractSetCount(setsInfo) || 0;
    let notes = parts[4] || parts[5] || '';
    
    // 如果没有指定部位，尝试从描述中提取
    let partsList = ['综合'];
    if (parts[2] && !parts[2].match(/^\d/)) {
      partsList = [parts[2]];
    }
    
    let existingWorkout = data.workouts.find(w => w.date === dateStr);
    if (!existingWorkout) {
      existingWorkout = {
        date: dateStr,
        parts: partsList,
        exercises: [],
        sets: 0
      };
      data.workouts.push(existingWorkout);
    }
    
    existingWorkout.exercises.push({
      name: name || '未记录',
      weight: weight,
      sets: this.extractSetsFromStr(setsInfo),
      totalReps: totalReps,
      notes: notes
    });
    existingWorkout.sets += sets || 1;
  },
  
  /**
   * 添加饮食数据
   */
  addDietData(data, dateStr, parts) {
    data.diet.push({
      date: dateStr,
      calories: this.extractNumber(parts[5] || parts[4] || ''),
      protein: this.extractNumber(parts[2] || ''),
      carbs: this.extractNumber(parts[3] || ''),
      fat: this.extractNumber(parts[4] || ''),
      notes: parts[6] || parts[5] || ''
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
    if (!str) return [];
    const match = str.match(/(\d+)\s*组\((.+?)\)/);
    if (match) {
      return match[2].split('/').map(n => parseInt(n));
    }
    const simpleMatch = str.match(/(\d+)\s*×\s*(\d+)/);
    if (simpleMatch) {
      const sets = parseInt(simpleMatch[1]);
      const reps = parseInt(simpleMatch[2]);
      return Array(sets).fill(reps);
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
   * 去重训练记录
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
   * 清除全部数据
   */
  clearAllData() {
    Storage.clearAllData();
    initAppData();
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
  }
};

// 导出到全局
window.SettingsModule = SettingsModule;
