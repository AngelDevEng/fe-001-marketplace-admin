'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TopBannerProps {
  lightSrc?: string;
  darkSrc?: string;
}

export default function TopBanner({
  lightSrc = '/img/BANNER_SUPERIOR.png',
  darkSrc = '/img/BANNER_SUPERIOR.png',
}: TopBannerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <div className="hidden md:block w-full">
      <Image
        src={isDark && darkSrc ? darkSrc : lightSrc}
        alt="Banner Superior"
        width={1600}
        height={270}
        className="w-full h-auto object-cover min-h-[80px]"
        priority
      />
    </div>
  );
}
