import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AssessmentCard = ({ assessment, getDateLabel, getStatusColor, onStartAssessment }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-md transition-all duration-200"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    assessment.type === 'test' ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
                    <ApperIcon
                        name={assessment.type === 'test' ? 'FileText' : 'Video'}
                        size={20}
                        className={assessment.type === 'test' ? 'text-primary' : 'text-secondary'}
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                        {assessment.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                            {getDateLabel(assessment.scheduledDate)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(assessment.status)}`}>
                            {assessment.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {assessment.status === 'active' && (
                    <Button
                        onClick={() => onStartAssessment(assessment)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Start
                    </Button>
                )}
                <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                    <ApperIcon name="MoreHorizontal" size={16} className="text-surface-600 dark:text-surface-400" />
                </Button>
            </div>
        </motion.div>
    );
};

export default AssessmentCard;