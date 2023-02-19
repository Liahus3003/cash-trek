import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardWrapperComponent {
  @Input() isDefault = false;
  @Input() isDonutChart = false;
  @Input() hasDescription = false;
}
