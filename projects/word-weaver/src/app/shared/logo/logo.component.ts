import { Component } from "@angular/core";
import { Router } from "@angular/router";
// import * as anime from "animejs";

@Component({
  selector: "ww-logo",
  templateUrl: "logo.component.html",
  styleUrls: ["./logo.component.scss"],
  standalone: false,
})
export class LogoComponent {
  constructor(public router: Router) {}

  // ngAfterViewInit() {
  //   // anime({
  //   //   targets: "#lineDrawing .lines path",
  //   //   strokeDashoffset: [anime.setDashoffset, 0],
  //   //   easing: "easeInOutCubic",
  //   //   color: "#fff",
  //   //   duration: 550,
  //   //   complete: function(anim) {
  //   //     document.getElementById("svgGroup").classList.add("animated");
  //   //   },
  //   //   delay: function(el, i) {
  //   //     return i * 450;
  //   //   }
  //   // });
  // }
}
