import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ToggleButton = ({ isActive, onClick, activeText, inactiveText, activeIcon, inactiveIcon, className = '' }) => (
  <Button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${className} ${
      isActive 
        ? 'bg-primary text-white' 
        : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
    }`}
  >
    <ApperIcon name={isActive ? activeIcon : inactiveIcon} size={16} />
    <span className="text-sm font-medium">
      {isActive ? activeText : inactiveText}
    </span>
  </Button>
);

export default ToggleButton;