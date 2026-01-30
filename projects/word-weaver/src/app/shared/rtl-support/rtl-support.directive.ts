import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Directive({
  selector: "[wwRtl]",
  standalone: false,
})
export class RtlSupportDirective implements OnInit, OnDestroy {
  private subscription: Subscription;
  constructor(private el: ElementRef, public translate: TranslateService) {
    el.nativeElement.style.textAlign =
      translate.currentLang === "he" ? "right" : "left";
    el.nativeElement.style.direction =
      translate.currentLang === "he" ? "rtl" : "ltr";
  }
  ngOnInit() {
    this.subscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.el.nativeElement.style.textAlign =
          event.lang === "he" ? "right" : "left";
        this.el.nativeElement.style.direction =
          event.lang === "he" ? "rtl" : "ltr";
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
