# Cadmium Express SDK

The Cadmium Express SDK captures and sends unhandled exceptions in your Express applications to the Cadmium Cloud Service.

## Features
- Middleware integration for Express.
- Captures uncaught exceptions and unhandled rejections.
- Sends detailed error logs with context.

## Installation

Install the dependencies:

```bash
npm install express axios dotenv
```

## Usage

1. Initialize the SDK in your project:
   ```javascript
   const CadmiumSDK = require('./cadmium-sdk');
   const cadmium = new CadmiumSDK({
       applicationId: 'your-app-id',
       secret: 'your-cd-secret',
       id: 'your-cd-id'
   });
   ```

2. Use the middleware in your Express app:
   ```javascript
   app.use(cadmium.middleware());
   ```

3. Enable global exception handling:
   ```javascript
   cadmium.handleUncaughtExceptions();
   ```

4. Example Express App:
   Run the example app with:
   ```bash
   node example.js
   ```

## License
MIT
