"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_UX_SKIN,
  UX_SKINS,
  UX_SKIN_STORAGE_KEY,
  isUxSkinId,
  type UxSkinId,
} from "@/lib/ux-lab/skins";

function applySkin(skin: UxSkinId) {
  document.documentElement.setAttribute("data-ux-skin", skin);
  window.localStorage.setItem(UX_SKIN_STORAGE_KEY, skin);
}

export function SkinSwitcher() {
  const [open, setOpen] = useState(true);
  const [skin, setSkin] = useState<UxSkinId>(DEFAULT_UX_SKIN);

  useEffect(() => {
    const stored = window.localStorage.getItem(UX_SKIN_STORAGE_KEY);
    const next = isUxSkinId(stored) ? stored : DEFAULT_UX_SKIN;
    setSkin(next);
    applySkin(next);
  }, []);

  return (
    <div className="ux-lab-switcher">
      {open ? (
        <div className="ux-lab-switcher-panel">
          <p className="ux-lab-switcher-hint">
            Dossier isolé — l’autre éditeur n’est pas modifié. Choisis un rendu :
          </p>
          <div className="ux-lab-switcher-list">
            {UX_SKINS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === skin ? "is-active" : undefined}
                onClick={() => {
                  setSkin(item.id);
                  applySkin(item.id);
                }}
              >
                <span
                  className="ux-lab-swatch"
                  style={{ background: item.swatch }}
                />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="ux-lab-switcher-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        Lab UX {open ? "▾" : "▸"} · {UX_SKINS.find((item) => item.id === skin)?.label}
      </button>
    </div>
  );
}
