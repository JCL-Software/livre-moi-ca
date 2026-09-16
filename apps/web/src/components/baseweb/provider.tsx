"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { Client, Server } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { uberTheme } from "./uber-theme";

type Engine = Client | Server;

function createEngine(): Engine {
  if (typeof window === "undefined") {
    return new Server();
  }
  return new Client({
    hydrate: document.getElementsByClassName(
      "_styletron_hydrate_",
    ) as HTMLCollectionOf<HTMLStyleElement>,
  });
}

export function BaseWebProvider({ children }: { children: React.ReactNode }) {
  const [engine] = useState(createEngine);

  useServerInsertedHTML(() => {
    if (!("getStylesheets" in engine)) return null;
    const stylesheets = engine.getStylesheets();
    return (
      <>
        {stylesheets.map((sheet, index) => (
          <style
            key={index}
            className="_styletron_hydrate_"
            dangerouslySetInnerHTML={{ __html: sheet.css }}
            media={sheet.attrs.media}
            data-hydrate={sheet.attrs["data-hydrate"]}
          />
        ))}
      </>
    );
  });

  return (
    <StyletronProvider value={engine}>
      <BaseProvider
        theme={uberTheme}
        zIndex={100}
        overrides={{
          AppContainer: {
            style: {
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              flex: 1,
            },
          },
        }}
      >
        {children}
      </BaseProvider>
    </StyletronProvider>
  );
}
