import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import CandidateRow from '@/components/molecules/CandidateRow';

const CandidateManagementTable = ({ candidates, getStatusColor }) => {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Candidate Management
                </h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <Input
                            type="text"
                            placeholder="Search candidates..."
                            className="pl-10 pr-4 py-2" // Adjust padding as Input component already has base padding
                        />
                    </div>
                    <Button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                        Add Candidate
                    </Button>
                </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-200 dark:border-surface-700">
                            <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Name</th>
                            <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Email</th>
                            <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Status</th>
                            <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Score</th>
                            <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates?.map((candidate) => (
                            <CandidateRow
                                key={candidate.id}
                                candidate={candidate}
                                getStatusColor={getStatusColor}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CandidateManagementTable;