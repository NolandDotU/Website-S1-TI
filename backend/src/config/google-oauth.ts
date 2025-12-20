import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "./env";
import { logger, ApiError } from "../utils";

const allowedDomain = env.ALLOWED_DOMAIN_EMAIL;

export interface GoogleOAuthUser {
  googleId: string;
  email: string;
  username: string;
  photo?: string;
  emailVerified: boolean;
  fullname: string;
}

export const isUKSWEmail = (email: string): boolean => {
  return allowedDomain.some((domain) => email.endsWith(domain));
};

export const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0].value;
          if (!email) {
            logger.error("Invalid email address");
            return done(
              ApiError.unauthorized("Invalid email address"),
              undefined
            );
          }

          // REMOVE the email domain check here since it's checked in handleGoogleAuth

          const userInfo: GoogleOAuthUser = {
            googleId: profile.id,
            email: email,
            username: profile.displayName,
            photo: profile.photos?.[0].value,
            emailVerified: profile.emails?.[0]?.verified || false,
            fullname: `${profile.name?.givenName || ""} ${
              profile.name?.familyName || ""
            }`.trim(),
          };

          return done(null, userInfo);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
};
