import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const TimerDisplay = ({ timeRemaining }) => {
    const minutes = Math.floor(timeRemaining / 60);
    const remainingSeconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            <ApperIcon name="Clock" size={16} />
            <span className="font-mono font-bold">{formattedTime}</span>
        </div>
    );
};

export default TimerDisplay;