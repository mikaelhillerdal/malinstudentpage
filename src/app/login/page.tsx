import { LoginForm } from "./ui";

function Sparkles() {
  // Simple sparkle burst (pure CSS)
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
    <div className="poop-wrap">
      <div className="rainbow-poop" aria-label="Rainbow poop" title="Rainbow poop" />
      <Sparkles />
    </div>
  );
}

function SillyUnicornSvg() {
  // Inline SVG goofy unicorn (not emoji), with tongue + tail group we can wiggle.
  return (
    <svg
      width="320"
      height="210"
      viewBox="0 0 320 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="unicorn-svg select-none"
      aria-label="Silly unicorn"
    >
      {/* Tail group (wiggled by CSS) */}
      <g className="tail">
        <path
          d="M72 116c-26 6-42 28-39 52 14-14 34-17 50-13-14-15-12-29-11-39Z"
          fill="#a855f7"
          opacity="0.9"
        />
        <path
          d="M66 112c-14 14-22 32-20 52 12-15 26-20 42-20-14-11-18-20-22-32Z"
          fill="#22d3ee"
          opacity="0.85"
        />
        <path
          d="M74 124c-14 10-20 26-16 40 10-10 22-12 32-10-10-8-14-18-16-30Z"
          fill="#ef4444"
          opacity="0.55"
        />
      </g>

      {/* Body */}
      <ellipse cx="168" cy="122" rx="96" ry="58" fill="#fff" />
      <ellipse cx="168" cy="122" rx="96" ry="58" fill="rgba(168,85,247,0.10)" />
      <ellipse cx="168" cy="122" rx="96" ry="58" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />

      {/* Neck */}
      <path
        d="M198 82c22-12 48-12 66 8 10 12 10 32-2 42-12 10-34 2-52-8"
        fill="#fff"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Head */}
      <ellipse cx="270" cy="100" rx="32" ry="26" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />

      {/* Mane */}
      <path
        d="M224 70c-10 8-12 16-8 30 5 14 2 22-12 30 22-5 30-14 30-26 0-10 6-16 18-18-12-8-20-11-28-16Z"
        fill="#22d3ee"
        opacity="0.9"
      />
      <path
        d="M236 70c-8 10-8 20-3 30 6 12 3 20-16 28 26-3 36-14 36-26 0-10 6-16 18-18-12-8-22-11-35-14Z"
        fill="#a855f7"
        opacity="0.75"
      />

      {/* Horn */}
      <path
        d="M262 58l10-30 12 30c-10-5-14-5-22 0Z"
        fill="#facc15"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M264 56c10-5 15-5 22 0" stroke="rgba(168,85,247,0.55)" strokeWidth="3" />
      <path d="M266 48c8-4 12-4 16 0" stroke="rgba(34,211,238,0.55)" strokeWidth="3" />

      {/* Eyes: one “normal”, one cross-eyed. Blink happens via CSS scaling the lids */}
      <g className="eyes">
        {/* Big eye */}
        <circle cx="280" cy="95" r="7" fill="#111" />
        <circle cx="282.5" cy="92.5" r="2.5" fill="#fff" opacity="0.9" />
        {/* Little cross-eye */}
        <circle cx="262" cy="98" r="3.5" fill="#111" opacity="0.75" />
      </g>

      {/* Mouth + tongue (extra silly) */}
      <path d="M258 112c12 12 26 10 34 0" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M284 118c-2 8-10 10-16 3" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Tongue */}
      <path
        d="M282 122c6 8 2 14-6 14-6 0-10-6-6-12"
        fill="#ef4444"
        opacity="0.9"
      />

      {/* Legs */}
      <rect x="140" y="154" width="18" height="44" rx="7" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
      <rect x="182" y="154" width="18" height="44" rx="7" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
      <rect x="120" y="158" width="18" height="40" rx="7" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
      <rect x="204" y="158" width="18" height="40" rx="7" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />

      {/* Hooves */}
      <rect x="118" y="192" width="24" height="12" rx="6" fill="#111" opacity="0.85" />
      <rect x="138" y="192" width="24" height="12" rx="6" fill="#111" opacity="0.85" />
      <rect x="180" y="192" width="24" height="12" rx="6" fill="#111" opacity="0.85" />
      <rect x="202" y="192" width="24" height="12" rx="6" fill="#111" opacity="0.85" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="grid gap-6">
      {/* Login box */}
      <div className="rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Log in</h2>
        <p className="mt-1 text-sm text-zinc-600">Use the email + password from your invitation.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>

      {/* Unicorn animation BELOW login */}
      <div className="relative overflow-hidden rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">A silly unicorn crashes the party…</h2>
        <p className="mt-1 text-sm text-zinc-600">
          It bounces in, wiggles, blinks dramatically, and drops a rainbow “gift”.
        </p>

        <div className="mt-6">
          <div className="relative h-[300px] rounded-2xl bg-white">
            {/* Base faint ground */}
            <div className="ground-base absolute left-6 right-6 bottom-12 h-2 rounded-full opacity-25" />

            {/* The “ground line” that draws in under hooves */}
            <div className="ground-trail absolute left-6 bottom-12 h-2 rounded-full" />

            {/* Runner travels from far left into center */}
            <div className="runner absolute left-0 bottom-14">
              <div className="bounce">
                <SillyUnicornSvg />
              </div>

              {/* Rainbow poop appears when it stops */}
              <div className="poop absolute left-[80px] -bottom-6 opacity-0">
                <RainbowPoop />
              </div>

            </div>
          </div>
        </div>

        <style>{`
          /* Ground gradients */
          .ground-base {
            background-image: linear-gradient(90deg, rgba(34,211,238,0.6), rgba(168,85,247,0.6), rgba(239,68,68,0.6));
          }
          .ground-trail {
            width: 0%;
            background-image: linear-gradient(90deg, #facc15 0%, #22c55e 100%);
            opacity: 0.9;
            animation: trailGrow 2.6s ease-out forwards;
          }

          /* Runner path */
          .runner {
            animation: runIn 2.6s cubic-bezier(.2,.95,.2,1) forwards;
          }


          /* Bouncy run while moving; stops bouncing at the end */
          .bounce {
            animation: bob 0.22s ease-in-out infinite;
          }
          @keyframes bob {
            0%   { transform: translateY(0px) rotate(-0.5deg); }
            50%  { transform: translateY(-6px) rotate(0.5deg); }
            100% { transform: translateY(0px) rotate(-0.5deg); }
          }
          /* Stop the bob after arriving (using animation-delay + fill mode trick) */
          .runner .bounce {
            animation: bob 0.22s ease-in-out infinite,
                       bobStop 2.6s steps(1) forwards;
          }
          @keyframes bobStop {
            0%, 90% { }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          /* Tail wiggle while running */
          .unicorn-svg .tail {
            transform-origin: 76px 128px;
            animation: tailWiggle 0.18s ease-in-out infinite;
          }
          /* Stop wiggle after arrival */
          .runner .unicorn-svg .tail {
            animation: tailWiggle 0.18s ease-in-out infinite,
                       tailStop 2.6s steps(1) forwards;
          }
          @keyframes tailWiggle {
            0%   { transform: rotate(8deg); }
            50%  { transform: rotate(-8deg); }
            100% { transform: rotate(8deg); }
          }
          @keyframes tailStop {
            0%, 90% { }
            100% { transform: rotate(0deg); }
          }

          /* Blink when it stops to poop (squash eyes) */
          .unicorn-svg .eyes {
            transform-origin: 272px 96px;
            animation: none;
          }
          .runner .unicorn-svg .eyes {
            animation: blinkAtStop 2.6s ease-out forwards;
          }
          @keyframes blinkAtStop {
            0%, 74% { transform: scaleY(1); }
            79%     { transform: scaleY(0.12); }
            83%     { transform: scaleY(1); }
            88%     { transform: scaleY(0.12); }
            92%     { transform: scaleY(1); }
            100%    { transform: scaleY(1); }
          }

          /* Poop appears near the end */
          .poop {
            animation: poopPop 2.6s ease-out forwards;
          }
          @keyframes poopPop {
            0%, 74% { opacity: 0; transform: translateY(-10px) scale(0.85); }
            82%     { opacity: 1; transform: translateY(0px) scale(1.08); }
            100%    { opacity: 1; transform: translateY(0px) scale(1.0); }
          }

          /* Rainbow poop */
          .poop-wrap {
            position: relative;
            width: 64px;
            height: 64px;
          }
          .rainbow-poop {
            width: 56px;
            height: 56px;
            border-radius: 9999px;
            background-image: linear-gradient(90deg, #22d3ee, #a855f7, #ef4444, #f59e0b, #22c55e, #3b82f6, #ec4899);
            background-size: 200% 200%;
            animation: rainbowShift 1.1s ease-in-out infinite alternate;
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
            position: absolute;
            left: 4px;
            top: 4px;
          }
          .rainbow-poop::before {
            content: "";
            position: absolute;
            inset: 8px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.32);
          }
          .rainbow-poop::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            right: 8px;
            top: 8px;
            background: rgba(255,255,255,0.55);
          }
          @keyframes rainbowShift {
            0%   { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          /* Sparkle burst */
          .sparkles {
            position: absolute;
            left: 0;
            top: 0;
            width: 64px;
            height: 64px;
            opacity: 0;
            transform: scale(0.8);
            animation: sparkleBurst 2.6s ease-out forwards;
          }
          @keyframes sparkleBurst {
            0%, 74% { opacity: 0; transform: scale(0.8); }
            82%     { opacity: 1; transform: scale(1.0); }
            100%    { opacity: 0; transform: scale(1.15); }
          }
          .spark {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 9999px;
            background-image: linear-gradient(90deg, #22d3ee, #a855f7, #ef4444);
            filter: blur(0.1px);
            opacity: 0.9;
          }
          /* Individual sparkle trajectories */
          .s0 { left: 6px;  top: 6px;  animation: sp0 2.6s ease-out forwards; }
          .s1 { left: 28px; top: 2px;  animation: sp1 2.6s ease-out forwards; }
          .s2 { left: 48px; top: 10px; animation: sp2 2.6s ease-out forwards; }
          .s3 { left: 54px; top: 32px; animation: sp3 2.6s ease-out forwards; }
          .s4 { left: 44px; top: 50px; animation: sp4 2.6s ease-out forwards; }
          .s5 { left: 20px; top: 56px; animation: sp5 2.6s ease-out forwards; }
          .s6 { left: 2px;  top: 40px; animation: sp6 2.6s ease-out forwards; }
          .s7 { left: 10px; top: 28px; animation: sp7 2.6s ease-out forwards; }
          .s8 { left: 36px; top: 18px; animation: sp8 2.6s ease-out forwards; }
          .s9 { left: 30px; top: 44px; animation: sp9 2.6s ease-out forwards; }

          /* Spark animations only after poop time */
          @keyframes sp0 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(-16px,-18px) scale(1)} 100%{transform:translate(-22px,-28px) scale(0)} }
          @keyframes sp1 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(0,-22px) scale(1)} 100%{transform:translate(2px,-34px) scale(0)} }
          @keyframes sp2 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(18px,-12px) scale(1)} 100%{transform:translate(26px,-18px) scale(0)} }
          @keyframes sp3 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(22px,0) scale(1)} 100%{transform:translate(34px,4px) scale(0)} }
          @keyframes sp4 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(14px,16px) scale(1)} 100%{transform:translate(20px,28px) scale(0)} }
          @keyframes sp5 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(-8px,18px) scale(1)} 100%{transform:translate(-14px,30px) scale(0)} }
          @keyframes sp6 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(-18px,6px) scale(1)} 100%{transform:translate(-30px,10px) scale(0)} }
          @keyframes sp7 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(-14px,0) scale(1)} 100%{transform:translate(-24px,2px) scale(0)} }
          @keyframes sp8 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(8px,-10px) scale(1)} 100%{transform:translate(14px,-18px) scale(0)} }
          @keyframes sp9 { 0%,74%{transform:translate(0,0) scale(0)} 82%{transform:translate(2px,10px) scale(1)} 100%{transform:translate(4px,20px) scale(0)} }

          /* Runner travel */
          @keyframes runIn {
            0%   { transform: translateX(-420px); }
            75%  { transform: translateX(calc(50% - 190px)); }
            100% { transform: translateX(calc(50% - 190px)); }
          }


          /* Ground draw */
          @keyframes trailGrow {
            0%  { width: 0%; opacity: 0.0; }
            10% { opacity: 0.9; }
            75% { width: 62%; opacity: 0.9; }
            100%{ width: 62%; opacity: 0.9; }
          }

          /* Small screens: adjust center position a bit */
          @media (max-width: 420px) {
            @keyframes runIn {
              0%   { transform: translateX(-420px); }
              75%  { transform: translateX(calc(50vw - 185px)); }
              100% { transform: translateX(calc(50vw - 185px)); }
            }
          }
        `}</style>
      </div>
    </div>
  );
}
