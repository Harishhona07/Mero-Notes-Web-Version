'use client'

import { MdWarning, MdInfo, MdDelete } from 'react-icons/md'

type Variant = 'confirm' | 'danger' | 'info'

interface AlertDialogProps {
  open: boolean
  variant?: Variant
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

const variantConfig = {
  confirm: {
    Icon: MdDelete,
    iconClass: 'text-red-500',
    iconBg: 'bg-red-100 dark:bg-red-950/40',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  danger: {
    Icon: MdWarning,
    iconClass: 'text-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-950/40',
    confirmClass: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  info: {
    Icon: MdInfo,
    iconClass: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-950/40',
    confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
}

export default function AlertDialog({
  open,
  variant = 'confirm',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  if (!open) return null

  const { Icon, iconClass, iconBg, confirmClass } = variantConfig[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-3xl shadow-xl w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
            <Icon className={`text-3xl ${iconClass}`} />
          </div>

          {/* Text */}
          <h2 className="text-xl font-extrabold text-foreground mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-full bg-secondary text-foreground font-semibold hover:bg-muted transition-colors active:scale-95 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all active:scale-95 cursor-pointer ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
