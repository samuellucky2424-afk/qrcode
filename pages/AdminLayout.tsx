import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Coffee, ClipboardList, Bell } from 'lucide-react';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white md:w-64 w-full flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-green-400">Admin Panel</h1>
          <p className="text-xs text-slate-400 mt-1">NaijaBites Manager</p>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink 
            to="/admin" end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <ClipboardList className="w-5 h-5" />
            Live Orders
          </NavLink>
          <NavLink 
            to="/admin/menu" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Coffee className="w-5 h-5" />
            Menu & Stock
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
