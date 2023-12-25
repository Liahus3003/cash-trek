import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [],
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

  seekForward() {
    this.pageIndex = this.totalPages;
    this.pageChange.emit(this.pageIndex);
  }

  seekBackward() {
    this.pageIndex = 1;
    this.pageChange.emit(this.pageIndex);
  }
}
