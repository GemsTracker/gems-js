const useTimelineTokens = (() => {
  const getStatusClass = ((status) => {
    switch (status) {
      case 'in-progress':
      case 'requested':
        return 'open';
      case 'rejected':
        return 'missed';
      case 'completed':
        return 'answered';
      case 'draft':
        return 'waiting';
      default:
        break;
    }
    return null;
  });

  return {
    getStatusClass,
  };
});

export default useTimelineTokens;
