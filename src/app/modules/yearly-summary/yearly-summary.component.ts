/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
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
import { YearlySummaryService } from './yearly-summary.service';
import {
  fromEvent,
  debounceTime,
  distinctUntilChanged,
  Subject,
  of,
  Observable,
  BehaviorSubject,
} from 'rxjs';

@UntilDestroy({ checkProperties: true })
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
    FormsModule,
    NgxChartsModule,
  ],
  standalone: true,
})
export class YearlySummaryComponent implements OnInit, AfterViewInit {
  @ViewChild('graphWrapper') graphWrapper!: ElementRef;
  changeSize = new Subject<Event>();

  legendPosition: LegendPosition = LegendPosition.Below;
  selectedYear = new Date().getFullYear();
  colorScheme: Color = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  view: [number, number] = [700, 375];

  _treeInfoStream = new BehaviorSubject<
    { name: string; value: number }[] | undefined
  >(undefined);
  _seriesInfoStream = new BehaviorSubject<
    { name: string; value: number; label: string }[]
  >([]);
  _lineInfoStream = new BehaviorSubject<any[]>([]);
  _multiInfoStream = new BehaviorSubject<any[]>([]);
  _transactionStream = new BehaviorSubject<{expenses: any[]; totalExpenses: number } | undefined>(undefined);

  treeInfo$: Observable<{ name: string; value: number }[] | undefined> =
    this._treeInfoStream.asObservable();
  seriesInfo$: Observable<{ name: string; value: number; label: string }[]> =
    this._seriesInfoStream.asObservable();
  lineInfo$ = this._lineInfoStream.asObservable();
  multiInfo$ = this._multiInfoStream.asObservable();
  transactionInfo$ = this._transactionStream.asObservable();

  constructor(
    private zone: NgZone,
    private yearlySummaryService: YearlySummaryService
  ) {}

  ngOnInit(): void {
    this.getYearWiseData()
  }

  ngAfterViewInit(): void {
    this.fixGraphPosition();
    setTimeout(() => {
      this.onResize();
    }, 0);
  }

  changeYear($event: number) {
    this.selectedYear = $event;
    this.getYearWiseData();
  }

  getYearWiseData(): void {
    this.populateTransactionTable();
    this.populateTransactionPerMonth();
    this.populateGroupedTransaction();
  }

  populateTransactionTable(startIndex = 1, limit = 5): void {
    this.yearlySummaryService
      .getExpensesByYear(this.selectedYear.toString(), startIndex, limit)
      .subscribe((data) => this._transactionStream.next(data));
  }

  populateTransactionPerMonth(): void {
    this.yearlySummaryService
      .getExpensesByYearPerMonth(this.selectedYear.toString())
      .subscribe(data => {
        this.mapLineInfo({ ...data });
        this.mapMultiInfo({ ...data });
      });
  }

  mapMultiInfo(data: any): void {
    const info: any[] = [];
    Object.keys(data.expenseDetails[0]).forEach(key => {
      info.push(
        data.expenseDetails[0][key].map((exp: any) => {
          return {
            name: `M-${exp.month.toString()}`,
            series: [
              {
                name: 'Median',
                value: 40000,
              },
              {
                name: 'Spent',
                value: exp.total,
              },
            ],
          };
        })
      );
    });
    this._multiInfoStream.next(info.flat());
  }

  onPageUpdate($event: {currentPage: number}): void {
    this.populateTransactionTable($event.currentPage);
  }

  mapLineInfo(data: any): void {
    const info: any[] = [];
    for (let i = 0; i < data?.expenseDetails.length; i++) {
      Object.keys(data.expenseDetails[i]).forEach(key => {
        const yearInfo = {
          name: key,
          series: data.expenseDetails[i][key].map((exp: any) => {
            return { name: exp.month.toString(), value: exp.total };
          }),
        };
        info.push(yearInfo);
      });
    }
    this._lineInfoStream.next(info);
  }

  populateGroupedTransaction(): void {
    this.yearlySummaryService
      .getYearlyTransactionsByCategoryType(this.selectedYear.toString())
      .subscribe(data => {
        this.mapTreeInfo({ ...data });
        this.mapSeriesInfo({ ...data });
      });
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
      return `${item.name}`;
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
