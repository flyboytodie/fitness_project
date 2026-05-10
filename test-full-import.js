const fs = require('fs');

class TestSettingsModule {
  parseMarkdownToData(content) {
    const data = {
      workouts: [],
      diet: [],
      body: [],
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
      } else if (line.trim() === '' || line.startsWith('## ')) {
        inTable = false;
      }
    }
    
    return data;
  }
  
  parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    
    const match1 = dateStr.match(/^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*$/);
    if (match1) {
      const month = parseInt(match1[1]).toString().padStart(2, '0');
      const day = parseInt(match1[2]).toString().padStart(2, '0');
      return `2026-${month}-${day}`;
    }
    
    const match2 = dateStr.match(/(\d{1,2})月(\d{1,2})日/);
    if (match2) {
      const month = parseInt(match2[1]).toString().padStart(2, '0');
      const day = parseInt(match2[2]).toString().padStart(2, '0');
      return `2026-${month}-${day}`;
    }
    
    const match3 = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match3) {
      return `${match3[1]}-${match3[2]}-${match3[3]}`;
    }
    
    return null;
  }
  
  parseWorkoutTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => headers.findIndex(h => h.includes(name));
    
    const nameIdx = headerIndex('动作');
    const weightIdx = headerIndex('重量');
    const setsIdx = headerIndex('组数');
    const repsIdx = headerIndex('次数');
    const totalIdx = headerIndex('总次数');
    const notesIdx = headerIndex('备注');
    const partsIdx = headerIndex('部位');
    
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
  }
  
  parseDietTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => headers.findIndex(h => h.includes(name));
    
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
  }
  
  parseBodyTableRow(data, dateStr, parts, headers) {
    const headerIndex = (name) => headers.findIndex(h => h.includes(name));
    
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
  }
  
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
  }
  
  extractNumber(str) {
    if (!str || str === '-' || str === '~') return 0;
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }
}

const filePath = './健身数据汇总_适配导入版本.md';
console.log(`读取文件: ${filePath}`);

try {
  const content = fs.readFileSync(filePath, 'utf-8');
  const settingsModule = new TestSettingsModule();
  const result = settingsModule.parseMarkdownToData(content);
  
  console.log('\n=== 解析结果 ===');
  console.log(`训练记录: ${result.workouts.length} 条`);
  console.log(`饮食记录: ${result.diet.length} 条`);
  console.log(`身体数据: ${result.body.length} 条`);
  
  console.log('\n--- 训练记录详情 ---');
  const uniqueDates = [...new Set(result.workouts.map(w => w.date))];
  console.log(`覆盖日期: ${uniqueDates.length} 天 (${uniqueDates.join(', ')})`);
  
  result.workouts.forEach(w => {
    console.log(`\n日期: ${w.date}, 部位: ${w.parts.join('+')}, 动作数: ${w.exercises.length}`);
    w.exercises.forEach(e => {
      console.log(`  - ${e.name}: ${e.weight}kg x ${e.sets.join('/')} (总次数: ${e.totalReps})`);
    });
  });
  
  console.log('\n--- 饮食记录详情 ---');
  result.diet.forEach(d => {
    console.log(`日期: ${d.date}, 热量: ${d.calories}kcal, 蛋白质: ${d.protein}g, 碳水: ${d.carbs}g, 脂肪: ${d.fat}g`);
  });
  
} catch (err) {
  console.error('读取文件失败:', err.message);
}