import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Trash2 } from 'lucide-react';
import { CartItem, Order, OrderType } from '../types';
import { formatCurrency } from '../components/Formatters';
import { db } from '../services/mockDatabase';

const ClientCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '', // Table Num or Address
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('naijabites_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/menu');
    }
  }, [navigate]);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('naijabites_cart', JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('naijabites_cart', JSON.stringify(newCart));
    if (newCart.length === 0) navigate('/menu');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const deliveryFeeTotal = orderType === 'delivery' 
    ? cart.reduce((acc, item) => acc + (item.deliveryFee * item.quantity), 0)
    : 0;
  
  const totalAmount = subtotal + deliveryFeeTotal;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Payment Gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: cart,
      type: orderType,
      customer: {
        name: formData.name,
        phone: formData.phone,
        location: formData.location
      },
      subtotal,
      totalDeliveryFee: deliveryFeeTotal,
      totalAmount,
      status: 'pending',
      createdAt: Date.now()
    };

    db.createOrder(newOrder);
    
    // Clear cart and redirect
    localStorage.removeItem('naijabites_cart');
    setIsProcessing(false);
    navigate(`/confirmation/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-2 text-lg font-bold">Checkout</h1>
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Cart Items */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-3 border-b pb-2">Your Order</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                    <p className="font-semibold text-gray-800 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  {orderType === 'delivery' && (
                     <p className="text-xs text-orange-600 mt-1">+ {formatCurrency(item.deliveryFee * item.quantity)} delivery</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold"
                      >-</button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => {
                             if(item.quantity < item.stock) updateQuantity(item.id, 1);
                         }}
                         className={`w-6 h-6 flex items-center justify-center font-bold ${item.quantity >= item.stock ? 'text-gray-300' : 'text-gray-600'}`}
                      >+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Details Form */}
        <form onSubmit={handleCheckout} className="space-y-4">
          
          <section className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-bold text-gray-800 mb-3">Order Type</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  orderType === 'dine-in' 
                    ? 'border-green-600 bg-green-50 text-green-700' 
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                In-Restaurant
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  orderType === 'delivery' 
                    ? 'border-green-600 bg-green-50 text-green-700' 
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                Delivery
              </button>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-gray-800 mb-1">Details</h2>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <input 
                required
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
              <input 
                required
                type="tel"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                {orderType === 'dine-in' ? 'Table Number' : 'Delivery Address'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="text"
                  className="w-full border border-gray-300 rounded-lg pl-10 p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder={orderType === 'dine-in' ? 'e.g. 5' : 'e.g. 12 Lagos Street...'}
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="bg-white rounded-xl shadow-sm p-4">
             <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
             </div>
             {orderType === 'delivery' && (
               <div className="flex justify-between text-sm text-orange-600 mb-2">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFeeTotal)}</span>
               </div>
             )}
             <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
             </div>
          </section>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl shadow-lg font-bold flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {formatCurrency(totalAmount)}
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ClientCheckout;
