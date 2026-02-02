"use client";

import React, { useEffect, useState } from 'react';

interface SavedPrediction {
    id: string;
    symbol: string;
    timeframe: '4H' | '1Q';
    timestamp: number;
    path: any[];
}

interface ManagementViewProps {
    onReturn: () => void;
}

export default function ManagementView({ onReturn }: ManagementViewProps) {
    const [predictions, setPredictions] = useState<SavedPrediction[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('intuited_predictions');
        if (saved) {
            try {
                setPredictions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse predictions", e);
            }
        }
    }, []);

    const deletePrediction = (id: string) => {
        const updated = predictions.filter(p => p.id !== id);
        setPredictions(updated);
        localStorage.setItem('intuited_predictions', JSON.stringify(updated));
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-10 overflow-auto">
            <div className="max-w-4xl mx-auto w-full">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">My Insights</h1>
                        <p className="text-white/40 text-[11px] tracking-widest uppercase font-bold">Manage your stored collective signals</p>
                    </div>
                    <button
                        onClick={onReturn}
                        className="px-8 py-3 border border-white/40 hover:bg-white hover:text-black transition-all text-xs font-bold tracking-[0.2em] text-white/90 shadow-lg shadow-white/[0.02] uppercase"
                    >
                        Return to Hub
                    </button>
                </header>

                {predictions.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-white/10 bg-white/5 rounded-sm">
                        <span className="text-white/20 text-xs tracking-widest uppercase mb-4">No data streams found</span>
                        <button
                            onClick={onReturn}
                            className="text-white/60 hover:text-white text-[10px] font-bold tracking-widest uppercase underline"
                        >
                            Start drawing your first prediction
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {predictions.map((p) => (
                            <div
                                key={p.id}
                                className="group flex items-center justify-between p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-sm hover:border-white/30"
                            >
                                <div className="flex items-center space-x-8">
                                    <div className="flex flex-col">
                                        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-black mb-1">Asset</span>
                                        <span className="text-xl font-bold tracking-widest">{p.symbol.replace('USDT', '')}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-black mb-1">Date Signature</span>
                                        <span className="text-xs text-white/60 font-mono tracking-tighter">
                                            {new Date(p.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-black mb-1">Data Points</span>
                                        <span className="text-xs text-white/60 font-mono tracking-tighter">
                                            {p.path.length} Units
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deletePrediction(p.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 text-[10px] font-bold tracking-widest text-red-500/60 hover:text-red-500 uppercase"
                                >
                                    Terminate Stream
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <footer className="mt-20 pt-10 border-t border-white/5">
                    <p className="text-[10px] text-white/10 tracking-[0.3em] leading-relaxed uppercase">
                        Data locally stored in persistent session cache. Terminating a stream deletes it from local storage forever.
                    </p>
                </footer>
            </div>
        </div>
    );
}
