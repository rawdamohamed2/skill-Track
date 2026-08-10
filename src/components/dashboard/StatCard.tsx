interface StatCardProps {
  label: string;
  value: string;
  accent: "primary" | "secondary" | "tertiary" | "destructive";
  hint?: string;
}

const ACCENT_STYLES = {
  primary: {
    border: "border-primary/30",
    text: "text-primary",
  },
  secondary: {
    border: "border-secondary/30",
    text: "text-secondary",
  },
  tertiary: {
    border: "border-tertiary/30",
    text: "text-tertiary",
  },
  destructive: {
    border: "border-destructive/30",
    text: "text-destructive",
  },
} as const;

export default function StatCard({
  label,
  value,
  accent,
  hint,
}: StatCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className={`rounded-lg border bg-card p-4 ${styles.border}`}>
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className={`mt-1.5 font-display text-2xl ${styles.text}`}>{value}</p>

      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
