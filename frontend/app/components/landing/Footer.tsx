import { siteConfig } from "@/app/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </footer>
  );
}