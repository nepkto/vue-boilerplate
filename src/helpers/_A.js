class Authorizations {
    /**
    * Create a new authorizations instance.
    */
    constructor() {
        this.authorizations = {};
        this.userGroup = '';
    }
    
    /**
    * Get all the authorizations.
    *
    * @param {object} authorizations
    */
    all() {
        return this.authorizations;
    }
    
    /**
    * Determine if we have any authorizations.
    */
    any() {
        return Object.keys(this.authorizations).length > 0;
    }
    
    /**
    * Check User Group permissions
    */
    moduleAccess(module,action) {
        if(this.userGroup === 'super-admin'){
            return true;
        }else{
            for (var i = 0; i < this.authorizations.length; i++) {
                if(this.authorizations[i][0] == module){
                    for (var j = 0; j < this.authorizations[i][1].length; j++) {
                        if(this.authorizations[i][1][j] == action){
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }
    /**
    * Check menu wise permissions
    */
    menuAccess(menu) {
        if(this.role === 'super-admin'){
            return true;
        }else{
            for (var i = 0; i < this.authorizations.length; i++) {
                if(this.authorizations[i][0] == menu){
                    return true;
                }     
            }
            return false;
        }
    }
    /**
    * Record the new authorizations.
    *
    * @param {object} authorizations
    */
    record(authorizations) {
        this.authorizations = authorizations.authorizedPermissions;
        this.role = authorizations.role.slug;
    }
    }
    
    export default Authorizations;
    