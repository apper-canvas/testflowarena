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
}

export default new QuestionService()