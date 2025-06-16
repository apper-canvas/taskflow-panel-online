import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/organisms/TaskForm';
import SearchInput from '@/components/molecules/SearchInput';
import FilterSelect from '@/components/molecules/FilterSelect';
import ToggleButton from '@/components/molecules/ToggleButton';
import { taskService, categoryService } from '@/services';

const TaskListSection = () => {
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
    if (selectedCategory !== 'all' && task.category_id !== selectedCategory) return false;
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

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({ value: category.Id, label: category.Name }))
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
        >
          Try Again
        </Button>
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

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 shadow-sm"
          >
            <ApperIcon name="Plus" size={20} />
            <span className="font-medium">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <FilterSelect
            label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
          />

          {/* Priority Filter */}
          <FilterSelect
            label="Filter by Priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={priorityOptions}
          />

          {/* Show Completed Toggle */}
          <ToggleButton
            isActive={showCompleted}
            onClick={() => setShowCompleted(!showCompleted)}
            activeText="Hide Completed"
            inactiveText="Show Completed"
            activeIcon="EyeOff"
            inactiveIcon="Eye"
          />
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
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110"
            >
              Create Your First Task
            </Button>
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

export default TaskListSection;