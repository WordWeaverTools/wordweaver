import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EveryVoiceDirective } from "./every-voice.directive";
import { EveryVoiceService } from "./every-voice.service";
import { EveryVoiceModule } from "./every-voice.module";

@Component({
  template: `<span [libEveryVoice]="testText">Play</span>`,
  standalone: false,
})
class TestHostComponent {
  testText = "Hello world";
}

describe("EveryVoiceDirective", () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockEveryVoiceService: jasmine.SpyObj<EveryVoiceService>;

  beforeEach(() => {
    mockEveryVoiceService = jasmine.createSpyObj("EveryVoiceService", [
      "speak",
    ]);

    TestBed.configureTestingModule({
      imports: [
        EveryVoiceModule.forRoot({
          apiUrl: "test",
          enableTTS: true,
          requiresAuth: false,
          clientId: "",
          audience: "",
          middlewareEndpoint: "",
          domain: "",
        }),
      ],
      declarations: [EveryVoiceDirective, TestHostComponent],
      providers: [
        { provide: EveryVoiceService, useValue: mockEveryVoiceService },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });
});
