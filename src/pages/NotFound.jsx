import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <ApperIcon name="Search" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium"
          >
            Go to Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-surface-100 text-gray-700 rounded-lg hover:bg-surface-200 transition-all font-medium"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;