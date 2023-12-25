/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';
import { ScreenSizeService } from '@shared/services/screen-size.service';
import { Observable } from 'rxjs';
import { SelectComponent } from '../select/select.component';

const actions: { [key: string]: string } = {
  delete: 'trash',
  edit: 'edit',
};

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, CustomPaginatorComponent, SelectComponent, KeyValuePipe, TitleCasePipe, DatePipe
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.less'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tableData: any[] | undefined = [];
  @Input() isClientSide = true;
  @Input() itemsPerPage = 25;
  @Input() sortConfig: string[] = ['name', 'priority'];
  @Input() totalRecords!: number;
  @Output() actionEmitter = new EventEmitter<{data: any; type: string}>();
  @Output() pageChange = new EventEmitter<{currentPage: number}>();

  currentPage = 1;
  startIndex = 0;
  endIndex!: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedData: any[] | undefined = [];
  deviceInfo$!: Observable<string>;

  sortedColumn = 'name';
  sortDirection = 'asc';

  get getTableHeaders() {
    if (!this.tableData?.length) {
      return [];
    }
    return Object.keys(this.tableData[0]);
  }

  constructor(private screenSizeService: ScreenSizeService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.endIndex = this.itemsPerPage;
    this.deviceInfo$ = this.screenSizeService.getScreenSize();
    this.refreshPageInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData'].previousValue !== changes['tableData'].currentValue) {
      this.tableData = changes['tableData'].currentValue;
      if (!this.isClientSide) {
        this.displayedData = [...this.tableData ?? []];
      } else {
        this.refreshPageInfo();
      }
    }
  }

  iconName(name: string): string {
    return actions[name];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  triggerAction(row: any, type: string): void {
    this.actionEmitter.emit({ data: row, type });
  }

  changePage(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.currentPage * this.itemsPerPage;
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    if (this.isClientSide) {
      this.refreshPageInfo();
    } else {
      this.changePage();
      this.pageChange.emit({
        currentPage: this.currentPage
      });
    }
  }

  sort(column: string) {
    if (this.isSortable(column)) {
      this.sortDirection = (this.sortDirection === 'asc' ? 'desc' : 'asc');
      this.sortedColumn = column;
      this.tableData?.sort((a, b) => {
        let sortValue = 0;
  
        if (a[column] > b[column]) {
          sortValue = 1;
        } else if (a[column] < b[column]) {
          sortValue = -1;
        }
  
        if (this.sortDirection === 'desc') {
          sortValue = sortValue * -1;
        }
  
        return sortValue;
      });  
      this.refreshPageInfo();
    }
  }

  refreshPageInfo(): void {
    if (this.isClientSide) {
      this.changePage();
      this.displayedData = [...this.tableData?.slice(this.startIndex, this.endIndex) ?? []];
    }
  }
  
  isSortable(column: string): boolean {
    return this.sortConfig.includes(column) && this.isClientSide;
  }  

  sortIcon(column: string): string {
    if (column === this.sortedColumn && this.sortDirection === 'desc') {
      return 'desc';
    } else if (column === this.sortedColumn && this.sortDirection === 'asc') {
      return 'asc';
    } else {
      return 'reset-sort';
    }
  }

  get totalSize(): number {
    if (this.isClientSide) {
      return this.tableData?.length ?? 0;
    } else {
      return this.totalRecords;
    }
  }

  isObject(value: unknown): boolean {
    return (typeof value === 'object') && value !== null;
  }

  transformDate(value: any): string {
    return this.datePipe.transform(value, "dd-MMM-yyyy") ?? '';
  }
}
