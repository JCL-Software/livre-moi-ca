/**
 * Carte par défaut Livre-moi.ca.
 * Base Mapbox Streets ; la palette et les pastilles sont appliquées au runtime (GL JS).
 * Ne pas substituer dark-v11, outdoors, satellite, ni un autre style Mapbox.
 */
export const MAPBOX_STYLE_DEFAULT = "mapbox://styles/mapbox/streets-v12";
export const MAPBOX_STYLE_STATIC = "mapbox/streets-v12";

export const MAP_PALETTE = {
  land: "#EDF0F6",
  water: "#ACD5FD",
  waterEdge: "#A1CAF9",
  parkFar: "#DAEADB",
  park: "#BDE5C1",
  parkNear: "#a7dfb6",
  hospital: "#FBD6D4",
  beach: "#FFF4CE",
  building: "#D8DAE2",
  roadLocal: "#FFFFFF",
  roadLocalCase: "#D7DCE5",
  roadHighway: "#A2AFD3",
  roadMotorway: "#8599D1",
  roadMotorwayCase: "#91A0C9",
  shieldBlue: "#5B82E8",
  shieldGreen: "#3EAF7A",
} as const;
