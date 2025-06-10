import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, categories, onToggleComplete, onEdit, onDelete }) => {
  const category = categories.find(cat => cat.id === task.categoryId);
  const priorityColors = {
    high: 'text-accent bg-accent/10 border-accent/20',
    medium: 'text-warning bg-warning/10 border-warning/20',
    low: 'text-success bg-success/10 border-success/20'
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    if (isYesterday(taskDate)) return 'Yesterday';
    return format(taskDate, 'MMM d');
  };

  const isDueSoon = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`task-card bg-surface rounded-xl p-6 border transition-all duration-200 ${
        task.completed ? 'border-surface-200 opacity-75' : 'border-surface-200 hover:border-primary/30'
      } ${isDueSoon ? 'border-accent/50 bg-accent/5' : ''}`}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="relative flex-shrink-0 mt-1"
        >
          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
            task.completed 
              ? 'bg-primary border-primary' 
              : 'border-surface-300 hover:border-primary'
          }`}>
            <AnimatePresence>
              {task.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ApperIcon name="Check" size={14} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 mb-1 break-words ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mb-3 break-words ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg hover:bg-surface-100"
              >
                <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-gray-600" />
              </Button>
              <Button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg hover:bg-accent/10"
              >
                <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-accent" />
              </Button>
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center space-x-3 text-sm">
            {/* Priority */}
            <span className={`px-2 py-1 rounded-full border text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>

            {/* Category */}
            {category && (
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: category.color + '90' }}
              >
                {category.name}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <span className={`flex items-center space-x-1 text-xs ${
                isDueSoon ? 'text-accent font-medium' : 'text-gray-500'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span>{formatDueDate(task.dueDate)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;