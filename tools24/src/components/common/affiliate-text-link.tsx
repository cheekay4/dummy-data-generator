interface LinkItem {
  text: string;
  clickUrl: string;
  impressionUrl: string;
  badge?: string;
}

interface AffiliateTextLinkProps {
  label: string;
  items: LinkItem[];
}

export function AffiliateTextLink({ label, items }: AffiliateTextLinkProps): React.JSX.Element {
  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/50 p-5 print:hidden">
      <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
        {label}
        <span className="text-[10px] border rounded px-1 py-0.5 text-muted-foreground">PR</span>
      </p>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            {item.badge && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                {item.badge}
              </span>
            )}
            <a
              href={item.clickUrl}
              rel="nofollow noreferrer sponsored"
              target="_blank"
              className="text-sm text-primary hover:underline"
            >
              {item.text}
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.impressionUrl}
              alt=""
              width={1}
              height={1}
              style={{ display: 'none' }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
