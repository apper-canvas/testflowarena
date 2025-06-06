import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The assessment page you are looking for doesn't exist or has been moved to a different location.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound