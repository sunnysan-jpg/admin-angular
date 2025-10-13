import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RegisterComponent } from './register/register.component';
import { OrdersComponent } from './orders/orders.component';
import { CategoryComponent } from './category/category.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CustomersComponent } from './customers/customers.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    { path: 'products', component: ProductComponent,canActivate: [AdminGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AdminGuard]},
  { path: 'login', component: LoginComponent },
  {path: '',component:LoginComponent},
  { path: 'register', component: RegisterComponent },
  {path: 'orders',component: OrdersComponent,canActivate: [AdminGuard]},
  {path: 'categories', component: CategoryComponent, canActivate: [AdminGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AdminGuard]},
  {path: 'customers', component: CustomersComponent, canActivate: [AdminGuard]},
  {path: 'inventory', component: InventoryComponent, canActivate: [AdminGuard]},
  {path: 'reports', component: ReportsComponent, canActivate: [AdminGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
