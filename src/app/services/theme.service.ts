import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<'light' | 'dark' | 'auto'>('light');
  public theme$ = this.currentTheme.asObservable();

  private mediaQuery: MediaQueryList;

  constructor() {
    // Get system preference
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'light';
    this.setTheme(savedTheme);

    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme.value === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  setTheme(theme: 'light' | 'dark' | 'auto') {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto') {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');

    if (theme === 'auto') {
      // Use system preference
      const isDark = this.mediaQuery.matches;
      root.classList.add(isDark ? 'dark-theme' : 'light-theme');
    } else {
      // Use selected theme
      root.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
    }
  }

  getCurrentTheme(): 'light' | 'dark' | 'auto' {
    return this.currentTheme.value;
  }

  getActualTheme(): 'light' | 'dark' {
    const theme = this.currentTheme.value;
    if (theme === 'auto') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return theme;
  }
}