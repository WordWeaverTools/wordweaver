import { ModuleWithProviders, NgModule } from "@angular/core";
import { EveryVoiceDirective } from "./every-voice.directive";
import { EveryVoiceComponent } from "./every-voice/every-voice.component";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { EVERY_VOICE_CONFIG } from "./every-voice.token";
import { EveryVoiceConfig } from "./every-voice.config";
import { EveryVoiceService } from "./every-voice.service";

@NgModule({
  declarations: [EveryVoiceDirective, EveryVoiceComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [EveryVoiceDirective, EveryVoiceComponent],
})
export class EveryVoiceModule {
  static forRoot(
    config: EveryVoiceConfig
  ): ModuleWithProviders<EveryVoiceModule> {
    return {
      ngModule: EveryVoiceModule,
      providers: [
        { provide: EVERY_VOICE_CONFIG, useValue: config },
        EveryVoiceService,
      ],
    };
  }

  static forChild(): ModuleWithProviders<EveryVoiceModule> {
    return {
      ngModule: EveryVoiceModule,
      providers: [], // no config or service re-provided
    };
  }
}
