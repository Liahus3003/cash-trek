import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultButtonComponent {
  @Input() buttonType = 'success';
  @Input() label = '';
  @Output() buttonClicked = new EventEmitter();

  triggerClick(): void {
    this.buttonClicked.emit();
  }
}
