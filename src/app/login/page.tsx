import { LoginForm } from "./ui";

export default function LoginPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Log in</h2>
        <p className="mt-1 text-sm text-zinc-600">Use the email + password from your invitation.</p>
        <div className="mt-6"><LoginForm /></div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">A very serious unicorn</h2>
        <p className="mt-1 text-sm text-zinc-600">Runs in… stops… does its thing.</p>

        <div className="mt-6">
          <div className="relative h-56 rounded-2xl bg-white">
            <div className="absolute inset-x-6 bottom-8 h-2 rounded-full bg-login-run opacity-80" />
            <div className="absolute left-6 bottom-10 w-[calc(100%-3rem)]">
              <div className="unicorn-run relative h-40">
                <div className="ground-trail absolute bottom-2 left-0 h-2 rounded-full bg-login-run" />
                <div className="unicorn absolute bottom-6 left-0">
                  <div className="select-none text-7xl">🦄</div>
                  <div className="poop absolute -right-2 -bottom-6 select-none text-4xl opacity-0">💩</div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            .unicorn-run .unicorn { animation: runin 2.2s ease-out forwards; }
            .unicorn-run .ground-trail { width: 0%; animation: trail 2.2s ease-out forwards; }
            .unicorn-run .poop { animation: poop 2.2s ease-out forwards; }
            @keyframes runin { 0%{transform:translateX(0)} 80%{transform:translateX(55%)} 100%{transform:translateX(55%)} }
            @keyframes trail { 0%{width:0;opacity:0} 10%{opacity:.8} 80%{width:62%;opacity:.8} 100%{width:62%;opacity:.8} }
            @keyframes poop { 0%,75%{opacity:0;transform:translateY(-6px)} 85%,100%{opacity:1;transform:translateY(0)} }
          `}</style>
        </div>
      </div>
    </div>
  );
}
