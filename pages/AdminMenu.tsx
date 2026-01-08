import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { db } from '../services/mockDatabase';
import { MenuItem, Category } from '../types';
import { formatCurrency } from '../components/Formatters';

const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: Category.FOOD,
    stock: 0,
    deliveryFee: 0,
    image: 'https://picsum.photos/400/300'
  });

  useEffect(() => {
    setItems(db.getMenu());
  }, []);

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '', description: '', price: 0, category: Category.FOOD, stock: 10, deliveryFee: 500, image: 'https://picsum.photos/400/300'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      ...(formData as MenuItem)
    };
    db.saveMenuItem(newItem);
    setItems(db.getMenu());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      db.deleteMenuItem(id);
      setItems(db.getMenu());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800"
        >
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Delivery Fee</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate w-48">{item.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{item.category}</span>
                </td>
                <td className="p-4 text-gray-700">{formatCurrency(item.price)}</td>
                <td className="p-4 text-gray-700">{formatCurrency(item.deliveryFee)}</td>
                <td className="p-4">
                   <span className={`font-bold ${item.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                     {item.stock}
                   </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input required type="text" className="w-full border rounded-lg p-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border rounded-lg p-2"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input required type="number" className="w-full border rounded-lg p-2" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                  <input required type="number" className="w-full border rounded-lg p-2" 
                    value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₦)</label>
                  <input required type="number" className="w-full border rounded-lg p-2" 
                    value={formData.deliveryFee} onChange={e => setFormData({...formData, deliveryFee: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input required type="text" className="w-full border rounded-lg p-2" 
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={3} className="w-full border rounded-lg p-2 text-sm" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-white bg-green-700 rounded-lg">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
