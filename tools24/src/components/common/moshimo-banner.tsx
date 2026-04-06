"use client";

interface BannerItem {
  clickUrl: string;
  impressionUrl: string;
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
}

interface MoshimoBannerProps {
  banners: BannerItem[];
}

export function MoshimoBanner({ banners }: MoshimoBannerProps): React.JSX.Element {
  const banner = banners[Math.floor(Math.random() * banners.length)];
  return (
    <div className="flex justify-center my-6 print:hidden">
      <div>
        <a href={banner.clickUrl} rel="nofollow noreferrer sponsored" target="_blank">
          <img
            src={banner.imageUrl}
            width={banner.width}
            height={banner.height}
            alt={banner.alt}
            style={{ border: 'none' }}
            loading="lazy"
          />
        </a>
        <img
          src={banner.impressionUrl}
          width={1}
          height={1}
          style={{ border: 'none' }}
          loading="lazy"
          alt=""
        />
      </div>
    </div>
  );
}
