class AmioApiError extends Error {

  constructor(amioApiError) {
    super(amioApiError.errors[0].message)
    this.amioApiError = amioApiError
  }

  jsonify() {
    return {
      timestamp: this.amioApiError.timestamp,
      status: this.amioApiError.status,
      errors: this.amioApiError.errors
    }
  }

}

module.exports = AmioApiError
