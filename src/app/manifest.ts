import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.definition,
    start_url: "/",
    display: "browser",
    background_color: "#09090b",
    theme_color: "#161619",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
