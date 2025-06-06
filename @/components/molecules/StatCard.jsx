import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, icon, iconBgColor, iconTextColor }) => {
    return (
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor}`}>
                    <ApperIcon name={icon} size={24} className={iconTextColor} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;