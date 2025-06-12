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

export const vendorAuthGuard: CanActivateChildFn = (childRoute, state) => {
  const flag = (localStorage.getItem("vendor-id")!== null);
  const router = inject(Router);
  if (flag) {
    return true;
  }
  console.log(localStorage.getItem("vendor-id"));
  router.navigate(['/vendor/login']);
  return false;
}

export const employeeAuthGuard: CanActivateChildFn = (childRoute, state) => {
  const flag = (localStorage.getItem("employee-id")!== null);
  const router = inject(Router);
  if (flag) {
    return true;
  }
  console.log(localStorage.getItem("employee-id"));
  router.navigate(['/employee/login']);
  return false;
}