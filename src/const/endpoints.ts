export enum ENDPOINTS {
    LOGIN = 'login', // LOGIN
    REFRESH_TOKEN = 'refreshToken', // REFRESH LOGIN TOKEN
    USERS_LIST = 'users', // GET ALL USERS
    GET_USER = 'user', // GET ONE USER
    POST_USER = 'postUser', // CREATE/EDIT USER
    DELETE_USER = 'deleteUser', // DELETE USER
    GET_ORGANIZATIONS = 'getOrganizations', // GET ALL ORGANIZATIONS & SITES & GROUPS (UN-MASKED)
    GET_SITES = 'sites', // GET ALL ORGANIZATIONS & SITES & GROUPS (UN-MASKED)
    CREATE_SITE = 'createSite',
    POST_ORGANIZATION = 'postOrganization', // CREATE/EDIT ORGANIZATION
    POST_GROUP = 'postGroup', // CREATE/EDIT GROUP
    DELETE_GROUP = 'deleteGroup', // DELETE GROUP
    DELETE_SITE = 'deleteSite',
    RESTART_BOX = 'restartBox',
    UPDATE_IO_EVENTS = 'updateioevents',
    GET_BOX_STATUS = 'getBoxStatus',
    GET_IO_EVENTS = 'getIoEvents',
    UPGRADE_BOX = 'upgradeBoxFirmware',
    
    // MASKED
    DELETE_MASKED_ITEM = 'deleteMaskedItem',
    GET_MASKED_ITEM = 'getMaskedItemKey',
    MASK_ITEM = 'maskItem',

    // EVENTS
    EVENTS = 'events',
    PROCESS_EVENT = 'processEvent',
    // STATS
    DASHBOARD_STATISTICS = 'dashboardStats',
    ASSETS_STATISTICS = 'assetsStatistics',
    // QUERY_EVENTS = 'QueryEvents',
    // UPLOAD
    UPLOAD = 'upload',
    GET_UPLOADS = 'uploads',
    FAST_RECOVERY = 'fastRecovery',

    // CONFIGURE BOX
    CONFIGURE_BOX = 'configureBox',

    // GET FILTERS
    GET_FILTERS = 'getFilters'
}