import { MenuItem, Order, Category, OrderStatus } from '../types';

// Initial Mock Data
const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice & Chicken',
    description: 'Smoky party jollof rice served with fried plantain and peppered chicken.',
    price: 3500,
    image: 'https://picsum.photos/400/300?random=1',
    category: Category.FOOD,
    stock: 20,
    deliveryFee: 500
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi',
    description: 'Smooth pounded yam served with rich egusi soup garnished with assorted meat.',
    price: 4500,
    image: 'https://picsum.photos/400/300?random=2',
    category: Category.FOOD,
    stock: 15,
    deliveryFee: 600
  },
  {
    id: '3',
    name: 'Chapman',
    description: 'Refreshing Nigerian cocktail with fruity flavors.',
    price: 1500,
    image: 'https://picsum.photos/400/300?random=3',
    category: Category.DRINKS,
    stock: 50,
    deliveryFee: 200
  },
  {
    id: '4',
    name: 'Fried Plantain (Dodo)',
    description: 'Sweet, ripe plantains fried to golden perfection.',
    price: 1000,
    image: 'https://picsum.photos/400/300?random=4',
    category: Category.SIDES,
    stock: 30,
    deliveryFee: 200
  },
  {
    id: '5',
    name: 'Suya Spiced Beef',
    description: 'Spicy grilled beef skewers with onions and cabbage.',
    price: 2500,
    image: 'https://picsum.photos/400/300?random=5',
    category: Category.FOOD,
    stock: 0, // Out of stock example
    deliveryFee: 300
  }
];

type Listener = (orders: Order[]) => void;

class MockDatabase {
  private menuKey = 'naijabites_menu';
  private ordersKey = 'naijabites_orders';
  private listeners: Listener[] = [];

  constructor() {
    if (!localStorage.getItem(this.menuKey)) {
      localStorage.setItem(this.menuKey, JSON.stringify(INITIAL_MENU));
    }
    if (!localStorage.getItem(this.ordersKey)) {
      localStorage.setItem(this.ordersKey, JSON.stringify([]));
    }
  }

  // --- Menu Operations ---
  getMenu(): MenuItem[] {
    return JSON.parse(localStorage.getItem(this.menuKey) || '[]');
  }

  saveMenuItem(item: MenuItem): void {
    const menu = this.getMenu();
    const index = menu.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      menu[index] = item;
    } else {
      menu.push(item);
    }
    localStorage.setItem(this.menuKey, JSON.stringify(menu));
  }

  deleteMenuItem(id: string): void {
    const menu = this.getMenu().filter((i) => i.id !== id);
    localStorage.setItem(this.menuKey, JSON.stringify(menu));
  }

  // --- Inventory Operations ---
  decrementStock(items: { id: string; quantity: number }[]): void {
    const menu = this.getMenu();
    items.forEach((orderItem) => {
      const product = menu.find((p) => p.id === orderItem.id);
      if (product) {
        product.stock = Math.max(0, product.stock - orderItem.quantity);
      }
    });
    localStorage.setItem(this.menuKey, JSON.stringify(menu));
  }

  // --- Order Operations ---
  getOrders(): Order[] {
    return JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
  }

  createOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order); // Add to top
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    
    // Decrease stock immediately upon order creation (assuming payment passed)
    this.decrementStock(order.items.map(i => ({ id: i.id, quantity: i.quantity })));
    
    this.notifyListeners();
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(this.ordersKey, JSON.stringify(orders));
      this.notifyListeners();
    }
  }

  // --- Real-time Simulation ---
  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const orders = this.getOrders();
    this.listeners.forEach((l) => l(orders));
  }
}

export const db = new MockDatabase();
