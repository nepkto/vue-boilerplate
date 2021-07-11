class Authorizations {
  /**
   * Create a new authorizations instance.
   */
  constructor() {
    this.authorizations = {};
    this.userGroup = "";
  }

  set(userGroup, permissions){
    this.authorizations = permissions;
    this.userGroup = userGroup;
  }

  /**
   * Menu Access or Read Access
   * string menu
  **/
  checkMenuAccess(menu) {
    if(this.userGroup == 'Administration') {
        return true;
    }
    
    this.authorizations.foreach(function(auth){
      if(auth.access_page === menu) {
        return true;
      }
    })

    return false;
    
  }
 
}
export default Authorizations;
