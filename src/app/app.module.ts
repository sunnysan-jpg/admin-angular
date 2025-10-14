import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductmodelComponent } from './productmodel/productmodel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';


// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsModalComponent } from './orders-detail/orders-detail.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // ⬅️ THIS WAS MISSING!
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoryComponent } from './category/category.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CustomersComponent } from './customers/customers.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component'; // ⬅️ ADD THIS TOO!
import { ThemeService } from './services/theme.service';
import { ClickOutsideDirective } from './directives/click-outside.directive';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProductComponent,
    ProductmodelComponent,
    LoginComponent,
    RegisterComponent,
    OrdersComponent,
    OrderDetailsModalComponent,
    CategoryDialogComponent,
    CategoryComponent,
    AnalyticsComponent,
    CustomersComponent,
    InventoryComponent,
    ReportsComponent,
    SettingsComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
        MatToolbarModule,
         FormsModule, 
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    NgChartsModule,
      MatProgressSpinnerModule, // ⬅️ THIS FIXES THE ERROR!
    MatCheckboxModule ,
    FormsModule 
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
   ThemeService,
AuthService,
ProductService,
AdminGuard,
AuthGuard],

  bootstrap: [AppComponent]
})
export class AppModule { }
