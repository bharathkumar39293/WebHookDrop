import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: 'pending' | 'delivered' | 'retrying' | 'dead';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        pending: 'bg-gray-100 text-gray-800 border-gray-200',
        delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        retrying: 'bg-amber-100 text-amber-800 border-amber-200',
        dead: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    return (
        <span className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider',
            styles[status]
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
