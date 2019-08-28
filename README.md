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