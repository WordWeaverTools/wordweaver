import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  OnDestroy,
} from "@angular/core";
import { EveryVoiceService } from "../every-voice.service";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "lib-every-voice",
  templateUrl: "./every-voice.component.html",
  styleUrls: ["./every-voice.component.css"],
  standalone: false,
})
export class EveryVoiceComponent implements OnInit, OnDestroy {
  @Input() textToGenerate: string;
  @Input() icon = "volume_up";
  @Input() stopIcon = "stop";
  audioId: string;
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  unsubscribe$ = new Subject<void>();
  isVisible = false;
  constructor(public tts: EveryVoiceService, private cdr: ChangeDetectorRef) {
    this.isLoading = false;

    this.tts.status$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((event) => event.id === this.audioId || event.id === "all")
      )
      .subscribe(({ id, status }) => {
        console.log("[DEBUG] tts status received", id, status);

        if (status === "GENERATING" || status === "LOADING") {
          this.isLoading = true;
          this.isPlaying = false;
          this.hasError = false;
        } else if (status === "READY" || status === "PAUSED") {
          this.isLoading = false;
          this.isPlaying = false;
          this.hasError = false;
        } else if (status === "PLAYING") {
          this.isLoading = false;
          this.isPlaying = true;
          this.hasError = false;
        } else if (status === "ERROR") {
          this.hasError = true;
          this.isLoading = false;
          this.isPlaying = false;
        } else {
          this.isLoading = false;
        }
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.audioId = crypto.randomUUID();
    this.tts.ttsEnabledAndAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((ttsEnabled) => {
        this.isVisible = ttsEnabled;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClick() {
    if (this.textToGenerate) {
      this.hasError = false;
      if (this.isPlaying) {
        this.tts.stop();
        this.isPlaying = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      } else {
        this.tts.stop();
        this.isPlaying = true;
        this.isLoading = true;
        this.cdr.detectChanges();
        this.tts.playSound$(this.audioId, this.textToGenerate).subscribe({
          complete: () => {
            console.log("Playback completed");
            this.isPlaying = false;
          },
          error: (err) => {
            console.error("Playback error:", err);
            this.isPlaying = false;
          },
        });
      }
    } else {
      this.hasError = true;
    }
  }
}
