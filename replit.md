# NaijaBites Ordering System

## Overview

NaijaBites is a responsive food ordering web application for a Nigerian restaurant. The system supports both customer-facing menu browsing and ordering, as well as an admin dashboard for managing orders and inventory. Key features include QR code support for table ordering, conditional delivery logic with item-specific delivery fees, and real-time order notifications using the Web Audio API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7 using HashRouter for client-side navigation
- **Styling**: Tailwind CSS via CDN with custom scrollbar styling
- **Build Tool**: Vite 6 for development and production builds
- **Path Aliasing**: `@/*` maps to project root for cleaner imports

### Application Structure
The app is divided into two main sections:
1. **Client Routes** (`/menu`, `/checkout`, `/confirmation/:orderId`) - Customer-facing ordering flow
2. **Admin Routes** (`/admin/*`) - Protected dashboard with nested layout for menu management and order tracking

### State Management
- **Local Storage**: Cart persistence between sessions using `naijabites_cart` key
- **In-Memory Mock Database**: Singleton service (`mockDatabase.ts`) with pub/sub pattern for real-time updates across components

### Data Models
Core types defined in `types.ts`:
- `MenuItem` - Menu items with category, pricing, stock, and delivery fees
- `CartItem` - Extends MenuItem with quantity
- `Order` - Complete order with customer details, items, and status tracking
- Categories: Food, Drinks, Sides
- Order types: dine-in, delivery
- Order statuses: pending, processing, completed, cancelled

### AI Integration
- **Google Gemini API** (`@google/genai`) for generating menu item descriptions
- Uses `gemini-3-flash-preview` model with zero thinking budget for fast responses
- API key configured via `VITE_GEMINI_API_KEY` environment variable

### Audio Notifications
- Web Audio API used for admin order notifications
- No external audio assets required - synthesizes sounds programmatically

## External Dependencies

### Core Libraries
- `react` / `react-dom` v19 - UI framework
- `react-router-dom` v7 - Client-side routing
- `lucide-react` - Icon library
- `@google/genai` - Gemini AI for content generation

### Development Tools
- `vite` - Build tool and dev server (runs on port 5000)
- `typescript` - Type checking
- `@vitejs/plugin-react` - React plugin for Vite

### External Services
- **Google Gemini API** - AI-powered menu description generation
- **Picsum Photos** - Placeholder images for menu items

### Environment Variables
- `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` - Required for AI features, configured in `.env.local`

### CDN Dependencies (index.html)
- Tailwind CSS
- Google Fonts (Inter)
- ESM imports for React ecosystem via esm.sh