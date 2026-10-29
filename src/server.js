require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    // Verify that MySQL is reachable.
    await prisma.$connect();
    console.log("MySQL connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    async function shutdown() {
      console.log("Shutting down server...");

      server.close(async () => {
        try {
          await prisma.$disconnect();
          process.exit(0);
        } catch (error) {
          console.error("Database shutdown failed:", error);
          process.exit(1);
        }
      });
    }

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start the application:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();