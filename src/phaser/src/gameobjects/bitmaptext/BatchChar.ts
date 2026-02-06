/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const BatchChar = (pipeline: any, src: any, char: any, glyph: any, offsetX: number, offsetY: number, calcMatrix: any, roundPixels: boolean, tintTL: number, tintTR: number, tintBL: number, tintBR: number, tintEffect: number, texture: any, textureUnit: number): void =>
{
    const x = (char.x - src.displayOriginX) + offsetX;
    const y = (char.y - src.displayOriginY) + offsetY;
    const xw = x + char.w;
    const yh = y + char.h;
    const a = calcMatrix.a;
    const b = calcMatrix.b;
    const c = calcMatrix.c;
    const d = calcMatrix.d;
    const e = calcMatrix.e;
    const f = calcMatrix.f;

    let tx0 = x * a + y * c + e;
    let ty0 = x * b + y * d + f;
    let tx1 = x * a + yh * c + e;
    let ty1 = x * b + yh * d + f;
    let tx2 = xw * a + yh * c + e;
    let ty2 = xw * b + yh * d + f;
    let tx3 = xw * a + y * c + e;
    let ty3 = xw * b + y * d + f;

    if (roundPixels)
    {
        tx0 = Math.round(tx0);
        ty0 = Math.round(ty0);
        tx1 = Math.round(tx1);
        ty1 = Math.round(ty1);
        tx2 = Math.round(tx2);
        ty2 = Math.round(ty2);
        tx3 = Math.round(tx3);
        ty3 = Math.round(ty3);
    }

    pipeline.batchQuad(src, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, glyph.u0, glyph.v0, glyph.u1, glyph.v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
};
