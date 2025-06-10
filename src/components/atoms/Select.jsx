const Select = ({ className = '', options, ...props }) => {
  const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface';
  return (
    <select
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;