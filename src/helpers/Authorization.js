class Authorizations {
  /**
   * Create a new authorizations instance.
   */
  constructor() {
    this.authorizations = [];
    this.userGroup = "";
  }

  set(userGroup, permissions) {
    this.authorizations = permissions;
    this.userGroup = userGroup;
  }

  /**
   * Module Access or Read Access
   * string menu
   **/
  moduleAccess(module,accessType) {
    if (this.userGroup === "Administrator") {
      return true;
    }

    const authorizations = this.authorizations;
    if (authorizations.find((auth) => auth[accessType] === module.concat("Controller"))) {
     return true;
    }
    return false;
  }
}
export default Authorizations;
