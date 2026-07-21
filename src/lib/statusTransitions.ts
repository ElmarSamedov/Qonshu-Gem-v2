export function isValidTransition(currentStatus: string, newStatus: string): boolean {
  if (currentStatus === 'pending') {
    return newStatus === 'resolved' || newStatus === 'dismissed';
  }
  if (currentStatus === 'resolved') {
    return newStatus === 'pending'; // Re-open
  }
  if (currentStatus === 'dismissed') {
    return newStatus === 'pending'; // Re-open
  }
  return false;
}
