export function RequestAcceptedScreen() {
  return (
    <div className="flex h-full flex-col bg-[#0b1e35] px-4 pb-8 pt-14 text-white">
      <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-300">
        Notification
      </p>
      <h2 className="mt-1 text-center font-space text-lg font-extrabold leading-tight">
        Demande acceptée
      </h2>

      <div className="mt-5 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold">
            A
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">Alex B.</p>
            <p className="text-[11px] text-sky-100">Conducteur vérifié</p>
          </div>
        </div>
        <p className="mt-3 text-[12px] font-semibold leading-snug text-sky-50">
          Val-d&apos;Or → Gatineau
        </p>
        <p className="mt-1 text-[11px] text-white/70">Départ demain, 7 h 30</p>
      </div>

      <div className="mt-auto rounded-xl bg-orange-500/20 px-3 py-2 text-center text-[11px] font-bold text-orange-100">
        Votre colis est pris en charge
      </div>
    </div>
  );
}
