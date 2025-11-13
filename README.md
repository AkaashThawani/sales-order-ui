# Sales Order Automation - Web Dashboard

## Overview

This React/TypeScript web application provides a complete user interface for the Sales Order Automation system. It features:

- **Order Management Dashboard**: Real-time monitoring of all sales orders
- **Email Processing Interface**: Manual email input and automated processing
- **Approval Workflows**: Human intervention for business rule violations
- **Business Rule Management**: Configure and manage automated decision rules
- **Email Conversation Views**: Threaded email management and responses
- **Real-time Updates**: Live status updates and notifications

## Architecture

### Tech Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **TanStack Query** for server state management
- **React Router** for navigation
- **Lucide Icons** for consistent iconography
- **Sonner** for toast notifications

### Key Components

#### Pages
- **Dashboard/Home**: System overview and quick actions
- **Orders**: Complete order listing with filtering and search
- **Order Detail**: Individual order view with full history
- **Email Processing**: Manual email input and processing interface
- **Emails**: Email conversation management
- **Rules**: Business rule configuration and management
- **Demo**: Interactive demo for testing the system

#### Core Features
- **Real-time Data**: Automatic refresh of order statuses and email updates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Skeleton loading and progress indicators
- **Offline Support**: Graceful degradation when backend is unavailable

## Project Structure

```
sales-order-ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Input, etc.)
│   │   └── Layout.tsx     # Main layout wrapper
│   ├── lib/
│   │   ├── api.ts         # API client and type definitions
│   │   └── utils.ts       # Utility functions
│   ├── pages/             # Main application pages
│   │   ├── Dashboard.tsx  # System overview
│   │   ├── Orders.tsx     # Order management
│   │   ├── OrderDetail.tsx # Individual order view
│   │   ├── Emails.tsx     # Email conversations
│   │   ├── EmailProcessing.tsx # Email processing interface
│   │   ├── Rules.tsx      # Business rule management
│   │   ├── Demo.tsx       # Interactive demo
│   │   └── Home.tsx       # Landing page
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- Backend API server running (see backend README)

### Installation
1. **Navigate to the UI directory:**
   ```bash
   cd sales-order-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Development: http://localhost:5173
   - Production build: `npm run build` then serve the `dist/` folder

### Environment Configuration
The frontend automatically connects to the backend API. Update the API base URL in `src/lib/api.ts` if needed:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## Key Features

### Order Management
- **Real-time Status Updates**: Orders automatically refresh when status changes
- **Advanced Filtering**: Filter by status, date range, customer, etc.
- **Bulk Operations**: Select multiple orders for batch actions
- **Export Capabilities**: Download order data and PDFs

### Email Processing
- **Manual Email Input**: Paste emails for processing
- **AI-Powered Classification**: Automatic categorization and extraction
- **Conversation Threads**: View complete email chains
- **Automated Responses**: Generate and send professional replies

### Approval Workflows
- **Rule Violation Alerts**: Clear indication of orders needing approval
- **One-Click Approval**: Streamlined approval process
- **Audit Trail**: Complete history of approvals and rejections
- **Escalation Paths**: Automatic routing for high-value orders

### Business Rule Management
- **Visual Rule Builder**: Create rules without coding
- **Rule Testing**: Test rules against sample data
- **Rule Analytics**: Track rule performance and usage
- **Version Control**: Rule history and rollback capabilities

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript best practices
- **Prettier**: Code formatting (run with your editor)
- **Tailwind**: Utility-first CSS with consistent design tokens

### API Integration
The frontend uses a typed API client (`src/lib/api.ts`) that provides:
- Automatic request/response typing
- Error handling and retry logic
- Request caching with TanStack Query
- Real-time data synchronization

## Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
The built application can be served from any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Docker Support
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes with proper TypeScript types
3. Test with both backend API and mock data
4. Run linting and type checking
5. Submit pull request with description

### Code Standards
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Follow React best practices
- Use Tailwind utility classes
- Keep components small and focused

## Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend server is running on the correct port
- Check CORS configuration in backend
- Verify API_BASE_URL in api.ts

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are installed

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify responsive breakpoints

## Future Enhancements

- **Advanced Analytics**: Order performance dashboards
- **Mobile App**: React Native companion app
- **Multi-tenant Support**: Organization-based access control
- **Real-time Notifications**: WebSocket-based live updates
- **Advanced Search**: Full-text search across orders and emails
- **API Integration**: Third-party service connections

---

*Last Updated: 2025-11-12*
