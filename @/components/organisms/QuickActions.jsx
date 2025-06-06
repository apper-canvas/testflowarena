import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActions = () => {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Actions
            </h3>

            <div className="space-y-3">
                <Button className="w-full flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
                    <ApperIcon name="Plus" size={20} className="text-primary" />
                    <span className="font-medium text-primary">Create New Test</span>
                </Button>

                <Button className="w-full flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-xl hover:bg-secondary/10 transition-colors">
                    <ApperIcon name="Calendar" size={20} className="text-secondary" />
                    <span className="font-medium text-secondary">Schedule Interview</span>
                </Button>

                <Button className="w-full flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors">
                    <ApperIcon name="Users" size={20} className="text-accent" />
                    <span className="font-medium text-accent">Invite Candidates</span>
                </Button>
            </div>
        </div>
    );
};

export default QuickActions;