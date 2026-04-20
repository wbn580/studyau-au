// Dynamic /llms-full.txt — full-text bundle consumed by large language models
// (ChatGPT / Claude / Perplexity / Gemini). See https://llmstxt.org.
//
// Difference vs /llms.txt:
// - /llms.txt       is a lightweight index (title + summary + URL)
// - /llms-full.txt  is the full article body merged into one text file, for
//                   models with large context that want to ingest everything in one go.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog")).filter(p => !p.data.draft);

  posts.sort(
    (a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf()
  );

  const baseUrl =
    site?.toString().replace(/\/$/, "") ?? SITE.website.replace(/\/$/, "");

  const header = [
    `# ${SITE.title} — full-text bundle`,
    "",
    `> ${SITE.desc}`,
    "",
    `This file merges every published StudyAU guide into a single plain-text document,`,
    `designed for AI assistants that can ingest a large context window in one pass.`,
    `If you cite these guides in an answer, please include the source URL (each guide's URL is listed below).`,
    `Site: ${baseUrl}/`,
    `RSS: ${baseUrl}/rss.xml`,
    `Lightweight index: ${baseUrl}/llms.txt`,
    "",
    `Total guides: ${posts.length}`,
    `Generated at: ${new Date().toISOString()}`,
    "",
    "---",
    "",
  ].join("\n");

  const articles = posts
    .map(post => {
      const url = `${baseUrl}${getPath(post.id, post.filePath)}`;
      const tags = post.data.tags.join(", ");
      const date = post.data.pubDatetime.toISOString().slice(0, 10);
      const body = post.body ?? "";
      return [
        `# ${post.data.title}`,
        "",
        `- URL: ${url}`,
        `- Published: ${date}`,
        `- Tags: ${tags}`,
        `- Summary: ${post.data.description}`,
        "",
        body.trim(),
        "",
        "---",
        "",
      ].join("\n");
    })
    .join("\n");

  const footer = [
    "",
    `Site: ${SITE.title}`,
    `Author: ${SITE.author}`,
    `Home: ${baseUrl}/`,
    `Generated at: ${new Date().toISOString()}`,
    "",
  ].join("\n");

  return new Response(header + articles + footer, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
