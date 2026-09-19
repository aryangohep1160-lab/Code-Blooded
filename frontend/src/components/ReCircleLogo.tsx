interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

export default function ReCircleLogo({ 
  size = 36, 
  showText = true, 
  textColor = 'var(--moss)',
  subtextColor = 'var(--fern)'
}: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(13, 51, 36, 0.35))', flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="rcGradSprout" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B5F15A" />
            <stop offset="100%" stopColor="#3DD598" />
          </linearGradient>
          <linearGradient id="rcGradForest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#081F14" />
            <stop offset="60%" stopColor="#0E3D2B" />
            <stop offset="100%" stopColor="#1B6D46" />
          </linearGradient>
        </defs>
        
        {/* Background rounded badge */}
        <rect width="48" height="48" rx="14" fill="url(#rcGradForest)" />
        
        {/* Outer subtle glow ring */}
        <rect x="1" y="1" width="46" height="46" rx="13" stroke="rgba(181, 241, 90, 0.25)" strokeWidth="1.5" />
        
        {/* Top cycle curve with arrow */}
        <path
          d="M24 11C16.82 11 11 16.82 11 24C11 27.2 12.16 30.13 14.1 32.4L16.6 29.9C15.3 28.25 14.5 26.2 14.5 24C14.5 18.75 18.75 14.5 24 14.5C26.75 14.5 29.2 15.65 30.9 17.5L27 21.4H36V12.4L33.2 15.2C30.9 12.6 27.6 11 24 11Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        
        {/* Bottom cycle curve with arrow */}
        <path
          d="M24 37C31.18 37 37 31.18 37 24C37 20.8 35.84 17.87 33.9 15.6L31.4 18.1C32.7 19.75 33.5 21.8 33.5 24C33.5 29.25 29.25 33.5 24 33.5C21.25 33.5 18.8 32.35 17.1 30.5L21 26.6H12V35.6L14.8 32.8C17.1 35.4 20.4 37 24 37Z"
          fill="url(#rcGradSprout)"
        />
        
        {/* Center glowing sprout seed */}
        <circle cx="24" cy="24" r="3.5" fill="url(#rcGradSprout)" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            color: textColor,
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>
            Re<span style={{ color: '#B5F15A' }}>Circle</span>
          </span>
          <span style={{ 
            fontSize: '9px', 
            fontWeight: 700, 
            color: subtextColor, 
            textTransform: 'uppercase', 
            letterSpacing: '1.2px',
            marginTop: '2px'
          }}>
            Circular OS
          </span>
        </div>
      )}
    </div>
  );
}
