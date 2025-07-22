/**
 * Utility functions for handling Jakarta timezone (UTC+7)
 */

// Convert UTC timestamp to Jakarta time
const toJakartaTime = (utcTimestamp) => {
  if (!utcTimestamp) return null;
  
  const date = new Date(utcTimestamp);
  // Jakarta is UTC+7
  const jakartaOffset = 7 * 60; // 7 hours in minutes
  const utcOffset = date.getTimezoneOffset(); // Get local timezone offset
  
  // Adjust to Jakarta time
  const jakartaTime = new Date(date.getTime() + (jakartaOffset + utcOffset) * 60000);
  return jakartaTime.toISOString();
};

// Convert Jakarta time to UTC
const fromJakartaTime = (jakartaTimestamp) => {
  if (!jakartaTimestamp) return null;
  
  const date = new Date(jakartaTimestamp);
  // Jakarta is UTC+7
  const jakartaOffset = 7 * 60; // 7 hours in minutes
  const utcOffset = date.getTimezoneOffset(); // Get local timezone offset
  
  // Adjust to UTC
  const utcTime = new Date(date.getTime() - (jakartaOffset + utcOffset) * 60000);
  return utcTime.toISOString();
};

// Get current Jakarta time
const getCurrentJakartaTime = () => {
  const now = new Date();
  return toJakartaTime(now.toISOString());
};

// Format date for Jakarta timezone
const formatJakartaDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return null;
  
  const jakartaDate = new Date(toJakartaTime(date));
  
  switch (format) {
    case 'YYYY-MM-DD':
      return jakartaDate.toISOString().split('T')[0];
    case 'DD/MM/YYYY':
      return jakartaDate.toLocaleDateString('id-ID');
    case 'DD/MM/YYYY HH:mm':
      return jakartaDate.toLocaleString('id-ID');
    default:
      return jakartaDate.toISOString();
  }
};

// Format time for Jakarta timezone
const formatJakartaTime = (time, format = 'HH:mm:ss') => {
  if (!time) return null;
  
  const jakartaTime = new Date(toJakartaTime(time));
  
  switch (format) {
    case 'HH:mm':
      return jakartaTime.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    case 'HH:mm:ss':
      return jakartaTime.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      });
    default:
      return jakartaTime.toLocaleTimeString('id-ID', { hour12: false });
  }
};

module.exports = {
  toJakartaTime,
  fromJakartaTime,
  getCurrentJakartaTime,
  formatJakartaDate,
  formatJakartaTime
}; 