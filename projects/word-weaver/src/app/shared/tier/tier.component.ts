import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import {
  Conjugation,
  ConjugationMorphemeNameIndex,
  ConjugationObject,
  Tier,
} from "../../../config/config";
import { EveryVoiceService } from "@everyvoice/every-voice";

@Component({
  selector: "ww-tier",
  templateUrl: "./tier.component.html",
  styleUrls: ["./tier.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TierComponent implements OnInit {
  @Input() data: ConjugationObject;
  @Input() tier: Tier;
  @Input() hasAudio = false;

  rawText: string;
  output: Conjugation;
  morphType: number;
  constructor(public tts: EveryVoiceService) {}

  ngOnInit(): void {
    // Filter empty values and sort on position
    this.morphType = ConjugationMorphemeNameIndex.type;
    this.output = this.data.output
      .filter((x) => x[this.tier.key])
      .sort(
        (a, b) =>
          a[ConjugationMorphemeNameIndex.position] -
          b[ConjugationMorphemeNameIndex.position]
      );
    this.rawText = this.output.map((m) => m[1]).join("");
  }
}
