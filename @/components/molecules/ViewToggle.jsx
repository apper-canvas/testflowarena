import React from 'react';
import Button from '@/components/atoms/Button';

const ViewToggle = ({ activeView, onSelectView }) => {
    return (
        <div className="flex gap-2 bg-surface-100 dark:bg-surface-700 p-1 rounded-xl w-fit">
            <Button
                onClick={() => onSelectView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === 'calendar'
                        ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-sm'
                        : 'text-surface-600 dark:text-surface-400'
                }`}
            >
                Calendar View
            </Button>
            <Button
                onClick={() => onSelectView('candidates')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === 'candidates'
                        ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-sm'
                        : 'text-surface-600 dark:text-surface-400'
                }`}
            >
                Candidate Management
            </Button>
        </div>
    );
};

export default ViewToggle;