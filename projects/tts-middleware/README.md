# Instructions for running middleware on your local machine

This README provides instructions for setting up and running the TTS middleware on your local machine.

## Assumptions

- You have cloned the repository containing the TTS middleware code.
- The TTS backend is running and accessible for the middleware.
- Your TTS backend requires bearer token authentication.
- You have set up an Auth0 tenant application for authentication
    - It has COR permission for localhost.
    - You have the domain and audience values for your Auth0 application.
    - Your application is correctly configured to authenticate users through Auth0

## Prerequisites

Before you begin, ensure you have the following :

- Installed on your machine
    - Node.js (version 18 or higher)
    - npm (Node Package Manager)
- Auth0 Domain and Audience values
- Bearer token for TTS backend authentication

## Setup Instructions

1. **Navigate to the Project Directory**
   Open your terminal and navigate to the directory where the TTS middleware code is located:

```bash
   cd path/to/your/tts-middleware
```

2. **Install Dependencies**
   Install the required dependencies using npm:

```bash
   npm install
```

3. **Configure Environment Variables**
   Create a `.env` file in the TTS middleware directory and add any necessary environment variables. For example:

```env
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
TTS_BACKEND_URL=
BEARER_TOKEN=
PERMITTED_ORIGIN=
DEFAULT_AUDIO_CONTENT_TYPE=audio/mpeg
PORT=
```

Use the values specific to your Auth0 application and TTS backend. Note that the `PERMITTED_ORIGIN` should match the origin of the app making requests to the middleware (e.g., `http://localhost:4200`). The `PORT` variable specifies the port on which the middleware will run (default is 3000 if not specified).

4. **Run the Middleware**
   Start the middleware server using the following command:

```bash
node index.js
```

You can create multiple env files for different environments (e.g., `.env.development`, `.env.production`) and specify which env to use via the `--env-file` switch for `node`.
