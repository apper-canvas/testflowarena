import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import questionService from '../services/api/questionService';

const QuestionBankPage = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        type: 'multiple-choice',
        category: '',
        difficulty: 'Easy',
        points: 1,
        options: ['', '', '', ''],
        correctAnswer: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [questions, searchTerm, selectedCategory, selectedDifficulty, selectedType]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [questionsData, categoriesData, difficultiesData, typesData] = await Promise.all([
                questionService.getAll(),
                questionService.getCategories(),
                questionService.getDifficulties(),
                questionService.getTypes()
            ]);
            
            setQuestions(questionsData || []);
            setCategories(categoriesData || []);
            setDifficulties(difficultiesData || []);
            setTypes(typesData || []);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        try {
            const filtered = await questionService.search(searchTerm, {
                category: selectedCategory,
                difficulty: selectedDifficulty,
                type: selectedType
            });
            setFilteredQuestions(filtered);
        } catch (err) {
            console.error('Error filtering questions:', err);
            setFilteredQuestions(questions);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.content.trim()) {
            errors.content = 'Question content is required';
        }
        
        if (!formData.category.trim()) {
            errors.category = 'Category is required';
        }
        
        if (formData.points < 1) {
            errors.points = 'Points must be at least 1';
        }
        
        if (formData.type === 'multiple-choice') {
            const validOptions = formData.options.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                errors.options = 'At least 2 options are required';
            }
            if (!formData.correctAnswer.trim()) {
                errors.correctAnswer = 'Correct answer is required';
            } else if (!formData.options.includes(formData.correctAnswer)) {
                errors.correctAnswer = 'Correct answer must match one of the options';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        try {
            const questionData = {
                ...formData,
                options: formData.type === 'multiple-choice' ? formData.options.filter(opt => opt.trim()) : undefined
            };

            if (editingQuestion) {
                await questionService.update(editingQuestion.id, questionData);
                setQuestions(prev => prev.map(q => 
                    q.id === editingQuestion.id ? { ...q, ...questionData } : q
                ));
                toast.success('Question updated successfully');
            } else {
                const newQuestion = await questionService.create(questionData);
                setQuestions(prev => [...prev, newQuestion]);
                toast.success('Question created successfully');
            }

            resetForm();
        } catch (err) {
            toast.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            content: question.content,
            type: question.type,
            category: question.category,
            difficulty: question.difficulty,
            points: question.points,
            options: question.options || ['', '', '', ''],
            correctAnswer: question.correctAnswer || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            await questionService.delete(questionId);
            setQuestions(prev => prev.filter(q => q.id !== questionId));
            toast.success('Question deleted successfully');
        } catch (err) {
            toast.error('Failed to delete question');
        }
    };

    const resetForm = () => {
        setFormData({
            content: '',
            type: 'multiple-choice',
            category: '',
            difficulty: 'Easy',
            points: 1,
            options: ['', '', '', ''],
            correctAnswer: ''
        });
        setFormErrors({});
        setEditingQuestion(null);
        setShowForm(false);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-surface-600 dark:text-surface-400">Loading questions...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                        >
                            <ApperIcon name="ArrowLeft" size={24} className="text-surface-600 dark:text-surface-400" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                                Question Bank
                            </h1>
                            <p className="text-surface-600 dark:text-surface-400">
                                Manage your question database with categories and difficulty levels
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2"
                    >
                        <ApperIcon name="Plus" size={20} />
                        Add Question
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Difficulties</option>
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-sm text-surface-600 dark:text-surface-400">
                                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredQuestions.map(question => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12">
                            <ApperIcon name="Search" size={48} className="text-surface-400 mx-auto mb-4" />
                            <p className="text-surface-600 dark:text-surface-400">
                                No questions found matching your criteria
                            </p>
                        </div>
                    )}
                </div>

                {/* Question Form Modal */}
                {showForm && (
                    <QuestionForm
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        categories={categories}
                        difficulties={difficulties}
                        types={types}
                        editingQuestion={editingQuestion}
                        onSubmit={handleSubmit}
                        onCancel={resetForm}
                        onOptionChange={handleOptionChange}
                    />
                )}
            </div>
        </div>
    );
};

// Question Card Component
const QuestionCard = ({ question, onEdit, onDelete }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'multiple-choice': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'text': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'true-false': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
            case 'code': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 p-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                            {question.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200">
                            {question.category}
                        </span>
                        <span className="text-xs text-surface-600 dark:text-surface-400">
                            {question.points} point{question.points !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        {question.content}
                    </h3>
                    {question.options && (
                        <div className="space-y-1">
                            {question.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`text-sm p-2 rounded-lg ${
                                        option === question.correctAnswer
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-surface-50 text-surface-700 dark:bg-surface-700 dark:text-surface-300'
                                    }`}
                                >
                                    {String.fromCharCode(65 + index)}. {option}
                                    {option === question.correctAnswer && (
                                        <span className="ml-2 text-xs">✓ Correct</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => onEdit(question)}
                        className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                    >
                        <ApperIcon name="Edit" size={18} className="text-surface-600 dark:text-surface-400" />
                    </button>
                    <button
                        onClick={() => onDelete(question.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <ApperIcon name="Trash2" size={18} className="text-red-600 dark:text-red-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Question Form Component
const QuestionForm = ({ 
    formData, 
    setFormData, 
    formErrors, 
    categories, 
    difficulties, 
    types, 
    editingQuestion, 
    onSubmit, 
    onCancel, 
    onOptionChange 
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            {editingQuestion ? 'Edit Question' : 'Add New Question'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                        >
                            <ApperIcon name="X" size={24} className="text-surface-600 dark:text-surface-400" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Question Content */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Question Content *
                            </label>
                            <Input
                                type="textarea"
                                rows={3}
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Enter your question here..."
                                className={formErrors.content ? 'border-red-500' : ''}
                            />
                            {formErrors.content && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                            )}
                        </div>

                        {/* Type, Category, Difficulty, Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>
                                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className={`w-full p-4 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        formErrors.category ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'
                                    }`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                {formErrors.category && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                                    className="w-full p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Points
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.points}
                                    onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                                    className={formErrors.points ? 'border-red-500' : ''}
                                />
                                {formErrors.points && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.points}</p>
                                )}
                            </div>
                        </div>

                        {/* Options for Multiple Choice */}
                        {formData.type === 'multiple-choice' && (
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Answer Options *
                                </label>
                                <div className="space-y-3">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-surface-600 dark:text-surface-400 w-8">
                                                {String.fromCharCode(65 + index)}.
                                            </span>
                                            <Input
                                                type="text"
                                                value={option}
                                                onChange={(e) => onOptionChange(index, e.target.value)}
                                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                className="flex-1"
                                            />
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={formData.correctAnswer === option}
                                                    onChange={() => setFormData(prev => ({ ...prev, correctAnswer: option }))}
                                                    className="text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-surface-600 dark:text-surface-400">Correct</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {formErrors.options && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.options}</p>
                                )}
                                {formErrors.correctAnswer && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.correctAnswer}</p>
                                )}
                            </div>
                        )}

                        {/* Correct Answer for Text Questions */}
                        {formData.type === 'text' && (
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Sample Answer (Optional)
                                </label>
                                <Input
                                    type="textarea"
                                    rows={3}
                                    value={formData.correctAnswer}
                                    onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                    placeholder="Enter a sample answer or key points..."
                                />
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingQuestion ? 'Update Question' : 'Create Question'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default QuestionBankPage;