export default function Container({ children, className = "", ...props }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-4 min-[375px]:px-5 sm:px-8 lg:px-16 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
