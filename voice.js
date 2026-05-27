/* ============================================================
   SENSORY GUIDE — calming tones + haptic cues (replaces speech)
   Exposed as a single global: VoiceGuide (kept for compatibility)
   ============================================================ */

const VoiceGuide = (() => {
  const STORAGE_KEY = 'calm_voice_enabled';
  let enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  let _ctx = null;

  function _getCtx() {
    if (!_ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) _ctx = new Ctx();
    }
    return _ctx;
  }

  function _tone(freq, endFreq, duration, gain, wave = 'sine') {
    try {
      const ctx = _getCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.connect(env);
      env.connect(ctx.destination);
      osc.type = wave;
      const t = ctx.currentTime;
      const attack = 0.025;
      const release = Math.min(0.1, duration * 0.35);
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq !== freq) {
        osc.frequency.linearRampToValueAtTime(endFreq, t + duration - release);
      }
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(gain, t + attack);
      env.gain.setValueAtTime(gain, t + duration - release);
      env.gain.linearRampToValueAtTime(0, t + duration);
      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch (_) {}
  }

  function _chime() {
    [[523, 659, 0.28, 0.09], [659, 784, 0.28, 0.09], [784, 784, 0.5, 0.11]]
      .forEach(([f, ef, d, g], i) => setTimeout(() => _tone(f, ef, d, g, 'triangle'), i * 230));
  }

  function _vibrate(pattern) {
    try { navigator.vibrate && navigator.vibrate(pattern); } catch (_) {}
  }

  function _cue(text) {
    if (/breath\s*in|inhale/i.test(text))  return 'inhale';
    if (/breath\s*out|exhale/i.test(text)) return 'exhale';
    if (/hold/i.test(text))                return 'hold';
    if (/well done|complete/i.test(text))  return 'done';
    return 'prompt';
  }

  function speak(text) {
    if (!enabled || !text) return;
    switch (_cue(text)) {
      case 'inhale':
        _tone(280, 420, 0.45, 0.10);
        _vibrate([90]);
        break;
      case 'exhale':
        _tone(420, 260, 0.55, 0.10);
        _vibrate([160]);
        break;
      case 'hold':
        _tone(330, 330, 0.28, 0.07, 'triangle');
        _vibrate([35]);
        break;
      case 'done':
        _chime();
        _vibrate([80, 55, 80, 55, 160]);
        break;
      case 'prompt':
        _tone(440, 440, 0.32, 0.07, 'triangle');
        _vibrate([50]);
        break;
    }
  }

  // Called on each countdown tick (every second within a phase)
  function tick() {
    if (!enabled) return;
    _tone(700, 700, 0.05, 0.04);
    _vibrate([10]);
  }

  function cancel() {}

  function isEnabled()   { return enabled; }
  function isSupported() { return true; }

  function setEnabled(val) {
    enabled = !!val;
    localStorage.setItem(STORAGE_KEY, enabled);
    _syncUI();
  }

  function toggle() { setEnabled(!enabled); }

  function _syncUI() {
    document.querySelectorAll('[data-voice-toggle]').forEach(btn => {
      btn.classList.toggle('voice-btn--active', enabled);
      btn.setAttribute('aria-pressed', String(enabled));
      btn.title = enabled
        ? 'Sound guidance on — tap to turn off'
        : 'Sound guidance off — tap to turn on';
    });
  }

  function init() {
    _syncUI();
    // Unlock AudioContext on first user gesture
    const unlock = () => { try { _getCtx(); } catch (_) {} };
    document.addEventListener('touchstart', unlock, { once: true, passive: true });
    document.addEventListener('click',      unlock, { once: true, passive: true });
  }

  return { speak, tick, cancel, isEnabled, isSupported, toggle, setEnabled, init };
})();
