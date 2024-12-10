const axios = require('axios');
const fs = require('fs');

class CadmiumSDK {
    static instance;
    constructor(config = {}) {
        if (CadmiumSDK.instance) {
            return CadmiumSDK.instance;
        }

        this.config = {
            applicationId: config.applicationId || process.env.APPLICATION_ID || "default-app-id",
            secret: config.secret || process.env.CD_SECRET || "default-secret",
            id: config.id || process.env.CD_ID || "default-id",
            endpoint: "http://43.204.216.93/logs",
        };

        this.headers = {
            "Application-ID": this.config.applicationId,
            "CD-Secret": this.config.secret,
            "CD-ID": this.config.id,
            "Content-Type": "application/json",
        };

        if (!this.config.applicationId || !this.config.secret || !this.config.id) {
            throw new Error("Missing required Cadmium configuration: applicationId, secret, or id.");
        }

        CadmiumSDK.instance = this;
    }

    static initialize(config = {}) {
        console.log("Initializing CadmiumSDK...");
        if (!CadmiumSDK.instance) {
            return new CadmiumSDK(config);
        }
        return CadmiumSDK.instance;
    }

    async sendError(exception, request = null) {
        const payload = {
            error: exception.message,
            traceback: exception.stack,
            url: request?.originalUrl || "N/A",
            method: request?.method || "N/A",
        };



        try {
            const response = await axios.post(this.config.endpoint, payload, { headers: this.headers });

        } catch (err) {
            const logFile = 'cadmium-errors.log';
            fs.appendFileSync(logFile, JSON.stringify(payload, null, 2) + '\n');
            console.log(`Error saved locally to '${logFile}'.`);
        }
    }

    middleware() {
        return async (err, req, res, next) => {
            if (err) {
                await this.sendError(err, req);
            }
            next(err); // Pass the error to the next middleware
        };
    }

    handleUncaughtExceptions() {
        process.on('uncaughtException', async (error) => {
            await this.sendError(error);
            process.exit(1); // Exit the process after handling the exception
        });

        process.on('unhandledRejection', async (reason) => {
            await this.sendError(reason instanceof Error ? reason : new Error(reason));
        });
    }

    attachMiddleware(app) {
        app.use(this.middleware());
    }
}
module.exports = CadmiumSDK;
