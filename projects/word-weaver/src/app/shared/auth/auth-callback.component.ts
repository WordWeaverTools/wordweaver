import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { NotificationService } from "../../core/core.module";
import { TranslateService } from "@ngx-translate/core";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { of, Subject } from "rxjs";

@Component({
  selector: "ww-app-auth-callback",
  template: `<p>Processing login...</p>`,
  standalone: false,
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        // unsubscribe when we destroy the component
        takeUntil(this.unsubscribe$),
        // use the translate service to get an error message from the params otherwise return 'success'
        switchMap((params) => {
          const error = params["error"];
          const errorDescription = params["error_description"];

          if (error && errorDescription) {
            console.error("Auth0 login error:", error, errorDescription);
            if (
              error === "access_denied" &&
              errorDescription.toLowerCase().includes("verify your email")
            ) {
              return this.translate.get(
                "ww.common.notifications.auth.verification-required"
              );
            } else {
              return this.translate.get(
                "ww.common.notifications.auth.login-failed"
              );
            }
          }
          {
            return of("success");
          }
        }),
        // If the error message is not 'success' use the notifcation service to display the translated error.
        // and then throw an error
        tap((message) => {
          if (message === "success") {
            return of(null);
          } else {
            this.notificationService.error(message);
            // Stop the pipeline — no redirect handling
            throw new Error("Auth0 login error intercepted.");
          }
        }),
        // if an error was not thrown, handle the normal authentication redirect back to /profile
        switchMap(() => this.auth.handleRedirectCallback()),
        tap(() => this.router.navigate(["/profile"])),
        // if an error was thrown, send the user back to the main page
        catchError((err) => {
          console.error("Redirect callback failed:", err);
          this.router.navigate(["/"]);
          return of(null); // End the observable stream gracefully
        })
      )
      .subscribe();
  }
}
