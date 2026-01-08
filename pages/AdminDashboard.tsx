import React, { useEffect, useState } from 'react';
import { BarChart, DollarSign, ShoppingBag, AlertTriangle } from 'lucide-react';
import { db } from '../services/mockDatabase';
import { Order, MenuItem } from '../types';
import { formatCurrency } from '../components/Formatters';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    setOrders(db.getOrders());
    setMenu(db.getMenu());
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.length;
  const lowStockItems = menu.filter(i => i.stock < 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full text-orange-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items • {order.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-400">No orders yet.</p>}
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4 text-orange-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Inventory Attention
          </h3>
          <div className="space-y-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${item.stock === 0 ? 'bg-red-500' : 'bg-orange-400'}`} 
                      style={{ width: `${Math.min(100, item.stock * 10)}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                  {item.stock} left
                </span>
              </div>
            ))}
            {lowStockItems.length === 0 && <p className="text-green-600">Inventory levels look healthy!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
