# RxjsRev

## Creation operators

* We can use the creation operators to create an observable.
* from a string--> `of('some random string')`
* from an array--> `from([1, 2, 4, 5])`
* from a dumb event from DOM or nodejs events--> `fromEvent(document, 'click')`
* Interval instead of setInterval ---> `Interval(1000)`
* FromEvent --> (target, eventName, options?, selector?).
* of -> `of(1,2,3,4,5)` will send the stream of the values synchronously while operating on each of them.
* A string or an array in of wil be treated as one value. eg. `of("hello world", 2, 3)` -> "hello world", 2, 3
* range -> `range(1,5)` will be same as above.
* from -> `from("hello world")` or `from([1, 2, 3, 4])` will iterate over each n every value.

## Getting started with operators

* Map operator -> goes through each value of the observable and performs the action on them.
```js
    of(1, 2, 3, 4, 5).pipe(
        map(val => val * 10)
      ).subscribe(console.log); 
```
```js
    const $keyup = fromEvent(document, 'keyup');
    const $keyCode = $keyup.pipe(
      map(event => event['code'])
    );
    $keyCode.subscribe(console.log);
```
* Operators accept the observable and return a new observable. They do not modify the source observable in any way.

* Pluck operator is similar to map but it can give you the properties mentioned directly.
```js
    const $keyup = fromEvent(document, 'keyup');
    const $keyCode = $keyup.pipe(
      pluck('code')
    );
    $keyCode.subscribe(console.log);
```
* To get nested values from the observable, use the arguements in the pluck as (parent, child, child of child) etc.
```js
    const $keyup = fromEvent(document, 'keyup');
    const $keyCode = $keyup.pipe(
      pluck('target', 'nodeName)
    );
    $keyCode.subscribe(console.log);
```

* MapTo can be used to map the observable to always emit some custom value.
```js
    const $keyup = fromEvent(document, 'keyup');
    const $keyCode = $keyup.pipe(
      mapTo('key pressed')
    );
    $keyCode.subscribe(console.log);
```

* Filter is used to return the values that are true and ignore the false ones.
```js
    of(1, 2, 3, 4, 5).pipe(
      filter(val => val > 2)
    ).subscribe(console.log)
```
```js
    const $keyup = fromEvent(document, 'keyup');
    const $keyCode = $keyup.pipe(
      pluck('code'),
      filter(key => key === 'Enter')
    );
    $keyCode.subscribe(console.log); // Returns only Enter
```

* A basic scrollspy example using rxjs:

```js
  @ViewChild('prog', {static: false}) prog: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {    
    const scrollStream$ = fromEvent(document, 'scroll');
    scrollStream$.pipe(
      map(({target}) => this.scrollPercentage(target['documentElement']))
    )
    .subscribe((percentage: number) => {
      this.renderer.setStyle(this.prog.nativeElement, 'width', `${percentage}%`);
    });
  }

  //helper function
  scrollPercentage(target): number {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = target;
    return scrollTop/(scrollHeight - clientHeight) * 100;
  }
```

* Reduce operator works just as a normal js reducer. It gives you the accumulated result. It only gives output at the completion of the observable.
* If the observable takes indefinite amout of time to complete, its better to use the scan operator instead of reduce.
* Take operator just takes the number of values provided in the arguement and completes.
```js
    const numbers = [1, 2, 3, 4, 5];
    const totalReducer = (accumulator, currentValue) => {
      return (accumulator += currentValue);
    }
    from(numbers).pipe(
      reduce(totalReducer, 0)
    ).subscribe(console.log); // 15
```
* In the following example, if we put take after reduce, the reduce observable will never complete and hence never reach the take part. So we must write take before reduce. Take will finish at 3 seconds after taking the values thrice and then add the final values(0, 1, 2 in this case) to 0 which we can console.log in the subscription.
```js
    interval(1000).pipe(
      take(3),
      reduce(totalReducer, 0)
    ).subscribe(console.log);
```


* Scan operator applies a reducer function on each emitted value joining new values emitted from the source to the current accumulated value. Scan then emits the new accumulated value which is in contrast with the reducer operator which only emits the final value when the observable ends.
```js
    from(numbers).pipe(
      scan(totalReducer, 0)
    ).subscribe(console.log); // 1, 3, 6, 10, 15
```

* takeWhile and takeUntil.

* takewhile takes in an observable and will let it pass until the condition is true and will not let it pass once the condition becomes falsy as the observable gets completed when the condition is met. Takewhile takes a second arguement(boolean) which will emit/not-emit according to the boolean the last value which causes the completion of the observable.
*takeUntil Emit values until provided observable emits. A (usecase)[https://alligator.io/angular/takeuntil-rxjs-unsubscribe/]

```js
    interval(1000).pipe(
      mapTo(-1),
      scan((accumulator, currentValue) => {
        return accumulator + currentValue
      }, 10),
      filter(val => val > -1)
    ).subscribe(console.log);
```

* Tap is used to check the values. Used as checkpoint while debugging. Tap does not do any modification of the data and does not return anything. It accepts next, complete and error. We should avoid writing logic in tap and it should only be used for checking of the values.
```js
    interval(1000).pipe(
      mapTo(-1),
      scan((accumulator, currentValue) => {
        return accumulator + currentValue
      }, 10),
      tap(console.log),
      filter(val => val > -1)
    ).subscribe();
```
```js
    interval(1000).pipe(
      mapTo(-1),
      scan((accumulator, currentValue) => {
        return accumulator + currentValue
      }, 10),
      tap(console.log),
      takeWhile(val => val > -1)
    ).subscribe();
```
* In the above examples, in case of filter our tap will keep on giving us the values indicating that the observable has not been unsubscribed while in case of takeWhile the observable gets completed after the condition -1 is reached and we don't get any further values.

* first : operator first takes just the first observable. It is a better option than using take(1) as we can provide our own logic in the function that it accepts.
```js
    const clickStream$ = fromEvent(document, 'click');
    clickStream$.pipe(
      map(event => ({
          x: event['clientX'],
          y: event['clientY']
    })),
      first(({y}) => y > 200) // obj destructuring to get only y
    ).subscribe(console.log);
```
* TakeUntil takes a value until another observable emits a value. Once this other observable emits a value, it stops taking further values. 
```js
const counter$ = interval(1000);
const click$ = fromEvent(document, 'click');

counter$.pipe(
  takeUntil(click$)
).subscribe(console.log); // ends the counter at click
```
* distinctUntilChanged gives us the distinct values from the last values. It does not removes the duplicates, it just removes the duplicates that are in a sequence. 
```js
const numbers$ = of(1, '1', 2, 2, 3, 3, 3, 4, 5, 3);
numbers$.pipe(
  distinctUntilChanged() //by default it doesnt require any params
).subscribe(console.log); // 
```
```js
const name$ = state$.pipe(
  distinctUntilChanged((prev, curr) => prev.name === curr.name),
  map(state => state.name)
);
name$.subscribe(console.log);
```
* The above can be acheived by using distinctUntilKeyChanged.
```js
const name$ = state$.pipe(
  distinctUntilKeyChanged('name'),
  map(state => state.name)
);
```

## Rate limiting operators

* debounceTime: Take the latest value after a pause. lets you emit the last emitted value from the source observable after a time mentioned has passed. All the values emitted before it are ignored. Only the latest emitted value is taken when the timer hits.
```js
click$.pipe(
  debounceTime(1000)
).subscribe(console.log) // keep on clicking, nothing will show till 1 sec after which the latest(last click before 1s) will be logged
```
* can be used with text-input to hit the db as less as possible.
```js
const input$ = fromEvent(inputBox, 'keyup');
input$.pipe(
  debounceTime(1000),
  pluck('target', 'value'), //this will trigger after every 1 sec
  distinctUntilChanged()
).subscribe(console.log)
```
* debounce is used when you want to dynamically set the debounceTime. It accepts a function returning an observable.
```js
input$.pipe(
  debounce(() => interval(1000)), // write ur logic in this function and return an observable.
  pluck('target', 'value'), //this will trigger after every 1 sec
  distinctUntilChanged()
).subscribe(console.log)
```

* throttleTime: Allows one value to pass through and then ignore all the values till the specified amount of time. Used for spammy events.
```js
click$.pipe(
  throttleTime(3000)
).subscribe(console.log) // first click is immediately consoled and then all the other clicks are just ignored.
```
* throttleTime can be used for the scrollSpy
```js
const progress$ = $scroll.pipe(
  throttleTime(30), // this will reduce the calculations significantly
  map((target) => calculatePercentage(target.documentElement)),
  tap(console.log)
).subscribe(console.log);
```
* As throttleTime only takes the first value and then ignores all the other till the specified period, we can also take the last value and ignore the ones before it by using asyncScheduler.
```js
import {asyncScheduler} from 'rxjs';
const progress$ = $scroll.pipe(
  throttleTime(30, asyncScheduler, {
    leading: false,
    trailing: true // this will take the value at the trailing end, i.e the last(latest) value, used for scrollspy like events so to get the correct value
  }),
  map((target) => calculatePercentage(target.documentElement)),
  tap(console.log)
).subscribe(console.log);
```
* sampleTime: sampleTime emits the most recently emitted value from the source observable based on a timeInterval. Any earlier values are ignored. Unlike throttle and debounceTime, the time specified starts at the subsciption and repeats itself after the specified time rather than being emitted by any trigger event. If no value is emitted by the source between the sampleTime then no value is emitted. Can be used to track where the user last clicked, to create a heatmap.
```js
click$.pipe(
  sampleTime(4000),
  map(({x, y}) => ({clientX, clientY}))
).subscribe(console.log); // gives the latest click value after the sample time
```
* sample can be used like debounce taking in an observable as a parameter.
```js
  interval(1000).pipe(
    sample(click$)
  ).subscribe(console.log); // on each click, we get to see the time when it is clicked.
```
* auditTime is  similar to throttletime but it gives a value at the trailing edge and gives out the latest value instead of the first.
```js
  interval(1000).pipe(
    auditTime(click$)
  ).subscribe(console.log); // on each click, we get to see the time when it is clicked.
```
* The difference between the above two is that sampleTime starts listening as soon as you subscribe and not when the click emits a value, i.e. if we click on document the first time, we may get the result in 1s or 2s or 3s or 4 etc cos the time already started and only the next value will be after 4 secs in the above example. AuditTime meanwhile, doesn't start on subscription but when the value is emitted from the observable, so after the first click it will wait for 4secs and then show the result in console.


## Transformation operators

* Flattening operators: they take an observable that emits observables and returns observables of just the emitted observables values.
* mergemap: maps each value to an observable and then flattens each obs by subscribing internally emitting the results. 
```js
click$.pipe(
  mergeMap(() => interval$)
).subscribe(console.log); // on every click, it will start a new interval count.
// Mergemap has no restrictions on the inner observable, this can also create memory leaks if used unappropriately
```
* We use mergemap when we need fine grain control of the inner observable, particularly when its value depends on another observable output or want to make a http call which is not be cancelled like POST.
```js
mousedown$.pipe(
  mergeMap(() => interval$.pipe(
    takeUntil(mouseup$)
  ))
).subscribe(console.log) // as long as the mouseclick is down, it will count through interval and when it goes up the internal obs ends.
```
* 