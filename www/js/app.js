/**
 * 主应用模块
 * 包含应用初始化和核心导航逻辑
 */

// 全局状态
window.appData = {};
window.currentPage = 'home';
window.currentParams = {};

/**
 * 初始化应用数据
 */
function initAppData() {
  Storage.init();
  appData = {
    workouts: Storage.getWorkouts(),
    diet: Storage.getDiet(),
    body: Storage.getBody(),
    exerciseLibrary: Storage.getExerciseLibrary(),
    starredExercises: Storage.getStarredExercises(),
    templates: Storage.getTemplates(),
    settings: Storage.getSettings(),
    lastWorkout: Storage.getLastWorkout()
  };
}

/**
 * 设置导航
 */
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

/**
 * 导航到指定页面
 * @param {string} page - 页面名称
 * @param {object} params - 页面参数
 */
function navigateTo(page, params = {}) {
  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // 更新标题
  const titles = {
    home: '首页',
    workout: '训练记录',
    diet: '饮食记录',
    body: '身体数据',
    stats: '数据分析',
    settings: '设置',
    'workout-add': '记录训练',
    'workout-edit': '编辑训练'
  };
  const title = titles[page] || '训练记录';
  document.getElementById('pageTitle').textContent = title;

  // 显示/隐藏底部导航
  const nav = document.querySelector('.bottom-nav');
  if (nav) {
    nav.style.display = (page === 'workout-add' || page === 'workout-edit') ? 'none' : 'flex';
  }

  // 保存当前状态
  window.currentPage = page;
  window.currentParams = params;

  // 渲染页面
  renderPage(page);
}

/**
 * 返回上一页
 */
function goBack() {
  if (window.currentPage === 'workout-add' || window.currentPage === 'workout-edit') {
    navigateTo('workout');
  }
}

/**
 * 渲染页面
 * @param {string} page - 页面名称
 */
function renderPage(page) {
  const app = document.getElementById('app');
  
  switch(page) {
    case 'home':
      app.innerHTML = renderHomePage();
      break;
    case 'workout':
      app.innerHTML = WorkoutModule.renderWorkoutPage();
      break;
    case 'workout-add':
    case 'workout-edit':
      app.innerHTML = WorkoutModule.renderWorkoutEditPage();
      break;
    case 'diet':
      app.innerHTML = DietModule.renderDietPage();
      break;
    case 'body':
      app.innerHTML = BodyModule.renderBodyPage();
      break;
    case 'stats':
      app.innerHTML = renderStatsPage();
      break;
    case 'settings':
      app.innerHTML = SettingsModule.renderSettingsPage();
      break;
    default:
      app.innerHTML = renderHomePage();
  }

  // 绑定页面事件
  bindPageEvents(page);
}

/**
 * 渲染首页
 */
function renderHomePage() {
  const today = new Date().toISOString().split('T')[0];
  const todayWorkout = appData.workouts.find(w => w.date === today);
  const todayDiet = appData.diet.find(d => d.date === today);
  const latestBody = appData.body.length > 0 ? appData.body[appData.body.length - 1] : null;
  
  const weekStart = Utils.getWeekStart(new Date());
  const weekWorkouts = appData.workouts.filter(w => new Date(w.date) >= weekStart);
  const weekSets = weekWorkouts.reduce((sum, w) => sum + w.sets, 0);
  
  const recentProgress = detectRecentProgress();
  
  let quickStartHTML = '';
  if (!todayWorkout && appData.lastWorkout) {
    quickStartHTML = `
      <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div style="font-weight: 600; margin-bottom: 8px;">记录今天训练</div>
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">
          上次: ${appData.lastWorkout.parts.join('+')} · ${appData.lastWorkout.exercises.length}个动作
        </div>
        <div style="font-size: 12px; opacity: 0.75; margin-bottom: 12px;">
          ${Utils.formatDate(appData.lastWorkout.date)}
        </div>
        <button class="btn btn-secondary" style="background: white; color: #667eea; width: 100%;" onclick="continueLastWorkout()">
          开始训练 →
        </button>
      </div>
    `;
  }
  
  return `
    <div class="page active">
      ${quickStartHTML}
      
      <div class="card">
        <div class="card-title">今日状态</div>
        <div class="grid-3">
          <div>
            <div class="card-value">${todayWorkout ? '✓' : '—'}</div>
            <div class="card-unit">训练</div>
          </div>
          <div>
            <div class="card-value">${todayDiet ? todayDiet.calories : '0'}</div>
            <div class="card-unit">千卡</div>
          </div>
          <div>
            <div class="card-value">${latestBody ? latestBody.weight : '—'}</div>
            <div class="card-unit">${latestBody ? 'kg' : '体重'}</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">本周训练</div>
        <div class="grid-3">
          <div>
            <div class="card-value">${weekWorkouts.length}</div>
            <div class="card-unit">次</div>
          </div>
          <div>
            <div class="card-value">${weekSets}</div>
            <div class="card-unit">总组数</div>
          </div>
          <div>
            <div class="card-value">${weekWorkouts.length > 0 ? Math.round(weekSets / weekWorkouts.length) : 0}</div>
            <div class="card-unit">均组数</div>
          </div>
        </div>
      </div>
      
      ${recentProgress.length > 0 ? `
      <div class="card">
        <div class="card-title">最近进步</div>
        ${recentProgress.slice(0, 3).map(p => `
          <div class="history-item" style="cursor:default">
            <div class="history-date">${p.exercise}</div>
            <div class="history-sets">${p.message}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <div class="quick-actions">
        <button class="btn btn-primary" onclick="navigateTo('workout'); setTimeout(() => WorkoutModule.openAddWorkoutModal(), 100)">
          开始训练
        </button>
        <button class="btn btn-secondary" onclick="navigateTo('diet'); setTimeout(() => DietModule.openAddDietModal(), 100)">
          记录饮食
        </button>
        <button class="btn btn-secondary" onclick="showProblemTracker()" style="margin-top: 8px;">
          问题跟踪
        </button>
      </div>
      
      ${appData.workouts.length > 0 ? `
      <div class="card" style="margin-top: 16px;">
        <div class="card-title">最近训练</div>
        ${appData.workouts.slice(-5).reverse().map(w => `
          <div class="history-item" onclick="WorkoutModule.showWorkoutDetail('${w.date}')">
            <div class="history-date">${Utils.formatDate(w.date)}</div>
            <div class="history-parts">${w.parts.join('+')}</div>
            <div class="history-sets">${w.sets}组 · ${w.exercises.length}个动作</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  `;
}

/**
 * 继续上次训练
 */
function continueLastWorkout() {
  if (!appData.lastWorkout) return;
  WorkoutModule.openAddWorkoutModal(appData.lastWorkout);
}

/**
 * 检测最近进步
 */
function detectRecentProgress() {
  const progress = [];
  const workouts = [...appData.workouts].reverse();
  
  const exerciseHistory = {};
  workouts.forEach(w => {
    w.exercises.forEach(e => {
      if (!exerciseHistory[e.name]) {
        exerciseHistory[e.name] = [];
      }
      exerciseHistory[e.name].push({
        date: w.date,
        weight: e.weight,
        totalReps: e.totalReps,
        sets: e.sets.length
      });
    });
  });
  
  Object.entries(exerciseHistory).forEach(([name, history]) => {
    if (history.length >= 2) {
      const latest = history[0];
      const previous = history[1];
      
      if (latest.weight > previous.weight) {
        progress.push({
          exercise: name,
          message: `${previous.weight}kg → ${latest.weight}kg 加重成功！`
        });
      } else if (latest.weight === previous.weight && latest.totalReps > previous.totalReps) {
        progress.push({
          exercise: name,
          message: `${latest.weight}kg: ${previous.totalReps}个 → ${latest.totalReps}个`
        });
      }
    }
  });
  
  return progress.slice(0, 5);
}

/**
 * 渲染数据分析页面
 */
function renderStatsPage() {
  const totalWorkouts = appData.workouts.length;
  const totalSets = appData.workouts.reduce((sum, w) => sum + w.sets, 0);
  const totalExercises = appData.workouts.reduce((sum, w) => sum + w.exercises.length, 0);
  
  const partCount = {};
  appData.workouts.forEach(w => {
    w.parts.forEach(p => {
      partCount[p] = (partCount[p] || 0) + 1;
    });
  });
  
  const progressData = detectAllProgress();
  
  return `
    <div class="page active">
      <div class="card">
        <div class="card-title">训练总览</div>
        <div class="grid-3">
          <div style="text-align: center;">
            <div class="card-value">${totalWorkouts}</div>
            <div class="card-unit">训练次数</div>
          </div>
          <div style="text-align: center;">
            <div class="card-value">${totalSets}</div>
            <div class="card-unit">总组数</div>
          </div>
          <div style="text-align: center;">
            <div class="card-value">${totalExercises}</div>
            <div class="card-unit">动作次数</div>
          </div>
        </div>
      </div>
      
      ${Object.keys(partCount).length > 0 ? `
      <div class="card">
        <div class="card-title">部位训练频次</div>
        <div style="margin-top: 12px;">
          ${Object.entries(partCount).sort((a, b) => b[1] - a[1]).map(([part, count]) => `
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 14px;">
                <span>${part}</span>
                <span style="color: var(--text-muted);">${count}次</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(count / totalWorkouts) * 100}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${appData.diet.length > 0 ? `
      <div class="card">
        <div class="card-title">饮食统计</div>
        <div class="grid-3" style="margin-top: 12px;">
          <div style="text-align: center;">
            <div class="card-value">${Math.round(appData.diet.reduce((s, d) => s + d.calories, 0) / appData.diet.length)}</div>
            <div class="card-unit">日均热量</div>
          </div>
          <div style="text-align: center;">
            <div class="card-value">${Math.round(appData.diet.reduce((s, d) => s + d.protein, 0) / appData.diet.length)}</div>
            <div class="card-unit">日均蛋白</div>
          </div>
          <div style="text-align: center;">
            <div class="card-value">${Math.round(appData.diet.reduce((s, d) => s + d.carbs, 0) / appData.diet.length)}</div>
            <div class="card-unit">日均碳水</div>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="calorieChart"></canvas>
        </div>
      </div>
      ` : ''}
      
      ${progressData.length > 0 ? `
      <div class="card">
        <div class="card-title">进步追踪</div>
        ${progressData.map(p => `
          <div class="exercise-item" style="margin-top: 8px;">
            <div class="exercise-header">
              <span class="exercise-name">${p.exercise}</span>
              <span class="progress-badge ${p.type}">${p.badge}</span>
            </div>
            <div style="font-size: 13px; color: var(--text-muted);">
              ${p.date}: ${p.previous} → ${p.current}
            </div>
            ${p.message ? `<div class="exercise-notes">${p.message}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <div class="card" style="margin-top: 16px;">
        <div class="card-title">收藏的动作</div>
        <div class="tag-group" style="margin-top: 8px;">
          ${appData.starredExercises.length === 0 ? `
            <div style="color: var(--text-muted); font-size: 14px;">训练时点击收藏常用动作</div>
          ` : appData.starredExercises.map(name => `
            <span class="tag starred">⭐ ${name}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 检测所有进步
 */
function detectAllProgress() {
  const progress = [];
  const workouts = [...appData.workouts].reverse();
  
  const exerciseHistory = {};
  workouts.forEach(w => {
    w.exercises.forEach(e => {
      if (!exerciseHistory[e.name]) {
        exerciseHistory[e.name] = [];
      }
      exerciseHistory[e.name].push({
        date: w.date,
        weight: e.weight,
        totalReps: e.totalReps,
        sets: e.sets.length
      });
    });
  });
  
  Object.entries(exerciseHistory).forEach(([name, history]) => {
    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const previous = history[i + 1];
      
      if (current.weight > previous.weight) {
        progress.push({
          exercise: name,
          date: Utils.formatDate(current.date),
          previous: previous.weight + 'kg',
          current: current.weight + 'kg',
          type: 'weight',
          badge: '🔥',
          message: '加重 ' + (current.weight - previous.weight) + 'kg'
        });
      } else if (current.weight === previous.weight && current.totalReps > previous.totalReps) {
        progress.push({
          exercise: name,
          date: Utils.formatDate(current.date),
          previous: previous.totalReps + '次',
          current: current.totalReps + '次',
          type: 'reps',
          badge: '💪',
          message: '多做 ' + (current.totalReps - previous.totalReps) + ' 次'
        });
      }
    }
  });
  
  return progress.slice(0, 10);
}

/**
 * 绑定页面事件
 * @param {string} page - 页面名称
 */
function bindPageEvents(page) {
  setTimeout(() => {
    if (page === 'body') {
      BodyModule.renderWeightChart();
    } else if (page === 'stats') {
      renderCalorieChart();
    }
  }, 100);
}

/**
 * 渲染热量图表
 */
function renderCalorieChart() {
  const canvas = document.getElementById('calorieChart');
  if (!canvas || appData.diet.length < 2) return;
  
  const ctx = canvas.getContext('2d');
  const sorted = [...appData.diet].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
  
  if (window.calorieChartInstance) {
    window.calorieChartInstance.destroy();
  }
  
  window.calorieChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.date.slice(5)),
      datasets: [{
        label: '千卡',
        data: sorted.map(d => d.calories),
        backgroundColor: '#2563EB',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#E2E8F0' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

/**
 * 显示问题跟踪器
 */
function showProblemTracker() {
  const tracker = new ProblemTracker();
  let problemsHtml = '';
  if (tracker.problems.length === 0) {
    problemsHtml = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">暂无问题记录</div>';
  } else {
    problemsHtml = tracker.problems.slice(-5).reverse().map(p => `
      <div class="problem-item">
        <div style="font-weight: 600;">${p.title}</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${p.createdAt.slice(0, 10)}</div>
      </div>
    `).join('');
  }
  
  Utils.showModal(`
    <div class="modal-header">
      <span>问题跟踪</span>
      <button class="modal-close" onclick="Utils.closeModal()">×</button>
    </div>
    <div>
      <button class="btn btn-secondary" style="margin-bottom: 12px; width: 100%;" onclick="showAddProblemModal()">
        + 添加问题记录
      </button>
      <div id="problemList">${problemsHtml}</div>
    </div>
  `);
}

/**
 * 监听DOM加载完成
 */
window.addEventListener('DOMContentLoaded', () => {
  initAppData();
  setupNavigation();
  navigateTo('home');
});

// 导出全局函数
window.navigateTo = navigateTo;
window.goBack = goBack;
