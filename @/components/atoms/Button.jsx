import React from 'react';

const Button = ({ onClick, children, className, disabled, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;