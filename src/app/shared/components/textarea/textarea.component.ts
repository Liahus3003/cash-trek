import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent {
  @Input() label!: string;
  @Input() iconSrc!: string;
}
