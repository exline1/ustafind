import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, SlidersHorizontal, MapPin, X } from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import UnsplashImage from '../components/ui/UnsplashImage';
import StaggerGrid, { StaggerItem } from '../components/layout/StaggerGrid';
import { categories, cities } from '../services/mockData';
import { getUstaImage } from '../services/unsplashService';
import { apiRequest } from '../services/api';
import type { Usta } from '../types';

export default function UstalarListPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const filterKey = useRef(0);

  const [ustalar, setUstalar] = useState<Usta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    setLoading(true);
    apiRequest<Usta[]>('/ustalar')
      .then(setUstalar)
      .catch((err) => console.error('Error fetching ustalar:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...ustalar];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.category.toLowerCase().includes(q) ||
          u.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory);
      if (cat) result = result.filter((u) => u.category === cat.name);
    }
    if (selectedCity) result = result.filter((u) => u.city === selectedCity);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'experience') result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    return result;
  }, [ustalar, searchQuery, selectedCategory, selectedCity, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const shouldStagger = filterKey.current === 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSortBy('rating');
    setCurrentPage(1);
    filterKey.current += 1;
  };

  const hasFilters = searchQuery || selectedCategory || selectedCity;

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="bg-gradient-brand-hero py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ustalar ro&apos;yxati</h1>
          <p className="text-white/70 mb-8 max-w-xl leading-relaxed">
            O&apos;zingizga kerakli ustani qidiring — kategoriya, shahar va reytingga ko&apos;ra filtrlang
          </p>
          <div className="relative max-w-2xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-muted" weight="bold" />
            <input
              type="text"
              placeholder="Usta ismi, kasbi yoki ko'nikmasi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                filterKey.current += 1;
              }}
              className="w-full pl-12 pr-4 py-4 min-h-[44px] rounded-xl bg-white text-gray-900 placeholder-gray-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light border-[1.5px] border-transparent focus:border-brand transition-all duration-300"
              aria-label="Usta qidirish"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-16 md:top-[4.5rem] z-30 bg-white shadow-sm border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white border-[1.5px] border-gray-light rounded-xl text-sm font-medium text-brand-dark hover:bg-gray-light transition-colors duration-300 md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" weight="bold" />
                Filtrlar
              </button>

              <div className="hidden md:flex items-center gap-2 flex-wrap">
                <Select
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Barcha kategoriyalar"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                    filterKey.current += 1;
                  }}
                  className="!py-2.5 !w-48 !min-h-[44px]"
                />
                <Select
                  options={cities.map((c) => ({ value: c, label: c }))}
                  placeholder="Barcha shaharlar"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCurrentPage(1);
                    filterKey.current += 1;
                  }}
                  className="!py-2.5 !w-44 !min-h-[44px]"
                />
                <Select
                  options={[
                    { value: 'rating', label: "Reyting bo'yicha" },
                    { value: 'experience', label: "Tajriba bo'yicha" },
                    { value: 'reviews', label: 'Sharhlar soni' },
                  ]}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="!py-2.5 !w-48 !min-h-[44px]"
                />
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-danger hover:text-danger/80 transition-colors duration-300 min-h-[44px]"
                >
                  <X className="w-4 h-4" weight="bold" />
                  Tozalash
                </button>
              )}
            </div>
            <p className="text-sm text-gray-muted">{filtered.length} ta usta topildi</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showFilters && (
          <div className="md:hidden bg-white rounded-2xl p-4 mb-6 space-y-3 shadow-sm border border-gray-light">
            <Select
              label="Kategoriya"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Barchasi"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
                filterKey.current += 1;
              }}
            />
            <Select
              label="Shahar"
              options={cities.map((c) => ({ value: c, label: c }))}
              placeholder="Barchasi"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
                filterKey.current += 1;
              }}
            />
            <Select
              label="Saralash"
              options={[
                { value: 'rating', label: "Reyting bo'yicha" },
                { value: 'experience', label: "Tajriba bo'yicha" },
                { value: 'reviews', label: 'Sharhlar soni' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length > 0 ? (
          <StaggerGrid animate={shouldStagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((usta) => (
              <StaggerItem key={usta.id}>
                <Link to={`/ustalar/${usta.id}`}>
                  <Card className="group cursor-pointer h-full !p-0 overflow-hidden">
                    <UnsplashImage
                      src={getUstaImage(usta.id)}
                      alt={`${usta.name} — ${usta.category}`}
                      className="rounded-t-2xl rounded-b-none"
                      aspectClass="h-[200px]"
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-brand-dark group-hover:text-brand transition-colors duration-300 truncate">
                          {usta.name}
                        </h3>
                        {usta.isVerified && <Badge variant="success">Tasdiqlangan</Badge>}
                      </div>
                      <p className="text-sm text-brand font-medium">{usta.category}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-muted mt-1 mb-3">
                        <MapPin className="w-3 h-3" weight="fill" />
                        {usta.city} • {usta.experience} yil tajriba
                      </div>
                      <Rating value={usta.rating} size="sm" showValue count={usta.reviewCount} />
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {usta.skills?.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="category" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 group-hover:bg-gradient-brand group-hover:!text-white group-hover:!border-transparent transition-all duration-300"
                      >
                        Profilni ko&apos;rish
                      </Button>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <div className="text-center py-20">
            <MagnifyingGlass className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-muted mb-6">Qidiruv so&apos;rovini yoki filtrlarni o&apos;zgartirib ko&apos;ring</p>
            <Button variant="outline" onClick={clearFilters}>
              Filtrlarni tozalash
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  setCurrentPage(i + 1);
                  filterKey.current += 1;
                }}
                className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl text-sm font-medium transition-all duration-300 ${
                  currentPage === i + 1
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-white text-gray-muted border border-gray-light hover:bg-gray-light'
                }`}
                aria-label={`${i + 1}-sahifa`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
