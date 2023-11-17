import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClerkService } from '../service/clerk-service/clerk';

@Injectable({
  providedIn: 'root'
})
export class ClerkAuthGuardGuard implements CanActivate {
  constructor(clerkService: ClerkService) {
    console.log('[ClerkAuthGuardGuard] window', window); // returns window object with Clerk present
    // @ts-ignore
    console.log('[ClerkAuthGuardGuard] window.Clerk', window.Clerk); // returns undefined
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
