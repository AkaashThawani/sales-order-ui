import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Order, EmailLog } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { MessageSquare, Send, Plus, Eye, Mail, ChevronDown, ChevronRight, User } from 'lucide-react'
import { toast } from 'sonner'

export function OrderConversation() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [messageContent, setMessageContent] = useState('')
  const [emailAccordionOpen, setEmailAccordionOpen] = useState(true)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newOrderEmail, setNewOrderEmail] = useState('')
  const [newOrderContent, setNewOrderContent] = useState('')

  // Get all orders (not completed)
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const response = await apiService.getOrders(undefined, 100)
      return response.data.filter((order: Order) =>
        order.status !== 'completed'
      ) as Order[]
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Get email chain for selected order
  const { data: emailChain, refetch: refetchEmails } = useQuery({
    queryKey: ['email-chain', selectedOrderId],
    queryFn: async () => {
      if (!selectedOrderId) return []
      const response = await apiService.getOrderEmails(parseInt(selectedOrderId))
      return response.data as EmailLog[]
    },
    enabled: !!selectedOrderId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Update selected order when orders load
  useEffect(() => {
    if (orders && orders.length > 0 && !selectedOrderId && !isCreatingNew) {
      setSelectedOrderId(orders[0].id.toString())
    }
  }, [orders, selectedOrderId, isCreatingNew])

  const selectedOrder = orders?.find(order => order.id.toString() === selectedOrderId)

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      inquiry: 'bg-yellow-100 text-yellow-800',
      in_process: 'bg-blue-100 text-blue-800',
      response: 'bg-green-100 text-green-800',
      follow_up: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleSendMessage = async () => {
    try {
      if (isCreatingNew) {
        // Create new order
        if (!newOrderEmail.trim() || !newOrderContent.trim()) {
          toast.error('Please enter customer email and order content')
          return
        }

        const fullContent = `From: ${newOrderEmail}\n\n${newOrderContent}`

        await apiService.processEmail(fullContent)

        toast.success('New order created successfully!')
        setNewOrderEmail('')
        setNewOrderContent('')
        setIsCreatingNew(false)
        refetchOrders()
      } else {
        // Send message to existing order
        if (!messageContent.trim()) {
          toast.error('Please enter a message')
          return
        }

        if (!selectedOrderId || selectedOrderId === '') {
          toast.error('Please select an order first')
          return
        }

        console.log('Sending message to order:', selectedOrderId, 'with content:', messageContent.substring(0, 50) + '...')

        await apiService.processEmail(messageContent, undefined, parseInt(selectedOrderId))

        toast.success('Message sent to order successfully!')
        setMessageContent('')
        refetchEmails()
        refetchOrders()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const handleCreateNewOrder = () => {
    setIsCreatingNew(true)
    setSelectedOrderId('')
    setMessageContent('')
  }

  const handleCancelNewOrder = () => {
    setIsCreatingNew(false)
    setNewOrderEmail('')
    setNewOrderContent('')
    if (orders && orders.length > 0) {
      setSelectedOrderId(orders[0].id.toString())
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Order Conversation Simulator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Simulate customer conversations with orders for testing and development
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex space-x-4">
            <Button
              variant={!isCreatingNew ? "default" : "outline"}
              onClick={() => setIsCreatingNew(false)}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Talk to Existing Order
            </Button>
            <Button
              variant={isCreatingNew ? "default" : "outline"}
              onClick={handleCreateNewOrder}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
          </div>

          {/* Order Selection */}
          {!isCreatingNew && (
            <div>
              <Label htmlFor="orderSelect" className="text-base font-medium">Select Order to Communicate With</Label>
              {ordersLoading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : orders && orders.length > 0 ? (
                <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an order..." />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        Order #{order.id} - {order.customer_name || order.customer_email} ({getStatusBadge(order.status)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg mt-2">
                  <p>No active orders found.</p>
                  <p className="text-sm mt-2">Create a new order or process some emails first.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleCreateNewOrder}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Order
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* New Order Creation */}
          {isCreatingNew && (
            <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-semibold flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create New Order
              </h3>

              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={newOrderEmail}
                  onChange={(e) => setNewOrderEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="orderContent">Order Content</Label>
                <Textarea
                  id="orderContent"
                  placeholder="Describe the customer's order inquiry..."
                  value={newOrderContent}
                  onChange={(e) => setNewOrderContent(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include product names, quantities, delivery requirements, etc.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendMessage} disabled={!newOrderEmail.trim() || !newOrderContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
                <Button variant="outline" onClick={handleCancelNewOrder}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Order Details and Conversation */}
          {selectedOrderId && !isCreatingNew && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5" />
                    <span className="text-lg font-semibold">Order #{selectedOrder?.id}</span>
                    {selectedOrder && getStatusBadge(selectedOrder.status)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/orders/${selectedOrder?.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Customer:</strong> {selectedOrder?.customer_name || 'Unknown'}</div>
                  <div><strong>Email:</strong> {selectedOrder?.customer_email}</div>
                  <div><strong>Items:</strong> {selectedOrder?.line_items?.length || 0} items</div>
                  <div><strong>Created:</strong> {selectedOrder ? new Date(selectedOrder.created_at).toLocaleDateString() : ''}</div>
                </div>
              </div>

              {/* Email Conversation */}
              {emailChain && emailChain.length > 0 && (
                <div>
                  <div className="border rounded-lg">
                    <button
                      onClick={() => setEmailAccordionOpen(!emailAccordionOpen)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-semibold">Conversation History</span>
                        <Badge variant="secondary" className="ml-2">
                          {emailChain.length} message{emailChain.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      {emailAccordionOpen ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {emailAccordionOpen && (
                      <div className="border-t">
                        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                          {emailChain
                            .sort((a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime())
                            .map((email) => (
                              <div key={email.id} className={`p-4 rounded-lg border ${
                                email.direction === 'incoming'
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-green-50 border-green-200'
                              }`}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Mail className={`h-4 w-4 ${email.direction === 'incoming' ? 'text-blue-600' : 'text-green-600'}`} />
                                    <span className="font-medium">
                                      {email.direction === 'incoming' ? 'Customer' : 'Sales Team'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(email.received_at).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm mb-2">
                                  <strong>Subject:</strong> {email.subject || 'No subject'}
                                </div>
                                <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                                  {email.body}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items Summary */}
              {selectedOrder && selectedOrder.line_items && selectedOrder.line_items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.line_items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div>
                          <div className="font-medium">{item.requested_name}</div>
                          <div className="text-sm text-gray-600">
                            Quantity: {item.requested_quantity}
                            {item.product_name && item.product_name !== item.requested_name && (
                              <span> → {item.product_name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.unit_price && (
                            <span className="text-sm font-medium">${item.unit_price}</span>
                          )}
                          <Badge variant={item.status === 'VALIDATED' ? 'default' : 'secondary'}>
                            {item.status || 'UNKNOWN'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Message */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Customer Message
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message">Customer Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Type a message as if you're the customer responding to this order..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This will be processed as a customer email to the selected order, allowing you to test clarifications, updates, and follow-ups.
                    </p>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send as Customer Message
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
