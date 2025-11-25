import { createApp } from "./app.setup.js";
import { connectToDatabase } from "./common/database.common.js";
import { config } from "./config/config.js";

const start = async () => {
    await connectToDatabase();
    const app = createApp();

    const server = app.listen(config.port, () =>
        console.log(`Server running on http://localhost:${config.port}`)
    );

    const graceful = () => {
        console.log("Shutting down gracefully...");
        server.close(() => {
            process.exit(0);
        });
    };

    process.on("SIGTERM", graceful);
    process.on("SIGINT", graceful);
};

start().catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
});
