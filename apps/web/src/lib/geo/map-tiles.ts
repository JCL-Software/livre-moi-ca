/** Tuiles OpenStreetMap officielles — Données libres, sans clé API. */
export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const OSM_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Fond rue sans clé API — Rendu Esri World Street Map. */
export const STREET_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

export const STREET_TILE_ATTRIBUTION =
  "Tiles &copy; Esri";

/** Fond vectoriel clair (style proche Google / Uber) — OpenFreeMap, sans clé API. */
export const OPENFREEMAP_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

/** Fond épuré, peu de labels — OpenFreeMap Positron. */
export const OPENFREEMAP_POSITRON_STYLE_URL =
  "https://tiles.openfreemap.org/styles/positron";

export const OPENFREEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://openfreemap.org">OpenFreeMap</a>';
