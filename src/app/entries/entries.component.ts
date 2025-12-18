import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../core/services/dashboard.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {

  entries: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  fromUtc!: number;
  toUtc!: number;

  loading = false;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.setTimeRange();
    this.loadEntries();
  }

  setTimeRange() {
    this.fromUtc = new Date().setHours(0, 0, 0, 0);
    this.toUtc = Date.now();
  }

  loadEntries() {
  this.loading = true;
  this.error = '';

  this.dashboardService
    .getEntryExit(
      this.fromUtc,
      this.toUtc,
      this.pageNumber,
      this.pageSize
    )
    .subscribe({
      next: (res) => {
        console.log('Entry–Exit API response:', res);

        // TABLE DATA
        this.entries = res.records ?? [];

        // PAGINATION
        const total = res.totalRecords ?? 0;
        this.totalPages = Math.ceil(total / this.pageSize);

        this.pages = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load entry–exit data';
        console.error('Entry–Exit API error', err);
      }
    });
}


  goToPage(page: number) {
    if (page === this.pageNumber) return;
    this.pageNumber = page;
    this.loadEntries();
  }
  getVisiblePages(): (number | string)[] {
  const pages: (number | string)[] = [];

  const total = this.totalPages;
  const current = this.pageNumber;

  if (total <= 5) {
    // Show all pages
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  // Left ellipsis
  if (current > 3) {
    pages.push('...');
  }

  // Middle pages
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Right ellipsis
  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}

goToPrev() {
  if (this.pageNumber > 1) {
    this.goToPage(this.pageNumber - 1);
  }
}

goToNext() {
  if (this.pageNumber < this.totalPages) {
    this.goToPage(this.pageNumber + 1);
  }
}
goToPageSafe(page: number | string) {
  if (typeof page === 'number') {
    this.goToPage(page);
  }
}


}
