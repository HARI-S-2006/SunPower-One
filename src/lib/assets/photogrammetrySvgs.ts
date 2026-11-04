// Built-in High-Resolution Solar Photogrammetry & Inspection Visuals
// Encoded as rock-solid Base64 SVGs to guarantee zero broken image links on any platform/browser.

function svgToBase64(svg: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const SVG_RCC_SURVEY = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="slabGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#172554" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B68B55" />
      <stop offset="100%" stop-color="#E5BEB1" />
    </linearGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2" />
    </pattern>
  </defs>

  <!-- Sky / Horizon Background -->
  <rect width="800" height="520" fill="url(#skyGrad)" />
  <rect width="800" height="520" fill="url(#gridPattern)" opacity="0.6" />

  <!-- Concrete Terrace Base (RCC Slab) -->
  <polygon points="60,420 740,420 680,240 120,240" fill="url(#slabGrad)" stroke="#B68B55" stroke-width="2" />
  
  <!-- Parapet Walls & Shadow Free Perimeter -->
  <polygon points="60,420 50,440 750,440 740,420" fill="#1E293B" stroke="#64748B" stroke-width="1.5" />
  <polygon points="120,240 130,225 670,225 680,240" fill="#0F172A" stroke="#64748B" stroke-width="1.5" />

  <!-- Shadow-Free Usable Solar Zone (Dashed Golden Line) -->
  <polygon points="160,390 640,390 600,270 200,270" fill="rgba(182, 139, 85, 0.15)" stroke="#B68B55" stroke-width="2" stroke-dasharray="6 4" />
  <text x="400" y="295" fill="#FFDDB7" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="1">SHADOW-FREE SOLAR FOOTPRINT (480 SQ FT)</text>

  <!-- Solar PV Module Array Perspective -->
  <!-- Row 1 -->
  <g fill="url(#panelGrad)" stroke="#60A5FA" stroke-width="1">
    <polygon points="180,380 270,380 260,330 185,330" />
    <polygon points="280,380 370,380 360,330 275,330" />
    <polygon points="380,380 470,380 460,330 375,330" />
    <polygon points="480,380 570,380 560,330 475,330" />
    <polygon points="580,380 620,380 610,330 575,330" />
  </g>
  <!-- Row 2 -->
  <g fill="url(#panelGrad)" stroke="#60A5FA" stroke-width="1">
    <polygon points="200,320 280,320 275,280 205,280" />
    <polygon points="290,320 370,320 365,280 285,280" />
    <polygon points="380,320 460,320 455,280 375,280" />
    <polygon points="470,320 550,320 545,280 465,280" />
    <polygon points="560,320 600,320 595,280 555,280" />
  </g>

  <!-- Mounting Structure Struts -->
  <line x1="180" y1="380" x2="175" y2="400" stroke="#94A3B8" stroke-width="3" />
  <line x1="370" y1="380" x2="370" y2="400" stroke="#94A3B8" stroke-width="3" />
  <line x1="570" y1="380" x2="575" y2="400" stroke="#94A3B8" stroke-width="3" />

  <!-- Compass Rose Overlay (Top Left) -->
  <g transform="translate(110, 80)">
    <circle r="42" fill="#0F172A" stroke="#B68B55" stroke-width="2" />
    <polygon points="0,-34 7,-8 0,-14 -7,-8" fill="#EF4444" />
    <polygon points="0,34 7,8 0,14 -7,8" fill="#94A3B8" />
    <polygon points="34,0 8,7 14,0 8,-7" fill="#94A3B8" />
    <polygon points="-34,0 -8,7 -14,0 -8,-7" fill="#94A3B8" />
    <text x="0" y="-38" fill="#EF4444" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">N</text>
    <text x="0" y="48" fill="#22C55E" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">S (180°)</text>
    <text x="46" y="4" fill="#94A3B8" font-family="sans-serif" font-size="10" text-anchor="middle">E</text>
    <text x="-46" y="4" fill="#94A3B8" font-family="sans-serif" font-size="10" text-anchor="middle">W</text>
  </g>

  <!-- Telemetry HUD Card (Top Right) -->
  <rect x="520" y="30" width="250" height="110" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1.5" />
  <rect x="520" y="30" width="250" height="26" rx="8" fill="#172747" />
  <text x="535" y="48" fill="#FFDDB7" font-family="sans-serif" font-size="11" font-weight="bold">FIELD SURVEY TELEMETRY</text>
  <circle cx="750" cy="43" r="4" fill="#22C55E" />

  <text x="535" y="74" fill="#94A3B8" font-family="monospace" font-size="11">TOTAL AREA: <tspan fill="#F8FAFC" font-weight="bold">650 SQ FT</tspan></text>
  <text x="535" y="94" fill="#94A3B8" font-family="monospace" font-size="11">TILT ANGLE: <tspan fill="#F8FAFC" font-weight="bold">14° TRUE SOUTH</tspan></text>
  <text x="535" y="114" fill="#94A3B8" font-family="monospace" font-size="11">STRUCTURAL: <tspan fill="#22C55E" font-weight="bold">RCC SLAB (OPTIMAL)</tspan></text>

  <!-- Bottom Brand & Audit Banner -->
  <rect x="0" y="475" width="800" height="45" fill="#0A0F1D" />
  <line x1="0" y1="475" x2="800" y2="475" stroke="url(#goldGrad)" stroke-width="2" />
  <text x="25" y="503" fill="#B68B55" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">SUNPOWER ONE</text>
  <text x="145" y="503" fill="#64748B" font-family="sans-serif" font-size="11">| ROOFTOP DRONE PHOTOGRAMMETRY &amp; STRUCTURAL AUDIT</text>
  <text x="775" y="503" fill="#22C55E" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">CALIBRATED &amp; VERIFIED</text>
</svg>`

const SVG_INCLINOMETER = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="bgGrad2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#172747" />
    </linearGradient>
    <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="dialGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#22C55E" />
      <stop offset="100%" stop-color="#15803D" />
    </linearGradient>
  </defs>

  <rect width="800" height="520" fill="url(#bgGrad2)" />

  <!-- Aluminum Mounting Strut Cross-Section -->
  <polygon points="80,440 720,280 730,310 90,470" fill="#475569" stroke="#94A3B8" stroke-width="2" />
  <polygon points="120,430 760,270 770,295 130,455" fill="#334155" />
  
  <!-- Inclinometer Device Body -->
  <rect x="260" y="100" width="280" height="280" rx="24" fill="url(#gaugeGrad)" stroke="#B68B55" stroke-width="4" filter="drop-shadow(0 10px 25px rgba(0,0,0,0.5))" />
  
  <!-- Digital Dial Display -->
  <circle cx="400" cy="220" r="90" fill="#020617" stroke="#334155" stroke-width="3" />
  
  <!-- Degree Ticks -->
  <g stroke="#64748B" stroke-width="2">
    <line x1="400" y1="135" x2="400" y2="145" />
    <line x1="400" y1="295" x2="400" y2="305" />
    <line x1="315" y1="220" x2="325" y2="220" />
    <line x1="475" y1="220" x2="485" y2="220" />
  </g>

  <!-- Spirit Level Tube (Top of Inclinometer) -->
  <rect x="330" y="125" width="140" height="20" rx="10" fill="#0A0F1D" stroke="#64748B" stroke-width="1.5" />
  <rect x="385" y="127" width="30" height="16" rx="8" fill="#4ADE80" opacity="0.85" />
  <line x1="390" y1="125" x2="390" y2="145" stroke="#FFFFFF" stroke-width="1.5" />
  <line x1="410" y1="125" x2="410" y2="145" stroke="#FFFFFF" stroke-width="1.5" />

  <!-- Big Angle Readout -->
  <text x="400" y="225" fill="#22C55E" font-family="monospace" font-size="44" font-weight="bold" text-anchor="middle">14.0°</text>
  <text x="400" y="255" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="semibold" text-anchor="middle" letter-spacing="1">SOUTH TILT PITCH</text>

  <!-- Status Light & Model -->
  <circle cx="300" cy="340" r="6" fill="#22C55E" />
  <text x="315" y="344" fill="#E2E8F0" font-family="monospace" font-size="11">ACCURACY: ±0.1°</text>
  <text x="500" y="344" fill="#B68B55" font-family="monospace" font-size="11" text-anchor="end">DIGI-PITCH PRO</text>

  <!-- Technical Stamp Labels -->
  <rect x="50" y="35" width="220" height="60" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1" />
  <text x="65" y="60" fill="#FFDDB7" font-family="sans-serif" font-size="12" font-weight="bold">SOLAR LATITUDE TILT</text>
  <text x="65" y="80" fill="#94A3B8" font-family="monospace" font-size="11">BENGALURU: 12.97° N</text>

  <!-- Bottom Brand & Audit Banner -->
  <rect x="0" y="475" width="800" height="45" fill="#0A0F1D" />
  <line x1="0" y1="475" x2="800" y2="475" stroke="#B68B55" stroke-width="2" />
  <text x="25" y="503" fill="#B68B55" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">SUNPOWER ONE</text>
  <text x="145" y="503" fill="#64748B" font-family="sans-serif" font-size="11">| DIGITAL INCLINOMETER MOUNTING INSPECTION</text>
  <text x="775" y="503" fill="#22C55E" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">CALIBRATION PASS</text>
</svg>`

const SVG_PV_ARRAY = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="bgGrad3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <rect width="800" height="520" fill="url(#bgGrad3)" />

  <!-- Solar Array Rack (3 Monocrystalline Modules) -->
  <!-- Module 1 -->
  <rect x="70" y="80" width="200" height="340" rx="6" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <!-- Solar Cells in Module 1 -->
  <g fill="url(#cellGrad)" stroke="#38BDF8" stroke-width="0.7">
    <rect x="80" y="90" width="85" height="70" rx="3" />
    <rect x="175" y="90" width="85" height="70" rx="3" />
    <rect x="80" y="170" width="85" height="70" rx="3" />
    <rect x="175" y="170" width="85" height="70" rx="3" />
    <rect x="80" y="250" width="85" height="70" rx="3" />
    <rect x="175" y="250" width="85" height="70" rx="3" />
    <rect x="80" y="330" width="85" height="70" rx="3" />
    <rect x="175" y="330" width="85" height="70" rx="3" />
  </g>

  <!-- Module 2 -->
  <rect x="300" y="80" width="200" height="340" rx="6" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <g fill="url(#cellGrad)" stroke="#38BDF8" stroke-width="0.7">
    <rect x="310" y="90" width="85" height="70" rx="3" />
    <rect x="405" y="90" width="85" height="70" rx="3" />
    <rect x="310" y="170" width="85" height="70" rx="3" />
    <rect x="405" y="170" width="85" height="70" rx="3" />
    <rect x="310" y="250" width="85" height="70" rx="3" />
    <rect x="405" y="250" width="85" height="70" rx="3" />
    <rect x="310" y="330" width="85" height="70" rx="3" />
    <rect x="405" y="330" width="85" height="70" rx="3" />
  </g>

  <!-- Module 3 -->
  <rect x="530" y="80" width="200" height="340" rx="6" fill="#0F172A" stroke="#94A3B8" stroke-width="3" />
  <g fill="url(#cellGrad)" stroke="#38BDF8" stroke-width="0.7">
    <rect x="540" y="90" width="85" height="70" rx="3" />
    <rect x="635" y="90" width="85" height="70" rx="3" />
    <rect x="540" y="170" width="85" height="70" rx="3" />
    <rect x="635" y="170" width="85" height="70" rx="3" />
    <rect x="540" y="250" width="85" height="70" rx="3" />
    <rect x="635" y="250" width="85" height="70" rx="3" />
    <rect x="540" y="330" width="85" height="70" rx="3" />
    <rect x="635" y="330" width="85" height="70" rx="3" />
  </g>

  <!-- Mid Clamps & Fasteners -->
  <g fill="#CBD5E1" stroke="#475569" stroke-width="1">
    <circle cx="285" cy="150" r="7" />
    <circle cx="285" cy="270" r="7" />
    <circle cx="285" cy="370" r="7" />
    <circle cx="515" cy="150" r="7" />
    <circle cx="515" cy="270" r="7" />
    <circle cx="515" cy="370" r="7" />
  </g>

  <!-- Floating Inspection Tags -->
  <rect x="230" y="30" width="340" height="34" rx="17" fill="#172747" stroke="#B68B55" stroke-width="1.5" />
  <text x="400" y="52" fill="#FFDDB7" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">540W BIFACIAL MONO PERC ARRAY</text>

  <!-- Bottom Brand & Audit Banner -->
  <rect x="0" y="475" width="800" height="45" fill="#0A0F1D" />
  <line x1="0" y1="475" x2="800" y2="475" stroke="#B68B55" stroke-width="2" />
  <text x="25" y="503" fill="#B68B55" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">SUNPOWER ONE</text>
  <text x="145" y="503" fill="#64748B" font-family="sans-serif" font-size="11">| PV MODULE MOUNTING &amp; CLAMP TORQUE AUDIT</text>
  <text x="775" y="503" fill="#22C55E" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">100% FLASH TESTED</text>
</svg>`

const SVG_AERIAL_SHADING = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <defs>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="800" height="520" fill="#0F172A" />
  
  <!-- Drone Orthomosaic Grid -->
  <g stroke="#334155" stroke-width="1" opacity="0.4">
    <line x1="0" y1="100" x2="800" y2="100" />
    <line x1="0" y1="200" x2="800" y2="200" />
    <line x1="0" y1="300" x2="800" y2="300" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="160" y1="0" x2="160" y2="520" />
    <line x1="320" y1="0" x2="320" y2="520" />
    <line x1="480" y1="0" x2="480" y2="520" />
    <line x1="640" y1="0" x2="640" y2="520" />
  </g>

  <!-- Rooftop Footprint Outline -->
  <rect x="220" y="110" width="360" height="260" rx="6" fill="#1E293B" stroke="#B68B55" stroke-width="2.5" />
  
  <!-- Solar Array Footprint (4kW) -->
  <rect x="250" y="140" width="300" height="120" rx="4" fill="#172747" stroke="#38BDF8" stroke-width="1.5" />
  <text x="400" y="205" fill="#38BDF8" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">4.0 kW PROPOSED ARRAY</text>

  <!-- Sun Path Horizon Arc -->
  <path d="M 120 400 A 300 240 0 0 1 680 400" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="8 6" />
  <circle cx="400" cy="160" r="28" fill="url(#sunGrad)" />
  <circle cx="400" cy="160" r="12" fill="#F59E0B" />
  <text x="400" y="130" fill="#F59E0B" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SOLAR NOON (0° AZIMUTH OFFSET)</text>

  <!-- Shading Analysis Indicators -->
  <rect x="60" y="50" width="200" height="70" rx="8" fill="#0A0F1D" stroke="#334155" stroke-width="1.5" />
  <text x="75" y="75" fill="#22C55E" font-family="sans-serif" font-size="12" font-weight="bold">ANNUAL SHADING: &lt; 2.1%</text>
  <text x="75" y="95" fill="#94A3B8" font-family="monospace" font-size="11">HORIZON LOSS: OPTIMAL</text>

  <!-- Bottom Brand & Audit Banner -->
  <rect x="0" y="475" width="800" height="45" fill="#0A0F1D" />
  <line x1="0" y1="475" x2="800" y2="475" stroke="#B68B55" stroke-width="2" />
  <text x="25" y="503" fill="#B68B55" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">SUNPOWER ONE</text>
  <text x="145" y="503" fill="#64748B" font-family="sans-serif" font-size="11">| 360° DRONE ORTHOMOSAIC &amp; SHADING MATRIX</text>
  <text x="775" y="503" fill="#22C55E" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">UNOBSTRUCTED</text>
</svg>`

export const DEFAULT_SURVEY_PHOTOS = [
  svgToBase64(SVG_RCC_SURVEY),
  svgToBase64(SVG_INCLINOMETER),
  svgToBase64(SVG_PV_ARRAY),
  svgToBase64(SVG_AERIAL_SHADING),
]

export const FALLBACK_PHOTO_SVG = DEFAULT_SURVEY_PHOTOS[0]
