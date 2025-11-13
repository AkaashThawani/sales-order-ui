import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Order } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { FileText, Eye, CheckCircle, Calendar, User, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CompletedOrders() {
  const navigate = useNavigate()

  // Get all completed orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['completed-orders'],
    queryFn: async () => {
      const response = await apiService.getOrders('completed', 100)
      return response.data as Order[]
    },
    refetchOnWindowFocus: true,
  })

  const getStatusBadge = (status: string) => {
    return (
      <Badge className="status-completed">
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleGeneratePDF = async (orderId: number) => {
    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders/${orderId}/generate-pdf`
      link.download = `Sales_Order_${orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      alert(`PDF generation failed: ${error}`)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading completed orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Completed Orders</h1>
          <p className="text-muted-foreground">View and manage finalized orders</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {orders?.length || 0} completed orders
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePDF(order.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{order.customer_name || 'Unknown'}</div>
                      <div className="text-muted-foreground">{order.customer_email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{order.line_items?.length || 0} items</div>
                      <div className="text-muted-foreground">Line items</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {order.completed_at ? new Date(order.completed_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {order.approved_at ? new Date(order.approved_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-muted-foreground">Approved</div>
                    </div>
                  </div>
                </div>

                {/* Order Items Summary */}
                {order.line_items && order.line_items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Order Items:</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.line_items.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item.requested_name} × {item.requested_quantity}
                        </Badge>
                      ))}
                      {order.line_items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{order.line_items.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Completed Orders</h3>
            <p className="text-muted-foreground">
              Orders will appear here once they are marked as completed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
