import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  activeTab: string = 'dashboard';
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
         this.authService.isAdmins$.subscribe((status) => {
      this.isAdmin = status;
      console.log("end",this.isAdmin)
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
  }
}
