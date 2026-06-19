import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, MapPin, Truck, X } from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import UnsplashImage from '../components/ui/UnsplashImage';
import StaggerGrid, { StaggerItem } from '../components/layout/StaggerGrid';
import { cities, formatPrice } from '../services/mockData';
import { getEquipmentImage } from '../services/unsplashService';
import { apiRequest } from '../services/api';
import type { Equipment } from '../types';

const equipCategories = [
  { value: 'Qazish texnikasi', label: 'Qazish texnikasi' },
  { value: 'Beton uskunalari', label: 'Beton uskunalari' },
  { value: "Ko'tarish texnikasi", label: "Ko'tarish texnikasi" },
  { value: 'Energetik uskunalar', label: 'Energetik uskunalar' },
  { value: 'Qurilish asboblari', label: 'Qurilish asboblari' },
  { value: 'Payvandlash uskunalari', label: 'Payvandlash uskunalari' },
];

export default function EquipmentListPage() {
  const filterKey = useRef(0);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    setLoading(true);
    apiRequest<Equipment[]>('/equipments')
      .then(setEquipments)
      .catch((err) => console.error('Error fetching equipment:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...equipments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter((e) => e.category === selectedCategory);
    if (selectedCity) result = result.filter((e) => e.city === selectedCity);
    return result;
  }, [equipments, searchQuery, selectedCategory, selectedCity]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    filterKey.current += 1;
  };
  const hasFilters = searchQuery || selectedCategory || selectedCity;
  const shouldStagger = filterKey.current === 0;

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="bg-gradient-brand-hero py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Texnika arendasi</h1>
          <p className="text-white/70 mb-8 max-w-xl leading-relaxed">
            Qurilish texnikasi va jihozlarini qulay narxlarda arendaga oling
          </p>
          <div className="relative max-w-2xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-muted" weight="bold" />
            <input
              type="text"
              placeholder="Texnika nomi yoki turi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                filterKey.current += 1;
              }}
              className="w-full pl-12 pr-4 py-4 min-h-[44px] rounded-xl bg-white text-gray-900 placeholder-gray-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light border-[1.5px] border-transparent focus:border-brand transition-all duration-300"
              aria-label="Texnika qidirish"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-16 md:top-[4.5rem] z-30 bg-white shadow-sm border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Select
                options={equipCategories}
                placeholder="Barcha turlar"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
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
                  filterKey.current += 1;
                }}
                className="!py-2.5 !w-44 !min-h-[44px]"
              />
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-danger hover:text-danger/80 min-h-[44px] transition-colors duration-300"
                >
                  <X className="w-4 h-4" weight="bold" /> Tozalash
                </button>
              )}
            </div>
            <p className="text-sm text-gray-muted">{filtered.length} ta e&apos;lon</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <StaggerGrid animate={shouldStagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((eq) => (
              <StaggerItem key={eq.id}>
                <Link to={`/texnika/${eq.id}`}>
                  <Card className="group cursor-pointer h-full !p-0 overflow-hidden">
                    <UnsplashImage
                      src={getEquipmentImage(eq.id, eq.name)}
                      alt={eq.name}
                      className="rounded-t-2xl rounded-b-none"
                      aspectClass="h-48"
                    />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info">{eq.category}</Badge>
                        {eq.available && <Badge variant="success">Mavjud</Badge>}
                      </div>
                      <h3 className="font-bold text-brand-dark mb-1 group-hover:text-brand transition-colors duration-300">
                        {eq.name}
                      </h3>
                      <p className="text-sm text-gray-muted flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" weight="fill" /> {eq.city}
                        {eq.district && `, ${eq.district}`}
                      </p>
                      <div className="flex items-baseline justify-between pt-3 border-t border-gray-light">
                        <span className="text-xl font-bold text-brand-dark">{formatPrice(eq.dailyPrice)}</span>
                        <span className="text-xs text-gray-muted">/ kuniga</span>
                      </div>
                      {eq.weeklyPrice && (
                        <p className="text-xs text-gray-muted mt-1">
                          Haftalik: {formatPrice(eq.weeklyPrice)}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <div className="text-center py-20">
            <Truck className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-muted mb-6">Filtrlarni o&apos;zgartiring</p>
            <Button variant="outline" onClick={clearFilters}>
              Filtrlarni tozalash
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
