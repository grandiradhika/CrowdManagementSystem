import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { SocketService } from 'src/app/core/services/socket.service';

interface AlertItem {
  name: string;
  action: string;
  zone: string;
  severity: 'High' | 'Medium' | 'Low';
  time: string;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  alerts: AlertItem[] = [];
  loading = false;

  constructor(private dashboardService: DashboardService,
    private socketService: SocketService
  ) {}

 
  ngOnInit(): void {
  this.alerts = [
    {
      name: 'Rony',
      action: 'Entered',
      zone: 'Zone B',
      severity: 'High',
      time: 'March 13 2025 10:12'
    },
    {
      name: 'Ahmed',
      action: 'Exited',
      zone: 'Zone A',
      severity: 'Medium',
      time: 'March 13 2025 10:05'
    },
    {
      name: 'Matthew',
      action: 'Entered',
      zone: 'Zone C',
      severity: 'Low',
      time: 'March 13 2025 09:58'
    }
  ];
}


  loadAlerts(): void {
    this.loading = true;

    const fromUtc = new Date().setHours(0, 0, 0, 0);
    const toUtc = Date.now();

    this.dashboardService
      .getEntryExit(fromUtc, toUtc, 1, 20)
      .subscribe({
        next: (res: any) => {
          const data = res?.data || [];
          console.log('Alerts API response:', data);
          this.alerts = data.map((item: any) => ({
            name: item.name || 'Anonymous Visitor',
            action: item.exitTime ? 'Exited' : 'Entered',
            zone: item.zone || 'Zone B',
            severity: this.getSeverity(item),
            time: new Date(item.entryTime || item.exitTime).toLocaleString()
          }));

          this.loading = false;
        },
        error: (err: any) => {
          console.error('Alerts load failed', err);
          this.alerts = [];
          this.loading = false;
        }
      });
  }

  getSeverity(item: any): 'High' | 'Medium' | 'Low' {
    if (item.dwellTime && item.dwellTime > 20) return 'High';
    if (item.dwellTime && item.dwellTime > 10) return 'Medium';
    return 'Low';
  }

  onClose(): void {
    this.close.emit();
  }
}
