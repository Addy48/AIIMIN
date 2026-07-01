import CountUp from 'react-countup';

export default function AnimatedNumber({
  value,
  duration = 0.4,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}) {
  const num = Number(value) || 0;
  return (
    <span className={`tabular-nums ${className}`.trim()}>
      <CountUp
        end={num}
        duration={duration}
        suffix={suffix}
        prefix={prefix}
        decimals={decimals}
        preserveValue
      />
    </span>
  );
}
