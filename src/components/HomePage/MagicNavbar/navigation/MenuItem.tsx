export default function MenuItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative z-10 w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 group"
    >
      <Icon
        className={`transition-all duration-300 ${
          isActive
            ? 'text-indigo-600 scale-110 -translate-y-1'
            : 'text-white/70 group-hover:text-white group-hover:scale-105'
        }`}
        size={24}
      />
      
      <span
        className={`absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
          isActive
            ? 'opacity-100 text-white translate-y-0'
            : 'opacity-0 text-white/70 translate-y-2 group-hover:opacity-70 group-hover:translate-y-0'
        }`}
      >
        {label}
      </span>

      {!isActive && (
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}