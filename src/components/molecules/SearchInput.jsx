import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <ApperIcon 
      name="Search" 
      size={20} 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
    />
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="pl-10 pr-4 py-3"
    />
  </div>
);

export default SearchInput;