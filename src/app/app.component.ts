import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AuthService } from '@shared/services/auth.service';
import { Observable, Subscription } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'cash-trek';
  isLoggedIn!: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {
   this.isLoggedIn = this.authService.isLoggedIn$();
   this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        this.setCardAnimations();
      }
    });
  }

  setCardAnimations(): void {
    const cards = document.querySelectorAll<HTMLElement>(`.card-block`);
      // Add the tails to each card
      cards.forEach((card) => {
        [
          `top`,
          `right`,
          `bottom`,
          `left`,
        ].forEach((side) => {
          const tail = document.createElement(`div`);
          tail.classList.add(`tail`, side);
          card.appendChild(tail);
        });
        // if that card has no colours, add some
        if (!card.style.getPropertyValue(`--color1`)) {
          card.style.setProperty(`--color1`, `hsl(${Math.random() * 360}, 100%, 50%)`);
          card.style.setProperty(`--color2`, `hsl(${Math.random() * 360}, 100%, 50%)`);
        }
      });

      setInterval(() => {
        cards.forEach((card) => {
          if (!card.style.getPropertyValue(`--color1`)) {
            card.style.setProperty(`--color1`, `hsl(${Math.random() * 360}, 100%, 50%)`);
            card.style.setProperty(`--color2`, `hsl(${Math.random() * 360}, 100%, 50%)`);
          }
        });
      }, 7000);
  }
}
