import React, { useState } from 'react';
import { 
  Plus, Upload, CreditCard, Calendar, RefreshCcw, Star, MapPin, 
  Trash2, Edit3, DollarSign, UserCheck, Bolt, Power, ShieldAlert,
  ArrowRight, Check, CheckCircle2, ChevronRight, PackageCheck, Eye
} from 'lucide-react';
import { ProductServiceItem, ProviderProfile, Appointment, UserRequest, ServiceCategory } from '../types';

interface ProviderPortalProps {
  providers: ProviderProfile[];
  items: ProductServiceItem[];
  appointments: Appointment[];
  requests: UserRequest[];
  selectedProviderId: string;
  onUpdateProviderProfile: (profile: ProviderProfile) => void;
  onAddInventoryItem: (item: Omit<ProductServiceItem, 'id' | 'providerId'>) => void;
  onUpdateItemStockAndPrice: (itemId: string, newStock: number, newPrice: number, updatedItem?: Partial<ProductServiceItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onAcceptRequest: (requestId: string, providerId: string) => void;
  onCounterOffer: (requestId: string, counterPrice: number) => void;
  onSwitchProviderSelection: (providerId: string) => void;
}

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'aseo', label: '🧹 ASEO HOGAR' },
  { value: 'jardinera', label: '🏡 JARDINERÍA' },
  { value: 'plomeria', label: '🔧 PLOMERÍA' },
  { value: 'artesanias', label: '🏺 ARTESANÍAS' },
  { value: 'electricista', label: '⚡ ELECTRICISTA' },
  { value: 'lavado_carros', label: '🚗 LAVADO CARROS' }
];

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  providers,
  items,
  appointments,
  requests,
  selectedProviderId,
  onUpdateProviderProfile,
  onAddInventoryItem,
  onUpdateItemStockAndPrice,
  onDeleteItem,
  onAcceptRequest,
  onCounterOffer,
  onSwitchProviderSelection
}) => {
  const currentProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'profile' | 'inventory'>('inventory');

  // Inventory forms states
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<ServiceCategory>('aseo');
  const [itemPrice, setItemPrice] = useState(25);
  const [itemPriceUnit, setItemPriceUnit] = useState('hora');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemStock, setItemStock] = useState(10);
  const [isService, setIsService] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counter offer states
  const [counterInputId, setCounterInputId] = useState<string | null>(null);
  const [counterPriceValue, setCounterPriceValue] = useState<number>(60);

  // Filter items owned by this current provider
  const providerItems = items.filter(item => item.providerId === currentProvider.id);
  const activeAppointments = appointments.filter(app => app.status !== 'completed');

  // Provider profile form state
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [pName, setPName] = useState(currentProvider.name);
  const [pSpecialty, setPSpecialty] = useState(currentProvider.specialty);
  const [pBio, setPBio] = useState(currentProvider.bio);
  const [pLocation, setPLocation] = useState(currentProvider.location);
  const [pAvatar, setPAvatar] = useState(currentProvider.avatar);
  const [pIsOnline, setPIsOnline] = useState(currentProvider.isOnline);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProviderProfile({
      ...currentProvider,
      name: pName,
      specialty: pSpecialty,
      bio: pBio,
      location: pLocation,
      avatar: pAvatar,
      isOnline: pIsOnline
    });
    setEditProfileMode(false);
    triggerToast('¡Perfil de Oferente actualizado con éxito!');
  };

  const handleAddProductService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    // Use a relevant placeholder image if none uploaded
    let defImage = itemImage;
    if (!defImage) {
      if (itemCategory === 'artesanias') defImage = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop';
      else if (itemCategory === 'aseo') defImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop';
      else if (itemCategory === 'jardinera') defImage = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop';
      else if (itemCategory === 'plomeria') defImage = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop';
      else if (itemCategory === 'electricista') defImage = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop';
      else defImage = 'https://images.unsplash.com/photo-1520340356584-f9917d1ecc6f?q=80&w=800&auto=format&fit=crop';
    }

    onAddInventoryItem({
      name: itemName.toUpperCase(),
      category: itemCategory,
      price: Number(itemPrice),
      priceUnit: itemPriceUnit.toUpperCase(),
      description: itemDescription || `Servicio calificado ofrecido por ${currentProvider.name}.`,
      image: defImage,
      stock: isService ? 99 : Number(itemStock),
      isService
    });

    // Reset Form
    setItemName('');
    setItemDescription('');
    setItemImage('');
    triggerToast(`¡Excelente! El artículo "${itemName}" ha sido añadido al inventario.`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggleOnline = () => {
    const updatedStatus = !currentProvider.isOnline;
    setPIsOnline(updatedStatus);
    onUpdateProviderProfile({
      ...currentProvider,
      isOnline: updatedStatus
    });
    triggerToast(updatedStatus ? '¡Ya estás visible y Online!' : 'Señas inactivas. Estás Offline.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Simulation Banner - Choose Provider viewpoint */}
      <div className="p-5 bg-white border-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <span className="font-mono font-black text-xs text-black flex items-center gap-1.5 uppercase">
            <Bolt size={14} className="text-[#FF4D00] stroke-[2.5]" /> Módulo de Simulación: Ofertores Locales
          </span>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
            Conmuta identidades en tiempo real para calibrar stock o emitir contraofertas de clientes.
          </p>
        </div>
        
        <select 
          className="bg-white text-xs font-black font-mono uppercase border-2 border-black p-2.5 outline-none cursor-pointer focus:bg-[#FF4D00]/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          value={selectedProviderId}
          onChange={(e) => {
            onSwitchProviderSelection(e.target.value);
            setEditProfileMode(false);
          }}
        >
          {providers.map(p => (
            <option key={p.id} value={p.id}>
              {p.name.toUpperCase()} ({p.specialty.split(' ')[0].toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Header Info Banner - Dynamic info of actual provider (Marcus / Sarah / Carmen) */}
      <section className="bg-white p-6 border-2 border-black relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <img 
              alt={currentProvider.name}
              className="w-24 h-24 border-2 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
              src={currentProvider.avatar}
            />
            <button
              onClick={handleToggleOnline}
              className={`absolute -bottom-2 -right-2 p-2 border-2 border-black cursor-pointer transition-transform hover:scale-110 shadow ${
                currentProvider.isOnline ? 'bg-[#D1F6D1] text-black' : 'bg-gray-200 text-black'
              }`}
              title={currentProvider.isOnline ? 'Hacer clic para pasar a modo desconectado' : 'Hacer clic para pasar a modo conectado'}
            >
              <Power size={12} className="stroke-[2.5]" />
            </button>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="font-headline text-2xl font-black text-black uppercase tracking-tighter">
                {currentProvider.name}
              </h2>
              <span className={`inline-block mx-auto md:mx-0 px-2.5 py-0.5 border border-black text-[9px] font-black uppercase tracking-wider ${
                currentProvider.isOnline ? 'bg-[#D1F6D1] text-black' : 'bg-gray-100 text-gray-500'
              }`}>
                {currentProvider.isOnline ? '● OFERENTE DISPONIBLE' : 'MODO INACTIVO'}
              </span>
            </div>

            <p className="text-xs text-[#FF4D00] font-mono tracking-wide font-black uppercase">// {currentProvider.specialty.toUpperCase()}</p>

            <div className="flex justify-center md:justify-start items-center gap-4 text-[10px] font-mono font-bold text-gray-500 uppercase">
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 border border-gray-300">
                <Star size={11} className="fill-[#FF4D00] text-[#FF4D00]" /> {currentProvider.rating.toFixed(1)} RESEÑAS
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {currentProvider.location.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-4 md:pt-0">
            <button
              onClick={() => {
                setEditProfileMode(!editProfileMode);
                setPName(currentProvider.name);
                setPSpecialty(currentProvider.specialty);
                setPBio(currentProvider.bio);
                setPLocation(currentProvider.location);
                setPAvatar(currentProvider.avatar);
              }}
              className="px-5 py-3 hover:bg-black hover:text-white text-black bg-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
            >
              {editProfileMode ? '✕ CERRAR PANELES' : '⚙️ CONF. PERFIL'}
            </button>
          </div>
        </div>

        {/* Profile Editing Form */}
        {editProfileMode && (
          <form onSubmit={handleUpdateProfileSubmit} className="mt-6 pt-6 border-t-2 border-black space-y-4">
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">// EDICIÓN DE CREDENCIALES</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">Nombre Completo</label>
                <input
                  type="text"
                  className="bg-white text-xs border-2 border-black p-3 w-full outline-none font-bold uppercase"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">Especialidad Principal</label>
                <input
                  type="text"
                  className="bg-white text-xs border-2 border-black p-3 w-full outline-none font-bold uppercase"
                  value={pSpecialty}
                  onChange={(e) => setPSpecialty(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">Ubicación / Cobertura</label>
                <input
                  type="text"
                  className="bg-white text-xs border-2 border-black p-3 w-full outline-none font-bold uppercase"
                  value={pLocation}
                  onChange={(e) => setPLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">Avatar Imagen (URL)</label>
                <input
                  type="text"
                  className="bg-white text-xs border-2 border-black p-3 w-full outline-none font-bold text-gray-500"
                  value={pAvatar}
                  onChange={(e) => setPAvatar(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">Biografía Profesional</label>
              <textarea
                className="bg-white text-xs border-2 border-black p-3 w-full outline-none font-bold uppercase h-20 resize-none"
                value={pBio}
                onChange={(e) => setPBio(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#FF4D00] text-white text-xs font-black uppercase tracking-wider py-3 px-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5 cursor-pointer"
            >
              Guardar Cambios de Perfil
            </button>
          </form>
        )}
      </section>

      {/* Sub Tabs */}
      <div className="flex bg-white border-2 border-black p-1 gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'inventory' 
              ? 'bg-[#FF4D00] text-white border border-black' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          📦 ADMINISTRAR INVENTARIO & PRECIOS
        </button>
        
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'feed' 
              ? 'bg-[#FF4D00] text-white border border-black' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          📡 SOLICITUDES EN VIVO ({requests.length})
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'profile' 
              ? 'bg-[#FF4D00] text-white border border-black' 
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          🗓️ VER CITA & AGENDA
        </button>
      </div>

      {toastMessage && (
        <div className="bg-[#D1F6D1] border-2 border-black text-black p-4 flex items-center justify-between text-xs font-bold animate-fade-in shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="font-black text-black text-sm p-1">✕</button>
        </div>
      )}

      {/* 2. TAB: WORKER FEED / BROADCAST CLIENT REQUESTS */}
      {activeSubTab === 'feed' && (
        <div className="space-y-6">
          <div className="space-y-1 border-b border-black pb-2">
            <h3 className="font-headline font-black text-xl text-black uppercase tracking-tighter">Terminal de Licitaciones Activas</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-tight font-mono">
              // SOLICITUDES EMITIDAS POR CLIENTES LOCALES. PUEDES CONSOLIDAR O CONTRAPROPONER PRECIOS.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 border-2 border-black border-dashed text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl">📡</span>
              <div>
                <p className="font-black text-gray-800 uppercase text-xs block">NINGUNA SOLICITUD TRANSMITIDA HOY</p>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto font-medium">
                  Para forzar el flujo, viaja al menú de clientes, entra en un filamento e inscribe una oferta en la pestaña de licitaciones directas.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => {
                const isMyAccepted = r.status === 'accepted' && r.providerId === currentProvider.id;

                return (
                  <article
                    key={r.id}
                    className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all space-y-4 relative"
                  >
                    {r.status === 'accepted' && (
                      <div className="absolute top-4 right-4 bg-[#D1F6D1] text-black border-2 border-black px-3 py-1 text-[9px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <CheckCircle2 size={12} /> {isMyAccepted ? 'CONSOLIDADO POR TI' : `PRE-ASIGNADO A OTRO`}
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="bg-[#E1D1F6] text-black border border-black font-black px-3 py-1 text-[9px] uppercase tracking-wider inline-block">
                          SECTOR: {r.category === 'aseo' ? '🧹 ASEO' : r.category === 'jardinera' ? '🏡 JARDÍN' : r.category === 'plomeria' ? '🔧 PLOMERO' : r.category === 'artesanias' ? '🏺 ARTESANÍA' : r.category === 'electricista' ? '⚡ ELÉCTRICO' : '🚗 LAVADO'}
                        </span>
                        <h4 className="font-headline text-lg font-black text-black uppercase tracking-tight pt-2">
                          {r.details}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1 font-mono uppercase font-bold">
                          <MapPin size={12} className="stroke-[2.5]" /> COBERTURA: {r.address}
                        </p>
                      </div>

                      <div className="text-right pl-4">
                        <span className="text-2xl font-headline font-black text-[#FF4D00] block">${r.priceOffer}</span>
                        <span className="text-[8px] text-gray-500 uppercase font-black font-mono tracking-wider block">OFERTA DE CLIENTE</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-100 p-4 border border-black text-[10px] font-mono font-bold uppercase text-gray-500">
                      <span>📆 FECHA PROPUESTA: <strong className="text-black font-black">{r.date}</strong></span>
                      <span>⏰ HORARIO: <strong className="text-black font-black">{r.time}</strong></span>
                    </div>

                    {r.status === 'broadcasted' && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
                        {counterInputId === r.id ? (
                          <div className="bg-gray-100 p-4 border-2 border-black flex flex-col sm:flex-row items-center gap-3 w-full sm:max-w-md justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-black font-black uppercase font-mono">CONTRAPROPUESTA ($):</span>
                              <input 
                                type="number" 
                                className="bg-white rounded-none border-2 border-black p-1 text-xs font-black outline-none w-20 text-center"
                                value={counterPriceValue}
                                onChange={(e) => setCounterPriceValue(Number(e.target.value))}
                              />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button 
                                onClick={() => {
                                  onCounterOffer(r.id, counterPriceValue);
                                  setCounterInputId(null);
                                  triggerToast(`Contraoferta de $${counterPriceValue} enviada con éxito.`);
                                }}
                                className="bg-[#FF4D00] text-white border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5"
                              >
                                Enviar
                              </button>
                              <button 
                                onClick={() => setCounterInputId(null)}
                                className="bg-white text-black border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-0.5"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setCounterInputId(r.id);
                                setCounterPriceValue(r.priceOffer + 15);
                              }}
                              className="px-5 py-3 border-2 border-black font-black uppercase text-black text-xs bg-white hover:bg-gray-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5"
                            >
                              Sugerir Contraoferta
                            </button>
                            <button
                              onClick={() => {
                                onAcceptRequest(r.id, currentProvider.id);
                                triggerToast('¡Has aceptado este trabajo! Cita registrada en tu agenda.');
                              }}
                              className="px-6 py-3 bg-[#FF4D00] text-white font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5 cursor-pointer"
                            >
                              PRE-PACTAR POR ${r.priceOffer}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: WORKER PROFILE AGENDA */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Interactive beautiful Agenda Calendar (Marcus profile style) */}
            <div className="lg:col-span-2 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <div>
                  <h4 className="font-headline text-lg font-black uppercase tracking-tighter text-black">Calendario Técnico</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase font-mono">// CONTROL DE TRABAJOS MENSUAL</p>
                </div>
                <div className="flex bg-white p-1 border-2 border-black text-xs font-black uppercase font-mono">
                  <span className="bg-black text-white px-3 py-1">MES</span>
                  <span className="text-gray-500 px-3 py-1 hover:text-black cursor-pointer">SEMANA</span>
                </div>
              </div>

              {/* Day matrix simplified */}
              <div className="grid grid-cols-7 gap-y-4 text-center">
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
                  <span key={d} className="text-gray-500 font-mono text-[9px] uppercase font-black tracking-widest">{d}</span>
                ))}
                
                {/* Visual Calendario Grid */}
                <div className="py-2 text-gray-300 font-mono text-xs">25</div>
                <div className="py-2 text-gray-300 font-mono text-xs">26</div>
                <div className="py-2 text-gray-300 font-mono text-xs">27</div>
                <div className="py-2 text-gray-300 font-mono text-xs">28</div>
                <div className="py-2 text-gray-300 font-mono text-xs">29</div>
                <div className="py-2 text-gray-300 font-mono text-xs">30</div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono">1</div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono font-bold">2</div>
                {/* Active day (Marcus Sterling screen style) */}
                <div className="py-2 bg-[#FF4D00] text-white border-2 border-black cursor-pointer flex flex-col items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs font-black font-mono">3</span>
                  <span className="text-[7px] font-black uppercase leading-none tracking-wider">Hoy</span>
                </div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono">4</div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono">5</div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono">6</div>
                <div className="py-2 hover:bg-gray-105 border border-dashed border-transparent hover:border-black cursor-pointer text-xs font-mono">7</div>
              </div>
            </div>

            {/* Right: Earnings and Next appointments */}
            <div className="space-y-4">
              <div className="bg-[#FF4D00] p-6 border-2 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <span className="text-[9px] font-mono uppercase font-black tracking-widest text-[#FFF3EE]">INGRESOS PREVISTOS HOY (COBROS)</span>
                <p className="text-4xl font-headline font-black uppercase tracking-tight mt-2">${currentProvider.earningsToday.toFixed(2)}</p>
                <div className="mt-4 flex items-center gap-1.5 bg-black/40 p-2.5 border border-black/25 text-[10px] font-mono uppercase tracking-tight font-black">
                  <span>✓ 12% MÁS QUE EL CICLO PREVIO</span>
                </div>
              </div>

              {/* Response metrics */}
              <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h4 className="font-headline text-xs font-black text-black uppercase tracking-widest block font-mono">// INDICES DE CONFIABILIDAD</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-gray-100 p-3 border border-black">
                    <p className="text-[#FF4D00] text-[8px] uppercase font-black font-mono tracking-wider">RESPUESTA MEDIO</p>
                    <p className="text-lg font-black text-black mt-1">8 MINS</p>
                  </div>
                  <div className="bg-gray-100 p-3 border border-black">
                    <p className="text-[#FF4D00] text-[8px] uppercase font-black font-mono tracking-wider">COMPLETADOS</p>
                    <p className="text-lg font-black text-black mt-1">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Queue list */}
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h3 className="font-headline text-lg font-black uppercase tracking-tight text-black">Próximos Servicios Pendientes</h3>
            
            {activeAppointments.length === 0 ? (
              <p className="text-xs text-gray-500 font-bold uppercase font-mono text-center py-4">// NO SE GENERARON CITAS FORMALES EN EL ALMACÉN DE DATOS</p>
            ) : (
              <div className="divide-y-2 divide-black">
                {activeAppointments.map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border-2 border-black bg-gray-100 flex items-center justify-center text-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {app.category === 'aseo' ? '🧹' : app.category === 'jardinera' ? '🏡' : '🔧'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-black uppercase">{app.clientName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{app.itemName} ({app.timeSlot.toUpperCase()})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500 font-bold uppercase tracking-tight text-[10px]">📍 {app.distance.toUpperCase()}</span>
                      <span className="font-black text-black bg-white border border-black px-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">${app.price}</span>
                      <span className="bg-[#E1D1F6] text-black border border-black px-2.5 py-0.5 font-black uppercase text-[8px] tracking-wider">
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB: INVENTORY AND RAPID MANAGEMENT CONTROL PANEL */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6">
          <div className="border-b border-black pb-2">
            <h3 className="font-headline font-black text-xl text-black uppercase tracking-tighter">
              Almacén de Mercancías & Gestión de Stock
            </h3>
            <p className="text-xs text-gray-550 font-bold uppercase font-mono tracking-wide">
              // HERRAMIENTA OFICIAL PARA CARGAR PERFILES, ACTUALIZAR UNIDADES Y DETALLAR PRECIOS REGLAMENTARIOS.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Create/Upload Form (Cargar Perfil, Mercancía o Servicios) */}
            <div className="lg:col-span-5 bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 h-fit">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-[#FF4D00] uppercase tracking-widest block font-mono">// ADMINISTRACIÓN INTEGRAL</span>
                <h4 className="font-headline text-lg font-black text-black uppercase tracking-tight">Cargar Nueva Oferta</h4>
              </div>

              <form onSubmit={handleAddProductService} className="space-y-4 text-xs font-sans">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Nombre de la Mercancía o Servicio</label>
                  <input
                    type="text"
                    className="w-full bg-white border-2 border-black outline-none p-3 focus:bg-gray-50 text-xs font-black uppercase"
                    placeholder="Ej. Bolso de Telar de Algodón, o Poda Exprés"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>

                {/* Service vs tangible type */}
                <div className="grid grid-cols-2 gap-1 bg-white p-1 border-2 border-black">
                  <button
                    type="button"
                    onClick={() => { setIsService(true); setItemPriceUnit('hora'); }}
                    className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                      isService ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    💆 Labor / Servicio
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsService(false); setItemPriceUnit('unidad'); }}
                    className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                      !isService ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    🏺 Producto Físico
                  </button>
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Categoría Oficial de Mercado</label>
                  <select
                    className="w-full bg-white border-2 border-black outline-none p-3 focus:bg-gray-50 text-xs font-black uppercase cursor-pointer"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as ServiceCategory)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price and Price Unit Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Precio unitario ($)</label>
                    <input
                      type="number"
                      className="w-full bg-white border-2 border-black outline-none p-3 text-xs font-black"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      required
                      min={1}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Unidad de cobro</label>
                    <input
                      type="text"
                      className="w-full bg-white border-2 border-black outline-none p-3 text-xs font-black uppercase"
                      placeholder="Ej: hora, servicio, pieza, m2"
                      value={itemPriceUnit}
                      onChange={(e) => setItemPriceUnit(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Physical Stock limit (only for tangible products) */}
                {!isService && (
                  <div className="space-y-1 bg-yellow-50 p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <label className="font-black uppercase tracking-wider text-black block mb-1 text-[9px] font-mono">Unidades Iniciales en Almacén (Stock)</label>
                    <input
                      type="number"
                      className="w-full bg-white border-2 border-black p-2 font-black text-xs text-black"
                      value={itemStock}
                      onChange={(e) => setItemStock(Number(e.target.value))}
                      required
                      min={0}
                    />
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mt-2">El stock se deducirá automáticamente cuando el cliente final concrete compras.</p>
                  </div>
                )}

                {/* Image URL link */}
                <div className="space-y-1">
                  <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Enlace de Imagen Ilustrativa (Opcional)</label>
                  <input
                    type="text"
                    className="w-full bg-white border-2 border-black outline-none p-3 text-xs font-bold text-gray-500"
                    placeholder="URL de unsplash o dejar vacío para genérico"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-black uppercase tracking-wider text-gray-600 block text-[9px] font-mono">Ficha Informativa / Detalles</label>
                  <textarea
                    className="w-full bg-white border-2 border-black outline-none p-3 h-20 resize-none font-black text-[11px] uppercase placeholder:text-gray-400"
                    placeholder="Describe los beneficios, acabados de la cerámica, o alcance de la labor de aseo"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF4D00] text-white py-4 border-2 border-black font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.5]" /> Registrar en mi Catalogo
                </button>
              </form>
            </div>

            {/* Right: Rapid Stock and Price editing grid (Administracion de inventario rapido) */}
            <div className="lg:col-span-7 bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black pb-3">
                <div>
                  <h4 className="font-headline text-lg font-black uppercase tracking-tight text-black">Catálogo Regulado ({providerItems.length})</h4>
                  <p className="text-[10px] text-gray-400 font-mono uppercase font-black">// CONFIGURACIONES EDITABLES DE ALTA VELOCIDAD</p>
                </div>
              </div>

              {providerItems.length === 0 ? (
                <div className="bg-gray-100 p-12 text-center border-2 border-black border-dashed font-black text-gray-500 text-xs uppercase">
                  Aún vacíos. Registra tu primer producto de artesano o labor técnica usando el formulario de la izquierda.
                </div>
              ) : (
                <div className="space-y-4">
                  {providerItems.map((item) => {
                    const outOfStock = !item.isService && item.stock <= 0;

                    return (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 border-2 border-black object-cover shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          />
                          <div className="space-y-1">
                            <span className="text-[8px] bg-black text-white font-black px-1.5 py-0.5 border border-black tracking-widest uppercase inline-block font-mono">
                              {item.category.toUpperCase()}
                            </span>
                            <h5 className="text-xs font-black text-black block uppercase">{item.name}</h5>
                            <p className="text-[9px] text-gray-500 font-bold uppercase line-clamp-1">{item.description}</p>
                          </div>
                        </div>

                        {/* Inventory Controls */}
                        <div className="flex flex-wrap items-center gap-4 justify-between md:justify-end border-t-2 border-black/10 md:border-t-0 pt-3 md:pt-0">
                          
                          {/* Inline Price editing */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-black text-gray-500 font-mono">PRECIO ($):</span>
                            <input
                              type="number"
                              className="bg-white border-2 border-black p-1.5 font-black text-xs w-16 text-center outline-none focus:bg-[#FF4D00]/5"
                              value={item.price}
                              onChange={(e) => onUpdateItemStockAndPrice(item.id, item.stock, Number(e.target.value))}
                            />
                            <span className="text-[9px] text-gray-400 font-mono font-bold uppercase">/{item.priceUnit.toUpperCase()}</span>
                          </div>

                          {/* Inline Stock Editing (Only if is physical product) */}
                          <div className="flex items-center gap-2">
                            {item.isService ? (
                              <span className="bg-[#E1D1F6] text-black border border-black px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
                                SERVICIO ACTIVO
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] uppercase font-black text-gray-500 font-mono">STOCK:</span>
                                
                                <button
                                  onClick={() => onUpdateItemStockAndPrice(item.id, Math.max(0, item.stock - 1), item.price)}
                                  className="w-8 h-8 rounded-none border-2 border-black font-black text-black bg-white hover:bg-[#FF4D00] hover:text-white flex items-center justify-center text-sm active:translate-y-0.5 cursor-pointer"
                                >
                                  -
                                </button>
                                
                                <span className={`text-xs font-black px-2 w-8 text-center ${outOfStock ? 'text-red-500' : 'text-black'}`}>
                                  {item.stock}
                                </span>
 
                                <button
                                  onClick={() => onUpdateItemStockAndPrice(item.id, item.stock + 1, item.price)}
                                  className="w-8 h-8 rounded-none border-2 border-black font-black text-black bg-white hover:bg-[#FF4D00] hover:text-white flex items-center justify-center text-sm active:translate-y-0.5 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Trash Delete button */}
                          <button
                            onClick={() => {
                              onDeleteItem(item.id);
                              triggerToast(`El ítem se ha eliminado.`);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Eliminar de mi lista"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

