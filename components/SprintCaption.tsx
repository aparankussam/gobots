import { CALL_CAPTION } from '@/content/sprint'

/** What the primary button costs the visitor. Shown under every Production Sprint button. */
export default function SprintCaption({ className = '' }: { className?: string }) {
  return <p className={`text-[13.5px] leading-snug ${className}`}>{CALL_CAPTION}</p>
}
