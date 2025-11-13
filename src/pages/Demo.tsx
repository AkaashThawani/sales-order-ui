import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { apiService } from '../lib/api'
import {
  ArrowLeft,
  RefreshCw,
  Settings,
  Play,
  TrendingUp,
  Clock
} from 'lucide-react'

export function Demo() {
  const navigate = useNavigate()
  const [emailContent, setEmailContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const resetDemo = () => {
    setEmailContent('')
    setSelectedTemplate(null)
  }

  const handleProcessEmail = async () => {
    try {
      // Process the email and create a new order using the API service
      const response = await apiService.processEmail(emailContent)

      // Navigate to email processing with the newly created order
      navigate('/email-processing', {
        state: {
          demoMode: true,
          newOrderId: response.data.id,
          emailContent: emailContent
        }
      })
    } catch (error) {
      console.error('Error processing email:', error)
      alert('Failed to process email. Make sure the backend is running and try again.')
    }
  }

  const sampleEmails = [
    {
      id: 'large-order',
      title: 'Large Order',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'from-blue-500 to-indigo-600',
      content: `Hi Sales Team,

I would like to place a large order for our manufacturing facility. These are for our production line expansion:

- 25 Desk TRÄNHOLM 19
- 15 Desk NORDMARK 476
- 10 Desk VIKTSTA 642

Please deliver to:
123 Industrial Boulevard
Business City, USA 67890

Contact: procurement@company.com
Phone: (555) 123-4567

We need these within 2 weeks. Please confirm availability and pricing.

Best regards,
Operations Manager`
    },
    {
      id: 'small-order',
      title: 'Small Order',
      icon: <Settings className="h-4 w-4" />,
      color: 'from-emerald-500 to-teal-600',
      content: `Hello,

We need 3 professional-grade tools for our workshop:
- Coffee HEMNTORP 601
- Coffee LUNDMARK 201
- Coffee VIKTBERG 211

Please send to:
456 Main Street
Smalltown, USA 12345

Contact: john@workshop.com

Thanks!
John Smith`
    },
    {
      id: 'urgent-order',
      title: 'Urgent Order',
      icon: <Clock className="h-4 w-4" />,
      color: 'from-orange-500 to-red-600',
      content: `Dear Sales Team,

URGENT: We need to place an order for our production line expansion. These are critical for our operations and we need them ASAP.

- 25 Desk TRÄNHOLM 19
- 15 Desk NORDMARK 476
- 10 Desk VIKTSTA 642

Delivery address:
789 Factory Road
Industrial Park, USA 99999

Contact: operations@factory.com
Phone: (555) 987-6543

Please confirm availability and provide expedited shipping options.

Best regards,
Operations Manager`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Email Processing Demo
              </h1>
              <p className="text-sm text-gray-600">Experience intelligent automation</p>
            </div>

            <Button
              variant="outline"
              onClick={resetDemo}
              className="hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Demo Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Left Column - Sample Email Templates */}
            <div className="lg:w-[30%] space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose a Sample Email</h3>

              <div className="space-y-4">
                {sampleEmails.map((email) => (
                  <button
                    key={email.id}
                    className={`group w-full p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg text-left ${
                      selectedTemplate === email.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => {
                      setEmailContent(email.content)
                      setSelectedTemplate(email.id)
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${email.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <div className="text-white">{email.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{email.title}</h4>
                        <p className="text-sm text-gray-600">Click to load template</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {email.content.substring(0, 80)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Email Input */}
            <div className="lg:w-[70%] space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedTemplate ? 'Edit the template or process it as-is' : 'Or Paste Your Email'}
              </h3>

              <div className="space-y-6">
                <Textarea
                  value={emailContent}
                  onChange={(e) => {
                    setEmailContent(e.target.value)
                    setSelectedTemplate(null)
                  }}
                  placeholder="Paste customer email content here...

Example:
Hi Sales Team,

I need to order 50 industrial widgets for our manufacturing facility.
Please deliver to 123 Main St, City, State 12345.
Contact: orders@company.com

Thanks!"
                  rows={18}
                  className="w-full resize-none border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                />

                {/* Process Button */}
                {emailContent.trim() && (
                  <div className="mt-8">
                    <Button
                      onClick={handleProcessEmail}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                      Process Email with AI
                      <div className="ml-3 text-sm opacity-90">→</div>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
