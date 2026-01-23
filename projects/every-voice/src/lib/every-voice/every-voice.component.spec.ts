import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EveryVoiceComponent } from "./every-voice.component";
import { EveryVoiceModule } from "../every-voice.module";
describe("EveryVoiceComponent", () => {
  let component: EveryVoiceComponent;
  let fixture: ComponentFixture<EveryVoiceComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EveryVoiceComponent],
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
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EveryVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
