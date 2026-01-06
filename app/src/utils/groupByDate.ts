import { Call, GroupedCalls } from '@/types/call';

export const groupByDate = (calls: Call[]): GroupedCalls => {
  const grouped: GroupedCalls = {};

  calls.forEach((call) => {
    const date = new Date(call.created_at);
    const dateKey = getDateLabel(date);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(call);
  });

  return grouped;
};

export const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateString = date.toDateString();
  const todayString = today.toDateString();
  const yesterdayString = yesterday.toDateString();

  if (dateString === todayString) {
    return 'Today';
  } else if (dateString === yesterdayString) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};