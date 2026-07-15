/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { MailOpen, Heart, ArrowRight } from 'lucide-react';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    
    // Allow animation to complete before transitioning state
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 select-none relative z-10">
      {/* Container with a subtle shadow and glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Floating Instruction */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display italic text-4xl text-amber-400 mb-2 drop-shadow-md"
          >
            A Special Celebration
          </motion.p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-stone-100 tracking-tight leading-tight italic">
            Happy Birthday!
          </h1>
          <p className="text-stone-400 mt-3 text-xs md:text-sm uppercase tracking-[0.2em] font-sans flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Tekan amplop di bawah untuk membuka
          </p>
        </div>

        {/* Envelope Body */}
        <motion.div
          id="envelope-wrapper"
          onClick={handleOpenClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative w-80 h-56 md:w-96 md:h-64 cursor-pointer bg-stone-950/40 rounded-2xl border border-amber-500/20 flex items-center justify-center shadow-[0_25px_60px_rgba(251,191,36,0.1)] overflow-visible ${
            !isOpening ? 'animate-wiggle' : ''
          }`}
        >
          {/* Inner Letter Card popping up */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={isOpening ? { y: -140, scale: 0.9, opacity: 0.9 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute top-4 w-[90%] h-[90%] bg-[#fcfaf7] rounded-xl p-4 flex flex-col items-center justify-center shadow-lg border border-stone-200 z-0"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-2 border border-amber-200">
              <span className="font-display font-bold text-amber-700 text-lg">49</span>
            </div>
            <p className="font-display font-bold text-stone-800 text-center text-sm md:text-base">
              Selamat Ulang Tahun!
            </p>
            <div className="w-8 h-[2px] bg-amber-300 my-1" />
            <p className="font-handwritten text-xl text-amber-600">Tekan untuk buka...</p>
          </motion.div>

          {/* Envelope Back / Triangles (SVG Overlay) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl shadow-inner z-10 overflow-hidden border border-stone-700/50">
            {/* Left flap */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[112px] border-t-transparent border-l-[160px] border-l-stone-750 md:border-t-[128px] md:border-l-[192px] opacity-90" />
            {/* Right flap */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[112px] border-t-transparent border-r-[160px] border-r-stone-750 md:border-t-[128px] md:border-r-[192px] opacity-90" />
            {/* Bottom flap */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[130px] border-b-stone-800 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent md:border-b-[150px] md:border-l-[192px] md:border-r-[192px] opacity-95" />
          </div>

          {/* Top Flap (Animating open) */}
          <motion.div
            style={{ originY: 0 }}
            animate={
              isOpening
                ? { rotateX: 180, zIndex: 0, opacity: 0.3 }
                : { rotateX: 0, zIndex: 20 }
            }
            transition={{ duration: 0.8, ease: 'easeIn' }}
            className="absolute top-0 left-0 w-0 h-0 border-t-[112px] border-t-stone-850 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent md:border-t-[128px] md:border-l-[192px] md:border-r-[192px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] z-20"
          />

          {/* Interactive Wax Seal / Button */}
          <motion.div
            animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute z-30 w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-[0_10px_25px_rgba(245,158,11,0.5)] hover:bg-amber-400 transition-colors duration-200"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-dashed border-amber-100 flex flex-col items-center justify-center bg-amber-600 text-white">
              <Heart className="w-6 h-6 fill-amber-100 text-amber-100 animate-pulse" />
              <span className="font-display font-extrabold text-[10px] tracking-widest">BUKA</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Outer text helper */}
        <motion.div
          animate={isOpening ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          className="mt-8 flex flex-col items-center gap-1 text-stone-300 hover:text-white transition-colors duration-200"
          onClick={handleOpenClick}
        >
          <span className="font-sans font-semibold tracking-[0.2em] text-xs uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all duration-300 hover:border-amber-400">
            TEKAN AMPLOP UNTUK MEMBUKA <ArrowRight className="w-4 h-4 animate-bounce text-amber-400" />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
