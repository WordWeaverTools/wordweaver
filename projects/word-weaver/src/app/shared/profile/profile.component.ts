import { Component, Inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "ww-app-user-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  standalone: false,
})
export class UserProfileComponent {
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) public document: Document
  ) {}
}
