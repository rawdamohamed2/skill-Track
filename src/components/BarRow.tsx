interface BarRowProps {
  label: string;
  sublabel?: string;
  percent: number;
  accent: string;
}

export default function BarRow({
  label,
  sublabel,
  percent,
  accent,
}: BarRowProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-foreground">{label}</span>

        <span className="font-mono text-xs text-muted-foreground">
          {sublabel ?? `${Math.round(clamped)}%`}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clamped}%`,
            backgroundColor: accent,
          }}
        />
      </div>
    </div>
  );
}
