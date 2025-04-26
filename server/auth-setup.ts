import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Express, Request } from 'express';
import session from 'express-session';
import { connectToDatabase } from './mongodb/connect';
import { 
  getUserById, getUserByUsername, getUserByEmail, getUserByGoogleId,
  comparePasswords, hashPassword, createUser
} from './mongodb/auth';
import { IUser } from './mongodb/models';
import { nanoid } from 'nanoid';
import MongoStore from 'connect-mongo';

// Type augmentation for Express.User
declare global {
  namespace Express {
    interface User extends IUser {
      id: string;
    }
  }
}

export async function setupAuth(app: Express) {
  // Ensure MongoDB is connected
  await connectToDatabase();

  // Session configuration
  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || nanoid(32),
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    }
  };

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Check if input is email or username
      const isEmail = username.includes('@');
      
      let user;
      if (isEmail) {
        user = await getUserByEmail(username);
      } else {
        user = await getUserByUsername(username);
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or email.' });
      }
      
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google Strategy (if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are defined)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('Email not found from Google profile.'));
        }
        
        // Find existing user by Google ID or email
        let user = await getUserByGoogleId(googleId);
        
        if (!user) {
          // Check if user exists with the same email
          user = await getUserByEmail(email);
          
          if (user) {
            // Update existing user with Google ID
            user.googleId = googleId;
            await user.save();
          } else {
            // Create new user
            const displayName = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
            const username = email.split('@')[0] + nanoid(5);
            
            user = await createUser({
              username,
              email,
              password: await hashPassword(nanoid(16)), // Random password
              displayName,
              googleId,
              isPro: false,
              dailyConversionsLeft: 5
            });
            
            if (!user) {
              return done(new Error('Failed to create user.'));
            }
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));
  }

  // Serialize/Deserialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body;
      
      // Check if username or email already exists
      const existingUsername = await getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
      
      const existingEmail = await getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      
      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await createUser({
        username,
        email,
        password: hashedPassword,
        displayName: displayName || username,
        isPro: false,
        dailyConversionsLeft: 5
      });
      
      if (!user) {
        return res.status(500).json({ message: 'Failed to create user.' });
      }
      
      // Log in the new user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to log in.' });
        }
        return res.status(201).json(user);
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Registration failed.' });
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed.' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Invalid credentials.' });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Login failed.' });
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed.' });
      }
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.user);
  });

  // Google auth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/auth/google', passport.authenticate('google'));
    
    app.get('/auth/google/callback', 
      passport.authenticate('google', { 
        failureRedirect: '/auth' 
      }),
      (req, res) => {
        res.redirect('/');
      }
    );
  }
}