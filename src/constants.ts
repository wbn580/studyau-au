import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import IconCopy from "@/assets/icons/IconCopy.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

// Contact channels shown in the footer / header.
// Mail is the default; social handles can be added later.
export const SOCIALS: Social[] = [
  {
    name: "Mail",
    href: "mailto:hello@studyau.au",
    linkTitle: `Contact ${SITE.title}`,
    icon: IconMail,
  },
] as const;

// Share buttons at the bottom of every article.
// International students are spread across many platforms; we include X,
// LinkedIn, Facebook, WhatsApp, Telegram, Email, and Copy Link.
export const SHARE_LINKS: Social[] = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share on X`,
    icon: IconBrandX,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/sharing/share-offsite/?url=",
    linkTitle: `Share on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "Whatsapp",
    href: "https://wa.me/?text=",
    linkTitle: `Share on WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share on Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share via email`,
    icon: IconMail,
  },
  {
    name: "Copy",
    href: "#copy-link",
    linkTitle: `Copy link`,
    icon: IconCopy,
  },
] as const;
