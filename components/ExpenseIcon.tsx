interface ExpenseIconProps {
  className?: string;
  size?: number;
}

export function ExpenseIcon({ className = "", size = 120 }: ExpenseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradiente verde */}
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        
        {/* Gradiente dourado */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        
        {/* Sombra suave */}
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
      
      {/* Background Circle com gradiente */}
      <circle cx="60" cy="60" r="56" fill="url(#greenGradient)" opacity="0.1" />
      
      {/* Carteira - Base */}
      <rect 
        x="30" 
        y="45" 
        width="60" 
        height="42" 
        rx="6" 
        fill="url(#greenGradient)"
        filter="url(#shadow)"
      />
      
      {/* Detalhe da carteira - linha superior */}
      <rect 
        x="30" 
        y="45" 
        width="60" 
        height="12" 
        rx="6" 
        fill="#047857"
        opacity="0.3"
      />
      
      {/* Nota de dinheiro saindo */}
      <rect 
        x="40" 
        y="25" 
        width="40" 
        height="28" 
        rx="3" 
        fill="url(#goldGradient)"
        filter="url(#shadow)"
      />
      
      {/* Detalhes da nota */}
      <rect x="44" y="29" width="32" height="20" rx="2" fill="white" opacity="0.2" />
      <circle cx="60" cy="39" r="6" fill="white" opacity="0.4" />
      
      {/* Símbolo R$ na nota */}
      <text 
        x="60" 
        y="43" 
        textAnchor="middle" 
        fontSize="12" 
        fontWeight="bold" 
        fill="#78350F"
      >
        R$
      </text>
      
      {/* Gráfico de linha ascendente */}
      <g transform="translate(35, 55)">
        <path
          d="M 2 25 L 12 18 L 22 20 L 32 12 L 42 8 L 50 4"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        
        {/* Pontos no gráfico */}
        <circle cx="2" cy="25" r="2" fill="white" opacity="0.9" />
        <circle cx="12" cy="18" r="2" fill="white" opacity="0.9" />
        <circle cx="22" cy="20" r="2" fill="white" opacity="0.9" />
        <circle cx="32" cy="12" r="2" fill="white" opacity="0.9" />
        <circle cx="42" cy="8" r="2" fill="white" opacity="0.9" />
        <circle cx="50" cy="4" r="2.5" fill="white" opacity="0.9" />
      </g>
      
      {/* Badge de controle */}
      <circle 
        cx="85" 
        cy="75" 
        r="14" 
        fill="white" 
        filter="url(#shadow)"
      />
      <circle 
        cx="85" 
        cy="75" 
        r="11" 
        fill="url(#greenGradient)"
      />
      
      {/* Ícone de check no badge */}
      <path
        d="M 80 75 L 83 78 L 90 71"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

