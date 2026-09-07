import { getMillisecondsUntilTomorrow } from '@utils/helpers';
import { useEffect, useState } from 'react';

export function useDayCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = getMillisecondsUntilTomorrow();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Pad with zeros (e.g., "09:05:01")
      const formatted = [hours, minutes, seconds]
        .map((n) => n.toString().padStart(2, '0'))
        .join(':');

      setTimeLeft(formatted);
    };

    calculateTimeLeft(); // Run immediately
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}
