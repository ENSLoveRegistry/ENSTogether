import React, { useState, useMemo, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

const Timer = ({ deadline }) => {
  const ONE_DAY = 60 * 60 * 24;
  const ONE_HOUR = 60 * 60;
  const ONE_MINUTE = 60;
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const diffInSeconds = differenceInSeconds(deadline, currentTime);

  const getCoundown = () => {
    if (diffInSeconds < 1) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const days = Math.floor(diffInSeconds / ONE_DAY);
    const hours = Math.floor((diffInSeconds - days * ONE_DAY) / ONE_HOUR);
    const minutes = Math.floor(
      (diffInSeconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE
    );
    const seconds =
      diffInSeconds - days * ONE_DAY - hours * ONE_HOUR - minutes * ONE_MINUTE;

    if (days < 10) days = `0${days}`;
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const countdown = useMemo(getCoundown, [currentTime]);

  useEffect(() => {
    setInterval(() => {
      const now = new Date().getTime();
      setCurrentTime(now);
    }, 1000);
    return;
  }, []);

  return (
    <div>
      <p>COUNTDOWN</p>
      <div className="flex flex-col justify-center p-4 bg-stone-900 text-stone-100 rounded-3xl max-w-md">
        <div className="flex justify-between px-2 text-2xl">
          <span>{countdown.days} </span>
          <span>:</span>
          <span>{countdown.hours}</span>
          <span>:</span>
          <span>{countdown.minutes}</span>
          <span>:</span>
          <span>{countdown.seconds}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
