import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ColorSquare from '@/components/atoms/ColorSquare';
import FormField from '@/components/molecules/FormField';

const predefinedColors = [
  '#5B47E0', '#8B7FE8', '#FF6B6B', '#4CAF50', 
  '#FF9800', '#2196F3', '#9C27B0', '#00BCD4',
  '#795548', '#607D8B', '#E91E63', '#3F51B5'
];

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#5B47E0'
  });

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
          <Button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-surface-100"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name">
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
              autoFocus
            />
          </FormField>

          <FormField label="Color">
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <ColorSquare
                  key={color}
                  color={color}
                  isSelected={formData.color === color}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-surface-100 rounded-lg hover:bg-surface-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
            >
              {category ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryForm;