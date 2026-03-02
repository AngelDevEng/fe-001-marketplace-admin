'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function BottomBanner() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <div className="hidden md:block w-full">
      <Image
        src={isDark ? '/img/BANNER_INFERIOR.png' : '/img/BANNER_INFERIOR.png'}
        alt="Banner Inferior"
        width={1600}
        height={270}
        className="w-full h-auto object-cover min-h-[80px]"
      />
    </div>
  );
}
