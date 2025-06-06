import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const StatsOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Active Tests"
                value={stats.activeTests}
                icon="FileText"
                iconBgColor="bg-primary/10"
                iconTextColor="text-primary"
            />
            <StatCard
                title="Pending Interviews"
                value={stats.pendingInterviews}
                icon="Video"
                iconBgColor="bg-secondary/10"
                iconTextColor="text-secondary"
            />
            <StatCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon="TrendingUp"
                iconBgColor="bg-green-500/10"
                iconTextColor="text-green-500"
            />
            <StatCard
                title="Total Candidates"
                value={stats.totalCandidates}
                icon="Users"
                iconBgColor="bg-accent/10"
                iconTextColor="text-accent"
            />
        </div>
    );
};

export default StatsOverview;