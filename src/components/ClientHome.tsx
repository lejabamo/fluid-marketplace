import React, { useState } from 'react';
import { Search, Star, MapPin, Sparkles, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { ProductServiceItem, ProviderProfile, ServiceCategory } from '../types';

interface ClientHomeProps {
  providers: ProviderProfile[];
  items: ProductServiceItem[];
  currentUser: { name: string; avatar: string; address: string };
  onSelectCategory: (category: ServiceCategory) => void;
  onSearchSubmit: (query: string) => void;
  onSelectProvider: (providerId: string) => void;
}

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: string; desc: string; color: string }> = {
  productos_aseo: {
    label: 'Aseo y Cosmética',
    icon: '🧼',
    desc: 'Jabones artesanales',
    color: 'bg-[#FDE8D7] text-black group-hover:bg-primary group-hover:text-white'
  },
  artesanias: {
    label: 'Artesanías Locales',
    icon: '🏺',
    desc: 'Tejidos y cerámicas',
    color: 'bg-[#EAE0D5] text-black group-hover:bg-primary group-hover:text-white'
  },
  agro_local: {
    label: 'Agro Local',
    icon: '🌱',
    desc: 'Productos campesinos',
    color: 'bg-[#D1F6D1] text-black group-hover:bg-primary group-hover:text-white'
  },
  oficios_hogar: {
    label: 'Oficios y Reparaciones',
    icon: '🔧',
    desc: 'Servicios para el hogar',
    color: 'bg-[#EBE1D1] text-black group-hover:bg-primary group-hover:text-white'
  },
  confecciones: {
    label: 'Confecciones',
    icon: '🧵',
    desc: 'Ropa y costura local',
    color: 'bg-[#FADBB8] text-black group-hover:bg-primary group-hover:text-white'
  },
  gastronomia: {
    label: 'Gastronomía Típica',
    icon: '🥟',
    desc: 'Comida y amasijos',
    color: 'bg-[#FFD1DC] text-black group-hover:bg-primary group-hover:text-white'
  }
};

export const ClientHome: React.FC<ClientHomeProps> = ({
  providers,
  items,
  currentUser,
  onSelectCategory,
  onSearchSubmit,
  onSelectProvider
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
      title: 'Mercado Fluido Cauca',
      subtitle: 'Conectando pequeños negocios de Popayán y sus alrededores.'
    },
    {
      url: 'https://images.unsplash.com/photo-1616428456073-61b4db1ee235?q=80&w=1200&auto=format&fit=crop',
      title: 'Artesanos Misak',
      subtitle: 'Apoya la herencia cultural tejida a mano desde Silvia, Cauca.'
    },
    {
      url: 'https://images.unsplash.com/photo-1587049352847-4d4b1275eb1f?q=80&w=1200&auto=format&fit=crop',
      title: 'Agro Local de Puracé',
      subtitle: 'Alimentos frescos, cultivados con respeto por la Madre Tierra.'
    }
  ];

  // Auto-advance carousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Sift items or filters
  const filteredCategories = Object.keys(CATEGORY_META) as ServiceCategory[];

  const handleFilteredSearch = (categoryKey: ServiceCategory) => {
    onSelectCategory(categoryKey);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      onSearchSubmit(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Header Greeting section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-black font-black tracking-widest font-mono uppercase text-[11px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary border border-gray-200 inline-block animate-pulse"></span>
            USUARIO ACCEDIDO // {currentUser.name.toUpperCase()}
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9] pt-2">
            ¿CON QUÉ NECESITAS<br />
            <span className="text-primary block italic mt-1 font-black underline decoration-black decoration-4">AYUDA HOY?</span>
          </h2>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-black group-focus-within:text-primary transition-colors font-bold">
            <Search size={22} className="stroke-[3]" />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-gray-200 rounded-none py-5 pl-14 pr-32 focus:bg-white focus:shadow-sm hover:shadow-md transition-shadow transition-all text-black placeholder:text-gray-500 font-bold shadow-sm hover:shadow-md transition-shadow text-sm focus:outline-none"
            placeholder="Busca servicios de aseo, plomería, o artesanías rústicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
          />
          <button 
            onClick={() => searchQuery.trim() && onSearchSubmit(searchQuery.trim())}
            className="absolute inset-y-1.5 right-1.5 bg-primary hover:bg-black text-white px-6 font-black uppercase text-xs tracking-wider transition-colors"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* Community Carousel Block */}
      <section className="relative overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-64 md:h-80 group">
        {carouselImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={img.url}
              alt={img.title}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/eeeeee/999999?text=Imagen+Local'; }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
              <h3 className="font-headline text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-md">
                {img.title}
              </h3>
              <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed max-w-lg mt-2 drop-shadow-sm">
                {img.subtitle}
              </p>
            </div>
          </div>
        ))}
        {/* Carousel controls */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-primary' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* Special Promo Bento Block - Trueque Focus */}
      <section className="relative overflow-hidden border border-tertiary-custom bg-tertiary-container p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm min-h-[12rem] rounded-2xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="barter-badge">
            <Sparkles size={14} className="animate-spin text-white" /> ECONOMÍA COLABORATIVA
          </span>
          <h3 className="font-headline text-2xl md:text-4xl font-black text-on-tertiary-container leading-tight uppercase tracking-tighter">
            EL TRUEQUE REGRESA<br/>AL CAUCA
          </h3>
          <p className="text-on-tertiary-container/90 text-sm font-medium leading-relaxed max-w-md">
            Si no tienes liquidez, usa tus <strong>FluidPoints</strong>. Descubre vecinos dispuestos a intercambiar bienes o servicios directamente.
          </p>
        </div>

        <button 
          onClick={() => handleFilteredSearch('artesanias')} 
          className="relative z-10 mt-6 md:mt-0 px-8 py-4 bg-tertiary-custom text-white font-bold border-none rounded-full uppercase hover:bg-primary hover:-translate-y-1 transition-all shadow-lg shrink-0 flex items-center gap-2"
        >
          EXPLORAR TRUEQUES <ArrowRight size={18} />
        </button>
      </section>

      {/* 3. Category Grid - Elegant and asymmetric */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b-2 border-gray-200 pb-3">
          <h3 className="font-headline text-3xl font-black text-black uppercase tracking-tighter">
            Explorar Categorías
          </h3>
          <span className="text-xs text-primary font-black uppercase tracking-wider hover:underline cursor-pointer">
            Ver Todos los Servicios →
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredCategories.map((catKey) => {
            const meta = CATEGORY_META[catKey];
            return (
              <button
                key={catKey}
                onClick={() => handleFilteredSearch(catKey)}
                id={`cat_btn_${catKey}`}
                className="group flex flex-col items-center justify-between p-5 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow hover:shadow-sm hover:shadow-md transition-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center space-y-4 min-h-[160px] cursor-pointer"
              >
                <div className={`text-4xl p-3 border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-shadow ${meta.color} transition-all`}>
                  {meta.icon}
                </div>
                <div>
                  <span className="font-headline text-xs font-black uppercase tracking-tight text-black block">
                    {meta.label}
                  </span>
                  <p className="text-[10px] uppercase font-bold text-gray-500 leading-tight mt-1 line-clamp-1">
                    {meta.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Highly Rated Verified Providers Near you */}
      <section className="mt-8 px-6 py-10 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-8">
        <div className="flex flex-col space-y-2 border-b-2 border-dashed border-gray-300 pb-4">
          <span className="font-mono text-primary text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-primary stroke-[2.5]" /> OFERENTES VERIFICADOS // CONFIRMADO
          </span>
          <h3 className="font-headline text-3xl font-black text-black uppercase tracking-tighter">
            Profesionales Mejor Calificados
          </h3>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {providers.map((p) => {
            const provItems = items.filter(i => i.providerId === p.id);
            const isCrafts = p.id === 'prov_carmen';

            return (
              <div
                key={p.id}
                id={`prov_card_${p.id}`}
                className="min-w-[280px] md:min-w-[320px] snap-start bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:-translate-x-1 transition-all space-y-4 group"
              >
                <div className="relative h-44 rounded-none border border-gray-200 overflow-hidden bg-gray-100">
                  <img
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={p.avatar}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/eeeeee/999999?text=Avatar'; }}
                  />
                  <div className="absolute top-3 right-3 bg-white border border-gray-200 px-2 py-1 flex items-center gap-1 text-xs font-black text-black shadow-sm hover:shadow-md transition-shadow">
                    <Star size={12} className="text-primary fill-[#FF4D00]" />
                    <span>{p.rating.toFixed(1)}</span>
                  </div>
                  {isCrafts && (
                    <div className="absolute bottom-3 left-3 bg-primary text-white border border-gray-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                      Artesana Local
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-headline font-black text-lg text-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-primary font-black tracking-wide uppercase">{p.specialty.toUpperCase()}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                    <MapPin size={11} className="text-black" /> {p.location.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {p.skills.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="bg-gray-100 text-black border border-gray-200 text-[9px] font-bold uppercase py-0.5 px-2">
                      {s.toUpperCase()}
                    </span>
                  ))}
                  {provItems.length > 0 && (
                    <span className="bg-[#E1D1F6] text-black border border-gray-200 text-[9px] font-bold uppercase py-0.5 px-2 flex items-center gap-1">
                      <ShoppingBag size={10} /> {provItems.length} {isCrafts ? 'artículos' : 'ofertas'}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-gray-200">
                  <span className="font-mono font-black text-[10px] text-gray-500 uppercase">
                    {isCrafts ? 'Catálogo único' : 'Tarifa base'}
                  </span>
                  <button
                    onClick={() => onSelectProvider(p.id)}
                    className="px-4 py-2 bg-secondary-custom text-white hover:bg-primary border border-gray-200 text-xs font-black uppercase tracking-widest hover:text-white transition-all transform active:scale-95 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

