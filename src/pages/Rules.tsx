/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import type { Rule } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { RefreshCw, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'

// Move RuleForm outside the main component to prevent re-renders
const RuleForm = ({
  ruleName, setRuleName,
  ruleDescription, setRuleDescription,
  ruleConditions, setRuleConditions,
  ruleActions, setRuleActions,
  rulePriority, setRulePriority,
  ruleType, setRuleType,
  isEditing = false,
  onCancel,
  onSubmit,
  isLoading = false
}: {
  ruleName: string, setRuleName: (value: string) => void,
  ruleDescription: string, setRuleDescription: (value: string) => void,
  ruleConditions: string, setRuleConditions: (value: string) => void,
  ruleActions: string, setRuleActions: (value: string) => void,
  rulePriority: number, setRulePriority: (value: number) => void,
  ruleType: string, setRuleType: (value: string) => void,
  isEditing?: boolean,
  onCancel: () => void,
  onSubmit: () => void,
  isLoading?: boolean
}) => (
  <div className="space-y-4">
    <div>
      <label className="label">Rule Name</label>
      <Input
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        placeholder="e.g., large_quantity_approval"
      />
    </div>

    <div>
      <label className="label">Description</label>
      <Textarea
        value={ruleDescription}
        onChange={(e) => setRuleDescription(e.target.value)}
        placeholder="Describe what this rule does"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="label">Rule Type</label>
        <Select value={ruleType} onValueChange={setRuleType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quantity">Quantity</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="label">Priority</label>
        <Input
          type="number"
          value={rulePriority}
          onChange={(e) => {
            const value = e.target.value;
            const numValue = value === '' ? 1 : parseInt(value) || 1;
            setRulePriority(Math.max(1, Math.min(10, numValue)));
          }}
          min="1"
          max="10"
        />
      </div>
    </div>

    <div>
      <label className="label">Conditions (JSON)</label>
      <Textarea
        value={ruleConditions}
        onChange={(e) => setRuleConditions(e.target.value)}
        placeholder='{"field": "total_quantity", "operator": ">", "value": 50}'
        rows={3}
      />
    </div>

    <div>
      <label className="label">Actions (JSON)</label>
      <Textarea
        value={ruleActions}
        onChange={(e) => setRuleActions(e.target.value)}
        placeholder='{"action": "require_approval", "message": "Large quantity order requires approval"}'
        rows={3}
      />
    </div>

    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isEditing ? 'Update Rule' : 'Create Rule'}
      </Button>
    </div>
  </div>
)

export function Rules() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)

  // Separate state for each form field to prevent re-renders
  const [ruleName, setRuleName] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [ruleConditions, setRuleConditions] = useState('')
  const [ruleActions, setRuleActions] = useState('')
  const [rulePriority, setRulePriority] = useState(1)
  const [ruleType, setRuleType] = useState('quantity')
  const [ruleIsActive, setRuleIsActive] = useState(true)

  const queryClient = useQueryClient()

  const { data: rules, isLoading, refetch } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await apiService.getRules()
      return response.data as Rule[]
    },
  })

  const createRuleMutation = useMutation({
    mutationFn: (ruleData: any) => apiService.createRule(ruleData),
    onSuccess: () => {
      toast.success('Rule created successfully')
      setIsCreateDialogOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => {
      toast.error('Failed to create rule')
    },
  })

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Rule> }) =>
      apiService.updateRule(id, data),
    onSuccess: () => {
      toast.success('Rule updated successfully')
      setEditingRule(null)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => {
      toast.error('Failed to update rule')
    },
  })

  const deleteRuleMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteRule(id),
    onSuccess: () => {
      toast.success('Rule deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => {
      toast.error('Failed to delete rule')
    },
  })

  const toggleRuleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      apiService.updateRule(id, { is_active }),
    onSuccess: () => {
      toast.success('Rule status updated')
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => {
      toast.error('Failed to update rule status')
    },
  })

  const resetForm = () => {
    setRuleName('')
    setRuleDescription('')
    setRuleConditions('')
    setRuleActions('')
    setRulePriority(1)
    setRuleType('quantity')
    setRuleIsActive(true)
  }

  const handleCreate = () => {
    const ruleData = {
      name: ruleName,
      description: ruleDescription,
      conditions: ruleConditions,
      actions: ruleActions,
      priority: rulePriority,
      rule_type: ruleType,
      is_active: ruleIsActive
    }
    createRuleMutation.mutate(ruleData)
  }

  const handleUpdate = () => {
    if (editingRule) {
      const ruleData = {
        name: ruleName,
        description: ruleDescription,
        conditions: ruleConditions,
        actions: ruleActions,
        priority: rulePriority,
        rule_type: ruleType,
        is_active: ruleIsActive
      }
      updateRuleMutation.mutate({ id: editingRule.id, data: ruleData })
    }
  }

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule)
    setRuleName(rule.name)
    setRuleDescription(rule.description)
    setRuleConditions(JSON.stringify(rule.conditions, null, 2))
    setRuleActions(JSON.stringify(rule.actions, null, 2))
    setRulePriority(rule.priority)
    setRuleType(rule.rule_type)
    setRuleIsActive(rule.is_active)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRuleMutation.mutate(id)
    }
  }

  const handleToggle = (rule: Rule) => {
    toggleRuleMutation.mutate({ id: rule.id, is_active: !rule.is_active })
  }



  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Business Rules</h1>
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
        <h1 className="text-2xl font-bold">Business Rules</h1>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Rule</DialogTitle>
              </DialogHeader>
              <RuleForm
                ruleName={ruleName}
                setRuleName={setRuleName}
                ruleDescription={ruleDescription}
                setRuleDescription={setRuleDescription}
                ruleConditions={ruleConditions}
                setRuleConditions={setRuleConditions}
                ruleActions={ruleActions}
                setRuleActions={setRuleActions}
                rulePriority={rulePriority}
                setRulePriority={setRulePriority}
                ruleType={ruleType}
                setRuleType={setRuleType}
                isEditing={false}
                onCancel={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
                onSubmit={handleCreate}
                isLoading={createRuleMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rules ({rules?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!rules || rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No business rules configured.</p>
              <p className="text-sm mt-2">Create rules to automate order processing.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.rule_type}</Badge>
                    </TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggle(rule)}
                        >
                          {rule.is_active ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          <RuleForm
            ruleName={ruleName}
            setRuleName={setRuleName}
            ruleDescription={ruleDescription}
            setRuleDescription={setRuleDescription}
            ruleConditions={ruleConditions}
            setRuleConditions={setRuleConditions}
            ruleActions={ruleActions}
            setRuleActions={setRuleActions}
            rulePriority={rulePriority}
            setRulePriority={setRulePriority}
            ruleType={ruleType}
            setRuleType={setRuleType}
            isEditing={true}
            onCancel={() => {
              setEditingRule(null)
              resetForm()
            }}
            onSubmit={handleUpdate}
            isLoading={updateRuleMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
