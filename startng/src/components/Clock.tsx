type Props = {
  hours: string;
  minutes: string;
  seconds: string;
};

function Digits({ value }: { value: string }) {
  return (
    <>
      {value.split('').map((char, index) => (
        <span className="clock-digit" key={`${index}-${char}`}>
          {char}
        </span>
      ))}
    </>
  );
}

/** hh : mm : ss, with each digit re-entering when it changes. */
export function Clock({ hours, minutes, seconds }: Props) {
  return (
    <div className="clock" aria-hidden="true">
      <Digits value={hours} />
      <span className="clock-colon">:</span>
      <Digits value={minutes} />
      <span className="clock-colon">:</span>
      <Digits value={seconds} />
    </div>
  );
}
