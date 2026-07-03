import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

// Dev Notes palette (sRGB equivalents of src/styles/tokens.css)
const BG = "#f5f1e9"; // cream
const INK = "#2a241e"; // foreground
const MUTED = "#7b726a";
const ACCENT = "#c8612a"; // terracotta
const BORDER = "#ddd5c7";

export default async post => {
  const date = new Date(
    post.data.modDatetime ?? post.data.pubDatetime
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return satori(
    {
      type: "div",
      props: {
        style: {
          background: BG,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Newsreader",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "baseline",
                gap: "14px",
                fontFamily: "IBM Plex Mono",
                fontSize: 26,
              },
              children: [
                {
                  type: "span",
                  props: { style: { color: ACCENT }, children: "~/" },
                },
                {
                  type: "span",
                  props: { style: { color: MUTED }, children: "Dev Notes" },
                },
              ],
            },
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: 68,
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: INK,
                maxHeight: "70%",
                overflow: "hidden",
                margin: 0,
              },
              children: post.data.title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                borderTop: `1px solid ${BORDER}`,
                paddingTop: "28px",
                fontFamily: "IBM Plex Mono",
                fontSize: 24,
                color: MUTED,
              },
              children: [
                {
                  type: "span",
                  props: { children: `${post.data.author} · ${date}` },
                },
                {
                  type: "span",
                  props: {
                    style: { color: ACCENT },
                    children: new URL(SITE.website).hostname,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(
        post.data.title +
          post.data.author +
          date +
          SITE.title +
          new URL(SITE.website).hostname +
          "~/ Dev Notes ·"
      ),
    }
  );
};
