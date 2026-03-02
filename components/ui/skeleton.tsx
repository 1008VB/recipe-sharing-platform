import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  const classes = ['animate-pulse rounded-md bg-zinc-800/80', className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes} aria-hidden="true" {...props} />
}
