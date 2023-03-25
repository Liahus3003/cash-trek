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
}
