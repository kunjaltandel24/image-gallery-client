import clsx, { ClassDictionary } from 'clsx'

interface IBadgeProps {
  className?: string | ClassDictionary,
  title: string
  color?: string | null
  outline?: string | null
  rounded?: boolean | null
  icon?: string | null
  onClick?: Function
  data?: any
}

const Badge = (props: IBadgeProps) => {
  const {
    className,
    title,
    color,
    outline,
    rounded,
    onClick,
    data,
    // icon
  } = props
  return (
    <span
      onClick={() => onClick && onClick(data)}
      className={clsx(
        'badge',
        color ? `badge-${color}` : 'badge-default',
        outline && `badge-outline-${outline}`,
        rounded && 'rounded-full',
        className
      )}
    >
      {title}
    </span>
  )
}

export default Badge
