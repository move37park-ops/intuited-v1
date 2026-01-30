"use client";

import { useEffect, useState } from 'react';

interface StatsBoardProps {
    lang: 'ENG' | 'KR';
}

export default function StatsBoard({ lang }: StatsBoardProps) {
    const [stats, setStats] = useState({
        totalPaths: 124503,
        activeParticipants: 428,
        systemAccuracy: 64.2
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                totalPaths: prev.totalPaths + Math.floor(Math.random() * 3),
                activeParticipants: 400 + Math.floor(Math.random() * 50),
                systemAccuracy: 64.0 + Math.random() * 2
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const labels = {
        ENG: {
            paths: "TOTAL PATHS",
            participants: "ACTIVE PARTICIPANTS",
            accuracy: "SYSTEM ACCURACY"
        },
        KR: {
            paths: "총 예측 경로 수",
            participants: "총 참여자 수",
            accuracy: "시스템 정확도"
        }
    };

    return (
        <div className="flex items-center justify-center space-x-6 md:space-x-12">
            <StatItem label={labels[lang].paths} value={stats.totalPaths.toLocaleString()} />
            <div className="w-px h-6 bg-white/10" />
            <StatItem label={labels[lang].participants} value={stats.activeParticipants.toString()} />
            <div className="w-px h-6 bg-white/10" />
            <StatItem label={labels[lang].accuracy} value={`${stats.systemAccuracy.toFixed(1)} %`} />
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col items-center text-center w-36 md:w-60 overflow-hidden">
            <span className="text-[11px] md:text-sm tracking-[0.2em] text-white/50 mb-2 leading-none uppercase truncate w-full font-normal">
                {label}
            </span>
            <span className="text-2xl md:text-4xl font-medium text-white leading-none tabular-nums tracking-tight">
                {value}
            </span>
        </div>
    );
}


