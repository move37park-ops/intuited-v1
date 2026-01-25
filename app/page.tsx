"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import InteractiveChart from '@/components/InteractiveChart';
import { useBinanceStream } from '@/hooks/useBinanceStream';

export default function Home() {
  // const [candles, setCandles] = useState<CandleData[]>([]); // Moved to InteractiveChart
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const prices = useBinanceStream(['btcusdt', 'ethusdt', 'solusdt']);
  const currentPrice = prices[activeSymbol] || 0;

  /*
  useEffect(() => {
    // Fetch logic moved to InteractiveChart
    fetchHistoricalData('BTCUSDT', '1m', 180).then(data => {
      setCandles(data);
    });
  }, []);
  */

  const [viewMode, setViewMode] = useState<'drawing' | 'collective'>('drawing');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--background)' }}>
      <Sidebar
        prices={prices}
        activeSymbol={activeSymbol}
        onSelectSymbol={(s) => { setActiveSymbol(s); setViewMode('drawing'); }}
      />

      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Header / Top Bar */}
        <header style={{
          height: '60px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ color: '#888', marginRight: '10px' }}>{activeSymbol.replace('USDT', '')}/USD</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>
              ● {currentPrice ? currentPrice.toFixed(2) : 'Loading...'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#555' }}>Global Market Cap: $325M</span>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {viewMode === 'drawing' ? (
            <InteractiveChart
              symbol={activeSymbol}
              onSubmit={() => setViewMode('collective')}
            />
          ) : (
            // Collective View (Mockup using the generated Heatmap Idea)
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url("https://i.imgur.com/example.png")', // Placeholder or just CSS
              backgroundSize: 'cover',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              background: '#000'
            }}>
              {/*  Use a complex CSS gradient to simulate the "Heatmap" if no image accessible.
                      Or just a success message. User asked for "Screen with other people's drawings".
                      I'll create a simple CSS-based "Heatmap" representation.
                 */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.2), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, transparent 1px 40px)'
              }} />

              <h1 style={{ zIndex: 10, fontSize: '32px', marginBottom: '20px' }}>COLLECTIVE INTELLIGENCE</h1>
              <p style={{ zIndex: 10, color: '#888' }}>Your prediction has been merged with 14,203 global signals.</p>

              <div style={{
                marginTop: '40px', zIndex: 10,
                border: '1px solid #333', padding: '20px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.8)'
              }}>
                <div>CONSENSUS: <span style={{ color: '#00ff88' }}>BULLISH (68%)</span></div>
              </div>

              <button
                onClick={() => setViewMode('drawing')}
                style={{
                  marginTop: '40px', zIndex: 10,
                  background: 'transparent', border: '1px solid #555', color: '#fff',
                  padding: '10px 20px', cursor: 'pointer',
                  borderRadius: '0', // Square
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Back to Chart
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
