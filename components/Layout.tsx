import React from 'react';
import { LayoutDashboard, Users, PlusCircle, Settings, Clock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'timekeeper', label: 'Chấm công', icon: Clock }, // New Item
    { id: 'create', label: 'Tạo đơn', icon: PlusCircle, isPrimary: true },
    { id: 'performance', label: 'Hiệu suất', icon: Users },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800 flex justify-center">
      {/* Changed max-w-md to max-w-3xl for Tablet support */}
      <main className="w-full md:max-w-3xl bg-white min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation - Adjusted width to match main container */}
      <nav className="fixed bottom-0 bg-white border-t border-gray-200 z-50 w-full md:max-w-3xl">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative -top-5 group"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform ${isActive ? 'bg-[#224846] scale-110' : 'bg-[#2D5F5D] group-hover:scale-105'}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-[#2D5F5D] absolute -bottom-4 w-full text-center left-0">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#2D5F5D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;