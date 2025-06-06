import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import SidebarLink from '@/components/molecules/SidebarLink';
import Button from '@/components/atoms/Button';

const Sidebar = ({ sidebarItems, activeTab, onTabChange, darkMode, onToggleDarkMode }) => {
    return (
        <div className="w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 fixed h-full z-10">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <ApperIcon name="Zap" size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">TestFlow Pro</h1>
                        <p className="text-sm text-surface-500 dark:text-surface-400">Assessment Platform</p>
                    </div>
                </div>
            </div>

            <nav className="p-4">
                {sidebarItems.map((item) => (
                    <SidebarLink
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                    />
                ))}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <Button
                    onClick={onToggleDarkMode}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                    <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={20} />
                    <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;