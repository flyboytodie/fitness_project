# 健身记录应用 - 项目构建文档

## 一、项目概述

### 1.1 项目简介

本项目是一个基于原生 JavaScript 开发的健身记录单页应用（SPA），旨在帮助用户记录和管理个人健身数据，包括训练记录、饮食记录和身体数据追踪。

### 1.2 实现功能汇总

以下是已实现的核心功能和修复的问题：

| 序号 | 功能/修复 | 状态 | 说明 |
|------|-----------|------|------|
| 1 | 代码架构重构 | ✅ | 将 `index.html` 内联 CSS/JS 拆分为独立模块文件 |
| 2 | 数据导入模板 | ✅ | 支持 CSV/Markdown 格式导入，提供模板说明 |
| 3 | GBK编码修复 | ✅ | 修复中文文件导入显示0条数据问题 |
| 4 | 模态框背景修复 | ✅ | 修复模态框透明无法看清问题 |
| 5 | 数据清除功能 | ✅ | 支持全部清除和单独清除（训练/饮食/身体） |
| 6 | 重复动作删除修复 | ✅ | 为动作生成唯一ID，修复删除冲突 |
| 7 | 动作列表折叠 | ✅ | 支持展开/收起动作列表 |
| 8 | 动作选中高亮 | ✅ | 选中动作显示蓝色高亮 |
| 9 | 训练模板增强 | ✅ | 支持从历史训练创建模板 |
| 10 | 身体数据编辑 | ✅ | 支持手动编辑各项身体指标 |
| 11 | Toast位置优化 | ✅ | 从底部移到顶部，确保可见 |
| 12 | 首页逻辑修复 | ✅ | 修复无训练数据时显示"继续上次训练"问题 |
| 13 | 动作删除修复 | ✅ | 修复编辑训练记录时无法删除动作 |
| 14 | 动作排序功能 | ✅ | 支持上下移动调整动作顺序 |
| 15 | PR追踪系统 | ✅ | 自动检测重量/次数/总量突破，记录突破类型 |
| 16 | 个人纪录页面 | ✅ | 独立页面展示各动作PR详情及突破类型 |
| 17 | 数据统计增强 | ✅ | 添加训练量趋势图、部位分布饼图 |
| 18 | 数据导入去重 | ✅ | 训练/饮食/身体数据导入时自动去重 |
| 19 | 删除后PR重算 | ✅ | 删除训练记录后自动重新计算PR |
| 20 | 空状态处理 | ✅ | 各统计页面无数据时显示友好提示 |
| 21 | 动作库管理 | ✅ | 支持动作的增删改查、按部位筛选、搜索功能 |
| 22 | 动作部位映射 | ✅ | 将训练记录中的复合部位映射到动作实际部位 |
| 23 | 数据导出增强 | ✅ | 支持导出动作库、统一导入导出格式 |
| 24 | 清除动作库 | ✅ | 支持单独清除动作库，清除全部数据包含动作库 |

### 1.3 功能特性

| 功能模块 | 描述 |
|----------|------|
| **训练记录** | 记录每次训练的动作、重量、次数等信息，支持模板和排序 |
| **饮食记录** | 记录每日饮食摄入，支持热量统计和进度显示 |
| **身体数据** | 记录体重、身体维度等指标变化，支持手动编辑 |
| **数据分析** | 展示训练和饮食的统计图表，包括趋势图和饼图 |
| **个人纪录** | 自动追踪各动作的最佳成绩，显示突破类型 |
| **个人设置** | 管理个人信息和应用配置，支持数据导入导出 |
| **问题跟踪** | 记录和管理健身过程中遇到的问题 |

### 1.4 技术栈

- **前端框架**: 原生 JavaScript ES6+
- **样式**: CSS3 (Flexbox/Grid 布局)
- **数据存储**: LocalStorage
- **图表**: Chart.js
- **图标**: Emoji 图标

---

## 二、项目结构

### 2.1 目录结构

```
fitness_project/
├── www/                      # 前端静态资源
│   ├── index.html            # 主入口页面
│   ├── css/
│   │   └── styles.css        # 全局样式
│   └── js/
│       ├── app.js            # 主应用模块（路由、页面渲染）
│       ├── workout.js        # 训练记录模块（CRUD、PR检测）
│       ├── diet.js           # 饮食记录模块（CRUD）
│       ├── body.js           # 身体数据模块（CRUD、编辑模式）
│       ├── settings.js       # 设置模块（导入导出、去重）
│       ├── storage.js        # 数据存储模块（LocalStorage封装）
│       ├── utils.js          # 工具函数模块
│       └── problem-tracker.js # 问题跟踪模块
├── server.js                 # 开发服务器
└── docs/
    └── project-docs.md       # 项目文档（本文件）
```

### 2.2 核心文件说明

| 文件 | 职责 | 状态 |
|------|------|------|
| `index.html` | 页面骨架和模块加载 | 核心 |
| `styles.css` | 全局样式和组件样式 | 核心 |
| `app.js` | 主应用入口、路由管理、页面渲染 | 核心 |
| `workout.js` | 训练记录增删改查、PR检测、动作排序 | 核心 |
| `diet.js` | 饮食记录增删改查 | 核心 |
| `body.js` | 身体数据增删改查、编辑模式 | 核心 |
| `settings.js` | 设置页面、数据导入导出、去重逻辑 | 核心 |
| `storage.js` | LocalStorage 封装、PR存储与更新 | 工具 |
| `utils.js` | 通用工具函数（Toast、Modal、计算函数） | 工具 |
| `problem-tracker.js` | 问题跟踪系统 | 扩展 |

---

## 三、核心模块设计

### 3.1 数据存储模块（storage.js）

#### 3.1.1 设计目的

封装 LocalStorage 操作，提供统一的数据持久化接口，简化各业务模块的数据读写操作。

#### 3.1.2 核心方法

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `init()` | 无 | void | 初始化数据（动作库和设置） |
| `getWorkouts()` | 无 | Array | 获取所有训练记录 |
| `addWorkout(workout)` | workout: Object | Array | 添加训练记录 |
| `updateWorkout(date, workout)` | date: String, workout: Object | Array | 更新训练记录 |
| `deleteWorkout(date)` | date: String | Array | 删除训练记录 |
| `getDiet()` | 无 | Array | 获取所有饮食记录 |
| `addDiet(diet)` | diet: Object | Array | 添加饮食记录 |
| `updateDiet(date, diet)` | date: String, diet: Object | Array | 更新饮食记录 |
| `deleteDiet(date)` | date: String | Array | 删除饮食记录 |
| `getBody()` | 无 | Array | 获取所有身体数据 |
| `addBody(body)` | body: Object | Array | 添加身体数据 |
| `updateBody(date, body)` | date: String, body: Object | Array | 更新身体数据 |
| `deleteBody(date)` | date: String | Array | 删除身体数据 |
| `getSettings()` | 无 | Object | 获取应用设置 |
| `saveSettings(settings)` | settings: Object | void | 保存应用设置 |
| `updateSettings(updates)` | updates: Object | Object | 更新部分设置 |
| `saveAll(data)` | data: Object | void | 批量保存所有数据 |
| `exportAllData()` | 无 | Object | 导出所有数据 |
| `importAllData(data)` | data: Object | void | 导入数据 |
| `getPRs()` | 无 | Object | 获取个人纪录数据 |
| `savePRs(prs)` | prs: Object | void | 保存个人纪录数据 |
| `updatePR(name, prData)` | name: String, prData: Object | Object | 更新单个动作PR |

#### 3.1.3 数据结构

**训练记录（Workout）:**
```javascript
{
  date: "2024-01-15",           // 训练日期
  parts: ["胸", "肩"],           // 训练部位
  exercises: [                   // 动作列表
    {
      id: "ex-1234567890-abc",  // 动作唯一ID
      name: "卧推",              // 动作名称
      weight: 55,                // 重量（kg）
      sets: [8, 8, 8],           // 每组次数
      totalReps: 24,             // 总次数
      notes: "最佳表现"          // 备注
    }
  ],
  sets: 3                        // 总组数
}
```

**饮食记录（Diet）:**
```javascript
{
  date: "2024-01-15",           // 日期
  calories: 2500,                // 总热量（kcal）
  protein: 150,                 // 蛋白质（g）
  carbs: 200,                   // 碳水化合物（g）
  fat: 80,                      // 脂肪（g）
  notes: "健身日"               // 备注
}
```

**身体数据（Body）:**
```javascript
{
  date: "2024-01-15",           // 日期
  weight: 75.5,                  // 体重（kg）
  chest: 100,                    // 胸围（cm）
  waist: 85,                     // 腰围（cm）
  hips: 105,                     // 臀围（cm）
  arm: 35,                       // 上臂围（cm）
  leg: 55                        // 大腿围（cm）
}
```

**应用设置（Settings）:**
```javascript
{
  height: 180,                   // 身高（cm）
  age: 30,                       // 年龄
  gender: "male",                // 性别（male/female）
  activityLevel: 1.55,           // 活动水平系数
  calorieGoal: 2500,             // 每日热量目标
  showDietProgressBar: true      // 是否显示饮食进度条
}
```

**个人纪录（PR）:**
```javascript
{
  "杠铃卧推": {
    weight: 80,                  // 重量（kg）
    reps: 10,                    // 次数
    date: "2026-05-10",          // 日期
    type: "weight"               // 突破类型（weight/reps/volume/first）
  }
}
```

---

### 3.2 PR（个人纪录）系统

#### 3.2.1 突破类型

| 类型 | 图标 | 说明 | 判断条件 |
|------|------|------|----------|
| `weight` | 💪 | 重量突破 | 新重量 > 历史最高重量 |
| `reps` | 🔢 | 次数突破 | 相同重量下，新次数 > 历史最高次数 |
| `volume` | 📈 | 总量突破 | 重量×次数 > 历史最高总量 |
| `first` | 🎯 | 首项纪录 | 首次完成该动作 |

#### 3.2.2 PR更新逻辑

```javascript
// 更新单个动作的PR
updatePR(exerciseName, prData) {
  // 1. 检查是否存在现有PR
  // 2. 若无现有PR，创建新纪录（type: 'first'）
  // 3. 若有现有PR，按优先级判断突破类型：
  //    - 优先级1：重量突破
  //    - 优先级2：次数突破（相同重量）
  //    - 优先级3：总量突破
  // 4. 返回 { isNewPR, breakType }
}
```

### 3.3 数据导入去重机制

#### 3.3.1 去重规则

| 数据类型 | 去重键 | 说明 |
|----------|--------|------|
| 训练记录 | `日期 + 部位组合` | 避免同一天同一部位重复训练 |
| 饮食记录 | `日期` | 避免同一天多条饮食记录 |
| 身体数据 | `日期` | 避免同一天多次测量 |

#### 3.3.2 导入流程

```
导入文件 → 解析数据 → 合并已有数据 → 去重处理 → 保存 → 计算PR
```

### 3.4 删除后PR重新计算

当删除训练记录时，系统会：
1. 检测被删除的动作是否涉及PR记录
2. 如果涉及，重新遍历所有训练记录计算PR
3. 确保PR数据与实际训练记录保持一致

---

### 3.5 工具函数模块（utils.js）

#### 3.5.1 核心方法

| 方法名 | 描述 |
|--------|------|
| `getWeekStart(date)` | 获取本周周一日期 |
| `formatDate(dateStr)` | 将 ISO 日期字符串格式化为友好显示 |
| `showToast(message, actionText, actionCallback, duration)` | 显示 Toast 通知（顶部显示） |
| `showConfirm(icon, title, message, onConfirm, onCancel)` | 显示确认对话框 |
| `showModal(content, closeOnOverlayClick)` | 显示模态框 |
| `closeModal()` | 关闭模态框 |
| `generateId()` | 生成唯一ID |
| `debounce(fn, delay)` | 防抖函数 |
| `throttle(fn, interval)` | 节流函数 |
| `calculateBMI(weight, height)` | 计算BMI指数 |
| `getBMICategory(bmi)` | 获取BMI分类 |
| `calculateTDEE(data)` | 计算每日总能量消耗 |
| `calculateBMR(data)` | 计算基础代谢率（Mifflin-St Jeor公式） |
| `downloadFile(content, filename, mimeType)` | 下载文件 |

---

## 四、页面路由机制

### 4.1 路由配置

在 `app.js` 中定义了以下路由：

| 路由路径 | 页面名称 | 渲染函数 |
|----------|----------|----------|
| `home` | 首页 | `renderHomePage()` |
| `workout` | 训练记录 | `WorkoutModule.renderWorkoutPage()` |
| `workout-add` | 添加训练 | `WorkoutModule.renderWorkoutEditPage()` |
| `workout-edit` | 编辑训练 | `WorkoutModule.renderWorkoutEditPage()` |
| `diet` | 饮食记录 | `DietModule.renderDietPage()` |
| `body` | 身体数据 | `BodyModule.renderBodyPage()` |
| `stats` | 数据分析 | `renderStatsPage()` |
| `pr` | 个人纪录 | `renderPRPage()` |
| `settings` | 设置 | `SettingsModule.renderSettingsPage()` |

### 4.2 路由实现

```javascript
function navigateTo(page, params = {}) {
  // 更新导航高亮
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  
  // 保存参数（用于编辑页面）
  window.currentParams = params;
  
  // 更新页面标题
  const title = titles[page] || '训练记录';
  document.getElementById('pageTitle').textContent = title;
  
  // 显示/隐藏底部导航
  const nav = document.querySelector('.bottom-nav');
  if (page === 'workout-add' || page === 'workout-edit') {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'flex';
  }
  
  // 更新当前页面状态
  window.currentPage = page;
  
  // 渲染页面内容
  renderPage(page);
}
```

---

## 五、页面交互设计

### 5.1 通用交互模式

#### 5.1.1 导航交互

- **底部导航栏**: 固定在页面底部，包含首页、训练、饮食、身体数据、纪录、设置六个入口
- **导航切换**: 点击导航项切换页面，当前页面高亮显示
- **返回按钮**: 在编辑页面左上角显示返回箭头

#### 5.1.2 表单交互

- **提交方式**: 支持点击按钮提交
- **表单验证**: 必填字段验证，数字范围验证
- **错误提示**: 使用 Toast 显示错误信息（顶部显示，确保可见）

#### 5.1.3 列表交互

- **点击查看详情**: 点击列表项展开详情面板
- **分页加载**: 最多显示最近10条记录

### 5.2 训练记录页面交互

#### 5.2.1 添加训练流程

1. 点击"记录训练"按钮 → 打开编辑页面
2. 选择训练部位（多选标签）
3. 从动作库选择动作或手动输入（支持折叠/展开）
4. 填写重量和次数（支持上下排序）
5. 点击"保存"按钮 → 验证、保存、检测PR

#### 5.2.2 编辑训练流程

1. 点击训练记录的"编辑"按钮 → 传递日期参数
2. 页面加载时根据日期获取训练数据
3. 预填充表单字段
4. 修改后点击"保存" → 更新记录、重新检测PR

#### 5.2.3 删除训练流程

1. 点击训练记录的"删除"按钮
2. 弹出确认对话框
3. 确认删除 → 删除记录、重新计算PR、显示可撤销 Toast
4. 点击"撤销" → 恢复记录、重新计算PR

### 5.3 个人纪录页面交互

- **按肌群分组展示**: 胸部、背部、肩部、腿部、手臂、有氧
- **突破类型标签**: 显示每个PR的突破类型（颜色区分）
- **空状态引导**: 无记录时显示友好提示和开始训练按钮

### 5.4 设置页面交互

#### 5.4.1 数据导入流程

1. 点击"导入数据"按钮
2. 选择文件（支持 JSON 和 Markdown 格式）
3. 自动检测并修复 GBK 编码
4. 解析数据并去重
5. 保存数据并计算PR
6. 显示导入结果（包含各类型突破统计）

---

## 六、状态管理

### 6.1 全局状态

应用使用 `window.appData` 对象管理全局状态：

```javascript
window.appData = {
  workouts: [],           // 训练记录数组
  diet: [],               // 饮食记录数组
  body: [],               // 身体数据数组
  settings: {},           // 应用设置
  exerciseLibrary: [],    // 动作库
  starredExercises: [],   // 收藏的动作
  templates: [],          // 训练模板
  lastWorkout: null       // 最近一次训练
};
```

### 6.2 状态初始化

页面加载时调用 `Storage.init()` 和数据获取方法初始化状态：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initAppData();
  setupNavigation();
  navigateTo('home');
});
```

### 6.3 状态更新流程

```
用户操作 → 业务模块处理 → 更新 appData → 保存到 LocalStorage → 重新渲染页面
```

### 6.4 数据一致性保障

| 操作 | 数据一致性处理 |
|------|----------------|
| 导入数据 | 自动去重、计算PR |
| 添加训练 | 检测PR突破 |
| 更新训练 | 重新检测PR |
| 删除训练 | 重新计算PR |
| 撤销删除 | 重新计算PR |

---

## 七、视觉设计规范

### 7.1 颜色方案

| 颜色 | 用途 | CSS 变量 |
|------|------|----------|
| `#F8FAFC` | 背景色 | `--bg` |
| `#FFFFFF` | 卡片背景 | `--surface` |
| `#2563EB` | 主色调/强调色 | `--primary` |
| `#10B981` | 成功/完成色 | `--secondary` |
| `#EF4444` | 危险/删除色 | `--danger` |
| `#F59E0B` | PR/警告色 | `--warning` |
| `#1E293B` | 主文字 | `--text` |
| `#64748B` | 次要文字 | `--text-muted` |
| `#E2E8F0` | 边框/分割线 | `--border` |

### 7.2 突破类型颜色

| 类型 | 颜色 | 用途 |
|------|------|------|
| `#EF4444` | 红色 | 重量突破 |
| `#3B82F6` | 蓝色 | 次数突破 |
| `#10B981` | 绿色 | 总量突破 |
| `#8B5CF6` | 紫色 | 首项纪录 |

### 7.3 组件样式

#### 7.3.1 卡片组件

```css
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border);
}
```

#### 7.3.2 按钮组件

| 类型 | 样式 | 用途 |
|------|------|------|
| `btn-primary` | 主色调背景 | 主要操作按钮 |
| `btn-secondary` | 灰色背景 | 次要操作按钮 |
| `btn-danger` | 红色背景 | 删除/危险操作 |
| `btn-sm` | 小号尺寸 | 列表内操作 |

#### 7.3.3 Toast 组件

- **位置**: 页面顶部（`top: 100px`）
- **层级**: 最高层级（`z-index: 1000`）
- **动画**: 从上方滑入
- **自动消失**: 默认5秒

---

## 八、开发与构建

### 8.1 开发环境

#### 8.1.1 启动开发服务器

```bash
node server.js
```

服务器默认运行在 `http://localhost:8094`，支持环境变量配置端口：

```bash
# Windows (CMD)
set PORT=3000
node server.js

# Windows (PowerShell)
$env:PORT=3000; node server.js

# Linux/Mac
PORT=3000 node server.js
```

#### 8.1.2 文件监听

开发服务器支持自动刷新，修改文件后页面会自动更新。

### 8.2 代码规范

#### 8.2.1 JavaScript 规范

- 使用 ES6+ 语法
- 模块使用对象字面量封装
- 使用 `const`/`let` 替代 `var`
- 函数名使用驼峰命名
- 常量使用大写蛇形命名

#### 8.2.2 CSS 规范

- 使用 CSS 变量管理颜色
- 使用 BEM 命名规范
- 响应式设计优先

### 8.3 部署

#### 8.3.1 静态文件部署

项目是纯静态文件，可以直接部署到任何静态文件服务器：

1. 将 `www` 目录下的所有文件上传到服务器
2. 配置服务器根目录指向 `www`

#### 8.3.2 支持的服务器

- Nginx
- Apache
- GitHub Pages
- Netlify
- Vercel

---

## 九、数据迁移

### 9.1 数据导出

在设置页面点击"导出数据"按钮，支持三种格式：

1. **JSON 格式**：完整数据，可用于导入恢复
2. **CSV 格式**：表格格式，适合 Excel 打开
3. **Markdown 格式**：文档格式，适合分享备份

```javascript
const data = Storage.exportAllData();
Utils.downloadFile(JSON.stringify(data, null, 2), 'fitness_data.json', 'application/json');
```

### 9.2 数据导入

在设置页面点击"导入数据"按钮，选择 JSON 或 Markdown 文件：

```javascript
function importData(content, fileName) {
  let data;
  if (fileName.endsWith('.md')) {
    content = fixGBKEncoding(content);  // 修复GBK编码
    data = parseMarkdownToData(content);
  } else {
    data = JSON.parse(content);
  }
  
  // 去重合并
  if (data.workouts) {
    const merged = [...appData.workouts, ...data.workouts];
    const deduplicated = deduplicateWorkouts(merged);
    appData.workouts = deduplicated;
    Storage.saveWorkouts(appData.workouts);
    calculatePRsForImportedWorkouts(data.workouts);
  }
  
  Utils.showToast(`导入成功！训练: ${data.workouts?.length || 0}条`);
  navigateTo('home');
}
```

### 9.3 导入格式支持

#### JSON 格式
```json
{
  "workouts": [...],
  "diet": [...],
  "body": [...],
  "starredExercises": [...],
  "templates": [...],
  "settings": {...}
}
```

#### Markdown 格式
```markdown
## 📅 训练记录

| 日期 | 训练部位 | 动作名称 | 重量(kg) | 组数 | 次数 | 备注 |
|------|----------|----------|----------|------|------|------|
| 2024-01-15 | 胸+肩 | 杠铃卧推 | 55 | 3 | 8/8/8 | 最佳表现 |

## 🥗 饮食记录

| 日期 | 千卡 | 蛋白质(g) | 碳水(g) | 脂肪(g) | 备注 |
|------|------|-----------|---------|---------|------|
| 2024-01-15 | 2500 | 150 | 200 | 80 | 健身日 |
```

---

## 十、常见问题与解决方案

### 10.1 数据丢失

**问题**: 清除浏览器缓存后数据消失

**原因**: 数据存储在 LocalStorage，清除缓存会删除数据

**解决方案**: 
- 定期导出数据备份
- 考虑添加云同步功能（需要后端支持）

### 10.2 页面空白

**问题**: 页面加载后显示空白

**原因**: JavaScript 错误或数据格式错误

**解决方案**: 
- 打开浏览器开发者工具查看控制台错误
- 检查 `appData` 是否正确初始化

### 10.3 日期格式错误

**问题**: 日期显示为 `Invalid Date`

**原因**: 日期字符串格式不正确

**解决方案**: 
- 确保日期使用 ISO 格式（`YYYY-MM-DD`）
- 使用 `Utils.formatDate()` 格式化日期

### 10.4 Markdown 导入显示 0 条数据

**问题**: 导入 Markdown 文件后显示"导入成功！训练: 0条"

**原因**: 
1. 文件编码问题：Windows 中文文件默认使用 GBK 编码
2. 解析器依赖中文正则匹配，无法识别乱码后的文本

**解决方案**: 
- 系统自动检测并修复 GBK 编码问题
- 通过检测乱码特征来识别章节
- 智能判断表格类型

**代码位置**: `www/js/settings.js:406-507`（GBK编码修复）、`www/js/settings.js:512-634`（Markdown解析）

### 10.5 个人纪录不更新

**问题**: 导入数据后个人纪录页面显示"暂无个人纪录"

**原因**: 导入数据时没有触发 PR 计算逻辑

**解决方案**: 
- 导入完成后自动调用 `calculatePRsForImportedWorkouts()`
- 对新增数据进行 PR 检测

**代码位置**: `www/js/settings.js:1210-1244`（导入后PR计算）

### 10.6 删除训练后PR不准确

**问题**: 删除训练记录后，个人纪录页面仍显示已删除的纪录

**原因**: 删除时没有重新计算 PR

**解决方案**: 
- 删除后调用 `recalculatePRsAfterDeletion()` 重新计算受影响的 PR
- 撤销删除时也重新计算

**代码位置**: `www/js/workout.js:712-747`（删除后PR重算）

### 10.7 导入数据不完整（未解决）

**问题**: 导入 Markdown 文件后，部分日期的数据（如4/13-4/15）没有被正确导入，只显示4/16之后的数据

**原因**: Markdown 表格解析逻辑存在问题，表头行和数据行的判断逻辑不正确，导致部分数据被跳过

**解决方案**: 
- 已尝试修复表格解析逻辑，增加了对表头行和分隔线的正确处理
- 已修复 `extractSetsFromStr` 函数，支持直接斜杠分隔格式（如 `8/5/4/4`）
- **当前状态**: 问题依然存在，需要进一步排查

**代码位置**: `www/js/settings.js:831-858`（表格解析逻辑）、`www/js/settings.js:1302-1324`（次数解析）

### 10.8 清除全部数据时动作库无法清除（已修复）

**问题**: 点击"清除全部数据"后，动作库仍然存在，需要单独点击"动作库"按钮才能清除

**原因**: `Storage.clearAllData()` 内部会调用 `init()`，而 `init()` 会检查动作库是否存在，如果不存在就自动创建默认动作库

**解决方案**: 
- 修改 `Storage.clearAllData()` 方法，移除 `this.init()` 调用
- 确保清除所有数据后不会自动重建动作库

**代码位置**: `www/js/storage.js:440-443`

**修复状态**: ✅ 已修复

---

## 十一、调试指南

### 11.1 常用调试方法

#### 11.1.1 浏览器控制台调试

打开浏览器开发者工具（F12），在控制台输入以下命令：

```javascript
// 查看当前应用数据
console.log(appData);

// 查看训练记录数量
console.log('训练记录:', appData.workouts.length);
console.log('饮食记录:', appData.diet.length);
console.log('身体数据:', appData.body.length);

// 查看 LocalStorage 数据
console.log(localStorage.getItem('fitness_workouts'));
console.log(localStorage.getItem('fitness_prs'));

// 查看当前PR数据
console.log(Storage.getPRs());
```

#### 11.1.2 数据导入调试

如果导入数据显示 0 条，请按以下步骤排查：

1. **检查文件编码**：
   ```javascript
   console.log('文件内容预览:', content.substring(0, 100));
   ```

2. **检查解析结果**：
   ```javascript
   console.log('解析结果:', data);
   ```

3. **检查日期解析**：
   ```javascript
   console.log(SettingsModule.parseDate('4/13')); // 应输出 "2026-04-13"
   ```

#### 11.1.3 清除浏览器缓存

如果页面显示异常，可以尝试：
1. 清除浏览器缓存（Ctrl+Shift+Del）
2. 强制刷新页面（Ctrl+Shift+R）
3. 检查 JavaScript 控制台是否有错误

---

## 十二、扩展建议

### 12.1 功能扩展

- [ ] 添加社交分享功能
- [ ] 实现训练计划模板
- [ ] 添加运动视频教程
- [ ] 集成心率监测设备
- [ ] 添加好友功能
- [ ] 实现训练提醒功能
- [ ] 添加体脂率计算

### 12.2 技术升级

- [ ] 迁移到 Vue/React 框架
- [ ] 添加 TypeScript 支持
- [ ] 实现服务端数据同步（云存储）
- [ ] 添加 PWA 支持（离线使用）
- [ ] 实现数据加密存储

---

## 附录：模块依赖关系

```
index.html
    ├── utils.js         (工具函数)
    ├── storage.js       (数据存储)
    ├── workout.js       (训练模块)
    ├── diet.js          (饮食模块)
    ├── body.js          (身体模块)
    ├── settings.js      (设置模块)
    └── problem-tracker.js (问题跟踪)
    
    依赖关系:
    ├── workout.js ──────► storage.js, utils.js
    ├── diet.js ─────────► storage.js, utils.js
    ├── body.js ─────────► storage.js, utils.js
    ├── settings.js ─────► storage.js, utils.js
    └── problem-tracker.js ► storage.js, utils.js
```

---

**文档版本**: v2.0  
**创建日期**: 2026年5月  
**适用项目**: 健身记录应用