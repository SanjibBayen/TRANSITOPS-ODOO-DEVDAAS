import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Reminders for Expiring Licenses setup
  // We'll set up a cron job that runs every day at 08:00 AM (for example)
  // Since this is a demo, we'll schedule it or mock it. We can add an endpoint to trigger it manually as well.
  const transport = nodemailer.createTransport({
    // Fake SMTP config, or real if provided in env
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER || "fake-user",
      pass: process.env.SMTP_PASS || "fake-pass",
    },
  });

  cron.schedule("0 8 * * *", async () => {
    console.log("Running daily license expiry check...");
    // In a real app, query database here for expiring licenses
    // For demo purposes, we just log it.
  });

  // Manual trigger endpoint for testing cron logic
  app.post("/api/trigger-expiry-reminders", async (req, res) => {
    try {
      const { driverName, expiryDate } = req.body;
      
      // Backend determines the recipient email
      const to = `${driverName.replace(/\s+/g, '.').toLowerCase()}@transitops.in`;
      
      console.log(`Preparing to send email to ${to} for driver ${driverName} expiring on ${expiryDate}`);
      
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transport.sendMail({
          from: '"TransitOps Safety" <safety@transitops.in>',
          to: to,
          subject: "Action Required: Driver License Expiring Soon",
          text: `Dear ${driverName},\n\nYour driver license is scheduled to expire on ${expiryDate}. Please take the necessary actions to renew it as soon as possible to avoid suspension.\n\nThank you,\nTransitOps Safety Team`,
        });
        console.log(`Email successfully dispatched to ${to}`);
      } else {
        console.log(`[Email Mock] Email sent to ${to} for ${driverName}. (Configure SMTP_USER to send real emails)`);
      }
      
      res.json({ success: true, message: `Reminder email successfully dispatched to ${to}` });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4.x
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
