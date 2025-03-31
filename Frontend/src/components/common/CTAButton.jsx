import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTAButton = ({ 
  to, 
  icon: Icon, 
  label, 
  primary = true,
  onClick,
  className = ''
}) => {
  const baseStyles = "inline-flex items-center px-6 py-3 rounded-lg transition-colors";
  const styles = primary
    ? `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 ${className}`
    : `${baseStyles} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ${className}`;

  const content = (
    <>
      {Icon && <Icon className="mr-2" />}
      {label}
    </>
  );

  if (to) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={to} className={styles}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={styles}
    >
      {content}
    </motion.button>
  );
};

export default CTAButton; 