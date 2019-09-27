import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, of, from, interval } from 'rxjs';
import { map, pluck, mapTo, first, filter, tap, reduce, take, scan, takeWhile, takeUntil, debounceTime, sampleTime, concatMap, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit {
  constructor(private renderer: Renderer2) { }
   
  ngOnInit() {
    const interval$ = interval(1000).pipe(take(3));
    const click$ = fromEvent(document, 'click');
    click$.pipe(
      exhaustMap(() => interval$.pipe(take(3)))
    ).subscribe(console.log);
  }
}
