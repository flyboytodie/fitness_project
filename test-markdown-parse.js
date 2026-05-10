const fs = require('fs');

// 读取 Markdown 文件（使用正确的编码）
const content = fs.readFileSync('健身数据汇总.md', 'utf-8');

console.log('=== 文件内容预览 (前10行) ===');
const lines = content.split('\n');
lines.slice(0, 10).forEach((line, i) => {
  console.log(`${i+1}: ${line}`);
});

// 测试日期解析
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

console.log('\n=== 日期解析测试 ===');
console.log(`parseDate('4/13'):`, parseDate('4/13'));
console.log(`parseDate('5/7'):`, parseDate('5/7'));

// 测试表格解析
console.log('\n=== 训练历史总览表匹配测试 ===');
const workoutPattern = /## 一、训练历史总览表[\s\S]*?(\|日期[\s\S]*?)(?=\n---|\n##)/;
const workoutMatch = content.match(workoutPattern);
console.log(`匹配成功:`, !!workoutMatch);
if (workoutMatch) {
  console.log(`匹配内容长度:`, workoutMatch[1].length);
  console.log(`匹配内容:\n`, workoutMatch[1]);
}

// 解析表格
function parseTable(tableContent, hasHeader = true) {
  const rows = tableContent.split('\n').filter(row => row.trim() && row.startsWith('|'));
  console.log(`表格总行数:`, rows.length);
  if (rows.length > 0) {
    console.log(`表头:`, rows[0]);
    console.log(`分隔线:`, rows[1]);
  }
  const dataRows = hasHeader ? rows.slice(2) : rows.slice(1);
  console.log(`数据行数:`, dataRows.length);
  
  const parsedRows = [];
  dataRows.forEach(row => {
    const parts = row.split('|').map(p => p.trim()).filter(p => p);
    parsedRows.push(parts);
    console.log(`解析行:`, parts);
  });
  return parsedRows;
}

if (workoutMatch) {
  console.log('\n=== 解析训练表格 ===');
  const tableRows = parseTable(workoutMatch[1]);
  console.log(`\n解析出 ${tableRows.length} 行数据`);
}

// 测试胸部动作表格
console.log('\n=== 胸部动作表格匹配测试 ===');
const chestPattern = /### 2\.1 胸部[\s\S]*?(?=\n### |\n---|\n##)/;
const chestMatch = content.match(chestPattern);
console.log(`胸部章节匹配成功:`, !!chestMatch);
if (chestMatch) {
  console.log(`章节长度:`, chestMatch[0].length);
  console.log(`章节预览:\n`, chestMatch[0].substring(0, 500));
}