import React, { useState } from 'react';
import { Search, Star, MapPin, Sparkles, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { ProductServiceItem, ProviderProfile, ServiceCategory } from '../types';

interface ClientHomeProps {
  providers: ProviderProfile[];
  items: ProductServiceItem[];
  currentUser: { name: string; avatar: string; address: string };
  onSelectCategory: (category: ServiceCategory) => void;
  onSelectProvider: (providerId: string) => void;
}

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: string; desc: string; color: string }> = {
  aseo: {
    label: 'Aseo Hogar',
    icon: '🧹',
    desc: 'Limpieza profunda, lavandería',
    color: 'bg-[#D1E8E2] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  },
  jardinera: {
    label: 'Jardinería',
    icon: '🏡',
    desc: 'Pasto, desmalezado y paisaje',
    color: 'bg-[#F9E2AF] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  },
  plomeria: {
    label: 'Plomería',
    icon: '🔧',
    desc: 'Reparaciones y fugas de agua',
    color: 'bg-[#E1D1F6] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  },
  artesanias: {
    label: 'Artesanías',
    icon: '🏺',
    desc: 'Cerámica, bolsos y arte textil',
    color: 'bg-[#FFD1DC] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  },
  electricista: {
    label: 'Electricista',
    icon: '⚡',
    desc: 'Cortocircuitos, cableado y luz',
    color: 'bg-[#D1F6D1] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  },
  lavado_carros: {
    label: 'Lavado Carros',
    icon: '🚗',
    desc: 'Detallado ecológico a domicilio',
    color: 'bg-[#D1F1F6] text-black group-hover:bg-[#FF4D00] group-hover:text-white'
  }
};

export const ClientHome: React.FC<ClientHomeProps> = ({
  providers,
  items,
  currentUser,
  onSelectCategory,
  onSelectProvider
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sift items or filters
  const filteredCategories = Object.keys(CATEGORY_META) as ServiceCategory[];

  const handleFilteredSearch = (categoryKey: ServiceCategory) => {
    onSelectCategory(categoryKey);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Header Greeting section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-black font-black tracking-widest font-mono uppercase text-[11px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF4D00] border border-black inline-block animate-pulse"></span>
            USUARIO ACCEDIDO // {currentUser.name.toUpperCase()}
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9] pt-2">
            ¿CON QUÉ NECESITAS<br />
            <span className="text-[#FF4D00] block italic mt-1 font-black underline decoration-black decoration-4">AYUDA HOY?</span>
          </h2>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-black group-focus-within:text-[#FF4D00] transition-colors font-bold">
            <Search size={22} className="stroke-[3]" />
          </div>
          <input
            type="text"
            className="w-full bg-white border-2 border-black rounded-none py-5 pl-14 pr-6 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black placeholder:text-gray-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm focus:outline-none"
            placeholder="Busca servicios de aseo, plomería, o artesanías rústicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* 2. Special Promo Bento Block */}
      <section className="relative overflow-hidden border-4 border-black bg-[#FF4D00] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[16rem]">
        <div className="absolute inset-0 z-0">
          <img
            alt="Interior"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
          />
        </div>
        
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="bg-black text-white px-3 py-1 border border-white font-mono text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <Sparkles size={11} className="animate-spin text-[#FF4D00]" /> CUPO EXCLUSIVO
          </span>
          <h3 className="font-headline text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tighter">
            25% DCTO EN TU PRIMER SERVICIO
          </h3>
          <p className="text-white text-xs font-bold leading-relaxed max-w-md">
            Aplica hoy en Aseo, Jardinería o Plomería seleccionando artesanos u oferentes recomendados en la sección.
          </p>
        </div>

        <button 
          onClick={() => handleFilteredSearch('aseo')} 
          className="relative z-10 mt-6 md:mt-0 px-6 py-4 bg-white text-black font-black border-2 border-black tracking-widest text-xs uppercase hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0"
        >
          RECLAMAR PROMO →
        </button>
      </section>

      {/* 3. Category Grid - Elegant and asymmetric */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b-2 border-black pb-3">
          <h3 className="font-headline text-3xl font-black text-black uppercase tracking-tighter">
            Explorar Categorías
          </h3>
          <span className="text-xs text-[#FF4D00] font-black uppercase tracking-wider hover:underline cursor-pointer">
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
                className="group flex flex-col items-center justify-between p-5 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center space-y-4 min-h-[160px] cursor-pointer"
              >
                <div className={`text-4xl p-3 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${meta.color} transition-all`}>
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
      <section className="mt-8 px-6 py-10 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-8">
        <div className="flex flex-col space-y-2 border-b-2 border-dashed border-gray-300 pb-4">
          <span className="font-mono text-[#FF4D00] text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#FF4D00] stroke-[2.5]" /> OFERENTES VERIFICADOS // CONFIRMADO
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
                className="min-w-[280px] md:min-w-[320px] snap-start bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all space-y-4 group"
              >
                <div className="relative h-44 rounded-none border-2 border-black overflow-hidden bg-gray-100">
                  <img
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={p.avatar}
                  />
                  <div className="absolute top-3 right-3 bg-white border-2 border-black px-2 py-1 flex items-center gap-1 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Star size={12} className="text-[#FF4D00] fill-[#FF4D00]" />
                    <span>{p.rating.toFixed(1)}</span>
                  </div>
                  {isCrafts && (
                    <div className="absolute bottom-3 left-3 bg-[#FF4D00] text-white border border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                      Artesana Local
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-headline font-black text-lg text-black uppercase tracking-tight group-hover:text-[#FF4D00] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#FF4D00] font-black tracking-wide uppercase">{p.specialty.toUpperCase()}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                    <MapPin size={11} className="text-black" /> {p.location.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {p.skills.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="bg-gray-100 text-black border border-black text-[9px] font-bold uppercase py-0.5 px-2">
                      {s.toUpperCase()}
                    </span>
                  ))}
                  {provItems.length > 0 && (
                    <span className="bg-[#E1D1F6] text-black border border-black text-[9px] font-bold uppercase py-0.5 px-2 flex items-center gap-1">
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
                    className="px-4 py-2 bg-black text-white hover:bg-[#FF4D00] border-2 border-black text-xs font-black uppercase tracking-widest hover:text-white transition-all transform active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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

