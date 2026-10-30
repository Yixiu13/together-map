import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { SceneKey } from '@/types'

interface SceneArtProps {
  kind: SceneKey
  className?: string
}

interface Palette {
  sky: [string, string]
  far: string
  mid: string
  near: string
  accent: string
  label: string
}

const PALETTES: Record<SceneKey, Palette> = {
  mountain: {
    sky: ['#FBEBDA', '#F0C6A4'],
    far: '#B7927F',
    mid: '#8B6A5C',
    near: '#4E3B33',
    accent: '#E79270',
    label: '山峦',
  },
  sea: {
    sky: ['#F6E3CB', '#DFE9E4'],
    far: '#9FBFC1',
    mid: '#6D9A9B',
    near: '#3E6B6B',
    accent: '#E9A26B',
    label: '海边',
  },
  city: {
    sky: ['#F7E7D3', '#EAC7AE'],
    far: '#C3A290',
    mid: '#8C6E5E',
    near: '#4B3A31',
    accent: '#F0B27A',
    label: '城市',
  },
  snow: {
    sky: ['#E4EDF2', '#CBD9E1'],
    far: '#EFF5F8',
    mid: '#B6C8D2',
    near: '#6F8894',
    accent: '#F7FBFD',
    label: '雪景',
  },
  town: {
    sky: ['#F8E9D4', '#E9CDAC'],
    far: '#C9AD93',
    mid: '#8A6250',
    near: '#4A342A',
    accent: '#D97A5C',
    label: '古镇',
  },
  lake: {
    sky: ['#FDEBD6', '#EFC8A6'],
    far: '#B9A08B',
    mid: '#8E8E84',
    near: '#5E6F6C',
    accent: '#E7A772',
    label: '湖畔',
  },
  food: {
    sky: ['#5A3B31', '#33211C'],
    far: '#7A4B3A',
    mid: '#C0483C',
    near: '#2A1B17',
    accent: '#F2C14E',
    label: '烟火',
  },
  night: {
    sky: ['#22384B', '#4E6076'],
    far: '#2C3F52',
    mid: '#1B2938',
    near: '#101A24',
    accent: '#F5D67B',
    label: '夜色',
  },
}

const STARS = [
  [46, 40],
  [92, 76],
  [148, 32],
  [196, 62],
  [252, 44],
  [308, 78],
  [356, 52],
  [128, 108],
  [232, 112],
  [340, 120],
]

const SNOWFLAKES = [
  [58, 46],
  [112, 92],
  [166, 38],
  [214, 88],
  [268, 52],
  [322, 96],
  [374, 60],
  [86, 132],
  [190, 128],
  [300, 138],
]

export function SceneArt({ kind, className }: SceneArtProps) {
  const raw = useId()
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '')
  const skyId = `sky-${uid}`
  const p = PALETTES[kind]

  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full', className)}
      role="img"
      aria-label={`${p.label}插画`}
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${skyId})`} />

      {kind === 'mountain' && (
        <>
          <circle cx="296" cy="72" r="28" fill={p.accent} opacity="0.85" />
          <path d="M0 178 L58 118 L104 156 L166 92 L228 148 L292 108 L352 152 L400 124 V260 H0 Z" fill={p.far} opacity="0.75" />
          <path d="M0 212 L72 152 L138 202 L206 142 L274 196 L344 152 L400 190 V260 H0 Z" fill={p.mid} opacity="0.9" />
          <path d="M0 244 L96 206 L186 240 L286 200 L400 236 V260 H0 Z" fill={p.near} />
          <rect y="150" width="400" height="34" fill="#FFFFFF" opacity="0.14" />
        </>
      )}

      {kind === 'sea' && (
        <>
          <circle cx="308" cy="68" r="26" fill={p.accent} opacity="0.9" />
          <rect y="150" width="400" height="110" fill={p.mid} opacity="0.85" />
          <rect y="160" width="400" height="100" fill={p.near} opacity="0.55" />
          <path d="M20 186 q22 -10 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" />
          <path d="M40 212 q22 -10 44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" />
          <path d="M40 238 q22 -10 44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />
          <path d="M188 146 l40 0 l-6 16 l-28 0 Z" fill={p.near} />
          <path d="M208 146 l0 -30 l16 30 Z" fill="#F3E7D6" />
        </>
      )}

      {kind === 'city' && (
        <>
          <circle cx="84" cy="58" r="22" fill={p.accent} opacity="0.55" />
          <g fill={p.far} opacity="0.7">
            <rect x="10" y="150" width="46" height="110" />
            <rect x="320" y="132" width="54" height="128" />
          </g>
          <g fill={p.mid}>
            <rect x="64" y="118" width="52" height="142" />
            <rect x="176" y="96" width="44" height="164" />
            <rect x="272" y="126" width="40" height="134" />
          </g>
          <g fill={p.near}>
            <rect x="122" y="140" width="48" height="120" />
            <rect x="228" y="112" width="38" height="148" />
          </g>
          <g fill="#FBE9D2" opacity="0.7">
            <rect x="76" y="132" width="6" height="8" />
            <rect x="92" y="152" width="6" height="8" />
            <rect x="186" y="112" width="6" height="8" />
            <rect x="200" y="140" width="6" height="8" />
            <rect x="134" y="156" width="6" height="8" />
            <rect x="152" y="180" width="6" height="8" />
          </g>
          <rect y="248" width="400" height="12" fill="#3B2E28" opacity="0.35" />
        </>
      )}

      {kind === 'snow' && (
        <>
          <path d="M0 176 L70 118 L124 158 L188 96 L252 148 L320 106 L400 150 V260 H0 Z" fill={p.mid} opacity="0.55" />
          <path d="M0 216 L86 164 L156 212 L238 158 L318 210 L400 176 V260 H0 Z" fill={p.near} />
          <path d="M0 246 L120 224 L240 250 L400 228 V260 H0 Z" fill="#5B7480" />
          <g fill={p.accent}>
            {SNOWFLAKES.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3 : 2} opacity="0.9" />
            ))}
          </g>
        </>
      )}

      {kind === 'town' && (
        <>
          <rect y="150" width="400" height="110" fill="#E3D3BC" />
          <g fill={p.mid}>
            <rect x="24" y="176" width="90" height="60" />
            <rect x="150" y="168" width="104" height="68" />
            <rect x="290" y="180" width="86" height="56" />
          </g>
          <g fill={p.near}>
            <path d="M14 178 L69 138 L124 178 Z" />
            <path d="M140 170 L202 128 L264 170 Z" />
            <path d="M280 182 L333 144 L386 182 Z" />
          </g>
          <g fill={p.accent}>
            <rect x="56" y="196" width="26" height="22" rx="2" />
            <rect x="188" y="190" width="28" height="24" rx="2" />
            <rect x="316" y="200" width="24" height="22" rx="2" />
          </g>
          <rect y="236" width="400" height="24" fill="#6C7A6A" opacity="0.55" />
          <g stroke={p.near} strokeWidth="2" opacity="0.5">
            <path d="M60 138 L60 128" />
            <path d="M202 128 L202 116" />
          </g>
        </>
      )}

      {kind === 'lake' && (
        <>
          <circle cx="112" cy="62" r="24" fill={p.accent} opacity="0.85" />
          <path d="M0 140 L64 96 L120 132 L188 84 L256 128 L330 92 L400 124 V170 H0 Z" fill={p.far} opacity="0.8" />
          <rect y="170" width="400" height="90" fill="#9FB9B7" opacity="0.8" />
          <path d="M0 176 L64 220 L120 184 L188 232 L256 188 L330 224 L400 192" fill="none" stroke={p.far} strokeOpacity="0.5" strokeWidth="10" />
          <g stroke="#F6EFE4" strokeWidth="2" opacity="0.55">
            <path d="M40 202 q18 -8 36 0" />
            <path d="M150 214 q18 -8 36 0" />
            <path d="M280 206 q18 -8 36 0" />
          </g>
          <path d="M250 160 l52 0 l-8 14 l-36 0 Z" fill={p.near} />
          <path d="M276 160 l0 -26 l14 26 Z" fill="#EFE4D2" />
        </>
      )}

      {kind === 'food' && (
        <>
          <rect y="196" width="400" height="64" fill={p.near} />
          <g stroke="#8A6A55" strokeWidth="2">
            <path d="M0 60 H400" />
            <path d="M0 96 H400" />
          </g>
          <g>
            <rect x="72" y="66" width="34" height="44" rx="16" fill={p.mid} />
            <rect x="184" y="72" width="34" height="44" rx="16" fill={p.mid} opacity="0.9" />
            <rect x="296" y="62" width="34" height="44" rx="16" fill={p.mid} opacity="0.8" />
          </g>
          <g fill={p.accent} opacity="0.85">
            <circle cx="89" cy="118" r="4" />
            <circle cx="201" cy="124" r="4" />
            <circle cx="313" cy="114" r="4" />
          </g>
          <g stroke="#F6E3C9" strokeOpacity="0.45" strokeWidth="3" fill="none">
            <path d="M140 190 q18 -22 0 -44 q-18 -22 0 -44" />
            <path d="M232 190 q18 -22 0 -44 q-18 -22 0 -44" />
          </g>
          <rect x="96" y="176" width="208" height="34" rx="6" fill="#20140F" />
          <ellipse cx="200" cy="176" rx="104" ry="12" fill="#4A332A" />
        </>
      )}

      {kind === 'night' && (
        <>
          <circle cx="322" cy="56" r="20" fill={p.accent} opacity="0.9" />
          <g fill="#F7F1E1">
            {STARS.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.4} opacity="0.9" />
            ))}
          </g>
          <path d="M0 168 L78 120 L150 164 L226 108 L300 156 L400 118 V260 H0 Z" fill={p.far} opacity="0.9" />
          <g fill={p.mid}>
            <rect x="40" y="186" width="60" height="74" />
            <rect x="120" y="164" width="44" height="96" />
            <rect x="184" y="196" width="52" height="64" />
            <rect x="256" y="172" width="46" height="88" />
            <rect x="320" y="200" width="56" height="60" />
          </g>
          <g fill={p.accent} opacity="0.8">
            <rect x="54" y="200" width="7" height="9" />
            <rect x="76" y="218" width="7" height="9" />
            <rect x="134" y="182" width="7" height="9" />
            <rect x="200" y="210" width="7" height="9" />
            <rect x="222" y="228" width="7" height="9" />
            <rect x="270" y="190" width="7" height="9" />
            <rect x="338" y="216" width="7" height="9" />
          </g>
          <rect y="248" width="400" height="12" fill="#0A1219" />
        </>
      )}

      <rect width="400" height="260" fill="#2B2723" opacity="0.06" />
    </svg>
  )
}
