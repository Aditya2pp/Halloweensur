import React from 'react';

// Custom Illustrated Gold Coin
export const CoinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Dark outer border */}
    <circle cx="24" cy="24" r="22" fill="#3D1D04" stroke="#1A0A02" strokeWidth="2.5" />
    {/* Gold outer rim */}
    <circle cx="24" cy="24" r="19.5" fill="#E59B12" />
    {/* Inner shadow/bevel */}
    <circle cx="24" cy="24" r="17" fill="#F8BC1C" />
    <circle cx="24" cy="24" r="14.5" fill="#FFE153" />
    {/* Coin inner ring */}
    <circle cx="24" cy="24" r="12" stroke="#CA8208" strokeWidth="2.5" fill="#FDB813" />
    {/* Center Skull/Star Embellishment */}
    <path
      d="M24 16C21.2 16 19 18.2 19 21C19 22.8 20 24.3 21.5 25.2V27.5C21.5 28 22 28.5 22.5 28.5H25.5C26 28.5 26.5 28 26.5 27.5V25.2C28 24.3 29 22.8 29 21C29 18.2 26.8 16 24 16Z"
      fill="#D98A07"
      stroke="#7A4200"
      strokeWidth="1.5"
    />
    <circle cx="21.5" cy="21" r="1.5" fill="#603000" />
    <circle cx="26.5" cy="21" r="1.5" fill="#603000" />
    {/* Glossy top-left highlight */}
    <path
      d="M13 18C15 13 20 10 26 10C29 10 32 11 34 13"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

// Custom Illustrated Heart with Green Plus Upgrade Badge
export const HeartUpgradeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <path
        d="M32 55C32 55 10 40 10 24C10 16 16 10 24 10C28.5 10 32 13.5 32 13.5C32 13.5 35.5 10 40 10C48 10 54 16 54 24C54 40 32 55 32 55Z"
        fill="#120404"
        transform="translate(0, 3)"
        opacity="0.6"
      />
      {/* Dark Outer Outline */}
      <path
        d="M32 54C32 54 10 39 10 23C10 15 16.5 9 24.5 9C29 9 32 12.5 32 12.5C32 12.5 35 9 39.5 9C47.5 9 54 15 54 23C54 39 32 54 32 54Z"
        fill="#3E0808"
        stroke="#1E0303"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Red Heart Body */}
      <path
        d="M32 51C32 51 13 37 13 23C13 16.5 18 11.5 24.5 11.5C28.5 11.5 32 14.5 32 14.5C32 14.5 35.5 11.5 39.5 11.5C46 11.5 51 16.5 51 23C51 37 32 51 32 51Z"
        fill="url(#heartGradient)"
      />
      {/* Inner 3D Highlight */}
      <path
        d="M20 15C16 18 15 23 15 27"
        stroke="#FFA1A1"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="21" cy="16" r="2.5" fill="#FFFFFF" />
      {/* Gradients */}
      <defs>
        <linearGradient id="heartGradient" x1="32" y1="11" x2="32" y2="51" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="60%" stopColor="#D91E1E" />
          <stop offset="100%" stopColor="#870909" />
        </linearGradient>
      </defs>
    </svg>

    {/* Green '+' badge overlay */}
    <div className="absolute -bottom-1 -right-1">
      <PlusBadge size={size * 0.44} />
    </div>
  </div>
);

// Custom Illustrated Sword matching reference image (1) (Beveled steel blade, angular tip & notch, golden guard with ruby gem)
export const RubySwordIcon: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Dark Shadow */}
    <g transform="translate(2, 3)" opacity="0.5">
      <path
        d="M20 10L14 18L18 24L20 22L36 38L32 42L40 50L46 44L42 40L44 38L30 24L32 22L20 10Z"
        fill="#041208"
      />
    </g>

    {/* Sword Structure */}
    <g>
      {/* 1. BLADE - Main Outline */}
      {/* Blade Tip & Spine & Edge with notch at spine */}
      {/* Light facet (Top side of blade) */}
      <path
        d="M22 8L15 17L19 23L22 20L36 34L39 31L22 8Z"
        fill="#F8FAFC"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Shaded Dark Facet (Bottom side of blade) */}
      <path
        d="M22 8L39 31L35 35L19 23L22 8Z"
        fill="#94A3B8"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Chisel Point Apex Facet */}
      <path
        d="M22 8L15 17L22 17L22 8Z"
        fill="#E2E8F0"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Central Blade Ridge Line */}
      <path d="M22 8L36 34" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

      {/* White Specular Edge Highlight */}
      <path d="M20 10L16 16L18 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* 2. GOLDEN CROSSGUARD */}
      <path
        d="M33 30L44 41L47 38L42 33L47 28L43 25L38 30L33 25L30 28L35 33L30 38L33 41L38 36L33 30Z"
        fill="#EAB308"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Guard Bevel Highlight */}
      <path d="M37 28L43 34" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />

      {/* 3. CENTER RED RUBY GEM */}
      <rect
        x="34.5"
        y="30.5"
        width="8"
        height="8"
        transform="rotate(45 38.5 34.5)"
        fill="#DC2626"
        stroke="#7F1D1D"
        strokeWidth="1.8"
      />
      {/* Ruby Inner Facet Highlight */}
      <rect
        x="36"
        y="32"
        width="4"
        height="4"
        transform="rotate(45 38 34)"
        fill="#EF4444"
      />
      <circle cx="37" cy="33" r="1" fill="#FFFFFF" opacity="0.9" />

      {/* 4. GOLDEN GRIP & POMMEL */}
      {/* Grip */}
      <path
        d="M40 37L48 45"
        stroke="#CA8A04"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 37L48 45"
        stroke="#78350F"
        strokeWidth="2"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />

      {/* Circular Ring Pommel */}
      <circle
        cx="51"
        cy="48"
        r="6"
        fill="#EAB308"
        stroke="#78350F"
        strokeWidth="2.5"
      />
      <circle
        cx="51"
        cy="48"
        r="2.8"
        fill="#B45309"
        stroke="#78350F"
        strokeWidth="1.5"
      />
      <circle cx="49.5" cy="46.5" r="1.2" fill="#FEF08A" />
    </g>
  </svg>
);

// Custom Illustrated Bomb matching reference image (2) (Glossy black sphere, white shines, collar, ribbed fuse, fiery 12-point explosive spark)
export const BombIcon: React.FC<{ size?: number; className?: string; highlighted?: boolean }> = ({
  size = 42,
  className = '',
  highlighted = false,
}) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    {/* Pulse aura if highlighted */}
    {highlighted && (
      <div className="absolute inset-0 rounded-full bg-red-500/40 blur-md animate-pulse pointer-events-none" />
    )}
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]"
    >
      {/* 1. FIERY EXPLOSION STARBURST SPARK ON FUSE (Outer Red Spikes) */}
      <path
        d="M50 4L52 10L58 7L55 13L61 14L56 18L61 22L55 23L57 29L51 26L49 32L46 26L41 29L43 23L37 22L42 18L37 14L43 13L40 7L46 10L50 4Z"
        fill="#EF4444"
        stroke="#450A0A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inner Yellow/Orange Starburst Spikes */}
      <path
        d="M49 9L51 13L55 11L53 15L57 16L53 19L57 22L53 23L54 27L50 25L48 29L46 25L42 27L44 23L40 22L44 19L40 16L44 15L42 11L46 13L49 9Z"
        fill="#FDE047"
      />
      {/* Center White Hot Core */}
      <circle cx="49" cy="19" r="3.5" fill="#FFFFFF" />

      {/* 2. CURVED RIBBED ROPE FUSE */}
      <path
        d="M36 26C38 23 41 21 46 20"
        stroke="#D97706"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Fuse Ribs */}
      <path
        d="M38 27L37 24M41 24L40 21M44 22L43 19"
        stroke="#451A03"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 3. BOMB COLLAR / NECK */}
      <path
        d="M31 22L39 30L34 35L26 27L31 22Z"
        fill="#374151"
        stroke="#111827"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="33" cy="27" rx="6" ry="3" transform="rotate(45 33 27)" fill="#1F2937" />

      {/* 4. SPHERICAL BLACK BOMB BODY */}
      <circle
        cx="28"
        cy="37"
        r="19"
        fill="#18181B"
        stroke="#09090B"
        strokeWidth="3.5"
      />
      {/* Dark 3D Shading inner gradient */}
      <circle
        cx="26"
        cy="39"
        r="17"
        fill="url(#bombInnerShade)"
      />

      {/* 5. SMOOTH WHITE BUBBLE HIGHLIGHTS (Matching reference image 2) */}
      {/* Large Oval Highlight */}
      <ellipse
        cx="36"
        cy="33"
        rx="4.5"
        ry="7"
        transform="rotate(-15 36 33)"
        fill="#FFFFFF"
      />
      {/* Small Dot Highlight below */}
      <circle cx="34.5" cy="44" r="3" fill="#FFFFFF" />

      <defs>
        <radialGradient id="bombInnerShade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 33) rotate(50) scale(18)">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="50%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#09090B" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

// Custom Illustrated Sword with Green Plus Upgrade Badge
export const SwordUpgradeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <RubySwordIcon size={size} />

    {/* Green '+' badge overlay */}
    <div className="absolute -bottom-1 -right-1">
      <PlusBadge size={size * 0.44} />
    </div>
  </div>
);

// Green Plus Badge
export const PlusBadge: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dark outline */}
    <circle cx="16" cy="16" r="14" fill="#042010" stroke="#021008" strokeWidth="3" />
    {/* Green background */}
    <circle cx="16" cy="16" r="11" fill="url(#plusGrad)" />
    {/* Plus symbol */}
    <path
      d="M16 9V23M9 16H23"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="plusGrad" x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Illustrated Trophy Ranking Icon
export const TrophyIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Outline / Shadow Base */}
    <g stroke="#1A0D00" strokeWidth="2.5" strokeLinejoin="round">
      {/* Handles */}
      <path d="M12 16H8C6.9 16 6 16.9 6 18V22C6 26.4 9.6 30 14 30H15" fill="#D97706" />
      <path d="M36 16H40C41.1 16 42 16.9 42 18V22C42 26.4 38.4 30 34 30H33" fill="#D97706" />
      {/* Cup Body */}
      <path
        d="M13 12H35V23C35 29.1 30.1 34 24 34C17.9 34 13 29.1 13 23V12Z"
        fill="url(#trophyGrad)"
      />
      {/* Pedestal Stem */}
      <path d="M21 34H27V39H21V34Z" fill="#B45309" />
      {/* Pedestal Base */}
      <path d="M15 39H33V44H15V39Z" fill="#F59E0B" />
      {/* Star on Cup */}
      <path
        d="M24 17L25.8 20.8L30 21.4L26.9 24.3L27.6 28.5L24 26.5L20.4 28.5L21.1 24.3L18 21.4L22.2 20.8L24 17Z"
        fill="#FFFFFF"
        stroke="#92400E"
        strokeWidth="1"
      />
      {/* Highlight on rim */}
      <path d="M16 14H32" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
    </g>
    <defs>
      <linearGradient id="trophyGrad" x1="24" y1="12" x2="24" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Illustrated Settings Cog
export const SettingsCogIcon: React.FC<{ size?: number; className?: string }> = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Dark Border / Outer Gear Teeth */}
    <path
      d="M20.5 4H27.5L29 9.5L33.5 11.5L38.5 8.5L43.5 13.5L40.5 18.5L42.5 23L48 24.5V31.5L42.5 33L40.5 37.5L43.5 42.5L38.5 47.5L33.5 44.5L29 46.5L27.5 52H20.5L19 46.5L14.5 44.5L9.5 47.5L4.5 42.5L7.5 37.5L5.5 33L0 31.5V24.5L5.5 23L7.5 18.5L4.5 13.5L9.5 8.5L14.5 11.5L19 9.5L20.5 4Z"
      transform="scale(0.85) translate(4, 2)"
      fill="url(#cogGrad)"
      stroke="#0A160E"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Center Hole */}
    <circle
      cx="24"
      cy="24"
      r="7"
      fill="#0B1A12"
      stroke="#050C08"
      strokeWidth="2.5"
    />
    {/* Highlight ring */}
    <circle
      cx="24"
      cy="24"
      r="13"
      stroke="#A7F3D0"
      strokeWidth="1.5"
      strokeDasharray="4 6"
      opacity="0.5"
      fill="none"
    />
    <defs>
      <linearGradient id="cogGrad" x1="24" y1="4" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
  </svg>
);

// Spooky Chibi Skull (For Title and Emblems)
export const SpookySkullIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Dark outline */}
    <path
      d="M32 6C18 6 10 16 10 28C10 36 15 42 20 45V54C20 56 22 58 24 58H40C42 58 44 56 44 54V45C49 42 54 36 54 28C54 16 46 6 32 6Z"
      fill="#0E0502"
      stroke="#0E0502"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Bone skull surface */}
    <path
      d="M32 9C20 9 13 18 13 28C13 35 17 40 22 43V53C22 54.5 23.5 55.5 25 55.5H39C40.5 55.5 42 54.5 42 53V43C47 40 51 35 51 28C51 18 44 9 32 9Z"
      fill="url(#boneGrad)"
    />
    {/* Eye Sockets */}
    <ellipse cx="23" cy="27" rx="6" ry="7" fill="#0A0402" />
    <ellipse cx="41" cy="27" rx="6" ry="7" fill="#0A0402" />
    {/* Glowing Eye pupils */}
    <circle cx="23" cy="28" r="2.5" fill="#38BDF8" />
    <circle cx="41" cy="28" r="2.5" fill="#38BDF8" />
    <circle cx="24" cy="27" r="1" fill="#FFFFFF" />
    <circle cx="42" cy="27" r="1" fill="#FFFFFF" />
    {/* Nose cavity */}
    <path d="M32 33L30 38H34L32 33Z" fill="#0A0402" />
    {/* Teeth stitches */}
    <path d="M28 47V54M32 47V54M36 47V54" stroke="#0A0402" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="boneGrad" x1="32" y1="9" x2="32" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Illustrated Lightning Bolt ⚡ matching user design
export const LightningSpeedIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Dark Shadow / Drop */}
    <path
      d="M37 5L15 33H31L23 59L49 27H33L41 5H37Z"
      fill="#291202"
      transform="translate(2, 3)"
      opacity="0.6"
    />
    {/* Dark Heavy Cartoon Border */}
    <path
      d="M37 5L15 33H31L23 59L49 27H33L41 5H37Z"
      fill="#3A1501"
      stroke="#180700"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Outer Amber / Orange Bevel */}
    <path
      d="M36 7L17 32H31L24 55L47 28H33L40 7H36Z"
      fill="url(#lightningOuterGrad)"
    />
    {/* Inner Vibrant Golden Yellow Core */}
    <path
      d="M35 10L21 31H32L26 50L44 29H33L38 10H35Z"
      fill="url(#lightningInnerGrad)"
    />
    {/* Specular White Core Highlight */}
    <path
      d="M34 13L24 30H32L28 44L39 30H32L36 13H34Z"
      fill="#FFFFFF"
      opacity="0.9"
    />
    {/* Electric Spark Flecks */}
    <circle cx="15" cy="20" r="2" fill="#FEF08A" />
    <circle cx="49" cy="40" r="2.5" fill="#FEF08A" />
    <circle cx="42" cy="12" r="1.5" fill="#FFFFFF" />

    <defs>
      <linearGradient id="lightningOuterGrad" x1="32" y1="5" x2="32" y2="59" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="lightningInnerGrad" x1="32" y1="7" x2="32" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="35%" stopColor="#FDE047" />
        <stop offset="80%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Tiny Original 2D Retro Cartoon Ad/TV Icon (Used ONLY on Coins Bar and Watch Ad Bonus Button)
export const AdTvIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Antennas */}
    <line x1="16" y1="9" x2="9" y2="2" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="16" y1="9" x2="23" y2="2" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="9" cy="2" r="1.8" fill="#F59E0B" stroke="#451A03" strokeWidth="0.8" />
    <circle cx="23" cy="2" r="1.8" fill="#F59E0B" stroke="#451A03" strokeWidth="0.8" />

    {/* TV Body Outer Border */}
    <rect x="2.5" y="8.5" width="27" height="21" rx="4.5" fill="#451A03" stroke="#1A0A02" strokeWidth="1.8" />
    {/* Outer Amber Bezel */}
    <rect x="3.5" y="9.5" width="25" height="19" rx="3.5" fill="#D97706" />
    {/* Highlighted Gold Face */}
    <rect x="4.5" y="10.5" width="23" height="17" rx="2.8" fill="#F59E0B" />

    {/* TV Screen Display */}
    <rect x="5.5" y="11.5" width="16" height="15" rx="2" fill="#042F2E" stroke="#134E4A" strokeWidth="1" />
    <rect x="6.5" y="12.5" width="14" height="13" rx="1.5" fill="#0D9488" />

    {/* "AD" Text inside CRT Screen */}
    <text
      x="13.5"
      y="22.2"
      textAnchor="middle"
      fill="#FEF08A"
      fontSize="9"
      fontWeight="900"
      fontFamily="'Lilita One', 'Fredoka', sans-serif"
      letterSpacing="0.4"
      style={{
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))',
      }}
    >
      AD
    </text>

    {/* Screen Diagonal Gloss Reflection */}
    <path
      d="M7 13.5L15 13.5L7 21.5Z"
      fill="#FFFFFF"
      opacity="0.25"
    />

    {/* TV Dials on Right Side */}
    <circle cx="24.8" cy="14.5" r="1.8" fill="#78350F" />
    <circle cx="24.8" cy="14.5" r="1.1" fill="#FEF08A" />
    <circle cx="24.8" cy="19.5" r="1.8" fill="#78350F" />
    <circle cx="24.8" cy="19.5" r="1.1" fill="#FEF08A" />
    <line x1="23.2" y1="23.8" x2="26.4" y2="23.8" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />

    {/* TV Feet */}
    <rect x="6" y="29" width="4" height="2" rx="1" fill="#3D1D04" />
    <rect x="22" y="29" width="4" height="2" rx="1" fill="#3D1D04" />
  </svg>
);


