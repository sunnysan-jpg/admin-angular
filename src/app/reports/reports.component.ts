import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Report {
  id: number;
  name: string;
  type: 'sales' | 'inventory' | 'customers' | 'products' | 'financial';
  status: 'completed' | 'processing' | 'failed';
  generatedDate: Date;
  fileSize: string;
  downloadCount: number;
  summary?: string;
}

interface ScheduledReport {
  id: number;
  name: string;
  type: string;
  frequency: string;
  nextRun: Date;
  recipients: string[];
  isActive: boolean;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [
    {
      id: 1,
      name: 'December Sales Report',
      type: 'sales',
      status: 'completed',
      generatedDate: new Date('2024-12-01'),
      fileSize: '2.4 MB',
      downloadCount: 15,
      summary: 'Monthly sales analysis with revenue breakdown and top products'
    },
    {
      id: 2,
      name: 'Q4 Inventory Analysis',
      type: 'inventory',
      status: 'completed',
      generatedDate: new Date('2024-11-28'),
      fileSize: '1.8 MB',
      downloadCount: 8,
      summary: 'Quarterly inventory levels and stock movement analysis'
    },
    {
      id: 3,
      name: 'Customer Insights Report',
      type: 'customers',
      status: 'completed',
      generatedDate: new Date('2024-11-25'),
      fileSize: '3.1 MB',
      downloadCount: 12,
      summary: 'Customer segmentation and behavior analysis'
    },
    {
      id: 4,
      name: 'Product Performance - November',
      type: 'products',
      status: 'processing',
      generatedDate: new Date('2024-11-30'),
      fileSize: '1.2 MB',
      downloadCount: 0,
      summary: 'Top-selling products and performance metrics'
    },
    {
      id: 5,
      name: 'Financial Summary 2024',
      type: 'financial',
      status: 'completed',
      generatedDate: new Date('2024-11-20'),
      fileSize: '4.5 MB',
      downloadCount: 25,
      summary: 'Annual financial performance and profit analysis'
    }
  ];

  scheduledReports: ScheduledReport[] = [
    {
      id: 1,
      name: 'Weekly Sales Summary',
      type: 'sales',
      frequency: 'Weekly',
      nextRun: new Date('2024-12-09'),
      recipients: ['admin@makhana.com', 'sales@makhana.com'],
      isActive: true
    },
    {
      id: 2,
      name: 'Monthly Inventory Report',
      type: 'inventory',
      frequency: 'Monthly',
      nextRun: new Date('2024-12-31'),
      recipients: ['inventory@makhana.com'],
      isActive: true
    },
    {
      id: 3,
      name: 'Quarterly Financial Report',
      type: 'financial',
      frequency: 'Quarterly',
      nextRun: new Date('2025-01-01'),
      recipients: ['finance@makhana.com', 'ceo@makhana.com'],
      isActive: false
    }
  ];

  filteredReports: Report[] = [];
  searchTerm: string = '';
  typeFilter: string = '';
  dateFilter: string = '';
  sortBy: string = 'date-desc';

  // Generate modal
  showGenerateModal: boolean = false;
  selectedReportType: string = '';
  isGenerating: boolean = false;
  newReport: any = {
    name: '',
    dateRange: 'month',
    fromDate: '',
    toDate: '',
    formats: {
      pdf: true,
      excel: false,
      csv: false
    },
    sendEmail: false,
    emailRecipients: ''
  };

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.filteredReports = [...this.reports];
    this.sortReports();
  }

  // Stats calculations
  getGeneratedThisMonth(): number {
    const thisMonth = new Date().getMonth();
    return this.reports.filter(r => new Date(r.generatedDate).getMonth() === thisMonth).length;
  }

  getScheduledCount(): number {
    return this.scheduledReports.filter(s => s.isActive).length;
  }

  getTotalDownloads(): number {
    return this.reports.reduce((sum, r) => sum + r.downloadCount, 0);
  }

  getStorageUsed(): number {
    return 127.5; // Mock value
  }

  getStoragePercentage(): number {
    return Math.round((this.getStorageUsed() / 500) * 100);
  }

  // Report icons
  getReportIcon(type: string): string {
    const icons: any = {
      'sales': '📊',
      'inventory': '📦',
      'customers': '👥',
      'products': '🌾',
      'financial': '💰'
    };
    return icons[type] || '📄';
  }

  // Filters
  applyFilters() {
    this.filteredReports = this.reports.filter(report => {
      const searchMatch = !this.searchTerm || 
        report.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(this.searchTerm.toLowerCase());

      const typeMatch = !this.typeFilter || report.type === this.typeFilter;

      let dateMatch = true;
      if (this.dateFilter) {
        const reportDate = new Date(report.generatedDate);
        const today = new Date();
        
        switch(this.dateFilter) {
          case 'today':
            dateMatch = reportDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = reportDate >= weekAgo;
            break;
          case 'month':
            dateMatch = reportDate.getMonth() === today.getMonth();
            break;
          case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            const reportQuarter = Math.floor(reportDate.getMonth() / 3);
            dateMatch = quarter === reportQuarter;
            break;
        }
      }

      return searchMatch && typeMatch && dateMatch;
    });

    this.sortReports();
  }

  resetFilters() {
    this.searchTerm = '';
    this.typeFilter = '';
    this.dateFilter = '';
    this.applyFilters();
  }

  sortReports() {
    switch(this.sortBy) {
      case 'date-desc':
        this.filteredReports.sort((a, b) => 
          new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()
        );
        break;
      case 'date-asc':
        this.filteredReports.sort((a, b) => 
          new Date(a.generatedDate).getTime() - new Date(b.generatedDate).getTime()
        );
        break;
      case 'name':
        this.filteredReports.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        this.filteredReports.sort((a, b) => 
          parseFloat(b.fileSize) - parseFloat(a.fileSize)
        );
        break;
    }
  }

  // Report actions
  generateReport(type: string) {
    this.selectedReportType = type;
    this.newReport = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      dateRange: 'month',
      fromDate: '',
      toDate: '',
      formats: { pdf: true, excel: false, csv: false },
      sendEmail: false,
      emailRecipients: ''
    };
    this.showGenerateModal = true;
  }

  closeGenerateModal() {
    this.showGenerateModal = false;
    this.isGenerating = false;
  }

  getAvailableSections() {
    return [
      { id: 'summary', label: 'Executive Summary', selected: true },
      { id: 'details', label: 'Detailed Analysis', selected: true },
      { id: 'charts', label: 'Charts & Graphs', selected: true },
      { id: 'tables', label: 'Data Tables', selected: false },
      { id: 'recommendations', label: 'Recommendations', selected: false }
    ];
  }

  submitGenerateReport() {
    this.isGenerating = true;
    
    setTimeout(() => {
      const newReport: Report = {
        id: this.reports.length + 1,
        name: this.newReport.name,
        type: this.selectedReportType as any,
        status: 'completed',
        generatedDate: new Date(),
        fileSize: '2.1 MB',
        downloadCount: 0,
        summary: 'Generated report with custom parameters'
      };

      this.reports.unshift(newReport);
      this.applyFilters();
      
      this.snackBar.open('✅ Report generated successfully!', 'Close', { duration: 3000 });
      this.closeGenerateModal();
    }, 2000);
  }

  viewReport(report: Report) {
    this.snackBar.open(`Opening ${report.name}...`, 'Close', { duration: 2000 });
  }

  downloadReport(report: Report) {
    report.downloadCount++;
    this.snackBar.open(`📥 Downloading ${report.name}...`, 'Close', { duration: 2000 });
  }

  shareReport(report: Report) {
    this.snackBar.open(`🔗 Share link copied to clipboard`, 'Close', { duration: 2000 });
  }

  deleteReport(report: Report) {
    if (confirm(`Delete "${report.name}"?`)) {
      this.reports = this.reports.filter(r => r.id !== report.id);
      this.applyFilters();
      this.snackBar.open('Report deleted', 'Close', { duration: 2000 });
    }
  }

  // Scheduled reports
  toggleSchedule(schedule: ScheduledReport) {
    schedule.isActive = !schedule.isActive;
    this.snackBar.open(
      `Schedule ${schedule.isActive ? 'resumed' : 'paused'}`, 
      'Close', 
      { duration: 2000 }
    );
  }

  editSchedule(schedule: ScheduledReport) {
    this.snackBar.open(`Editing ${schedule.name}`, 'Close', { duration: 2000 });
  }

  deleteSchedule(schedule: ScheduledReport) {
    if (confirm(`Delete schedule "${schedule.name}"?`)) {
      this.scheduledReports = this.scheduledReports.filter(s => s.id !== schedule.id);
      this.snackBar.open('Schedule deleted', 'Close', { duration: 2000 });
    }
  }

  addSchedule() {
    this.snackBar.open('Add new schedule', 'Close', { duration: 2000 });
  }

  scheduleReport() {
    this.snackBar.open('Schedule report functionality', 'Close', { duration: 2000 });
  }

  exportAllReports() {
    this.snackBar.open('Exporting all reports...', 'Close', { duration: 2000 });
  }

  // Insights
  getMostGeneratedType(): string {
    const typeCounts: any = {};
    this.reports.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    
    let maxType = 'sales';
    let maxCount = 0;
    Object.keys(typeCounts).forEach(type => {
      if (typeCounts[type] > maxCount) {
        maxCount = typeCounts[type];
        maxType = type;
      }
    });
    
    return maxType.charAt(0).toUpperCase() + maxType.slice(1);
  }

  getAvgGenerationTime(): number {
    return 3.5; // Mock value
  }

  getPeakUsageDay(): string {
    return 'Monday'; // Mock value
  }

  getSuccessRate(): number {
    const completed = this.reports.filter(r => r.status === 'completed').length;
    return Math.round((completed / this.reports.length) * 100);
  }
}