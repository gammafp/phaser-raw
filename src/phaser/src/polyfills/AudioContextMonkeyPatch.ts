/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*

This monkeypatch library is intended to be included in projects that are
written to the proper AudioContext spec (instead of webkitAudioContext),
and that use the new naming and proper bits of the Web Audio API (e.g.
using BufferSourceNode.start() instead of BufferSourceNode.noteOn()), but may
have to run on systems that only support the deprecated bits.

This library should be harmless to include if the browser supports
unprefixed "AudioContext", and/or if it supports the new names.

The patches this library handles:
if window.AudioContext is unsupported, it will be aliased to webkitAudioContext().
if AudioBufferSourceNode.start() is unimplemented, it will be routed to noteOn() or
noteGrainOn(), depending on parameters.

The following aliases only take effect if the new names are not already in place:

AudioBufferSourceNode.stop() is aliased to noteOff()
AudioContext.createGain() is aliased to createGainNode()
AudioContext.createDelay() is aliased to createDelayNode()
AudioContext.createScriptProcessor() is aliased to createJavaScriptNode()
AudioContext.createPeriodicWave() is aliased to createWaveTable()
OscillatorNode.start() is aliased to noteOn()
OscillatorNode.stop() is aliased to noteOff()
OscillatorNode.setPeriodicWave() is aliased to setWaveTable()
AudioParam.setTargetAtTime() is aliased to setTargetValueAtTime()

This library does NOT patch the enumerated type changes, as it is
recommended in the specification that implementations support both integer
and string types for AudioPannerNode.panningModel, AudioPannerNode.distanceModel
BiquadFilterNode.type and OscillatorNode.type.

*/

(function () {

  function fixSetTarget(param: any) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if ((window as any).hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    (window as any).AudioContext = (window as any).webkitAudioContext;

    if (!(AudioContext.prototype as any).hasOwnProperty('createGain'))
      (AudioContext.prototype as any).createGain = (AudioContext.prototype as any).createGainNode;
    if (!(AudioContext.prototype as any).hasOwnProperty('createDelay'))
      (AudioContext.prototype as any).createDelay = (AudioContext.prototype as any).createDelayNode;
    if (!(AudioContext.prototype as any).hasOwnProperty('createScriptProcessor'))
      (AudioContext.prototype as any).createScriptProcessor = (AudioContext.prototype as any).createJavaScriptNode;
    if (!(AudioContext.prototype as any).hasOwnProperty('createPeriodicWave'))
      (AudioContext.prototype as any).createPeriodicWave = (AudioContext.prototype as any).createWaveTable;


    (AudioContext.prototype as any).internal_createGain = (AudioContext.prototype as any).createGain;
    (AudioContext.prototype as any).createGain = function() {
      const node = (this as any).internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    (AudioContext.prototype as any).internal_createDelay = (AudioContext.prototype as any).createDelay;
    (AudioContext.prototype as any).createDelay = function(maxDelayTime?: number) {
      const node = maxDelayTime ? (this as any).internal_createDelay(maxDelayTime) : (this as any).internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    (AudioContext.prototype as any).internal_createBufferSource = (AudioContext.prototype as any).createBufferSource;
    (AudioContext.prototype as any).createBufferSource = function() {
      const node = (this as any).internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when?: number, offset?: number, duration?: number ) {
          if ( offset || duration )
            this.noteGrainOn( when || 0, offset, duration );
          else
            this.noteOn( when || 0 );
        };
      } else {
        node.internal_start = node.start;
        node.start = function( when?: number, offset?: number, duration?: number ) {
          if( typeof duration !== 'undefined' )
            node.internal_start( when || 0, offset, duration );
          else
            node.internal_start( when || 0, offset || 0 );
        };
      }
      if (!node.stop) {
        node.stop = function ( when?: number ) {
          this.noteOff( when || 0 );
        };
      } else {
        node.internal_stop = node.stop;
        node.stop = function( when?: number ) {
          node.internal_stop( when || 0 );
        };
      }
      fixSetTarget(node.playbackRate);
      return node;
    };

    (AudioContext.prototype as any).internal_createDynamicsCompressor = (AudioContext.prototype as any).createDynamicsCompressor;
    (AudioContext.prototype as any).createDynamicsCompressor = function() {
      const node = (this as any).internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    (AudioContext.prototype as any).internal_createBiquadFilter = (AudioContext.prototype as any).createBiquadFilter;
    (AudioContext.prototype as any).createBiquadFilter = function() {
      const node = (this as any).internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if ((AudioContext.prototype as any).hasOwnProperty( 'createOscillator' )) {
      (AudioContext.prototype as any).internal_createOscillator = (AudioContext.prototype as any).createOscillator;
      (AudioContext.prototype as any).createOscillator = function() {
        const node = (this as any).internal_createOscillator();
        if (!node.start) {
          node.start = function ( when?: number ) {
            this.noteOn( when || 0 );
          };
        } else {
          node.internal_start = node.start;
          node.start = function ( when?: number ) {
            node.internal_start( when || 0);
          };
        }
        if (!node.stop) {
          node.stop = function ( when?: number ) {
            this.noteOff( when || 0 );
          };
        } else {
          node.internal_stop = node.stop;
          node.stop = function( when?: number ) {
            node.internal_stop( when || 0 );
          };
        }
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }

  if ((window as any).hasOwnProperty('webkitOfflineAudioContext') &&
      !window.hasOwnProperty('OfflineAudioContext')) {
    (window as any).OfflineAudioContext = (window as any).webkitOfflineAudioContext;
  }

})();
