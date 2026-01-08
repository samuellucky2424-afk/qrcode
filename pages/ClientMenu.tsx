import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X, Plus, Minus } from 'lucide-react';
import { db } from '../services/mockDatabase';
import { MenuItem, Category, CartItem } from '../types';
import { formatCurrency } from '../components/Formatters';

const ClientMenu: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the selected item (Modal)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    // Load menu on mount
    setMenuItems(db.getMenu());
    
    // Check for existing cart
    const savedCart = localStorage.getItem('naijabites_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    // Reset quantity when modal opens
    if (selectedItem) setModalQuantity(1);
  }, [selectedItem]);

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    if (item.stock === 0) return;
    
    const existing = cart.find(c => c.id === item.id);
    let newCart;
    if (existing) {
      if (existing.quantity + quantity > item.stock) {
        alert("Maximum stock reached for this item");
        return;
      }
      newCart = cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c);
    } else {
      newCart = [...cart, { ...item, quantity }];
    }
    setCart(newCart);
    localStorage.setItem('naijabites_cart', JSON.stringify(newCart));
    
    // Close modal after adding
    setSelectedItem(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen pb-24 bg-gray-100">
      
      {/* Unified Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        {/* App Bar */}
        <header className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700 tracking-tight">NaijaBites</h1>
          <div className="relative cursor-pointer" onClick={() => cartTotalItemCount > 0 && navigate('/checkout')}>
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartTotalItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartTotalItemCount}
              </span>
            )}
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search food..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 px-4 pb-3 no-scrollbar">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - 2 Columns on Mobile, more on larger screens */}
      <div className="px-2 pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredItems.map(item => {
          const isOutOfStock = item.stock === 0;
          return (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-lg p-2.5 shadow-sm flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform duration-100"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-70' : ''}`} 
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase">Out of Stock</span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex flex-col flex-1">
                <p className="text-sm text-gray-700 line-clamp-2 leading-tight min-h-[2.5em] mb-1">{item.name}</p>
                <div className="mt-auto flex justify-between items-center">
                   <p className="font-bold text-lg text-gray-900">{formatCurrency(item.price)}</p>
                   {!isOutOfStock && (
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                        }}
                        className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center hover:bg-green-100 active:bg-green-200 transition-colors shadow-sm border border-green-100"
                     >
                       <Plus className="w-5 h-5" />
                     </button>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200" 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative h-64 w-full">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedItem.name}</h3>
                <p className="text-xl font-bold text-green-700 whitespace-nowrap">{formatCurrency(selectedItem.price)}</p>
              </div>
              
              <p className="text-gray-500 mb-6 leading-relaxed">{selectedItem.description}</p>
              
              {selectedItem.stock > 0 ? (
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="w-8 h-8 rounded-full bg-white shadow border flex items-center justify-center text-gray-600 active:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg w-6 text-center">{modalQuantity}</span>
                      <button 
                        onClick={() => setModalQuantity(Math.min(selectedItem.stock, modalQuantity + 1))}
                        className="w-8 h-8 rounded-full bg-white shadow border flex items-center justify-center text-gray-600 active:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(selectedItem, modalQuantity)}
                    className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-green-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Add to Cart - {formatCurrency(selectedItem.price * modalQuantity)}
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
                  Currently Out of Stock
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (Orange, Side) */}
      {cartTotalItemCount > 0 && !selectedItem && (
        <button 
          onClick={() => navigate('/checkout')}
          className="fixed bottom-6 right-4 z-40 bg-orange-500 text-white shadow-2xl rounded-full px-5 py-3 flex items-center gap-3 hover:bg-orange-600 hover:scale-105 transition-all active:scale-95 animate-in slide-in-from-right"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
              {cartTotalItemCount}
            </span>
          </div>
          <div className="flex flex-col items-start leading-none">
             <span className="text-[10px] font-bold uppercase opacity-90 mb-0.5">Checkout</span>
             <span className="font-bold text-sm">{formatCurrency(cartTotalAmount)}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ClientMenu;