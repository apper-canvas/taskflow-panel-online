const Input = ({ type = 'text', className = '', ...props }) => {
  const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all';

  if (type === 'textarea') {
    return (
      <textarea
        className={`${baseClasses} resize-none ${className}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

export default Input;