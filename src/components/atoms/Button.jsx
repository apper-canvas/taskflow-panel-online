import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, ...props }) => {
  // Filter out any non-standard HTML props if not using motion.button for all
  const commonProps = {
    type,
    onClick,
    className: `transition-all ${className}`,
    ...props
  };

  if (whileHover || whileTap) {
    return (
      <motion.button whileHover={whileHover} whileTap={whileTap} {...commonProps}>
        {children}
      </motion.button>
    );
  }

  return (
    <button {...commonProps}>
      {children}
    </button>
  );
};

export default Button;