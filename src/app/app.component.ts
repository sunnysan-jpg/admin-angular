// import { Component } from '@angular/core';
// import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'admin-portal';
//   isAdminLoggedIn = true;
// constructor(private authService: AuthService){}
// activeTab = 'dashboard'
// setTab = 'product'
//   ngOnInit(){
//     // this.isAdminLoggedIn  = this.authService.isAdmin()
//     // console.log('admin',this.isAdminLoggedIn)
//   }
// }


import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  activeTab: string = 'dashboard';
  isAdmin: boolean = false
  setTab(tab: string) {
    this.activeTab = tab;
  }
constructor (private authservice:AuthService){}
  ngOnInit(){
    console.log("sunny")
       this.authservice.isAdmins$.subscribe((status) => {
      this.isAdmin = status;
      console.log("end",this.isAdmin)
    });
    console.log("start",this.isAdmin)
  }
}

