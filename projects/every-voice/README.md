# EveryVoice for Angular

**EveryVoice** is an Angular module that adds text-to-speech (TTS) capabilities to your application using a configurable API. Add the directive to any text in your templates and it will be spoken aloud using your pre-trained [EveryVoice model](https://everyvoice.ca).

---

## 📦 Installation

Install the package via npm:

```bash
npm install @everyvoice/every-voice
```

---

## 🚀 Getting Started

### 1. Import the Module

In your **root app module** (`app.module.ts`), import `EveryVoiceModule` using the `forRoot()` method to provide the API URL:

```ts
import { EveryVoiceModule } from "@everyvoice/every-voice";

@NgModule({
  imports: [
    EveryVoiceModule.forRoot({
      apiUrl: "https://[INSTANCE].hf.space", // 👈 your TTS backend endpoint
      enableTTS: true, // 👈 set this to false if you want to disable your TTS in certain deployment environments. Note, if this is disabled, your EveryVoice components will not render and TTS will not be accessible from your application.
      developmentBearerToken: "[HF_TOKEN]", // 👈 OPTIONAL authentication token if required by your API. It will be treated as an Authorization Bearer token. IMPORTANT - this is for development only. You should store your environment variables in a secure location in production. Do not commit your access token to a public repo.
      speakerID: "[SPEAKER NAME]", // 👈 OPTIONAL speaker id.
      steps: 3, // 👈  OPTIONAL: number of diffusion steps
      requiresAuth: false, // 👈 set this to false if you do not require users to authenticate before using TTS. If you do, you will need to set up an Auth0 account. See below for more details.
    }),
  ],
})
export class AppModule {}
```

If you use the module in a **feature module** or a **lazy-loaded module**, use `forChild()` instead:

```ts
import { EveryVoiceModule } from "@everyvoice/every-voice";

@NgModule({
  imports: [EveryVoiceModule.forChild()],
})
export class FeatureModule {}
```

#### Advanced: User Authentication using Auth0

If you want the TTS service to only be accessible by authenticated users, you need to create an Auth0 account and do the following:

#### Setting Up Auth0 (Domain, Client ID, Audience)

1. Log into Auth0 Dashboard.
2. Create a New Application

- Navigate to Applications → Applications.
- Click “Create Application”.
- Choose a name (e.g., My Angular App).
- Select Single Page Web Applications.
- Click Create.

3. Configure Application Settings

- Set the following fields:
  - Domain – Found in the Application Settings (e.g., my-tenant.us.auth0.com)
  - Client ID – Also listed in the same settings section
  - Audience:
    - Navigate to APIs → Create API.
    - Define a name and an identifier (this becomes your audience).

4. Add Allowed URLs
   In the app settings, configure:
   - Allowed Callback URLs – e.g., https://<your_web_application>,https://<your_web_application>/auth-callback 👈 NOTE you also need to add an /auth-callback path here.
   - Allowed Logout URLs – e.g., https://<your_web_application>
   - Allowed Web Origins – e.g., https://<your_web_application>

Requests from the EveryVoice TTS Angular service work by sending text and an authentication token to a middleware server that verifies the token and forwards the request to your TTS backend. The server is in projects/tts-middleware. You will need to host this server and record the domain + /tts as the middlewareEndpoint.

You can then install @auth0/auth0-angular and import the module with your domain, clientId, and audience. You will also need to provide the AuthService from your parent application to the EveryVoiceModule like so:

```ts
import { AUTH0_INSTANCE, EveryVoiceModule } from "@everyvoice/every-voice";
import { AuthService } from "@auth0/auth0-angular";

@NgModule({
  imports: [
    EveryVoiceModule.forRoot({
      apiUrl: "https://[INSTANCE].hf.space", // 👈 your TTS backend endpoint
      enableTTS: true, // 👈 set this to false if you want to disable your TTS in certain deployment environments. Note, if this is disabled, your EveryVoice components will not render and TTS will not be accessible from your application.
      requiresAuth: true, // 👈 set this to false if you do not require users to authenticate before using TTS. If you do, you will need to set up an Auth0 account. See below for more details.
      domain: "my-tenant.us.auth0.com", // 👈 example tenant domain from auth0
      clientId: "78189afh9unuij2example", // 👈 example tenant client id from auth0
      audience: "my-audience.us.auth0.com", // 👈 example audience from auth0,
      middlewareEndpoint: "https://my-server-instance.com/tts", // 👈 endpoint for the projects/tts-middleware server,
    }),
  ],
  providers: [
    {
      provide: AUTH0_INSTANCE,
      useExisting: AuthService, // Use the existing instance
    },
  ],
})
export class AppModule {}
```

---

## 🗣️ Usage in Templates

Use the directive `libEveryVoice` on any element:

```html
<!-- Speak the element's inner text -->
<span libEveryVoice>Play this out loud</span>

<!-- Speak a custom string -->
<button [libEveryVoice]="'Hello world'">🔊 Click to speak</button>
```

Alternatively use the component `lib-every-voice` like so:

```html
<!-- Creates an Angular Material Icon Button which can be clicked to play [textToGenerate] -->
<lib-every-voice [textToGenerate]="'Hello world'"></lib-every-voice>
```

Lastly, you can use the EveryVoiceService to generate audio programatically:

```ts
import { EveryVoiceService } from "@everyvoice/every-voice";

export class ExampleComponent {
  constructor(private tts: EveryVoiceService) {}

  onClick(text: string): Observable<void> {
    this.tts.playSound$(text).subscribe({
      complete: () => console.log("Playback completed"),
      error: (err) => console.error("Playback error:", err),
    });
  }
}
```

---

## 🔧 Configuration

The `forRoot()` method takes a configuration object with the following structure:

```ts
interface EveryVoiceConfig {
  apiUrl: string; // The base URL for your TTS API
  enableTTS: boolean; // Whether to enable the TTS feature
  requiresAuth: boolean; // Whether you require Auth0 to authenticate your TTS service
  domain: string; // Your Auth0 Tenant Domain
  clientId: string; // Your Auth0 Tenant Client ID
  audience: string; // Your Auth0 API Audience
  middlewareEndpoint: string; // Your middleware endpoint
}
```

---

## 🛠️ Development & Contributing

If you're using this package locally during development:

1. Build the library:

   ```bash
   ng build every-voice
   ```

   or from the monorepo root:

   ```bash
   npm run build-ev
   ```

2. Use a local path in your app’s `package.json`:

   ```json
   "@everyvoice/every-voice": "file:/path/to/wordweaver/dist/every-voice"
   ```

   or use npm to apply the same change for you:

   ```bash
   npm install --save /path/to/wordweaver/dist/every-voice
   ```

Contributions and issues are welcome — feel free to submit a pull request or open an issue!

---

## 📄 License

MIT
