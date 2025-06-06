import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AssessmentCard from '@/components/molecules/AssessmentCard';

const AssessmentCalendar = ({ assessments, getDateLabel, getStatusColor, onStartAssessment }) => {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Assessment Calendar
                </h3>
                <div className="flex items-center gap-2">
                    <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                        <ApperIcon name="ChevronLeft" size={20} className="text-surface-600 dark:text-surface-400" />
                    </Button>
                    <span className="text-surface-900 dark:text-surface-100 font-medium px-4">
                        {format(new Date(), 'MMMM yyyy')}
                    </span>
                    <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                        <ApperIcon name="ChevronRight" size={20} className="text-surface-600 dark:text-surface-400" />
                    </Button>
                </div>
            </div>

            {/* Upcoming Assessments */}
            <div className="space-y-3">
                {assessments?.slice(0, 5)?.map((assessment) => (
                    <AssessmentCard
                        key={assessment.id}
                        assessment={assessment}
                        getDateLabel={getDateLabel}
                        getStatusColor={getStatusColor}
                        onStartAssessment={onStartAssessment}
                    />
                ))}
            </div>
        </div>
    );
};

export default AssessmentCalendar;