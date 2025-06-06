import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SidebarLink = ({ item, isActive, onClick }) => {
    return (
        <Button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
        >
            <ApperIcon name={item.icon} size={20} />
            <span className="font-medium">{item.label}</span>
        </Button>
    );
};

export default SidebarLink;