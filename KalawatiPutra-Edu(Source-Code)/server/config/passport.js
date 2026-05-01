const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // Full URL
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('Access Token:', accessToken);
            console.log('Profile:', profile);
            try {
                const user = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                };
                return done(null, user);
            } catch (err) {
                console.error('OAuth Error:', err);
                return done(err, null);
            }
        }
    )
);