import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { CardWrapperComponent } from '@shared/components/card-wrapper/card-wrapper.component';
import { CustomPopoverComponent } from '@shared/components/custom-popover/custom-popover.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { InputComponent } from '@shared/components/input/input.component';
import {
  Color,
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { fromEvent, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-yearly-summary',
  templateUrl: './yearly-summary.component.html',
  styleUrls: ['./yearly-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CustomPopoverComponent,
    CardWrapperComponent,
    CustomTableComponent,
    InputComponent,
    NgxChartsModule
  ],
  standalone: true,
})
export class YearlySummaryComponent implements AfterViewInit {
  @ViewChild('graphWrapper') graphWrapper!: ElementRef;
  changeSize = new Subject<Event>();

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
      name: 'D-1',
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
      name: 'D-2',
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
      name: 'D-3',
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
      name: 'D-4',
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
      name: 'D-5',
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
      name: 'D-6',
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
      name: 'D-7',
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
      name: 'D-8',
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
      name: 'D-9',
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
      name: 'D-10',
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
  ];
  lineChart = [
    {
      name: '2023',
      series: [
        {
          name: '1',
          value: 100,
        },
        {
          name: '2',
          value: 1000,
        },
        {
          name: '3',
          value: 0,
        },
        {
          name: '4',
          value: 2000,
        },
      ],
    },

    {
      name: '2022',
      series: [
        {
          name: '1',
          value: 0,
        },
        {
          name: '2',
          value: -150,
        },
        {
          name: '3',
          value: 500,
        },
      ],
    },
  ];

  series = [
    {
      name: 'Retired',
      value: 20,
      label: '20%',
    },
    {
      name: 'Employed',
      value: 70,
      label: '70%',
    },
    {
      name: 'Unemployed',
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

  yearlyData = [
    { no: 1, name: 'Food', budget: 'Category', description: 'Items include food, beverages, snacks and cool drinks', priority: 'Yes'},
    { no: 2, name: 'Food', budget: 'Category', description: 'Items include food, beverages, snacks and cool drinks', priority: 'No'},
    { no: 3, name: 'Food', budget: 'Category', description: 'Items include food, beverages, snacks and cool drinks', priority: 'Yes'}
  ];

  constructor(private zone: NgZone) {
    console.log('');
  }

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

  mapAction(id: number, type: string): void {
    console.log(id, type);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
