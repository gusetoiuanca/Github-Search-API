import express from "express";

import { aggregateController } from "./controllers/aggregateController.js";
import { searchController } from "./controllers/searchController.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();
const port = 3000;

app.get("/searchRepositories", searchController);

app.get("/aggregateRepositories", aggregateController);

// Global error handling middleware
app.use(errorHandler);

// Start the server only when the file is run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });
}
