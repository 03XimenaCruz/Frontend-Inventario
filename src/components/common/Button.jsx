const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none ';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-[#2A9BC0] focus:ring-primary shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md hover:shadow-lg',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 shadow-md hover:shadow-lg',
    //outline: 'border-2 border-primary text-primary hover:bg-primary-light/20 focus:ring-primary',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled ? disabledStyles : ''} 
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </button>
  );
};

export default Button;