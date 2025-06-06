import assessmentMockData from '../mockData/assessment.json'

class AssessmentService {
  constructor() {
    this.data = [...assessmentMockData]
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
    const item = this.data.find(assessment => assessment.id === id)
    return item ? { ...item } : null
  }

  async create(assessmentData) {
    await this.delay()
    const newAssessment = {
      ...assessmentData,
      id: `assessment_${Date.now()}`,
      status: assessmentData.status || 'draft'
    }
    this.data.push(newAssessment)
    return { ...newAssessment }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.data.findIndex(assessment => assessment.id === id)
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updateData }
      return { ...this.data[index] }
    }
    throw new Error('Assessment not found')
  }

  async delete(id) {
    await this.delay()
    const index = this.data.findIndex(assessment => assessment.id === id)
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Assessment not found')
  }

  async getByType(type) {
    await this.delay()
    return this.data
      .filter(assessment => assessment.type === type)
      .map(item => ({ ...item }))
  }

  async getByStatus(status) {
    await this.delay()
    return this.data
      .filter(assessment => assessment.status === status)
      .map(item => ({ ...item }))
  }
}

export default new AssessmentService()