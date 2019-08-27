import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  
  const source$ = fromEvent(document, 'click');
  const observer = {
  next: val => console.log('next', val),
  err: err => console.log('err', err),
  complete: () => console.log('completed')
  }

  source$.subscribe(observer);
  }

}
