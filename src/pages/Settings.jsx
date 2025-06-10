import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { categoryService } from '../services';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#5B47E0'
  });

  const predefinedColors = [
    '#5B47E0', '#8B7FE8', '#FF6B6B', '#4CAF50', 
    '#FF9800', '#2196F3', '#9C27B0', '#00BCD4',
    '#795548', '#607D8B', '#E91E63', '#3F51B5'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Category name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    formData.color === color 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              {category ? 'Update' : 'Create'} Category
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Settings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        const updatedCategory = await categoryService.update(editingCategory.id, categoryData);
        setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
        toast.success('Category updated successfully');
      } else {
        const newCategory = await categoryService.create(categoryData);
        setCategories([...categories, newCategory]);
        toast.success('Category created successfully');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will remove the category from all tasks.')) return;
    
    try {
      await categoryService.delete(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your categories and preferences</p>
        </div>

        {/* Categories Section */}
        <div className="bg-surface rounded-xl p-6 border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-1">Categories</h2>
              <p className="text-gray-600">Organize your tasks with custom categories</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              <ApperIcon name="Plus" size={18} />
              <span>Add Category</span>
            </motion.button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-surface-50 rounded-lg">
                  <div className="w-4 h-4 bg-surface-200 rounded"></div>
                  <div className="flex-1 h-4 bg-surface-200 rounded"></div>
                  <div className="w-16 h-6 bg-surface-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <ApperIcon name="AlertCircle" className="w-12 h-12 text-accent mx-auto mb-2" />
              <p className="text-gray-600">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadCategories}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
              >
                Try Again
              </motion.button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Tag" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">No categories yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCategoryForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
              >
                Create Your First Category
              </motion.button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.taskCount || 0} tasks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryForm(true);
                      }}
                      className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} className="text-gray-500 hover:text-accent" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="bg-surface rounded-xl p-6 border border-surface-200">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">About TaskFlow</h2>
          <div className="space-y-3 text-gray-600">
            <p>A clean and efficient task management application that helps you organize daily activities with smart categorization and priority tracking.</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <ApperIcon name="CheckSquare" size={16} className="text-primary" />
                <span>Version 1.0.0</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" size={16} className="text-accent" />
                <span>Made with care</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default Settings;