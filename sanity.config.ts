import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Alpha Rig CMS",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Alpha Rig CMS")
          .items([

            // ── CONTENT ────────────────────────────────────────────────────
            S.listItem()
              .title("Content")
              .icon(() => "📚")
              .child(
                S.list()
                  .title("Content")
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
                    S.listItem()
                      .title("Blog Series")
                      .icon(() => "📖")
                      .child(
                        S.documentList()
                          .title("Blog Series")
                          .filter('_type == "blogSeries"')
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
                  ])
              ),

            S.divider(),

            // ── AUDIENCE ───────────────────────────────────────────────────
            S.listItem()
              .title("Audience")
              .icon(() => "👥")
              .child(
                S.list()
                  .title("Audience")
                  .items([
                    S.listItem()
                      .title("Subscribers")
                      .icon(() => "✉️")
                      .child(
                        S.documentList()
                          .title("Subscribers")
                          .filter('_type == "subscriber"')
                          .defaultOrdering([{ field: "subscribedAt", direction: "desc" }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Event Registrations")
                      .icon(() => "🎟️")
                      .child(
                        S.documentList()
                          .title("Event Registrations")
                          .filter('_type == "eventRegistration"')
                          .defaultOrdering([{ field: "registeredAt", direction: "desc" }])
                      ),
                  ])
              ),

            S.divider(),

            // ── MONETIZATION ───────────────────────────────────────────────
            S.listItem()
              .title("Monetization")
              .icon(() => "💰")
              .child(
                S.list()
                  .title("Monetization")
                  .items([
                    S.listItem()
                      .title("Sponsors & Partners")
                      .icon(() => "🤝")
                      .child(
                        S.documentList()
                          .title("Sponsors & Partners")
                          .filter('_type == "sponsor"')
                          .defaultOrdering([{ field: "tier", direction: "asc" }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Ad Slots")
                      .icon(() => "📢")
                      .child(
                        S.documentList()
                          .title("Ad Slots")
                          .filter('_type == "adSlot"')
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Partnership Inquiries")
                      .icon(() => "📩")
                      .child(
                        S.documentList()
                          .title("Partnership Inquiries")
                          .filter('_type == "partnershipInquiry"')
                          .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
                      ),
                  ])
              ),

          ]),
    }),

    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: {
    types: schemaTypes,
  },
});
