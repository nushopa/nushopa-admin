import { format } from 'date-fns';

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

// Function to format date headings
const formatDateHeading = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM dd, yyyy'); // Format as "October 13, 2024"
  }
};

// Function to group messages by date
export const groupMessagesByDate = (messages) => {
  const groupedMessages = {};

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp);
    const dateHeading = formatDateHeading(messageDate);

    if (!groupedMessages[dateHeading]) {
      groupedMessages[dateHeading] = [];
    }

    groupedMessages[dateHeading].push(message);
  });

  return groupedMessages;
};