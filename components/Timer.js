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
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
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
    return () => clearInterval();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-24 lg:mt-0">
      <div className=" p-4 bg-rose-100 text-rose-600 rounded-3xl max-w-lg  mt-4">
        <div className="font-mono flex justify-between px-2 text-4xl md:text-7xl font-normal">
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
