import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClerkService {

  getClerk: any;
  async clerk() {
    // @ts-ignore
    this.getClerk = window.Clerk;
    try {
      // Load Clerk environment & session if available
      await this.getClerk.load();
      // @ts-ignore
      console.log('[ClerkService.clerk] client', window.Clerk);
      const userButtonEl = document.getElementById('user-button');
      const authLinks = document.getElementById('auth-links');
      if (this.getClerk.user) {
        // Mount user button component
        this.getClerk.mountUserButton(userButtonEl);
        // @ts-ignore
        authLinks.style.display = 'none';
        console.log('[ClerkService.clerk] User is logged in');
      } else {
        console.log('[ClerkService.clerk] User is logged out');
      }
    } catch (err) {
      console.error('[ClerkService.clerk] error', err);
    }
  }

  async initClerk() {
    const frontendApi = process.env['NG_APP_CLERK_PUBLISHABLE_KEY'];
    const script = document.createElement('script');
    script.setAttribute('data-clerk-frontend-api', frontendApi);
    script.async = true;
    script.src = `https://${frontendApi}/npm/@clerk/clerk-js@1/dist/clerk.browser.js`;
    script.addEventListener('load', await this.clerk);
    document.body.appendChild(script);  // <--- Here is the problem
  }
}
