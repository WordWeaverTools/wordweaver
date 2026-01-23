import { Component } from "@angular/core";

// Import the AuthService type from the SDK
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "ww-app-auth-button",
  template: '<button (click)="auth.loginWithRedirect()">Log in</button>',
  standalone: false,
})
export class AuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService) {}
}
