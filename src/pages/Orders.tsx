import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Order } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Orders() {
  const navigate = useNavigate()

  const { data: allOrders, isLoading } = useQuery({
    queryKey: ['unprocessed-orders'],
    queryFn: async () => {
      const response = await apiService.getOrders(undefined, 100)
      return response.data.filter((order: Order) => order.status === 'inquiry') as Order[]
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Client-side filtering (though we only fetch inquiry orders)
  const orders = allOrders

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      inquiry: 'status-pending',
      in_process: 'status-processing',
      pending_approval: 'status-pending',
      db_check: 'status-processing',
      response: 'status-processing',
      follow_up: 'status-pending',
      completed: 'status-completed'
    }

    return (
      <Badge className={statusClasses[status as keyof typeof statusClasses] || 'status-default'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>



      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No orders found.</p>
              <p className="text-sm mt-2">Process some emails to create orders.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.line_items?.length || 0} items</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
