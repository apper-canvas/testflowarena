import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import QuestionBankPage from './pages/QuestionBankPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionBankPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App