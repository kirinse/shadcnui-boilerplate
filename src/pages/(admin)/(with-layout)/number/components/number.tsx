interface NumberProps {
  number: string
}

export function NumberComp(props: NumberProps) {
  const { number } = props
  return (
    <span className="mx-1 inline-flex items-center justify-between gap-1 text-xs sm:text-sm">
      {number.split("").map((n, idx) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <span key={`${n}-${idx}`} className="inline-flex aspect-square size-full items-center justify-center rounded-full bg-sidebar-primary p-2 text-sidebar-primary-foreground">{n}</span>
      ))}
    </span>
  )
}
