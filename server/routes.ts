import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth-setup";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";
import Stripe from "stripe";
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { Document, Packer } from "docx";
import session from "express-session";
import passport from "passport";

// Check if Stripe API keys are available
let stripe: Stripe | undefined;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

// Set up multer for file uploads
const storage_dir = path.join(process.cwd(), "temp");
// Create temp directory if it doesn't exist
if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storage_dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, PNG, WebP, and DOCX are allowed.",
        ),
      );
    }
  },
});

// File validation middleware
const validateFileUpload = (req: Request, res: Response, next: Function) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  next();
};

// Auth middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// Pro user middleware
const isProUser = async (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = req.user;
  if (!user.isPro) {
    return res
      .status(403)
      .json({ message: "This feature requires a Pro subscription" });
  }

  next();
};

// API key middleware
const validateApiKey = async (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || typeof apiKey !== "string") {
    return res.status(401).json({ message: "API key is required" });
  }

  const key = await storage.getAPIKeyByKey(apiKey);
  if (!key) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  // Get the user associated with this API key
  const user = await storage.getUser(key.userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (!user.isPro) {
    return res
      .status(403)
      .json({ message: "This API requires a Pro subscription" });
  }

  // Assign user to request for later use
  req.user = user;
  next();
};

// Clean up temporary files
const cleanupFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error cleaning up file:", error);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
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

  // Set up authentication
  setupAuth(app);

  // Reset daily conversions
  setInterval(
    () => {
      storage.resetDailyConversions();
    },
    60 * 60 * 1000,
  ); // Check every hour

  // User routes
  app.get("/api/users/me", isAuthenticated, async (req, res) => {
    const conversions = await storage.getConversionsByUserId(req.user.id);
    const qrCodes = await storage.getQRCodesByUserId(req.user.id);

    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;

    res.json({
      user: userWithoutPassword,
      conversions,
      qrCodes,
      conversionCount: conversions.length,
      qrCodeCount: qrCodes.length,
    });
  });

  // File conversion routes
  app.post(
    "/api/convert",
    isAuthenticated,
    upload.single("file"),
    validateFileUpload,
    async (req, res) => {
      try {
        const { sourceFormat, targetFormat } = req.body;
        const file = req.file!;

        // Check if user has remaining conversions
        const canConvert = await storage.decrementUserConversions(req.user.id);
        if (!canConvert) {
          cleanupFile(file.path);
          return res.status(403).json({
            message:
              "Daily conversion limit reached. Upgrade to Pro for unlimited conversions.",
          });
        }

        // Process file based on conversion type
        let convertedFilePath = "";
        let convertedFilename = "";

        try {
          // PDF to DOCX
          if (sourceFormat === "pdf" && targetFormat === "docx") {
            // In a real implementation, this would use a library to convert PDF to DOCX
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".docx";
            convertedFilePath = path.join(storage_dir, convertedFilename);

            // Placeholder for actual conversion
            // For demo, we'll just copy the file and rename it
            fs.copyFileSync(file.path, convertedFilePath);
          }
          // DOCX to PDF
          else if (sourceFormat === "docx" && targetFormat === "pdf") {
            // In a real implementation, this would use a library to convert DOCX to PDF
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".pdf";
            convertedFilePath = path.join(storage_dir, convertedFilename);

            // Placeholder for actual conversion
            fs.copyFileSync(file.path, convertedFilePath);
          }
          // Image conversions
          else if (
            ["jpg", "jpeg", "png", "webp"].includes(sourceFormat) &&
            ["jpg", "jpeg", "png", "webp"].includes(targetFormat)
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) +
              "." +
              targetFormat;
            convertedFilePath = path.join(storage_dir, convertedFilename);

            // Actually convert the image using sharp
            await sharp(file.path)
              .toFormat(targetFormat as any)
              .toFile(convertedFilePath);
          }
          // Image to PDF
          else if (
            ["jpg", "jpeg", "png", "webp"].includes(sourceFormat) &&
            targetFormat === "pdf"
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".pdf";
            convertedFilePath = path.join(storage_dir, convertedFilename);

            // Create a PDF with the image
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();

            // In a real implementation, this would properly embed the image
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(convertedFilePath, pdfBytes);
          }
          // PDF to Image (first page only for demo)
          else if (
            sourceFormat === "pdf" &&
            ["jpg", "jpeg", "png", "webp"].includes(targetFormat)
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) +
              "." +
              targetFormat;
            convertedFilePath = path.join(storage_dir, convertedFilename);

            // In a real implementation, this would extract images from the PDF
            // For demo, we'll just create a placeholder image
            await sharp({
              create: {
                width: 800,
                height: 1000,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              },
            })
              .toFormat(targetFormat as any)
              .toFile(convertedFilePath);
          } else {
            cleanupFile(file.path);
            return res.status(400).json({ message: "Unsupported conversion" });
          }

          // Record the conversion
          const conversion = await storage.createConversion({
            userId: req.user.id,
            sourceFormat,
            targetFormat,
            originalFilename: file.originalname,
            convertedFilename,
            status: "completed",
          });

          // Serve the file
          res.download(
            convertedFilePath,
            conversion.convertedFilename,
            (err) => {
              // Clean up files after serving
              cleanupFile(file.path);
              cleanupFile(convertedFilePath);

              if (err) {
                console.error("Error sending file:", err);
              }
            },
          );
        } catch (error) {
          // Clean up on error
          cleanupFile(file.path);
          if (convertedFilePath) {
            cleanupFile(convertedFilePath);
          }
          throw error;
        }
      } catch (error: any) {
        res.status(500).json({ message: `Conversion error: ${error.message}` });
      }
    },
  );

  // API routes for conversions
  app.post(
    "/api/convert/api",
    validateApiKey,
    upload.single("file"),
    validateFileUpload,
    async (req, res) => {
      // This is similar to the regular conversion endpoint but for API access
      // We're reusing the same logic
      try {
        const { sourceFormat, targetFormat } = req.body;
        const file = req.file!;

        // Process file based on conversion type
        let convertedFilePath = "";
        let convertedFilename = "";

        try {
          // PDF to DOCX
          if (sourceFormat === "pdf" && targetFormat === "docx") {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".docx";
            convertedFilePath = path.join(storage_dir, convertedFilename);
            fs.copyFileSync(file.path, convertedFilePath);
          }
          // DOCX to PDF
          else if (sourceFormat === "docx" && targetFormat === "pdf") {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".pdf";
            convertedFilePath = path.join(storage_dir, convertedFilename);
            fs.copyFileSync(file.path, convertedFilePath);
          }
          // Image conversions
          else if (
            ["jpg", "jpeg", "png", "webp"].includes(sourceFormat) &&
            ["jpg", "jpeg", "png", "webp"].includes(targetFormat)
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) +
              "." +
              targetFormat;
            convertedFilePath = path.join(storage_dir, convertedFilename);

            await sharp(file.path)
              .toFormat(targetFormat as any)
              .toFile(convertedFilePath);
          }
          // Image to PDF
          else if (
            ["jpg", "jpeg", "png", "webp"].includes(sourceFormat) &&
            targetFormat === "pdf"
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) + ".pdf";
            convertedFilePath = path.join(storage_dir, convertedFilename);

            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(convertedFilePath, pdfBytes);
          }
          // PDF to Image (first page only for demo)
          else if (
            sourceFormat === "pdf" &&
            ["jpg", "jpeg", "png", "webp"].includes(targetFormat)
          ) {
            convertedFilename =
              path.basename(file.path, path.extname(file.path)) +
              "." +
              targetFormat;
            convertedFilePath = path.join(storage_dir, convertedFilename);

            await sharp({
              create: {
                width: 800,
                height: 1000,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              },
            })
              .toFormat(targetFormat as any)
              .toFile(convertedFilePath);
          } else {
            cleanupFile(file.path);
            return res.status(400).json({ message: "Unsupported conversion" });
          }

          // Record the conversion
          const conversion = await storage.createConversion({
            userId: req.user.id,
            sourceFormat,
            targetFormat,
            originalFilename: file.originalname,
            convertedFilename,
            status: "completed",
          });

          // Serve the file
          res.download(
            convertedFilePath,
            conversion.convertedFilename,
            (err) => {
              // Clean up files after serving
              cleanupFile(file.path);
              cleanupFile(convertedFilePath);

              if (err) {
                console.error("Error sending file:", err);
              }
            },
          );
        } catch (error) {
          // Clean up on error
          cleanupFile(file.path);
          if (convertedFilePath) {
            cleanupFile(convertedFilePath);
          }
          throw error;
        }
      } catch (error: any) {
        res
          .status(500)
          .json({ message: `API conversion error: ${error.message}` });
      }
    },
  );

  // QR Code routes
  app.post("/api/qr-code", isAuthenticated, async (req, res) => {
    try {
      const { content, type, name, options } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Generate QR code
      const qrOptions = {
        errorCorrectionLevel: "H",
        type: "svg",
        quality: 0.92,
        margin: options?.margin || 4,
        color: {
          dark: options?.color || "#000000",
          light: options?.backgroundColor || "#ffffff",
        },
        width: options?.size || 300,
      };

      const qrSvg = await QRCode.toString(content, qrOptions);

      // Save QR code to storage if user is authenticated
      const qrCode = await storage.createQRCode({
        userId: req.user.id,
        content,
        type: type || "url",
        name: name || `QR-${Date.now()}`,
        options,
      });

      res.json({
        qrCode,
        qrSvg,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `QR Code generation error: ${error.message}` });
    }
  });

  app.get("/api/qr-codes", isAuthenticated, async (req, res) => {
    try {
      const qrCodes = await storage.getQRCodesByUserId(req.user.id);
      res.json(qrCodes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API Key routes
  app.post("/api/api-keys", isProUser, async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      // Generate API key
      const key = `convert_${randomBytes(24).toString("hex")}`;

      const apiKey = await storage.createAPIKey({
        userId: req.user.id,
        key,
        name,
      });

      res.json(apiKey);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/api-keys", isProUser, async (req, res) => {
    try {
      const apiKeys = await storage.getAPIKeysByUserId(req.user.id);
      res.json(apiKeys);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/api-keys/:id", isProUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Check if the API key belongs to the user
      const apiKeys = await storage.getAPIKeysByUserId(req.user.id);
      const apiKey = apiKeys.find((key) => key.id === id);

      if (!apiKey) {
        return res.status(404).json({ message: "API key not found" });
      }

      const success = await storage.revokeAPIKey(id);

      if (success) {
        res.status(200).json({ message: "API key revoked successfully" });
      } else {
        res.status(500).json({ message: "Failed to revoke API key" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-subscription", isAuthenticated, async (req, res) => {
      try {
        const user = req.user;

        // If user already has a subscription
        if (user.stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            user.stripeSubscriptionId,
          );

          res.send({
            subscriptionId: subscription.id,
            clientSecret:
              subscription.latest_invoice?.payment_intent?.client_secret,
          });

          return;
        }

        // Create or get Stripe customer
        let customerId = user.stripeCustomerId;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.displayName || user.username,
            metadata: {
              userId: user.id.toString(),
            },
          });

          customerId = customer.id;
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [
            {
              price: process.env.STRIPE_PRICE_ID || "price_missing", // This should be configured in env
            },
          ],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });

        // Update user with Stripe info
        await storage.updateUserStripeInfo(user.id, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
        });

        res.send({
          subscriptionId: subscription.id,
          clientSecret:
            subscription.latest_invoice?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        return res.status(400).send({ error: { message: error.message } });
      }
    });

    // Stripe webhook to handle subscription events
    app.post("/api/stripe-webhook", async (req, res) => {
      const signature = req.headers["stripe-signature"];

      if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(400).send("Webhook signature verification failed");
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (error: any) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          const subscription = event.data.object;
          const customerId = subscription.customer;

          // Find the user with this customer ID
          const users = Array.from(storage.users.values());
          const user = users.find((u) => u.stripeCustomerId === customerId);

          if (user) {
            // Update user subscription status
            const status = subscription.status;
            const isPro = status === "active" || status === "trialing";

            await storage.updateUserSubscriptionStatus(user.id, isPro);
          }
          break;

        case "customer.subscription.deleted":
          const cancelledSubscription = event.data.object;
          const cancelledCustomerId = cancelledSubscription.customer;

          // Find the user with this customer ID
          const allUsers = Array.from(storage.users.values());
          const subUser = allUsers.find(
            (u) => u.stripeCustomerId === cancelledCustomerId,
          );

          if (subUser) {
            // Update user subscription status
            await storage.updateUserSubscriptionStatus(subUser.id, false);
          }
          break;
      }

      res.json({ received: true });
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}
