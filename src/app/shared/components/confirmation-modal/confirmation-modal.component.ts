import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActionInfo {
  type: string;
  id: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.less']
})
export class ConfirmationModalComponent {
  @Output() action = new EventEmitter<ActionInfo>();

  title!: string;
  description!: string;
  confirmButtonText!: string;
  cancelButtonText!: string;

  actionId!: string;

  actionInfo(type: string): void {
    this.action.emit({
      type,
      id: this.actionId
    });
  }
}
