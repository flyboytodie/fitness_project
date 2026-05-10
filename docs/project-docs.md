# 健身记录应用 - 项目构建文档

## 一、项目概述

### 1.1 项目简介

本项目是一个基于原生 JavaScript 开发的健身记录单页应用（SPA），旨在帮助用户记录和管理个人健身数据，包括训练记录、饮食记录和身体数据追踪。

### 1.2 功能特性

| 功能模块 | 描述 |
|----------|------|
| **训练记录** | 记录每次训练的动作、重量、次数等信息 |
| **饮食记录** | 记录每日饮食摄入，支持热量统计 |
| **身体数据** | 记录体重、身体维度等指标变化 |
| **数据分析** | 展示训练和饮食的统计图表 |
| **个人设置** | 管理个人信息和应用配置 |
| **问题跟踪** | 记录和管理健身过程中遇到的问题 |

### 1.3 技术栈

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
│       ├── app.js            # 主应用模块
│       ├── workout.js        # 训练记录模块
│       ├── diet.js           # 饮食记录模块
│       ├── body.js           # 身体数据模块
│       ├── settings.js       # 设置模块
│       ├── storage.js        # 数据存储模块
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
| `app.js` | 主应用入口和导航逻辑 | 核心 |
| `workout.js` | 训练记录增删改查 | 核心 |
| `diet.js` | 饮食记录增删改查 | 核心 |
| `body.js` | 身体数据增删改查 | 核心 |
| `settings.js` | 设置页面和配置管理 | 核心 |
| `storage.js` | LocalStorage 封装 | 工具 |
| `utils.js` | 通用工具函数 | 工具 |
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

#### 3.1.3 数据结构

**训练记录（Workout）:**
```javascript
{
  date: "2024-01-15",           // 训练日期
  parts: ["胸", "肩"],           // 训练部位
  exercises: [                   // 动作列表
    {
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

---

### 3.2 工具函数模块（utils.js）

#### 3.2.1 核心方法

| 方法名 | 描述 |
|--------|------|
| `getWeekStart(date)` | 获取本周周一日期 |
| `formatDate(dateStr)` | 将 ISO 日期字符串格式化为友好显示 |
| `showToast(message, actionText, actionCallback, duration)` | 显示 Toast 通知 |
| `showConfirm(icon, title, message, onConfirm, onCancel)` | 显示确认对话框 |
| `showModal(content, closeOnOverlayClick)` | 显示模态框 |
| `closeModal()` | 关闭模态框 |
| `generateId()` | 生成唯一ID |
| `debounce(fn, delay)` | 防抖函数 |
| `throttle(fn, interval)` | 节流函数 |
| `calculateBMI(weight, height)` | 计算BMI指数 |
| `getBMICategory(bmi)` | 获取BMI分类 |
| `calculateTDEE(data)` | 计算每日总能量消耗 |
| `downloadFile(content, filename, mimeType)` | 下载文件 |

#### 3.2.2 Toast 通知设计

Toast 组件支持：
- 自动消失（默认5秒）
- 可操作按钮（如撤销操作）
- 平滑动画过渡

---

### 3.3 页面路由机制

#### 3.3.1 路由配置

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
| `settings` | 设置 | `SettingsModule.renderSettingsPage()` |

#### 3.3.2 路由实现

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

## 四、页面交互设计

### 4.1 通用交互模式

#### 4.1.1 导航交互

- **底部导航栏**: 固定在页面底部，包含首页、训练、饮食、身体数据、设置五个入口
- **导航切换**: 点击导航项切换页面，当前页面高亮显示
- **返回按钮**: 在编辑页面左上角显示返回箭头

#### 4.1.2 表单交互

- **提交方式**: 支持点击按钮提交
- **表单验证**: 必填字段验证，数字范围验证
- **错误提示**: 使用 Toast 显示错误信息

#### 4.1.3 列表交互

- **点击查看详情**: 点击列表项展开详情面板
- **分页加载**: 最多显示最近10条记录

### 4.2 训练记录页面交互

#### 4.2.1 添加训练流程

1. 点击"记录训练"按钮 → 打开编辑页面
2. 选择训练部位（多选标签）
3. 从动作库选择动作或手动输入
4. 填写重量和次数
5. 点击"保存"按钮 → 验证并保存

#### 4.2.2 编辑训练流程

1. 点击训练记录的"编辑"按钮 → 传递日期参数
2. 页面加载时根据日期获取训练数据
3. 预填充表单字段
4. 修改后点击"保存" → 更新记录

#### 4.2.3 删除训练流程

1. 点击训练记录的"删除"按钮
2. 弹出确认对话框
3. 确认删除 → 删除记录并显示可撤销 Toast
4. 点击"撤销" → 恢复记录

### 4.3 饮食记录页面交互

#### 4.3.1 记录饮食流程

1. 点击"记录饮食"按钮 → 打开模态框
2. 输入热量、蛋白质、碳水、脂肪
3. 点击"保存" → 添加到当日记录
4. 显示热量进度条（相对于每日目标）

#### 4.3.2 进度条显示

- **满度显示**: 根据热量百分比显示颜色
- **可配置**: 在设置页面可开启/关闭进度条显示

### 4.4 设置页面交互

#### 4.4.1 个人信息设置

1. 填写身高、年龄、性别、活动水平
2. 点击"保存个人信息" → 验证并保存
3. 自动计算每日热量目标（TDEE）

#### 4.4.2 显示设置

- **饮食进度条开关**: 控制饮食记录列表中是否显示进度条
- **开关状态**: 使用 Toggle 组件，点击切换状态

#### 4.4.3 数据管理

- **导出数据**: 将所有数据导出为 JSON 文件
- **导入数据**: 从 JSON 文件导入数据

---

## 五、状态管理

### 5.1 全局状态

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

### 5.2 状态初始化

页面加载时调用 `Storage.init()` 和数据获取方法初始化状态：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initAppData();
  setupNavigation();
  navigateTo('home');
});
```

### 5.3 状态更新流程

```
用户操作 → 业务模块处理 → 更新 appData → 保存到 LocalStorage → 重新渲染页面
```

---

## 六、视觉设计规范

### 6.1 颜色方案

| 颜色 | 用途 | CSS 变量 |
|------|------|----------|
| `#F8FAFC` | 背景色 | `--bg` |
| `#FFFFFF` | 卡片背景 | `--surface` |
| `#2563EB` | 主色调/强调色 | `--primary` |
| `#10B981` | 成功/完成色 | `--secondary` |
| `#EF4444` | 危险/删除色 | `--danger` |
| `#1E293B` | 主文字 | `--text` |
| `#64748B` | 次要文字 | `--text-muted` |
| `#E2E8F0` | 边框/分割线 | `--border` |

### 6.2 组件样式

#### 6.2.1 卡片组件

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

#### 6.2.2 按钮组件

| 类型 | 样式 | 用途 |
|------|------|------|
| `btn-primary` | 主色调背景 | 主要操作按钮 |
| `btn-secondary` | 灰色背景 | 次要操作按钮 |
| `btn-danger` | 红色背景 | 删除/危险操作 |
| `btn-sm` | 小号尺寸 | 列表内操作 |

#### 6.2.3 输入组件

```css
.input-group {
  margin-bottom: 12px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 16px;
}
```

---

## 七、开发与构建

### 7.1 开发环境

#### 7.1.1 启动开发服务器

```bash
node server.js
```

服务器默认运行在 `http://localhost:8094`

#### 7.1.2 文件监听

开发服务器支持自动刷新，修改文件后页面会自动更新。

### 7.2 代码规范

#### 7.2.1 JavaScript 规范

- 使用 ES6+ 语法
- 模块使用对象字面量封装
- 使用 `const`/`let` 替代 `var`
- 函数名使用驼峰命名
- 常量使用大写蛇形命名

#### 7.2.2 CSS 规范

- 使用 CSS 变量管理颜色
- 使用 BEM 命名规范
- 响应式设计优先

### 7.3 部署

#### 7.3.1 静态文件部署

项目是纯静态文件，可以直接部署到任何静态文件服务器：

1. 将 `www` 目录下的所有文件上传到服务器
2. 配置服务器根目录指向 `www`

#### 7.3.2 支持的服务器

- Nginx
- Apache
- GitHub Pages
- Netlify
- Vercel

---

## 八、数据迁移

### 8.1 数据导出

在设置页面点击"导出数据"按钮，自动下载 JSON 文件：

```javascript
const data = Storage.exportAllData();
Utils.downloadFile(JSON.stringify(data, null, 2), 'fitness_data.json', 'application/json');
```

### 8.2 数据导入

在设置页面点击"导入数据"按钮，选择 JSON 文件：

```javascript
function importData(jsonData) {
  const data = JSON.parse(jsonData);
  Storage.importAllData(data);
  // 重新初始化应用数据
  initAppData();
  Utils.showToast('数据导入成功');
  navigateTo('home');
}
```

---

## 九、常见问题

### 9.1 数据丢失

**问题**: 清除浏览器缓存后数据消失

**原因**: 数据存储在 LocalStorage，清除缓存会删除数据

**解决方案**: 
- 定期导出数据备份
- 考虑添加云同步功能（需要后端支持）

### 9.2 页面空白

**问题**: 页面加载后显示空白

**原因**: JavaScript 错误或数据格式错误

**解决方案**: 
- 打开浏览器开发者工具查看控制台错误
- 检查 `appData` 是否正确初始化

### 9.3 日期格式错误

**问题**: 日期显示为 `Invalid Date`

**原因**: 日期字符串格式不正确

**解决方案**: 
- 确保日期使用 ISO 格式（`YYYY-MM-DD`）
- 使用 `Utils.formatDate()` 格式化日期

### 9.4 Markdown 导入显示 0 条数据

**问题**: 导入 Markdown 文件后显示"导入成功！训练: 0条，饮食: 0条，身体: 0条"

**原因**: 
1. 文件编码问题：Windows 中文文件默认使用 GBK 编码，在浏览器中读取时会变成乱码
2. 解析器依赖中文正则匹配，无法识别乱码后的文本

**解决方案**: 
- 在 `settings.js` 中添加 `fixGBKEncoding()` 函数检测并修复 GBK 编码问题
- 修改 `parseMarkdownToData()` 函数，通过检测乱码特征（如 `鍋ヨ韩`、`佽`）来识别章节
- 智能判断表格类型，根据列数和内容自动判断是训练表还是饮食表

**代码位置**: `www/js/settings.js:406-507`（GBK编码修复）、`www/js/settings.js:512-634`（Markdown解析）

### 9.5 模态框显示透明/不可见

**问题**: 点击按钮后弹出的模态框背景透明，无法看清内容

**原因**: 
- `Utils.showModal()` 和 `Utils.showConfirm()` 函数创建的模态框没有添加 `active` 类
- CSS 中 `.modal-overlay` 默认是隐藏的（`display: none`），只有 `.modal-overlay.active` 才会显示

**解决方案**: 
- 在创建模态框时添加 `active` 类：`overlay.className = 'modal-overlay active'`
- 确保模态框内容使用 `.modal` 类而不是 `.modal-content`

**代码位置**: `www/js/utils.js:77-96`（showConfirm）、`www/js/utils.js:118-145`（showModal）

### 9.6 按钮功能不生效

**问题**: 设置页面的按钮点击后没有反应

**原因**: 
- 按钮的 `onclick` 事件绑定的函数不存在或命名错误
- 函数作用域问题，全局变量未正确导出

**解决方案**: 
- 确保所有函数都定义在 `SettingsModule` 对象中
- 使用 `window.SettingsModule = SettingsModule` 将模块导出到全局
- 检查函数名称拼写是否正确

**代码位置**: `www/js/settings.js`（模块定义和导出）

### 9.7 数据清除功能实现

**问题**: 需要实现清除数据功能

**解决方案**: 
- 在设置页面添加清除数据区域，包含清除全部、训练、饮食、身体四个按钮
- 每个按钮点击后显示确认对话框（使用 `Utils.showConfirm()`）
- 确认后调用对应的清除函数：`clearAllData()`、`clearWorkouts()`、`clearDiet()`、`clearBody()`
- 清除后刷新应用数据并跳转对应页面

**代码位置**: `www/js/settings.js:101-118`（UI）、`www/js/settings.js:1098-1155`（功能实现）

---

## 十、调试指南

### 10.1 常用调试方法

#### 10.1.1 浏览器控制台调试

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
```

#### 10.1.2 数据导入调试

如果导入数据显示 0 条，请按以下步骤排查：

1. **检查文件编码**：
   ```javascript
   // 在 importData 函数中添加调试
   console.log('文件内容预览:', content.substring(0, 100));
   ```

2. **检查解析结果**：
   ```javascript
   // 在 parseMarkdownToData 函数中添加调试
   console.log('解析结果:', data);
   ```

3. **检查日期解析**：
   ```javascript
   // 测试日期解析
   console.log(SettingsModule.parseDate('4/13')); // 应输出 "2026-04-13"
   ```

#### 10.1.3 清除浏览器缓存

如果页面显示异常，可以尝试：
1. 清除浏览器缓存（Ctrl+Shift+Del）
2. 强制刷新页面（Ctrl+Shift+R）
3. 检查 JavaScript 控制台是否有错误

---

## 十一、扩展建议

### 10.1 功能扩展

- [ ] 添加社交分享功能
- [ ] 实现训练计划模板
- [ ] 添加运动视频教程
- [ ] 集成心率监测设备
- [ ] 添加好友功能

### 11.2 技术升级

- [ ] 迁移到 Vue/React 框架
- [ ] 添加 TypeScript 支持
- [ ] 实现服务端数据同步
- [ ] 添加 PWA 支持

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

**文档版本**: v1.0  
**创建日期**: 2026年  
**适用项目**: 健身记录应用