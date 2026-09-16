import type { Map as MapboxMap } from "mapbox-gl";
import { MAP_PALETTE } from "@livre-moi/shared/geo";

const SHIELD_BLUE_ID = "lm-shield-blue";
const SHIELD_GREEN_ID = "lm-shield-green";

function setPaint(
  map: MapboxMap,
  layerId: string,
  property: string,
  value: unknown,
) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setPaintProperty(layerId, property, value);
  } catch {
    /* layer exists but property not applicable */
  }
}

function setLayout(
  map: MapboxMap,
  layerId: string,
  property: string,
  value: unknown,
) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setLayoutProperty(layerId, property, value);
  } catch {
    /* ignore */
  }
}

function setVisibility(map: MapboxMap, layerId: string, visibility: "visible" | "none") {
  setLayout(map, layerId, "visibility", visibility);
}

const MOTORWAY_FILL = [
  "road-motorway-trunk",
  "road-major-link",
  "bridge-motorway-trunk",
  "bridge-motorway-trunk-2",
  "bridge-major-link",
  "bridge-major-link-2",
  "tunnel-motorway-trunk",
  "tunnel-major-link",
];

const MOTORWAY_CASE = [
  "road-motorway-trunk-case",
  "road-major-link-case",
  "bridge-motorway-trunk-case",
  "bridge-motorway-trunk-2-case",
  "bridge-major-link-case",
  "bridge-major-link-2-case",
  "tunnel-motorway-trunk-case",
  "tunnel-major-link-case",
];

const HIGHWAY_FILL = [
  "road-primary",
  "bridge-primary",
  "tunnel-primary",
];

const HIGHWAY_CASE = [
  "road-primary-case",
  "bridge-primary-case",
  "tunnel-primary-case",
];

const LOCAL_FILL = [
  "road-secondary-tertiary",
  "road-street",
  "road-street-low",
  "road-minor",
  "road-minor-link",
  "road-path",
  "road-pedestrian",
  "road-polygon",
  "bridge-secondary-tertiary",
  "bridge-street",
  "bridge-street-low",
  "bridge-minor",
  "bridge-minor-link",
  "tunnel-secondary-tertiary",
  "tunnel-street",
  "tunnel-street-low",
  "tunnel-minor",
  "tunnel-minor-link",
];

const LOCAL_CASE = [
  "road-secondary-tertiary-case",
  "road-street-case",
  "road-minor-case",
  "road-minor-link-case",
  "road-pedestrian-case",
  "bridge-secondary-tertiary-case",
  "bridge-street-case",
  "bridge-minor-case",
  "bridge-minor-link-case",
  "tunnel-secondary-tertiary-case",
  "tunnel-street-case",
  "tunnel-minor-case",
  "tunnel-minor-link-case",
];

function addStretchablePill(map: MapboxMap, id: string, fill: string) {
  if (map.hasImage(id)) map.removeImage(id);
  const pixelRatio = 2;
  const width = 28;
  const height = 22;
  const canvas = document.createElement("canvas");
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(pixelRatio, pixelRatio);
  const radius = height / 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  map.addImage(id, ctx.getImageData(0, 0, canvas.width, canvas.height), {
    pixelRatio,
    stretchX: [[radius * pixelRatio, (width - radius) * pixelRatio]],
    content: [
      6 * pixelRatio,
      3 * pixelRatio,
      22 * pixelRatio,
      19 * pixelRatio,
    ],
  });
}

function applyRoadShields(map: MapboxMap) {
  addStretchablePill(map, SHIELD_BLUE_ID, MAP_PALETTE.shieldBlue);
  addStretchablePill(map, SHIELD_GREEN_ID, MAP_PALETTE.shieldGreen);

  setLayout(map, "road-number-shield", "icon-image", [
    "match",
    ["get", "class"],
    "motorway",
    SHIELD_BLUE_ID,
    SHIELD_GREEN_ID,
  ]);
  setLayout(map, "road-number-shield", "icon-text-fit", "both");
  setLayout(map, "road-number-shield", "icon-text-fit-padding", [2, 4, 2, 4]);
  setLayout(map, "road-number-shield", "text-size", 11);
  setLayout(map, "road-number-shield", "text-letter-spacing", 0);
  setLayout(map, "road-number-shield", "symbol-spacing", [
    "interpolate",
    ["linear"],
    ["zoom"],
    11,
    260,
    14,
    420,
  ]);
  setPaint(map, "road-number-shield", "text-color", "#ffffff");
}

/** Applique la carte par défaut Livre-moi sur une instance Mapbox GL. */
export function applyDefaultMapStyle(map: MapboxMap) {
  const {
    land,
    water,
    waterEdge,
    parkFar,
    park,
    parkNear,
    hospital,
    beach,
    building,
    roadLocal,
    roadLocalCase,
    roadHighway,
    roadMotorway,
    roadMotorwayCase,
  } = MAP_PALETTE;

  setPaint(map, "land", "background-color", land);
  setPaint(map, "landcover", "fill-color", land);
  setPaint(map, "landcover", "fill-opacity", 0.35);
  setPaint(map, "national-park", "fill-color", parkFar);
  setPaint(map, "landuse", "fill-color", [
    "match",
    ["get", "class"],
    "park",
    park,
    "pitch",
    parkNear,
    "grass",
    parkFar,
    "wood",
    parkFar,
    "scrub",
    parkFar,
    "hospital",
    hospital,
    "school",
    land,
    "sand",
    beach,
    land,
  ]);
  setPaint(map, "pitch-outline", "line-color", park);
  setPaint(map, "water", "fill-color", water);
  setPaint(map, "water-shadow", "fill-color", waterEdge);
  setPaint(map, "waterway", "line-color", water);
  setPaint(map, "waterway-shadow", "line-color", waterEdge);

  setVisibility(map, "hillshade", "none");
  setVisibility(map, "water-depth", "none");
  setVisibility(map, "poi-label", "none");
  setVisibility(map, "transit-label", "none");

  setPaint(map, "building", "fill-color", building);
  setPaint(map, "building", "fill-opacity", 0.6);
  setPaint(map, "aeroway-polygon", "fill-color", land);
  setPaint(map, "aeroway-line", "line-color", roadLocalCase);

  for (const id of MOTORWAY_FILL) setPaint(map, id, "line-color", roadMotorway);
  for (const id of MOTORWAY_CASE) setPaint(map, id, "line-color", roadMotorwayCase);
  for (const id of HIGHWAY_FILL) setPaint(map, id, "line-color", roadHighway);
  for (const id of HIGHWAY_CASE) setPaint(map, id, "line-color", roadMotorwayCase);
  for (const id of LOCAL_FILL) setPaint(map, id, "line-color", roadLocal);
  for (const id of LOCAL_CASE) setPaint(map, id, "line-color", roadLocalCase);

  applyRoadShields(map);
}
