import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Express } from 'express';
import session from 'express-session';
import { storage } from './storage';
import { connectToDatabase } from './mongodb/connect';
import { comparePasswords, hashPassword, getUserById } from './mongodb/auth';
import { IUser } from './mongodb/models';

declare global {
  namespace Express {
    interface User extends IUser {
      id: string;
    }
    
    interface Request {
      isAuthenticated(): boolean;
      user?: User;
      login(user: User, callback: (err: any) => void): void;
      logout(callback: (err: any) => void): void;
    }
  }
}

export async function setupAuth(app: Express) {
  // Ensure MongoDB is connected
  await connectToDatabase();

  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'fileconversion-secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy (username/password)
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Try to find user by username
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          // If no user found, try by email
          const userByEmail = await storage.getUserByEmail(username);
          if (!userByEmail) {
            return done(null, false, { message: 'Invalid username or password' });
          }
          
          // Check password
          if (!(await comparePasswords(password, userByEmail.password))) {
            return done(null, false, { message: 'Invalid username or password' });
          }
          
          return done(null, userByEmail);
        }
        
        // Check password
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            const existingUser = await storage.getUserByGoogleId(profile.id);
            
            if (existingUser) {
              return done(null, existingUser);
            }
            
            // Create new user if none exists
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email provided by Google'));
            }
            
            // Check if email is already registered
            const userWithEmail = await storage.getUserByEmail(email);
            if (userWithEmail) {
              // Update existing user with Google ID
              const updatedUser = await storage.updateUser(userWithEmail.id, {
                googleId: profile.id,
                displayName: profile.displayName || userWithEmail.displayName
              });
              
              return done(null, updatedUser);
            }
            
            // Create new user
            const newUser = await storage.createUser({
              username: `google_${profile.id}`,
              email,
              password: await hashPassword(Math.random().toString(36).substring(2)),
              displayName: profile.displayName || '',
              googleId: profile.id,
              dailyConversionsRemaining: 5,
              lastConversionReset: new Date(),
              isPro: false
            });
            
            return done(null, newUser);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Authentication routes
  app.post('/api/register', async (req, res, next) => {
    try {
      const { username, email, password, displayName } = req.body;
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        displayName: displayName || username,
        googleId: null,
        dailyConversionsRemaining: 5,
        lastConversionReset: new Date(),
        isPro: false
      });
      
      // Log in the new user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json(info);
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Google OAuth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/auth/google', passport.authenticate('google'));
    
    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));
  }
}