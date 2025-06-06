import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import assessmentService from '../services/api/assessmentService'
import candidateService from '../services/api/candidateService'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const MainFeature = ({ assessments: initialAssessments, candidates: initialCandidates }) => {
  const [assessments, setAssessments] = useState(initialAssessments || [])
  const [candidates, setCandidates] = useState(initialCandidates || [])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isLiveTest, setIsLiveTest] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [activeView, setActiveView] = useState('calendar')

  useEffect(() => {
    setAssessments(initialAssessments || [])
    setCandidates(initialCandidates || [])
  }, [initialAssessments, initialCandidates])

  useEffect(() => {
    let interval
    if (isLiveTest && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isLiveTest, timeRemaining])

  const startAssessment = async (assessment) => {
    try {
      setSelectedAssessment(assessment)
      setCurrentQuestion(0)
      setAnswers({})
      setTimeRemaining(assessment.duration * 60) // Convert minutes to seconds
      setIsLiveTest(true)
      setShowResults(false)
      toast.success(`Started ${assessment.type}: ${assessment.title}`)
    } catch (error) {
      toast.error('Failed to start assessment')
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleTestSubmit = async () => {
    try {
      setIsLiveTest(false)
      
      // Calculate score
      const totalQuestions = selectedAssessment.questions.length
      const correctAnswers = selectedAssessment.questions.filter(q => 
        answers[q.id] === q.correctAnswer
      ).length
      const score = Math.round((correctAnswers / totalQuestions) * 100)

      // Update candidate with results
      const candidateToUpdate = candidates.find(c => 
        c.assessments.some(a => a.assessmentId === selectedAssessment.id)
      )

      if (candidateToUpdate) {
        const updatedCandidate = {
          ...candidateToUpdate,
          score: score,
          status: 'completed'
        }
        await candidateService.update(candidateToUpdate.id, updatedCandidate)
        
        setCandidates(prev => prev.map(c => 
          c.id === candidateToUpdate.id ? updatedCandidate : c
        ))
      }

      setShowResults(true)
      toast.success(`Assessment completed! Score: ${score}%`)
    } catch (error) {
      toast.error('Failed to submit assessment')
    }
  }

  const rescheduleAssessment = async (assessmentId, newDate) => {
    try {
      const assessment = assessments.find(a => a.id === assessmentId)
      if (assessment) {
        const updatedAssessment = {
          ...assessment,
          scheduledDate: newDate,
          status: 'scheduled'
        }
        await assessmentService.update(assessmentId, updatedAssessment)
        
        setAssessments(prev => prev.map(a => 
          a.id === assessmentId ? updatedAssessment : a
        ))
        
        toast.success('Assessment rescheduled successfully')
      }
    } catch (error) {
      toast.error('Failed to reschedule assessment')
    }
  }

  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getDateLabel = (date) => {
    if (isToday(new Date(date))) return 'Today'
    if (isTomorrow(new Date(date))) return 'Tomorrow'
    return format(new Date(date), 'MMM dd')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (isLiveTest && selectedAssessment) {
    const currentQ = selectedAssessment.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100

    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-8">
        {/* Test Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
              {selectedAssessment.title}
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Question {currentQuestion + 1} of {selectedAssessment.questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <ApperIcon name="Clock" size={16} />
              <span className="font-mono font-bold">{formatTimeRemaining(timeRemaining)}</span>
            </div>
            
            <button
              onClick={handleTestSubmit}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={32} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Assessment Completed!
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Your responses have been submitted successfully.
            </p>
            <button
              onClick={() => {
                setIsLiveTest(false)
                setSelectedAssessment(null)
                setShowResults(false)
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        ) : (
          /* Question Content */
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  {currentQ?.content}
                </h4>
                
                {currentQ?.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {currentQ?.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-surface-700 dark:text-surface-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ?.type === 'text' && (
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={6}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => navigateQuestion('prev')}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                  Previous
                </button>
                
                <button
                  onClick={() => navigateQuestion('next')}
                  disabled={currentQuestion === selectedAssessment.questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ApperIcon name="ChevronRight" size={16} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 bg-surface-100 dark:bg-surface-700 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveView('calendar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'calendar'
              ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-sm'
              : 'text-surface-600 dark:text-surface-400'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setActiveView('candidates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'candidates'
              ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-sm'
              : 'text-surface-600 dark:text-surface-400'
          }`}
        >
          Candidate Management
        </button>
      </div>

      {activeView === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Assessment Calendar
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                  <ApperIcon name="ChevronLeft" size={20} className="text-surface-600 dark:text-surface-400" />
                </button>
                <span className="text-surface-900 dark:text-surface-100 font-medium px-4">
                  {format(new Date(), 'MMMM yyyy')}
                </span>
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                  <ApperIcon name="ChevronRight" size={20} className="text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>

            {/* Upcoming Assessments */}
            <div className="space-y-3">
              {assessments?.slice(0, 5)?.map((assessment) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      assessment.type === 'test' ? 'bg-primary/10' : 'bg-secondary/10'
                    }`}>
                      <ApperIcon 
                        name={assessment.type === 'test' ? 'FileText' : 'Video'} 
                        size={20} 
                        className={assessment.type === 'test' ? 'text-primary' : 'text-secondary'} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                        {assessment.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {getDateLabel(assessment.scheduledDate)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {assessment.status === 'active' && (
                      <button
                        onClick={() => startAssessment(assessment)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Start
                      </button>
                    )}
                    <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                      <ApperIcon name="MoreHorizontal" size={16} className="text-surface-600 dark:text-surface-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
                <ApperIcon name="Plus" size={20} className="text-primary" />
                <span className="font-medium text-primary">Create New Test</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-xl hover:bg-secondary/10 transition-colors">
                <ApperIcon name="Calendar" size={20} className="text-secondary" />
                <span className="font-medium text-secondary">Schedule Interview</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors">
                <ApperIcon name="Users" size={20} className="text-accent" />
                <span className="font-medium text-accent">Invite Candidates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'candidates' && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Candidate Management
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                Add Candidate
              </button>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Name</th>
                  <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Email</th>
                  <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Status</th>
                  <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Score</th>
                  <th className="text-left py-4 px-2 text-surface-600 dark:text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates?.map((candidate) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {candidate.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {candidate.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-surface-600 dark:text-surface-400">
                      {candidate.email}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {candidate.score ? (
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {candidate.score}%
                        </span>
                      ) : (
                        <span className="text-surface-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                          <ApperIcon name="Eye" size={16} className="text-surface-600 dark:text-surface-400" />
                        </button>
                        <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                          <ApperIcon name="Edit" size={16} className="text-surface-600 dark:text-surface-400" />
                        </button>
                        <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors">
                          <ApperIcon name="Mail" size={16} className="text-surface-600 dark:text-surface-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainFeature