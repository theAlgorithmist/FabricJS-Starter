# FabricjsStarter

This is the code distribution to an upcoming Medium article for the ng-conf blog.  The code serves as an introduction to using the [Fabric JS](http://fabricjs.com/) library with Angular.  It also illustrates how to optimize change detection in Angular for applications involving Canvas interactivity.

Author:  Jim Armstrong - [The Algorithmist](https://www.linkedin.com/in/jimarmstrong/)

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 11.0.5

Angular Material: 11.0.3

Typescript: 4.0.2

Fabric JS: 4.3.0

## Introduction

Fabric JS is a fairly well-known Canvas drawing library that employs a different API than competitors such as Easel JS and Pixi JS.  The latter adhere very closely to the Flash drawing API that was established circa Flash 6.  That API was tried, true, and very well tested across thousands of applications.  Central to that API was a graphics context that allowed a near-infinite number of shapes to be drawn with move-to, line-to, and curve-to (quadratic Bezier) commands.  Fabric JS uses a more object-oriented approach where shapes are drawn as instances of Fabric JS-defined Objects.

This project serves as a starter to illustrate how to get Fabric JS up and running with a modern Angular project (Angular 11 is used in this code distribution).  The specific example is typical of an EdTech application; illustrate two algorithms for Convex Hull, namely Melkman's algorithm and Graham Scan.  These algorithms may be reviewed [at this reference](https://geomalgorithms.com/a12-_hull-3.html).

## Installation

In addition to installing Fabric, install the latest typings in order to play nicely with TypeScript.

```
   "@types/fabric": "4.2.1",
```

Then, Fabric JS can be imported as

```
import { fabric } from 'fabric';
```

## Basics of Fabric Canvas

Fabric JS has extensive documentation and a robust set of demo projects, so this discussion is brief.

When working with Canvas libraries in the past, I've used an Angular directive to select an HTML Canvas and handle interaction with that Canvas.  That's not the only way to work with a Canvas library, so I did something different in this project.

A static Canvas is defined in the main app component's template along with some Material and app-specific components.

```
<div style="width:602px">
  <mat-toolbar style="width: 602px;">
    <mat-toolbar-row>
      <span>Interactive Convex Hull</span>

      <span class="toolbar-spacer"></span>
      <mat-icon (click)="onClear()" class="mr24" matTooltip="Clear All Drawings">clear_all</mat-icon>
      <mat-icon (click)="onGraham()" class="mr24" matTooltip="Graham Scan">border_outer</mat-icon>
      <mat-icon (click)="onMelkman()" class="mr24" matTooltip="Melkman's Algorithm">border_all</mat-icon>

    </mat-toolbar-row>
  </mat-toolbar>

  <canvas width="600" height="600" style="border: 1px solid #cccccc;" id="fabricSurface"></canvas>
  <div class="mt6">
    <app-message [message]="instructions"></app-message>
    <app-message [message]="summary"></app-message>
  </div>
</div>
```

A reference to a Fabric JS Canvas can be created as early as the main app component's on-init handler.  The bare minimum code to create this reference is,

```
protected _canvas?: fabric.Canvas;
.
.
.
public ngOnInit(): void
{
  this._canvas = new fabric.Canvas('fabricSurface', {
    backgroundColor: '#ebebef',
    selection: false,
    preserveObjectStacking: true,
  });
}
```

Management of Fabric JS objects is deferred to a service, which is injected into the component whose template contains the Canvas.

```
import { FabricService } from './shared/services/fabric-service';
.
.
.

constructor(protected _fabricService: FabricService, protected _zone: NgZone)
{
  .
  .
  .
}
```

Inside the service, Fabric JS may be exercised as illustrated in docs and various online tutorials.


## Interactivity and Change Detection

An HTML Canvas rarely exists just as a drawing surface. It is common to interact with that surface, at which point mouse actions trigger change detection through an Angular zone.

If the Canvas is the primary interactive element and there are few (if any) child components, change detection considerations may be of minimal concern to developers.  If there are many child components and performance optimization is paramount, it is often thought that having OnPush change detection in child components is all that is necessary.  Change detection, however, is still triggered and OnPush CD does not prohibit lifecycle methods from being called on the child components.  At a minimum, the do-check lifecycle handler is always called even if the child component _Inputs_ do not change.

This can be seen in the current application by adjusting the main app component's on-init handler as follows.

```
public ngOnInit(): void
{
  this._canvas = new fabric.Canvas('fabricSurface', {
    backgroundColor: '#ebebef',
    selection: false,
    preserveObjectStacking: true,
  });
   
  this._canvas.on('mouse:up', this._mouseUp);
}
```

Note the two message component instances in the main app template (_app-message_ selector).  Both these components use OnPush CD.  Simply mouse over the Canvas and observe how the _ngDoCheck()_ method is called on the main app component AND the two child components.  This is illustrated through simple console logs.

This situation is remedied by running Canvas mouse handlers outside Angular.  Restore the main app on-init handler to its original state and re-run the mouse over test.

```
public ngOnInit(): void
{
  this._zone.runOutsideAngular( () => {
    this._canvas = new fabric.Canvas('fabricSurface', {
      backgroundColor: '#ebebef',
      selection: false,
      preserveObjectStacking: true,
    });

    this._fabricService.canvas = this._canvas;

    this._canvas.on('mouse:up', this._mouseUp);
  });
}
```

## Running the Demo

The two algorithms illustrated in this demo are Graham Scan and Melkman.  Graham Scan is a classic algorithm for computing the convex hull of a point set.  Melkman's algorithm is used for the hull of a non-intersecting polyline.  Select the algorithm and click inside the drawing area to either define a point set or a polyline.  Remember that the latter should be non-intersecting and no test is made in the code for that condition.

The hull is updated automatically.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
