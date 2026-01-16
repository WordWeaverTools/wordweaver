import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { EveryVoiceService } from "./every-voice.service";
import { EveryVoiceModule } from "./every-voice.module";
describe("EveryVoiceService", () => {
  let service: EveryVoiceService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EveryVoiceModule.forRoot({
          apiUrl: "test",
          enableTTS: false,
          requiresAuth: false,
          clientId: "",
          audience: "",
          middlewareEndpoint: "",
          domain: "",
        }),
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(EveryVoiceService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
