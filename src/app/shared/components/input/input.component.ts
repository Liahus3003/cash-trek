import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  @Input() label!: string;
  @Input() iconSrc!: string;
  @Input() removeXMargin = false;
  @Input() iconPath = 'icons/'
}
