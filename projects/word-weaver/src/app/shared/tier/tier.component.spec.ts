import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { EveryVoiceModule } from "@everyvoice/every-voice";
import { TierComponent } from "./tier.component";
import { everyVoiceConfig } from "../../../environments/environment";
describe("TierComponent", () => {
  let component: TierComponent;
  let fixture: ComponentFixture<TierComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TierComponent],
      imports: [EveryVoiceModule.forRoot(everyVoiceConfig)],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierComponent);
    component = fixture.componentInstance;
    component.tier = {
      key: 0,
      name: "breakdown",
      separator: "",
      position: 0,
      options: { language: "L1" },
    };
    component.data = {
      input: { agent: "test", patient: "test", option: "test", root: "test" },
      output: [],
    };
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
