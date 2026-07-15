/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface CakeProps {
  candlesBlownOut: boolean;
}

export default function Cake({ candlesBlownOut }: CakeProps) {
  // SVG candle flame animation configurations
  const flameVariants = {
    burning: {
      scale: [1, 1.15, 0.9, 1.15, 1],
      y: [0, -2, 1, -2, 0],
      rotate: [-2, 2, -1, 3, -2],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    extinguished: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // SVG smoke puff animation configurations
  const smokePuff1 = {
    initial: { y: -20, x: 0, opacity: 0, scale: 0.5 },
    blown: {
      y: [-25, -60, -90],
      x: [-5, 10, -15],
      opacity: [0, 0.8, 0],
      scale: [0.6, 1.2, 0.3],
      transition: {
        duration: 2.2,
        ease: 'easeOut',
      },
    },
  };

  const smokePuff2 = {
    initial: { y: -20, x: 0, opacity: 0, scale: 0.5 },
    blown: {
      y: [-25, -55, -80],
      x: [5, -10, 15],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1.1, 0.2],
      transition: {
        duration: 1.8,
        ease: 'easeOut',
        delay: 0.15,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-sm mx-auto select-none cake-glow">
      <div className="relative w-72 h-80 flex items-end justify-center">
        {/* SVG Drawing of Cake, Candles, and Sparks */}
        <svg
          viewBox="0 0 300 350"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(251,191,36,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS for Gradients and Filters */}
          <defs>
            {/* Cake Layer 1 Gradient (Bottom Layer - deep charcoal/stone) */}
            <linearGradient id="layerBottom" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="50%" stopColor="#292524" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
            
            {/* Cake Layer 2 Gradient (Top Layer - medium charcoal/stone) */}
            <linearGradient id="layerTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="50%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>

            {/* Frosting Gold/Amber Liquid Drip Gradient */}
            <linearGradient id="frostingCream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Flame Gradients */}
            <linearGradient id="flameColor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Gold Candle Gradient */}
            <linearGradient id="goldCandle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Candle Candle Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND STAND/PLATE */}
          <rect x="30" y="300" width="240" height="12" rx="6" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
          <path d="M70 312 L90 335 L210 335 L230 312 Z" fill="#0c0a09" />
          <ellipse cx="150" cy="300" rx="120" ry="8" fill="#1c1917" />

          {/* CAKE LOWER LAYER */}
          {/* Base */}
          <path d="M50 210 L250 210 A 10 10 0 0 1 250 210 L250 295 C 250 299, 245 302, 235 302 L65 302 C 55 302, 50 299, 50 295 Z" fill="url(#layerBottom)" stroke="#44403c" strokeWidth="1" />
          {/* Layer Cream Frosting drip (Charming liquid gold) */}
          <path d="M50 210 C 60 225, 70 225, 80 210 C 90 230, 105 235, 115 210 C 125 220, 135 228, 145 210 C 155 228, 165 232, 175 210 C 185 225, 195 225, 205 210 C 215 230, 225 225, 235 210 C 245 220, 250 210, 250 210 L250 225 C 250 225, 240 235, 235 235 C 220 235, 215 220, 205 225 C 195 230, 185 242, 175 240 C 160 238, 155 222, 145 225 C 135 228, 125 250, 110 248 C 95 246, 90 222, 80 225 C 70 228, 60 240, 50 235 Z" fill="url(#frostingCream)" opacity="0.9" />

          {/* CAKE UPPER LAYER */}
          {/* Base */}
          <path d="M70 130 L230 130 C 230 130, 230 210, 230 210 L70 210 Z" fill="url(#layerTop)" stroke="#44403c" strokeWidth="1" />
          {/* Cream Dripping on upper layer */}
          <path d="M70 130 L230 130 L230 155 C 225 160, 220 150, 215 155 C 205 165, 200 175, 190 172 C 180 170, 175 155, 170 158 C 160 165, 155 185, 145 180 C 135 175, 130 152, 120 155 C 110 158, 105 170, 95 168 C 85 166, 80 148, 70 150 Z" fill="url(#frostingCream)" />

          {/* Strawberries & Deco on Cake Layer tops (Rich golden-amber cherries) */}
          {/* Cherry 1 */}
          <circle cx="90" cy="125" r="8" fill="#d97706" />
          <circle cx="88" cy="122" r="1.5" fill="#fef08a" />
          {/* Cherry 2 */}
          <circle cx="150" cy="123" r="9" fill="#d97706" />
          <circle cx="147" cy="119" r="2" fill="#fef08a" />
          {/* Cherry 3 */}
          <circle cx="210" cy="125" r="8" fill="#d97706" />
          <circle cx="208" cy="122" r="1.5" fill="#fef08a" />

          {/* Choco sprinkles / dots */}
          <circle cx="110" cy="145" r="2.5" fill="#fbbf24" />
          <circle cx="180" cy="148" r="2.5" fill="#78716c" />
          <circle cx="130" cy="155" r="2.5" fill="#ca8a04" />
          <circle cx="165" cy="142" r="2" fill="#fbbf24" />

          {/* CANDLE STANDS/WICKS */}
          {/* Candle Left (wick) */}
          <line x1="124" y1="68" x2="124" y2="50" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />
          {/* Candle Right (wick) */}
          <line x1="180" y1="68" x2="180" y2="50" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />

          {/* THE GIANT NUMERAL CANDLES: 4 & 9 */}
          {/* Candle "4" Body */}
          <path
            d="M 124 68 
               L 104 100 
               H 132 
               M 124 68 
               V 125"
            stroke="url(#goldCandle)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pattern lines on Candle 4 */}
          <path
            d="M 124 74 L 109 98 H 128 M 124 74 V 118"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Candle "9" Body */}
          <path
            d="M 180 93 
               C 193 93, 193 68, 180 68 
               C 167 68, 167 93, 180 93 
               Z 
               M 191 80 
               V 122 
               C 191 126, 180 126, 172 122"
            stroke="url(#goldCandle)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pattern lines on Candle 9 */}
          <path
            d="M 182 78 C 175 81, 175 91, 182 91"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* CANDLE FLAME ANIMATIONS (Using Absolute Overlay Over Wicks) */}
        {/* Wick positions relative to bottom-end:
            Let's mount them absolutely using Tailwind coordinate positioning!
            Width of wrapper is 288px (w-72), Height is 320px (h-80)
            Left Candle wick is at center-left, Right Candle is center-right.
        */}
        <div className="absolute top-[14.2%] left-[41.3%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Flame "4" */}
          <motion.div
            variants={flameVariants}
            animate={candlesBlownOut ? 'extinguished' : 'burning'}
            className="relative"
          >
            {/* Outer glow aura */}
            <div className="absolute w-12 h-12 bg-amber-400/30 rounded-full blur-md -top-6 -left-4" />
            <div className="absolute w-6 h-6 bg-orange-500/40 rounded-full blur-sm -top-3 -left-1" />
            {/* Real Flame */}
            <svg width="24" height="40" viewBox="0 0 24 40">
              <path
                d="M12,0 C17,14 24,20 24,28 C24,35 18,40 12,40 C6,40 0,35 0,28 C0,20 7,14 12,0 Z"
                fill="url(#flameColor)"
              />
              <path
                d="M12,10 C15,18 19,22 19,28 C19,33 15,36 12,36 C9,36 5,33 5,28 C5,22 9,18 12,10 Z"
                fill="#ffffff"
              />
            </svg>
          </motion.div>

          {/* Smoke 5 */}
          {candlesBlownOut && (
            <motion.div
              variants={smokePuff1}
              initial="initial"
              animate="blown"
              className="absolute -top-6 left-1/2 -translate-x-1/2"
            >
              <div className="w-5 h-5 rounded-full bg-stone-400/40 filter blur-xs" />
              <div className="w-3 h-3 rounded-full bg-stone-300/30 filter blur-xs -mt-2 ml-2" />
            </motion.div>
          )}
        </div>

        <div className="absolute top-[14.2%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Flame "9" */}
          <motion.div
            variants={flameVariants}
            animate={candlesBlownOut ? 'extinguished' : 'burning'}
            className="relative"
          >
            {/* Outer glow aura */}
            <div className="absolute w-12 h-12 bg-amber-400/30 rounded-full blur-md -top-6 -left-4" />
            <div className="absolute w-6 h-6 bg-orange-500/40 rounded-full blur-sm -top-3 -left-1" />
            {/* Real Flame */}
            <svg width="24" height="40" viewBox="0 0 24 40">
              <path
                d="M12,0 C17,14 24,20 24,28 C24,35 18,40 12,40 C6,40 0,35 0,28 C0,20 7,14 12,0 Z"
                fill="url(#flameColor)"
              />
              <path
                d="M12,10 C15,18 19,22 19,28 C19,33 15,36 12,36 C9,36 5,33 5,28 C5,22 9,18 12,10 Z"
                fill="#ffffff"
              />
            </svg>
          </motion.div>

          {/* Smoke 9 */}
          {candlesBlownOut && (
            <motion.div
              variants={smokePuff2}
              initial="initial"
              animate="blown"
              className="absolute -top-6 left-1/2 -translate-x-1/2"
            >
              <div className="w-5 h-5 rounded-full bg-stone-400/40 filter blur-xs" />
              <div className="w-3 h-3 rounded-full bg-stone-300/30 filter blur-xs -mt-2 mr-2" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Small floating birthday cake caption */}
      <p className="mt-4 text-xs font-mono text-amber-400/80 uppercase tracking-[0.2em] animate-pulse">
        {!candlesBlownOut ? 'Lilin Menyala Indah' : 'Lilin Berhasil Ditiup! 🎉'}
      </p>
    </div>
  );
}
