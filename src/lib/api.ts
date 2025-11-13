import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const endpoints = {
  health: '/health',
  processEmail: '/api/process-email',
  fetchEmails: '/api/fetch-emails',
  processWorkflow: '/api/process-workflow',
  getOrders: '/api/orders',
  getOrder: (id: number) => `/api/orders/${id}`,
  updateOrderStatus: (id: number) => `/api/orders/${id}/status`,
  addTask: (id: number) => `/api/orders/${id}/tasks`,
  getEmails: '/api/emails',
  getStats: '/api/stats',
  // Rules endpoints
  getRules: '/api/rules',
  createRule: '/api/rules',
  getRule: (id: number) => `/api/rules/${id}`,
  updateRule: (id: number) => `/api/rules/${id}`,
  deleteRule: (id: number) => `/api/rules/${id}`,
  testRule: '/api/rules/test',
  getRuleStats: '/api/rules/stats',
};

// Types
export interface Order {
  id: number;
  customer_email: string;
  customer_name?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  delivery_address?: string;
  delivery_date?: string;
  customer_notes?: string;
  applied_rules?: any[];
  approval_required?: boolean;
  approved_by?: string;
  approved_at?: string;
  line_items: any[];
  workflow_tasks: any[];
  extracted_data?: any;
}

export interface EmailLog {
  id: number;
  email_id: string;
  direction: string;
  subject: string;
  sender: string;
  recipient: string;
  body?: string;
  workflow_stage?: string;
  intent_summary?: string;
  requires_action: boolean;
  received_at: string;
}

export interface Stats {
  total_orders: number;
  orders_by_status: Record<string, number>;
  total_emails: number;
  emails_by_stage: Record<string, number>;
  pending_tasks: number;
  completed_tasks_today: number;
}

export interface Rule {
  id: number;
  name: string;
  description: string;
  conditions: any;
  actions: any;
  priority: number;
  rule_type: string;
  is_active: boolean;
  created_at: string;
}

// API functions
export const apiService = {
  // Health check
  getHealth: () => api.get(endpoints.health),

  // Email processing
  processEmail: (emailContent: string, customerEmail?: string, orderId?: number) =>
    api.post(endpoints.processEmail, { email_content: emailContent, ...(customerEmail && { customer_email: customerEmail }), ...(orderId && { order_id: orderId }) }),

  fetchEmails: () => api.post(endpoints.fetchEmails),
  processWorkflow: () => api.post(endpoints.processWorkflow),

  // Orders
  getOrders: (status?: string, limit = 50, offset = 0) =>
    api.get(endpoints.getOrders, { params: { status, limit, offset } }),

  getOrder: (id: number) => api.get(endpoints.getOrder(id)),

  getOrderEmails: (id: number) => api.get(`/api/orders/${id}/emails`),

  updateOrderStatus: (id: number, status: string, notes?: string) =>
    api.put(endpoints.updateOrderStatus(id), { status, notes }),

  addTask: (id: number, taskType: string, parameters?: any) =>
    api.post(endpoints.addTask(id), { task_type: taskType, parameters }),

  sendEmailResponse: (orderId: number, responseContent: string, subject?: string, replyToMessageId?: string) =>
    api.post(`/api/orders/${orderId}/respond`, {
      response_content: responseContent,
      subject: subject,
      reply_to_message_id: replyToMessageId
    }),

  generateAIResponse: (orderId: number) =>
    api.post(`/api/orders/${orderId}/generate-response`),

  generatePDF: (orderId: number) =>
    api.post(`/api/orders/${orderId}/generate-pdf`),

  // Emails
  getEmails: (limit = 50, offset = 0) =>
    api.get(endpoints.getEmails, { params: { limit, offset } }),

  getEmailConversations: () =>
    api.get('/api/emails/conversations'),

  // Stats
  getStats: () => api.get(endpoints.getStats),

  // Rules
  getRules: () => api.get(endpoints.getRules),
  createRule: (rule: Omit<Rule, 'id' | 'created_at'>) => api.post(endpoints.createRule, rule),
  getRule: (id: number) => api.get(endpoints.getRule(id)),
  updateRule: (id: number, rule: Partial<Rule>) => api.put(endpoints.updateRule(id), rule),
  deleteRule: (id: number) => api.delete(endpoints.deleteRule(id)),
  testRule: (conditions: any, testMetrics: any) => api.post(endpoints.testRule, { conditions, test_metrics: testMetrics }),
  getRuleStats: () => api.get(endpoints.getRuleStats),
};
