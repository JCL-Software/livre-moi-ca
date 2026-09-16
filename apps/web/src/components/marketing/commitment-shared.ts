/** Shared Base Web ProgressSteps styling for engagement pages. */
export const COMMITMENT_STEP_OVERRIDES = {
  Icon: {
    style: {
      backgroundColor: "#000000",
      color: "#FFFFFF",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderLeftWidth: "0",
      borderRightWidth: "0",
      borderTopWidth: "0",
      borderBottomWidth: "0",
    },
  },
  Tail: {
    style: {
      backgroundColor: "#000000",
    },
  },
  Title: {
    style: {
      color: "#000000",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "24px",
    },
  },
  Description: {
    style: {
      marginTop: "8px",
      paddingBottom: "28px",
      maxWidth: "40rem",
    },
  },
} as const;

export const COMMITMENT_BUTTON_FULL = {
  BaseButton: { style: { width: "100%" } },
} as const;
