"use client";

import { navItems } from "@/lib/admin-constants";
import { TabType } from "@/lib/admin-types";
import { FiPower, FiTerminal, FiX } from "react-icons/fi";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  sidebarOpen,
  onSidebarClose,
}: SidebarProps) {
  const filteredNav = navItems;

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6; 
          border-radius: 20px;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #60a5fa;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 transparent;
        }
      `}</style>

      <div className="fixed top-0 left-0 lg:left-24 right-0 h-16 bg-black border-b border-white/20 z-[100] flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-4 text-[9px] tracking-[0.4em] text-white/50">
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-5 py-2 border border-white bg-white text-black hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group"
          >
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-inherit">LOGOUT</span>
            <FiPower size={14} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
          
          {!sidebarOpen && (
            <button onClick={onSidebarClose} className="lg:hidden text-white p-2 border border-white/10">
              <FiTerminal size={18} />
            </button>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[110]" 
          onClick={onSidebarClose} 
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-20 lg:w-24 bg-black border-r border-white/10 z-[120] transition-transform duration-500 ease-[0.23,1,0.32,1] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col h-full">
          
          <div className="h-16 flex-shrink-0 border-b border-white/10 flex items-center justify-center">
             <span className="text-[8px] font-black opacity-20 tracking-widest uppercase">Root</span>
          </div>

          <nav className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
            {filteredNav.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); onSidebarClose(); }}
                className={`relative h-32 flex-shrink-0 flex flex-col items-center justify-center transition-all group ${
                  activeTab === item.id 
                    ? "bg-white text-black" 
                    : "text-white/30 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`absolute top-4 text-[8px] font-mono ${activeTab === item.id ? "opacity-40" : "opacity-10"}`}>
                  0{idx + 1}
                </span>
                
                <span className="text-[10px] font-black uppercase tracking-tighter -rotate-90 whitespace-nowrap">
                  {item.label}
                </span>

                {activeTab === item.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={onSidebarClose}
            className="lg:hidden h-20 flex-shrink-0 flex items-center justify-center border-t border-white/10 text-white/40 hover:text-blue-400 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      </aside>
    </>
  );
}