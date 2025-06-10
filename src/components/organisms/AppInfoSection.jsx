import ApperIcon from '@/components/ApperIcon';

const AppInfoSection = () => (
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
);

export default AppInfoSection;