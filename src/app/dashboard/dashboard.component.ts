import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CardWrapperComponent } from '@shared/components/card-wrapper/card-wrapper.component';
import { CounterBoxComponent } from '@shared/components/counter-box/counter-box.component';
import { CustomPopoverComponent } from '@shared/components/custom-popover/custom-popover.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import {
  Color,
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { debounceTime, distinctUntilChanged, fromEvent, Subject } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  standalone: true,
  imports: [CardWrapperComponent, CustomPopoverComponent, CustomTableComponent, NgxChartsModule, CounterBoxComponent],
})
export class DashboardComponent implements AfterViewInit {
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: Color = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  view: [number, number] = [700, 375];
  multi = [
    {
      name: 'Oct 22',
      series: [
        {
          name: 'Median',
          value: 300,
        },
        {
          name: 'Spent',
          value: -700,
        },
      ],
    },
    {
      name: 'Nov 22',
      series: [
        {
          name: 'Median',
          value: 300,
        },
        {
          name: 'Spent',
          value: 0,
        },
      ],
    },
    {
      name: 'Dec 22',
      series: [
        {
          name: 'Median',
          value: 300,
        },
        {
          name: 'Spent',
          value: 700,
        },
      ],
    },
    {
      name: 'Jan 23',
      series: [
        {
          name: 'Median',
          value: 300,
        },
        {
          name: 'Spent',
          value: -1500,
        },
      ],
    },
    {
      name: 'Feb 23',
      series: [
        {
          name: 'Median',
          value: 0,
        },
        {
          name: 'Spent',
          value: 0,
        },
      ],
    },
    {
      name: 'Mar 23',
      series: [
        {
          name: 'Median',
          value: 0,
        },
        {
          name: 'Spent',
          value: 0,
        },
      ],
    },
    {
      name: 'Apr 23',
      series: [
        {
          name: 'Median',
          value: 0,
        },
        {
          name: 'Spent',
          value: 0,
        },
      ],
    }
  ];

  series = [
    {
      name: 'Family',
      value: 20,
      label: '20%',
    },
    {
      name: 'Invest',
      value: 70,
      label: '70%',
    },
    {
      name: 'Outing',
      value: 10,
      label: '10%',
    },
  ];

  treeInfo = [
    {
      name: 'Family',
      value: 33000,
    },
    {
      name: 'Netflix',
      value: 699,
    },
    {
      name: 'Invest',
      value: 15000,
    },
    {
      name: 'Entertainment',
      value: 1240,
    },
    {
      name: 'Outing',
      value: 2000,
    },
    {
      name: 'Travel',
      value: 500,
    },
  ];

  creditsData = [
    {name: 'Travel', date: 'Today', amount: '$369', description: 'Sample description'},
    {name: 'Travel', date: '23/1/24', amount: '$369', description: 'Sample description'},
    {name: 'Travel', date: '23/1/24', amount: '$369', description: 'Sample description'}
  ];

  expenseData = [
    {name: 'Travel', date: '23/1/24', amount: '$369', description: 'Sample description'},
    {name: 'Travel', date: '23/1/24', amount: '$369', description: 'Sample description'},
    {name: 'Travel', date: '23/1/24', amount: '$369', description: 'Sample description'}
  ];

  @ViewChild('graphWrapper') graphWrapper!: ElementRef;
  changeSize = new Subject<Event>();

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.fixGraphPosition();
    setTimeout(() => {
      this.onResize();
    }, 0);
  }

  fixGraphPosition() {
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((e: Event) => {
          this.zone.run(() => {
            this.changeSize.next(e);
          });
        });
    });
    this.changeSize.subscribe((e: Event) => {
      this.onResize(e);
    });
  }

  pieChartLabel(
    series: { name: string; value: number; label: string }[],
    name: string
  ): string {
    const item = series.find(data => data.name === name);
    if (item) {
      return item.label;
    }
    return name;
  }

  treeLabelFormatting(c: { name: string; label: string }) {
    return `${c.label} Expense`;
  }

  onResize(event?: Event) {
    if (this.graphWrapper && this.graphWrapper.nativeElement) {
      const width =
        window.innerWidth < 767
          ? this.graphWrapper.nativeElement.offsetWidth - 40
          : Math.floor(this.graphWrapper.nativeElement.offsetWidth / 2) - 40;
      const height = window.innerWidth < 767 ? 300 : 375;
      this.view = [width, height];
      console.log(this.view);
    }
  }
}
