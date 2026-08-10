interface LevelRingProps {
  percent: number;
  accent: string;
  size?: number;
  label?: string;
}

const SEGMENTS = 5;
const GAP_DEG = 8;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function LevelRing({
  percent,
  accent,
  size = 90,
  label,
}: LevelRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const level =
    clamped <= 0 ? 0 : Math.max(1, Math.min(SEGMENTS, Math.ceil(clamped / 20)));
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const sweep = 360 / SEGMENTS;

  return (
    <div
      className="relative shrink-0 "
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Level ${level} of ${SEGMENTS}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const start = i * sweep + GAP_DEG / 2;
          const end = (i + 1) * sweep - GAP_DEG / 2;
          const filled = i < level;
          return (
            <path
              key={i}
              d={arcPath(cx, cy, r, start, end)}
              fill="none"
              stroke={filled ? accent : "var(--outline)"}
              strokeWidth={3.5}
              strokeLinecap="round"
              style={{ transition: "stroke 0.3s ease" }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-mono text-[11px] tabular-nums text-primary">
          {level}/5
        </span>
      </div>
    </div>
  );
}
