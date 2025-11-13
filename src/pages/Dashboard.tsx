/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Stats } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { RefreshCw, Mail, FileText, Settings, Database } from 'lucide-react'
import { toast } from 'sonner'

export function Dashboard() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await apiService.getStats()
      return response.data as Stats
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })



  const handleProcessWorkflow = async () => {
    try {
      await apiService.processWorkflow()
      toast.success('Workflow processing started')
      refetch()
    } catch (error) {
      toast.error('Failed to start workflow processing')
    }
  }

  const handleFetchEmails = async () => {
    try {
      await apiService.fetchEmails()
      toast.success('Email fetching started')
      refetch()
    } catch (error) {
      toast.error('Failed to start email fetching')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={handleFetchEmails} variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Fetch Emails
          </Button>
          <Button onClick={handleProcessWorkflow} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Process Workflow
          </Button>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Backend API</span>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database</span>
              <Badge variant="secondary">Healthy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">AI Service</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all statuses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Emails Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_emails || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total email logs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed_tasks_today || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats?.orders_by_status && Object.entries(stats.orders_by_status).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {status.replace('_', ' ')}
                </div>
                <Badge
                  variant="secondary"
                  className={`mt-1 ${
                    status === 'completed' ? 'status-completed' :
                    status === 'in_process' ? 'status-processing' :
                    status === 'pending_approval' ? 'status-pending' :
                    'status-default'
                  }`}
                >
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Classification Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Email Classification Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.emails_by_stage && Object.entries(stats.emails_by_stage).map(([stage, count]) => (
              <div key={stage} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {stage.replace('_', ' ')}
                </div>
                <Badge variant="outline" className="mt-1">
                  {stage}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleFetchEmails} className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              Fetch New Emails
            </Button>
            <Button onClick={handleProcessWorkflow} variant="secondary" className="h-20 flex-col">
              <RefreshCw className="h-6 w-6 mb-2" />
              Process Workflows
            </Button>
            <Button onClick={() => refetch()} variant="outline" className="h-20 flex-col">
              <Database className="h-6 w-6 mb-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
