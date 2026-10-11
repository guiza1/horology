import { useState, useEffect } from 'react';
import { WatchScene } from './components/WatchScene';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Disc3 } from 'lucide-react';

const ARCHIVE_ITEMS = [
  {
    id: '01',
    code: 'CH-82 // GE',
    lot: 'CURATED LOT 82',
    name: 'Day-Date President',
    sub: 'Olive Dial Roman Numeral Edition',
    ref: 'REF. 228235',
    circa: '1982',
    caliber: 'CALIBRE 3255 PERPETUAL',
    caseSpec: '36MM / FLUTED 18CT',
    origin: 'GENEVA / SWITZERLAND',
    modelPath: '/models/rolex_datejust.glb',
    scale: 22,
    accent: '#D4AF37'
  },
  {
    id: '02',
    code: 'SK-96 // TYO',
    lot: 'ARCHIVE LOT 96',
    name: 'Seiko 5 Diver Tool',
    sub: 'Heritage Automatic Diver 200M',
    ref: 'REF. 7S26-0020',
    circa: '1996',
    caliber: 'CALIBRE 7S26 QUICKSET',
    caseSpec: '42MM / SATIN BRUSHED',
    origin: 'TOKYO / JAPAN',
    modelPath: '/models/seiko_watch.glb',
    scale: 10,
    accent: '#8E9299'
  },
  {
    id: '03',
    code: 'OM-05 // EXT',
    lot: 'RESTRICTED VAULT',
    name: 'Omnitrix Mark I',
    sub: 'Bio-Galvanic Neural Prototype',
    ref: 'OMNI-MK-I',
    circa: '2005',
    caliber: 'LEVEL 20 BIO-CELL SYNAPSE',
    caseSpec: 'ADAPTIVE FORM FACTOR',
    origin: 'GALVAN PRIME / SECTOR 4',
    modelPath: '/models/ben_ten_watch.glb',
    scale: 4,
    accent: '#10B981'
  }
];

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const current = ARCHIVE_ITEMS[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? ARCHIVE_ITEMS.length - 1 : prev - 1));
    setIsExploded(false);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === ARCHIVE_ITEMS.length - 1 ? 0 : prev + 1));
    setIsExploded(false);
  };

  // Suporte a navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-vault-bg bg-studio-spotlight select-none font-technical">
      {/* Granulação analógica de filme */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-20" />

      {/* Marcas de calibração arquitetural */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/20 text-xs font-mono pointer-events-none z-30">+</div>
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-white/20 text-xs font-mono pointer-events-none z-30">+</div>
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white/20 text-xs font-mono pointer-events-none z-30">+</div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-white/20 text-xs font-mono pointer-events-none z-30">+</div>

      {/* Marca d'água monumental de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[34vw] md:text-[24vw] font-luxury text-white/[0.025] tracking-widest leading-none select-none">
          {current.circa}
        </span>
      </div>

      {/* 3D Scene View */}
      <WatchScene 
        currentModel={current.modelPath} 
        scaleFactor={current.scale} 
        isExploded={isExploded}
      />

      {/* 1. TOP SECTION */}
      <div className="absolute top-0 left-0 right-0 z-30 flex flex-col pointer-events-none">
        <header className="flex items-center justify-between px-6 md:px-16 pt-6 md:pt-8 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-vault-gold shadow-[0_0_8px_#D4AF37]" />
            <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase font-technical font-medium text-white">
              CHRONOS ARCHIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] text-vault-subtle mr-2">
              <Disc3 size={13} className="text-vault-gold animate-spin" style={{ animationDuration: '8s' }} />
              <span>REAL-TIME ENGINE</span>
            </div>

            <button 
              onClick={() => setIsExploded((prev) => !prev)}
              className={`px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full border transition-all duration-300 backdrop-blur-md ${
                isExploded
                  ? 'border-vault-gold bg-vault-gold/20 text-vault-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                  : 'border-white/15 bg-white/[0.03] text-white/80 hover:border-vault-gold/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-medium">
                <Layers size={11} className={isExploded ? 'text-vault-gold animate-pulse' : 'text-vault-gold'} />
                <span>{isExploded ? 'ASSEMBLE CASE' : 'EXPLODED VIEW'}</span>
              </span>
            </button>
          </div>
        </header>

        {/* Título Editorial Ancorado no Topo */}
        <section className="px-6 md:px-16 pt-4 md:pt-6 max-w-lg pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-vault-gold font-medium">
                  {current.lot}
                </span>
                <span className="w-3 h-px bg-vault-gold/40" />
                <span className="text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-vault-subtle">
                  {current.code}
                </span>
              </div>

              <h1 className="text-2xl md:text-5xl font-luxury text-white tracking-tight leading-tight">
                {current.name}
              </h1>

              <p className="text-[10px] md:text-xs text-vault-subtle tracking-[0.16em] uppercase mt-0.5">
                {current.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* 2. GATILHOS LATERAIS (EDGE TRIGGERS) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Timepiece"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 group p-3 md:p-4 text-white/30 hover:text-vault-gold transition-all duration-300 focus:outline-none"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl md:text-3xl font-extralight group-hover:-translate-x-1 transition-transform duration-300">
            ‹
          </span>
          <span className="text-[8px] md:text-[9px] font-mono tracking-[0.3em] uppercase rotate-[-90deg] translate-y-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
            PREV
          </span>
        </div>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Timepiece"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 group p-3 md:p-4 text-white/30 hover:text-vault-gold transition-all duration-300 focus:outline-none"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl md:text-3xl font-extralight group-hover:translate-x-1 transition-transform duration-300">
            ›
          </span>
          <span className="text-[8px] md:text-[9px] font-mono tracking-[0.3em] uppercase rotate-90 translate-y-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
            NEXT
          </span>
        </div>
      </button>

      {/* 3. BOTTOM SECTION (Apenas a Ficha Técnica Limpa) */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-16 pb-6 md:pb-8 flex items-end justify-between pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + '-specs'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full grid grid-cols-2 md:flex md:items-center justify-between gap-x-4 gap-y-2 md:gap-12 p-3 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-0 md:border-t md:border-white/[0.08] md:pt-4 pointer-events-auto"
          >
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-vault-subtle">REFERENCE</span>
              <span className="text-white text-[11px] md:text-xs tracking-wider font-medium">{current.ref}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-vault-subtle">MECHANISM</span>
              <span className="text-white text-[11px] md:text-xs tracking-wider font-medium truncate max-w-[130px] md:max-w-none">{current.caliber}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-vault-subtle">ARCHITECTURE</span>
              <span className="text-white text-[11px] md:text-xs tracking-wider font-medium">{current.caseSpec}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-vault-subtle">PROVENANCE</span>
              <span className="text-white text-[11px] md:text-xs tracking-wider font-medium">{current.origin}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </footer>
    </main>
  );
}