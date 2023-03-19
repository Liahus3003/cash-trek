import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTableComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tableData: any[] = [];

  get getTableHeaders() {
    return Object.keys(this.tableData[0]);
  }
}