import React from 'react';

const Input = ({ 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    className = '', 
    name, 
    checked, 
    rows = 4,
    disabled = false,
    required = false,
    min,
    max,
    ...props 
}) => {
    const baseClasses = 'w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors';
    
    const combinedClasses = `${baseClasses} ${className}`;

    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={combinedClasses}
                rows={rows}
                disabled={disabled}
                required={required}
                name={name}
                {...props}
            />
        );
    }

    if (type === 'radio') {
        return (
            <input
                type="radio"
                value={value}
                onChange={onChange}
                className={`text-primary focus:ring-primary focus:ring-2 ${className}`}
                name={name}
                checked={checked}
                disabled={disabled}
                required={required}
                {...props}
            />
        );
    }

    if (type === 'checkbox') {
        return (
            <input
                type="checkbox"
                onChange={onChange}
                className={`text-primary focus:ring-primary focus:ring-2 rounded ${className}`}
                name={name}
                checked={checked}
                disabled={disabled}
                required={required}
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
            className={combinedClasses}
            name={name}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            {...props}
        />
    );
};

export default Input;