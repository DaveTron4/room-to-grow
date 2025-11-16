import User from '../models/User.js';


export const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}

export const verify = async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      // User exists, return it
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      githubId: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value,
      profileUrl: profile.profileUrl,
      avatarUrl: profile.photos?.[0]?.value
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}
