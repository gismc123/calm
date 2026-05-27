/* ============================================================
   VOICE GUIDE — calm voice guidance using Web Speech API
   Exposed as a single global: VoiceGuide
   ============================================================ */

const VoiceGuide = (() => {
  const STORAGE_KEY = 'calm_voice_enabled';
  const supported = 'speechSynthesis' in window;
  let enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  let _pendingTimeout = null;

  function speak(text, delaySecs) {
    if (!enabled || !supported || !text) return;
    const ms = (delaySecs ?? 0.12) * 1000;
    if (_pendingTimeout) clearTimeout(_pendingTimeout);
    window.speechSynthesis.cancel();
    _pendingTimeout = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text.trim());
      u.rate   = 0.88;
      u.pitch  = 1.05;
      u.volume = 1.0;
      window.speechSynthesis.speak(u);
    }, ms);
  }

  function cancel() {
    if (_pendingTimeout) { clearTimeout(_pendingTimeout); _pendingTimeout = null; }
    if (supported) window.speechSynthesis.cancel();
  }

  function isEnabled()   { return enabled; }
  function isSupported() { return supported; }

  function setEnabled(val) {
    enabled = !!val;
    localStorage.setItem(STORAGE_KEY, enabled);
    if (!enabled) cancel();
    _syncUI();
  }

  function toggle() { setEnabled(!enabled); }

  function _syncUI() {
    document.querySelectorAll('[data-voice-toggle]').forEach(btn => {
      btn.classList.toggle('voice-btn--active', enabled);
      btn.setAttribute('aria-pressed', String(enabled));
      btn.title = enabled
        ? 'Voice guidance on — tap to turn off'
        : 'Voice guidance off — tap to turn on';
    });
  }

  function init() {
    if (!supported) {
      document.querySelectorAll('[data-voice-toggle]').forEach(btn => {
        btn.hidden = true;
      });
      return;
    }
    _syncUI();
  }

  return { speak, cancel, isEnabled, isSupported, toggle, setEnabled, init };
})();
