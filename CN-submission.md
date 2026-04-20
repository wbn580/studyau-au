# 中国大陆搜索引擎收录与备案指南

本文档记录把 **英国留学 StudyUK (studyuk.cn)** 推送到中国大陆主流搜索引擎的完整步骤，以及 ICP 备案的判断与操作路径。

---

## 一、是否需要 ICP 备案？（决策树）

ICP 备案是**域名指向的服务器位于中国大陆境内**时，由工信部强制要求的行政备案。是否需要备案只取决于**服务器位置**，不取决于语言、用户群体或域名后缀。

判断步骤：

1. **站点部署在哪？**
   - 部署在 Cloudflare Pages / Vercel / Netlify / AWS（非中国大陆）→ **不需要 ICP 备案**
   - 部署在阿里云（大陆）/ 腾讯云（大陆）/ 华为云（大陆）→ **必须 ICP 备案**
2. **要不要用国内 CDN（阿里云 CDN / 腾讯云 CDN / 又拍云 / 七牛云等）？**
   - 要用 → **必须 ICP 备案**（国内 CDN 一律拒绝为未备案域名提供加速）
   - 不用 → 跳过
3. **网站有没有经营性内容（电商、付费服务、广告联盟）？**
   - 有 → 除 ICP 备案外还需 **ICP 经营许可证**
   - 无 → 仅需普通 ICP 备案（俗称"主体+网站"备案）

**本站当前情况**：部署在 Cloudflare Pages，无国内 CDN，**无需 ICP 备案**。

**备案对访问速度的影响**：即便不备案，国内也能访问（只是 Cloudflare 部分 IP 段有丢包，首屏稍慢）。如果长期 SEO 收益巨大且不介意流程，可考虑迁移到阿里云香港/新加坡节点（仍无需备案）或做大陆 CDN + 备案。

**备案流程参考（仅在你决定上大陆主机后执行）**：
1. 在阿里云 / 腾讯云购买服务器
2. 进入云商"备案系统"→ 新增备案
3. 提交：营业执照或身份证、域名证书、网站负责人手机/邮箱、网站名称+内容说明
4. 云商初审（2–3 工作日）→ 管局复审（10–20 工作日）
5. 下来后在首页底部加"**琼ICP备XXXXXXXX号**"字样并链接到 `https://beian.miit.gov.cn`
6. 同时做公安备案（`https://beian.mps.gov.cn`），20 工作日内

---

## 二、百度搜索资源平台（最重要）

百度是大陆市场份额第一的搜索引擎，必做。

### 2.1 注册 + 站点验证

1. 打开 [https://ziyuan.baidu.com](https://ziyuan.baidu.com)
2. 用百度账号登录（没有就用手机号注册）
3. 右上角 → 用户中心 → 站点管理 → **添加网站**
4. 输入：`https://studyuk.cn` → 下一步
5. 选择站点属性（站点类型选"资讯"/"其他"均可）
6. **验证方式选"HTML 标签"**
7. 复制 `<meta name="baidu-site-verification" content="codeva-XXX"/>` 的 content 值
8. 填到项目 `.env` 里：`PUBLIC_BAIDU_VERIFICATION=codeva-XXX`
9. 重新部署到 Cloudflare Pages
10. 回到百度站长平台 → 点"完成验证"

### 2.2 提交 Sitemap

验证成功后：

1. 左侧菜单 → **普通收录** → sitemap
2. 输入 sitemap 地址：`https://studyuk.cn/sitemap-index.xml`
3. 点提交
4. 一般 24–48 小时百度开始抓取

### 2.3 主动推送（加速收录）

- 手动推送：百度站长平台 → 普通收录 → URL 提交，一次最多 2000 条
- API 推送（推荐）：百度会给一个 token，配合脚本在发布新文章后自动 ping
- 自动推送 JS：百度提供一段 `<script>` 塞到页面，每次访问自动推送当前页面

> 当前站点未集成 API 推送，如果需要，可以让 Claude 帮你加一个 GitHub Action 在每次 push 后调用百度 API。

### 2.4 品牌词保护

到**站点属性 → 站点 LOGO**上传 121×75 + 75×75 两张 LOGO 图（搜索结果旁显示），提升品牌曝光。

---

## 三、搜狗站长平台（次重要）

搜狗被腾讯收购后市场份额合并进入微信搜索，但**微信公众号 + 微信搜一搜**的流量值得占位。

1. 打开 [https://zhanzhang.sogou.com](https://zhanzhang.sogou.com)
2. QQ/微信扫码登录
3. 添加站点 → `https://studyuk.cn`
4. 选"meta 文件验证"→ 复制 content
5. 填到 `.env`：`PUBLIC_SOGOU_VERIFICATION=XXX`
6. 重新部署 → 回去点验证
7. 提交 Sitemap：`https://studyuk.cn/sitemap-index.xml`
8. 如果想上微信搜索，再到"微信公众平台 → 搜一搜"注册同名公众号，绑定域名

---

## 四、360 站长平台

1. 打开 [https://zhanzhang.so.com](https://zhanzhang.so.com)
2. 登录（360 账号 / 微信 / QQ）
3. 添加网站 → 验证同上，用"HTML 标签验证"
4. 填 `.env`：`PUBLIC_360_VERIFICATION=XXX`
5. 部署 → 验证
6. 提交 Sitemap 同上
7. 360 有"新站保护"机制，首月收录较快

---

## 五、神马搜索（UC / 夸克浏览器）

移动端重要（UC 浏览器仍占 10%+ 中国移动流量）。

1. 打开 [https://zhanzhang.sm.cn](https://zhanzhang.sm.cn)
2. 手机号注册
3. 添加站点 → HTML 标签验证
4. `.env`：`PUBLIC_SHENMA_VERIFICATION=XXX`
5. 提交 `sitemap-index.xml`

---

## 六、Bing（也给国内用户用，必做）

大陆 Edge 浏览器默认搜索引擎是 Bing。

1. 打开 [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. 可以直接从 Google Search Console 导入（省事）
3. 或手动：Add a site → `https://studyuk.cn` → 选 XML File / HTML Meta
4. `.env`：`PUBLIC_BING_VERIFICATION=XXX`
5. 提交 Sitemap

---

## 七、提交后检查收录情况

分别在各搜索引擎搜索：

```
site:studyuk.cn
```

- **百度**：首次收录一般 1–2 周；收录数可在站长平台"索引量"里查
- **搜狗**：2–4 周
- **360**：3–7 天
- **神马**：1–2 周
- **Bing**：7–14 天（比 Google 慢一点）

---

## 八、提升中国大陆访问速度的额外动作（无需备案）

1. **Cloudflare 已启用中国大陆加速？** 不是自动的，默认 Cloudflare 不走大陆节点。选项：
   - Cloudflare China Network：需要与京东云合作，且要 ICP 备案——不适合我们
   - **推荐：保持默认 Cloudflare → 境外节点**，国内访问走香港/新加坡，速度 200–400ms，能接受
2. **图片/字体用国内 CDN 加速？**
   - 本站**不依赖** Google Fonts、不依赖任何被墙资源（已用系统字体栈），无需额外处理
   - OG 图片由自己生成，不走 Google
3. **第三方脚本**：
   - ❌ 不要用：Google Analytics（被墙）、Google Tag Manager（被墙）、Typekit（慢）
   - ✅ 可以用：Cloudflare Web Analytics、百度统计 tongji.baidu.com、umami 自托管

---

## 九、.env 最终模版

```env
PUBLIC_GOOGLE_SITE_VERIFICATION=...
PUBLIC_BING_VERIFICATION=...
PUBLIC_BAIDU_VERIFICATION=codeva-...
PUBLIC_SOGOU_VERIFICATION=...
PUBLIC_360_VERIFICATION=...
PUBLIC_SHENMA_VERIFICATION=...
```

把这些填入 Cloudflare Pages 的 **Environment Variables（Production + Preview）**，保存后点"Retry deployment"重新部署，就能在 `<head>` 看到对应的 meta 标签。

---

## 十、时间表建议

| 阶段 | 动作 | 周期 |
|---|---|---|
| D+0 | 部署上线，提交 Google Search Console + Bing | 30 分钟 |
| D+1 | 百度 + 搜狗 + 360 + 神马验证 + 提交 sitemap | 1 小时 |
| D+7 | 检查首批收录情况 | 10 分钟 |
| D+14 | 根据索引量给百度上主动推送 API（可选） | 30 分钟 |
| D+30 | 全平台 site: 查询做一次复盘 | 15 分钟 |

---

*最后更新：2026 年 4 月。百度站长平台 UI 每年会小改，以当时实际界面为准。*
