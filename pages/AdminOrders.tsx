import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDatabase';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../components/Formatters';
import { playNotificationSound } from '../services/audioService';
import { Bell, MapPin, Truck, Utensils } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initial Load
    setOrders(db.getOrders());

    // Subscribe to updates
    const unsubscribe = db.subscribe((updatedOrders) => {
      // Check if new order arrived (by comparing length or timestamp)
      // For simplicity, if count increases, play sound.
      // A robust app would compare IDs.
      const currentCount = updatedOrders.length;
      setOrders(prev => {
        if (currentCount > prev.length) {
          playNotificationSound();
        }
        return updatedOrders;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(id, newStatus);
    // Local state updates automatically via subscription
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Live Orders</h2>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Updates Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6">
            
            {/* Order Header & Status */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    #{order.id}
                    {order.type === 'delivery' ? (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Delivery
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <Utensils className="w-3 h-3" /> Dine-in
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-green-700">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xs text-gray-400">
                    {order.type === 'delivery' ? 'Incl. Delivery' : 'Total'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <p className="font-bold text-gray-800">{order.customer.name}</p>
                <p className="text-gray-600">{order.customer.phone}</p>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {order.type === 'dine-in' 
                      ? `Table Number: ${order.customer.location}` 
                      : order.customer.location}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                    <span className="text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Update Status</label>
              <button 
                onClick={() => handleStatusChange(order.id, 'pending')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${order.status === 'pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 ring-2 ring-yellow-400 ring-offset-1' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => handleStatusChange(order.id, 'processing')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${order.status === 'processing' ? 'bg-blue-100 border-blue-300 text-blue-800 ring-2 ring-blue-400 ring-offset-1' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Processing
              </button>
              <button 
                onClick={() => handleStatusChange(order.id, 'completed')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${order.status === 'completed' ? 'bg-green-100 border-green-300 text-green-800 ring-2 ring-green-400 ring-offset-1' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Completed
              </button>
              <button 
                 onClick={() => handleStatusChange(order.id, 'cancelled')}
                 className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${order.status === 'cancelled' ? 'bg-red-100 border-red-300 text-red-800 ring-2 ring-red-400 ring-offset-1' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Cancel
              </button>
            </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No active orders right now.</p>
            <p className="text-gray-400 text-sm">New orders will pop up here instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
