import MenuItem from './MenuItem';

export default function NavigationMenu({ menuItems, activeIndex, onMenuClick }) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative bg-white/10 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/20">
        <div className="flex items-center gap-2 relative">
          {/* Magic Indicator */}
          <div
            className="absolute h-14 w-14 bg-white rounded-full shadow-lg transition-all duration-500 ease-out"
            style={{
              transform: `translateX(${activeIndex * 64}px)`,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
            }}
          />

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={activeIndex === index}
              onClick={() => onMenuClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}