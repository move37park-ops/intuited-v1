"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import InteractiveChart from '@/components/InteractiveChart';
import { useBinanceStream } from '@/hooks/useBinanceStream';
import StatsBoard from '@/components/StatsBoard';
import AssetCard from '@/components/AssetCard'; // Updated import
import LoginButton from '@/components/LoginButton';
import ManagementView from '@/components/ManagementView';
import { SessionProvider } from "next-auth/react";
import { fetchMarketData } from '@/utils/marketData'; // Import for stocks

function Home() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({});
  const cryptoPrices = useBinanceStream(['btcusdt', 'ethusdt']); // Removed SOL

  const [viewMode, setViewMode] = useState<'landing' | 'drawing' | 'collective' | 'management'>('landing');
  const [drawingTimeframe, setDrawingTimeframe] = useState<'4H' | '1Q'>('4H'); // New State
  const [lang, setLang] = useState<'ENG' | 'KR'>('ENG');
  const [lastPath, setLastPath] = useState<any[]>([]);

  // Fetch initial stock prices
  useEffect(() => {
    const fetchStocks = async () => {
      const symbols = ['NVDA', 'TSLA', 'AAPL', 'SAMSUNG'];
      const newPrices: Record<string, number> = {};
      for (const sym of symbols) {
        const data = await fetchMarketData(sym, '1m', 1);
        if (data.length > 0) newPrices[sym] = data[0].close;
      }
      setStockPrices(newPrices);
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 10000); // Poll stocks every 10s
    return () => clearInterval(interval);
  }, []);

  // Persist state check
  useEffect(() => {
    const savedSymbol = localStorage.getItem('lastActiveSymbol');
    if (savedSymbol) setActiveSymbol(savedSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAsset = (symbol: string, timeframe: '4H' | '1Q') => {
    setActiveSymbol(symbol);
    setDrawingTimeframe(timeframe);
    localStorage.setItem('lastActiveSymbol', symbol);
    setViewMode('drawing');
  };

  const handlePathComplete = (path: any[]) => {
    setLastPath(path);
  };

  const handleSubmitPrediction = () => {
    if (lastPath.length > 0) {
      const newPrediction = {
        id: crypto.randomUUID(),
        symbol: activeSymbol,
        timeframe: drawingTimeframe, // Save timeframe
        timestamp: Date.now(),
        path: lastPath
      };

      const existing = localStorage.getItem('intuited_predictions');
      const predictions = existing ? JSON.parse(existing) : [];
      predictions.unshift(newPrediction);
      localStorage.setItem('intuited_predictions', JSON.stringify(predictions));
    }
    setViewMode('collective');
  };

  const EXCHANGE_RATE = 1435; // 1 USD = 1435 KRW

  const content = {
    ENG: {
      title: "Intuited",
      motto: "Drawing the Future, Syncing the Swarm",
      desc: (
        <>
          Harness collective intuition to forecast market trends<br />
          Draw your prediction, sync with the swarm
        </>
      ),
    },
    KR: {
      title: "Intuited",
      motto: "데이터로 연결되는 집단 지성, 미래를 그리는 알고리즘",
      desc: (
        <>
          전 세계 참여자들의 실시간 직관 데이터를 결합하여 시장의 향방을 예측합니다.<br />
          당신의 예측을 차트 위에 투영하고, 집단 지성이 만드는 정교한 확률 흐름에 연결하세요.
        </>
      ),
    }
  };


  // Workspace Layout
  const renderContent = () => {
    if (viewMode === 'landing') {
      return (
        <main className="relative z-10 flex flex-col">
          {/* HERO SECTION */}
          <section className="relative h-screen w-full flex items-center justify-center px-10 overflow-hidden">
            {/* Cinematic Background Layer - CSS Only for Maximum Fidelity */}
            <div className="absolute inset-0 z-0 bg-[#020202]">
              {/* Main Ambient Glow - Blue & Purple Mix */}
              <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] opacity-[0.15] bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)] blur-[120px] animate-pulse-slow" />
              <div className="absolute top-[20%] right-[15%] w-[50%] h-[50%] opacity-[0.12] bg-[radial-gradient(circle_at_center,_#a855f7_0%,_transparent_70%)] blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

              {/* Drifting Light Rays */}
              <div className="absolute inset-0 opacity-[0.05] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0%,_#ffffff_20%,_transparent_40%)] animate-spin-extremely-slow" />

              {/* Micro-Noise Texture */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("/assets/noise.svg")' }} />

              {/* Geometric Depth (Subtle) */}
              <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,_rgba(255,255,255,0.1)_1px,_transparent_1px),_linear-gradient(rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:100px_100px]" />

              {/* Vignette & Transition */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10" />
            </div>

            <div className="relative z-20 text-center flex flex-col items-center max-w-6xl mx-auto mt-32 px-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[-0.02em] text-white mb-16 leading-[0.95] mix-blend-screen drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                Welcome to Intuited <span className="text-white/40 text-3xl md:text-5xl lg:text-6xl">(Beta)</span>
              </h1>

              <div className="flex flex-col items-center max-w-2xl">
                <div className="w-16 h-px bg-white/20 mb-12" />
                <p className="text-lg md:text-2xl font-light text-white/50 leading-relaxed tracking-wide mb-20 italic">
                  "{content[lang].motto}"
                </p>
              </div>


            </div>
          </section>

          {/* STATS SECTION */}
          <section className="w-full bg-[#030303] py-40 border-t border-white/5 relative overflow-hidden">
            {/* High-tech depth layers */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="max-w-7xl mx-auto px-10 relative z-10">
              <div className="flex flex-col items-center mb-20">
                <span className="text-xs font-bold tracking-[0.5em] text-[#3b82f6] uppercase mb-4">
                  {lang === 'ENG' ? 'Real-time Protocol Status' : '실시간 집단 지성 프로토콜 상태'}
                </span>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <StatsBoard lang={lang} />
            </div>
          </section>

          {/* ASSETS SECTION */}
          <section className="w-full py-40 px-10 relative bg-gradient-to-b from-black via-[#040404] to-zinc-900/40 border-t border-white/[0.03]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-12">
                <div>
                  <span className="text-[#3b82f6] text-xs font-bold tracking-[0.5em] uppercase mb-4 block">Collective Intelligence Assets</span>
                  <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tight leading-tight">
                    {lang === 'ENG' ? 'Draw Your Market Insights' : '미래 시장을 드로잉으로 예측하기'}
                  </h2>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[11px] text-white/30 tracking-[0.2em] uppercase max-w-xs leading-relaxed">
                    {lang === 'ENG'
                      ? 'Synchronize your intuition with the global swarm protocol'
                      : '전 세계 참여자들의 집단 지성과 당신의 예측을 실시간으로 동기화하세요'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Stocks */}
                <AssetCard symbol="NVDA" name="NVIDIA" price={stockPrices['NVDA'] || 0} lang={lang} exchangeRate={EXCHANGE_RATE} themeColor="#76b900" onDraw={(tf) => handleSelectAsset('NVDA', tf)} />
                <AssetCard symbol="TSLA" name="Tesla" price={stockPrices['TSLA'] || 0} lang={lang} exchangeRate={EXCHANGE_RATE} themeColor="#e31937" onDraw={(tf) => handleSelectAsset('TSLA', tf)} />
                <AssetCard symbol="AAPL" name="Apple" price={stockPrices['AAPL'] || 0} lang={lang} exchangeRate={EXCHANGE_RATE} themeColor="#a2aaad" onDraw={(tf) => handleSelectAsset('AAPL', tf)} />
                <AssetCard symbol="SAMSUNG" name="Samsung" price={stockPrices['SAMSUNG'] || 0} lang={lang} exchangeRate={1} themeColor="#1428a0" onDraw={(tf) => handleSelectAsset('SAMSUNG', tf)} />

                {/* Crypto */}
                <AssetCard symbol="BTC" name="Bitcoin" price={cryptoPrices['BTCUSDT'] || 0} lang={lang} exchangeRate={EXCHANGE_RATE} themeColor="#f7931a" onDraw={(tf) => handleSelectAsset('BTCUSDT', tf)} />
                <AssetCard symbol="ETH" name="Ethereum" price={cryptoPrices['ETHUSDT'] || 0} lang={lang} exchangeRate={EXCHANGE_RATE} themeColor="#627eea" onDraw={(tf) => handleSelectAsset('ETHUSDT', tf)} />
              </div>
            </div>
          </section>

          <footer className="h-32 border-t border-white/10 flex flex-col md:flex-row items-center justify-between px-10 text-xs tracking-widest text-white/30 uppercase bg-black">
            <div className="flex flex-col space-y-2 mb-4 md:mb-0">
              <span className="text-white/50 font-bold">Intuited Corp.</span>
              <span>© 2026 ALL RIGHTS RESERVED.</span>
            </div>
            <div className="flex space-x-12">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>System Status: Optimal</span>
            </div>
          </footer>
        </main>
      );
    }

    if (viewMode === 'management') {
      return <ManagementView onReturn={() => setViewMode('landing')} />;
    }

    // Drawing Mode & Collective Mode (Chart View)
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Simple Header for Drawing Mode */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0 bg-black z-50">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setViewMode('landing')}
              className="text-xs tracking-[0.2em] font-bold text-white/90 hover:text-white transition-all uppercase border border-white/40 hover:border-white px-6 py-2.5 rounded-sm bg-white/[0.05] hover:bg-white/[0.1]"
            >
              RETURN TO HUB
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-white/20 text-[11px] tracking-widest uppercase font-bold">ASSET_ID:</span>
              <span className="text-white font-bold tracking-widest">
                {activeSymbol.replace('USDT', '')}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {drawingTimeframe} MODE
            </span>
          </div>
        </header>

        <div className="flex-1 relative">
          {viewMode === 'drawing' ? (
            <InteractiveChart
              symbol={activeSymbol}
              lang={lang}
              exchangeRate={EXCHANGE_RATE}
              timeframe={drawingTimeframe}
              onPathComplete={handlePathComplete}
              onSubmit={handleSubmitPrediction}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white bg-black">
              <h1 className="text-2xl font-light tracking-[0.5em] mb-4">SYSTEM MERGE COMPLETE</h1>
              <button onClick={() => setViewMode('landing')} className="px-8 py-3 border border-white/40 hover:bg-white hover:text-black transition-all text-xs font-bold tracking-[0.2em]">RETURN TO HUB</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">

      {/* Background Texture Overlay (CSS Noise) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'url("/assets/noise.svg")' }}></div>

      {viewMode === 'landing' && (
        <nav className="fixed top-0 w-full h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-12 z-50 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-4 group cursor-pointer py-4" onClick={() => setViewMode('landing')}>
              <div className="w-6 h-6 border-2 border-white rotate-45 group-hover:rotate-0 transition-transform duration-500 bg-white/10" />
              <span className="text-xl font-bold tracking-[0.2em] text-white">Intuited</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-bold tracking-widest uppercase">
              <button className="text-white/40 hover:text-white transition-colors">Explore</button>
              <button className="text-white/40 hover:text-white transition-colors">How It Works</button>
              <button className="text-white/40 hover:text-white transition-colors">Community</button>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <button onClick={() => setViewMode('management')} className="hidden md:block text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors uppercase">My Insights</button>
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setLang('ENG')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${lang === 'ENG' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/50'}`}
              >
                ENG
              </button>
              <button
                onClick={() => setLang('KR')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${lang === 'KR' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/50'}`}
              >
                KR
              </button>
            </div>
            <div className="border-l border-white/10 pl-6 h-10 flex items-center"><LoginButton /></div>
          </div>
        </nav>
      )}

      {renderContent()}

    </div>
  );
}

// Sub-component wrapper for strict mode in Next.js if needed or separate file ideally.
// But for now keeping it simple as before.
export default function Page() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}


