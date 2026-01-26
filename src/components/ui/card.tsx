export function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border p-6 shadow-sm">
      <div className="h-1 w-24 rounded-full bg-accent-gradient" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
    </div>
  );
}
