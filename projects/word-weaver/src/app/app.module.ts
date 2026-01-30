import { NgModule, provideZoneChangeDetection } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AUTH0_INSTANCE, EveryVoiceModule } from "@everyvoice/every-voice";
import { AuthService } from "@auth0/auth0-angular";

@NgModule({
  imports: [
    // TTS support using the EveryVoice Angular module
    EveryVoiceModule.forRoot(environment.ttsConfig),
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core
    CoreModule,

    // shared
    SharedModule,

    // app
    AppRoutingModule,

    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      registrationStrategy: "registerImmediately",
    }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: AUTH0_INSTANCE,
      useExisting: AuthService, // Use the existing instance
    },
    provideZoneChangeDetection(),
  ],
})
export class AppModule {}
