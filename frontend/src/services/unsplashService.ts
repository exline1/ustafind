const CURATED_IMAGES: Record<string, string[]> = {
  hero: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
  ],
  usta: [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    'https://images.unsplash.com/photo-1504149926900-1722ed8a0249?w=600&q=80',
    'https://images.unsplash.com/photo-1607400201884-825b5717f3c7?w=600&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
    'https://images.unsplash.com/photo-1590856029826-c7a731a0c5a5?w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  ],
  plumber: [
    'https://images.unsplash.com/photo-1607472586893-a8845286597e?w=600&q=80',
  ],
  electrician: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
  ],
  painter: [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
  ],
  carpenter: [
    'https://images.unsplash.com/photo-1504149926900-1722ed8a0249?w=600&q=80',
  ],
  construction: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  ],
  equipment: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebb4752?w=600&q=80',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6cc251d8?w=400&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
  ],
};

const QUERY_MAP: Record<string, string> = {
  'handyman uzbekistan': 'usta',
  'craftsman working': 'usta',
  'construction worker asia': 'usta',
  'construction worker professional': 'hero',
  'plumber working': 'plumber',
  electrician: 'electrician',
  'painter wall': 'painter',
  'carpenter wood': 'carpenter',
  'construction equipment': 'equipment',
  'power tools': 'equipment',
  'concrete mixer': 'equipment',
};

const imageCache = new Map<string, string>();

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getCuratedImage(query: string, seed?: string): string {
  const category = QUERY_MAP[query] || 'usta';
  const images = CURATED_IMAGES[category] || CURATED_IMAGES.usta;
  const index = hashString(seed || query) % images.length;
  return images[index];
}

export async function fetchUnsplashImage(
  query: string,
  options: { width?: number; seed?: string } = {}
): Promise<string> {
  const cacheKey = `${query}-${options.seed || ''}-${options.width || 800}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

  if (accessKey) {
    try {
      const params = new URLSearchParams({
        query,
        per_page: '1',
        orientation: 'landscape',
        client_id: accessKey,
      });
      const res = await fetch(`https://api.unsplash.com/search/photos?${params}`);
      if (res.ok) {
        const data = await res.json();
        const url = data.results?.[0]?.urls?.regular;
        if (url) {
          const sized = options.width ? `${url}&w=${options.width}&q=80` : url;
          imageCache.set(cacheKey, sized);
          return sized;
        }
      }
    } catch {
      /* fallback below */
    }
  }

  const fallback = getCuratedImage(query, options.seed);
  imageCache.set(cacheKey, fallback);
  return fallback;
}

export function getUstaImage(ustaId: string): Promise<string> {
  return fetchUnsplashImage('craftsman working', { seed: ustaId, width: 600 });
}

export function getHeroImage(): Promise<string> {
  return fetchUnsplashImage('construction worker professional', { width: 900 });
}

export function getCategoryImage(categoryId: string, query: string): Promise<string> {
  return fetchUnsplashImage(query, { seed: categoryId, width: 400 });
}

export function getEquipmentImage(equipmentId: string, name: string): Promise<string> {
  const query = name.toLowerCase().includes('beton')
    ? 'concrete mixer'
    : 'construction equipment';
  return fetchUnsplashImage(query, { seed: equipmentId, width: 600 });
}

export function getGalleryImages(count: number, seed: string): Promise<string[]> {
  return Promise.all(
    Array.from({ length: count }, (_, i) =>
      fetchUnsplashImage('construction worker asia', { seed: `${seed}-${i}`, width: 400 })
    )
  );
}
