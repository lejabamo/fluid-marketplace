import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Calendar, Clock, Sparkles, Plus, 
  Send, ShieldAlert, ShoppingBag, CheckCircle, PackageOpen 
} from 'lucide-react';
import { ProductServiceItem, ProviderProfile, ServiceCategory, UserRequest, Appointment } from '../types';

interface ServiceExplorerProps {
  category: ServiceCategory;
  items: ProductServiceItem[];
  providers: ProviderProfile[];
  onBack: () => void;
  onSelectProvider: (providerId: string) => void;
  onBroadcastRequest: (request: Omit<UserRequest, 'id' | 'status'>) => void;
  onPurchaseItem: (itemId: string, qty: number) => { success: boolean; message: string };
}

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: string; bannerDesc: string; bannerImg: string; estimateRange: string }> = {
  aseo: {
    label: 'Aseo Hogar',
    icon: '🧹',
    bannerDesc: 'Desinfección integral, limpieza profunda y servicios de lavandería por hora.',
    bannerImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$35 - $50 / hr'
  },
  jardinera: {
    label: 'Jardinería',
    icon: '🏡',
    bannerDesc: 'Pasto ornamental, poda especializada de arbustos y diseño exterior paisajista.',
    bannerImg: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$35 - $60 / hr'
  },
  plomeria: {
    label: 'Plomería',
    icon: '🔧',
    bannerDesc: 'Reparación de fugas hidráulicas, instalación de boilers y sanitarios.',
    bannerImg: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$45 - $75 / hr'
  },
  artesanias: {
    label: 'Artesanías',
    icon: '🏺',
    bannerDesc: 'Bolsos tejidos a telar, vajillas de cerámica negra y artesanías tradicionales exclusivas.',
    bannerImg: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$40 - $120 / pieza'
  },
  electricista: {
    label: 'Electricista',
    icon: '⚡',
    bannerDesc: 'Diagnóstico de sobrecargas eléctricas, tableros inteligentes e instalaciones LED.',
    bannerImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$40 - $70 / hr'
  },
  lavado_carros: {
    label: 'Lavado Carros',
    icon: '🚗',
    bannerDesc: 'Lavado ecológico sin manguera o detallado completo a vapor en tu propio cochera.',
    bannerImg: 'https://images.unsplash.com/photo-1520340356584-f9917d1ecc6f?q=80&w=800&auto=format&fit=crop',
    estimateRange: '$30 - $55 / lavado'
  }
};

export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({
  category,
  items,
  providers,
  onBack,
  onSelectProvider,
  onBroadcastRequest,
  onPurchaseItem
}) => {
  const meta = CATEGORY_META[category];

  const [activeTab, setActiveTab] = useState<'listings' | 'broadcast'>('listings');
  const [selectedItem, setSelectedItem] = useState<ProductServiceItem | null>(null);
  
  // Broadcast Bid Form State
  const [address, setAddress] = useState('Paseo de la Reforma 250, CDMX');
  const [date, setDate] = useState('Junio 5, 2026');
  const [time, setTime] = useState('10:00 AM');
  const [details, setDetails] = useState('');
  const [priceOffer, setPriceOffer] = useState(50);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Buy feedback message state
  const [purchaseFeedback, setPurchaseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter listings by category
  const categoryItems = items.filter(item => item.category === category);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastRequest({
      category,
      address,
      date,
      time,
      details: details || `Solicitud para ${meta.label} a domicilio.`,
      priceOffer
    });
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setActiveTab('listings');
    }, 2500);
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
          className="p-3 bg-white text-[#FF4D00] border-2 border-black hover:bg-[#FF4D00] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
        >
          <ArrowLeft size={18} className="stroke-[2.5]" />
        </button>
        <div>
          <span className="text-gray-500 font-mono text-[10px] uppercase font-black tracking-widest block">FLUID MARKETPLACE // RUTA</span>
          <h2 className="font-headline text-2xl font-black text-black uppercase tracking-tighter">{meta.label}</h2>
        </div>
      </div>

      {/* Hero Category Banner */}
      <section className="relative overflow-hidden border-2 border-black h-48 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-end p-6">
        <img 
          alt={meta.label}
          className="w-full h-full object-cover absolute inset-0 z-0 opacity-60"
          src={meta.bannerImg}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0 opacity-80"></div>
        <div className="relative z-10 space-y-2 text-white">
          <div className="bg-[#FF4D00] text-white border border-white px-3 py-1 text-[10px] font-black uppercase tracking-wider inline-block">
            RANGO ESTIMADO: {meta.estimateRange.toUpperCase()}
          </div>
          <p className="text-xs text-white/90 max-w-xl font-bold uppercase tracking-tight font-sans leading-relaxed">
            {meta.bannerDesc}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex bg-white p-1 border-2 border-black gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => { setActiveTab('listings'); setSelectedItem(null); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'listings' 
              ? 'bg-[#FF4D00] text-white shadow-none border border-black' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          {category === 'artesanias' ? '🏺 Catálogo de Productos' : '⚡ Ofertas de Servicios'}
        </button>
        <button
          onClick={() => { setActiveTab('broadcast'); setSelectedItem(null); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'broadcast' 
              ? 'bg-[#FF4D00] text-white shadow-none border border-black' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          📡 Licitación Directa (Pide tu Precio)
        </button>
      </div>

      {/* CONTENT LISTINGS TAB */}
      {activeTab === 'listings' && !selectedItem && (
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-black pb-2">
            <h3 className="font-headline font-black text-xl text-black uppercase tracking-tighter">
              {category === 'artesanias' ? 'Mercancías Disponibles' : 'Servicios Registrados'}
            </h3>
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">
              {categoryItems.length} {categoryItems.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {categoryItems.length === 0 ? (
            <div className="bg-white p-8 border-2 border-black border-dashed text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                    className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-gray-50 border-b-2 border-black">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        ${item.price} <span className="text-[10px] font-bold text-gray-500">/ {item.priceUnit.toUpperCase()}</span>
                      </div>
                      
                      {/* Inventory stock badge */}
                      <div className={`absolute top-3 right-3 border-2 border-black px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
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
                          className="flex items-center gap-2 p-2 border border-black bg-gray-100 hover:bg-[#FF4D00]/10 cursor-pointer transition-colors"
                        >
                          <img 
                            src={prov.avatar} 
                            alt={prov.name} 
                            className="w-8 h-8 border border-black object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-black truncate uppercase">{prov.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight flex items-center gap-0.5">
                              <Star size={9} className="fill-[#FF4D00] text-[#FF4D00]" /> {prov.rating.toFixed(1)} RESEÑAS
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="flex-1 bg-white hover:bg-gray-100 text-black border-2 border-black py-3 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5"
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
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 ${
                            !item.isService && isOutOfStock
                              ? 'bg-gray-200 text-gray-400 border-dashed cursor-not-allowed shadow-none'
                              : 'bg-[#FF4D00] text-white hover:bg-[#E24400]'
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
        <section className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <button 
            onClick={() => setSelectedItem(null)}
            className="text-xs font-black text-[#FF4D00] uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
          >
            ← Volver al catálogo
          </button>

          {purchaseFeedback && (
            <div className={`p-4 border-2 border-black flex items-center gap-2 text-xs font-bold ${
              purchaseFeedback.type === 'success' ? 'bg-[#D1F6D1] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-red-100 text-black'
            }`}>
              <CheckCircle size={16} />
              <span className="uppercase">{purchaseFeedback.message.toUpperCase()}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 border-2 border-black overflow-hidden bg-gray-50">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="bg-[#E1D1F6] text-black border border-black px-3 py-1 text-[9px] font-black uppercase tracking-wider">
                  {selectedItem.isService ? 'SERVICIO A DOMICILIO' : 'MERCANCÍA FÍSICA'}
                </span>
                <h3 className="font-headline text-2xl font-black text-black uppercase tracking-tighter pt-1">
                  {selectedItem.name}
                </h3>
                <p className="text-3xl font-black text-[#FF4D00] font-headline mt-1">
                  ${selectedItem.price} <span className="text-xs font-bold text-gray-500">/ {selectedItem.priceUnit.toUpperCase()}</span>
                </p>
              </div>

              <blockquote className="text-xs text-black uppercase tracking-tight leading-relaxed bg-gray-100 border-l-4 border-black p-4 font-bold">
                {selectedItem.description}
              </blockquote>

              {!selectedItem.isService && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Unidades Físicas:</span>
                  <span className={`font-black border border-black px-2 py-1 text-[10px] uppercase ${selectedItem.stock <= 0 ? 'bg-red-500 text-white' : 'bg-[#D1F6D1] text-black'}`}>
                    {selectedItem.stock <= 0 ? 'AGOTADO EN TIENDA' : `STOCK: ${selectedItem.stock} DISPONIBLES`}
                  </span>
                </div>
              )}

              {/* Action buttons inside details */}
              <div className="pt-2 space-y-2">
                {selectedItem.isService ? (
                  <div className="bg-gray-100 border-2 border-black p-4 space-y-4">
                    <h4 className="text-xs font-black text-black flex items-center gap-1.5 uppercase font-mono">
                      <Calendar size={14} /> Seleccionar Bloque Técnico
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-3 border-2 border-black text-center text-xs text-black cursor-pointer hover:bg-[#FF4D00] hover:text-white transition-colors">
                        <p className="font-black uppercase">Mañana</p>
                        <p className="text-[10px] font-bold">10:00 AM</p>
                      </div>
                      <div className="bg-white p-3 border-2 border-black text-center text-xs text-black cursor-pointer hover:bg-[#FF4D00] hover:text-white transition-colors">
                        <p className="font-black uppercase">Tarde</p>
                        <p className="text-[10px] font-bold">03:00 PM</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        alert(`¡Turno solicitado de forma exitosa!\nServicio: ${selectedItem.name.toUpperCase()}\nLa agenda se ha transferido.`);
                        setSelectedItem(null);
                      }}
                      className="w-full bg-black text-white hover:bg-[#FF4D00] py-4 border-2 border-black text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                    >
                      Solicitar este Turno
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleItemPurchase(selectedItem.id)}
                    disabled={selectedItem.stock <= 0}
                    className={`w-full py-4 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 transition-all ${
                      selectedItem.stock <= 0 
                        ? 'bg-gray-200 text-gray-400 border-dashed cursor-not-allowed shadow-none'
                        : 'bg-[#FF4D00] text-white hover:bg-black'
                    }`}
                  >
                    {selectedItem.stock <= 0 ? 'Agotado en Almacén' : 'Confirmar Compra (Descontar del Inventario)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DISPATCH/BROADCAST REQUESTS FORM - INDRIVER BIDDING MODE */}
      {activeTab === 'broadcast' && (
        <section className="space-y-6">
          <div className="bg-black text-white p-6 border-2 border-black space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-headline text-lg font-black uppercase tracking-tight text-white">
              Sistema de Licencias y Ofertas Activas
            </h3>
            <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed text-left">
              Fija tu precio. Los oferentes técnicos de la área revisarán tu propuesta y podrán aceptar o contraofertar en vivo.
            </p>
          </div>

          {broadcastSuccess ? (
            <div className="bg-[#D1F6D1] text-black p-8 border-2 border-black text-center space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-4xl block">📡</span>
              <h4 className="font-headline font-black text-lg uppercase tracking-tight">¡Licitación Transmitida con Éxito!</h4>
              <p className="text-xs max-w-sm mx-auto font-bold uppercase">
                Propuesta de <strong>${priceOffer}</strong> transmitida a la terminal. Simula la respuesta cambiando el rol a Oferente (Admin) arriba.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              
              {/* Address input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest block font-mono ml-1">DIRECCIÓN DEL SERVICIO / DESTINO</label>
                <div className="flex items-center gap-3 bg-gray-100 p-4 border-2 border-black">
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
                  <div className="flex items-center gap-3 bg-gray-100 p-4 border-2 border-black">
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
                  <div className="flex items-center gap-3 bg-gray-100 p-4 border-2 border-black">
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
                  className="bg-gray-100 border-2 border-black p-4 w-full text-xs h-24 outline-none resize-none font-bold uppercase placeholder:text-gray-400"
                  placeholder="Detalla qué necesitas exactamente..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              {/* Slider BIDDING (Similar to indriver screenshot 1) */}
              <div className="bg-gray-150 border-2 border-black p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="font-headline font-black text-[11px] uppercase tracking-wider block">TU OFERTA DIRECTA DE PAGO</span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Precio propuesto para motivar aceptación rápida</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-[#FF4D00] block uppercase tracking-widest">ESTIMADO</span>
                    <span className="text-sm font-black text-black bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">$45 - $60</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-3xl font-black text-[#FF4D00]">$</span>
                  <input 
                    type="number"
                    className="text-4xl font-extrabold text-black bg-transparent border-none p-0 outline-none focus:ring-0 w-full"
                    value={priceOffer}
                    onChange={(e) => setPriceOffer(Number(e.target.value))}
                  />
                </div>

                {/* Addition Quick Tags */}
                <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar">
                  <button 
                    type="button"
                    onClick={() => setPriceOffer(prev => prev + 5)}
                    className="whitespace-nowrap bg-white text-black font-black border-2 border-black px-4 py-2 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF4D00] hover:text-white active:translate-y-0.5 transition-colors"
                  >
                    + $5
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriceOffer(prev => prev + 10)}
                    className="whitespace-nowrap bg-white text-black font-black border-2 border-black px-4 py-2 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF4D00] hover:text-white active:translate-y-0.5 transition-colors"
                  >
                    + $10
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriceOffer(prev => prev + 20)}
                    className="whitespace-nowrap bg-white text-black font-black border-2 border-black px-4 py-2 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF4D00] hover:text-white active:translate-y-0.5 transition-colors"
                  >
                    + $20
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriceOffer(55)}
                    className="whitespace-nowrap bg-[#FF4D00] text-white font-black border-2 border-black px-4 py-2 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5 transition-colors"
                  >
                    CONVENIO MERCADO: $55
                  </button>
                </div>
              </div>

              {/* Submit Broadcast button */}
              <button
                type="submit"
                className="w-full bg-black hover:bg-[#FF4D00] text-white font-black py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest cursor-pointer active:translate-y-0.5"
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

