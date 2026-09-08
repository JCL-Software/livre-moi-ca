export function ParcelPhotosScreen() {
  return (
    <div className="flex h-full flex-col bg-slate-950 px-4 pb-8 pt-14 text-white">
      <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-300">
        Preuve photo
      </p>
      <h2 className="mt-1 text-center font-space text-lg font-extrabold leading-tight">
        Photos du colis
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <figure className="overflow-hidden rounded-xl bg-violet-950 ring-1 ring-white/10">
          <div className="flex h-24 items-center justify-center bg-gradient-to-br from-violet-400 to-slate-700">
            <span className="h-10 w-14 rounded-md bg-amber-200 shadow-md" />
          </div>
          <figcaption className="px-2 py-1.5 text-[10px] font-bold leading-tight text-violet-100">
            Prise en charge
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-xl bg-violet-950 ring-1 ring-white/10">
          <div className="flex h-24 items-center justify-center bg-gradient-to-br from-sky-400 to-slate-700">
            <span className="h-10 w-14 rounded-md bg-amber-100 shadow-md" />
          </div>
          <figcaption className="px-2 py-1.5 text-[10px] font-bold leading-tight text-violet-100">
            Remise
          </figcaption>
        </figure>
      </div>

      <p className="mt-3 text-center text-[10px] font-semibold text-white/55">
        État photographié aux deux étapes
      </p>

      <div className="mt-auto flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/80 bg-violet-500 text-[10px] font-extrabold">
          OK
        </span>
      </div>
    </div>
  );
}
