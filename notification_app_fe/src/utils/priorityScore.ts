// priority scoring logic - same as stage 1 backend
// placement > result > event, then recency as tiebreaker

export type NotificationType = 'Placement' | 'Result' | 'Event';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  viewed?: boolean;
}

const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function toUnix(timestamp: string): number {
  return Math.floor(new Date(timestamp).getTime() / 1000);
}

export function getPriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const time = toUnix(notification.Timestamp);
  return weight * 1000000 + time;
}

export function getTopN(
  notifications: Notification[],
  n: number
): Notification[] {
  return [...notifications]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, n);
}