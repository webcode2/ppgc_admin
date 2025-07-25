export function Badge({ children, className }) {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${className}`}>
        {children}
      </span>
    );
  }
  