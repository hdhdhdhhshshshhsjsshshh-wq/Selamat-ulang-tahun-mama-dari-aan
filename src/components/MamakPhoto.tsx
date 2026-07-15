import { useState } from "react";

export function MamakPhoto() {
  const candidates = [
    "https://i.ibb.co.com/MyRmTXNz/image.jpg",
    "https://i.ibb.co/MyRmTXNz/image.jpg",
    "https://i.ibb.co/MyRmTXNz/image.png",
    "https://i.ibb.co.com/MyRmTXNz/image.png",
    "https://i.ibb.co.com/MyRmTXNz/image.jpeg",
    "https://i.ibb.co/MyRmTXNz/image.jpeg",
    "https://i.ibb.co.co/MyRmTXNz/image.jpg",
    "https://i.ibb.co.co/MyRmTXNz/image.png",
    "https://i.ibb.co.com/MyRmTXNz/photo.jpg",
    "https://i.ibb.co/MyRmTXNz/photo.jpg",
    "https://i.ibb.co.com/MyRmTXNz/photo.png",
    "https://i.ibb.co/MyRmTXNz/photo.png",
  ];

  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (index < candidates.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center my-5">
        <a
          href="https://ibb.co.com/MyRmTXNz"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 shadow-md"
        >
          <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-950 overflow-hidden text-amber-400 font-sans text-xs uppercase tracking-widest shadow-inner">
            Foto
          </div>
          <span className="text-[10px] text-amber-400 uppercase tracking-[0.2em] font-sans font-medium group-hover:text-amber-300">
            Buka Foto Mamak ↗
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-5">
      <div className="relative group">
        {/* Elegant glowing backdrop aura */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        
        {/* Main circular frame */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-amber-500/40 p-1 bg-stone-950 flex items-center justify-center overflow-hidden shadow-2xl">
          <img
            src={candidates[index]}
            alt="Mamak"
            referrerPolicy="no-referrer"
            onError={handleError}
            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
