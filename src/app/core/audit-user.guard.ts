import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const auditUserGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
