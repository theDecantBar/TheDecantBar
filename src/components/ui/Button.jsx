export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-5 py-2.5 text-[11px]",
    md: "px-7 py-3.5 text-xs",
    lg: "px-9 py-4 text-xs",
  };

  const variantStyles = {
    primary:
      "bg-[#d8c08a] text-[#11110f] hover:bg-[#c6a15b]",
    secondary:
      "bg-[#181815] text-[#f4efe6] border border-white/15 hover:border-[#c6a15b] hover:text-[#c6a15b]",
    outline:
      "bg-transparent text-[#f4efe6] border border-white/25 hover:border-[#c6a15b] hover:text-[#c6a15b]",
    ghost:
      "bg-transparent text-[#c5c1b9] hover:text-[#f4efe6] p-0 tracking-normal",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
