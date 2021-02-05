/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { POINT } from './point';

/**
 * Return the index of the 'bottom left' element in an array of Points representing 2D coordinates
 * (this presumes a y-up coordinate system)
 *
 * @param points Point collection
 */
export function bottomLeft(points: Array<POINT>): number
{
  const len: number = points.length;

  let pt: POINT;

  let i: number;
  let index = 0;
  for (i = 0; i < len; ++i)
  {
    pt = points[i];

    if ( pt.y < points[index].y || (pt.y <= points[index].y && pt.x < points[index].x) ) {
      index = i;
    }
  }

  return index;
}

/**
 * Return the index of the 'bottom right' element in an array of Points representing 2D coordinates
 * (this presumes a y-up coordinate system)
 *
 * @param points Point collection
 */
export function bottomRight(points: Array<POINT>): number
{
  const len: number = points.length;

  let pt: POINT;

  let i: number;
  let index = 0;

  for (i = 0; i < len; ++i)
  {
    pt = points[i];

    if ( pt.y < points[index].y || (pt.y <= points[index].y && pt.x > points[index].x ) ) {
      index = i;
    }
  }

  return index;
}

/**
 * Return the interior (minimum) angle between the origin and the two input points (in radians)
 *
 * @param p0: POINT - First point
 *
 * @param p1: POINT - Second point
 *
 * @param toDegree: boolean - true if the result is to be returned in degrees
 * @efault true
 */
export function angle(p0: POINT, p1: POINT, toDegree: boolean = true): number
{
  const value: number = Math.atan2( p1.y - p0.y, p1.x - p0.x );

  return toDegree ? (180*value) / Math.PI : value;
}

/**
 * Are two points equal (within tolerance)?
 *
 * @param a First point for comparison
 * @param b Second point for comparison
 */
export function isEqual(a: POINT, b: POINT): boolean
{
  if (Math.abs(a.x - b.x) / a.x <= 0.000001)
  {
    return Math.abs(a.y - b.y) / a.y <= 0.000001;
  }

  return false;
}

/**
 * Is a point to the left of the line through two other points?
 *
 * @param p0 Initial point of line segment
 *
 * @param p1 Terminal point of line segment
 *
 * @param p Test point
 *
 */
export function isLeft(p0: POINT, p1: POINT, p2: POINT): boolean
{
  const amt: number = (p1.x - p0.x)*(p2.y - p0.y) - (p2.x - p0.x)*(p1.y - p0.y);

  return amt > 0;
}
