import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TimerDisplay from '@/components/molecules/TimerDisplay';
import ProgressBar from '@/components/molecules/ProgressBar';

const LiveAssessment = ({ selectedAssessment, onAssessmentComplete, candidates, onCandidateUpdate }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(selectedAssessment.duration * 60);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        let interval;
        if (timeRemaining > 0 && !showResults) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleTestSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timeRemaining, showResults]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const navigateQuestion = (direction) => {
        if (direction === 'next' && currentQuestion < selectedAssessment.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else if (direction === 'prev' && currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleTestSubmit = async () => {
        try {
            // Calculate score
            const totalQuestions = selectedAssessment.questions.length;
            const correctAnswers = selectedAssessment.questions.filter(q =>
                answers[q.id] === q.correctAnswer
            ).length;
            const score = Math.round((correctAnswers / totalQuestions) * 100);

            // Update candidate with results
            const candidateToUpdate = candidates.find(c =>
                c.assessments.some(a => a.assessmentId === selectedAssessment.id)
            );

            if (candidateToUpdate) {
                const updatedCandidate = {
                    ...candidateToUpdate,
                    score: score,
                    status: 'completed'
                };
                await onCandidateUpdate(candidateToUpdate.id, updatedCandidate);
            }

            setShowResults(true);
            toast.success(`Assessment completed! Score: ${score}%`);
        } catch (error) {
            toast.error('Failed to submit assessment');
        }
    };

    const currentQ = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;

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
                    <TimerDisplay timeRemaining={timeRemaining} />

                    <Button
                        onClick={handleTestSubmit}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Submit Test
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <ProgressBar progress={progress} />
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
                    <Button
                        onClick={onAssessmentComplete}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Back to Dashboard
                    </Button>
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
                                            <Input
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
                                <Input
                                    type="textarea"
                                    value={answers[currentQ.id] || ''}
                                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                    placeholder="Type your answer here..."
                                    rows={6}
                                />
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <Button
                                onClick={() => navigateQuestion('prev')}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2 px-4 py-2 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ApperIcon name="ChevronLeft" size={16} />
                                Previous
                            </Button>

                            <Button
                                onClick={() => navigateQuestion('next')}
                                disabled={currentQuestion === selectedAssessment.questions.length - 1}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ApperIcon name="ChevronRight" size={16} />
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default LiveAssessment;