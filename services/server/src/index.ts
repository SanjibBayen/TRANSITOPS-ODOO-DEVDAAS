import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { supabaseAdmin } from "./config/supabase";
import { initRedis, closeRedis } from "./config/redis";
import { initializeSocket } from "./config/socket";
import { SchedulerService } from "./services/scheduler.service";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

async function startServer() {
  try {
    console.log("========================================");
    console.log("  TRANSITOPS SERVER STARTING...");
    console.log("========================================");

    // Initialize Redis
    console.log("Connecting to Redis...");
    await initRedis();

    // Test Supabase connection
    console.log("Connecting to Supabase...");
    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .select("count")
      .single();

    if (error) {
      console.warn("⚠️  Supabase connection warning:", error.message);
      console.log("   Make sure your tables are created in Supabase");
    } else {
      console.log("✅ Supabase connected successfully");
    }

    // Start server
    server.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log(`🚀 TransitOps Server Running`);
      console.log("========================================");
      console.log(`📍 URL:        http://localhost:${PORT}`);
      console.log(`🔗 API:        http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health:     http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSocket:  ws://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("========================================");
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      // Close Socket.io
      io.close(() => {
        console.log("Socket.io closed");
      });

      // Close Redis
      await closeRedis();

      // Close HTTP server
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Export for testing
export { app, server, io };

// Start the server
startServer();
setInterval(
  () => {
    console.log("Running scheduled checks...");
    SchedulerService.runAllChecks();
  },
  6 * 60 * 60 * 1000,
);

// Run once on startup (after 10 seconds to let everything initialize)
setTimeout(() => {
  SchedulerService.runAllChecks();
}, 10000);
