import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, CustomPaginatorComponent, SelectComponent
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tableData: any[] = [];
  @Input() sortConfig: string[] = ['name', 'priority'];
  @Output() actionEmitter = new EventEmitter();

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;
  totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  startIndex = 0;
  endIndex = this.itemsPerPage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedData: any[] = [];
  deviceInfo$!: Observable<string>;

  sortedColumn = 'name';
  sortDirection = 'asc';

  get getTableHeaders() {
    return Object.keys(this.tableData[0]);
  }

  constructor(private screenSizeService: ScreenSizeService) {
  }

  ngOnInit(): void {
    this.deviceInfo$ = this.screenSizeService.getScreenSize();
  }

  iconName(name: string): string {
    return actions[name];
  }

  triggerAction(id: number, type: string): void {
    this.actionEmitter.emit({ id, type });
  }

  changePage(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.currentPage * this.itemsPerPage;
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.displayedData = this.tableData.slice(this.startIndex, this.endIndex);
  }

  sort(column: string) {
    this.sortDirection = (this.sortDirection === 'asc' ? 'desc' : 'asc');
    this.sortedColumn = column;

    if (this.isSortable(column)) {
      this.tableData.sort((a, b) => {
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
    }
  }
  
  isSortable(column: string): boolean {
    return this.sortConfig.includes(column);
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
}
