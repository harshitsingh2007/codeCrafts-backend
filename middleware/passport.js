import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModels.js";
import dotenv from "dotenv";
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.PASSPORT_CLIENT_ID,
      clientSecret:process.env.PASSPORT_CLIENT_SECRET,
      callbackURL:process.env.PASSPORT_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({email: profile.emails[0].value});
        if(user){
          return done(null, user);
        }
        else{
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,
            Identity: "Google",
            password: null, 
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;