const fs = require('fs');

// 读取 Markdown 文件
const content = fs.readFileSync('健身数据汇总.md', 'utf-8');

console.log('=== 文件内容预览 ===');
console.log(content.substring(0, 500));
console.log('\n=== 行数 ===');
console.log(`总行数: ${content.split('\n').length}`);

// 测试正则匹配
console.log('\n=== 测试训练表匹配 ===');
const workoutMatch = content.match(/## 一、训练历史总览表[\s\S]*?(\|日期.*\|[\s\S]*?)(?=\n---|\n##)/);
console.log(`匹配成功: ${!!workoutMatch}`);
if (workoutMatch) {
  console.log(`匹配内容长度: ${workoutMatch[1].length}`);
  console.log(`匹配内容预览:\n${workoutMatch[1].substring(0, 300)}`);
}

console.log('\n=== 测试日期解析 ===');
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
console.log(`解析 '4/13': ${parseDate('4/13')}`);
console.log(`解析 '4/1': ${parseDate('4/1')}`);
console.log(`解析 '5/6': ${parseDate('5/6')}`);

// 测试表格解析
console.log('\n=== 测试表格解析 ===');
function parseTable(tableContent, hasHeader = true) {
  const rows = tableContent.split('\n').filter(row => row.trim() && row.startsWith('|'));
  console.log(`表格行数: ${rows.length}`);
  if (rows.length > 0) {
    console.log(`表头: ${rows[0]}`);
    console.log(`分隔线: ${rows[1]}`);
    if (rows[2]) console.log(`第一行数据: ${rows[2]}`);
  }
  const dataRows = hasHeader ? rows.slice(2) : rows.slice(1);
  console.log(`数据行数: ${dataRows.length}`);
  return dataRows.map(row => row.split('|').map(p => p.trim()).filter(p => p));
}

if (workoutMatch) {
  const tableRows = parseTable(workoutMatch[1]);
  console.log('\n=== 解析结果 ===');
  tableRows.forEach((row, index) => {
    console.log(`行${index}: ${JSON.stringify(row)}`);
  });
}