import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CandidateRow = ({ candidate, getStatusColor }) => {
    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
        >
            <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {candidate.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                        {candidate.name}
                    </span>
                </div>
            </td>
            <td className="py-4 px-2 text-surface-600 dark:text-surface-400">
                {candidate.email}
            </td>
            <td className="py-4 px-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                </span>
            </td>
            <td className="py-4 px-2">
                {candidate.score ? (
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                        {candidate.score}%
                    </span>
                ) : (
                    <span className="text-surface-400">-</span>
                )}
            </td>
            <td className="py-4 px-2">
                <div className="flex items-center gap-2">
                    <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                        <ApperIcon name="Eye" size={16} className="text-surface-600 dark:text-surface-400" />
                    </Button>
                    <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                        <ApperIcon name="Edit" size={16} className="text-surface-600 dark:text-surface-400" />
                    </Button>
                    <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                        <ApperIcon name="Mail" size={16} className="text-surface-600 dark:text-surface-400" />
                    </Button>
                </div>
            </td>
        </motion.tr>
    );
};

export default CandidateRow;