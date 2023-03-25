import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPaginatorComponent {
  @Input()
  pageSize!: number;
  @Input()
  pageIndex!: number;
  @Input()
  totalItems!: number;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  previousPage() {
    this.pageIndex--;
    this.pageChange.emit(this.pageIndex);
  }

  nextPage() {
    this.pageIndex++;
    this.pageChange.emit(this.pageIndex);
  }
}
