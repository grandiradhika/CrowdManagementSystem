import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { DashboardService } from 'src/app/core/services/dashboard.service';

Chart.register(annotationPlugin);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit ,AfterViewInit {

  occupancy = 0;
  footfall = 0;
  dwellTime = '';

  fromUtc!: number;
  toUtc!: number;

  occupancyChart!: Chart;
  demographicsChart!: Chart;
  demographicsDonut!: Chart;

  malePercent = 0;
femalePercent = 0;


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.setTimeRange();
    this.loadOccupancy();
    this.loadFootfall();
    this.loadDwell();
    // this.loadDemographics();
  }

  ngAfterViewInit(): void {
    // this.loadOccupancy();
    this.loadDemographics();// Charts are initialized after view is ready
  }

  setTimeRange() {
    this.fromUtc = new Date().setHours(0, 0, 0, 0);
    this.toUtc = Date.now();
  }

  /* OCCUPANCY (CARD + CHART) */
  // loadOccupancy() {
  //   this.dashboardService.getOccupancy(this.fromUtc, this.toUtc)
  //     .subscribe(res => {
  //       console.log('Occupancy API response:', res);
  //       this.occupancy = res.current ?? 0;
  //       this.initOccupancyChart(res);
  //     });
  // }
  loadOccupancy() {
  // this.dashboardService.getOccupancy(this.fromUtc, this.toUtc)
  //   .subscribe(res => {
  //     console.log('Occupancy API response:', res);

  //     const lastBucket = res?.buckets?.[res.buckets.length - 1];
  //     this.occupancy = lastBucket?.avg ?? 0; // ✅ FIXED

  //     this.initOccupancyChart(res);
  //   });
  this.dashboardService.getOccupancy(this.fromUtc, this.toUtc)
    .subscribe(res => {

      if (!res?.buckets?.length) return;

      const buckets = res.buckets;
      const lastBucket = buckets[buckets.length - 1];

      this.occupancy = Math.round(lastBucket.avg);
      this.occupancyDelta = this.calculateDelta(buckets);

      this.initOccupancyChart(res);
    });
}

initOccupancyChart(res: any) {
  if (this.occupancyChart) {
    this.occupancyChart.destroy();
  }

  if (!res?.buckets || !Array.isArray(res.buckets)) {
    console.error('Buckets data missing or invalid', res);
    return;
  }

  // X-axis labels (use LOCAL time string)
  const labels = res.buckets.map((b: any) =>
    b.local.split(' ')[1].slice(0, 5) // "03:00"
  );

  // Y-axis values (average occupancy)
  const values = res.buckets.map((b: any) => b.avg);

  const liveIndex = labels.length - 1;

  this.occupancyChart = new Chart('occupancyChart', {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Occupancy',
          data: values,
          borderColor: '#0f9d9a',
          backgroundColor: 'rgba(15,157,154,0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#0f9d9a'
        
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            live: {
              type: 'line',
              xMin: liveIndex,
              xMax: liveIndex,
              borderColor: '#ef4444',
              borderDash: [6, 6],
              label: {
                content: 'LIVE',
                display: true
              }
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Time' }
        },
        y: {
          title: { display: true, text: 'Count' },
          beginAtZero: true
        }
      }
    
    }
  });
}






  /* FOOTFALL */
  loadFootfall() {
    this.dashboardService.getFootfall(this.fromUtc, this.toUtc)
      .subscribe(res => {this.footfall = res.footfall ?? 0;
      this.footfallDelta =0;
      });
  }

  /* DWELL TIME */
  loadDwell() {
    this.dashboardService.getDwell(this.fromUtc, this.toUtc)
      .subscribe(res => this.dwellTime = res.avgDwellMinutes?? '0 min');
  }

  /* DEMOGRAPHICS */
  // loadDemographics() {
  //   this.dashboardService.getDemographics(this.fromUtc, this.toUtc)
  //     .subscribe(res => {

  //       if (this.demographicsChart) this.demographicsChart.destroy();
  //       if (this.demographicsDonut) this.demographicsDonut.destroy();

  //       this.demographicsChart = new Chart('demographicsChart', {
  //         type: 'line',
  //         data: {
  //           labels: res.timeline.map((x: any) => x.time),
  //           datasets: [
  //             { label: 'Male', data: res.timeline.map((x: any) => x.male) },
  //             { label: 'Female', data: res.timeline.map((x: any) => x.female) }
  //           ]
  //         },
  //         options: {
  //           responsive: true,
  //           maintainAspectRatio: false
  //         }
  //       });

  //       this.demographicsDonut = new Chart('demographicsDonut', {
  //         type: 'doughnut',
  //         data: {
  //           labels: ['Male', 'Female'],
  //           datasets: [{
  //             data: [res.summary.malePercent, res.summary.femalePercent],
  //             backgroundColor: ['#4db6ac', '#b2dfdb']
  //           }]
  //         },
  //         options: {
  //           cutout: '70%'
  //         }
  //       });
  //     });
  // }
  loadDemographics() {
  this.dashboardService.getDemographics(this.fromUtc, this.toUtc)
    .subscribe(res => {

      if (this.demographicsChart) this.demographicsChart.destroy();
      if (this.demographicsDonut) this.demographicsDonut.destroy();

      // SAFETY CHECK
      if (!res?.buckets || !Array.isArray(res.buckets)) {
        console.error('Invalid demographics response', res);
        return;
      }

      // -----------------------------
      // LINE CHART DATA
      // -----------------------------
      const labels = res.buckets.map((b: any) =>
        b.local.split(' ')[1].slice(0, 5) // "03:00"
      );

      const maleData: number[] = res.buckets.map((b: any) => b.male);
const femaleData: number[] = res.buckets.map((b: any) => b.female);

      this.demographicsChart = new Chart('demographicsChart', {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Male',
              data: maleData,
              borderColor: '#4db6ac',
              backgroundColor: 'rgba(77,182,172,0.15)',
              fill: false,
              tension: 0.35,
              pointRadius: 4
            },
            {
              label: 'Female',
              data: femaleData,
              borderColor: '#ec4899',
              backgroundColor: 'rgba(236,72,153,0.15)',
              fill: false,
              tension: 0.35,
              pointRadius: 4
            }
          ]
        },
        // options: {
        //   responsive: true,
        //   maintainAspectRatio: false
        // }
        options: {
  responsive: true,
  maintainAspectRatio: false, // 🔒 REQUIRED
  animation: false,           // 🔒 PREVENT RESIZE LOOP
  plugins: {
    legend: { display: false}
  },
  scales: {
  x: { title: { display: true, text: 'Time' } },
  y: { title: { display: true, text: 'Count' } }
}
}

      });

      // -----------------------------
      // DONUT CHART (AVERAGE %)
      // -----------------------------
      

const maleAvg =
  maleData.reduce((a: number, b: number) => a + b, 0) / maleData.length;

const femaleAvg =
  femaleData.reduce((a: number, b: number) => a + b, 0) / femaleData.length;
  this.malePercent = Math.round(maleAvg);
this.femalePercent = Math.round(femaleAvg);


      this.demographicsDonut = new Chart('demographicsDonut', {
  type: 'doughnut',
  data: {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [
        Math.round(maleAvg),
        Math.round(femaleAvg)
      ],
      backgroundColor: ['#4db6ac', '#f9a8d4']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false   // ✅ REMOVE RECTANGLE LEGEND
      }
    }
  }
});

    });
}
occupancyDelta = 0;
footfallDelta = 0;
dwellDelta = 0;
private calculateDelta(buckets: any[]): number {
  if (!buckets || buckets.length < 2) return 0;

  const prev = buckets[buckets.length - 2].avg;
  const curr = buckets[buckets.length - 1].avg;

  return Math.round(((curr - prev) / prev) * 100);
}


}
