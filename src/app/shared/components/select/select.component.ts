
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {
  @Input() label!: string;
  @Input() iconSrc!: string;
}
