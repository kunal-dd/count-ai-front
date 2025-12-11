interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const now = new Date()
  const timestamp =
    now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    ", " +
    now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-medium">{title}</h1>
        {subtitle && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{timestamp}</span>
        <span className="rounded bg-chart-3/20 px-2 py-0.5 text-xs font-medium text-chart-3">Live</span>
      </div>
    </div>
  )
}
