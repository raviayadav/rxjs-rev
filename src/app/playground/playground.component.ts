import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, of, from, interval } from 'rxjs';
import { map, pluck, mapTo, first, filter, tap, reduce, take, scan, takeWhile, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  constructor(private renderer: Renderer2) { }
   
  ngOnInit() {
    const clickStream$ = fromEvent(document, 'click');
    clickStream$.pipe(
      map(event => ({
          x: event['clientX'],
          y: event['clientY']
    })),
      first(({y}) => y > 200) // obj destructuring to get only y
    ).subscribe(console.log);
  }
}
