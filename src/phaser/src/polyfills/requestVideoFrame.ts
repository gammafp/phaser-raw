
//  From https://github.com/ThaUnknown/rvfc-polyfill

if (typeof HTMLVideoElement !== 'undefined' && !('requestVideoFrameCallback' in HTMLVideoElement.prototype) && 'getVideoPlaybackQuality' in HTMLVideoElement.prototype)
{
    (HTMLVideoElement.prototype as any)._rvfcpolyfillmap = {}
    HTMLVideoElement.prototype.requestVideoFrameCallback = function (callback: any): number {
      const handle = performance.now()
      const quality = (this as any).getVideoPlaybackQuality()
      const baseline = (this as any).mozPresentedFrames || (this as any).mozPaintedFrames || quality.totalVideoFrames - quality.droppedVideoFrames

      const check = (old: number, now: number) => {
        const newquality = (this as any).getVideoPlaybackQuality()
        const presentedFrames = (this as any).mozPresentedFrames || (this as any).mozPaintedFrames || newquality.totalVideoFrames - newquality.droppedVideoFrames
        if (presentedFrames > baseline) {
          const processingDuration = (this as any).mozFrameDelay || (newquality.totalFrameDelay - quality.totalFrameDelay) || 0
          const timediff = now - old // HighRes diff
          callback(now, {
            presentationTime: now + processingDuration * 1000,
            expectedDisplayTime: now + timediff,
            width: this.videoWidth,
            height: this.videoHeight,
            mediaTime: Math.max(0, this.currentTime || 0) + timediff / 1000,
            presentedFrames,
            processingDuration
          })
          delete (this as any)._rvfcpolyfillmap[handle]
        } else {
          (this as any)._rvfcpolyfillmap[handle] = requestAnimationFrame((newer: number) => check(now, newer))
        }
      }
      (this as any)._rvfcpolyfillmap[handle] = requestAnimationFrame((newer: number) => check(handle, newer))
      return handle
    }

    HTMLVideoElement.prototype.cancelVideoFrameCallback = function (handle: number) {
      cancelAnimationFrame((this as any)._rvfcpolyfillmap[handle])
      delete (this as any)._rvfcpolyfillmap[handle]
    }
}
