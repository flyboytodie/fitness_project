const fs = require('fs');

// 读取文件（Buffer方式）
const buffer = fs.readFileSync('健身数据汇总.md');
const content = buffer.toString('utf-8');

console.log('=== 文件内容预览 (UTF-8) ===');
const lines = content.split('\n');
lines.slice(0, 10).forEach((line, i) => {
  console.log(`${i+1}: ${line}`);
});

console.log('\n=== 测试表格匹配 ===');
const workoutPattern = /## 一、训练历史总览表[\s\S]*?(\|日期[\s\S]*?)(?=\n---|\n##)/;
const workoutMatch = content.match(workoutPattern);
console.log(`匹配成功: ${!!workoutMatch}`);
if (workoutMatch) {
  console.log(`匹配内容长度: ${workoutMatch[1].length}`);
  console.log(`匹配内容:`, workoutMatch[1]);
}

console.log('\n=== 测试解析一行数据 ===');
const sampleRow = '| 4/13 | 周一 | 胸+三头 | 19组 | 杠铃卧推60kg×4组(8/5/4/4)、上斜哑铃22.5kg×4组 |';
const parts = sampleRow.split('|').map(p => p.trim()).filter(p => p);
console.log(`解析结果:`, parts);

console.log('\n=== 测试parseMarkdownToData函数逻辑 ===');

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  const match1 = dateStr.match(/^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*$/);
  if (match1) {
    const month = parseInt(match1[1]).toString().padStart(2, '0');
    const day = parseInt(match1[2]).toString().padStart(2, '0');
    return `2026-${month}-${day}`;
  }
  return null;
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
  let currentWorkoutParts = ['综合'];
  let currentWorkoutSets = 0;

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
      currentWorkoutParts = ['综合'];
      currentWorkoutSets = 0;
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
            let existingWorkout = data.workouts.find(w => w.date === dateStr);
            if (!existingWorkout) {
              existingWorkout = {
                date: dateStr,
                parts: currentWorkoutParts,
                exercises: [],
                sets: 0
              };
              data.workouts.push(existingWorkout);
            }

            if (tableHeaders.includes('部位') || tableHeaders.includes('训练部位')) {
              const partIndex = tableHeaders.indexOf('部位') !== -1 ? tableHeaders.indexOf('部位') : tableHeaders.indexOf('训练部位');
              if (parts[partIndex]) {
                existingWorkout.parts = parts[partIndex].split('+').map(p => p.trim());
              }
            }

            if (tableHeaders.includes('总组数')) {
              const setIndex = tableHeaders.indexOf('总组数');
              if (parts[setIndex]) {
                existingWorkout.sets = parseInt(parts[setIndex]) || 0;
              }
            }

            if (tableHeaders.includes('核心动作及重量/次数') || tableHeaders.includes('动作')) {
              const actionIndex = tableHeaders.indexOf('核心动作及重量/次数') !== -1 
                ? tableHeaders.indexOf('核心动作及重量/次数') 
                : tableHeaders.indexOf('动作');
              if (parts[actionIndex]) {
                const actions = parts[actionIndex].split('、');
                actions.forEach(actionStr => {
                  const exerciseData = parseExerciseString(actionStr);
                  if (exerciseData.name) {
                    existingWorkout.exercises.push(exerciseData);
                  }
                });
              }
            }
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

function parseExerciseString(str) {
  const result = {
    name: '',
    weight: 0,
    sets: [],
    totalReps: 0,
    notes: ''
  };

  const match = str.match(/(.+?)(\d+(?:\.\d+)?)\s*kg\s*×\s*(\d+)\s*组(?:\((.+?)\))?/);
  if (match) {
    result.name = match[1].trim();
    result.weight = parseFloat(match[2]);
    const setCount = parseInt(match[3]);
    if (match[4]) {
      result.sets = match[4].split('/').map(n => parseInt(n));
    } else {
      result.sets = Array(setCount).fill(8);
    }
    result.totalReps = result.sets.reduce((sum, n) => sum + n, 0);
  } else {
    result.name = str.trim();
  }

  return result;
}

console.log('\n=== 执行解析 ===');
const parsedData = parseMarkdownToData(content);
console.log(`解析出训练记录: ${parsedData.workouts.length} 条`);

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