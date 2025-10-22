export const API_SERVER_BASE_URL = `https://ppgc-fastapi-latest.onrender.com`



export const uiRoute = {
    "home": { name: "Home", route: " / " },
    "login": { name: "Login", route: "/auth/login " },
    "verifyEmail": { name: "Verify Email", route: "verify-email" },
    "authSuccess": { appRoute: "registration-succes", pageRoute: "/auth/registration-succes" }
}
export const apiRoute = {
    // POST_Auth routes
    authLogin: { name: "login", route: `${API_SERVER_BASE_URL}/auth/login` },
    authRegister: { name: "register", route: `${API_SERVER_BASE_URL}/auth/register` },
    requestEmailVerificationCode: { name: "requestEmailVerificationCode", route: `${API_SERVER_BASE_URL}/auth/request-email-verification-code` },
    confirmEmailVerificationCode: { name: "confirmEmailVerificationCode", route: `${API_SERVER_BASE_URL}/auth/confirm-email-verification-code` },
    passeordResetRequest: { name: "passswordResetRequest", route: `${API_SERVER_BASE_URL}/auth/send-password-reset-mail` },
    passwordReset_PinResetConfirm: { name: "passwordReset_PinResetConfirm", route: `${API_SERVER_BASE_URL}/auth/change-pin-or-password` },
}