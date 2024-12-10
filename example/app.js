const express = require('express');
const CadmiumSDK = require('cadmium-express-sdk'); 

const app = express();

// Initialize Cadmium SDK
const cadmium = CadmiumSDK.initialize({
    applicationId: "your-app-id",
    secret: "your-cd-secret",
    id: "your-cd-id",
});

console.log("CadmiumSDK Config:", cadmium.config);

// Sample route to trigger an error
app.get('/', (req, res) => {
    throw new Error("Sample Error: Something went wrong!");
});
// Improtant** Do not forget to attach middleware after routes

// Attach Cadmium middleware
cadmium.attachMiddleware(app);

// Handle uncaught exceptions and unhandled rejections
cadmium.handleUncaughtExceptions();

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    res.status(500).send({ error: "Internal Server Error" });
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
