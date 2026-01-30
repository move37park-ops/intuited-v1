"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import InteractiveChart from '@/components/InteractiveChart';
import { useBinanceStream } from '@/hooks/useBinanceStream';
import StatsBoard from '@/components/StatsBoard';
import CryptoCard from '@/components/CryptoCard';

export default function Home() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const prices = useBinanceStream(['btcusdt', 'ethusdt', 'solusdt']);
  const [viewMode, setViewMode] = useState<'landing' | 'drawing' | 'collective'>('landing');
  const [lang, setLang] = useState<'ENG' | 'KR'>('ENG');

  // Persist state check
  useEffect(() => {
    const savedSymbol = localStorage.getItem('lastActiveSymbol');
    if (savedSymbol) setActiveSymbol(savedSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAsset = (symbol: string) => {
    setActiveSymbol(symbol);
    localStorage.setItem('lastActiveSymbol', symbol);
    setViewMode('drawing');
  };

  const EXCHANGE_RATE = 1435; // 1 USD = 1435 KRW

  const content = {
    ENG: {
      title: "Intuited",
      motto: "Drawing the Future, Syncing the Swarm",
      desc: (
        <>
          Harness collective intuition to forecast market trends.<br />
          Draw your prediction, sync with the swarm.
        </>
      ),
    },
    KR: {
      title: "Intuited",
      motto: "드로잉으로 읽는 미래, 데이터로 모이는 직관",
      desc: (
        <>
          집단 지성을 활용해 시장 흐름을 예측합니다.<br />
          당신의 예측을 드로잉하고, 집단 데이터와 연결하세요.
        </>
      ),
    }
  };

  if (viewMode === 'landing') {
    return (
      <main className="h-screen w-screen bg-black text-white flex flex-col selection:bg-white selection:text-black overflow-hidden">
        {/* Navigation Bar */}
        <nav className="h-20 border-b border-white/10 flex items-center justify-between px-10 flex-shrink-0">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3 group cursor-default">
              <div className="w-5 h-5 bg-white rounded-none transition-transform duration-500 group-hover:rotate-180" />
              <span className="text-2xl font-semibold tracking-tight">{content[lang].title}</span>
            </div>

          </div>

          <div className="flex items-center space-x-8">
            <div className="flex space-x-1 border border-white/25 p-0.5 rounded-sm bg-white/5">
              <button
                onClick={() => setLang('ENG')}
                className={`px-3 py-1 text-[10px] font-bold tracking-tighter transition-all ${lang === 'ENG' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                US
              </button>
              <button
                onClick={() => setLang('KR')}
                className={`px-3 py-1 text-[10px] font-bold tracking-tighter transition-all ${lang === 'KR' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                KR
              </button>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <section className="flex-1 flex flex-col px-10 relative pt-[3vh]">
          <div className="w-full max-w-7xl mx-auto flex flex-col items-start translate-y-[-1%]">
            <div className="mb-6 text-left">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                {content[lang].motto}
              </h2>
              <div className="text-xl md:text-2xl font-light text-white/50 max-w-4xl leading-relaxed tracking-tight min-h-[4rem] md:min-h-[5rem]">
                {content[lang].desc}
              </div>
            </div>

            {/* Stats Board Area - Symmetrical & Centered */}
            <div className="w-full mb-6 border-y border-white/5 py-4 flex justify-center">
              <StatsBoard lang={lang} />
            </div>

            {/* Asset Grid - Positioned lower with golden ratio inspired gap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 w-full bg-white/5 border border-white/5 shadow-2xl shadow-white/[0.02]">
              <CryptoCard
                symbol="BTC"
                name="Bitcoin"
                price={prices['BTCUSDT'] || 0}
                lang={lang}
                exchangeRate={EXCHANGE_RATE}
                themeColor="#f7931a"
                bgImage="/assets/btc_new.png"
                onDraw={() => handleSelectAsset('BTCUSDT')}
              />
              <CryptoCard
                symbol="ETH"
                name="Ethereum"
                price={prices['ETHUSDT'] || 0}
                lang={lang}
                exchangeRate={EXCHANGE_RATE}
                themeColor="#627eea"
                bgImage="/assets/eth.png"
                onDraw={() => handleSelectAsset('ETHUSDT')}
              />
              <CryptoCard
                symbol="SOL"
                name="Solana"
                price={prices['SOLUSDT'] || 0}
                lang={lang}
                exchangeRate={EXCHANGE_RATE}
                themeColor="#14f195"
                bgImage="/assets/sol.png" // Official Solana Logo
                onDraw={() => handleSelectAsset('SOLUSDT')}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-16 border-t border-white/10 flex items-center justify-between px-10 text-[10px] tracking-widest text-white/20 uppercase flex-shrink-0">
          <div>© 2026 INTUITED CORP. ALL RIGHTS RESERVED.</div>
          <div className="flex space-x-8">
            <span>NETWORK STATUS: OPTIMAL</span>
            <span>DATA LATENCY: 12MS</span>
          </div>
        </footer>
      </main>
    );
  }

  // Workspace Layout
  return (
    <div className="w-screen h-screen bg-black flex flex-col font-sans selection:bg-white selection:text-black overflow-hidden">
      <main className="flex-1 relative flex flex-col">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setViewMode('landing')}
              className="text-xs tracking-[0.2em] font-bold text-white/90 hover:text-white transition-all uppercase border border-white/40 hover:border-white px-6 py-2.5 rounded-sm bg-white/[0.05] hover:bg-white/[0.1] shadow-lg shadow-white/[0.02]"
            >
              RETURN TO HUB
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-white/20 text-[11px] tracking-widest uppercase font-bold">ASSET_ID:</span>
              <span className="text-white font-bold tracking-widest">
                {activeSymbol.replace('USDT', '')} / {lang === 'KR' ? 'KRW' : 'USD'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {prices[activeSymbol]
                ? (lang === 'KR' ? prices[activeSymbol] * EXCHANGE_RATE : prices[activeSymbol]).toLocaleString(undefined, {
                  minimumFractionDigits: lang === 'KR' ? 0 : 2,
                  maximumFractionDigits: lang === 'KR' ? 0 : 2
                })
                : '0.00'}
            </span>
          </div>
        </header>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {viewMode === 'drawing' ? (
            <InteractiveChart
              symbol={activeSymbol}
              lang={lang}
              exchangeRate={EXCHANGE_RATE}
              onSubmit={() => setViewMode('collective')}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white bg-black">
              <h1 className="text-2xl font-light tracking-[0.5em] mb-4">SYSTEM MERGE COMPLETE</h1>
              <p className="text-white/40 text-sm tracking-widest uppercase mb-12">Collective signal successfully merged.</p>
              <button
                onClick={() => setViewMode('landing')}
                className="px-8 py-3 border border-white/40 hover:bg-white hover:text-black transition-all text-xs font-bold tracking-[0.2em] text-white/90 shadow-lg shadow-white/[0.02]"
              >
                RETURN TO HUB
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


