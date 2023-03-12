import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateCounter]',
  standalone: true
})
export class AnimateCounterDirective implements OnInit {
  @Input() value = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    let currentCount = 0;
    const difference = this.value - currentCount;
    const step = Math.ceil(difference / 50);
    const duration = difference / step;
    // eslint-disable-next-line prefer-const
    let interval: string | number | NodeJS.Timer | undefined;

    const updateCount = () => {
      currentCount += step;
      if (currentCount >= this.value) {
        clearInterval(interval);
        currentCount = this.value;
      }
      this.renderer.setProperty(this.el.nativeElement, 'innerText', currentCount);
    };
  
    interval = setInterval(updateCount, duration);
  }
}
