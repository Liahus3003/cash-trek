
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnimateCounterDirective } from '@shared/directives/animate-counter.directive';

@Component({
  selector: 'app-counter-box',
  templateUrl: './counter-box.component.html',
  styleUrls: ['./counter-box.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateCounterDirective]
})
export class CounterBoxComponent {
  @Input() value = 0;
  @Input() text = '';
  @Input() description!: string;
  @Input() iconSrc!: string;
}
