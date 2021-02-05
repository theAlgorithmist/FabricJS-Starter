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

import {
  angle,
  isEqual,
  isLeft,
  bottomRight,
  bottomLeft,
} from './point-utils';

import { POINT } from './point';

/**
 * Compute and return the convex hull of an arbitrary point set using Graham's Scan
 *
 * @param points Collection of arbitrary Point instances in 2D space
 *
 */
export function grahamScan(points: Array<POINT>): Array<POINT>
{
  // initial sort
  const index              = bottomRight(points);
  const pt: POINT          = points[index];
  const same: Array<POINT> = new Array<POINT>();

  points.sort( (a: POINT, b: POINT): number => {
    const aR = angle(a, pt, false);
    const bR = angle(b, pt, false);
    if (aR > bR)
    {
      return -1;
    }
    else if (aR < bR)
    {
      return 1;
    }
    else
    {
      same.push(a);
      return 0;
    }
  });

  let i: number;
  let j: number;
  let v: POINT;
  const len: number = same.length;

  for (i = 0; i < len; ++i)
  {
    v = same[i];
    for (j = 0; j < points.length; ++j)
    {
      if (isEqual(points[j], v))
      {
        points.splice(j, 1);
        j--;
      }
    }
  }

  points.reverse();
  points.unshift(points.pop() as POINT);

  const hull: Array<POINT> = [points[1], points[0]];
  i = 2;
  while (i < points.length)
  {
    if (!isLeft(hull[0], hull[1], points[i]))
    {
      hull.unshift(points[i]);
      i++;
    }
    else
    {
      hull.splice(0, 1);
    }
  }

  hull.push(hull[0]);

  return hull;
}

/**
 * Compute and return the convex hull of a simple polyline using Melkman's algorithm
 *
 * @param points Collection of Point instances in 2D space that form a simple polyline
 *
 * Reference: Melkman, A.A., "On line construction of the convex hull of a simple polyline," Information Processing
 * Letters 25, (1987), pp. 11-12.
 */
export function melkman(points: Array<POINT>): Array<POINT>
{
  if (points.length < 3) {
    return points.slice();
  }

  let i: number;
  let j: number;

  const n: number         = points.length;
  const tmp: Array<POINT> = new Array<POINT>();

  let bottom: number = n - 2;
  let top: number    = bottom + 3;

  // init - tmp is a primitive deque
  tmp[bottom] = points[2];
  tmp[top]    = points[2];

  if (isLeft(points[0], points[1], points[2]))
  {
    tmp[bottom + 1] = points[0];
    tmp[bottom + 2] = points[1];
  }
  else
  {
    tmp[bottom + 1] = points[1];
    tmp[bottom + 2] = points[0];
  }

  // process remaining vertices
  for (i = 3; i < n; ++i)
  {
    // hull candidate?
    if (isLeft(tmp[bottom], tmp[bottom + 1], points[i]) ||
        isLeft(tmp[top - 1], tmp[top], points[i]))
    {
      while (!isLeft(tmp[bottom], tmp[bottom + 1], points[i])) {
        ++bottom;
      }

      tmp[--bottom] = points[i];

      while (!isLeft(tmp[top - 1], tmp[top], points[i])) {
        --top;
      }

      tmp[++top] = points[i];
    }
  }

  const hull: Array<POINT> = new Array<POINT>();
  const len: number        = top - bottom;

  for (j = 0; j <= len; ++j) {
    hull[j] = tmp[bottom + j];
  }

  return hull;
}
