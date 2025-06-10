import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CategoryItem = ({ category, onEdit, onDelete }) => (
  <motion.div
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
      <Button
        onClick={() => onEdit(category)}
        className="p-2 rounded-lg hover:bg-surface-200"
      >
        <ApperIcon name="Edit2" size={16} className="text-gray-500" />
      </Button>
      <Button
        onClick={() => onDelete(category.id)}
        className="p-2 rounded-lg hover:bg-accent/10"
      >
        <ApperIcon name="Trash2" size={16} className="text-gray-500 hover:text-accent" />
      </Button>
    </div>
  </motion.div>
);

export default CategoryItem;