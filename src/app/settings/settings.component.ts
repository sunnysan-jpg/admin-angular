import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../services/theme.service';

interface Session {
  id: number;
  device: 'desktop' | 'mobile';
  location: string;
  browser: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface Invoice {
  id: number;
  number: string;
  date: Date;
  amount: number;
}

interface Integration {
  id: number;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'general';

  settings = {
    general: {
      storeName: 'Mushroom Store',
      email: 'admin@mushroom.com',
      phone: '+91 98765 43210',
      timezone: 'Asia/Kolkata',
      address: '123 Main Street, Pimpri, Maharashtra, India',
      currency: 'INR',
      language: 'en',
       theme: 'light' as 'light' | 'dark' | 'auto'
    },
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mushroom.com',
      phone: '+91 98765 43210',
      jobTitle: 'Store Manager',
      department: 'admin',
      bio: '',
      avatar: ''
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      reviews: true,
      dailyReports: false,
      marketing: false,
      pushEnabled: true,
      sound: true
    },
    security: {
      twoFactorEnabled: false
    },
    advanced: {
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true
    }
  };

  activeSessions: Session[] = [
    {
      id: 1,
      device: 'desktop',
      location: 'Pune, Maharashtra',
      browser: 'Chrome on Windows',
      ip: '192.168.1.1',
      lastActive: 'Active now',
      current: true
    },
    {
      id: 2,
      device: 'mobile',
      location: 'Mumbai, Maharashtra',
      browser: 'Safari on iPhone',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      current: false
    }
  ];

  invoices: Invoice[] = [
    { id: 1, number: 'INV-2024-001', date: new Date('2024-12-01'), amount: 2999 },
    { id: 2, number: 'INV-2024-002', date: new Date('2024-11-01'), amount: 2999 },
    { id: 3, number: 'INV-2024-003', date: new Date('2024-10-01'), amount: 2999 }
  ];

  integrations: Integration[] = [
    {
      id: 1,
      name: 'Google Analytics',
      description: 'Track visitor behavior and site analytics',
      icon: '📊',
      enabled: true
    },
    {
      id: 2,
      name: 'Stripe Payment',
      description: 'Accept online payments securely',
      icon: '💳',
      enabled: true
    },
    {
      id: 3,
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      icon: '📧',
      enabled: false
    },
    {
      id: 4,
      name: 'WhatsApp Business',
      description: 'Customer support via WhatsApp',
      icon: '💬',
      enabled: true
    },
    {
      id: 5,
      name: 'Razorpay',
      description: 'Indian payment gateway',
      icon: '💰',
      enabled: false
    },
    {
      id: 6,
      name: 'Shiprocket',
      description: 'Shipping and logistics management',
      icon: '📦',
      enabled: true
    }
  ];

  constructor(private snackBar: MatSnackBar,private themeService: ThemeService) {}

  ngOnInit() {
    console.log('Settings loaded');
    this.settings.general.theme = this.themeService.getCurrentTheme();
    
    console.log('Settings loaded');
  }

  saveAllSettings() {
    this.snackBar.open('✅ All settings saved successfully!', 'Close', { duration: 3000 });
  }


    changeTheme(theme: 'light' | 'dark' | 'auto') {
    this.settings.general.theme = theme;
    this.themeService.setTheme(theme);
    
    const themeNames = {
      'light': '☀️ Light',
      'dark': '🌙 Dark',
      'auto': '🌓 Auto'
    };
    
    this.snackBar.open(`Theme changed to ${themeNames[theme]}`, 'Close', { duration: 2000 });
  }

  resetToDefault() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.snackBar.open('Settings reset to default', 'Close', { duration: 2000 });
    }
  }

  configure2FA() {
    this.snackBar.open('Opening 2FA configuration...', 'Close', { duration: 2000 });
  }

  revokeSession(session: Session) {
    if (confirm(`Revoke session from ${session.location}?`)) {
      this.activeSessions = this.activeSessions.filter(s => s.id !== session.id);
      this.snackBar.open('Session revoked successfully', 'Close', { duration: 2000 });
    }
  }

  clearCache() {
    if (confirm('Clear all cached data?')) {
      this.snackBar.open('Cache cleared successfully', 'Close', { duration: 2000 });
    }
  }

  exportData() {
    this.snackBar.open('Preparing data export...', 'Close', { duration: 2000 });
  }

  deleteAccount() {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
      this.snackBar.open('Account deletion initiated', 'Close', { duration: 3000 });
    }
  }
}