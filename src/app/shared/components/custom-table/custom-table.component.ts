import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const actions: {[key: string]: string} = {
  delete: 'trash',
  edit: 'edit'
};

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
  @Output() actionEmitter = new EventEmitter();

  get getTableHeaders() {
    return Object.keys(this.tableData[0]);
  }

  iconName(name: string): string {
    return actions[name];
  }

  triggerAction(id: number, type: string): void {
    this.actionEmitter.emit({id, type});
  }
}
