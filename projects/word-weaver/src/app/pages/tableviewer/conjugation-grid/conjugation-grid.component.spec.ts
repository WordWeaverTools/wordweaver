import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { ConjugationGridComponent } from "./conjugation-grid.component";
import { SharedModule } from "../../../shared/shared.module";
describe("ConjugationGridComponent", () => {
  let component: ConjugationGridComponent;
  let fixture: ComponentFixture<ConjugationGridComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [ConjugationGridComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjugationGridComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    component.data$ = of([]);
    fixture.detectChanges();
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
