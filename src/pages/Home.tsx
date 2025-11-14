import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import {
  Mail,
  Brain,
  Settings,
  Workflow,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
  Sparkles,
  Rocket,
  Github,
  Heart
} from 'lucide-react'

export function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Processing",
      description: "Advanced machine learning extracts order details with 99% accuracy from any email format."
    },
    {
      icon: <Settings className="h-8 w-8 text-emerald-600" />,
      title: "Smart Business Rules",
      description: "Configurable approval workflows, discount rules, and validation logic adapt to your business."
    },
    {
      icon: <Workflow className="h-8 w-8 text-purple-600" />,
      title: "Automated Workflows",
      description: "End-to-end order processing from email to fulfillment with real-time status tracking."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Live Analytics",
      description: "Comprehensive dashboards with performance metrics, conversion rates, and ROI tracking."
    }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SalesFlow</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="font-medium">
                Dashboard
              </Button>
              <Button onClick={() => navigate('/demo')} className="shadow-lg">
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Sales Automation</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Transform Emails into
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Revenue
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Automate your entire sales pipeline with AI-powered email processing,
                intelligent business rules, and seamless order fulfillment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/demo')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => navigate('/dashboard')}
                >
                  View Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No Setup Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Hero Process Cards - Merged from How It Works */}
            <div className="relative">
              <div className="space-y-8">
                {/* Process Step 1 */}
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-7 w-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Email Received</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Customer sends order inquiry via email. Our system automatically detects and processes the incoming message.
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Step 2 */}
                <div className="group relative ml-8">
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:-rotate-1">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-7 w-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">AI Processing</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Advanced AI analyzes the email content, extracts order details, validates information, and applies your business rules.
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <span className="text-xs text-gray-500 font-medium">Smart</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Step 3 */}
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-7 w-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Order Fulfilled</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Order is created, customer is notified, and the entire process is tracked in real-time through your dashboard.
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        <span className="text-xs text-gray-500 font-medium">Done</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Rocket */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section - New Design Without Icons */}
      <section id="features" className="py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl mb-8">
              <Zap className="h-5 w-5" />
              <span>Complete Automation Suite</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Powerful Features for
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Modern Sales Teams
              </span>
            </h2>

            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Everything you need to automate your sales process, from email processing to order fulfillment.
            </p>
          </div>

          {/* Alternating Feature Layout */}
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`flex items-center gap-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                {/* Content Side */}
                <div className={`flex-1 space-y-6 ${index % 2 === 1 ? 'text-right' : ''}`}>
               

                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    {feature.description}
                  </p>

                </div>

                {/* Visual Side */}
                <div className="flex-1 relative">
                  <div className="relative h-80 flex items-center justify-center">
                    {/* Geometric Background Pattern */}
                    <div className="absolute inset-0">
                      <div className={`w-full h-full bg-gradient-to-br ${index === 0 ? 'from-blue-100 to-indigo-100' : index === 1 ? 'from-purple-100 to-pink-100' : index === 2 ? 'from-emerald-100 to-teal-100' : 'from-orange-100 to-yellow-100'} rounded-3xl transform rotate-3 shadow-xl`}></div>
                      <div className={`absolute inset-4 bg-gradient-to-br ${index === 0 ? 'from-blue-200 to-indigo-200' : index === 1 ? 'from-purple-200 to-pink-200' : index === 2 ? 'from-emerald-200 to-teal-200' : 'from-orange-200 to-yellow-200'} rounded-2xl transform -rotate-2 shadow-lg`}></div>
                      <div className={`absolute inset-8 bg-gradient-to-br ${index === 0 ? 'from-blue-50 to-indigo-50' : index === 1 ? 'from-purple-50 to-pink-50' : index === 2 ? 'from-emerald-50 to-teal-50' : 'from-orange-50 to-yellow-50'} rounded-xl shadow-md`}></div>
                    </div>

                    {/* Central Content */}
                    <div className="relative z-10 text-center">
                      <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-indigo-600' : index === 1 ? 'from-purple-500 to-pink-600' : index === 2 ? 'from-emerald-500 to-teal-600' : 'from-orange-500 to-yellow-600'} text-white text-3xl font-bold rounded-full shadow-2xl mb-4`}>
                        {index + 1}
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {index === 0 ? 'AI Processing' : index === 1 ? 'Smart Rules' : index === 2 ? 'Automation' : 'Analytics'}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {index === 0 ? 'Intelligent Analysis' : index === 1 ? 'Business Logic' : index === 2 ? 'Workflow Automation' : 'Performance Tracking'}
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className={`absolute top-8 right-8 w-6 h-6 bg-gradient-to-br ${index === 0 ? 'from-blue-400 to-indigo-500' : index === 1 ? 'from-purple-400 to-pink-500' : index === 2 ? 'from-emerald-400 to-teal-500' : 'from-orange-400 to-yellow-500'} rounded-full animate-bounce shadow-lg`}></div>
                    <div className={`absolute bottom-8 left-8 w-4 h-4 bg-gradient-to-br ${index === 0 ? 'from-indigo-400 to-blue-500' : index === 1 ? 'from-pink-400 to-purple-500' : index === 2 ? 'from-teal-400 to-emerald-500' : 'from-yellow-400 to-orange-500'} rounded-full animate-pulse shadow-md`} style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>







      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <p className="text-gray-300 text-sm font-medium">
                made with <Heart className="h-3 w-3 text-red-500 inline" /> by <a href="https://github.com/AkaashThawani" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">akaash thawani</a>
              </p>
              <span className="text-gray-500 text-sm">•</span>
              <p className="text-gray-400 text-sm">
                feel free to reach out
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/AkaashThawani/sales-order-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm group"
              >
                <Github className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                <span>Frontend</span>
              </a>
              <a
                href="https://github.com/AkaashThawani/sales-order-intake-automation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm group"
              >
                <Github className="h-4 w-4 group-hover:text-green-400 transition-colors" />
                <span>Backend</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
