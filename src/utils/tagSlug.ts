// 标签 → URL slug 映射
// ------------------------------------------------------------
// 混合策略：
//  - 5 大分类用英文 slug（大学/专业/签证/住宿/生活）
//  - 其他主题标签保留原始中文，由 slugifyStr 处理
//
// 页面显示始终用原始中文标签名（见 Tag 组件的 tagName 参数），
// 只有 URL 里的 slug 部分会用英文代码。
//
// 新增主题想让它也用英文 slug 时，在下面加一行即可。

import { slugifyStr } from "./slugify";

export const TAG_SLUG_MAP: Record<string, string> = {
  // 五大分类
  大学: "universities",
  专业: "majors",
  签证: "visa",
  住宿: "housing",
  生活: "life",
  // 常见细分主题
  申请: "application",
  奖学金: "scholarship",
  费用: "cost",
  雅思: "ielts",
  语言班: "pre-sessional",
  罗素集团: "russell-group",
  G5: "g5",
  本科: "undergraduate",
  硕士: "master",
  博士: "phd",
  伦敦: "london",
};

/** 把单个 tag 转成 URL 用的 slug。优先查映射表，否则走通用 slugify。 */
export const slugifyTag = (tag: string): string => {
  return TAG_SLUG_MAP[tag] ?? slugifyStr(tag);
};

/** 批量版本，保留与 slugifyAll 一致的接口。 */
export const slugifyTagAll = (tags: string[]): string[] => tags.map(slugifyTag);
