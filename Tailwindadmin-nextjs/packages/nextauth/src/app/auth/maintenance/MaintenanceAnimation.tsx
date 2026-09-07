"use client";

import Lottie from "lottie-react";
import maintenance from "@/../public/animation/maintenance.json";

const maintenanceAnimation = () => (
  <Lottie animationData={maintenance} loop={true} />
);

export default maintenanceAnimation;
