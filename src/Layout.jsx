import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';
import { taskService } from './services';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const loadTaskStats = async () => {
      try {
        const tasks = await taskService.getAll();
        setTotalTasks(tasks.length);
        setCompletedTasks(tasks.filter(task => task.completed).length);
      } catch (error) {
        console.error('Failed to load task stats:', error);
      }
    };
    loadTaskStats();
  }, [location]);

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
          </div>

          {/* Progress Ring - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-surface-200"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-primary"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 125.6" }}
                  animate={{ 
                    strokeDasharray: `${(progressPercentage / 100) * 125.6} 125.6` 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-900">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">{completedTasks} of {totalTasks}</div>
              <div className="text-xs">completed</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-surface-200 flex-col">
          <nav className="flex-1 p-6 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-surface-100 hover:scale-105'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-surface z-50 md:hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="CheckSquare" size={20} className="text-white" />
                      </div>
                      <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>

                  {/* Mobile Progress */}
                  <div className="mb-6 p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-surface-200"
                          />
                          <motion.circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-primary"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 100.5" }}
                            animate={{ 
                              strokeDasharray: `${(progressPercentage / 100) * 100.5} 100.5` 
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-900">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{completedTasks} of {totalTasks} completed</div>
                      </div>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-700 hover:bg-surface-100'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;