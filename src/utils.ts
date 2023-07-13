import { IntersectionType, PolygonType } from "./type";

/**
 * Linear interpolation
 *
 * when t = 0, a is returned
 * when t = 1, b is returned
 * when t = 0.5, the midpoint between a and b is returned
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Get intersection of two lines
 * https://stackoverflow.com/a/565282/10485974
 * @param A
 * @param B
 * @param C
 * @param D
 * @returns
 * @see https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
 * @see https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
 *
 * @example
 * const A = { x: 0, y: 0 };
 * const B = { x: 100, y: 100 };
 * const C = { x: 0, y: 100 };
 * const D = { x: 100, y: 0 };
 * const intersection = getIntersection(A, B, C, D);
 * // { x: 50, y: 50, offset: 0.5 }
 *
 */
export function getIntersection(
    A: { x: any; y: any },
    B: { x: any; y: any },
    C: { x: any; y: any },
    D: { x: any; y: any }
): IntersectionType | null {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    return null;
}

/**
 * Check if a point is inside a polygon
 * @param poly1
 * @param poly2
 * @returns
 * @see https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
 * @see https://stackoverflow.com/questions/8721406/how-to-determine-if-a-point-is-inside-a-2d-convex-polygon
 *
 * @example
 * const poly1: PolygonType = [
 * { x: 0, y: 0 },
 * { x: 100, y: 100 },
 * { x: 100, y: 0 },
 * ];
 * const poly2: PolygonType = [
 * { x: 0, y: 0 },
 * { x: 100, y: 100 },
 * { x: 100, y: 0 },
 * ];
 * const isInside = isPointInPolygon(poly1, poly2);
 * // true
 *
 **/
export function isPointInPolygon(poly1: PolygonType, poly2: PolygonType): boolean {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Get RGBA color
 * @param value
 * @returns
 * @see https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
 * @see https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
 *
 * @example
 * const color = getRGBA(0.5);
 * // rgba(255,255,0,0.5)
 */
export function getRGBA(value: number) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
