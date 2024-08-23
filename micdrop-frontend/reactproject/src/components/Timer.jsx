import React, { useState, useEffect } from 'react';

const Timer = ({ seconds, onTimeOver }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timerId);
    } else {
      onTimeOver();
    }
  }, [timeLeft, onTimeOver]);

  return (
    <div className="timer-container">
      <div className="timer-circle">
        <div className="timer-text">{timeLeft}s</div>
      </div>
    </div>
  );
};

export default Timer;
