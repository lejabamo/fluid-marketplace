/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, User, Search, Map, Bolt, 
  Sparkles, CheckSquare, Layers, HelpCircle, ChevronRight, Briefcase 
} from 'lucide-react';
import { getStorageData, saveStorageData } from './initialData';
import { ProductServiceItem, ProviderProfile, Appointment, UserRequest, ServiceCategory } from './types';
import { ClientHome } from './components/ClientHome';
import { ServiceExplorer } from './components/ServiceExplorer';
import { ProviderPortal } from './components/ProviderPortal';

export default function App() {
  // 1. Storage-backed State
  const [db, setDb] = useState(() => getStorageData());

  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'requests' | 'bookings' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Sync state with storage
  useEffect(() => {
    saveStorageData({
      providers: db.providers,
      items: db.items,
      appointments: db.appointments,
      requests: db.requests,
      currentRole: db.currentRole,
      selectedProviderId: db.selectedProviderId
    });
  }, [db]);

  // Force loading from local storage
  const handleRefreshDb = () => {
    setDb(getStorageData());
  };

  // Switch role helper
  const handleSwitchRole = (role: 'client' | 'provider') => {
    setDb(prev => ({ ...prev, currentRole: role }));
    if (role === 'provider') {
      setActiveTab('profile'); // Switch to profile tab for admin
    } else {
      setActiveTab('home');
    }
  };

  // Update profile
  const handleUpdateProviderProfile = (updatedProfile: ProviderProfile) => {
    setDb(prev => {
      const newProvs = prev.providers.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      return { ...prev, providers: newProvs };
    });
  };

  // Add Item to Inventory
  const handleAddInventoryItem = (newItemData: Omit<ProductServiceItem, 'id' | 'providerId'>) => {
    const newItem: ProductServiceItem = {
      ...newItemData,
      id: `item_${Date.now()}`,
      providerId: db.selectedProviderId
    };
    setDb(prev => ({
      ...prev,
      items: [newItem, ...prev.items]
    }));
  };

  // Update Item stock / price (Admin Panel quick edits)
  const handleUpdateItemStockAndPrice = (itemId: string, newStock: number, newPrice: number, updatedItem?: Partial<ProductServiceItem>) => {
    setDb(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            stock: newStock,
            price: newPrice,
            ...updatedItem
          };
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    setDb(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Direct client offer broadcast
  const handleBroadcastRequest = (reqData: Omit<UserRequest, 'id' | 'status'>) => {
    const newReq: UserRequest = {
      ...reqData,
      id: `req_${Date.now()}`,
      status: 'broadcasted'
    };
    setDb(prev => ({
      ...prev,
      requests: [newReq, ...prev.requests]
    }));
  };

  // Simple inventory purchase buyout workflow
  const handlePurchaseItem = (itemId: string, qty: number = 1): { success: boolean; message: string } => {
    const targetItem = db.items.find(item => item.id === itemId);
    if (!targetItem) return { success: false, message: 'Ítem no encontrado en almacén.' };

    if (!targetItem.isService && targetItem.stock < qty) {
      return { success: false, message: `Disculpa, no hay stock suficiente. Solo quedan ${targetItem.stock} unidades.` };
    }

    // Decrement physical stock in database if it's a product
    setDb(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId && !item.isService) {
          return { ...item, stock: Math.max(0, item.stock - qty) };
        }
        return item;
      });

      // Credit the provider earnings for the sale
      const updatedProviders = prev.providers.map(p => {
        if (p.id === targetItem.providerId) {
          return { ...p, earningsToday: p.earningsToday + (targetItem.price * qty) };
        }
        return p;
      });

      // Log a quick appointment of completed purchase
      const newAppointment: Appointment = {
        id: `app_${Date.now()}`,
        timeSlot: 'Entrega de Compra Física',
        clientName: prev.currentUser.name,
        category: targetItem.category,
        itemName: `Compra: ${targetItem.name}`,
        price: targetItem.price * qty,
        distance: 'Local (Despachado)',
        status: 'completed',
        date: 'Hoy'
      };

      return {
        ...prev,
        items: updatedItems,
        providers: updatedProviders,
        appointments: [newAppointment, ...prev.appointments]
      };
    });

    return { 
      success: true, 
      message: `¡Compra exitosa! Se ha descontado 1 unidad de "${targetItem.name}" del stock del oferente. Puedes ver el recibo en la pestaña Reservas.` 
    };
  };

  // Provider portal operations
  const handleAcceptRequest = (requestId: string, providerId: string) => {
    const targetReq = db.requests.find(r => r.id === requestId);
    if (!targetReq) return;

    setDb(prev => {
      // Mark accepted
      const updatedRequests = prev.requests.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' as const, providerId } : r
      );

      // Create booking appointment
      const newApp: Appointment = {
        id: `app_acc_${Date.now()}`,
        timeSlot: targetReq.time,
        clientName: prev.currentUser.name,
        category: targetReq.category,
        itemName: `Licitación aceptada: ${targetReq.category.toUpperCase()}`,
        price: targetReq.priceOffer,
        distance: '3.0 km',
        status: 'confirmed',
        date: targetReq.date
      };

      // Add to provider earnings
      const updatedProviders = prev.providers.map(p => 
        p.id === providerId ? { ...p, earningsToday: p.earningsToday + targetReq.priceOffer } : p
      );

      return {
        ...prev,
        requests: updatedRequests,
        appointments: [newApp, ...prev.appointments],
        providers: updatedProviders
      };
    });
  };

  const handleCounterOffer = (requestId: string, counterPrice: number) => {
    setDb(prev => {
      const updatedRequests = prev.requests.map(r => 
        r.id === requestId ? { ...r, status: 'countered' as const, counterPrice } : r
      );
      return { ...prev, requests: updatedRequests };
    });
  };

  const handleSwitchProviderSelection = (provId: string) => {
    setDb(prev => ({ ...prev, selectedProviderId: provId }));
  };

  // Switch selected categorizer shortcut
  const handleSelectCategory = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    setActiveTab('requests'); // Switch to explorer view
  };

  const currentActiveProvider = db.providers.find(p => p.id === db.selectedProviderId) || db.providers[0];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#1A1A1A] font-body pb-32">
      
      {/* Dynamic Header / Logo Area with Role Switcher */}
      <header className="fixed top-0 w-full flex items-center justify-between px-6 h-18 bg-white border-b-4 border-gray-200 z-50 shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => { setSelectedCategory(null); setActiveTab('home'); }}
        >
          <div className="w-9 h-9 border border-gray-200 bg-primary flex items-center justify-center text-white text-base font-black shadow-sm hover:shadow-md transition-shadow">
            🏺
          </div>
          <h1 className="font-headline font-black uppercase tracking-tight text-xs sm:text-sm md:text-base text-black">
            FLUID MARKETPLACE
          </h1>
        </div>

        {/* Dynamic Role Switcher Controls */}
        <div className="flex bg-white border border-gray-200 p-1 shadow-sm hover:shadow-md transition-shadow text-[10px] sm:text-xs font-black gap-1">
          <button
            onClick={() => handleSwitchRole('client')}
            className={`px-3 py-1.5 font-black uppercase tracking-wider transition-all cursor-pointer ${
              db.currentRole === 'client' 
                ? 'bg-secondary-custom text-white' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            😇 Cliente
          </button>
          
          <button
            onClick={() => handleSwitchRole('provider')}
            className={`px-3 py-1.5 font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              db.currentRole === 'provider' 
                ? 'bg-primary text-white' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            🛠️ Oferente (Admin)
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto pt-24 px-6">
        
        {/* CLIENT MODE */}
        {db.currentRole === 'client' && (
          <>
            {/* Active Tab: Home (Discovery Feed) */}
            {activeTab === 'home' && (
              <ClientHome 
                providers={db.providers}
                items={db.items}
                currentUser={db.currentUser}
                onSelectCategory={handleSelectCategory}
                onSearchSubmit={(q) => {
                  setGlobalSearchQuery(q);
                  setActiveTab('market');
                }}
                onSelectProvider={(id) => {
                  setDb(prev => ({ ...prev, selectedProviderId: id }));
                  setActiveTab('profile'); // examine provider profile in detail tab
                }}
              />
            )}

            {/* Active Tab: Global Market / Mercado General */}
            {activeTab === 'market' && (
              <ServiceExplorer 
                category="all"
                initialSearchQuery={globalSearchQuery}
                items={db.items}
                providers={db.providers}
                onBack={() => { setActiveTab('home'); setGlobalSearchQuery(''); }}
                onSelectProvider={(id) => {
                  setDb(prev => ({ ...prev, selectedProviderId: id }));
                  setActiveTab('profile');
                }}
                onBroadcastRequest={handleBroadcastRequest}
                onPurchaseItem={handlePurchaseItem}
              />
            )}

            {/* Active Tab: Requests / Category Explorer */}
            {activeTab === 'requests' && (
              selectedCategory ? (
                <ServiceExplorer 
                  category={selectedCategory}
                  initialSearchQuery=""
                  items={db.items}
                  providers={db.providers}
                  onBack={() => setSelectedCategory(null)}
                  onSelectProvider={(id) => {
                    setDb(prev => ({ ...prev, selectedProviderId: id }));
                    setActiveTab('profile');
                  }}
                  onBroadcastRequest={handleBroadcastRequest}
                  onPurchaseItem={handlePurchaseItem}
                />
              ) : (
                <div className="space-y-6 text-center py-12">
                  <div className="bg-[#FFEFE6] w-16 h-16 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-2xl mx-auto">
                    🛠
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-black uppercase tracking-tight text-black">Selecciona una categoría para explorar</h3>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1 max-w-sm mx-auto leading-relaxed">
                      Explora rústicas vajillas, aseo a domicilio, jardinería sustentable o plomería certificada de nuestro catálogo urbano regulado.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 text-left">
                    {(['aseo', 'jardinera', 'plomeria', 'artesanias', 'electricista', 'lavado_carros'] as ServiceCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleSelectCategory(cat)}
                        className="bg-white p-4 border border-gray-200 font-black uppercase text-xs tracking-wider text-black flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow hover:bg-primary hover:text-white transition-all active:translate-y-0.5 cursor-pointer"
                      >
                        <span className="text-lg">
                          {cat === 'aseo' ? '🧹' : cat === 'jardinera' ? '🏡' : cat === 'plomeria' ? '🔧' : cat === 'artesanias' ? '🏺' : cat === 'electricista' ? '⚡' : '🚗'}
                        </span>
                        <span>{cat.replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Active Tab: Bookings / History */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-black">Mis Citas & Compras</h3>
                  <p className="text-xs text-gray-500 font-mono uppercase font-black">// HISTORIAL DE RESERVAS E INVENTARIO ELECTRÓNICO</p>
                </div>

                {db.appointments.length === 0 ? (
                  <div className="bg-white p-12 border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center text-gray-500 text-xs font-black uppercase leading-relaxed">
                    No tienes transacciones activas. Explora el catálogo o realiza compras de artesanías para probar el sistema de inventario autónomo.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {db.appointments.map((app) => (
                      <div 
                        key={app.id}
                        className="bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:translate-x-0.5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-2xl">
                            {app.itemName.includes('Compra') ? '🏺' : '📅'}
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-black bg-[#E1D1F6] border border-gray-200 px-2 py-0.5 inline-block font-mono">
                              {app.itemName.includes('Compra') ? 'Mercancía Entregada' : 'Servicio Confirmado'}
                            </span>
                            <h4 className="font-black text-xs uppercase text-black pt-1.5">{app.itemName}</h4>
                            <p className="text-[10px] text-gray-500 font-mono font-bold uppercase mt-0.5">Agendado: {app.date} • {app.timeSlot}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center sm:flex-col gap-2 sm:gap-0 justify-between w-full sm:w-auto border-t sm:border-0 border-gray-200/10 pt-2 sm:pt-0">
                          <span className="text-base font-black text-primary block">${app.price}</span>
                          <span className="text-[8px] text-gray-400 font-mono font-bold uppercase">RECIBO CLIENTE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Tab: Profile (Examining selected worker profile) */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="font-mono text-[10px] font-black uppercase tracking-wider text-black border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow hover:bg-primary hover:text-white transition-all active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    ← Volver a Inicio
                  </button>
                </div>
                
                {/* Embedded Profile detail card simulating worker layout */}
                <section className="bg-white p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img 
                      alt={currentActiveProvider.name}
                      src={currentActiveProvider.avatar}
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/eeeeee/999999?text=Avatar'; }}
                      className="w-24 h-24 border border-gray-200 object-cover shadow-sm hover:shadow-md transition-shadow"
                    />
                    
                    <div className="space-y-1.5 flex-1 w-full">
                      <span className="bg-[#FFEFE6] text-black text-[9px] font-black px-2 py-0.5 border border-gray-200 uppercase tracking-wider font-mono">
                        {currentActiveProvider.isOnline ? '🟢 Disponible Ahora' : 'Offline'}
                      </span>
                      <h3 className="font-headline text-2xl font-black text-black pt-1 uppercase tracking-tight">{currentActiveProvider.name}</h3>
                      <p className="text-xs text-primary font-black uppercase font-mono tracking-wider">{currentActiveProvider.specialty}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 font-mono font-bold uppercase pt-1">
                        <span className="flex items-center gap-0.5 font-black text-black">
                          ⭐️ {currentActiveProvider.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{currentActiveProvider.reviewsCount} reseñas</span>
                        <span>•</span>
                        <span>📍 {currentActiveProvider.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-1">
                    <h4 className="font-black uppercase tracking-wider text-[10px] text-gray-500 font-mono">Biografía del Oferente</h4>
                    <p className="text-black text-xs font-semibold uppercase leading-relaxed font-sans">{currentActiveProvider.bio}</p>
                  </div>

                  {/* Provider specialty skills list */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-black uppercase text-gray-500">Habilidades Certificadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentActiveProvider.skills.map((s, idx) => (
                        <span key={idx} className="bg-white text-black border border-gray-200 text-[10px] font-black px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow hover:bg-[#E1D1F6] transition-all">
                          ✓ {s.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Items Catalog Offered by This specific worker */}
                  <div className="space-y-4 pt-6 border-t-2 border-gray-200/10">
                    <h4 className="font-headline text-base font-black text-black uppercase tracking-tight">
                      Catálogo Exclusivo de {currentActiveProvider.name}
                    </h4>

                    {db.items.filter(i => i.providerId === currentActiveProvider.id).length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-mono uppercase font-black">// ESTE OFERENTE NO TIENE ÍTEMSES EN SU CATÁLOGO</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {db.items.filter(i => i.providerId === currentActiveProvider.id).map(item => {
                          const outOfStock = !item.isService && item.stock <= 0;
                          return (
                             <div key={item.id} className="bg-gray-50 p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <img src={item.image} className="w-10 h-10 border border-gray-200 object-cover" />
                                 <div className="space-y-0.5">
                                   <span className="text-[8px] bg-secondary-custom text-white px-1.5 font-mono uppercase font-bold tracking-tight inline-block">{item.isService ? 'SERVICIO' : 'PRODUCTO'}</span>
                                   <h5 className="text-[11px] font-black uppercase text-black line-clamp-1">{item.name}</h5>
                                   <p className="text-[10px] font-mono font-extrabold text-primary">${item.price} / {item.priceUnit.toUpperCase()}</p>
                                 </div>
                               </div>
                               
                               <button
                                 onClick={() => {
                                   if (item.isService) {
                                     alert(`Deseas agendar: ${item.name}. Te re-direccionamos al panel de reservas.`);
                                     setSelectedCategory(item.category);
                                     setActiveTab('requests');
                                   } else {
                                     const purchaseRes = handlePurchaseItem(item.id);
                                     alert(purchaseRes.message);
                                   }
                                 }}
                                 disabled={!item.isService && outOfStock}
                                 className={`px-3 py-1.5 border border-gray-200 text-[9px] font-black uppercase tracking-wider transition-all shadow-sm hover:shadow-md transition-shadow ${
                                   !item.isService && outOfStock
                                     ? 'bg-gray-250 text-gray-400 border-gray-300 shadow-none cursor-not-allowed'
                                     : 'bg-primary text-white hover:bg-black hover:text-white cursor-pointer active:translate-y-0.5 shadow-sm hover:shadow-md transition-shadow'
                                 }`}
                               >
                                 {item.isService ? 'Agendar' : outOfStock ? 'Sin stock' : 'Comprar'}
                               </button>
                             </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {/* PROVIDER ENVIROMENT VIEW (ADMIN PANEL & INVENTORY LOGS) */}
        {db.currentRole === 'provider' && (
          <ProviderPortal 
            providers={db.providers}
            items={db.items}
            appointments={db.appointments}
            requests={db.requests}
            selectedProviderId={db.selectedProviderId}
            onUpdateProviderProfile={handleUpdateProviderProfile}
            onAddInventoryItem={handleAddInventoryItem}
            onUpdateItemStockAndPrice={handleUpdateItemStockAndPrice}
            onDeleteItem={handleDeleteItem}
            onAcceptRequest={handleAcceptRequest}
            onCounterOffer={handleCounterOffer}
            onSwitchProviderSelection={handleSwitchProviderSelection}
          />
        )}

      </main>

      {/* Persistent Bottom Tabbed Menu (Only applicable in client mode) */}
      {db.currentRole === 'client' && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-gray-200 z-40 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-around items-center px-4 py-3.5 max-w-md mx-auto">
            
            {/* Tab Link: Home */}
            <button
              onClick={() => { setSelectedCategory(null); setActiveTab('home'); }}
              className={`flex flex-col items-center gap-1 p-2 text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-primary scale-105' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Home size={18} className="stroke-[2.5]" />
              <span className="font-label text-[9px] font-black tracking-wider mt-0.5">Inicio</span>
            </button>

            {/* Tab Link: Global Market */}
            <button
              onClick={() => { setActiveTab('market'); }}
              className={`flex flex-col items-center gap-1 p-2 text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'market' 
                  ? 'text-primary scale-105' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Sparkles size={18} className="stroke-[2.5]" />
              <span className="font-label text-[9px] font-black tracking-wider mt-0.5">Mercado</span>
            </button>

            {/* Tab Link: Requests / Category Explorer */}
            <button
              onClick={() => { setActiveTab('requests'); }}
              className={`flex flex-col items-center gap-1 p-2 text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'requests' 
                  ? 'text-primary scale-105' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Search size={18} className="stroke-[2.5]" />
              <span className="font-label text-[9px] font-black tracking-wider mt-0.5">Categorías</span>
            </button>

            {/* Tab Link: Bookings */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex flex-col items-center gap-1 p-2 text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'bookings' 
                  ? 'text-primary scale-105' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Calendar size={18} className="stroke-[2.5]" />
              <span className="font-label text-[9px] font-black tracking-wider mt-0.5">Reservas</span>
            </button>

            {/* Tab Link: Selected Active Provider Details Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 p-2 text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'text-primary scale-105' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <User size={18} className="stroke-[2.5]" />
              <span className="font-label text-[9px] font-black tracking-wider mt-0.5">Vendedor</span>
            </button>

          </div>
        </nav>
      )}

    </div>
  );
}
