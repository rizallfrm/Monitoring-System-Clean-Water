export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const getStatusColor = (status) => {
  const statusColors = {
    Pending: 'warning',
    'On-Going': 'info',
    Completed: 'success',
    Cancelled: 'error',
  };
  return statusColors[status] || 'default';
};