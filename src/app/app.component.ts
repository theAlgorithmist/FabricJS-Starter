import {
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
  NgZone
} from '@angular/core';

import { POINT } from './shared/libs/point';

import { fabric } from 'fabric';

import { FabricService } from './shared/services/fabric-service';

import {
  grahamScan,
  melkman
} from './shared/libs/convex-hull';

export enum HULL_METHOD
{
  GRAHAM  = 'GRAHAM SCAN',
  MELKMAN = 'MELKMAN',
}

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck, OnInit, OnDestroy
{
  // instructions to the user
  public instructions = 'Click to define point collection';

  // summarize current convex hull process
  public summary = '';

  // current hull algorithm
  protected _algorithm: HULL_METHOD;

  // store point collection to send to server along with the convex hull
  protected _points: Array<POINT>;

  // canvas reference and event handlers
  protected _canvas?: fabric.Canvas;
  protected _mouseUp: (evt: fabric.IEvent) => void;

  constructor(protected _fabricService: FabricService, protected _zone: NgZone)
  {
    this._algorithm = HULL_METHOD.GRAHAM;
    this._points    = new Array<POINT>();
    this.summary    = this.__setSummary();

    this._mouseUp = (evt: fabric.IEvent) => this.__onMouseUp(evt);
  }

  public ngDoCheck(): void
  {
    console.log('APP Do Check');
  }

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

  public ngOnDestroy(): void
  {
    if (this._canvas) {
      this._canvas.off('mouse:up', this._mouseUp);
    }
  }

  public onClear(): void
  {
    this._points.length = 0;

    this._fabricService.clear();

    switch (this._algorithm)
    {
      case HULL_METHOD.GRAHAM:
       this.instructions = 'Click to define point collection';
       break;

      case HULL_METHOD.MELKMAN:
        this.instructions = 'Click and create (non-intersecting) polyline';
        break;
    }
  }

  public onGraham(): void
  {
    this._algorithm = HULL_METHOD.GRAHAM;
    this.onClear();
  }

  public onMelkman(): void
  {
    this._algorithm = HULL_METHOD.MELKMAN;
    this.onClear();
  }

  protected __setSummary(): string
  {
    return `Algorithm: ${this._algorithm}, # points: ${this._points.length}`;
  }

  protected __onMouseUp(evt: fabric.IEvent): void
  {
    if (evt.pointer)
    {
      const p: POINT = {x: evt.pointer.x, y: evt.pointer.y};
      this._points.push(p);

      this._fabricService.addPoint(p);

      let hull: Array<POINT>;

      // update hull and drawing
      if (this._points.length > 2)
      {
        switch (this._algorithm)
        {
          case HULL_METHOD.GRAHAM:
            hull = grahamScan(this._points);

            this._fabricService.strokeColor = 'black';
            this._fabricService.addPolyline('hull', hull);
            break;

          case HULL_METHOD.MELKMAN:
            hull = melkman(this._points);

            // draw polyline, then hull
            this._fabricService.strokeColor = 'black';
            this._fabricService.addPolyline('polyline', this._points);

            this._fabricService.strokeColor = 'red';
            this._fabricService.addPolyline('hull', hull);
            break;
        }
      }
    }
  }
}
