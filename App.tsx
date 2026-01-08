import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientMenu from './pages/ClientMenu';
import ClientCheckout from './pages/ClientCheckout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './pages/AdminLayout';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<ClientMenu />} />
        <Route path="/checkout" element={<ClientCheckout />} />
        <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
