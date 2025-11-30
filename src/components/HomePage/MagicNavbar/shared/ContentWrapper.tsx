export default function ContentWrapper({ children, isActive, direction, index, activeIndex }) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ease-out ${
        isActive
          ? 'opacity-100 translate-x-0'
          : direction === 1
          ? index < activeIndex
            ? 'opacity-0 -translate-x-full'
            : 'opacity-0 translate-x-full'
          : index > activeIndex
          ? 'opacity-0 translate-x-full'
          : 'opacity-0 -translate-x-full'
      }`}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl h-full">
        {children}
      </div>
    </div>
  );
}