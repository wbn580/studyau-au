# 建站 Playbook — 中文站 × astro-paper × Cloudflare Pages

> 这是把 **英国留学 StudyUK (studyuk.cn)** 从零做到上线的完整流程复盘，
> 下一次再建中文独立站（留学／教育／工具类内容网站），直接照着做即可。
>
> 原料清单：
> - 一个 `.cn`/`.com` 域名（聚名网或阿里云注册即可）
> - GitHub 账号
> - Cloudflare 账号（免费版足够）
> - Dropbox（或任意本地目录）
> - Node ≥ 20
>
> 整体耗时：**1 天做完模板 + 1 天写内容 + 30 分钟部署**

---

## 0. 目录结构约定

```
C:\Users\ben\Dropbox (个人)\websites\
  ├─ astro-paper-template\        ← 干净的 astro-paper 5.x 源码（只读，复制不改）
  ├─ <newsite>\                   ← 新站：直接复制 astro-paper-template 过来
  │   ├─ CLAUDE.md                ← 站点心法／风格／分类结构（交接文档）
  │   ├─ DEPLOY.md                ← 简短部署指南
  │   ├─ CN-submission.md         ← 中国搜索引擎收录 + 备案说明
  │   ├─ PLAYBOOK.md              ← 本文件（可选带过去）
  │   └─ src/...
```

---

## 1. 复制模板 → 改基础信息

```bash
# 1. 复制模板
cp -r astro-paper-template <newsite>
cd <newsite>
rm -rf .git node_modules
npm install

# 2. 修改站点信息
```

要改的文件清单（按重要性降序）：

| 文件 | 关键字段 |
|---|---|
| `src/config.ts` | `SITE.website` / `SITE.title` / `SITE.desc` / `SITE.author` |
| `src/layouts/Layout.astro` | JSON-LD 里的 `name` / `alternateName` / `knowsAbout` |
| `src/components/Header.astro` | 站点标题、导航菜单（通常 5 个分类） |
| `src/components/Footer.astro` | 底部品牌名（`© 2026 <站名>`） |
| `src/components/FloatingActions.astro` | 悬浮按钮链接（表单 URL、WhatsApp/微信号等） |
| `src/pages/about.md` | 关于页 |
| `src/pages/privacy.md` | 隐私政策 |
| `src/pages/disclaimer.md` | 免责声明 |
| `public/site.webmanifest` | PWA 名称 + 图标描述 |
| `public/robots.txt` | `Sitemap:` 行改成新域名 |
| `public/favicon.svg` | 改图标（见 §1.1） |

> **先全局搜一遍**旧品牌字符串，防止残留：
> ```bash
> grep -r "留学FAQPlus\|faq.edu.pl" src/ public/
> ```

### 1.1 favicon 快速换肤

`public/favicon.svg` 是主源，其他 PNG/ICO 用 ImageMagick 批量生成：

```bash
cd public
magick -background none -density 300 favicon.svg -resize 16x16   favicon-16x16.png
magick -background none -density 300 favicon.svg -resize 32x32   favicon-32x32.png
magick -background none -density 300 favicon.svg -resize 180x180 apple-touch-icon.png
magick -background none -density 300 favicon.svg -resize 192x192 android-chrome-192x192.png
magick -background none -density 300 favicon.svg -resize 512x512 android-chrome-512x512.png
magick favicon-16x16.png favicon-32x32.png \
       \( -background none -density 300 favicon.svg -resize 48x48 \) \
       \( -background none -density 300 favicon.svg -resize 64x64 \) \
       favicon.ico
```

favicon.svg 支持深色模式，样例：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    .bg { fill: #8b4513; }
    .fg { fill: #f5efe1; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #ff6b01; }
      .fg { fill: #212737; }
    }
  </style>
  <rect class="bg" width="64" height="64" rx="12"/>
  <!-- 主图形 -->
</svg>
```

---

## 2. 分类结构 + 内容规划

### 标准五分类（可按主题替换）

| 分类 slug | 中文名 | 内容方向示例（StudyUK） |
|---|---|---|
| 大学 | 大学 | G5 / 罗素集团 / 世界排名 / 专业排名 |
| 专业 | 专业 | 热门专业 / 课程选择 / 就业前景 |
| 签证 | 签证 | Student Visa / Graduate Route / 续签 |
| 住宿 | 住宿 | 学校宿舍 / 私人租房 / Homestay |
| 生活 | 生活 | 银行卡 / 手机卡 / 饮食 / 交通 / 医疗 |

每个分类 **12 篇**（首批内容 60 篇）是黄金数量：
- 够让 Google/百度认为站点"有料"
- 能覆盖用户初次搜索的主要 long-tail keywords
- 每天 3–4 篇节奏可以 2 周内完成

### 写作规范（关键 GEO / AEO 心法）

1. **单篇 1500–2500 汉字**，太短 AI 判定为空洞，太长用户读不完
2. **H2 直接用用户疑问句**，让 Google 摘要直接摘你这句：
   - ✅ "英国 Student Visa 存款要多少？"
   - ❌ "存款要求"
3. **关键数据先给结论，再解释**：
   - "£1,334/月 × 9 个月 = £12,006（伦敦以外）"
4. **必带英文术语**：UCAS / HESA / UKVI / Tier 4 / CAS / ATAS
5. **必引权威数据源**：UCAS 官方、HESA、UKCISA、QS/THE 排名
6. **每篇带一个对比表**（大学排名、费用、签证类型对比）
7. **底部引导 CTA**：跳到评估表单或联系页
8. **Schema.org 结构化数据**：
   - 信息类文章 → `BlogPosting`
   - 含多个 Q&A 的 → `QAPage` + `FAQPage`
   - 首页 → `WebSite` + `Organization`

### 清理模板文章

```bash
# 删除 astro-paper 自带的示例文章
rm src/content/blog/*.md
# 开始新建，文件名约定：{category}-{slug}.md
# 例：src/content/blog/uni-g5-universities.md
```

文章 frontmatter 模板：

```yaml
---
title: "英国 G5 大学是哪 5 所？2026 最新申请难度"
description: "剑桥、牛津、IC、UCL、LSE —— 英国顶级名校 G5 的录取分数、申请截止日、学费一次看懂"
author: "StudyUK 团队"
pubDatetime: 2026-04-19T09:00:00Z
modDatetime: 2026-04-19T09:00:00Z
slug: uni-g5-universities
featured: true
draft: false
tags: ["大学", "G5", "罗素集团"]
---
```

---

## 3. 本地验证 → Git 初始化

```bash
npm run build
# 确认没有报错，dist/ 有产物

git init
git add .
git commit -m "feat: initial site setup with 60 articles"
```

---

## 4. GitHub 私有仓库

### 用 Chrome 控制（全自动）

1. 打开 https://github.com/new
2. Repository name: `<newsite>`
3. 选 **Private**
4. 不要勾 README / .gitignore / license（本地已有）
5. 创建后复制 remote URL：`git@github.com:<user>/<newsite>.git`

```bash
git remote add origin git@github.com:<user>/<newsite>.git
git branch -M main
git push -u origin main
```

---

## 5. Cloudflare Pages 部署

### 5.1 连接仓库

1. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
2. 选 GitHub → 授权访问 `<newsite>` 仓库
3. Framework preset: **Astro**（自动识别）
4. Build command: `npm run build`
5. Build output: `dist`
6. Environment variables：**先留空**（验证码之后再加）
7. Save and deploy

约 1–2 分钟后得到 `<newsite>.pages.dev` 的临时域名，先去访问确认界面正常。

### 5.2 环境变量（SEO 验证用）

完成 Google Search Console / Bing Webmaster / 百度 / 搜狗 / 360 / 神马 的 HTML meta 验证后：

1. Pages 项目 → Settings → Environment variables → Production + Preview 都加：
   - `PUBLIC_GOOGLE_SITE_VERIFICATION`
   - `PUBLIC_BING_VERIFICATION`
   - `PUBLIC_BAIDU_VERIFICATION`
   - `PUBLIC_SOGOU_VERIFICATION`
   - `PUBLIC_360_VERIFICATION`
   - `PUBLIC_SHENMA_VERIFICATION`
2. 加完点 "Retry deployment" 重新部署一次，meta 才会生效

---

## 6. 绑定自定义域名（关键章节）

### 6.1 域名注册侧改 NS（以聚名网为例）

1. 聚名网 → 域名管理 → `<domain>.cn` → 修改 DNS
2. 改成 Cloudflare 给的两条 NS（类似 `alan.ns.cloudflare.com` / `maeve.ns.cloudflare.com`）
3. `.cn` 域名要走 **CNNIC 审核**，通常 2–24 小时

### 6.2 Cloudflare 添加 zone

1. Cloudflare Dashboard → Add a site → 输入 `<domain>.cn`
2. 选 **Free Plan**
3. 它会扫描当前 DNS（注册商那边）→ 全部不要导入（反正以后都用 Cloudflare）
4. 拿到两条 NS → 回注册商那边改（§6.1）
5. 等到 Cloudflare 在 zone 页显示绿勾 "Your domain is now protected by Cloudflare"

### 6.3 Pages 绑定主域 + www

1. Pages 项目 → Custom domains → Set up a custom domain
2. 输入 `<domain>.cn` → Continue → 确认 CNAME `@ → <newsite>.pages.dev` → Activate domain
3. 再走一遍，输入 `www.<domain>.cn` → 确认 CNAME `www → <newsite>.pages.dev` → Activate
4. 等 1–5 分钟，SSL enabled，两边都能 HTTPS 访问

### 6.4 如果还是 503

99% 是 NS 没生效 / CNAME 没创建。检查：

```bash
# 查当前 NS（应该是 cloudflare.com）
nslookup -type=ns <domain>.cn

# 查 A/CNAME（应该能解析到 Cloudflare 的 104.x IP）
nslookup <domain>.cn 8.8.8.8
nslookup www.<domain>.cn 8.8.8.8
```

如果 NS 还是注册商默认：等 CNNIC 审核。
如果 NS 对但 A/CNAME 查不到：去 Cloudflare DNS Records 页手动确认 CNAME 存在。

---

## 7. 配置企业邮箱（腾讯企业邮箱为例）

目标：`yourname@<domain>.cn` 能收发。

### 7.1 在 Cloudflare DNS 添加 MX + SPF（可以提前做）

```
Type   | Name | Content                                  | Priority | Proxy
-------|------|------------------------------------------|----------|-------
MX     | @    | mxbiz1.qq.com                            | 5        | DNS only
MX     | @    | mxbiz2.qq.com                            | 10       | DNS only
TXT    | @    | v=spf1 include:spf.mail.qq.com ~all      | —        | DNS only
```

⚠️ MX 和 TXT 都要选 **DNS only**（橙色云变灰），不能 Proxied。

### 7.2 腾讯企业邮箱开通

1. 打开 https://exmail.qq.com → 立即开通 → 个人版免费版（最多 5 账号）
2. 微信扫码登录 → 填公司/站点名
3. "添加域名" → 输入 `<domain>.cn`
4. 腾讯会要求做一条 **所有权验证 TXT**（格式：`qcloudmailinbox: <随机串>`）
5. 把这条 TXT 加到 Cloudflare DNS（和 SPF 并列，也是 `@`）
6. 回腾讯点"验证域名" → 通过
7. 验证通过后，腾讯会再次确认 MX 是否是 `mxbiz1/2.qq.com`（§7.1 已加好，直接过）
8. 创建管理员邮箱（例如 `admin@<domain>.cn`），设密码
9. 登录 https://exmail.qq.com 测试收发

### 7.3 进阶：DKIM + DMARC（防垃圾邮件）

- **DKIM**：腾讯管理后台 → 域名信息 → 开启 DKIM，拷贝它给的 TXT 到 Cloudflare（name 类似 `<selector>._domainkey`）
- **DMARC**：直接在 Cloudflare 加一条 TXT：
  - Name: `_dmarc`
  - Content: `v=DMARC1; p=none; rua=mailto:postmaster@<domain>.cn`
  - 稳定后把 `p=none` 改成 `p=quarantine`

---

## 8. 搜索引擎提交

### 8.1 Google Search Console（必做）

1. https://search.google.com/search-console → Add property → URL prefix → `https://<domain>.cn`
2. 验证方式选 **HTML tag** → 拷贝 content
3. 写入 Pages 环境变量 `PUBLIC_GOOGLE_SITE_VERIFICATION` → Retry deployment
4. 回 GSC 点验证 → 通过
5. Sitemaps → 提交 `https://<domain>.cn/sitemap-index.xml`

### 8.2 Bing Webmaster Tools（必做）

最省事：直接 **Import from Google Search Console**，一键导入。

### 8.3 百度 / 搜狗 / 360 / 神马（中文站必做）

详见 `CN-submission.md`。关键点：
- 每家都要拿到 meta 验证码 → 写入对应 `PUBLIC_*_VERIFICATION`
- 每家都要手动提交一次 sitemap
- 百度首次收录 1–2 周，搜狗 2–4 周，360 3–7 天，神马 1–2 周

### 8.4 /llms.txt（GEO 加分项）

在 `public/llms.txt` 放：

```
# <站点名>
## 关于
...一段话介绍站点 + 覆盖主题

## 核心内容
- [分类 1]: /<category-1>/
- [分类 2]: /<category-2>/
...

## 联系
- 邮箱：contact@<domain>.cn
```

这是 llmstxt.org 的约定，让 ChatGPT/Claude/Perplexity 爬到站点时能更好地理解。

---

## 9. 部署后验收清单

逐项打勾：

- [ ] `https://<domain>.cn` 首屏正常（无 503/404）
- [ ] `https://www.<domain>.cn` 跳转或并行正常
- [ ] SSL 证书有效（浏览器地址栏绿锁）
- [ ] Favicon 显示（16×16 + 32×32 + apple-touch）
- [ ] 深色模式切换正常
- [ ] 悬浮 CTA 按钮链接对
- [ ] Footer 品牌 + 年份对
- [ ] 60 篇文章都能打开、都有图、无"TODO/lorem"残留
- [ ] View Source 能看到 JSON-LD（BlogPosting / WebSite）
- [ ] `/sitemap-index.xml` 可访问，包含全部文章
- [ ] `/robots.txt` 里 sitemap 指向正域名
- [ ] `/llms.txt` 可访问
- [ ] Google Search Console 已收到第一次爬取信号
- [ ] 邮箱 `admin@<domain>.cn` 能收发

---

## 10. 常见坑 Cheat Sheet

| 症状 | 原因 | 解药 |
|---|---|---|
| Pages 页正常但自定义域 503 | NS 没生效 / CNAME 没建 | 等 CNNIC 审核 + 手动 Pages 绑域 |
| Pages build 失败 "Cannot find module" | `package-lock.json` 没提交 | `git add package-lock.json && push` |
| JSON-LD 里有旧站信息 | `Layout.astro` 没改干净 | `grep` 全局搜旧品牌字符串 |
| 百度收录慢 | 没主动推送 | 加 GitHub Action 调百度 API |
| Sitemap 里 URL 还是 localhost | `SITE.website` 没改 | 改 `src/config.ts` 重 build |
| 字体在国内很慢 | 用了 Google Fonts | 换系统字体栈（已经是默认） |
| 邮件发出去进垃圾箱 | 没配 DKIM / DMARC | 见 §7.3 |

---

## 11. 下一站怎么启动（≈ 1 小时 checklist）

```
□ 买域名（聚名网 / Cloudflare Registrar / Namecheap）
□ 复制 astro-paper-template → <newsite>
□ 全局替换品牌字符串
□ 改 5 个分类 + 10 个示例文章试跑 npm run build
□ 新 git repo → GitHub 私有 → push
□ Cloudflare Pages 连仓库 → 自动部署
□ Cloudflare 加 zone + 注册商改 NS
□ Pages 绑 <domain>.cn + www.<domain>.cn
□ 加 MX + SPF（先把邮箱 DNS 位置占住，之后开通腾讯邮时不卡）
□ GSC + Bing 验证
□ 开始写后续 50 篇文章
```

后续新文章的节奏：
- 每天 2–3 篇，每篇遵循 §2 写作规范
- 每周一次 `git push`，Cloudflare 自动重 deploy
- 每月底在 Google Search Console 看 index coverage，对没收录的文章手动 "Request indexing"

---

## 12. Claude 协作工作流（怎么让 AI 帮你跑完这一切）

StudyUK 的全流程基本由 Claude 在 Cowork 模式下执行。复盘几个关键模式：

### 12.1 一次性启动提示

打开 Claude 的 Cowork 模式，选中 `C:\Users\ben\Dropbox (个人)\websites` 作为工作目录，然后发：

```
我要做一个新的中文独立站，主题是 <TOPIC>，域名 <domain>.cn。
请按 C:\Users\ben\Dropbox (个人)\websites\studyuk-cn\PLAYBOOK.md 的流程从头到尾帮我做完，
全程帮我操作，尽量减少我的参与。需要我提供的东西（域名注册商密码、微信扫码验证等）
再问我。
```

Claude 会：
1. 读 PLAYBOOK.md
2. 用 TaskList 建出所有任务
3. 依次执行：复制模板 → 改品牌 → 写文章 → git push → Pages 部署 → 绑域 → DNS
4. 遇到需要真人操作的（注册 GitHub、腾讯邮箱扫码）时停下来问你

### 12.2 写文章的并行模式

60 篇文章一个个让 Claude 写太慢，最佳实践：

```
请用 Agent 工具同时派 5 个子 agent，分别写大学、专业、签证、住宿、生活 5 个分类
各 12 篇文章。每个 agent 的 prompt 告诉它：
1. 分类主题 + 12 个具体 slug
2. 写作规范（见 PLAYBOOK §2）
3. 文件路径约定
4. 必须引用的权威数据源
报告完成时只要返回每个 slug 的 300 字摘要，不要把全文塞回来浪费上下文。
```

这样 5 个分类并行跑，60 篇文章 1 小时左右能出齐。

### 12.3 防止 Claude 「假装做完」

有时候 Claude 会说"已完成 60 篇文章"但实际只写了 10 篇骨架。每轮都让它在 TodoList 最后加一条 **verification** 任务：

```
最后用 grep/find 列出 src/content/blog/*.md 的实际文件数和字数，
任何少于 1500 字的文章重写。
```

### 12.4 部署坑

- **不要让 Claude 在本地帮你跑 `git push`**：git 的交互（SSH passphrase、push 确认）会卡住。让它准备好提交，然后你 PowerShell 里亲自 push
- **Cloudflare Pages 的 tabs 有时会挂**：browser_batch 超时是常态。不要慌，关 tab 重开新 tab 继续
- **`.cn` 域名 NS 生效慢**：CNNIC 审核 2–24 小时，期间 503 是正常的，别来回改 NS

### 12.5 把 CLAUDE.md 当 AI 的"记忆"

每个站点根目录放一个 `CLAUDE.md`，新对话打开时 Claude 先读这个，不用你每次解释上下文。StudyUK 的 CLAUDE.md 结构可参考本仓库，建议包含：

```
1. 站点目的 + 一句话定位
2. 技术栈版本（Astro X, Tailwind Y, astro-paper Z）
3. 目录结构
4. 5 个分类的内容风格（每个给 2–3 个示范文章的 slug）
5. 写作规范（字数、H2 风格、必带数据源）
6. 部署配置（Cloudflare Pages 的 build command / output dir / 环境变量清单）
7. 已知限制（比如"不要用 Google Fonts，国内被墙"）
8. 待办 / 路线图
```

下一次对话只要说 "读一下 CLAUDE.md 然后继续"，Claude 立即进入状态。

---

## 13. 可复制脚手架（直接照抄）

### 13.1 `.env.example`

```env
# SEO 验证（填完后 Retry deployment 才生效）
PUBLIC_GOOGLE_SITE_VERIFICATION=
PUBLIC_BING_VERIFICATION=
PUBLIC_BAIDU_VERIFICATION=codeva-
PUBLIC_SOGOU_VERIFICATION=
PUBLIC_360_VERIFICATION=
PUBLIC_SHENMA_VERIFICATION=

# 可选：Cloudflare Web Analytics
PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=
```

### 13.2 `.gitignore`（Astro 项目最小集）

```gitignore
# build
dist/
.astro/

# deps
node_modules/

# env
.env
.env.local
.env.production

# logs
*.log
npm-debug.log*
pnpm-debug.log*

# editor
.vscode/
.idea/
*.swp
.DS_Store
Thumbs.db

# Cloudflare
.wrangler/
```

### 13.3 `CLAUDE.md` 模板骨架

```markdown
# <站点名> (<domain>.cn) — 站点交接文档

## 1. 定位
一句话：<站点定位>。目标用户：<谁>。不做什么：<边界>。

## 2. 技术栈
- Astro 5.x + astro-paper 5.5.x
- Tailwind CSS
- Cloudflare Pages（main 分支自动部署）
- GitHub 私有仓库：<user>/<repo>

## 3. 目录
- `src/content/blog/` — 所有文章 (.md)
- `src/pages/` — about / privacy / disclaimer
- `src/config.ts` — 站点基础配置
- `src/components/` — Header / Footer / FloatingActions 已定制
- `public/` — favicon + robots.txt + llms.txt

## 4. 分类结构
| Slug | 中文 | 覆盖主题 |
|---|---|---|
| <s1> | <c1> | ... |
...

## 5. 写作规范
参考 `PLAYBOOK.md` §2。要点：
- 1500–2500 字
- H2 用疑问句
- 必引 <领域权威源>
- 结尾 CTA 跳 <表单 URL>

## 6. 部署
- Build: `npm run build`
- Output: `dist`
- 自动部署：push 到 main
- 环境变量见 `.env.example`

## 7. 域名与邮箱
- 域名：<domain>.cn，聚名网注册
- Cloudflare zone 已托管
- Pages 绑定：<domain>.cn + www.<domain>.cn
- 邮箱：腾讯企业邮箱（MX mxbiz1/2.qq.com，SPF 已加）

## 8. 禁用清单
- Google Fonts（被墙）
- Google Tag Manager（被墙）
- 任何国内 CDN（需要 ICP 备案）

## 9. 路线图
- [ ] 继续写文章到 120 篇
- [ ] 百度主动推送 API
- [ ] DKIM + DMARC
```

### 13.4 文章 frontmatter 模板

```yaml
---
title: ""
description: ""
author: "<站点名> 团队"
pubDatetime: 2026-04-19T09:00:00Z
modDatetime: 2026-04-19T09:00:00Z
slug: ""
featured: false
draft: false
tags: []
---
```

### 13.5 `public/llms.txt` 模板

```
# <站点名>

<domain>.cn

## 关于
<一段话，100–200 字，覆盖主题 + 数据源 + 受众>

## 核心分类
- [<分类 1>](/<s1>/)
- [<分类 2>](/<s2>/)
...

## 更新频率
每天新增 2–3 篇。Sitemap: /sitemap-index.xml

## 联系
- 邮箱：contact@<domain>.cn
- 表单：<form URL>
```

### 13.6 `public/robots.txt` 模板

```
User-agent: *
Allow: /

Sitemap: https://<domain>.cn/sitemap-index.xml
```

---

## 14. 本次 StudyUK 实际耗时（供下一站预估）

| 阶段 | 实际耗时 | 备注 |
|---|---|---|
| 复制模板 + 改品牌信息 | 20 min | 全局搜旧字符串最耗时 |
| 写 60 篇文章 | 2–3 小时 | 5 个 agent 并行，每 agent 写 12 篇 |
| 本地 build + git init + push | 10 min | |
| GitHub 建仓（Chrome 自动化） | 5 min | |
| Cloudflare Pages 接入 | 10 min | 包括首次 build |
| 注册商改 NS（等 CNNIC 审核） | 数小时（等待） | 不占实际操作时间 |
| Pages 绑定 2 个自定义域 | 10 min | |
| Cloudflare 加 MX + SPF | 5 min | |
| 写 PLAYBOOK + CLAUDE.md | 30 min | |
| **总计（纯操作）** | **约 4 小时** | + 等待 1 天（NS + 文章审稿） |

---

*最后更新：2026-04-19 by Claude (StudyUK 上线当天，也是本 Playbook 第一版)*

