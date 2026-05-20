interface Props {
  size?: number
}

export function ClawLogo({ size = 40 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MTAI CLAW logo mark"
    >
      {/* Black circle background */}
      <circle cx="20" cy="20" r="20" fill="#0A0A0A" />

      {/* Claw mark — three diagonal slash strokes in 24K gold */}
      <line x1="10" y1="30" x2="18" y2="10" stroke="#F8BB1A" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="16" y1="32" x2="24" y2="10" stroke="#BF9A36" strokeWidth="3"   strokeLinecap="round" />
      <line x1="22" y1="32" x2="30" y2="12" stroke="#FBDB79" strokeWidth="2.5" strokeLinecap="round" />

      {/* Subtle gold arc at bottom */}
      <path d="M10 30 Q20 36 30 30" stroke="#F8BB1A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  )
}
