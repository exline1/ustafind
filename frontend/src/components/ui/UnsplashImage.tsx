import { useEffect, useState } from 'react';

interface UnsplashImageProps {
  src: string | Promise<string>;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export default function UnsplashImage({
  src,
  alt,
  className = '',
  aspectClass = '',
}: UnsplashImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setImageSrc(null);

    const resolve = async () => {
      const url = typeof src === 'string' ? src : await src;
      if (!cancelled) setImageSrc(url);
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-gray-light animate-skeleton rounded-inherit"
          aria-hidden="true"
        />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
