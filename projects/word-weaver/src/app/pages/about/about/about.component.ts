import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { META_DATA } from "../../../../config/config";
import { ROUTE_ANIMATIONS_ELEMENTS } from "../../../core/core.module";

export interface Contributor {
  text: string;
  img: string | false;
  name: string;
  title: string;
}

@Component({
  selector: "ww-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AboutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  contributors = META_DATA.contributors;
  constructor() {}
  ngOnInit() {}
}
