import React from 'react';
import { cn } from '@/lib/utils';

export interface Activity {
  id: string;
  type: 'upload' | 'review' | 'update' | 'approve' | 'submit';
  user: string;
  userAvatar?: string;
  tradeId?: string;
  timestamp: string;
  description: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  onTradeClick?: (tradeId: string) => void;
  className?: string;
}

interface ActivityItemProps {
  activity: Activity;
  onTradeClick?: (tradeId: string) => void;
}

const activityIcons = {
  upload: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  review: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  update: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  approve: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  submit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
};

const activityColors = {
  upload: 'bg-green-600',
  review: 'bg-blue-600',
  update: 'bg-orange-600',
  approve: 'bg-purple-600',
  submit: 'bg-red-600',
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onTradeClick }) => {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-800/30 transition-colors duration-200">
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center text-white',
        activityColors[activity.type]
      )}>
        {activityIcons[activity.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="font-medium text-gray-100 truncate">{activity.user}</span>
          <span className="text-sm text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
        </div>
        <p className="text-sm text-gray-300">
          {activity.description}
          {activity.tradeId && (
            <>
              {' '}
              <button
                onClick={() => onTradeClick?.(activity.tradeId!)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {activity.tradeId}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading,
  onTradeClick,
  className
}) => {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading activities...</span>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-gray-400', className)}>
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">No recent activities to display</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-800', className)}>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onTradeClick={onTradeClick}
        />
      ))}
    </div>
  );
};