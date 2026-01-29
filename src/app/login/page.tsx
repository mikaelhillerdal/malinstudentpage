"use client";

import Image from "next/image";
import { LoginForm } from "./ui";

function Sparkles() {
  return (
    <div className="sparkles pointer-events-none" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={`spark s${i}`} />
      ))}
    </div>
  );
}

function RainbowPoop() {
  return (
    <div className="poop-wrap" aria-label="Rainbow poop">
      <span className="poop-emoji">💩</span>
      <Sparkles />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid gap-6">
      {/* Login box */}
      <div className="rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Log in</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Use the email + password from your invitation.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>

      {/* Unicorn animation */}
      <div className="relative overflow-hidden rounded-3xl border p-6 shadow-sm">
        
        <div className="mt-6">
          <div className="relative h-[300px] rounded-2xl bg-white">
            {/* Ground */}
            <div className="ground-base absolute left-6 right-6 bottom-12 h-2 rounded-full opacity-25" />
            <div className="ground-trail absolute left-6 bottom-12 h-2 rounded-full" />

            {/* Runner */}
            <div className="runner absolute left-0 bottom-14">
              <div className="bounce relative">
<Image
                  src="/unicorn.png"
                  alt="Silly unicorn"
                  width={200}
                  height={200}
                  className="unicorn-img select-none"
                  draggable={false}
                />

                {/* Poop behind back legs */}
                <div className="poop absolute -left-4 bottom-2 opacity-0">
                  <RainbowPoop />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          .unicorn-img {
            width: 320px;
            height: auto;
            pointer-events: none;
          }

          .runner {
            animation: runIn 2.6s cubic-bezier(.2,.95,.2,1) forwards;
          }

          .bounce {
            animation: bob 0.24s ease-in-out infinite,
                       bobStop 2.6s steps(1) forwards;
          }

          @keyframes bob {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }

          @keyframes bobStop {
            0%, 85% {}
            100% { transform: translateY(0); }
          }

          @keyframes runIn {
            0%   { transform: translateX(-420px); }
            75%  { transform: translateX(clamp(160px, 55%, calc(100% - 360px))); }
            100% { transform: translateX(clamp(160px, 55%, calc(100% - 360px))); }
          }

          .ground-base {
            background-image: linear-gradient(
              90deg,
              rgba(34,211,238,0.6),
              rgba(168,85,247,0.6),
              rgba(239,68,68,0.6)
            );
          }

          .ground-trail {
            width: 0%;
            background-image: linear-gradient(90deg, #facc15, #22c55e);
            animation: trailGrow 2.6s ease-out forwards;
          }

          @keyframes trailGrow {
            0% { width: 0%; opacity: 0; }
            10% { opacity: 0.9; }
            75% { width: calc(100% - 3rem); opacity: 0.9; }
            100% { width: calc(100% - 3rem); opacity: 0.9; }
          }

          .poop {
            animation: poopPop 2.6s ease-out forwards;
          }

          @keyframes poopPop {
            0%, 74% { opacity: 0; transform: translateY(-10px) scale(0.8); }
            82% { opacity: 1; transform: translateY(0) scale(1.05); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          .poop-wrap {
            position: relative;
            width: 80px;
            height: 80px;
          }

          .poop-emoji {
            font-size: 64px;
            background-image: linear-gradient(
              90deg,
              #22d3ee,
              #a855f7,
              #ef4444,
              #f59e0b,
              #22c55e,
              #3b82f6,
              #ec4899
            );
            background-size: 200% 200%;
            animation: rainbowShift 1.1s ease-in-out infinite alternate;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 10px 18px rgba(0,0,0,0.18));
          }

          @keyframes rainbowShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          .sparkles {
            position: absolute;
            inset: 0;
            opacity: 0;
            animation: sparkleBurst 2.6s ease-out forwards;
          }

          @keyframes sparkleBurst {
            0%, 74% { opacity: 0; }
            82% { opacity: 1; }
            100% { opacity: 0; }
          }

          .spark {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-image: linear-gradient(90deg, #22d3ee, #a855f7, #ef4444);
          }
        `}</style>
      </div>
    </div>
  );
}
