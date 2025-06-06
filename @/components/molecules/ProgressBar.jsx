import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;