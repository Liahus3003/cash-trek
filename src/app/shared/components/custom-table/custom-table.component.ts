import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';

const actions: { [key: string]: string } = {
  delete: 'trash',
  edit: 'edit',
};

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, CustomPaginatorComponent],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tableData: any[] = [];
  @Output() actionEmitter = new EventEmitter();

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;
  totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  startIndex = 0;
  endIndex = this.itemsPerPage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedData: any[] = [];

  sortedColumn = 'id';
  sortDirection = 'asc';

  get getTableHeaders() {
    return Object.keys(this.tableData[0]);
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
    this.sortDirection = (this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? 'reset-sort' : 'asc');
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
  
      this.sortedColumn = column;
    }
  }
  
  isSortable(column: string): boolean {
    return ['name', 'priority'].includes(column);
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
