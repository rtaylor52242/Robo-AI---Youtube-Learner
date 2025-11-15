import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { RobotIcon } from './icons/RobotIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MenuIcon, XIcon } from './icons/MenuIcons';
import { LogoutIcon } from './icons/LogoutIcon';
import { TrashIcon } from './icons/TrashIcon';
import { HelpIcon } from './icons/HelpIcon';

interface SidebarProps {
  history: HistoryItem[];
  currentVideoId: string | null;
  onSelectItem: (id: string) => void;
  onGoHome: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onDeleteItem: (id: string) => void;
  onOpenHelp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, currentVideoId, onSelectItem, onGoHome, isOpen, setIsOpen, onLogout, onDeleteItem, onOpenHelp }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 text-white flex flex-col transition-all duration-300 ease-in-out z-10 ${isOpen ? 'w-64 md:w-72' : 'w-16'}`}>
      <div className={`flex items-center p-4 border-b border-gray-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
           <div 
             onClick={onGoHome}
             className="flex items-center gap-2 cursor-pointer"
           >
            <RobotIcon className="w-8 h-8 text-brand-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">Robo AI -</span>
              <span className="text-lg font-medium leading-tight text-gray-300">Youtube Learner</span>
            </div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-md hover:bg-gray-700">
           {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <button
            onClick={onGoHome}
            className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors ${!currentVideoId ? 'bg-brand-primary text-white' : 'hover:bg-gray-700'}`}
          >
            <HomeIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span className="font-medium whitespace-nowrap">Home</span>}
          </button>
        </div>

        <div className="px-4 mb-2 flex items-center gap-3 text-gray-400">
          <HistoryIcon className="w-6 h-6 flex-shrink-0" />
          {isOpen && <h2 className="text-sm font-semibold uppercase tracking-wider whitespace-nowrap">History</h2>}
        </div>
        <ul className="px-4 space-y-1">
          {history.map(item => (
            <li key={item.id} className="group relative">
              <button
                onClick={() => onSelectItem(item.id)}
                className={`flex items-center w-full text-left gap-3 p-2 rounded-md transition-colors ${
                  item.id === currentVideoId ? 'bg-brand-primary/80 text-white' : 'hover:bg-gray-700'
                }`}
                title={item.title}
              >
                <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0"></div>
                {isOpen && <span className="truncate text-sm flex-1">{item.title}</span>}
              </button>
               {isOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete item"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
          <button
            onClick={onOpenHelp}
            className="flex items-center w-full gap-3 p-2 mb-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700"
            title="Help"
          >
            <HelpIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span className="font-medium whitespace-nowrap">Help</span>}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center w-full gap-3 p-2 rounded-md transition-colors text-gray-300 hover:bg-red-500 hover:text-white"
            title="Logout"
          >
            <LogoutIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span className="font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
    </aside>
  );
};

export default Sidebar;