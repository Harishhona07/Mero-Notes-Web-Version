import { MdAdd } from 'react-icons/md'

interface PrimaryButtonProps {
  label: string
  onClick: () => void
}

export default function PrimaryButton({ label, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 shadow-sm transition-all active:scale-95 cursor-pointer"
    >
      <MdAdd className="text-xl" />
      <span>{label}</span>
    </button>
  )
}
