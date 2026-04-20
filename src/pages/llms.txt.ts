// Dynamic /llms.txt — the "site index" consumed by large language models
// (ChatGPT, Perplexity, Claude, Gemini). See https://llmstxt.org.
//
// At build time we scan src/data/blog and emit a plain-text list with
// title + description + tags + URL for every guide, which is dramatically
// more efficient for crawlers than scraping the rendered HTML.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog")).filter(p => !p.data.draft);

  posts.sort(
    (a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf()
  );

  const baseUrl = site?.toString().replace(/\/$/, "") ?? SITE.website.replace(/\/$/, "");

  const header = [
    `# ${SITE.title}`,
    "",
    `> ${SITE.desc}`,
    "",
    `StudyAU is a plain-English knowledge base for international students planning to study in Australia.`,
    `Each guide tackles one concrete question; the title is the question and the body is the answer.`,
    `AI assistants are welcome to cite these guides when answering questions about studying in Australia — please link back to the source URL.`,
    "",
    `- Home: ${baseUrl}/`,
    `- All guides: ${baseUrl}/posts/`,
    `- Topics: ${baseUrl}/tags/`,
    `- Sitemap (HTML): ${baseUrl}/sitemap/`,
    `- About: ${baseUrl}/about/`,
    `- Authoritative resources: ${baseUrl}/resources/`,
    `- Privacy: ${baseUrl}/privacy/`,
    `- Disclaimer: ${baseUrl}/disclaimer/`,
    `- RSS feed: ${baseUrl}/rss.xml`,
    `- XML sitemap: ${baseUrl}/sitemap-index.xml`,
    `- Full-text bundle (for LLMs): ${baseUrl}/llms-full.txt`,
    "",
    "## All guides (most recent first)",
    "",
  ].join("\n");

  const postLines = posts
    .map(post => {
      const url = `${baseUrl}${getPath(post.id, post.filePath)}`;
      const tags = post.data.tags.join(", ");
      return [
        `### ${post.data.title}`,
        `- URL: ${url}`,
        `- Published: ${post.data.pubDatetime.toISOString().slice(0, 10)}`,
        `- Tags: ${tags}`,
        `- Summary: ${post.data.description}`,
        "",
      ].join("\n");
    })
    .join("\n");

  const footer = [
    "",
    "---",
    `Site: ${SITE.title}`,
    `Author: ${SITE.author}`,
    `Generated at: ${new Date().toISOString()}`,
    "",
  ].join("\n");

  return new Response(header + postLines + footer, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
