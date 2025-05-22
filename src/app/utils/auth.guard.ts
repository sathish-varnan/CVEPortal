import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const flag = (localStorage.getItem("customer-id") !== null);
  const router = inject(Router);
  if (flag) {
    return true;
  }
  console.log(localStorage.getItem("customer-id"));
  router.navigate(['/customer/login']);
  return false;
};
