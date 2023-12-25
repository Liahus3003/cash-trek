
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent {
  @Input() label!: string;
  @Input() iconSrc!: string;
}
