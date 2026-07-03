import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

// Dev Notes palette (sRGB equivalents of src/styles/tokens.css)
const BG = "#f5f1e9";
const INK = "#2a241e";
const MUTED = "#7b726a";
const ACCENT = "#c8612a";
const BORDER = "#ddd5c7";

export default async () => {
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
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "baseline",
                      gap: "18px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            fontFamily: "IBM Plex Mono",
                            fontSize: 44,
                            color: ACCENT,
                          },
                          children: "~/",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 84,
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                            color: INK,
                          },
                          children: SITE.title,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontFamily: "IBM Plex Mono",
                      fontSize: 26,
                      lineHeight: 1.5,
                      color: MUTED,
                      maxWidth: "80%",
                      marginTop: "28px",
                    },
                    children:
                      "dev notes on payments, infrastructure, and running software in production",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                borderTop: `1px solid ${BORDER}`,
                paddingTop: "28px",
                fontFamily: "IBM Plex Mono",
                fontSize: 24,
                color: ACCENT,
              },
              children: {
                type: "span",
                props: { children: new URL(SITE.website).hostname },
              },
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
        SITE.title +
          new URL(SITE.website).hostname +
          "dev notes on payments, infrastructure, and running software in production ~/"
      ),
    }
  );
};
