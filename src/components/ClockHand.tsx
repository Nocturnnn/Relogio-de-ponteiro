type ClockHandProps = {
  angle: number;
  kind: "hour" | "minute" | "second";
};

export function ClockHand({ angle, kind }: ClockHandProps) {
  return (
    <div
      className={`clock-hand clock-hand--${kind}`}
      style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      aria-hidden="true"
    />
  );
}
