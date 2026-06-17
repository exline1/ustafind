import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, CheckCircle2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { mockUstalar, categories, cities } from '../services/mockData';

export default function UstalarListPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    let result = [...mockUstalar];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q) ||
        u.skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      if (cat) result = result.filter(u => u.category === cat.name);
    }

    if (selectedCity) {
      result = result.filter(u => u.city === selectedCity);
    }

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'experience') result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);

    return result;
  }, [searchQuery, selectedCategory, selectedCity, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSortBy('rating');
    setCurrentPage(1);
  };

  const hasFilters = searchQuery || selectedCategory || selectedCity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-dark to-brand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ustalar ro'yxati</h1>
          <p className="text-white/70 mb-8 max-w-xl">
            O'zingizga kerakli ustani qidiring — kategoriya, shahar va reytingga ko'ra filtrlang
          </p>
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Usta ismi, kasbi yoki ko'nikmasi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrlar
            </button>

            <div className="hidden md:flex items-center gap-3">
              <Select
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Barcha kategoriyalar"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="!py-2.5 !w-48"
              />
              <Select
                options={cities.map(c => ({ value: c, label: c }))}
                placeholder="Barcha shaharlar"
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                className="!py-2.5 !w-44"
              />
              <Select
                options={[
                  { value: 'rating', label: 'Reyting bo\'yicha' },
                  { value: 'experience', label: 'Tajriba bo\'yicha' },
                  { value: 'reviews', label: 'Sharhlar soni' },
                ]}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="!py-2.5 !w-48"
              />
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                <X className="w-4 h-4" />
                Tozalash
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500">{filtered.length} ta usta topildi</p>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden bg-white rounded-xl p-4 mb-6 space-y-3 shadow-md border border-gray-100">
            <Select
              label="Kategoriya"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Barchasi"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            />
            <Select
              label="Shahar"
              options={cities.map(c => ({ value: c, label: c }))}
              placeholder="Barchasi"
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
            />
            <Select
              label="Saralash"
              options={[
                { value: 'rating', label: 'Reyting bo\'yicha' },
                { value: 'experience', label: 'Tajriba bo\'yicha' },
                { value: 'reviews', label: 'Sharhlar soni' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        )}

        {/* Results */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((usta) => (
              <Link key={usta.id} to={`/ustalar/${usta.id}`}>
                <Card className="group cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <Avatar name={usta.name} size="lg" />
                      {usta.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-brand-dark transition-colors truncate">{usta.name}</h3>
                      <p className="text-sm text-brand-dark font-medium">{usta.category}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {usta.city} • {usta.experience} yil tajriba
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Rating value={usta.rating} size="sm" showValue count={usta.reviewCount} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {usta.skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{skill}</span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Profilni ko'rish
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-500 mb-6">Qidiruv so'rovini yoki filtrlarni o'zgartirib ko'ring</p>
            <Button variant="outline" onClick={clearFilters}>Filtrlarni tozalash</Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
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
