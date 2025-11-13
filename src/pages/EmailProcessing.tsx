import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Order, EmailLog } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Mail, Send, MessageSquare, Eye, CheckCircle, FileText, MessageCircle, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export function EmailProcessing() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [responseContent, setResponseContent] = useState('')
  const [subject, setSubject] = useState('')
  const [emailAccordionOpen, setEmailAccordionOpen] = useState(true)

  // Get all orders with processing results
  const { data: orders, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['all-processed-orders'],
    queryFn: async () => {
      const response = await apiService.getOrders(undefined, 100)
      return response.data.filter((order: Order) =>
        order.status !== 'completed' // Show all except completed
      ) as Order[]
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Get email chain for selected order
  const { data: emailChain } = useQuery({
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



  // Update selected order when orders load or in demo mode
  useEffect(() => {
    if (location.state?.demoMode && location.state?.newOrderId) {
      // In demo mode, automatically select the newly created order
      setSelectedOrderId(location.state.newOrderId.toString())
    } else if (orders && orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id.toString())
    }
  }, [orders, selectedOrderId, location.state])

  // Refetch orders when in demo mode to ensure we have the latest data
  useEffect(() => {
    if (location.state?.demoMode) {
      // Small delay to ensure the order was created
      const timer = setTimeout(() => {
        refetch()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [location.state?.demoMode, refetch])

  // Update subject when email chain changes
  useEffect(() => {
    if (emailChain && emailChain.length > 0) {
      // Get the latest incoming email
      const latestIncomingEmail = emailChain
        .filter(email => email.direction === 'incoming')
        .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())[0]

      if (latestIncomingEmail?.subject) {
        // Generate reply subject
        const originalSubject = latestIncomingEmail.subject.trim()
        let replySubject = originalSubject

        // Add "Re:" prefix if not already present
        if (!originalSubject.toLowerCase().startsWith('re:')) {
          replySubject = `Re: ${originalSubject}`
        }

        setSubject(replySubject)
      } else {
        // Fallback subject
        setSubject('Re: Order Inquiry')
      }
    } else {
      // No email chain yet
      setSubject('')
    }
  }, [emailChain])

  const selectedOrder = orders?.find(order => order.id.toString() === selectedOrderId)

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      inquiry: 'status-pending',
      in_process: 'status-processing',
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



  const handleGenerateResponse = async () => {
    if (!selectedOrder) {
      toast.error('Please select an order first')
      return
    }

    try {
      // Use AI-powered response generation
      const response = await apiService.generateAIResponse(selectedOrder.id)

      if (response.data) {
        setResponseContent(response.data.body || 'Response generation failed')
        if (response.data.subject) {
          setSubject(response.data.subject)
        }
        toast.success('AI-generated response created successfully!')
      } else {
        toast.error('Failed to generate AI response')
      }
    } catch (error) {
      console.error('Error generating AI response:', error)
      toast.error('AI response generation failed. Check your Gemini API key and try again.')
    }
  }

  const handleSendResponse = async () => {
    if (!responseContent.trim() || !selectedOrder) {
      toast.error('Please enter a response and select an order')
      return
    }

    try {
      // Get the latest incoming email Message-ID for threading
      const latestIncomingEmail = emailChain
        ?.filter(email => email.direction === 'incoming')
        .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())[0]

      // Send response with threading information
      await apiService.sendEmailResponse(
        selectedOrder.id,
        responseContent,
        subject || undefined, // subject (user can edit or use auto-generated)
        latestIncomingEmail?.email_id // reply_to_message_id for threading
      )

      toast.success('Response sent successfully!')
      setResponseContent('')
      setSubject('') // Clear subject too

      // Refetch orders and invalidate email chain to update the UI
      refetch()
      queryClient.invalidateQueries({ queryKey: ['email-chain', selectedOrderId] })
    } catch {
      toast.error('Failed to send response')
    }
  }





  return (
    <div className="space-y-6">

      {/* Unified Email Processing Card */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Communication Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Order Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Order to Communicate With</h3>
            {ordersLoading ? (
              <div className="text-center py-4">Loading orders...</div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                <div className="w-full max-w-md">
                  <Label htmlFor="orderSelect">Choose an order</Label>
                  <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                    <SelectTrigger>
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
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No orders requiring communication found.</p>
                <p className="text-sm mt-2">Process some emails to create orders that need responses.</p>
              </div>
            )}
          </div>



          {/* Order Communication View */}
          {selectedOrderId && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-lg font-semibold">Order #{selectedOrder?.id}</span>
                    {selectedOrder && getStatusBadge(selectedOrder.status)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${selectedOrder?.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Order Details
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Customer:</strong> {selectedOrder?.customer_name || 'Unknown'}</div>
                  <div><strong>Email:</strong> {selectedOrder?.customer_email}</div>
                  <div><strong>Items:</strong> {selectedOrder?.line_items?.length || 0} items</div>
                  <div><strong>Created:</strong> {selectedOrder ? new Date(selectedOrder.created_at).toLocaleDateString() : ''}</div>
                </div>
              </div>

              {/* Email Conversation Accordion */}
              {emailChain && emailChain.length > 0 && (
                <div className="border-t pt-6">
                  <div className="border rounded-lg">
                    <button
                      onClick={() => setEmailAccordionOpen(!emailAccordionOpen)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-semibold">Email Conversation</span>
                        <Badge variant="secondary" className="ml-2">
                          {emailChain.length} email{emailChain.length !== 1 ? 's' : ''}
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
                              <div key={email.id} className={`p-4 rounded-lg border ${email.direction === 'incoming'
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

              {/* AI Processing Results */}
              {selectedOrder && selectedOrder.line_items && selectedOrder.line_items.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    AI Processing Results
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2">Extracted Order Items:</h4>
                    <div className="space-y-2">
                      {selectedOrder.line_items.map((item, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.requested_name}</span>
<Badge variant={item.status === 'VALIDATED' ? 'default' : 'secondary'}>
  {item.status === 'NOT_FOUND' ? 'Not Found' :
   item.status === 'MOQ_NOT_MET' ? 'Min Qty Not Met' :
   item.status === 'INSUFFICIENT_STOCK' ? 'Out of Stock' :
   item.status === 'MULTIPLE_MATCHES_FOUND' ? 'Ambiguous' :
   item.status || 'Processing'}
</Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Quantity: {item.requested_quantity}
                            {item.product_name && item.product_name !== item.requested_name && (
                              <span> → {item.product_name}</span>
                            )}
                            {item.unit_price && (
                              <span> | Price: ${item.unit_price}</span>
                            )}
                          </div>
                          {item.issue && (
                            <div className="text-sm text-red-600 mt-1">
                              Issue: {item.issue}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Workflow Tasks */}
              {selectedOrder && selectedOrder.workflow_tasks && selectedOrder.workflow_tasks.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Workflow Processing</h3>
                  <div className="space-y-2">
                    {selectedOrder.workflow_tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div>
                          <div className="font-medium">{task.task_type.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-600">
                            Created by {task.created_by} • {new Date(task.created_at).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'failed' ? 'destructive' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Actions - More Prominent */}
              {selectedOrder && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Follow-up Actions
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <p className="text-sm text-blue-700">
                      Use these controls to send email responses and manage order status for customer follow-up.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {/* Email Composition Section */}
                    {selectedOrder && (
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center text-blue-800">
                          <Mail className="h-4 w-4 mr-2" />
                          Compose Email Response
                        </h4>

                        {/* To Field */}
                        <div>
                          <Label htmlFor="email-to" className="text-sm font-medium">To:</Label>
                          <Input
                            id="email-to"
                            value={selectedOrder.customer_email || ''}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>

                        {/* Subject Field */}
                        <div>
                          <Label htmlFor="email-subject" className="text-sm font-medium">Subject:</Label>
                          <Input
                            id="email-subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject..."
                            className="bg-white"
                          />
                        </div>

                        {/* Body Field */}
                        <div>
                          <Label htmlFor="email-body" className="text-sm font-medium">Message:</Label>
                          <Textarea
                            id="email-body"
                            placeholder="Type your email message to the customer..."
                            value={responseContent}
                            onChange={(e) => setResponseContent(e.target.value)}
                            rows={6}
                            className="bg-white font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4 border-t">
                      {/* Primary Actions Row */}
                      <div className="flex flex-wrap gap-2">
                        {/* Send Response */}
                        <Button
                          onClick={handleSendResponse}
                          disabled={!responseContent.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>

                        {/* Generate Response */}
                        <Button
                          onClick={handleGenerateResponse}
                          variant="outline"
                          disabled={!selectedOrder || selectedOrder.status === 'inquiry'}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Generate Response
                        </Button>

                        {/* Process Order */}
                        {selectedOrder.status === 'inquiry' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiService.updateOrderStatus(selectedOrder.id, 'in_process', 'Starting processing')
                                toast.success('Order processing started!')
                                refetch()
                                queryClient.invalidateQueries({ queryKey: ['email-chain', selectedOrderId] })
                              } catch {
                                toast.error('Failed to start processing')
                              }
                            }}
                            variant="outline"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Start Processing
                          </Button>
                        )}

                        {/* Validate Inventory */}
                        {(selectedOrder.status === 'in_process' || selectedOrder.status === 'db_check') && (
                          <Button
                            onClick={() => apiService.processWorkflow()}
                            variant="outline"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Validate Inventory
                          </Button>
                        )}
                      </div>

                      {/* Secondary Actions Row */}
                      <div className="flex flex-wrap gap-2">
                        {/* Mark for Follow-up */}
                        {selectedOrder.status === 'in_process' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiService.updateOrderStatus(selectedOrder.id, 'follow_up', 'Ready for follow-up')
                                toast.success('Order marked for follow-up!')
                                refetch()
                                queryClient.invalidateQueries({ queryKey: ['email-chain', selectedOrderId] })
                              } catch {
                                toast.error('Failed to mark for follow-up')
                              }
                            }}
                            variant="outline"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Mark for Follow-up
                          </Button>
                        )}

                        {/* Generate PDF - Show for more statuses */}
                        {(selectedOrder.status === 'db_check' || selectedOrder.status === 'response' || selectedOrder.status === 'follow_up') && (
                          <Button
                            onClick={() => {/* TODO: Implement PDF generation */ }}
                            variant="outline"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Generate PDF
                          </Button>
                        )}

                        {/* Approve Order - Show when approval is required and not yet approved */}
                        {selectedOrder.approval_required && !selectedOrder.approved_by && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiService.updateOrderStatus(selectedOrder.id, 'response', 'Order approved by manager')
                                toast.success('Order approved successfully!')

                                // Refresh orders list and email chain immediately
                                await refetch()
                                queryClient.invalidateQueries({ queryKey: ['email-chain', selectedOrderId] })

                                // Trigger workflow processing to continue after approval
                                try {
                                  await apiService.processWorkflow()
                                  toast.success('Workflow processing started!')
                                } catch (workflowError) {
                                  console.error('Workflow processing failed:', workflowError)
                                  // Don't show error for workflow - it might still work
                                }
                              } catch (error) {
                                console.error('Approval failed:', error)
                                toast.error('Failed to approve order')
                              }
                            }}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Order
                          </Button>
                        )}

                        {/* Mark Completed - Always show for processed orders */}
                        {(selectedOrder.status === 'response' || selectedOrder.status === 'follow_up' || selectedOrder.status === 'db_check' || selectedOrder.status === 'in_process') && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiService.updateOrderStatus(selectedOrder.id, 'completed', 'Order completed')
                                toast.success('Order marked as completed successfully!')
                                // Refresh the orders list and email chain
                                refetch()
                                queryClient.invalidateQueries({ queryKey: ['email-chain', selectedOrderId] })
                                // Navigate to completed orders page after a short delay
                                setTimeout(() => {
                                  navigate('/completed-orders')
                                }, 1500)
                              } catch {
                                toast.error('Failed to mark order as completed')
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
