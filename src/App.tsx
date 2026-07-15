/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  Gift, 
  Heart,
  ChevronRight
} from 'lucide-react';
import Envelope from './components/Envelope';
import Cake from './components/Cake';
import FireworksCanvas from './components/FireworksCanvas';
import { MamakPhoto } from './components/MamakPhoto';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [candlesBlownOut, setCandlesBlownOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements for opening intro and background birthday song
  useEffect(() => {
    const introId = "1GpWQ-ar6PLnq6z8b-t5eIVKwE-_jaoFB";
    const mainId = "1Ci8-yn797GlZ5o6W_zMIqXs8dwpUV0gJ";

    const getUrl = (id: string) => {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (
          hostname.includes("vercel.app") || 
          hostname.includes("github.io") || 
          hostname.includes("vercel") || 
          hostname.includes("amplifyapp") || 
          hostname.includes("pages.dev")
        ) {
          return `https://docs.google.com/uc?export=download&id=${id}`;
        }
      }
      return `/api/audio/${id}`;
    };

    // 1. Mama song as the opening track
    const introAudio = new Audio(getUrl(introId));
    introAudio.volume = 0.7;
    introAudioRef.current = introAudio;

    introAudio.onerror = () => {
      console.warn("Intro audio failed to load from initial source, falling back to direct Drive URL...");
      const currentSrc = introAudio.src || "";
      if (currentSrc.includes("/api/audio/")) {
        introAudio.src = `https://docs.google.com/uc?export=download&id=${introId}`;
      }
    };

    // 2. Main background Happy Birthday track
    const mainAudio = new Audio(getUrl(mainId));
    mainAudio.loop = true;
    mainAudio.volume = 0.5;
    mainAudioRef.current = mainAudio;

    mainAudio.onerror = () => {
      console.warn("Main audio failed to load from initial source, falling back to direct Drive URL...");
      const currentSrc = mainAudio.src || "";
      if (currentSrc.includes("/api/audio/")) {
        mainAudio.src = `https://docs.google.com/uc?export=download&id=${mainId}`;
      }
    };

    // Chain the intro to the main song
    if (introAudio && mainAudio) {
      introAudio.onended = () => {
        if (mainAudioRef.current) {
          // Play the main track with the current mute preference
          mainAudioRef.current.muted = introAudioRef.current ? introAudioRef.current.muted : false;
          mainAudioRef.current.play().catch(e => console.log("Main audio play failed:", e));
        }
      };
    }

    return () => {
      if (introAudioRef.current) {
        introAudioRef.current.pause();
      }
      if (introAudio) {
        introAudio.pause();
      }
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      if (mainAudio) {
        mainAudio.pause();
      }
    };
  }, []);

  // Handle open envelope event
  const handleOpenEnvelope = () => {
    setIsOpen(true);
    
    // Play intro sound first; the main song will auto-trigger upon its completion
    if (introAudioRef.current) {
      introAudioRef.current.muted = isMuted;
      introAudioRef.current.play().catch(e => {
        console.log("Intro audio play failed, falling back directly to main audio:", e);
        if (mainAudioRef.current) {
          mainAudioRef.current.muted = isMuted;
          mainAudioRef.current.play().catch(err => console.log("Fallback main audio play failed:", err));
        }
      });
    } else if (mainAudioRef.current) {
      mainAudioRef.current.muted = isMuted;
      mainAudioRef.current.play().catch(e => console.log("Main audio play failed:", e));
    }

    // Fade in the birthday wishes card shortly after opening
    setTimeout(() => {
      setShowCard(true);
    }, 800);
  };

  // Play synthesized candle blow whoosh sound
  const playBlowSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      // High frequency slide down to low frequency for air blowing sound
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.error(e);
    }
  };

  // Triggered when user blows out candles
  const handleBlowCandles = () => {
    if (candlesBlownOut) return;
    playBlowSound();
    setCandlesBlownOut(true);
  };

  // Triggered when user wants to relight candles
  const handleRelightCandles = () => {
    setCandlesBlownOut(false);
  };

  // Toggle music mute state
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (introAudioRef.current) {
      introAudioRef.current.muted = nextMuted;
    }
    if (mainAudioRef.current) {
      mainAudioRef.current.muted = nextMuted;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] text-stone-100 selection:bg-amber-500/20">
      
      {/* Background Starry Glow Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-40 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-32 right-60 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px]" />
        <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Envelope screen */
            <motion.div
              key="envelope-screen"
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full"
            >
              <Envelope onOpen={handleOpenEnvelope} />
            </motion.div>
          ) : (
            /* Birthday Celebration screen */
            <motion.div
              key="birthday-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-8"
            >
              {/* Fireworks Canvas is active in the background */}
              <FireworksCanvas />

              {/* Floating Music Controller */}
              <div className="absolute top-4 right-4 z-50">
                <button
                  id="music-toggle-btn"
                  onClick={handleToggleMute}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 text-stone-200 border border-white/10 shadow-lg transition-all duration-200"
                  title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold tracking-wider font-sans text-stone-400">Bisu</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-xs font-semibold tracking-wider font-sans text-amber-400">Musik: Aktif</span>
                    </>
                  )}
                </button>
              </div>

              {/* Header subtitle */}
              <div className="text-center mb-6 z-30 pointer-events-none">
                <p className="text-stone-500 uppercase tracking-[0.4em] text-xs mb-1">A Special Celebration</p>
                <h2 className="font-display text-2xl md:text-3xl font-light text-stone-300 italic">Selamat Ulang Tahun</h2>
              </div>

              {/* Greeting Cards Container */}
              <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-30 pointer-events-none">
                
                {/* LEFT COLUMN: The Interactive Birthday Cake */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-full max-w-sm flex flex-col items-center pointer-events-auto"
                >
                  <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full text-center">
                    <Cake candlesBlownOut={candlesBlownOut} />

                    {/* Interactive Blowing Controller */}
                    <div className="mt-6">
                      <AnimatePresence mode="wait">
                        {!candlesBlownOut ? (
                          <motion.button
                            key="blow-btn"
                            id="blow-button"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={handleBlowCandles}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative w-full py-4 px-6 bg-transparent overflow-hidden rounded-full border border-amber-500/50 transition-all duration-300 hover:border-amber-400 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                          >
                            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                            <Flame className="w-4 h-4 text-amber-400 animate-pulse group-hover:scale-110 transition-transform relative z-10" />
                            <span className="relative z-10 text-amber-400 tracking-[0.2em] font-sans text-xs font-semibold uppercase">
                              TEKAN TOMBOL UNTUK TIUP
                            </span>
                          </motion.button>
                        ) : (
                          <motion.div
                            key="blown-message"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col gap-3"
                          >
                            <div className="py-3 px-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium flex items-center justify-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span className="text-xs uppercase tracking-wider font-sans">Lilin berhasil ditiup! Horeee! 🎉</span>
                            </div>
                            
                            <button
                              id="relight-button"
                              onClick={handleRelightCandles}
                              className="w-full py-2.5 px-4 rounded-xl bg-stone-950/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-850 font-medium flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all duration-200"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Nyalakan Lilin Kembali</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT COLUMN: The Beautiful Congratulatory Letter */}
                <AnimatePresence>
                  {showCard && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.7, type: 'spring' }}
                      className="w-full max-w-md flex flex-col pointer-events-auto"
                    >
                      <div className="bg-stone-900/90 text-stone-100 rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative border border-amber-500/20 backdrop-blur-md">
                        {/* Elegant Gold Corner Decorative Elements */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-amber-500/30 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-500/30 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-amber-500/30 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-amber-500/30 rounded-br-lg" />

                        {/* Top Badge */}
                        <div className="flex justify-center mb-4">
                          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-[0.2em] px-4 py-1.5 rounded-full uppercase border border-amber-500/20 flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            Happy 49th Birthday, Mamak!
                          </span>
                        </div>

                        {/* Heading */}
                        <h2 className="font-display text-center text-3xl font-light text-stone-100 tracking-tight">
                          Selamat Ulang Tahun, Mamak!
                        </h2>
                        
                        <p className="font-handwritten text-center text-4xl text-amber-400 mt-2">
                          Barakallah Fii Umrik
                        </p>

                        {/* Mamak's Portrait Photo */}
                        <MamakPhoto />

                        <div className="h-[1px] w-16 bg-amber-500/20 mx-auto my-5 rounded-full" />

                        {/* Letter Content */}
                        <div className="space-y-4 text-stone-300 leading-relaxed text-sm md:text-base font-sans">
                          <p className="text-center font-medium text-stone-200">
                            Selamat memasuki usia ke-<span className="text-amber-400 font-bold text-lg">49</span> tahun, Mamak Tercinta!
                          </p>
                          <p className="text-justify text-stone-400 text-sm leading-relaxed">
                            Semoga di usia yang istimewa ini, Allah SWT senantiasa melimpahkan rahmat, berkah, perlindungan, serta kesehatan lahir dan batin yang prima untuk Mamak.
                          </p>
                          <p className="text-justify text-stone-400 text-sm leading-relaxed">
                            Terima kasih telah menjadi tiang keteduhan, mengalirkan kasih sayang tiada tara, serta membesarkan kami dengan keikhlasan yang luar biasa. Semoga setiap helai doa Mamak senantiasa diijabah oleh Allah SWT, dan setiap hari ke depan selalu dipenuhi kedamaian, kebahagiaan, serta senyuman terindah.
                          </p>
                        </div>

                        <div className="h-[1px] w-full bg-stone-800/60 my-6" />

                        {/* Footer Sign-off */}
                        <div className="text-center">
                          <p className="font-handwritten text-3xl text-amber-400 flex items-center justify-center gap-1">
                            Anakmu yang Mencintaimu, <Heart className="w-4 h-4 fill-amber-500 text-amber-500 inline animate-pulse" />
                          </p>
                          <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] mt-1 font-mono">
                            Dibuat penuh cinta untuk Mamak
                          </p>
                        </div>
                      </div>
                      
                      {/* Hint to click the background for extra sparks */}
                      <p className="text-center text-[10px] uppercase tracking-widest text-stone-500 mt-4">
                        Tip: Klik di mana saja pada layar untuk menyalakan kembang api baru! 🎇
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Humble Elegant Footer Credit */}
      <footer className="relative z-10 w-full py-4 text-center text-stone-600 text-[10px] tracking-widest border-t border-stone-900 bg-[#050505] uppercase">
        <p>© {new Date().getFullYear()} • Dirgahayu Ke-59 • EST. 1967</p>
      </footer>
    </div>
  );
}
