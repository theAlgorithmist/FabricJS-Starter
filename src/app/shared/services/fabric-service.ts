import { Injectable } from '@angular/core';

import { fabric } from 'fabric';

import { POINT } from '../libs/point';

@Injectable({providedIn: 'root'})
export class FabricService
{
  // draw properties are public to keep the demo more compact; but, you break it ... you buy it
  public strokeWidth: number;
  public strokeColor: string;
  public circleRadius: number;
  public circleFill: string;

  protected _canvas?: fabric.Canvas;

  protected _points: Array<fabric.Circle>;
  protected _polylines: Record<string, fabric.Polyline>;

  constructor()
  {
    this.strokeWidth  = 2;
    this.strokeColor  = '#000000';
    this.circleFill   = '#0000ff';
    this.circleRadius = 2;

    this._points    = new Array<fabric.Circle>();
    this._polylines = {}
  }

  public set canvas(surface: fabric.Canvas)
  {
    if (surface !== undefined && surface != null && surface instanceof fabric.Canvas) {
      this._canvas = surface;
    }
  }

  public clear(): void
  {
    if (this._canvas)
    {
      this._points.forEach( (circle: fabric.Circle): void => {
        this._canvas.remove(circle);
      });

      this._points.length = 0;

      Object.keys(this._polylines).forEach( (name: string): void => {
        this._canvas.remove(this._polylines[name]);
      });

      this._polylines = {};

      this._canvas.renderAll();
    }
  }

  public addPoint(p: POINT): void
  {
    const circle: fabric.Circle = new fabric.Circle(
      {
        left: p.x - this.circleRadius,
        top: p.y - this.circleRadius,
        fill: this.circleFill,
        radius: this.circleRadius
      });

    this._points.push(circle);

    if (this._canvas)
    {
      this._canvas.add(circle);
      this._canvas.renderAll();
    }
  }

  public addPolyline(name: string, points: Array<POINT>, clear: boolean = true): void
  {
    const polyLine: fabric.Polyline = new fabric.Polyline(points,
      {
        strokeWidth: this.strokeWidth,
        stroke: this.strokeColor,
        fill: 'transparent',
      });

    if (this._canvas)
    {
      if (clear && this._polylines[name] !== undefined) {
        this._canvas.remove(this._polylines[name]);
      }

      this._canvas.add(polyLine);
      this._canvas.renderAll();
    }

    this._polylines[name] = polyLine;
  }
}
