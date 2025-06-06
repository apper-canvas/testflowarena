import questionMockData from '../mockData/question.json'

class QuestionService {
  constructor() {
    this.data = [...questionMockData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return this.data.map(item => ({ ...item }))
  }

  async getById(id) {
    await this.delay()
    const item = this.data.find(question => question.id === id)
    return item ? { ...item } : null
  }

  async create(questionData) {
    await this.delay()
    const newQuestion = {
      ...questionData,
      id: `question_${Date.now()}`,
      points: questionData.points || 1
    }
    this.data.push(newQuestion)
    return { ...newQuestion }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.data.findIndex(question => question.id === id)
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updateData }
      return { ...this.data[index] }
    }
    throw new Error('Question not found')
  }

  async delete(id) {
    await this.delay()
    const index = this.data.findIndex(question => question.id === id)
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Question not found')
  }
async getByType(type) {
    await this.delay()
    return this.data
      .filter(question => question.type === type)
      .map(item => ({ ...item }))
  }

  async getByCategory(category) {
    await this.delay()
    return this.data
      .filter(question => question.category === category)
      .map(item => ({ ...item }))
  }

  async getByDifficulty(difficulty) {
    await this.delay()
    return this.data
      .filter(question => question.difficulty === difficulty)
      .map(item => ({ ...item }))
  }

  async search(searchTerm, filters = {}) {
    await this.delay()
    let filteredData = [...this.data]

    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredData = filteredData.filter(question =>
        question.content.toLowerCase().includes(term) ||
        (question.options && question.options.some(option => 
          option.toLowerCase().includes(term)
        ))
      )
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(question => 
        question.category === filters.category
      )
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      filteredData = filteredData.filter(question => 
        question.difficulty === filters.difficulty
      )
    }

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filteredData = filteredData.filter(question => 
        question.type === filters.type
      )
    }

    return filteredData.map(item => ({ ...item }))
  }

  async getCategories() {
    await this.delay()
    const categories = [...new Set(this.data.map(q => q.category))]
    return categories.sort()
  }

  async getDifficulties() {
    await this.delay()
    return ['Easy', 'Medium', 'Hard']
  }

  async getTypes() {
    await this.delay()
    const types = [...new Set(this.data.map(q => q.type))]
    return types.sort()
  }
}

export default new QuestionService()