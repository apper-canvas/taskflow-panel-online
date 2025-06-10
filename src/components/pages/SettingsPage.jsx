import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CategoryForm from '@/components/organisms/CategoryForm';
import CategoryListSection from '@/components/organisms/CategoryListSection';
import AppInfoSection from '@/components/organisms/AppInfoSection';
import { categoryService } from '@/services';

const SettingsPage = () => {
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
        <CategoryListSection
          categories={categories}
          loading={loading}
          error={error}
          onAddCategory={() => setShowCategoryForm(true)}
          onEditCategory={(category) => {
            setEditingCategory(category);
            setShowCategoryForm(true);
          }}
          onDeleteCategory={handleDeleteCategory}
          onRetryLoad={loadCategories}
        />

        {/* App Info */}
        <AppInfoSection />
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

export default SettingsPage;