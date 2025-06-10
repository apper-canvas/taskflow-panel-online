import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(index, 1);
    return true;
  },

  async getByCategory(categoryId) {
    await delay(200);
    return tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  },

  async getByPriority(priority) {
    await delay(200);
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  }
};

export default taskService;