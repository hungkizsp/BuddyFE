export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  return <button type={type} className={`btn ${variantClass} ${className}`.trim()} {...props} />
}
