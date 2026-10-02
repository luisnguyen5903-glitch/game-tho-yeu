import React from 'react';
import { CharmCategory } from '../types/game';

interface GemstoneGraphicProps {
  category: CharmCategory;
  color?: string;
  size?: number; // size in px, default 28
  sparkle?: boolean;
}

export const GemstoneGraphic: React.FC<GemstoneGraphicProps> = ({
  category,
  color = '#CFFAFE',
  size = 28,
  sparkle = false,
}) => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Crystal Aurora Gradient */}
          <linearGradient id={`gemGrad_${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor={color} />
            <stop offset="70%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>

          {/* Pearl Soft Sheen */}
          <radialGradient id="pearlShine" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFFBEB" />
            <stop offset="85%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Gold Metallic */}
          <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Silver Chrome */}
          <linearGradient id="silverSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* 1. Crystal / Aurora Round Faceted Swarovski */}
        {(category === 'crystal' || category === 'aurora' || category === 'rhinestone') && (
          <g>
            {/* Outer Octagon Base */}
            <polygon
              points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
              fill={`url(#gemGrad_${category})`}
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* Inner Facet Star Table */}
            <polygon
              points="40,25 60,25 75,40 75,60 60,75 40,75 25,60 25,40"
              fill="#FFFFFF"
              fillOpacity="0.45"
            />
            {/* Facet Corner Lines */}
            <line x1="30" y1="5" x2="40" y2="25" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="70" y1="5" x2="60" y2="25" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="95" y1="30" x2="75" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="95" y1="70" x2="75" y2="60" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="70" y1="95" x2="60" y2="75" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="30" y1="95" x2="40" y2="75" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="5" y1="70" x2="25" y2="60" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="5" y1="30" x2="25" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          </g>
        )}

        {/* 2. Pearl Round Sea Luster */}
        {category === 'pearl' && (
          <g>
            <circle cx="50" cy="50" r="44" fill="url(#pearlShine)" stroke="#E5E7EB" strokeWidth="1.5" />
            <ellipse cx="38" cy="35" rx="14" ry="9" fill="#FFFFFF" fillOpacity="0.85" />
          </g>
        )}

        {/* 3. Gold Bow Charm */}
        {category === 'bow' && (
          <g fill="url(#goldSheen)" stroke="#78350F" strokeWidth="2">
            {/* Left wing loop */}
            <path d="M50,50 C20,20 10,65 50,55 Z" />
            {/* Right wing loop */}
            <path d="M50,50 C80,20 90,65 50,55 Z" />
            {/* Center knot */}
            <circle cx="50" cy="52" r="9" fill="#FDE047" />
            {/* Ribbons hanging */}
            <path d="M46,56 Q35,75 25,90 Q40,85 48,60 Z" />
            <path d="M54,56 Q65,75 75,90 Q60,85 52,60 Z" />
          </g>
        )}

        {/* 4. Silver Hologram Butterfly Charm */}
        {category === 'butterfly' && (
          <g fill="url(#silverSheen)" stroke="#475569" strokeWidth="1.5">
            {/* Upper wings */}
            <path d="M50,50 C20,10 5,35 48,50 Z" />
            <path d="M50,50 C80,10 95,35 52,50 Z" />
            {/* Lower wings */}
            <path d="M50,50 C25,65 15,85 48,52 Z" />
            <path d="M50,50 C75,65 85,85 52,52 Z" />
            {/* Body */}
            <line x1="50" y1="30" x2="50" y2="70" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="27" r="4" fill="#38BDF8" />
          </g>
        )}

        {/* 5. Heart Gem Cut */}
        {category === 'heart' && (
          <g>
            <path
              d="M50,85 C15,60 5,30 25,15 C40,5 48,25 50,28 C52,25 60,5 75,15 C95,30 85,60 50,85 Z"
              fill="#F43F5E"
              stroke="#881337"
              strokeWidth="2"
            />
            {/* Facet lines */}
            <polygon points="50,45 35,28 50,68 65,28" fill="#FDA4AF" fillOpacity="0.6" />
            <circle cx="34" cy="25" r="5" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        )}

        {/* 6. Baguette Cut Emerald Rectangle */}
        {category === 'baguette' && (
          <g>
            <rect x="20" y="10" width="60" height="80" rx="6" fill={`url(#gemGrad_${category})`} stroke="#0284C7" strokeWidth="2" />
            <rect x="32" y="22" width="36" height="56" rx="3" fill="#FFFFFF" fillOpacity="0.5" />
            <line x1="20" y1="10" x2="32" y2="22" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="80" y1="10" x2="68" y2="22" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="20" y1="90" x2="32" y2="78" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="80" y1="90" x2="68" y2="78" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        )}

        {/* 7. Teardrop Opal Gem */}
        {category === 'teardrop' && (
          <g>
            <path
              d="M50,5 C50,5 88,50 88,70 C88,88 72,95 50,95 C28,95 12,88 12,70 C12,50 50,5 50,5 Z"
              fill={`url(#gemGrad_${category})`}
              stroke="#0284C7"
              strokeWidth="2"
            />
            <ellipse cx="42" cy="65" rx="20" ry="14" fill="#FFFFFF" fillOpacity="0.6" />
            <circle cx="38" cy="55" r="6" fill="#FFFFFF" />
          </g>
        )}

        {/* 8. Flower Daisy Charm */}
        {category === 'flower' && (
          <g>
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <circle
                key={i}
                cx={50 + 26 * Math.cos((angle * Math.PI) / 180)}
                cy={50 + 26 * Math.sin((angle * Math.PI) / 180)}
                r="18"
                fill="#FEF9C3"
                stroke="#CA8A04"
                strokeWidth="1.5"
              />
            ))}
            {/* Center pistil */}
            <circle cx="50" cy="50" r="14" fill="#EAB308" stroke="#854D0E" strokeWidth="2" />
          </g>
        )}

        {/* 9. Metallic Beads */}
        {category === 'metallic' && (
          <g fill="url(#goldSheen)" stroke="#78350F" strokeWidth="1.5">
            <circle cx="25" cy="50" r="16" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="75" cy="50" r="16" />
            <circle cx="45" cy="42" r="5" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        )}

        {/* 10. Diamond Marquise */}
        {category === 'diamond' && (
          <g>
            <path
              d="M50,5 C75,30 90,50 50,95 C10,50 25,30 50,5 Z"
              fill={`url(#gemGrad_${category})`}
              stroke="#10B981"
              strokeWidth="2"
            />
            <polygon points="50,25 70,50 50,75 30,50" fill="#FFFFFF" fillOpacity="0.55" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        )}

        {/* High sparkle glint if enabled */}
        {sparkle && (
          <polygon
            points="75,20 78,28 86,30 78,32 75,40 72,32 64,30 72,28"
            fill="#FFFFFF"
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
};
