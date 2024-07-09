const formatTimestamp = (timestamp, isday) => {
  // if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Function to format time without seconds
  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (diffDays <= 7 && isday) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
      return `Today at ${formatTime(date)}`;
    } else if (date >= yesterday) {
      return `Yesterday at ${formatTime(date)}`;
    } else {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return `${days[date.getDay()]} at ${formatTime(date)}`;
    }
  } else {
    return `${date.toLocaleDateString()} ${formatTime(date)}`;
  }
};

export default formatTimestamp;
