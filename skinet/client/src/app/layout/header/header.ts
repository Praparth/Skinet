import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy-service';
import { CartService } from '../../core/services/CartService';
import { Account } from '../../core/services/account';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone : true,
  imports: [
      MatIcon,
      MatButton,
      MatBadge,
      RouterLink,
      RouterLinkActive,
      MatProgressBar,
      MatMenu,
      MatMenuTrigger,
      //MatDivider,
      MatMenuItem
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(Account);
  private router = inject(Router);

  logout(){
    this.accountService.logout().subscribe({
      next :() => {
        this.accountService.currentUser.set(null)
        this.router.navigateByUrl('/');
      }
    });
  }
}
