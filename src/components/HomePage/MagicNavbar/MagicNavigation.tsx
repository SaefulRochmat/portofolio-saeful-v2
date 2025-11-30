'use client';

import { useState } from 'react';
import NavigationMenu from './navigation/NavigationMenu';
import ContentWrapper from './shared/ContentWrapper';
import { menuItems } from './config/menuConfig';

export default function MagicNavigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleMenuClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* Dynamic Backgrounds */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} transition-opacity duration-700 ease-in-out ${
            activeIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Content Area */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl relative mb-24">
          {menuItems.map((item, index) => {
            const ContentComponent = item.content;
            return (
              <ContentWrapper
                key={index}
                isActive={activeIndex === index}
                direction={direction}
                index={index}
                activeIndex={activeIndex}
              >
                <ContentComponent />
              </ContentWrapper>
            );
          })}
        </div>

        {/* Navigation */}
        <NavigationMenu
          menuItems={menuItems}
          activeIndex={activeIndex}
          onMenuClick={handleMenuClick}
        />
      </div>
    </div>
  );
}