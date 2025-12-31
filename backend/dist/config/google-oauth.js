"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureGoogleOAuth = exports.isUKSWEmail = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const utils_1 = require("../utils");
const allowedDomain = env_1.env.ALLOWED_DOMAIN_EMAIL;
const isUKSWEmail = (email) => {
    return allowedDomain.some((domain) => email.endsWith(domain));
};
exports.isUKSWEmail = isUKSWEmail;
const configureGoogleOAuth = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) {
                utils_1.logger.error("Invalid email address");
                return done(utils_1.ApiError.unauthorized("Invalid email address"), undefined);
            }
            // REMOVE the email domain check here since it's checked in handleGoogleAuth
            const userInfo = {
                googleId: profile.id,
                email: email,
                username: profile.displayName,
                photo: profile.photos?.[0].value,
                emailVerified: profile.emails?.[0]?.verified || false,
                fullname: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),
            };
            return done(null, userInfo);
        }
        catch (error) {
            return done(error, undefined);
        }
    }));
};
exports.configureGoogleOAuth = configureGoogleOAuth;
//# sourceMappingURL=google-oauth.js.map