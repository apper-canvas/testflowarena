import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, name, checked, rows, ...props }) => {
    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
                rows={rows}
                {...props}
            />
        );
    }

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            name={name}
            checked={checked}
            {...props}
        />
    );
};

export default Input;