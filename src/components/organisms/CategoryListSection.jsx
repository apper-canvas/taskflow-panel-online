import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CategoryItem from '@/components/molecules/CategoryItem';

const CategoryListSection = ({ categories, loading, error, onAddCategory, onEditCategory, onDeleteCategory, onRetryLoad }) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-surface-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-1">Categories</h2>
          <p className="text-gray-600">Organize your tasks with custom categories</p>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddCategory}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Add Category</span>
        </Button>
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
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetryLoad}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
          >
            Try Again
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Tag" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
          <p className="text-gray-600 mb-4">No categories yet</p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddCategory}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
          >
            Create Your First Category
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={onEditCategory}
              onDelete={onDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListSection;