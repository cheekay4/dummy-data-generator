'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher(): React.ReactElement {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (nextLocale: string): void => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm" aria-label="Language switcher">
      <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <button
        onClick={() => handleSwitch('ja')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === 'ja'
            ? 'font-semibold text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'ja' ? 'true' : undefined}
      >
        JA
      </button>
      <span className="text-muted-foreground/50" aria-hidden="true">|</span>
      <button
        onClick={() => handleSwitch('en')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === 'en'
            ? 'font-semibold text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  );
}
