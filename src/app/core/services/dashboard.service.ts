import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl =
    'https://hiring-dev.internal.kloudspot.com/api/analytics';

  private siteId = 'b0fa4e2a-2159-42e7-b97b-2a9d481158f6';

  constructor(private http: HttpClient) {}

  getFootfall(fromUtc: number, toUtc: number) {
    return this.http.post<any>(`${this.baseUrl}/footfall`, {
      siteId: this.siteId,
      fromUtc,
      toUtc
    });
  }

  getOccupancy(fromUtc: number, toUtc: number) {
    return this.http.post<any>(`${this.baseUrl}/occupancy`, {
      siteId: this.siteId,
      fromUtc,
      toUtc
    });
  }

  getDwell(fromUtc: number, toUtc: number) {
    return this.http.post<any>(`${this.baseUrl}/dwell`, {
      siteId: this.siteId,
      fromUtc,
      toUtc
    });
  }

  getDemographics(fromUtc: number, toUtc: number) {
    return this.http.post<any>(`${this.baseUrl}/demographics`, {
      siteId: this.siteId,
      fromUtc,
      toUtc
    });
  }
  getEntryExit(
  fromUtc: number,
  toUtc: number,
  pageNumber: number,
  pageSize: number
) {
  return this.http.post<any>(
    'https://hiring-dev.internal.kloudspot.com/api/analytics/entry-exit',
    {
      siteId: 'b0fa4e2a-2159-42e7-b97b-2a9d481158f6',
      fromUtc,
      toUtc,
      pageNumber,
      pageSize
    }
  );
}
getAlerts(fromUtc: number, toUtc: number) {
  return this.http.post<any[]>(
    '/api/analytics/alerts',
    { fromUtc, toUtc }
  );
}


}
