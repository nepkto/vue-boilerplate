class Error {
  constructor() {
    this.vErrs = {};
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field
   */
  get(field) {
    if (this.vErrs[field]) {
      return this.vErrs[field][0];
    }
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   */
//   has(field) {
//     return this.vErrs.hasOwnProperty(field);
//   }

  /**
   * Record the new errors.
   *
   * @param {object} errors
   */
  record(errors) {
    this.vErrs = errors;
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear(field) {
    if (field) {
      delete this.vErrs[field];

      return;
    }

    this.vErrs = {};
  }
}

export default Error;
