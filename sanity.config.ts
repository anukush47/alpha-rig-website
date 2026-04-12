import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Alpha Rig CMS",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Alpha Rig Content")
          .items([
            S.listItem()
              .title("Blog Posts")
              .icon(() => "📝")
              .child(
                S.documentList()
                  .title("Blog Posts")
                  .filter('_type == "blogPost"')
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Custom Builds")
              .icon(() => "🖥️")
              .child(
                S.documentList()
                  .title("Custom Builds")
                  .filter('_type == "customBuild"')
                  .defaultOrdering([{ field: "completionDate", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Events")
              .icon(() => "🎮")
              .child(
                S.documentList()
                  .title("Events")
                  .filter('_type == "event"')
                  .defaultOrdering([{ field: "eventDate", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Store Products")
              .icon(() => "🛒")
              .child(
                S.documentList()
                  .title("Products")
                  .filter('_type == "product"')
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: {
    types: schemaTypes,
  },
});
