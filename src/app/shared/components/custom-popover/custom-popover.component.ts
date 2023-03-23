/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';

@Component({
  selector: 'app-custom-popover',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './custom-popover.component.html',
  styleUrls: ['./custom-popover.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPopoverComponent {
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() title: string = 'Title';
  @Input() description: string = 'Description';
  @Input() contentList = [];
  showPopover = false;

  togglePopover() {
    this.showPopover = !this.showPopover;
  }

  onOutsideClick() {
    // Handle click outside event
    this.togglePopover();
  }
}
