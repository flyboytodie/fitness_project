/**
 * 问题跟踪系统模块
 */

class ProblemTracker {
  constructor() {
    this.problems = this.loadProblems();
  }
  
  /**
   * 加载问题列表
   */
  loadProblems() {
    const data = localStorage.getItem('fitness_problems');
    return data ? JSON.parse(data) : [];
  }
  
  /**
   * 保存问题列表
   */
  saveProblems() {
    localStorage.setItem('fitness_problems', JSON.stringify(this.problems));
  }
  
  /**
   * 添加新问题记录
   * @param {object} problem - 问题对象
   */
  addProblem(problem) {
    const newProblem = {
      id: Date.now().toString(),
      title: problem.title,
      description: problem.description,
      context: problem.context || '',
      solution: problem.solution || '',
      tags: problem.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.problems.push(newProblem);
    this.saveProblems();
    return newProblem;
  }
  
  /**
   * 更新问题记录
   * @param {string} id - 问题ID
   * @param {object} updates - 更新内容
   */
  updateProblem(id, updates) {
    const index = this.problems.findIndex(p => p.id === id);
    if (index >= 0) {
      this.problems[index] = { ...this.problems[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveProblems();
      return this.problems[index];
    }
    return null;
  }
  
  /**
   * 删除问题记录
   * @param {string} id - 问题ID
   */
  deleteProblem(id) {
    const index = this.problems.findIndex(p => p.id === id);
    if (index >= 0) {
      const deleted = this.problems.splice(index, 1)[0];
      this.saveProblems();
      return deleted;
    }
    return null;
  }
  
  /**
   * 获取所有问题
   */
  getAllProblems() {
    return [...this.problems].reverse();
  }
  
  /**
   * 根据ID获取问题
   * @param {string} id - 问题ID
   */
  getProblemById(id) {
    return this.problems.find(p => p.id === id);
  }
  
  /**
   * 搜索问题（支持关键词搜索）
   * @param {string} query - 搜索关键词
   */
  searchProblems(query) {
    const lowerQuery = query.toLowerCase();
    return this.problems.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.context.toLowerCase().includes(lowerQuery) ||
      p.solution.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).reverse();
  }
  
  /**
   * 计算Jaccard相似度
   * @param {string} a - 字符串A
   * @param {string} b - 字符串B
   */
  jaccardSimilarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\s+/));
    const setB = new Set(b.toLowerCase().split(/\s+/));
    
    let intersection = 0;
    setA.forEach(word => {
      if (setB.has(word)) intersection++;
    });
    
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }
  
  /**
   * 匹配相似问题（用于问题预警）
   * @param {string} description - 问题描述
   * @param {number} threshold - 相似度阈值
   */
  findSimilarProblems(description, threshold = 0.3) {
    return this.problems
      .filter(p => p.solution)
      .map(p => ({
        problem: p,
        similarity: this.jaccardSimilarity(description, p.description)
      }))
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }
}

// 创建全局实例
const problemTracker = new ProblemTracker();

// 显示问题跟踪系统界面
function showProblemTracker() {
  const problems = problemTracker.getAllProblems();
  
  Utils.showModal(`
    <div class="modal-header">
      <span>问题跟踪</span>
      <button class="modal-close" onclick="Utils.closeModal()">×</button>
    </div>
    <div style="padding: 16px;">
      <div style="margin-bottom: 16px;">
        <button class="btn btn-primary" style="width: 100%;" onclick="showAddProblemModal()">
          ➕ 添加问题记录
        </button>
      </div>
      
      <div style="margin-bottom: 12px;">
        <input 
          type="text" 
          id="problemSearch" 
          placeholder="搜索问题..." 
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;"
          onkeyup="searchProblems()"
        >
      </div>
      
      <div id="problemList" style="max-height: 400px; overflow-y: auto;">
        ${problems.length > 0 ? problems.map(p => `
          <div class="card" style="margin-bottom: 8px; padding: 12px;" onclick="showProblemDetail('${p.id}')">
            <div style="font-weight: 600; margin-bottom: 4px;">${p.title}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${p.description.substring(0, 50)}${p.description.length > 50 ? '...' : ''}</div>
            <div style="font-size: 10px; color: #999;">${Utils.formatDate(p.createdAt)}</div>
            ${p.solution ? '<div style="font-size: 11px; color: #10B981; margin-top: 4px;">✓ 已解决</div>' : ''}
          </div>
        `).join('') : `
          <div style="text-align: center; padding: 32px; color: #999;">
            <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
            <div>暂无问题记录</div>
          </div>
        `}
      </div>
    </div>
  `);
}

/**
 * 显示添加问题模态框
 */
function showAddProblemModal() {
  Utils.showModal(`
    <div class="modal-header">
      <span>添加问题记录</span>
      <button class="modal-close" onclick="Utils.closeModal()">×</button>
    </div>
    <form id="problemForm" onsubmit="saveProblem(event)">
      <div class="input-group">
        <label>问题标题</label>
        <input type="text" name="title" placeholder="简要描述问题" required>
      </div>
      
      <div class="input-group">
        <label>问题描述</label>
        <textarea name="description" placeholder="详细描述问题..." rows="3" required></textarea>
      </div>
      
      <div class="input-group">
        <label>上下文</label>
        <textarea name="context" placeholder="问题发生的背景、环境等" rows="2"></textarea>
      </div>
      
      <div class="input-group">
        <label>解决方案</label>
        <textarea name="solution" placeholder="如何解决这个问题（可选）" rows="3"></textarea>
      </div>
      
      <div class="input-group">
        <label>标签</label>
        <input type="text" name="tags" placeholder="用逗号分隔多个标签">
      </div>
      
      <button type="submit" class="btn btn-primary" style="margin-top: 8px;">保存</button>
    </form>
  `);
}

/**
 * 保存问题
 */
function saveProblem(event) {
  event.preventDefault();
  
  const form = event.target;
  const problem = {
    title: form.title.value,
    description: form.description.value,
    context: form.context.value,
    solution: form.solution.value,
    tags: form.tags.value.split(',').map(t => t.trim()).filter(t => t)
  };
  
  problemTracker.addProblem(problem);
  Utils.closeModal();
  showProblemTracker();
  Utils.showToast('问题记录已保存');
}

/**
 * 显示问题详情
 */
function showProblemDetail(id) {
  const problem = problemTracker.getProblemById(id);
  if (!problem) return;
  
  Utils.showModal(`
    <div class="modal-header">
      <span>${problem.title}</span>
      <button class="modal-close" onclick="Utils.closeModal()">×</button>
    </div>
    <div style="padding: 16px;">
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: #999; margin-bottom: 4px;">问题描述</div>
        <div>${problem.description}</div>
      </div>
      
      ${problem.context ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">上下文</div>
          <div>${problem.context}</div>
        </div>
      ` : ''}
      
      ${problem.solution ? `
        <div style="margin-bottom: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px;">
          <div style="font-size: 12px; color: #16a34a; margin-bottom: 4px;">解决方案</div>
          <div>${problem.solution}</div>
        </div>
      ` : ''}
      
      ${problem.tags.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">标签</div>
          <div>${problem.tags.map(t => `<span style="display: inline-block; padding: 2px 8px; background: #eee; border-radius: 12px; font-size: 12px; margin-right: 4px;">${t}</span>`).join('')}</div>
        </div>
      ` : ''}
      
      <div style="font-size: 10px; color: #999; margin-bottom: 16px;">
        创建于 ${Utils.formatDate(problem.createdAt)}
        ${problem.createdAt !== problem.updatedAt ? ` | 更新于 ${Utils.formatDate(problem.updatedAt)}` : ''}
      </div>
      
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary" onclick="Utils.closeModal(); showEditProblemModal('${id}')">编辑</button>
        <button class="btn btn-danger" onclick="Utils.closeModal(); deleteProblemRecord('${id}')">删除</button>
      </div>
    </div>
  `);
}

/**
 * 显示编辑问题模态框
 */
function showEditProblemModal(id) {
  const problem = problemTracker.getProblemById(id);
  if (!problem) return;
  
  Utils.showModal(`
    <div class="modal-header">
      <span>编辑问题记录</span>
      <button class="modal-close" onclick="Utils.closeModal()">×</button>
    </div>
    <form id="editProblemForm" onsubmit="updateProblemRecord(event, '${id}')">
      <div class="input-group">
        <label>问题标题</label>
        <input type="text" name="title" value="${problem.title}" required>
      </div>
      
      <div class="input-group">
        <label>问题描述</label>
        <textarea name="description" rows="3" required>${problem.description}</textarea>
      </div>
      
      <div class="input-group">
        <label>上下文</label>
        <textarea name="context" rows="2">${problem.context}</textarea>
      </div>
      
      <div class="input-group">
        <label>解决方案</label>
        <textarea name="solution" rows="3">${problem.solution}</textarea>
      </div>
      
      <div class="input-group">
        <label>标签</label>
        <input type="text" name="tags" value="${problem.tags.join(', ')}">
      </div>
      
      <button type="submit" class="btn btn-primary" style="margin-top: 8px;">保存</button>
    </form>
  `);
}

/**
 * 更新问题记录
 */
function updateProblemRecord(event, id) {
  event.preventDefault();
  
  const form = event.target;
  const updates = {
    title: form.title.value,
    description: form.description.value,
    context: form.context.value,
    solution: form.solution.value,
    tags: form.tags.value.split(',').map(t => t.trim()).filter(t => t)
  };
  
  problemTracker.updateProblem(id, updates);
  Utils.closeModal();
  showProblemTracker();
  Utils.showToast('问题记录已更新');
}

/**
 * 删除问题记录
 */
function deleteProblemRecord(id) {
  Utils.showConfirm('🗑️', '确认删除', '确定要删除这条问题记录吗？', () => {
    problemTracker.deleteProblem(id);
    showProblemTracker();
    Utils.showToast('问题记录已删除');
  });
}

/**
 * 搜索问题
 */
function searchProblems() {
  const query = document.getElementById('problemSearch').value;
  const problems = query ? problemTracker.searchProblems(query) : problemTracker.getAllProblems();
  
  document.getElementById('problemList').innerHTML = problems.length > 0 ? problems.map(p => `
    <div class="card" style="margin-bottom: 8px; padding: 12px;" onclick="showProblemDetail('${p.id}')">
      <div style="font-weight: 600; margin-bottom: 4px;">${p.title}</div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${p.description.substring(0, 50)}${p.description.length > 50 ? '...' : ''}</div>
      <div style="font-size: 10px; color: #999;">${Utils.formatDate(p.createdAt)}</div>
      ${p.solution ? '<div style="font-size: 11px; color: #10B981; margin-top: 4px;">✓ 已解决</div>' : ''}
    </div>
  `).join('') : `
    <div style="text-align: center; padding: 32px; color: #999;">
      未找到匹配的问题
    </div>
  `;
}

// 导出到全局
window.problemTracker = problemTracker;
window.showProblemTracker = showProblemTracker;