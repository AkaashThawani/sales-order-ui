import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Layout
import { Layout } from './components/Layout'

// Pages
import { Home } from './pages/Home'
import { Demo } from './pages/Demo'
import { Dashboard } from './pages/Dashboard'
import { Orders } from './pages/Orders'
import { OrderDetail } from './pages/OrderDetail'
import { CompletedOrders } from './pages/CompletedOrders'
import { Rules } from './pages/Rules'
import { Emails } from './pages/Emails'
import { EmailProcessing } from './pages/EmailProcessing'
import { OrderConversation } from './pages/OrderConversation'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Full-screen pages without sidebar */}
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<Demo />} />

            {/* Pages with sidebar layout */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/orders" element={<Layout><Orders /></Layout>} />
            <Route path="/orders/:id" element={<Layout><OrderDetail /></Layout>} />
            <Route path="/completed-orders" element={<Layout><CompletedOrders /></Layout>} />
            <Route path="/rules" element={<Layout><Rules /></Layout>} />
            <Route path="/emails" element={<Layout><Emails /></Layout>} />
            <Route path="/email-processing" element={<Layout><EmailProcessing /></Layout>} />
            <Route path="/order-conversation" element={<Layout><OrderConversation /></Layout>} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  )
}

export default App
