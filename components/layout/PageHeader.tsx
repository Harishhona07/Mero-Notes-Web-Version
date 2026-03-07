import PrimaryButton from '@/components/ui/PrimaryButton'

interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

export default function PageHeader({ title, subtitle, buttonLabel, onButtonClick }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-medium">{subtitle}</p>
        )}
      </div>
      {buttonLabel && onButtonClick && (
        <div className="shrink-0">
          <PrimaryButton label={buttonLabel} onClick={onButtonClick} />
        </div>
      )}
    </div>
  )
}
