const fs = require('fs');

const buffer = fs.readFileSync('健身数据汇总.md');
const content = buffer.toString('utf-8');

console.log('=== 文件内容预览 (前10行) ===');
const lines = content.split('\n');
lines.slice(0, 10).forEach((line, i) => {
  console.log(`${i+1}: ${line}`);
});

function parseDate(dateStr) {
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

function parseExerciseString(str) {
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
}

function parseMarkdownToData(content) {
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

    if (line.startsWith('## ')) {
      if (line.includes('训练记录') || line.includes('训练历史')) {
        currentSection = 'workout';
        console.log(`找到训练章节: ${line}`);
      } else if (line.includes('饮食')) {
        currentSection = 'diet';
        console.log(`找到饮食章节: ${line}`);
      } else if (line.includes('身体')) {
        currentSection = 'body';
        console.log(`找到身体章节: ${line}`);
      } else {
        currentSection = '';
      }
      inTable = false;
      currentExerciseName = '';
      tableHeaders = [];
      continue;
    }

    if (line.startsWith('#### ')) {
      currentExerciseName = line.substring(5).trim();
      console.log(`找到动作: ${currentExerciseName}`);
      inTable = false;
      tableHeaders = [];
      continue;
    }

    if (line.startsWith('|') && !line.includes('|------')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line.split('|').map(p => p.trim()).filter(p => p);
        console.log(`找到表头: ${tableHeaders.join(', ')}`);
      } else {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 2) {
          const dateStr = parseDate(parts[0]);
          console.log(`解析行: ${line}`);
          console.log(`日期解析: ${parts[0]} -> ${dateStr}`);
          
          if (dateStr && currentSection === 'workout') {
            if (currentExerciseName && tableHeaders.includes('日期') && tableHeaders.includes('重量')) {
              addWorkoutData(data, dateStr, parts, currentExerciseName);
            } else if (tableHeaders.includes('部位') || tableHeaders.includes('总组数')) {
              parseWorkoutSummaryTable(data, dateStr, parts, tableHeaders);
            }
          } else if (dateStr && currentSection === 'diet') {
            addDietData(data, dateStr, parts, tableHeaders);
          }
        }
      }
    }

    if (line.startsWith('|------')) {
      inTable = true;
      continue;
    }
  }

  return data;
}

function parseWorkoutSummaryTable(data, dateStr, parts, headers) {
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
      const exerciseData = parseExerciseString(actionStr);
      if (exerciseData.name && exerciseData.name.trim()) {
        const existingExercise = workout.exercises.find(e => e.name === exerciseData.name);
        if (!existingExercise) {
          workout.exercises.push(exerciseData);
        }
      }
    });
  }
}

function addWorkoutData(data, dateStr, parts, exerciseName) {
  let workout = data.workouts.find(w => w.date === dateStr);
  if (!workout) {
    workout = {
      date: dateStr,
      parts: ['综合'],
      exercises: [],
      sets: 0
    };
    data.workouts.push(workout);
  }

  const weightIndex = parts.findIndex((p, i) => i > 0 && p.includes('kg'));
  const setsIndex = parts.findIndex((p, i) => i > 0 && (p.includes('组') || /^\d+(\/\d+)+$/.test(p)));
  
  let weight = 0;
  let sets = [];
  let totalReps = 0;

  if (weightIndex !== -1) {
    const weightMatch = parts[weightIndex].match(/(\d+(?:\.\d+)?)/);
    weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
  }

  if (setsIndex !== -1) {
    const setsStr = parts[setsIndex];
    const setsMatch = setsStr.match(/\((.+?)\)/);
    if (setsMatch) {
      sets = setsMatch[1].split('/').map(n => parseInt(n)).filter(n => !isNaN(n));
    } else if (/^\d+(\/\d+)+$/.test(setsStr)) {
      sets = setsStr.split('/').map(n => parseInt(n)).filter(n => !isNaN(n));
    } else {
      const countMatch = setsStr.match(/(\d+)\s*组/);
      if (countMatch) {
        sets = Array(parseInt(countMatch[1])).fill(8);
      }
    }
    totalReps = sets.reduce((sum, n) => sum + n, 0);
  }

  workout.exercises.push({
    name: exerciseName,
    weight: weight,
    sets: sets,
    totalReps: totalReps,
    notes: ''
  });
}

function addDietData(data, dateStr, parts, headers) {
  const calorieIndex = headers.findIndex(h => h.includes('热量') || h.includes('千卡'));
  const proteinIndex = headers.findIndex(h => h.includes('蛋白'));
  const carbsIndex = headers.findIndex(h => h.includes('碳水'));
  const fatIndex = headers.findIndex(h => h.includes('脂肪'));
  const notesIndex = headers.findIndex(h => h.includes('备注'));

  data.diet.push({
    date: dateStr,
    calories: extractNumber(calorieIndex !== -1 ? parts[calorieIndex] : ''),
    protein: extractNumber(proteinIndex !== -1 ? parts[proteinIndex] : ''),
    carbs: extractNumber(carbsIndex !== -1 ? parts[carbsIndex] : ''),
    fat: extractNumber(fatIndex !== -1 ? parts[fatIndex] : ''),
    notes: notesIndex !== -1 ? parts[notesIndex] : ''
  });
}

function extractNumber(str) {
  if (!str || str === '-' || str === '~') return 0;
  const match = str.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

console.log('\n=== 执行解析 ===');
const parsedData = parseMarkdownToData(content);
console.log(`解析出训练记录: ${parsedData.workouts.length} 条`);
console.log(`解析出饮食记录: ${parsedData.diet.length} 条`);

console.log('\n=== 训练记录详情 ===');
parsedData.workouts.forEach((w, i) => {
  console.log(`\n训练 ${i+1}:`);
  console.log(`  日期: ${w.date}`);
  console.log(`  部位: ${w.parts.join(', ')}`);
  console.log(`  组数: ${w.sets}`);
  console.log(`  动作:`);
  w.exercises.forEach(e => {
    console.log(`    - ${e.name}: ${e.weight}kg × ${e.sets.join('/')}`);
  });
});

console.log('\n=== 饮食记录详情 ===');
parsedData.diet.forEach((d, i) => {
  console.log(`\n饮食 ${i+1}:`);
  console.log(`  日期: ${d.date}`);
  console.log(`  热量: ${d.calories} kcal`);
  console.log(`  蛋白质: ${d.protein}g`);
  console.log(`  碳水: ${d.carbs}g`);
  console.log(`  脂肪: ${d.fat}g`);
});