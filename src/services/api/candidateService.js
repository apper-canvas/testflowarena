import candidateMockData from '../mockData/candidate.json'

class CandidateService {
  constructor() {
    this.data = [...candidateMockData]
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
    const item = this.data.find(candidate => candidate.id === id)
    return item ? { ...item } : null
  }

  async create(candidateData) {
    await this.delay()
    const newCandidate = {
      ...candidateData,
      id: `candidate_${Date.now()}`,
      status: candidateData.status || 'invited',
      score: candidateData.score || null,
      assessments: candidateData.assessments || []
    }
    this.data.push(newCandidate)
    return { ...newCandidate }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.data.findIndex(candidate => candidate.id === id)
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updateData }
      return { ...this.data[index] }
    }
    throw new Error('Candidate not found')
  }

  async delete(id) {
    await this.delay()
    const index = this.data.findIndex(candidate => candidate.id === id)
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Candidate not found')
  }

  async getByStatus(status) {
    await this.delay()
    return this.data
      .filter(candidate => candidate.status === status)
      .map(item => ({ ...item }))
  }

  async searchByName(name) {
    await this.delay()
    return this.data
      .filter(candidate => 
        candidate.name.toLowerCase().includes(name.toLowerCase())
      )
      .map(item => ({ ...item }))
  }
}

export default new CandidateService()