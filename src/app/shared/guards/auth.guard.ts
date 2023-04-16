import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { tap } from 'rxjs/operators';

export const isLoggedGuardFn: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .isLoggedIn$()
    .pipe(tap((isLoggedIn) => !isLoggedIn && router.navigate(['login'])));
};

export const canMatchGuardFn: CanMatchFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .isLoggedIn$()
    .pipe(tap((isLoggedIn) => !isLoggedIn && router.navigate(['no-access'])));
};