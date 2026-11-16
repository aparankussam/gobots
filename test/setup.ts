import { vi } from 'vitest'
import { createElement } from 'react'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; className?: string }) =>
    createElement('img', { src: props.src, alt: props.alt, className: props.className }),
}))
