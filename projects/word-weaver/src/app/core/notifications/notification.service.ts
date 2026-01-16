import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  config: object = { duration: 2000, verticalPosition: "top" };
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone,
    private translation: TranslateService
  ) {}

  translated(
    toTranslate: string,
    data: object,
    notificationType: "default" | "info" | "success" | "warn" | "error"
  ) {
    this.translation
      .get(toTranslate, data)
      .subscribe((translated) => {
        if (notificationType === "default") {
          this.default(translated);
        } else if (notificationType === "info") {
          this.info(translated);
        } else if (notificationType === "success") {
          this.success(translated);
        } else if (notificationType === "warn") {
          this.warn(translated);
        } else if (notificationType === "error") {
          this.error(translated);
        } else {
          return false;
        }
      })
      .unsubscribe();
  }

  default(message: string) {
    const config: object = {
      ...this.config,
      ...{ panelClass: "default-notification-overlay" },
    };
    this.show(message, config);
  }

  info(message: string) {
    const config: object = {
      ...this.config,
      ...{ panelClass: "info-notification-overlay" },
    };
    this.show(message, config);
  }

  success(message: string) {
    const config: object = {
      ...this.config,
      ...{ panelClass: "success-notification-overlay" },
    };
    this.show(message, config);
  }

  warn(message: string) {
    const config: object = {
      ...this.config,
      ...{ panelClass: "warning-notification-overlay" },
    };
    this.show(message, config);
  }

  error(message: string) {
    const config: object = {
      ...this.config,
      ...{
        panelClass: "error-notification-overlay",
        duration: 15000,
        verticalPosition: "bottom",
      },
    };
    this.show(message, config);
  }

  private show(message: string, configuration: MatSnackBarConfig) {
    // Need to open snackBar from Angular zone to prevent issues with its position per
    // https://stackoverflow.com/questions/50101912/snackbar-position-wrong-when-use-errorhandler-in-angular-5-and-material
    this.zone.run(() => this.snackBar.open(message, null, configuration));
  }
}
