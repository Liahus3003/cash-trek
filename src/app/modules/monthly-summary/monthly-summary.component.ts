/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CardWrapperComponent } from '@shared/components/card-wrapper/card-wrapper.component';
import { CustomPopoverComponent } from '@shared/components/custom-popover/custom-popover.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { InputComponent } from '@shared/components/input/input.component';
import {
  LegendPosition,
  ScaleType,
  Color,
  NgxChartsModule,
} from '@swimlane/ngx-charts';
import { Subject, fromEvent, debounceTime, distinctUntilChanged, Observable, BehaviorSubject } from 'rxjs';
import { MonthlySummaryService } from './monthly-summary.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CustomPopoverComponent,
    CardWrapperComponent,
    CustomTableComponent,
    NgxChartsModule,
    FormsModule,
    InputComponent,
  ],
  providers: [DatePipe],
  standalone: true,
})
export class MonthlySummaryComponent implements AfterViewInit, OnInit {
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

  maxYear = this.datePipe.transform(new Date(), 'yyyy-MM');
  selectedYear = this.datePipe.transform(new Date(), 'yyyy-MM');

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

  constructor(private zone: NgZone, 
    private datePipe: DatePipe,
    private monthlySummaryService: MonthlySummaryService) {
  }

  ngOnInit(): void {
    this.getMonthwiseInfo();
  }

  getMonthwiseInfo(): void {
    this.populateTransactionTable();
    this.populateTransactionPerMonth();
    this.populateGroupedTransaction();
  }

  ngAfterViewInit(): void {
    this.fixGraphPosition();
    setTimeout(() => {
      this.onResize();
    }, 0);
  }

  changeMonth($event: string) {
    this.selectedYear = $event;
    this.getMonthwiseInfo();
  }

  populateTransactionTable(startIndex = 1, limit = 5): void {
    this.monthlySummaryService
      .getExpensesByMonth(this.currentMonth.toString(), this.currentYear.toString(), startIndex, limit)
      .subscribe((data) => this._transactionStream.next(data));
  }

  populateTransactionPerMonth(): void {
    this.monthlySummaryService
      .getExpensesByMonthPerDay(this.currentMonth.toString(), this.currentYear.toString())
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
            name: `${exp.day.toString()}`,
            series: [
              {
                name: 'Median',
                value: 1000,
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
            return { name: exp.day.toString(), value: exp.total };
          }),
        };
        info.push(yearInfo);
      });
    }
    this._lineInfoStream.next(info);
  }

  populateGroupedTransaction(): void {
    this.monthlySummaryService
      .getMonthlyTransactionsByCategoryType(this.currentMonth.toString(), this.currentYear.toString())
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
    }
  }

  mapAction(id: number, type: string): void {
    console.log(id, type);
  }

  get currentMonth(): number {
    return +(this.selectedYear?.split('-')[1] ?? 0);
  }

  get currentYear(): number {
    return +(this.selectedYear?.split('-')[0] ?? 0);
  }
}
