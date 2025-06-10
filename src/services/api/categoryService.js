import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(250);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(350);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(300);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory = {
      ...categories[index],
      ...updates
    };
    
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(250);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories.splice(index, 1);
    return true;
  }
};

export default categoryService;