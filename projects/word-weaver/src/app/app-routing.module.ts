import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@auth0/auth0-angular";
import { UserProfileComponent } from "./shared/profile/profile.component";
import { AuthCallbackComponent } from "./shared/auth/auth-callback.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "wordmaker",
    pathMatch: "full",
  },
  {
    path: "about",
    loadChildren: () =>
      import("./pages/about/about.module").then((m) => m.AboutModule),
  },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then((m) => m.SettingsModule),
  },
  {
    path: "wordmaker",
    loadChildren: () =>
      import("./pages/wordmaker/wordmaker.module").then(
        (m) => m.WordmakerModule
      ),
  },
  {
    path: "tableviewer",
    loadChildren: () =>
      import("./pages/tableviewer/tableviewer.module").then(
        (m) => m.TableviewerModule
      ),
  },
  {
    path: "auth-callback", // Handle Auth0 redirect with errors here
    component: AuthCallbackComponent,
  },
  {
    path: "**",
    redirectTo: "wordmaker",
  },
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: "enabled",
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
