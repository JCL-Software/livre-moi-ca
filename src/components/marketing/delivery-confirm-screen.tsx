export function DeliveryConfirmScreen() {
  return (
    <div className="flex h-full flex-col bg-white px-4 pb-8 pt-14 text-slate-900">
      <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
        Remise sécurisée
      </p>
      <h2 className="mt-1 text-center font-space text-lg font-extrabold leading-tight">
        Livraison confirmée
      </h2>

      <div className="mx-auto mt-5 grid h-28 w-28 grid-cols-5 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        {Array.from({ length: 25 }, (_, index) => (
          <span
            key={index}
            className={
              [0, 1, 2, 4, 5, 7, 10, 12, 14, 17, 19, 20, 22, 23, 24].includes(index)
                ? "rounded-[2px] bg-slate-950"
                : "rounded-[2px] bg-slate-100"
            }
          />
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] font-semibold text-slate-500">
        Code de remise
      </p>
      <p className="mt-1 text-center font-space text-2xl font-extrabold tracking-[0.28em] text-slate-950">
        4821
      </p>

      <div className="mt-auto rounded-xl bg-emerald-50 px-3 py-2 text-center text-[11px] font-bold text-emerald-700">
        QR scanné — Colis reçu
      </div>
    </div>
  );
}
