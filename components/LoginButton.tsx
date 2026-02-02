"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className="flex items-center space-x-4">
                {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-white/20 shadow-sm"
                    />
                )}
                <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider leading-none mb-1">Authenticated</span>
                    <button
                        onClick={() => signOut()}
                        className="text-[10px] font-bold tracking-widest text-white/40 hover:text-white transition-colors uppercase"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("google")}
            className="px-6 py-2 border border-white/25 hover:border-white text-[10px] font-bold tracking-widest text-white/80 hover:text-white transition-all uppercase bg-white/5 hover:bg-white/10 rounded-sm"
        >
            Sign In with Google
        </button>
    );
}
