const Storage = require('../../utils/storage.js');
const Utils = require('../../utils/utils.js');

Page({
  data: {
    exercises: [],
    filteredExercises: [],
    parts: ['全部', '胸', '背', '肩', '腿', '三头', '二头', '其他'],
    selectedPart: '全部',
    showModal: false,
    editingExercise: null,
    formData: {
      name: '',
      muscle: '',
      equipment: ''
    }
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    const exercises = Storage.getExerciseLibrary();
    this.setData({
      exercises,
      filteredExercises: exercises
    });
  },

  filterByPart(e) {
    const part = e.currentTarget.dataset.part;
    this.setData({ selectedPart: part });
    
    if (part === '全部') {
      this.setData({ filteredExercises: this.data.exercises });
    } else {
      const filtered = this.data.exercises.filter(e => e.muscle === part);
      this.setData({ filteredExercises: filtered });
    }
  },

  openAddModal() {
    this.setData({
      showModal: true,
      editingExercise: null,
      formData: { name: '', muscle: '', equipment: '' }
    });
  },

  openEditModal(e) {
    const name = e.currentTarget.dataset.name;
    const exercise = this.data.exercises.find(e => e.name === name);
    this.setData({
      showModal: true,
      editingExercise: exercise,
      formData: {
        name: exercise.name,
        muscle: exercise.muscle,
        equipment: exercise.equipment
      }
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  setFormData(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const formData = { ...this.data.formData, [field]: value };
    this.setData({ formData });
  },

  saveExercise() {
    if (!this.data.formData.name.trim()) {
      Utils.showToast('请输入动作名称');
      return;
    }

    const exercises = [...this.data.exercises];
    
    if (this.data.editingExercise) {
      const index = exercises.findIndex(e => e.name === this.data.editingExercise.name);
      if (index >= 0) {
        exercises[index] = {
          name: this.data.formData.name.trim(),
          muscle: this.data.formData.muscle || '其他',
          category: this.getCategory(this.data.formData.muscle),
          equipment: this.data.formData.equipment || '无'
        };
      }
    } else {
      exercises.push({
        name: this.data.formData.name.trim(),
        muscle: this.data.formData.muscle || '其他',
        category: this.getCategory(this.data.formData.muscle),
        equipment: this.data.formData.equipment || '无'
      });
    }

    Storage.saveExerciseLibrary(exercises);
    this.loadData();
    this.closeModal();
    Utils.showToast('保存成功');
  },

  deleteExercise(e) {
    const name = e.currentTarget.dataset.name;
    Utils.showModal('确认删除', `确定要删除"${name}"吗？`).then((confirm) => {
      if (confirm) {
        const exercises = this.data.exercises.filter(e => e.name !== name);
        Storage.saveExerciseLibrary(exercises);
        this.loadData();
        Utils.showToast('已删除');
      }
    });
  },

  getCategory(muscle) {
    const categories = {
      '胸': 'chest',
      '背': 'back',
      '肩': 'shoulder',
      '腿': 'legs',
      '三头': 'triceps',
      '二头': 'biceps'
    };
    return categories[muscle] || 'other';
  },

  goBack() {
    wx.navigateBack();
  }
});