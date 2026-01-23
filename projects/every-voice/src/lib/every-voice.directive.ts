import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { EveryVoiceService } from "./every-voice.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[libEveryVoice]",
  standalone: false,
})
export class EveryVoiceDirective implements AfterViewInit, OnDestroy, OnInit {
  @Input("libEveryVoice") text!: string;

  unsubscribe$ = new Subject<void>();
  audioId: string;
  constructor(
    private tts: EveryVoiceService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener("click")
  onClick() {
    if (this.tts.ttsEnabledAndAuthenticated$.value && this.text) {
      this.tts.playSound$(this.audioId, this.text).subscribe({
        complete: () => console.log("Playback completed"),
        error: (err) => console.error("Playback error:", err),
      });
    }
  }

  ngOnInit(): void {
    this.audioId = crypto.randomUUID();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.tts.ttsEnabledAndAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((ttsEnabled) => {
        if (ttsEnabled) {
          this.renderer.setStyle(this.el.nativeElement, "cursor", "pointer");
        }
      });
    const innerText = this.el.nativeElement.textContent;
    console.log("Element innerText:", innerText);
    this.text = innerText;
  }
}
