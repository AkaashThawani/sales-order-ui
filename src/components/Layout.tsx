import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import {
  BarChart3,
  FileText,
  Mail,
  Settings,
  Menu,
  X,
  Database,
  MessageSquare,
  CheckCircle
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Orders', href: '/orders', icon: FileText },
  { name: 'Completed Orders', href: '/completed-orders', icon: CheckCircle },
  { name: 'Email Processing', href: '/email-processing', icon: Mail },
  { name: 'Order Conversation', href: '/order-conversation', icon: MessageSquare },
  { name: 'Emails', href: '/emails', icon: Database },
  { name: 'Rules', href: '/rules', icon: Settings },
]

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b bg-white/50 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-slate-900">Sales Automation</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "nav-link",
                  isActive ? "nav-link-active" : "nav-link-inactive"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Backend Status: <span className="text-green-600">Connected</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 border rounded"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-sm text-muted-foreground">
              Sales Automation v1.0
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
