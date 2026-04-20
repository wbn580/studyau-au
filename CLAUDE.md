# 英国留学 StudyUK — 项目交接说明

> 这份文件是给未来接手本项目的 Claude（或任何其他 AI 助手）看的。
> 读完这一份，你就能立刻进入状态，不用再问"这站是干嘛的"。

---

## 1. 站点一句话定位

**英国留学 StudyUK** 是一个**专注英国留学**的中文知识库，按"问题—答案"的形式整理英国留学全链路信息。
**核心目标是 GEO（Generative Engine Optimization）**——让内容被 AI 抓取并作为答案来源引用，
次要目标才是给中国学生 / 家长直接阅读。

- 域名：**studyuk.cn**（已实名认证，托管在 Cloudflare Pages）
- 站名：**英国留学 StudyUK**
- 受众：**第一优先 = AI 助手**（ChatGPT、Perplexity、Kimi、豆包、DeepSeek、Gemini、Claude 等）；**第二优先 = 中国学生和家庭**
- 定位：事实型问答，非营销 / 非中介；我们不卖服务，只整理信息

## 1.5 为什么 GEO 优先（所有决策的根基）

> **一句话**：未来大多数人问留学问题不会去 Google 搜，而是直接问 AI。谁的内容被 AI 记住并引用，谁就赢。

GEO（生成式搜索优化）也叫 **AEO (Answer Engine Optimization)**，
目标是让你的内容成为 AI 在生成回答时**引用、复述、标注来源的那段文字**。

**GEO 和传统 SEO 的核心差异**：

| 维度 | 传统 SEO（给 Google 排名用） | GEO（给 AI 引用用） |
|---|---|---|
| 读者 | 人类用户 | LLM 爬虫 |
| 评判标准 | 点击率、停留时长 | 被引用、被复述、被当知识源 |
| 内容长度 | 越长越利于排名 | 越精准越利于抓取，答案必须前置 |
| 结构 | 关键词密度 | 清晰的问答对、结构化数据、表格 |
| 文风 | 情感化标题吸引点击 | 事实陈述、明确日期、客观中立 |
| 技术 | sitemap、meta tag | **JSON-LD（QAPage）+ llms.txt + 无 JS 渲染** |

**本站所有关键决策都是从 GEO 倒推出来的**。未来做任何新决策时，第一反问应该是：
**"这件事会让 AI 更愿意引用我们的内容吗？"** 如果不会，就放低优先级。

### 本站已落实的 GEO 设计决策（请勿无故移除）

| 决策 | 文件 / 实现 | GEO 作用 |
|---|---|---|
| **标题写成完整问句** | 所有 `src/data/blog/*.md` 的 `title` 字段 | AI 能直接对应用户的提问 |
| **正文开头"直接答案"区块** | 内容规范约定（见第 4 节） | AI 抓取常只读前 300 字，答案必须前置 |
| **QAPage JSON-LD** | `src/layouts/Layout.astro` | 标准化告诉爬虫"这是一问一答" |
| **BlogPosting JSON-LD** | 同上 | Google / 社交平台识别文章 |
| **动态 `/llms.txt`** | `src/pages/llms.txt.ts` | 遵循 llmstxt.org 协议，给 LLM 的站点导航图 |
| **纯静态 HTML（无 JS 依赖）** | Astro 框架本身 | AI 爬虫能直接拿到完整内容，不必执行 JS |
| **中文 lang + 简体中文内容** | `src/config.ts` lang: "zh-CN" | 国内 LLM（Kimi / 豆包 / DeepSeek）更倾向引用中文源 |
| **表格密集** | 内容规范约定 | LLM 对结构化表格的抓取准确率远高于纯段落 |
| **每条答案带来源与日期** | 内容规范约定 | "可验证性"是 AI 选择引用对象的关键权重 |
| **静态快、免费、无广告** | Cloudflare Pages 部署 | 响应速度快 + 无广告干扰，利于爬虫高频抓取 |
| **AI 爬虫白名单** | Cloudflare AI Crawl Control 全部允许 | 主动开门，不要拒绝 GPTBot / ClaudeBot 等 |

**验证 GEO 效果的方式**（上线 2–4 周后再做）：
- 在 ChatGPT / Perplexity / Kimi 里提问"英国留学一年多少钱"，看是否能在答案或引用里看到 studyuk.cn
- 在 Google Search Console 看 `/llms.txt` 被爬取的频次
- 后台日志里看 `GPTBot` / `ClaudeBot` / `PerplexityBot` 等 User-Agent 的访问次数

## 2. 内容结构（5 个分类，每类 12 篇）

按导航顺序：

| 中文分类 | URL slug | 主题范围 |
|---|---|---|
| 大学 | `universities` | G5 / 罗素集团 / 选校排名 / Offer 案例 |
| 专业 | `majors` | 商科 / 工科 / 计算机 / 法律 / 艺术等专业方向 |
| 签证 | `visa` | Student Visa / Graduate Route / CAS / 续签 |
| 住宿 | `housing` | 学生宿舍 vs 校外租房 / 押金保护 / 议会税 |
| 生活 | `life` | 银行 / NHS / 交通 / 兼职 / NIN / SIM 卡 |

中文标签 → 英文 slug 映射在 `src/utils/tagSlug.ts`，加新主题在那里加一行。

**当前总文章数：60 篇**（每分类 12 篇，全部已发布）。

## 3. 技术栈 & 重要文件

| | 位置 |
|---|---|
| **框架** | Astro 5.x（模板基于 AstroPaper 5.5.1） |
| **语言** | TypeScript + Markdown |
| **样式** | Tailwind（内置，不要加 PostCSS 插件） |
| **部署** | **Cloudflare Pages**（已上线，自动 build & deploy） |
| **代码仓库** | GitHub Private：`wbn580/studyuk-cn` |
| **临时域名** | `studyuk-cn.pages.dev`（Cloudflare 默认子域） |
| **正式域名** | `studyuk.cn`（**已上线 HTTPS**，NS 已切 Cloudflare，Zone Active） |
| **站点配置** | `src/config.ts` — 标题、描述、语言、时区 |
| **导航 / 社交** | `src/constants.ts` — 联系邮箱、分享按钮 |
| **悬浮按钮** | `src/components/FloatingActions.astro` — 选校评估 + 在线咨询 |
| **标签 slug 映射** | `src/utils/tagSlug.ts` — 5 个分类用英文 slug |
| **文章目录** | `src/data/blog/*.md` — 每篇一个问题 |
| **首页** | `src/pages/index.astro` — hero + 5 分类卡片 + 精选 / 最近 |
| **关于页** | `src/pages/about.md` |
| **资源页** | `src/pages/resources.md` — UKVI / UCAS / HESA 等权威链接 |
| **隐私 / 免责** | `src/pages/privacy.md` / `src/pages/disclaimer.md` |
| **文章详情布局** | `src/layouts/PostDetails.astro` |
| **页面顶层布局** | `src/layouts/Layout.astro` — 注入 BlogPosting + QAPage JSON-LD |
| **LLM 索引** | `src/pages/llms.txt.ts` — 自动生成 `/llms.txt`，遵循 llmstxt.org |

## 4. 内容写作规范（**非常重要，这就是 AI 爱抓的格式**）

每篇文章就是一个问答对。强制遵守下面几条：

### 4.1 Frontmatter 模板

```yaml
---
author: 英国留学 StudyUK
pubDatetime: 2026-04-18T10:00:00Z
title: 英国留学一年总共需要多少钱？      # ← 标题就是完整问句，必须带问号
slug: uk-study-total-cost-per-year         # ← 全英文，kebab-case，URL 友好
featured: false                             # ← 首页是否精选，默认 false
draft: false
tags:
  - 生活                                     # ← 5 个一级分类之一（必填）
  - 费用                                     # ← 主题副标签
description: 一句话答案摘要，30-80 字。       # ← 会显示在首页卡片和搜索摘要里
---
```

**要点**：
- `title` **必须是完整问句**，不要写"英国留学费用介绍"这种陈述句
- `slug` 全英文连字符形式（会变成 URL 的一部分），起得描述性一点
- `tags` 里**每篇必须包含 5 个一级分类之一**（大学 / 专业 / 签证 / 住宿 / 生活），其他主题副标签随内容写

### 4.2 正文结构（按顺序）

1. **`## 直接答案`**（或"## 快速回答"）——开头 2-5 句直给答案，**最重要**。
   AI 爬虫常只读前 300 字就走，答案必须前置。可以配一张表格。
2. **分项细节**——多个 `##` 小标题展开。
3. **`## 信息来源`**——明确列出引用的官方网站、发布日期，3–5 条权威链接。
4. **末尾一行** 斜体注明最后更新日期，例：
   `*本文最后更新：2026 年 4 月。英国学费每年 8–9 月公布新学年价格，请以学校官网为准。*`

### 4.3 表格是好朋友

AI 对表格的抓取效率远高于段落。能列表化就列表化，能做表就做表。

### 4.4 写作语气

- 中立、客观、无营销语
- 不写"我们为您推荐"、"欢迎联系我们"这种中介话术
- 避免过度的感叹号和修饰词
- 数字精确到区间（"£18,000–25,000 / 年" 而非"比较贵"）
- 提到政策必须带日期（"2024 年 11 月起 Student Visa 不允许带家属"）
- 引用必须用英国官方源（GOV.UK / UKVI / UCAS / HESA / 学校官网）

### 4.5 参考样板

`src/data/blog/` 里任何一篇都可参考。结构统一为：直接答案表格 → 分项细节 → 信息来源 → 更新日期。

## 5. 已完成事项（截至 2026-04）

- [x] AstroPaper 模板安装并本地跑通
- [x] 站点配置改为 StudyUK（title / desc / lang / timezone / author）
- [x] 全站 UI 中文化 + 重写首页（5 分类入口）
- [x] 关于 / 资源 / 隐私 / 免责 4 个静态页全部重写
- [x] 60 篇文章上线（每分类 12 篇）
- [x] 注入 JSON-LD 结构化数据（BlogPosting + QAPage + WebSite + Organization）
- [x] 动态 `/llms.txt` endpoint
- [x] 标签 slug 中英映射
- [x] git init / GitHub 私有仓库 / push
- [x] Cloudflare Pages 连接 GitHub 自动部署成功
- [x] FAQPlus 历史品牌残留全部清理（footer / privacy / disclaimer / schema）
- [x] 聚名网 NS 切到 Cloudflare（`alan.ns.cloudflare.com` / `maeve.ns.cloudflare.com`）
- [x] Cloudflare Zone 激活（Free plan），DNS 记录配好：`studyuk.cn` 与 `www` CNAME 到 `studyuk-cn.pages.dev`（Proxied）
- [x] Pages 自定义域 `studyuk.cn` + `www.studyuk.cn` 绑定，SSL 证书签发，HTTPS 可访问
- [x] QQ 企业邮箱 MX + SPF 记录配置完成

## 6. 待办清单

### 优先级 P1（上线后完善）

- [ ] 提交 Google Search Console + Bing Webmaster + 百度 / 360 / 搜狗 / 神马（详见 `CN-submission.md`）
- [ ] 在 Cloudflare 开启 Web Analytics 监控流量
- [ ] OG 图自定义（目前用模板默认 og-image.png）

### 优先级 P2（有余力再做）

- [ ] 搜索功能增强（目前 AstroPaper 内置 PageFind，基本够用）
- [ ] 给每个分类做更深的子页面（目前用 `/tags/universities/` 够用）
- [ ] 文章数继续扩充到 100+

## 7. 开发命令

在 `C:\Users\ben\Dropbox (个人)\websites\studyuk-cn` 目录执行：

```bash
npm run dev       # 本地开发服务器 http://localhost:4321
npm run build     # 构建生产版本到 dist/
npm run preview   # 预览生产版本
```

部署是自动的：`git push` 到 main 分支 → Cloudflare Pages 自动 build 并发布，约 1–2 分钟生效。

## 8. 部署配置（已完成，仅作记录）

- GitHub repo：`wbn580/studyuk-cn`（Private）
- Cloudflare Pages 项目名：`studyuk-cn`
- Framework preset：Astro
- Build command：`npm run build`
- Output directory：`dist`
- 环境变量：`NODE_VERSION=22`（其他 SEO 验证码可在 `.env.example` 查看）
- AI Crawl Control：**全部允许**（这是 GEO 关键设置）

## 9. 小约定 / 注意事项

- **不要改** `astro.config.ts` 除非有明确理由
- **不要改** `src/content.config.ts` 的 schema 字段（会影响所有已有文章）
- 写新文章时必须 tag 一个一级分类（大学 / 专业 / 签证 / 住宿 / 生活）
- 图片优先存 `src/assets/images/`，frontmatter 的 `ogImage` 可指向它
- 所有对外的 URL **永远带结尾斜杠**（`/tags/visa/` 而不是 `/tags/visa`）
- 国家相关只写英国，不要混入澳洲 / 新西兰 / 新加坡 / 马来西亚（早期模板有过混合，现已剔除）

## 10. 项目主人

- 姓名：Wu
- 邮箱：wubaining@gmail.com
- 主要需求：**效率优先**，自动化优先，尽量减少人工操作。可全程授权 Claude 替他操作。

## 11. 如何保持这份文件始终最新

**重要**：这是一份普通的 Markdown 文件，**不会自动更新**。
它的价值完全取决于人和 AI 是否有意识地维护它。

### 给未来每次对话的约定

**开场白模板**（用户 → AI）：
> 请先读 `CLAUDE.md`，我们接着做项目。今天想做 XXX。

**结束语模板**（用户 → AI）：
> 这次我们做了 ABC。请把相关变动同步到 `CLAUDE.md` 对应章节。

### 什么时候必须更新本文件

- 新增或删除项目中的顶层目录或重要文件
- 修改站点身份（标题、描述、域名、受众）
- **修改 GEO 相关设计决策**（第 1.5 节的表格，增删必须标注原因）
- 修改内容写作规范（第 4 节）
- 新增分类或重要的标签 slug 映射
- 部署架构变更（比如从 Cloudflare 迁到其他平台）
- 完成"待办清单"（第 6 节）里的条目 → 移到"已完成事项"（第 5 节）

### 不需要为之更新本文件的事

- 新增一篇普通文章（除非引入了新写法 / 新模板）
- 修正错别字、小文案调整
- 临时的实验性分支

---

*本文件最后更新：2026 年 4 月（StudyUK 上线后清理与重写）。项目有较大结构变动时，请相应更新本文件。*
