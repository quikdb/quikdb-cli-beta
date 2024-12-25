export declare enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    CONFLICT = 205,
    BAD_GATEWAY = 502,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    ALREADY_EXISTS = 409,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
export declare enum LogUsers {
    USER = "user.service",
    WEBHOOK = "webhook.service",
    AUTH = "auth.service",
    PROJECT = "project.service",
    TRANSACTION = "transaction.service",
    PAYPAL = "paypal.service",
    STRIPE = "stripe.service"
}
export declare enum LogAction {
    CREATE = "create",
    ENCRYPT_DATA = "encrypt_data",
    GET_AUTH_URL = "get_auth_url",
    CREATE_PROJECT = "create_project",
    FETCH_PROJECT = "fetch_project",
    DELETE_PROJECT = "delete_project",
    FETCH_PROJECTS = "fetch_projects",
    UPLOAD_PROJECT_CODE = "upload_project_code",
    CREATE_PROJECT_TOKEN = "create_project_token",
    DELETE_PROJECT_TOKEN = "delete_project_token",
    FETCH_PROJECT_TOKEN = "fetch_project_token",
    UPDATE = "update",
    DELETE = "delete",
    READ = "read",
    SEND = "send",
    RECEIVE = "receive",
    VERIFY = "verify",
    SIGNUP = "signup",
    ONBOARD = "onboard",
    ONBOARD_BENTO = "onboard_bento",
    SIGNIN = "signin",
    SIGNOUT = "signout",
    RESET_PASSWORD = "reset_password",
    CHANGE_PASSWORD = "change_password",
    FORGOT_PASSWORD = "forgot_password",
    RESEND_OTP = "resend_otp",
    SEND_VERIFICATION = "send_verification",
    VERIFY_OTP = "verify_otp",
    EMAIL_VERIFICATION = "email_verification",
    PHONE_VERIFICATION = "phone_verification",
    PLAID_VERIFICATION = "plaid_verification",
    ERROR = "error",
    CREATE_PAYPAL_ORDER = "create_paypal_order",
    CAPTURE_PAYPAL_ORDER = "capture_paypal_order"
}
export declare enum LogStatus {
    SUCCESS = "success",
    FAIL = "fail"
}
export type GenericType = {
    [x: string]: any;
};
export type GenericAnyType = any;
export declare enum LogLevel {
    Error = "error",
    Warn = "warn",
    Info = "info",
    Verbose = "verbose",
    Debug = "debug",
    Silly = "silly"
}
