import { useEffect, useMemo, useState } from "react";
import { ClockHand } from "./ClockHand";

function getAngles(date: Date) {
  const milliseconds = date.getMilliseconds();
  const seconds = date.getSeconds() + milliseconds / 1000;
  const minutes = date.getMinutes() + seconds / 60;
  const hours = date.getHours() % 12;

  return {
    second: seconds * 6,
    minute: minutes * 6,
    hour: hours * 30 + date.getMinutes() * 0.5,
  };
}

export function AnalogClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 50);

    return () => window.clearInterval(intervalId);
  }, []);

  const markers = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        index,
        angle: index * 6,
        isHour: index % 5 === 0,
        isCardinal: index % 15 === 0,
      })),
    [],
  );

  const numerals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const value = index === 0 ? 12 : index;
        const angle = index * 30;
        const radians = (angle * Math.PI) / 180;
        const radius = 35.5;

        return {
          value,
          x: 50 + Math.sin(radians) * radius,
          y: 50 - Math.cos(radians) * radius,
          isCardinal: value % 3 === 0,
        };
      }),
    [],
  );

  const angles = getAngles(now);

  return (
    <main className="clock-stage" aria-label="Relogio analogico">
      <div className="clock-orbit" aria-hidden="true" />
      <div className="clock" role="img" aria-label="Relogio analogico com ponteiros em tempo real">
        <div className="clock__depth" aria-hidden="true" />
        <div className="clock__glass" aria-hidden="true" />
        <div className="clock__inner-ring" aria-hidden="true" />
        <div className="clock__markers" aria-hidden="true">
          {markers.map((marker) => (
            <span
              key={marker.index}
              className={[
                "clock-marker",
                marker.isHour ? "clock-marker--hour" : "",
                marker.isCardinal ? "clock-marker--cardinal" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ transform: `translateX(-50%) rotate(${marker.angle}deg)` }}
            />
          ))}
        </div>
        <div className="clock__numerals" aria-hidden="true">
          {numerals.map((numeral) => (
            <span
              key={numeral.value}
              className={`clock__numeral${numeral.isCardinal ? " clock__numeral--cardinal" : ""}`}
              style={{
                left: `${numeral.x}%`,
                top: `${numeral.y}%`,
              }}
            >
              {numeral.value}
            </span>
          ))}
        </div>
        <div className="clock__hands">
          <ClockHand kind="hour" angle={angles.hour} />
          <ClockHand kind="minute" angle={angles.minute} />
          <ClockHand kind="second" angle={angles.second} />
          <div className="clock__pin" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
