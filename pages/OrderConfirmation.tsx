import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { db } from '../services/mockDatabase';
import { Order } from '../types';
import { formatCurrency } from '../components/Formatters';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const orders = db.getOrders();
      const found = orders.find(o => o.id === orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return <div className="p-10 text-center">Loading Receipt...</div>;
  }

  return (
    <div className="min-h-screen bg-green-700 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-green-50 p-6 flex flex-col items-center border-b border-dashed border-gray-300 relative">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mt-1">Order ID: #{order.id}</p>
          
          {/* Decorative receipt zig-zag */}
          <div className="absolute bottom-0 w-full h-2 bg-white translate-y-1/2" 
               style={{background: 'linear-gradient(135deg, white 5px, transparent 0) 0 5px, linear-gradient(-135deg, white 5px, transparent 0) 0 5px', backgroundSize: '10px 10px', backgroundRepeat: 'repeat-x'}}></div>
        </div>

        <div className="p-6 pt-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-500 text-sm">Customer</span>
            <span className="font-medium text-right">{order.customer.name}</span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-500 text-sm">Location</span>
            <span className="font-medium text-right">
              {order.type === 'dine-in' ? `Table ${order.customer.location}` : order.customer.location}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Items</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-800">{item.quantity}x {item.name}</span>
                <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.totalDeliveryFee > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatCurrency(order.totalDeliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
              <span>Total Paid</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50">
          <button 
            onClick={() => navigate('/menu')}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
