import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PageHeader = ({ activeTab }) => {
    return (
        <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-700 px-8 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 capitalize">
                        {activeTab === 'dashboard' ? 'Assessment Dashboard' : activeTab}
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 mt-1">
                        Manage your tests and interviews efficiently
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg">
                        <ApperIcon name="Plus" size={16} />
                        Create Test
                    </Button>
                    <Button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors shadow-lg">
                        <ApperIcon name="Calendar" size={16} />
                        Schedule Interview
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;