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
    pr: '个人纪录',
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
    case 'pr':
      app.innerHTML = renderPRPage();
      break;
    case 'stats':
      app.innerHTML = renderStatsPage();
      break;
    case 'exercise':
      ExerciseModule.render();
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
 * 计算连续训练天数
 */
function calculateStreak() {
  if (appData.workouts.length === 0) return 0;
  
  const workouts = [...appData.workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  const workoutDates = new Set(workouts.map(w => w.date));
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (workoutDates.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

/**
 * 渲染个人纪录页面
 */
function renderPRPage() {
  const prs = Storage.getPRs();
  const prCount = Object.keys(prs).length;
  
  const prEntries = Object.entries(prs).map(([name, pr]) => ({
    name,
    ...pr,
    volume: pr.weight * pr.reps
  })).sort((a, b) => b.volume - a.volume);
  
  const exerciseLibrary = Storage.getExerciseLibrary();
  
  const categories = {
    chest: { name: '胸部', icon: '💪', color: '#EF4444' },
    back: { name: '背部', icon: '🪨', color: '#10B981' },
    shoulder: { name: '肩部', icon: '🦾', color: '#8B5CF6' },
    legs: { name: '腿部', icon: '🦵', color: '#F59E0B' },
    arms: { name: '手臂', icon: '💪', color: '#EC4899' },
    cardio: { name: '有氧', icon: '🏃', color: '#06B6D4' }
  };

  const getBreakTypeInfo = (type) => {
    switch (type) {
      case 'weight': return { icon: '💪', label: '重量突破', color: '#EF4444' };
      case 'reps': return { icon: '🔢', label: '次数突破', color: '#3B82F6' };
      case 'volume': return { icon: '📈', label: '总量突破', color: '#10B981' };
      case 'first': return { icon: '🎯', label: '首项纪录', color: '#8B5CF6' };
      default: return { icon: '🏆', label: '个人纪录', color: '#F59E0B' };
    }
  };
  
  const groupedPRs = {};
  prEntries.forEach(pr => {
    const exercise = exerciseLibrary.find(e => e.name === pr.name);
    const category = exercise ? exercise.category : 'custom';
    if (!groupedPRs[category]) {
      groupedPRs[category] = [];
    }
    groupedPRs[category].push(pr);
  });
  
  return `
    <div class="page active">
      <div class="card" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white;">
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">🏆 个人纪录总数</div>
        <div style="font-size: 48px; font-weight: 700;">${prCount}</div>
        <div style="font-size: 14px; opacity: 0.9; margin-top: 8px;">继续突破极限！</div>
      </div>
      
      ${prCount === 0 ? `
      <div class="empty-state">
        <div style="font-size: 64px; margin-bottom: 16px;">🎯</div>
        <div style="font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 8px;">暂无个人纪录</div>
        <div style="font-size: 14px;">完成训练后，系统会自动检测并记录您的最佳成绩</div>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="navigateTo('workout')">
          开始训练
        </button>
      </div>
      ` : `
      ${Object.entries(groupedPRs).map(([category, items]) => {
        const catInfo = categories[category] || { name: '其他', icon: '📋', color: '#64748B' };
        return `
          <div class="card">
            <div class="card-title" style="display: flex; align-items: center; gap: 8px;">
              <span>${catInfo.icon}</span>
              <span>${catInfo.name}</span>
              <span style="font-size: 12px; color: var(--text-muted);">(${items.length})</span>
            </div>
            <div style="margin-top: 12px;">
              ${items.map((pr, index) => {
                const breakType = getBreakTypeInfo(pr.type);
                const prDetail = Utils.analyzePRDetail(pr);
                return `
                  <div class="pr-item" style="border-left: 4px solid ${catInfo.color};">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="pr-name">${pr.name}</span>
                        <span style="font-size: 12px; padding: 2px 8px; border-radius: 10px; background: ${breakType.color}15; color: ${breakType.color};">
                          ${breakType.icon} ${breakType.label}
                        </span>
                      </div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        ${Utils.formatDate(pr.date)}
                        ${index === 0 && items.length > 1 ? '🏆 本组最高' : ''}
                      </div>
                      ${prDetail && prDetail.improvement.value ? `
                        <div class="pr-improvement" style="margin-top: 8px; padding: 8px; background: ${breakType.color}10; border-radius: 6px;">
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 12px; color: ${breakType.color}; font-weight: 500;">
                              ${breakType.icon} 超越 ${Utils.formatDateSafe(prDetail.previous.date)}
                            </span>
                            <span style="font-size: 13px; font-weight: 600; color: ${breakType.color};">
                              ${prDetail.improvement.value}
                              ${prDetail.improvement.percent ? `(${prDetail.improvement.percent})` : ''}
                            </span>
                          </div>
                          <div style="display: flex; gap: 12px; margin-top: 6px; font-size: 12px;">
                            <span class="pr-history-previous">${prDetail.previous.weight}kg × ${prDetail.previous.maxReps}次</span>
                            <span style="color: var(--text-muted);">→</span>
                            <span class="pr-history-current">${pr.weight}kg × ${pr.reps}次</span>
                          </div>
                        </div>
                      ` : pr.type === 'first' ? `
                        <div class="pr-improvement" style="margin-top: 8px; padding: 8px; background: ${breakType.color}10; border-radius: 6px;">
                          <span style="font-size: 12px; color: ${breakType.color}; font-weight: 500;">
                            ${breakType.icon} 首次完成该动作
                          </span>
                        </div>
                      ` : ''}
                    </div>
                    <div class="pr-info">
                      <span class="pr-value">${pr.weight}kg × ${pr.reps}次</span>
                      <span style="font-size: 12px; color: var(--text-muted);">${pr.weight * pr.reps}kg</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
      
      <div class="card">
        <div class="card-title">📊 PR 突破类型说明</div>
        <div style="font-size: 14px; color: var(--text-muted); line-height: 1.8;">
          <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">💪</span>
            <div>
              <strong style="color: #EF4444;">重量突破</strong>
              <div style="font-size: 12px;">举起比以前更重的重量</div>
            </div>
          </div>
          <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🔢</span>
            <div>
              <strong style="color: #3B82F6;">次数突破</strong>
              <div style="font-size: 12px;">相同重量下完成更多次数</div>
            </div>
          </div>
          <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">📈</span>
            <div>
              <strong style="color: #10B981;">总量突破</strong>
              <div style="font-size: 12px;">重量 × 次数的总训练量更高</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🎯</span>
            <div>
              <strong style="color: #8B5CF6;">首项纪录</strong>
              <div style="font-size: 12px;">首次完成该动作的记录</div>
            </div>
          </div>
        </div>
      </div>
      `}
    </div>
  `;
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
  
  const streak = calculateStreak();
  const prs = Storage.getPRs();
  const prCount = Object.keys(prs).length;
  
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
        <div class="grid-4">
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
          <div>
            <div class="card-value" style="color: #F59E0B;">🔥${streak}</div>
            <div class="card-unit">连续天数</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">本周训练</div>
        <div class="grid-4">
          <div>
            <div class="card-value">${weekWorkouts.length}</div>
            <div class="card-unit">次数</div>
          </div>
          <div>
            <div class="card-value">${weekSets}</div>
            <div class="card-unit">总组数</div>
          </div>
          <div>
            <div class="card-value">${weekWorkouts.length > 0 ? Math.round(weekSets / weekWorkouts.length) : 0}</div>
            <div class="card-unit">均组数</div>
          </div>
          <div>
            <div class="card-value" style="color: #10B981;">🏆${prCount}</div>
            <div class="card-unit">个人纪录</div>
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
  const prs = Storage.getPRs();
  const prCount = Object.keys(prs).length;
  
  const partCount = {};
  appData.workouts.forEach(w => {
    w.exercises.forEach(e => {
      const part = Utils.getExercisePart(e.name);
      partCount[part] = (partCount[part] || 0) + 1;
    });
  });
  
  const progressData = detectAllProgress();
  
  const weeklyData = getWeeklyWorkoutData();
  
  return `
    <div class="page active">
      <div class="card">
        <div class="card-title">训练总览</div>
        <div class="grid-4">
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
          <div style="text-align: center;">
            <div class="card-value" style="color: #F59E0B;">${prCount}</div>
            <div class="card-unit">个人纪录</div>
          </div>
        </div>
      </div>
      
      ${weeklyData.labels.length > 0 ? `
      <div class="card">
        <div class="card-title">训练量趋势</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; padding-left: 4px;">
          📊 按周统计 · 计算方式: 重量(kg) × 该动作每组最大次数
        </div>
        <div class="chart-container">
          <canvas id="workoutTrendChart"></canvas>
        </div>
      </div>
      ` : ''}
      
      ${Object.keys(partCount).length > 0 ? `
      <div class="card">
        <div class="card-title">部位分布</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; padding-left: 4px;">
          📈 按动作统计各部位训练次数 · 部位分类: 胸、背、肩、腿、二头、三头
        </div>
        <div class="chart-container">
          <canvas id="partDistributionChart"></canvas>
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
      ` : `
      <div class="card">
        <div class="card-title">饮食统计</div>
        <div style="text-align: center; padding: 20px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">🥗</div>
          <div>暂无饮食记录</div>
          <div style="font-size: 12px; margin-top: 4px;">记录饮食以查看统计数据</div>
        </div>
      </div>
      `}
      
      ${progressData.length > 0 ? `
      <div class="card">
        <div class="card-title">进步追踪</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; padding-left: 4px;">
          🎯 自动检测您的训练突破 · 帮助您追踪长期进步
        </div>
        ${progressData.map(p => {
          const typeColors = { weight: '#EF4444', volume: '#10B981' };
          const bgColor = typeColors[p.type] || '#64748B';
          return `
          <div class="progress-item">
            <div class="progress-header">
              <span class="progress-exercise">${p.exercise}</span>
              <span class="progress-type" style="background: ${bgColor}20; color: ${bgColor};">${p.badge} ${p.type === 'weight' ? '重量突破' : '总量突破'}</span>
            </div>
            <div class="progress-compare-card" style="border-left: 3px solid ${bgColor};">
              <div class="compare-row dates">
                <span class="compare-old">${p.previousDate}</span>
                <span class="compare-arrow-large">→</span>
                <span class="compare-new">${p.date}</span>
              </div>
              <div class="compare-row main">
                <span class="compare-old">${p.previous}</span>
                <span class="compare-arrow-large">→</span>
                <span class="compare-new" style="color: ${bgColor};">${p.current}</span>
              </div>
              ${p.previousSets && p.previousSets !== '-' ? `
              <div class="compare-row sets">
                <span class="compare-old">${p.previousSets}</span>
                <span class="compare-arrow-large">→</span>
                <span class="compare-new">${p.currentSets}</span>
              </div>
              ` : ''}
              <div class="compare-row message">
                <span style="color: ${bgColor}; font-weight: 600;">${p.message}</span>
              </div>
            </div>
          </div>
          `;
        }).join('')}
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
 * 获取每周训练数据
 */
function getWeeklyWorkoutData() {
  const now = new Date();
  const labels = [];
  const data = [];
  
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const weekStart = Utils.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    const weekWorkouts = appData.workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
    
    const weeklyVolume = weekWorkouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((exSum, ex) => {
        const maxReps = Math.max(...ex.sets);
        return exSum + ex.weight * maxReps;
      }, 0);
    }, 0);
    
    labels.push(weekLabel);
    data.push(weeklyVolume);
  }
  
  return { labels, data };
}

/**
 * 渲染统计页面图表
 */
function renderStatsCharts() {
  const weeklyData = getWeeklyWorkoutData();
  
  if (weeklyData.labels.length > 0) {
    const ctx1 = document.getElementById('workoutTrendChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: weeklyData.labels,
          datasets: [{
            label: '训练量',
            data: weeklyData.data,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2563EB',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
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
  }
  
  const partCount = {};
  appData.workouts.forEach(w => {
    w.parts.forEach(p => {
      partCount[p] = (partCount[p] || 0) + 1;
    });
  });
  
  if (Object.keys(partCount).length > 0) {
    const ctx2 = document.getElementById('partDistributionChart');
    if (ctx2) {
      const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: Object.keys(partCount),
          datasets: [{
            data: Object.values(partCount),
            backgroundColor: colors.slice(0, Object.keys(partCount).length),
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                usePointStyle: true
              }
            }
          },
          cutout: '60%'
        }
      });
    }
  }
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
      const maxReps = Math.max(...e.sets);
      const volume = e.weight * maxReps;
      exerciseHistory[e.name].push({
        date: w.date,
        weight: e.weight,
        maxReps: maxReps,
        totalReps: e.totalReps,
        volume: volume,
        sets: e.sets.join('/')
      });
    });
  });
  
  Object.entries(exerciseHistory).forEach(([name, history]) => {
    let bestWeight = 0;
    let bestVolume = 0;
    let prevRecord = null;
    
    for (let i = history.length - 1; i >= 0; i--) {
      const record = history[i];
      const hasWeightProgress = record.weight > bestWeight;
      const hasVolumeProgress = !hasWeightProgress && record.volume > bestVolume;
      
      if (hasWeightProgress || hasVolumeProgress) {
        if (prevRecord && prevRecord.date === record.date) {
          prevRecord = record;
          if (hasWeightProgress) {
            bestWeight = record.weight;
            bestVolume = record.volume;
          }
          continue;
        }
        
        const prevWeight = bestWeight;
        const prevVolume = bestVolume;
        
        if (hasWeightProgress) {
          bestWeight = record.weight;
          bestVolume = record.volume;
          
          if (prevWeight > 0) {
            const prevRec = history.find(h => h.weight === prevWeight && h.date < record.date);
            progress.push({
              exercise: name,
              date: Utils.formatDate(record.date),
              previousDate: prevRec ? Utils.formatDate(prevRec.date) : '-',
              previous: prevWeight + 'kg',
              current: record.weight + 'kg',
              previousSets: prevRec ? prevRec.sets : '-',
              currentSets: record.sets,
              type: 'weight',
              badge: '🔥',
              message: '加重 ' + (record.weight - prevWeight).toFixed(1) + 'kg'
            });
          }
        } else if (hasVolumeProgress) {
          bestVolume = record.volume;
          
          if (prevVolume > 0) {
            const prevRec = history.find(h => h.volume === prevVolume && h.date < record.date);
            progress.push({
              exercise: name,
              date: Utils.formatDate(record.date),
              previousDate: prevRec ? Utils.formatDate(prevRec.date) : '-',
              previous: prevVolume + 'kg',
              current: record.volume + 'kg',
              previousSets: prevRec ? prevRec.sets : '-',
              currentSets: record.sets,
              type: 'volume',
              badge: '📈',
              message: '总量提升 ' + (record.volume - prevVolume) + 'kg'
            });
          }
        }
        
        prevRecord = record;
      }
    }
  });
  
  return progress.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
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
      renderStatsCharts();
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
