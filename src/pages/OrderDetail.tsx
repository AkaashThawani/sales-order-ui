import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Order } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { ArrowLeft, RefreshCw, MapPin, Calendar, User } from 'lucide-react'

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required')
      const response = await apiService.getOrder(parseInt(id))
      return response.data as Order
    },
    enabled: !!id,
  })



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

  // Removed manual action buttons - workflow is now automatic

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">The requested order could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Unified Order Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">Order #{order.id}</div>
              <div className="text-sm text-muted-foreground">
                Created {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
            {getStatusBadge(order.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Customer Information */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <p className="text-sm">{order.customer_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="label">Email</label>
                <p className="text-sm">{order.customer_email}</p>
              </div>
              {order.delivery_address && (
                <div className="md:col-span-2">
                  <label className="label flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Delivery Address
                  </label>
                  <p className="text-sm">{order.delivery_address}</p>
                </div>
              )}
              {order.delivery_date && (
                <div>
                  <label className="label flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Delivery Date
                  </label>
                  <p className="text-sm">{order.delivery_date}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            {order.line_items && order.line_items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.line_items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.requested_name}</div>
                          {item.product_name && item.product_name !== item.requested_name && (
                            <div className="text-sm text-muted-foreground">{item.product_name}</div>
                          )}
                          {item.product_code && (
                            <div className="text-xs text-muted-foreground">Code: {item.product_code}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.requested_quantity}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'VALIDATED' ? 'default' : 'secondary'}>
                          {item.status || 'UNKNOWN'}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.unit_price || '0.00'}</TableCell>
                      <TableCell>${item.total_price || '0.00'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No items in this order.</p>
            )}
          </div>

          {/* Applied Rules */}
          {order.applied_rules && order.applied_rules.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Applied Business Rules</h3>
              <div className="space-y-2">
                {order.applied_rules.map((rule, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="font-medium">{rule.rule_name}</div>
                    <div className="text-sm text-muted-foreground">{rule.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Customer Notes</h3>
              <p className="text-sm whitespace-pre-wrap">{order.customer_notes}</p>
            </div>
          )}



          {/* Workflow Tasks */}
          {order.workflow_tasks && order.workflow_tasks.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Workflow Tasks</h3>
              <div className="space-y-2">
                {order.workflow_tasks.map((task, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{task.task_type}</div>
                        <div className="text-sm text-muted-foreground">
                          Created by {task.created_by} • {new Date(task.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </div>
                    {task.result && (
                      <div className="mt-2 text-sm">
                        <strong>Result:</strong> {JSON.stringify(task.result)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
