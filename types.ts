export enum Category {
  FOOD = 'Food',
  DRINKS = 'Drinks',
  SIDES = 'Sides',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  deliveryFee: number; // Fee added if delivery is selected
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderType = 'dine-in' | 'delivery';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface CustomerDetails {
  name: string;
  phone: string;
  location: string; // Table Number or Address
}

export interface Order {
  id: string;
  items: CartItem[];
  type: OrderType;
  customer: CustomerDetails;
  subtotal: number;
  totalDeliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
}
