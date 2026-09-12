"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AttributionControl,
  CircleMarker,
  Polyline,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { createLeafletContext, LeafletContext } from "@react-leaflet/core";
import { LocateFixed } from "lucide-react";
import L from "leaflet";
import type { Map as MapLibreMap } from "maplibre-gl";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";
import {
  OPENFREEMAP_ATTRIBUTION,
  OPENFREEMAP_STYLE_URL,
} from "@/lib/geo/map-tiles";
import type { GeoPoint } from "@/lib/types";

const FALLBACK_CENTER: [number, number] = [45.5017, -73.5673];
const USER_ZOOM = 13;
/** ~440 m — centre la vue sur un secteur, pas le GPS exact. */
const APPROX_GRID_DEG = 0.004;

let lastApproxCenter: [number, number] | null = null;

function recenterOnUser(map: L.Map, lat: number, lng: number) {
  const center = snapApproximate(lat, lng);
  lastApproxCenter = center;
  runOnLiveMap(map, () => {
    map.setView(center, USER_ZOOM, { animate: true });
  });
}

function snapApproximate(lat: number, lng: number): [number, number] {
  return [
    Math.round(lat / APPROX_GRID_DEG) * APPROX_GRID_DEG,
    Math.round(lng / APPROX_GRID_DEG) * APPROX_GRID_DEG,
  ];
}

function isLeafletMapAlive(map: L.Map) {
  try {
    const container = map.getContainer();
    return Boolean(container?.isConnected && map.getPane("mapPane"));
  } catch {
    return false;
  }
}

function runOnLiveMap(map: L.Map, action: () => void) {
  if (!isLeafletMapAlive(map)) return;
  try {
    action();
  } catch {
    // instance déjà détruite (Strict Mode, HMR, resize tardif)
  }
}

function setPaint(
  map: MapLibreMap,
  layerId: string,
  property: string,
  value: unknown,
) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setPaintProperty(layerId, property, value);
  } catch {
    // couche absente ou type incompatible
  }
}

function setLayout(
  map: MapLibreMap,
  layerId: string,
  property: string,
  value: unknown,
) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setLayoutProperty(layerId, property, value);
  } catch {
    // couche absente ou type incompatible
  }
}

/** Couleurs échantillonnées sur la capture Uber / Google Maps (Montréal). */
const UBER = {
  land: "#EDF0F6",
  park: "#B7E3BE",
  water: "#B2D9FF",
  road: "#EDF0F6",
  street: "#FCFCFC",
  highway: "#5474DC",
  highwayCasing: "#849CD4",
  /** Pastille des routes provinciales (111, 117, 335) — Uber. */
  routeShield: "#2CA484",
  airport: "#D5D9E2",
  label: "#5F6368",
  halo: "#EDF0F6",
};

const DEFAULT_SHIELDS = [
  "highway-shield-non-us",
  "highway-shield-us-interstate",
  "road_shield_us",
];

const CUSTOM_SHIELD_AUTOROUTE = "lm-shield-autoroute";
const CUSTOM_SHIELD_ROUTE = "lm-shield-route";
const CUSTOM_SHIELD_ROUTE_MINOR = "lm-shield-route-minor";
const SHIELD_IMAGE_AUTOROUTE = "lm-pill-autoroute";
const SHIELD_IMAGE_ROUTE = "lm-pill-route";

function createPillImage(color: string, pixelRatio = 2) {
  const cssW = 28;
  const cssH = 16;
  const canvas = document.createElement("canvas");
  canvas.width = cssW * pixelRatio;
  canvas.height = cssH * pixelRatio;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: 1, height: 1, data: new Uint8Array(4) };
  }

  ctx.scale(pixelRatio, pixelRatio);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(0, 0, cssW, cssH, cssH / 2);
  ctx.fill();

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    width: imageData.width,
    height: imageData.height,
    data: new Uint8Array(imageData.data),
  };
}

function ensureShieldImages(map: MapLibreMap) {
  const pills = [
    { id: SHIELD_IMAGE_AUTOROUTE, color: UBER.highway },
    { id: SHIELD_IMAGE_ROUTE, color: UBER.routeShield },
  ];

  for (const pill of pills) {
    if (map.hasImage(pill.id)) continue;
    const image = createPillImage(pill.color);
    map.addImage(pill.id, image, {
      pixelRatio: 2,
      stretchX: [[12, 44]],
      stretchY: [[8, 24]],
      content: [8, 4, 48, 28],
    });
  }
}

function setZoomRange(
  map: MapLibreMap,
  layerId: string,
  minzoom: number,
  maxzoom = 24,
) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setLayerZoomRange(layerId, minzoom, maxzoom);
  } catch {
    // couche absente ou type incompatible
  }
}

const SHIELD_LAYOUT = {
  "icon-allow-overlap": false,
  "text-allow-overlap": false,
  "icon-ignore-placement": false,
  "symbol-avoid-edges": true,
  "symbol-placement": "point",
  "icon-padding": 18,
  "text-padding": 12,
} as const;

function applyShieldDensity(map: MapLibreMap, id: string) {
  for (const [property, value] of Object.entries(SHIELD_LAYOUT)) {
    setLayout(map, id, property, value);
  }
}

function addCustomShieldLayer(
  map: MapLibreMap,
  id: string,
  icon: string,
  classes: string[],
  minzoom: number,
  sortKey: number,
) {
  if (map.getLayer(id)) {
    applyShieldDensity(map, id);
    return;
  }
  if (!map.getSource("openmaptiles")) return;

  try {
    map.addLayer({
      id,
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom,
      filter: [
        "all",
        ["has", "ref"],
        ["<=", ["get", "ref_length"], 6],
        [
          "match",
          ["geometry-type"],
          ["LineString", "MultiLineString"],
          true,
          false,
        ],
        ["match", ["get", "class"], classes, true, false],
      ],
      layout: {
        "icon-image": icon,
        "icon-text-fit": "both",
        "icon-text-fit-padding": [3, 5, 2, 5],
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "symbol-sort-key": sortKey,
        "text-field": ["to-string", ["get", "ref"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
        "text-letter-spacing": 0.02,
        ...SHIELD_LAYOUT,
      },
      paint: {
        "text-color": "#FFFFFF",
      },
    });
  } catch {
    // source ou glyphes pas encore prêts
  }
}

const HIDDEN_LAYERS = [
  "natural_earth",
  "building",
  "building-3d",
  "aeroway_runway",
  "aeroway_taxiway",
  "road_area_pattern",
  "road_path_pedestrian",
  "road_major_rail",
  "road_major_rail_hatching",
  "road_transit_rail",
  "road_transit_rail_hatching",
  "road_one_way_arrow",
  "road_one_way_arrow_opposite",
  "tunnel_path_pedestrian",
  "tunnel_major_rail",
  "tunnel_major_rail_hatching",
  "tunnel_transit_rail",
  "tunnel_transit_rail_hatching",
  "bridge_path_pedestrian",
  "bridge_path_pedestrian_casing",
  "bridge_major_rail",
  "bridge_major_rail_hatching",
  "bridge_transit_rail",
  "bridge_transit_rail_hatching",
  "boundary_3",
  "boundary_disputed",
  "park_outline",
  "waterway_line_label",
  "water_name_point_label",
  "water_name_line_label",
  "poi_r20",
  "poi_r7",
  "poi_r1",
  "poi_transit",
  "highway-name-path",
  "highway-name-minor",
  "highway-name-major",
  "label_other",
];

const LOCAL_ROADS = [
  "road_minor",
  "road_service_track",
  "road_link",
  "bridge_street",
  "bridge_service_track",
  "bridge_link",
  "tunnel_minor",
  "tunnel_service_track",
  "tunnel_link",
];

const SECONDARY_ROADS = [
  "road_secondary_tertiary",
  "bridge_secondary_tertiary",
  "tunnel_secondary_tertiary",
];

const ARTERIALS = [
  "road_trunk_primary",
  "bridge_trunk_primary",
  "tunnel_trunk_primary",
];

const MOTORWAYS = [
  "road_motorway",
  "road_motorway_link",
  "bridge_motorway",
  "bridge_motorway_link",
  "tunnel_motorway",
  "tunnel_motorway_link",
];

const LOCAL_CASINGS = [
  "road_minor_casing",
  "road_service_track_casing",
  "road_link_casing",
  "bridge_street_casing",
  "bridge_service_track_casing",
  "bridge_link_casing",
  "tunnel_street_casing",
  "tunnel_service_track_casing",
  "tunnel_link_casing",
];

const ARTERIAL_CASINGS = [
  "road_secondary_tertiary_casing",
  "road_trunk_primary_casing",
  "bridge_secondary_tertiary_casing",
  "bridge_trunk_primary_casing",
  "tunnel_secondary_tertiary_casing",
  "tunnel_trunk_primary_casing",
];

const MOTORWAY_CASINGS = [
  "road_motorway_casing",
  "road_motorway_link_casing",
  "bridge_motorway_casing",
  "bridge_motorway_link_casing",
  "tunnel_motorway_casing",
  "tunnel_motorway_link_casing",
];

const MOTORWAY_WIDTH = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  5,
  0.35,
  7,
  0.7,
  10,
  1.15,
  13,
  1.7,
  16,
  3,
  20,
  6.5,
] as const;

const MOTORWAY_CASING_WIDTH = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  5,
  0.7,
  7,
  1.25,
  10,
  1.9,
  13,
  2.6,
  16,
  4.2,
  20,
  8.5,
] as const;

const MOTORWAY_LINK_WIDTH = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  12.5,
  0,
  13,
  0.9,
  14,
  1.4,
  20,
  5.5,
] as const;

const MOTORWAY_LINK_CASING_WIDTH = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  12,
  0.6,
  13,
  1.6,
  14,
  2.2,
  20,
  7,
] as const;

const PLACE_LABELS = [
  "label_village",
  "label_town",
  "label_state",
  "label_city",
  "label_city_capital",
  "label_country_3",
  "label_country_2",
  "label_country_1",
];

function applyUberStyle(map: MapLibreMap) {
  for (const layerId of HIDDEN_LAYERS) {
    setLayout(map, layerId, "visibility", "none");
  }

  setPaint(map, "background", "background-color", UBER.land);
  setPaint(map, "landuse_residential", "fill-color", UBER.land);
  setPaint(map, "landuse_hospital", "fill-color", UBER.land);
  setPaint(map, "landuse_school", "fill-color", UBER.land);
  setPaint(map, "landuse_cemetery", "fill-color", UBER.park);
  setPaint(map, "landuse_pitch", "fill-color", UBER.park);
  setPaint(map, "landuse_track", "fill-color", UBER.park);
  setPaint(map, "park", "fill-color", UBER.park);
  setPaint(map, "landcover_grass", "fill-color", UBER.park);
  setPaint(map, "landcover_wood", "fill-color", UBER.park);
  setPaint(map, "landcover_wetland", "fill-color", UBER.park);
  setPaint(map, "landcover_sand", "fill-color", UBER.land);
  setPaint(map, "aeroway_fill", "fill-color", UBER.airport);
  setPaint(map, "water", "fill-color", UBER.water);
  setPaint(map, "waterway_river", "line-color", UBER.water);
  setPaint(map, "waterway_other", "line-color", UBER.water);
  setPaint(map, "waterway_tunnel", "line-color", UBER.water);

  for (const layerId of LOCAL_ROADS) {
    setPaint(map, layerId, "line-color", UBER.street);
  }
  for (const layerId of LOCAL_CASINGS) {
    setPaint(map, layerId, "line-color", UBER.land);
  }
  for (const layerId of SECONDARY_ROADS) {
    setPaint(map, layerId, "line-color", UBER.street);
  }
  for (const layerId of ARTERIALS) {
    setPaint(map, layerId, "line-color", UBER.street);
  }
  for (const layerId of MOTORWAYS) {
    setPaint(map, layerId, "line-color", UBER.highway);
    setPaint(
      map,
      layerId,
      "line-width",
      layerId.includes("_link") ? MOTORWAY_LINK_WIDTH : MOTORWAY_WIDTH,
    );
  }
  for (const layerId of ARTERIAL_CASINGS) {
    setPaint(map, layerId, "line-color", UBER.land);
  }
  for (const layerId of MOTORWAY_CASINGS) {
    setPaint(map, layerId, "line-color", UBER.highwayCasing);
    setPaint(
      map,
      layerId,
      "line-width",
      layerId.includes("_link")
        ? MOTORWAY_LINK_CASING_WIDTH
        : MOTORWAY_CASING_WIDTH,
    );
  }

  for (const layerId of PLACE_LABELS) {
    setPaint(map, layerId, "text-color", UBER.label);
    setPaint(map, layerId, "text-halo-color", UBER.halo);
    setPaint(map, layerId, "text-halo-width", 1.2);
    setLayout(map, layerId, "text-padding", [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      12,
      10,
      6,
      14,
      2,
    ]);
    setLayout(map, layerId, "text-allow-overlap", false);
  }

  setZoomRange(map, "label_village", 12);
  setZoomRange(map, "label_town", 9);
  setZoomRange(map, "label_city", 5);
  setZoomRange(map, "label_city_capital", 4);

  for (const layerId of [...LOCAL_ROADS, ...LOCAL_CASINGS]) {
    setZoomRange(map, layerId, 13);
  }
  for (const layerId of [
    ...SECONDARY_ROADS,
    "road_secondary_tertiary_casing",
    "bridge_secondary_tertiary_casing",
    "tunnel_secondary_tertiary_casing",
  ]) {
    setZoomRange(map, layerId, 11);
  }
  for (const layerId of [
    ...ARTERIALS,
    "road_trunk_primary_casing",
    "bridge_trunk_primary_casing",
    "tunnel_trunk_primary_casing",
  ]) {
    setZoomRange(map, layerId, 8);
  }

  for (const layerId of DEFAULT_SHIELDS) {
    setLayout(map, layerId, "visibility", "none");
  }

  ensureShieldImages(map);
  addCustomShieldLayer(
    map,
    CUSTOM_SHIELD_AUTOROUTE,
    SHIELD_IMAGE_AUTOROUTE,
    ["motorway"],
    8,
    30,
  );
  addCustomShieldLayer(
    map,
    CUSTOM_SHIELD_ROUTE,
    SHIELD_IMAGE_ROUTE,
    ["trunk", "primary"],
    10,
    20,
  );
  addCustomShieldLayer(
    map,
    CUSTOM_SHIELD_ROUTE_MINOR,
    SHIELD_IMAGE_ROUTE,
    ["secondary"],
    12,
    10,
  );
}

function MapLibreBasemap() {
  const map = useMap();

  useEffect(() => {
    let cancelled = false;
    let layer: ReturnType<typeof L.maplibreGL> | null = null;
    let glMap: MapLibreMap | null = null;

    const onStyleReady = () => {
      if (cancelled || !glMap) return;
      applyUberStyle(glMap);
    };

    const attach = () => {
      if (cancelled || !isLeafletMapAlive(map)) return;

      layer = L.maplibreGL({
        style: OPENFREEMAP_STYLE_URL,
        attributionControl: false,
        interactive: false,
      });

      try {
        layer.addTo(map);
        glMap = layer.getMaplibreMap();
      } catch {
        return;
      }

      if (!glMap) return;
      if (glMap.loaded()) {
        onStyleReady();
      } else {
        glMap.once("load", onStyleReady);
      }
    };

    map.whenReady(attach);

    return () => {
      cancelled = true;
      if (glMap) {
        try {
          glMap.off("load", onStyleReady);
        } catch {
          // déjà retiré
        }
      }
      if (layer) {
        runOnLiveMap(map, () => {
          if (layer && map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });
      }
    };
  }, [map]);

  return null;
}

type Props = {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  activeRoute?: [number, number][];
  alternateRoute?: [number, number][];
};

function InvalidateSize() {
  const map = useMap();

  useEffect(() => {
    let active = true;
    const container = map.getContainer();
    const invalidate = () => {
      if (!active) return;
      runOnLiveMap(map, () => {
        map.invalidateSize({ animate: false });
      });
    };
    const observer = new ResizeObserver(invalidate);
    observer.observe(container);
    invalidate();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function LocateMeControl() {
  const map = useMap();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [corner, setCorner] = useState<Element | null>(null);

  useEffect(() => {
    setCorner(
      map.getContainer().querySelector(".leaflet-bottom.leaflet-right"),
    );
  }, [map]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    L.DomEvent.disableClickPropagation(wrap);
    L.DomEvent.disableScrollPropagation(wrap);
  }, [corner]);

  if (!corner) return null;

  return createPortal(
    <div ref={wrapRef} className="leaflet-control estimate-map-locate">
      <button
        type="button"
        name="maps-sdk-map-controls-locate-me"
        aria-label="Afficher votre emplacement"
        aria-busy={busy}
        disabled={busy}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (busy) return;

          const cached = lastApproxCenter;
          if (cached) {
            runOnLiveMap(map, () => {
              map.setView(cached, USER_ZOOM, { animate: true });
            });
          }

          if (!navigator.geolocation) return;

          setBusy(true);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setBusy(false);
              recenterOnUser(
                map,
                position.coords.latitude,
                position.coords.longitude,
              );
            },
            () => {
              setBusy(false);
              if (cached) {
                runOnLiveMap(map, () => {
                  map.setView(cached, USER_ZOOM, { animate: true });
                });
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 12000,
              maximumAge: 30000,
            },
          );
        }}
      >
        <LocateFixed className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </button>
    </div>,
    corner,
  );
}

function UserLocationView({ follow }: { follow: boolean }) {
  const map = useMap();
  const didCenter = useRef(false);

  useEffect(() => {
    didCenter.current = false;
  }, [follow]);

  useEffect(() => {
    if (!follow || !navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        if (didCenter.current) return;
        didCenter.current = true;
        recenterOnUser(
          map,
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => undefined,
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 120000,
      },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [follow, map]);

  return null;
}

function FitView({
  origin,
  destination,
  activeRoute,
  alternateRoute,
}: {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  activeRoute?: [number, number][];
  alternateRoute?: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    let bounds: L.LatLngBounds | null = null;

    function extend(route?: [number, number][]) {
      if (!route || route.length < 2) return;
      const next = L.latLngBounds(route);
      bounds = bounds ? bounds.extend(next) : next;
    }

    extend(activeRoute);
    extend(alternateRoute);

    if (bounds) {
      runOnLiveMap(map, () => {
        map.fitBounds(bounds, { padding: [48, 48] });
      });
      return;
    }
    if (origin && destination) {
      runOnLiveMap(map, () => {
        map.fitBounds(
          L.latLngBounds([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng],
          ]),
          { padding: [48, 48] },
        );
      });
      return;
    }
    if (origin) {
      runOnLiveMap(map, () => {
        map.flyTo([origin.lat, origin.lng], 12, { duration: 0.4 });
      });
      return;
    }
    if (destination) {
      runOnLiveMap(map, () => {
        map.flyTo([destination.lat, destination.lng], 12, { duration: 0.4 });
      });
    }
  }, [map, origin, destination, activeRoute, alternateRoute]);

  return null;
}

function PlaceMarker({
  point,
  kind,
}: {
  point: GeoPoint;
  kind: "origin" | "destination";
}) {
  const isOrigin = kind === "origin";

  return (
    <CircleMarker
      center={[point.lat, point.lng]}
      radius={isOrigin ? 6 : 7}
      pathOptions={{
        color: isOrigin ? "#111111" : "#FFFFFF",
        weight: 2,
        fillColor: isOrigin ? "#FFFFFF" : "#111111",
        fillOpacity: 1,
      }}
    >
      <Popup>
        <p className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
          {isOrigin ? "Départ" : "Arrivée"}
        </p>
        <p className="mt-0.5 text-sm font-medium">{point.name}</p>
      </Popup>
    </CircleMarker>
  );
}

function releaseLeafletContainer(node: HTMLElement | null) {
  if (!node) return;
  delete (node as HTMLElement & { _leaflet_id?: number })._leaflet_id;
}

function SafeMapContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<ReturnType<
    typeof createLeafletContext
  > | null>(null);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    releaseLeafletContainer(node);

    const map = L.map(node, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });
    map.setView(FALLBACK_CENTER, 11);
    setContext(createLeafletContext(map));

    return () => {
      map.remove();
      releaseLeafletContainer(node);
      setContext(null);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {context ? (
        <LeafletContext value={context}>{children}</LeafletContext>
      ) : null}
    </div>
  );
}

export default function EstimateMap({
  origin,
  destination,
  activeRoute,
  alternateRoute,
}: Props) {
  return (
    <SafeMapContainer className="estimate-map h-full w-full">
      <MapLibreBasemap />
      <ZoomControl position="bottomright" />
      <LocateMeControl />
      <AttributionControl prefix={OPENFREEMAP_ATTRIBUTION} position="bottomleft" />
      <InvalidateSize />
      <UserLocationView
        follow={!origin && !destination && !(activeRoute && activeRoute.length > 1)}
      />
      <FitView
        origin={origin}
        destination={destination}
        activeRoute={activeRoute}
        alternateRoute={alternateRoute}
      />
      {alternateRoute && alternateRoute.length > 1 ? (
        <Polyline
          positions={alternateRoute}
          pathOptions={{ color: "#9CA3AF", weight: 4, opacity: 0.45 }}
        />
      ) : null}
      {activeRoute && activeRoute.length > 1 ? (
        <Polyline
          positions={activeRoute}
          pathOptions={{ color: "#111111", weight: 5, opacity: 0.9 }}
        />
      ) : null}
      {origin ? <PlaceMarker point={origin} kind="origin" /> : null}
      {destination ? <PlaceMarker point={destination} kind="destination" /> : null}
    </SafeMapContainer>
  );
}
