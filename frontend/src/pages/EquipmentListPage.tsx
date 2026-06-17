import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Truck, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { mockEquipment, cities, formatPrice } from '../services/mockData';

const equipCategories = [
  { value: 'Qazish texnikasi', label: 'Qazish texnikasi' },
  { value: 'Beton uskunalari', label: 'Beton uskunalari' },
  { value: "Ko'tarish texnikasi", label: "Ko'tarish texnikasi" },
  { value: 'Energetik uskunalar', label: 'Energetik uskunalar' },
  { value: 'Qurilish asboblari', label: 'Qurilish asboblari' },
  { value: 'Payvandlash uskunalari', label: 'Payvandlash uskunalari' },
];

export default function EquipmentListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filtered = useMemo(() => {
    let result = [...mockEquipment];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter(e => e.category === selectedCategory);
    if (selectedCity) result = result.filter(e => e.city === selectedCity);
    return result;
  }, [searchQuery, selectedCategory, selectedCity]);

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(''); setSelectedCity(''); };
  const hasFilters = searchQuery || selectedCategory || selectedCity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-dark to-brand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Texnika arendasi</h1>
          <p className="text-white/70 mb-8 max-w-xl">
            Qurilish texnikasi va jihozlarini qulay narxlarda arendaga oling
          </p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Texnika nomi yoki turi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Select
              options={equipCategories}
              placeholder="Barcha turlar"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="!py-2.5 !w-48"
            />
            <Select
              options={cities.map(c => ({ value: c, label: c }))}
              placeholder="Barcha shaharlar"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="!py-2.5 !w-44"
            />
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <X className="w-4 h-4" /> Tozalash
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">{filtered.length} ta e'lon</p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((eq) => (
              <Link key={eq.id} to={`/texnika/${eq.id}`}>
                <Card className="group cursor-pointer h-full">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl mb-4 flex items-center justify-center">
                    <Truck className="w-16 h-16 text-gray-300 group-hover:text-brand transition-colors duration-300" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-brand-light/15 text-brand-dark px-2 py-1 rounded-lg font-medium">{eq.category}</span>
                    {eq.available && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">Mavjud</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-dark transition-colors">{eq.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {eq.city}{eq.district && `, ${eq.district}`}
                  </p>
                  <div className="flex items-baseline justify-between pt-3 border-t border-gray-100">
                    <span className="text-xl font-bold text-brand-dark">{formatPrice(eq.dailyPrice)}</span>
                    <span className="text-xs text-gray-400">/ kuniga</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-500 mb-6">Filtrlarni o'zgartiring</p>
            <Button variant="outline" onClick={clearFilters}>Filtrlarni tozalash</Button>
          </div>
        )}
      </div>
    </div>
  );
}
