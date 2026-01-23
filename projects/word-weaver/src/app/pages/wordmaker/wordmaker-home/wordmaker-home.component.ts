import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ROUTE_ANIMATIONS_ELEMENTS } from "../../../core/core.module";

@Component({
  selector: "ww-wordmaker-home",
  templateUrl: "./wordmaker-home.component.html",
  styleUrls: ["./wordmaker-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WordmakerHomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  constructor() {}

  ngOnInit(): void {}
}
