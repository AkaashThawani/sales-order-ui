import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { EmailLog } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { RefreshCw, Mail, Send, Download, Eye, ChevronDown, ChevronRight } from 'lucide-react'

interface Conversation {
  order_id: number
  customer_name: string
  customer_email: string
  subject: string
  latest_email_date: string
  email_count: number
  status: string
  direction: string
  workflow_stage: string
  requires_action: boolean
}

export function Emails() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [directionFilter, setDirectionFilter] = useState<string>('all')
  const [expandedConversations, setExpandedConversations] = useState<Set<number>>(new Set())

  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ['email-conversations'],
    queryFn: async () => {
      const response = await apiService.getEmailConversations()
      return response.data as Conversation[]
    },
  })



  const toggleConversation = (orderId: number) => {
    const newExpanded = new Set(expandedConversations)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedConversations(newExpanded)
  }

  const filteredConversations = conversations?.filter(conversation => {
    const statusMatch = statusFilter === 'all' || conversation.workflow_stage === statusFilter
    const directionMatch = directionFilter === 'all' || conversation.direction === directionFilter
    return statusMatch && directionMatch
  }) || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Email Conversations</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
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
        <h1 className="text-2xl font-bold">Email Conversations</h1>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{conversations?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {conversations?.filter(c => c.direction === 'incoming').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Customer Led</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {conversations?.filter(c => c.direction === 'outgoing').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Sales Led</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {conversations?.filter(c => c.requires_action).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Need Action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="w-48">
              <label className="label">Direction</label>
              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Directions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="incoming">Customer Led</SelectItem>
                  <SelectItem value="outgoing">Sales Led</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <label className="label">Workflow Stage</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="in_process">In Process</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="db_check">DB Check</SelectItem>
                  <SelectItem value="response">Response</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Accordions */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations ({filteredConversations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!filteredConversations || filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No conversations found.</p>
              <p className="text-sm mt-2">Process some emails to see conversations here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <ConversationAccordion
                  key={conversation.order_id}
                  conversation={conversation}
                  isExpanded={expandedConversations.has(conversation.order_id)}
                  onToggle={() => toggleConversation(conversation.order_id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ConversationAccordionProps {
  conversation: Conversation
  isExpanded: boolean
  onToggle: () => void
}

function ConversationAccordion({ conversation, isExpanded, onToggle }: ConversationAccordionProps) {
  const { data: emails, isLoading } = useQuery({
    queryKey: ['conversation-emails', conversation.order_id],
    queryFn: async () => {
      const response = await apiService.getOrderEmails(conversation.order_id)
      return response.data as EmailLog[]
    },
    enabled: isExpanded,
  })

  const getStatusBadge = (stage: string) => {
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
      <Badge className={statusClasses[stage as keyof typeof statusClasses] || 'status-default'}>
        {stage || 'unknown'}
      </Badge>
    )
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'incoming' ? (
      <Download className="h-4 w-4 text-blue-600" />
    ) : (
      <Send className="h-4 w-4 text-green-600" />
    )
  }

  return (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getDirectionIcon(conversation.direction)}
            <div className="text-left">
              <div className="font-medium">{conversation.customer_name || conversation.customer_email}</div>
              <div className="text-sm text-muted-foreground truncate max-w-md">
                {conversation.subject}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {conversation.email_count} email{conversation.email_count !== 1 ? 's' : ''}
            </Badge>
            {getStatusBadge(conversation.status)}
            {conversation.requires_action && (
              <Badge variant="destructive">Action Required</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {new Date(conversation.latest_email_date).toLocaleDateString()}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t">
          {isLoading ? (
            <div className="p-4">
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {emails
                ?.sort((a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime())
                .map((email) => (
                  <div key={email.id} className={`p-4 rounded-lg border ${
                    email.direction === 'incoming'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getDirectionIcon(email.direction)}
                        <span className="font-medium">
                          {email.direction === 'incoming' ? 'Customer' : 'Sales Team'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(email.received_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {email.workflow_stage ? getStatusBadge(email.workflow_stage) : (
                          <Badge variant="secondary">Not processed</Badge>
                        )}
                        <Badge variant={email.requires_action ? 'destructive' : 'default'}>
                          {email.requires_action ? 'Action Required' : 'Processed'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      <strong>Subject:</strong> {email.subject || 'No subject'}
                    </div>
                    <div className="text-sm mb-2">
                      <strong>{email.direction === 'incoming' ? 'From' : 'To'}:</strong> {email.direction === 'incoming' ? email.sender : email.recipient}
                    </div>
                    <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                      {email.body}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
