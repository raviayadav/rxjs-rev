import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, of, from, interval } from 'rxjs';
import { map, pluck, mapTo, filter, reduce, take } from 'rxjs/operators';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    const numbers = [1, 2, 3, 4, 5];
    const totalReducer = (accumulator, currentValue) => {
      return (accumulator += currentValue);
    }
    interval(1000).pipe(
      take(3),
      reduce(totalReducer, 0)
    ).subscribe(console.log);
  }
}
