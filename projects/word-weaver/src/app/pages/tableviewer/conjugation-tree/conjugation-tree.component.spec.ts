import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConjugationTreeComponent } from "./conjugation-tree.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { SharedModule } from "../../../shared/shared.module";
import { EveryVoiceModule } from "@everyvoice/every-voice";
import { environment } from "../../../../environments/environment";
describe("ConjugationTreeComponent", () => {
  let component: ConjugationTreeComponent;
  let fixture: ComponentFixture<ConjugationTreeComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConjugationTreeComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        EveryVoiceModule.forRoot(environment.ttsConfig),
      ],
      providers: [
        provideMockStore(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjugationTreeComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    // @ts-ignore
    component.data$ = of([]);
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
