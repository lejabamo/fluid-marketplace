import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Calendar, Clock, Sparkles, Plus, 
  Send, ShieldAlert, ShoppingBag, CheckCircle, PackageOpen, Scale 
} from 'lucide-react';
import { ProductServiceItem, ProviderProfile, ServiceCategory, UserRequest, Appointment } from '../types';

interface ServiceExplorerProps {
  category: ServiceCategory | 'all';
  initialSearchQuery?: string;
  items: ProductServiceItem[];
  providers: ProviderProfile[];
  onBack: () => void;
  onSelectProvider: (providerId: string) => void;
  onBroadcastRequest: (request: Omit<UserRequest, 'id' | 'status'>) => void;
  onPurchaseItem: (itemId: string, qty: number) => { success: boolean; message: string };
}

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: string; bannerDesc: string; bannerImg: string; estimateRange: string }> = {
  productos_aseo: {
    label: 'Aseo y Cosmética Ecológica',
    icon: '🧼',
    bannerDesc: 'Jabones artesanales, útiles de aseo biodegradables y cosmética local del Cauca.',
    bannerImg: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$10.000 - $50.000 COP'
  },
  artesanias: {
    label: 'Artesanías Locales',
    icon: '🏺',
    bannerDesc: 'Tejidos Misak, sombreros y manualidades con identidad regional.',
    bannerImg: 'https://images.unsplash.com/photo-1616428456073-61b4db1ee235?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$40.000 - $150.000 COP'
  },
  agro_local: {
    label: 'Agro Local y Campesino',
    icon: '🌱',
    bannerDesc: 'Frutas, verduras orgánicas y miel pura directamente desde las veredas.',
    bannerImg: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$10.000 - $80.000 COP'
  },
  oficios_hogar: {
    label: 'Oficios y Reparaciones',
    icon: '🔧',
    bannerDesc: 'Servicios de plomería, electricidad y reparaciones locativas.',
    bannerImg: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$30.000 - $100.000 COP / servicio'
  },
  confecciones: {
    label: 'Ropa y Confecciones',
    icon: '🧵',
    bannerDesc: 'Diseño, arreglos de ropa y prendas únicas hechas por costureras locales.',
    bannerImg: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$20.000 - $90.000 COP'
  },
  gastronomia: {
    label: 'Gastronomía Típica',
    icon: '🥟',
    bannerDesc: 'Empanadas, tamales de pipián, dulces típicos y amasijos tradicionales.',
    bannerImg: 'https://images.unsplash.com/photo-1626074961564-9eb41094f997?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$15.000 - $60.000 COP'
  }
};

export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({
  category,
  initialSearchQuery = '',
  items,
  providers,
  onBack,
  onSelectProvider,
  onBroadcastRequest,
  onPurchaseItem
}) => {
  const meta = category === 'all' ? {
    label: 'Mercado General',
    icon: '🌐',
    bannerDesc: 'Explora todos los productos y servicios disponibles, sin filtros.',
    bannerImg: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
    estimateRange: 'Varios Precios'
  } : CATEGORY_META[category];

  const [activeTab, setActiveTab] = useState<'listings' | 'broadcast'>('listings');
  const [selectedItem, setSelectedItem] = useState<ProductServiceItem | null>(null);
  
  // Broadcast Bid Form State
  const [address, setAddress] = useState('Paseo de la Reforma 250, CDMX');
  const [date, setDate] = useState('Junio 5, 2026');
  const [time, setTime] = useState('10:00 AM');
  const [details, setDetails] = useState('');
  const [priceOffer, setPriceOffer] = useState(50);
  const [isBarterProposal, setIsBarterProposal] = useState(false);
  const [barterOfferDescription, setBarterOfferDescription] = useState('');
  const [barterEstimatedValue, setBarterEstimatedValue] = useState(50);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Direct Item Barter State
  const [showDirectBarter, setShowDirectBarter] = useState(false);
  const [directBarterDesc, setDirectBarterDesc] = useState('');
  const [directBarterValue, setDirectBarterValue] = useState(0);

  // Buy feedback message state
  const [purchaseFeedback, setPurchaseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Local Search state
  const [localSearch, setLocalSearch] = useState(initialSearchQuery);

  // Filter listings by category and search
  const categoryItems = (category === 'all' ? items : items.filter(item => item.category === category))
    .filter(item => 
      !localSearch || 
      item.name.toLowerCase().includes(localSearch.toLowerCase()) || 
      item.description.toLowerCase().includes(localSearch.toLowerCase())
    );

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastRequest({
      category,
      address,
      date,
      time,
      details: details || `Solicitud para ${meta.label} a domicilio.`,
      priceOffer: isBarterProposal ? 0 : priceOffer,
      isBarterProposal,
      barterOfferDescription,
      barterEstimatedValue: isBarterProposal ? barterEstimatedValue : undefined
    });
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setActiveTab('listings');
    }, 2500);
  };

  const handleDirectBarterSubmit = () => {
    if (!selectedItem) return;
    onBroadcastRequest({
      category: selectedItem.category,
      address,
      date,
      time,
      details: `Propuesta de trueque para: ${selectedItem.name}`,
      priceOffer: 0,
      isBarterProposal: true,
      barterOfferDescription: directBarterDesc,
      barterEstimatedValue: directBarterValue,
      targetItemId: selectedItem.id,
      targetItemName: selectedItem.name,
      providerId: selectedItem.providerId
    });
    setPurchaseFeedback({ type: 'success', message: 'Oferta de trueque enviada al oferente.' });
    setShowDirectBarter(false);
    setDirectBarterDesc('');
    
    setTimeout(() => {
      setPurchaseFeedback(null);
      setSelectedItem(null);
    }, 3000);
  };

  const handleItemPurchase = (itemId: string) => {
    const result = onPurchaseItem(itemId, 1);
    if (result.success) {
      setPurchaseFeedback({ type: 'success', message: result.message });
      // Update local item view stock state
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(prev => prev ? { ...prev, stock: prev.stock - 1 } : null);
      }
    } else {
      setPurchaseFeedback({ type: 'error', message: result.message });
    }
    
    setTimeout(() => {
      setPurchaseFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white text-primary border border-gray-200 hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm hover:shadow-md transition-shadow active:translate-y-0.5"
        >
          <ArrowLeft size={18} className="stroke-[2.5]" />
        </button>
        <div>
          <span className="text-gray-500 font-mono text-[10px] uppercase font-black tracking-widest block">FLUID MARKETPLACE // RUTA</span>
          <h2 className="font-headline text-2xl font-black text-black uppercase tracking-tighter">{meta.label}</h2>
        </div>
      </div>

      {/* Hero Category Banner */}
      <section className="relative overflow-hidden border border-gray-200 h-48 bg-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-end p-6">
        <img 
          alt={meta.label}
          className="w-full h-full object-cover absolute inset-0 z-0 opacity-60"
          src={meta.bannerImg}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0 opacity-80"></div>
        <div className="relative z-10 space-y-2 text-white">
          <div className="bg-primary text-white border border-white px-3 py-1 text-[10px] font-black uppercase tracking-wider inline-block">
            RANGO ESTIMADO: {meta.estimateRange.toUpperCase()}
          </div>
          <p className="text-xs text-white/90 max-w-xl font-bold uppercase tracking-tight font-sans leading-relaxed">
            {meta.bannerDesc}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex bg-white p-1 border border-gray-200 gap-1 shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => { setActiveTab('listings'); setSelectedItem(null); setShowDirectBarter(false); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'listings' 
              ? 'bg-primary text-white shadow-none border border-gray-200' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          {category === 'all' ? 'Explorar Todo el Catálogo' : (category === 'artesanias' ? '🏺 Catálogo de Productos' : '⚡ Ofertas de Servicios')}
        </button>
        <button
          onClick={() => { setActiveTab('broadcast'); setSelectedItem(null); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'broadcast' 
              ? 'bg-primary text-white shadow-none border border-gray-200' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          {category === 'all' ? '📡 Licitación Abierta' : '📡 Licitación Directa (Pide tu Precio)'}
        </button>
      </div>

      {/* Local Search input */}
      {activeTab === 'listings' && !selectedItem && (
        <div className="bg-white border border-gray-200 p-2 shadow-sm hover:shadow-md transition-shadow mb-4">
          <input 
            type="text"
            className="w-full bg-gray-50 border border-gray-200 p-3 text-xs font-bold outline-none uppercase placeholder:text-gray-400 focus:bg-white focus:border-primary"
            placeholder="Filtrar catálogo..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      )}

      {/* CONTENT LISTINGS TAB */}
      {activeTab === 'listings' && !selectedItem && (
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="font-headline font-black text-xl text-black uppercase tracking-tighter">
              {category === 'all' ? 'Todos los Productos y Servicios' : (category === 'artesanias' ? 'Mercancías Disponibles' : 'Servicios Registrados')}
            </h3>
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">
              {categoryItems.length} {categoryItems.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {categoryItems.length === 0 ? (
            <div className="bg-white p-8 border border-gray-200 border-dashed text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <PackageOpen className="mx-auto text-black" size={48} />
              <div>
                <p className="font-black text-gray-800 uppercase text-sm">NO HAY OFERTAS REGISTRADAS EN LA HOJA</p>
                <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                  El almacén está vacío para este filamento. Te invitamos a utilizar el sistema de licitación interactiva para emitir un precio sugerido de inmediato.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryItems.map((item) => {
                const prov = providers.find(p => p.id === item.providerId);
                const isOutOfStock = !item.isService && item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    id={`item_card_${item.id}`}
                    className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-gray-50 border-b-2 border-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-white border border-gray-200 px-2.5 py-1 text-xs font-black text-black shadow-sm hover:shadow-md transition-shadow">
                        ${item.price} <span className="text-[10px] font-bold text-gray-500">/ {item.priceUnit.toUpperCase()}</span>
                      </div>
                      
                      {/* Inventory stock badge */}
                      <div className={`absolute top-3 right-3 border border-gray-200 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full ${
                        item.isService 
                          ? 'bg-[#E1D1F6] text-black' 
                          : isOutOfStock 
                            ? 'bg-red-500 text-white'
                            : 'bg-[#D1F6D1] text-black'
                      }`}>
                        {item.isService 
                          ? 'SERVICIO TÉCNICO' 
                          : isOutOfStock 
                            ? 'AGOTADO' 
                            : `STOCK: ${item.stock} UNIDADES`}
                      </div>
                      
                      {item.acceptsBarter && (
                        <div className="absolute top-10 right-3 barter-badge text-[9px]">
                          🤝 ACEPTA TRUEQUE
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-gray-400 font-mono tracking-widest block uppercase">// ID: {item.id.toUpperCase()}</span>
                        <h4 className="font-headline font-black text-lg text-black uppercase tracking-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {prov && (
                        <div 
                          onClick={() => onSelectProvider(prov.id)}
                          className="flex items-center gap-2 p-2 border border-gray-200 bg-gray-100 hover:bg-primary/10 cursor-pointer transition-colors"
                        >
                          <img 
                            src={prov.avatar} 
                            alt={prov.name} 
                            className="w-8 h-8 border border-gray-200 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-black truncate uppercase">{prov.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight flex items-center gap-0.5">
                              <Star size={9} className="fill-[#FF4D00] text-primary" /> {prov.rating.toFixed(1)} RESEÑAS
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="flex-1 bg-white hover:bg-gray-100 text-black border border-gray-200 py-3 text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-shadow cursor-pointer active:translate-y-0.5"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => {
                            if (item.isService) {
                              setSelectedItem(item);
                            } else {
                              handleItemPurchase(item.id);
                            }
                          }}
                          disabled={!item.isService && isOutOfStock}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:translate-y-0.5 ${
                            !item.isService && isOutOfStock
                              ? 'bg-gray-200 text-gray-400 border-dashed cursor-not-allowed shadow-none'
                              : 'bg-primary text-white hover:bg-[#E24400]'
                          }`}
                        >
                          {item.isService ? 'Agendar Cita' : 'Comprar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* DETAIL VIEW FOR INDIVIDUAL ITEM */}
      {activeTab === 'listings' && selectedItem && (
        <section className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <button 
            onClick={() => { setSelectedItem(null); setShowDirectBarter(false); }}
            className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
          >
            ← Volver al catálogo
          </button>

          {purchaseFeedback && (
            <div className={`p-4 border border-gray-200 flex items-center gap-2 text-xs font-bold ${
              purchaseFeedback.type === 'success' ? 'bg-[#D1F6D1] text-black shadow-sm hover:shadow-md transition-shadow' : 'bg-red-100 text-black'
            }`}>
              <CheckCircle size={16} />
              <span className="uppercase">{purchaseFeedback.message.toUpperCase()}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 border border-gray-200 overflow-hidden bg-gray-50">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="bg-[#E1D1F6] text-black border border-gray-200 px-3 py-1 text-[9px] font-black uppercase tracking-wider">
                  {selectedItem.isService ? 'SERVICIO A DOMICILIO' : 'MERCANCÍA FÍSICA'}
                </span>
                <h3 className="font-headline text-2xl font-black text-black uppercase tracking-tighter pt-1">
                  {selectedItem.name}
                </h3>
                <p className="text-3xl font-black text-primary font-headline mt-1">
                  ${selectedItem.price} <span className="text-xs font-bold text-gray-500">/ {selectedItem.priceUnit.toUpperCase()}</span>
                </p>
              </div>

              <blockquote className="text-xs text-black uppercase tracking-tight leading-relaxed bg-gray-100 border-l-4 border-gray-200 p-4 font-bold rounded-r-lg">
                {selectedItem.description}
              </blockquote>

              {selectedItem.acceptsBarter && (
                <div className="bg-tertiary-container text-on-tertiary-container p-4 rounded-xl space-y-2 border border-tertiary-custom">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase">
                    <Sparkles size={14} className="text-tertiary-custom" />
                    DISPUESTO A TRUEQUE
                  </div>
                  <div className="flex justify-between items-center border-b border-tertiary-custom/30 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-tertiary-custom">Valor Base de Intercambio:</span>
                    <span className="text-sm font-black bg-white px-2 py-0.5 rounded shadow-sm">
                      {selectedItem.estimatedBarterValue || selectedItem.price} FluidPoints
                    </span>
                  </div>
                  <p className="text-[11px] font-medium pt-1">Busca intercambiar por: <strong>{selectedItem.barterPreferences || 'Abierto a propuestas de igual valor.'}</strong></p>
                </div>
              )}

              {!selectedItem.isService && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Unidades Físicas:</span>
                  <span className={`font-black border border-gray-200 px-2 py-1 text-[10px] uppercase ${selectedItem.stock <= 0 ? 'bg-red-500 text-white' : 'bg-[#D1F6D1] text-black'}`}>
                    {selectedItem.stock <= 0 ? 'AGOTADO EN TIENDA' : `STOCK: ${selectedItem.stock} DISPONIBLES`}
                  </span>
                </div>
              )}

              {/* Action buttons inside details */}
              <div className="pt-2 space-y-2">
                {showDirectBarter ? (
                  <div className="bg-tertiary-container/30 border border-tertiary-custom p-5 space-y-4 rounded-xl animate-fade-in">
                    <h4 className="font-headline font-black text-sm uppercase text-tertiary-custom flex items-center gap-2">
                      <Sparkles size={16} /> TU PROPUESTA DE TRUEQUE
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">¿Qué ofreces a cambio?</label>
                      <textarea 
                        className="w-full bg-white border border-tertiary-custom/50 rounded-lg p-3 text-xs outline-none focus:border-tertiary-custom"
                        rows={3}
                        placeholder="Describe tu producto/servicio..."
                        value={directBarterDesc}
                        onChange={(e) => setDirectBarterDesc(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Valor Estimado de tu oferta (FluidPoints)</label>
                      <input 
                        type="number"
                        className="w-full bg-white border border-tertiary-custom/50 rounded-lg p-3 text-sm font-bold outline-none focus:border-tertiary-custom"
                        value={directBarterValue}
                        onChange={(e) => setDirectBarterValue(Number(e.target.value))}
                      />
                      </div>
                    </div>
                    
                    {/* BALANZA DE TRUEQUE */}
                    {(() => {
                      const targetVal = selectedItem.estimatedBarterValue || selectedItem.price || 1;
                      const diff = directBarterValue - targetVal;
                      const tiltDeg = Math.min(Math.max(((targetVal - directBarterValue) / targetVal) * 30, -30), 30);
                      return (
                        <div className="bg-white p-4 rounded-xl border border-tertiary-custom/30 shadow-inner my-4">
                          <div className="flex justify-between items-end mb-4 relative">
                            {/* Base stand of the scale */}
                            <div className="absolute left-1/2 bottom-0 w-1 h-6 bg-gray-300 -translate-x-1/2 translate-y-6"></div>
                            <div className="absolute left-1/2 bottom-0 w-8 h-1 bg-gray-300 -translate-x-1/2 translate-y-6 rounded-t-sm"></div>
                            
                            <div className="text-center w-1/3">
                              <span className="text-[10px] font-black uppercase text-gray-500 block">Tu Oferta</span>
                              <span className="text-lg font-black text-tertiary-custom">{directBarterValue} FP</span>
                            </div>
                            <div className="text-center w-1/3 flex flex-col items-center relative z-10">
                              <div className="bg-white rounded-full p-1 shadow-sm">
                                <Scale size={32} className="text-tertiary-custom transition-transform duration-500" style={{ transform: `rotate(${tiltDeg}deg)` }} />
                              </div>
                              <span className="text-[9px] font-bold uppercase mt-3 text-gray-400">Balanza</span>
                            </div>
                            <div className="text-center w-1/3">
                              <span className="text-[10px] font-black uppercase text-gray-500 block">Solicitado</span>
                              <span className="text-lg font-black text-black">{targetVal} FP</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-2">
                            {directBarterValue === 0 ? (
                              <p className="text-[10px] text-center font-bold text-gray-500 uppercase">Ingresa el valor para equilibrar la balanza.</p>
                            ) : Math.abs(diff) <= (targetVal * 0.1) ? (
                              <p className="text-[10px] text-center font-black text-[#10B981] bg-[#D1F6D1] py-1 rounded uppercase">¡Trato Equitativo! Perfecto para trueque.</p>
                            ) : diff < 0 ? (
                              <p className="text-[10px] text-center font-black text-orange-500 bg-orange-50 py-1 rounded uppercase">Tu oferta es menor. Considera agregar {Math.abs(diff)} FP.</p>
                            ) : (
                              <p className="text-[10px] text-center font-black text-blue-500 bg-blue-50 py-1 rounded uppercase">Tu oferta es generosa (+{diff} FP).</p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setShowDirectBarter(false)}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-wider border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition-colors rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleDirectBarterSubmit}
                        disabled={!directBarterDesc}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-wider border border-transparent bg-tertiary-custom text-white hover:bg-primary transition-colors rounded-lg disabled:opacity-50"
                      >
                        Enviar Oferta
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedItem.isService ? (
                      <div className="bg-gray-100 border border-gray-200 p-4 space-y-4 rounded-xl">
                        <h4 className="text-xs font-black text-black flex items-center gap-1.5 uppercase font-mono">
                          <Calendar size={14} /> Seleccionar Bloque Técnico
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-3 border border-gray-200 text-center text-xs text-black cursor-pointer hover:bg-primary hover:text-white transition-colors rounded-lg">
                            <p className="font-black uppercase">Mañana</p>
                            <p className="text-[10px] font-bold">10:00 AM</p>
                          </div>
                          <div className="bg-white p-3 border border-gray-200 text-center text-xs text-black cursor-pointer hover:bg-primary hover:text-white transition-colors rounded-lg">
                            <p className="font-black uppercase">Tarde</p>
                            <p className="text-[10px] font-bold">03:00 PM</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            alert(`¡Turno solicitado de forma exitosa!\nServicio: ${selectedItem.name.toUpperCase()}\nLa agenda se ha transferido.`);
                            setSelectedItem(null);
                          }}
                          className="w-full bg-secondary-custom text-white hover:bg-primary py-4 border border-gray-200 text-xs font-black uppercase tracking-widest cursor-pointer shadow-sm hover:shadow-md transition-shadow active:translate-y-0.5 rounded-lg"
                        >
                          Solicitar este Turno (Pago en Dinero)
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleItemPurchase(selectedItem.id)}
                        disabled={selectedItem.stock <= 0}
                        className={`w-full py-4 text-xs font-black uppercase tracking-widest border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:translate-y-0.5 transition-all rounded-lg ${
                          selectedItem.stock <= 0 
                            ? 'bg-gray-200 text-gray-400 border-dashed cursor-not-allowed shadow-none'
                            : 'bg-black text-white hover:bg-primary'
                        }`}
                      >
                        {selectedItem.stock <= 0 ? 'Agotado en Almacén' : 'Comprar Directamente'}
                      </button>
                    )}
                    
                    {selectedItem.acceptsBarter && (
                      <button 
                        onClick={() => setShowDirectBarter(true)}
                        className="w-full mt-2 py-4 text-xs font-black uppercase tracking-widest border border-tertiary-custom bg-tertiary-container text-tertiary-custom hover:bg-tertiary-custom hover:text-white shadow-sm hover:shadow-md transition-all active:translate-y-0.5 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} /> Proponer Trueque Directo
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DISPATCH/BROADCAST REQUESTS FORM - INDRIVER BIDDING MODE */}
      {activeTab === 'broadcast' && (
        <section className="space-y-6">
          <div className="bg-secondary-custom text-white p-6 border border-gray-200 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-headline text-lg font-black uppercase tracking-tight text-white">
              Sistema de Licencias y Ofertas Activas
            </h3>
            <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed text-left">
              Fija tu precio. Los oferentes técnicos de la área revisarán tu propuesta y podrán aceptar o contraofertar en vivo.
            </p>
          </div>

          {broadcastSuccess ? (
            <div className="bg-[#D1F6D1] text-black p-8 border border-gray-200 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl block">📡</span>
              <h4 className="font-headline font-black text-lg uppercase tracking-tight">¡Licitación Transmitida con Éxito!</h4>
              <p className="text-xs max-w-sm mx-auto font-bold uppercase">
                Propuesta de <strong>${priceOffer}</strong> transmitida a la terminal. Simula la respuesta cambiando el rol a Oferente (Admin) arriba.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-6">
              
              {/* Address input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest block font-mono ml-1">DIRECCIÓN DEL SERVICIO / DESTINO</label>
                <div className="flex items-center gap-3 bg-gray-100 p-4 border border-gray-200">
                  <MapPin size={18} className="text-black stroke-[2.5]" />
                  <input 
                    type="text" 
                    className="bg-transparent border-none p-0 outline-none w-full text-sm font-bold placeholder:text-gray-400"
                    placeholder="Escribe calle, condominio, interior"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Date and Time selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-black uppercase tracking-widest block font-mono ml-1">FECHA REQUERIDA</label>
                  <div className="flex items-center gap-3 bg-gray-100 p-4 border border-gray-200">
                    <Calendar size={16} className="text-black" />
                    <input 
                      type="text"
                      className="bg-transparent border-none p-0 outline-none w-full text-xs font-bold"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-black uppercase tracking-widest block font-mono ml-1">HORA REQUERIDA</label>
                  <div className="flex items-center gap-3 bg-gray-100 p-4 border border-gray-200">
                    <Clock size={16} className="text-black" />
                    <input 
                      type="text"
                      className="bg-transparent border-none p-0 outline-none w-full text-xs font-bold"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest block font-mono ml-1">DETALLES DEL TRABAJO</label>
                <textarea 
                  className="bg-gray-100 border border-gray-200 p-4 w-full text-xs h-24 outline-none resize-none font-bold uppercase placeholder:text-gray-400"
                  placeholder="Detalla qué necesitas exactamente..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              {/* Slider BIDDING (Similar to indriver screenshot 1) */}
              <div className="bg-gray-100 border border-gray-200 p-5 space-y-4 rounded-xl">
                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 mb-2">
                  <span className="text-xs font-bold uppercase ml-2 text-gray-600">Modalidad de Pago</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setIsBarterProposal(false)} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-colors ${!isBarterProposal ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>Dinero</button>
                    <button type="button" onClick={() => setIsBarterProposal(true)} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-colors ${isBarterProposal ? 'bg-tertiary-custom text-white' : 'bg-gray-100 text-gray-500'}`}>Trueque</button>
                  </div>
                </div>

                {!isBarterProposal ? (
                  <>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="font-headline font-black text-[11px] uppercase tracking-wider block text-primary">TU OFERTA DIRECTA DE PAGO</span>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Precio propuesto para motivar aceptación rápida</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-gray-500 block uppercase tracking-widest">ESTIMADO</span>
                        <span className="text-sm font-black text-black bg-white border border-gray-200 px-2 py-0.5 shadow-sm rounded-md">{meta.estimateRange}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
                      <span className="text-3xl font-black text-primary">$</span>
                      <input 
                        type="number"
                        className="text-4xl font-extrabold text-black bg-transparent border-none p-0 outline-none focus:ring-0 w-full"
                        value={priceOffer}
                        onChange={(e) => setPriceOffer(Number(e.target.value))}
                      />
                    </div>

                    {/* Addition Quick Tags */}
                    <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar">
                      {[5, 10, 20].map(val => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setPriceOffer(prev => prev + val)}
                          className="whitespace-nowrap bg-white text-black font-bold border border-gray-200 rounded-full px-4 py-2 text-xs hover:bg-primary hover:text-white transition-colors shadow-sm"
                        >
                          + ${val}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1">
                      <span className="font-headline font-black text-[11px] uppercase tracking-wider block text-tertiary-custom">QUÉ OFRECES A CAMBIO</span>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Describe tu producto o servicio para el intercambio</p>
                    </div>
                    <textarea 
                      className="bg-white border border-tertiary-custom p-4 w-full text-xs h-24 outline-none resize-none font-bold placeholder:text-gray-400 rounded-xl focus:shadow-[0_0_0_3px_rgba(16,185,129,0.2)] transition-shadow"
                      placeholder="Ej. Ofrezco 3 horas de diseño gráfico, o 5 frascos de miel orgánica casera..."
                      value={barterOfferDescription}
                      onChange={(e) => setBarterOfferDescription(e.target.value)}
                      required={isBarterProposal}
                    />
                    <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
                      <span className="font-headline font-black text-[11px] uppercase tracking-wider block text-tertiary-custom">VALOR ESTIMADO (FLUID POINTS)</span>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Sistema de medidas: Puntos sugeridos para igualar el valor</p>
                      <div className="flex items-center gap-4 bg-white p-3 border border-gray-200 shadow-sm rounded-xl">
                        <span className="text-xl font-black text-tertiary-custom">FP</span>
                        <input 
                          type="number"
                          className="text-2xl font-extrabold text-black bg-transparent border-none p-0 outline-none focus:ring-0 w-full"
                          value={barterEstimatedValue}
                          onChange={(e) => setBarterEstimatedValue(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Broadcast button */}
              <button
                type="submit"
                className="w-full bg-black hover:bg-primary text-white font-black py-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest cursor-pointer active:translate-y-0.5"
              >
                <Send size={15} className="stroke-[2.5]" />
                ENVIAR SOLICITUD A LA TABLA
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
};

