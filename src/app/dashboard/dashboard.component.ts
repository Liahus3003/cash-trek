/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
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
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { DashboardService } from './dashboard.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  standalone: true,
  imports: [
    CardWrapperComponent,
    CustomPopoverComponent,
    CustomTableComponent,
    NgxChartsModule,
    CounterBoxComponent,
  ],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  _treeInfoStream = new BehaviorSubject<
    { name: string; value: number }[] | undefined
  >(undefined);
  _seriesInfoStream = new BehaviorSubject<
    { name: string; value: number; label: string }[]
  >([]);
  _multiInfoStream = new BehaviorSubject<any[]>([]);
  _accumulationInfoStream = new BehaviorSubject<any>(null);

  treeInfo$: Observable<{ name: string; value: number }[] | undefined> =
    this._treeInfoStream.asObservable();
  seriesInfo$: Observable<{ name: string; value: number; label: string }[]> =
    this._seriesInfoStream.asObservable();
  multiInfo$ = this._multiInfoStream.asObservable();
  accumulationInfo$ = this._accumulationInfoStream.asObservable();

  accumulationInfo = of(null);
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: Color = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  view: [number, number] = [700, 375];

  creditsData = [
    {
      name: 'Travel',
      date: 'Today',
      amount: '$369',
      description: 'Sample description',
    },
    {
      name: 'Travel',
      date: '23/1/24',
      amount: '$369',
      description: 'Sample description',
    },
    {
      name: 'Travel',
      date: '23/1/24',
      amount: '$369',
      description: 'Sample description',
    },
  ];

  expenseData = [
    {
      name: 'Travel',
      date: '23/1/24',
      amount: '$369',
      description: 'Sample description',
    },
    {
      name: 'Travel',
      date: '23/1/24',
      amount: '$369',
      description: 'Sample description',
    },
    {
      name: 'Travel',
      date: '23/1/24',
      amount: '$369',
      description: 'Sample description',
    },
  ];

  @ViewChild('graphWrapper') graphWrapper!: ElementRef;
  changeSize = new Subject<Event>();
  expenseInfo$!: Observable<any[]>;
  creditInfo$!: Observable<any[]>;

  constructor(
    private zone: NgZone,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.populateTransactions();
    this.populateExpenseSummary();
    this.populateExpenseInfo();
  }

  populateTransactions(): void {
    this.expenseInfo$ = this.dashboardService.getTransactions('Expense');
    this.creditInfo$ = this.dashboardService.getTransactions('Credit');
  }

  populateExpenseSummary(): void {
    this.dashboardService.getLastSixMonthsExpenseSum().subscribe(data => {
      this.mapTreeInfo({ ...data });
      this.mapSeriesInfo({ ...data });
    });
  }

  populateExpenseInfo(): void {
    this.dashboardService.getLastSixMonthsExpense().subscribe(data => {
      this.mapMultiInfo({ ...data });
    });
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

  mapMultiInfo(data: any): void {
    this._accumulationInfoStream.next({
      credits: data.accCredit?.toFixed(2),
      expenses: data.accExpense?.toFixed(2),
      balance: (data.accCredit - data.accExpense)?.toFixed(2),
      spendThreshold: 240_000
    });
    const details: any[] = [];
    data.expenseDetails?.forEach((info: any) => {
      details.push({
        name: `${info.period}`,
        series: [
          {
            name: 'Credit',
            value: info.totalCredit,
          },
          {
            name: 'Spent',
            value: info.totalExpense,
          },
        ],
      });
    });
    this._multiInfoStream.next(details.reverse());
  }

  mapTreeInfo(data: any): void {
    const treeInfo: { name: string; value: number }[] = data.expenses.map(
      (transaction: { categoryType: any; total: any }) => {
        return {
          name: transaction.categoryType,
          value: transaction.total,
        };
      }
    );
    this._treeInfoStream.next([...treeInfo]);
  }

  mapSeriesInfo(data: any): void {
    const seriesInfo: { name: string; value: number; label: string }[] =
      data.expenses.map((transaction: { categoryType: any; total: any }) => {
        return {
          name: transaction.categoryType,
          value: transaction.total,
          label: `${((transaction.total / data.overallTotal) * 100).toFixed(
            1
          )}%`,
        };
      });
    this._seriesInfoStream.next([...seriesInfo]);
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
    return `${c.label}`;
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
