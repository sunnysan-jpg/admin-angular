import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

interface Notification {
  id: number;
  type: 'order' | 'stock' | 'customer' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  showNotifications: boolean = false;
  showProfile: boolean = false;
  unreadCount: number = 0;
  isLogin: boolean = false;

  currentUser: any = {};

  notifications: Notification[] = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Doe',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'stock',
      title: 'Low Stock Alert',
      message: 'Shiitake Mushrooms stock is running low (15 units)',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Sarah Wilson has created a new account',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Delivered',
      message: 'Order #12340 has been successfully delivered',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features have been added to your dashboard',
      time: '1 day ago',
      read: true,
    },
  ];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.calculateUnreadCount();
    // You can load user data from AuthService here
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.isLogin = this.authService.isAuthenticated()
    console.log("lis",this.isLogin)
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false; // Close profile if open
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false; // Close notifications if open
  }

  calculateUnreadCount() {
    this.unreadCount = this.notifications.filter((n) => !n.read).length;
  }

  getNotificationIcon(type: string): string {
    const icons: any = {
      order: '🛍️',
      stock: '📦',
      customer: '👤',
      system: '⚙️',
    };
    return icons[type] || '🔔';
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.calculateUnreadCount();
    // Handle notification click action
    this.snackBar.open('Notification marked as read', 'Close', {
      duration: 2000,
    });
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.calculateUnreadCount();
    this.snackBar.open('All notifications marked as read', 'Close', {
      duration: 2000,
    });
  }

  viewAllNotifications() {
    this.showNotifications = false;
    this.router.navigate(['/notifications']); // Create this route if needed
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewActivity() {
    this.snackBar.open('Opening activity log...', 'Close', { duration: 2000 });
  }

  getHelp() {
    this.snackBar.open('Opening help center...', 'Close', { duration: 2000 });
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.snackBar.open('Logging out...', 'Close', { duration: 2000 });
      // Call your auth service logout
        this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
