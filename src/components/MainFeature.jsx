import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';
import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns';

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
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-accent" />
              </button>
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

const TaskForm = ({ task, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    categoryId: task?.categoryId || categories[0]?.id || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    onSave(taskData);
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
            {task ? 'Edit Task' : 'New Task'}
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
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
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
              {task ? 'Update Task' : 'Create Task'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, { 
        completed: !task.completed 
      });
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task reopened');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(taskData);
        setTasks([newTask, ...tasks]);
        toast.success('Task created successfully');
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false;
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-surface-200 rounded-full w-16"></div>
                <div className="h-6 bg-surface-200 rounded-full w-20"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Your Tasks</h1>
            <p className="text-gray-600">
              {taskStats.pending} pending, {taskStats.completed} completed
              {taskStats.high > 0 && (
                <span className="text-accent font-medium"> • {taskStats.high} high priority</span>
              )}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-sm"
          >
            <ApperIcon name="Plus" size={20} />
            <span className="font-medium">Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Show Completed Toggle */}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              showCompleted 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name={showCompleted ? "EyeOff" : "Eye"} size={16} />
            <span className="text-sm font-medium">
              {showCompleted ? 'Hide' : 'Show'} Completed
            </span>
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          </h3>
          <p className="mt-2 text-gray-500 mb-4">
            {tasks.length === 0 
              ? 'Get started by creating your first task' 
              : 'Try adjusting your filters or search query'
            }
          </p>
          {tasks.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              Create Your First Task
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  categories={categories}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setShowTaskForm(true);
                  }}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            categories={categories}
            onSave={handleSaveTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;