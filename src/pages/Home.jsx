import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import assessmentService from '../services/api/assessmentService'
import candidateService from '../services/api/candidateService'

const Home = () => {
  const [assessments, setAssessments] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [assessmentData, candidateData] = await Promise.all([
          assessmentService.getAll(),
          candidateService.getAll()
        ])
        setAssessments(assessmentData || [])
        setCandidates(candidateData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const stats = {
    activeTests: assessments?.filter(a => a.status === 'active')?.length || 0,
    pendingInterviews: assessments?.filter(a => a.type === 'interview' && a.status === 'scheduled')?.length || 0,
    completionRate: candidates?.length > 0 ? Math.round((candidates?.filter(c => c.status === 'completed')?.length / candidates?.length) * 100) : 0,
    totalCandidates: candidates?.length || 0
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'tests', label: 'Tests', icon: 'FileText' },
    { id: 'interviews', label: 'Interviews', icon: 'Video' },
    { id: 'candidates', label: 'Candidates', icon: 'Users' },
    { id: 'results', label: 'Results', icon: 'TrendingUp' },
    { id: 'questions', label: 'Question Bank', icon: 'HelpCircle' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-surface-600 dark:text-surface-400">Loading assessment data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 fixed h-full z-10">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">TestFlow Pro</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">Assessment Platform</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={20} />
            <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 capitalize">
                {activeTab === 'dashboard' ? 'Assessment Dashboard' : activeTab}
              </h2>
              <p className="text-surface-600 dark:text-surface-400 mt-1">
                Manage your tests and interviews efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg">
                <ApperIcon name="Plus" size={16} />
                Create Test
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors shadow-lg">
                <ApperIcon name="Calendar" size={16} />
                Schedule Interview
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Active Tests</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">{stats.activeTests}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name="FileText" size={24} className="text-primary" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Pending Interviews</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">{stats.pendingInterviews}</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Video" size={24} className="text-secondary" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Completion Rate</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">{stats.completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name="TrendingUp" size={24} className="text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">Total Candidates</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">{stats.totalCandidates}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Users" size={24} className="text-accent" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Feature Component */}
              <MainFeature assessments={assessments} candidates={candidates} />
            </motion.div>
          )}

          {activeTab !== 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-8"
            >
              <div className="text-center py-12">
                <ApperIcon name="Construction" size={64} className="text-surface-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  This section is under development. Switch to Dashboard to interact with the assessment management system.
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home