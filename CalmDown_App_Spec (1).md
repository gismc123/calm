# Calm Down Toolkit -- Web App Specification
### For use with Claude Code (VS Code)

---

## Project Overview

Build a mobile-first, single-page web application called **Calm Down** that serves as a personal stress-relief guide grounded in the Marriage Helper Calm Down Toolkit. The app requires no login, no app store, and no backend. It runs entirely in the browser and is accessible by visiting a local HTML file or a hosted URL on a phone.

The user opens the app in moments of emotional overwhelm and is guided step-by-step through a personalized calm-down plan based on their current stress level and the category their stress falls into.

---

## Tech Stack

- **Pure HTML, CSS, and vanilla JavaScript** -- no frameworks, no build tools, no npm.
- Single file: `index.html` (all CSS and JS embedded or in companion files in the same folder).
- Must work offline once loaded (no API calls required).
- Optimized for mobile viewport (375px -- 430px wide). Also usable on desktop.
- No cookies, no localStorage required (session-only state is fine).
- **The app must be a fully installable Progressive Web App (PWA).** This is a hard requirement, not optional. The user must be able to tap "Add to Home Screen" on both iOS (Safari) and Android (Chrome) and have the app launch in standalone mode -- no browser chrome, no address bar -- exactly like a native app. This requires:
  - A valid `manifest.json` with `"display": "standalone"`, a defined `start_url`, a short app name ("Calm Down"), and a full set of app icons (at minimum 192x192 and 512x512 PNG).
  - A registered service worker (`sw.js`) that caches all app assets on first load so the app works fully offline after installation.
  - A `<meta name="apple-mobile-web-app-capable" content="yes">` tag and related Apple-specific meta tags so iOS treats it as a standalone app.
  - A `<meta name="theme-color">` tag that matches the app's background color so the status bar blends seamlessly on Android.
  - App icons should be simple and calming -- a soft circle or abstract wave on the deep background color, consistent with the app's color palette.
  - On first load, if the browser supports the `beforeinstallprompt` event (Android/Chrome), the app should display a subtle, non-intrusive install prompt banner at the bottom of Screen 1: "Add this to your home screen for quick access." with an "Install" button and a dismiss option. This banner should not appear if the app is already running in standalone mode.

---

## App Architecture: 4 Screens in a Linear Flow

The app moves the user through four screens in sequence. Each screen replaces the previous one (no page reloads). A persistent back button allows the user to go back one screen at any time.

```
Screen 1: Stress Check-In
        |
        v
Screen 2: Category Selection
        |
        v
Screen 3: Personalized Calm-Down Plan (tool menu)
        |
        v
Screen 4: Guided Tool Experience (active session)
```

The color system must be intentional and research-informed. Colors used in calming, therapeutic, and sleep-focused design favor deep cool neutrals, muted warm tones, and low-saturation accents. Bright whites, saturated reds, oranges, or yellows are not permitted anywhere in the UI. The following palette is required and must be defined as CSS custom properties at the root level so they apply consistently across every screen and tool:

```css
:root {
  /* Backgrounds -- deep, dark, and restful */
  --color-bg-base:       #1C2340;  /* Deep indigo-navy -- primary background */
  --color-bg-surface:    #242C4A;  /* Slightly lighter navy -- cards, panels */
  --color-bg-elevated:   #2D3660;  /* Elevated surface -- selected states, modals */

  /* Text -- warm and easy on the eyes, never stark white */
  --color-text-primary:  #E8E4D9;  /* Warm cream -- primary body text */
  --color-text-secondary:#B0AEAD;  /* Muted warm gray -- secondary labels, hints */
  --color-text-muted:    #7A7E8A;  /* Subdued -- timestamps, tertiary info */

  /* Accent -- soft sage green, calming and non-stimulating */
  --color-accent:        #7AAFA0;  /* Muted sage teal -- primary CTA buttons, active states */
  --color-accent-soft:   #4A7A6D;  /* Deeper sage -- hover states, pressed states */
  --color-accent-glow:   rgba(122, 175, 160, 0.15); /* Subtle glow for breathing animations */

  /* Breathing animation highlight -- soft lavender, promotes calm */
  --color-breath:        #9B9FCC;  /* Muted periwinkle-lavender -- breathing circle fill */
  --color-breath-soft:   rgba(155, 159, 204, 0.12); /* Breathing outer glow */

  /* PIES category badge colors -- all muted, no neons */
  --color-badge-physical:     #8A9E7A;  /* Muted olive green */
  --color-badge-mental:       #7A8FAA;  /* Slate blue */
  --color-badge-emotional:    #A07A8A;  /* Dusty mauve */
  --color-badge-spiritual:    #9A8A6A;  /* Warm sand gold */

  /* Stress scale gradient -- from calm green to deep amber, never red */
  --color-stress-low:    #7AAFA0;  /* 1-3: sage teal (calm) */
  --color-stress-mid:    #A09060;  /* 4-6: warm amber (caution) */
  --color-stress-high:   #8A6060;  /* 7-10: muted rose-red (high) -- subdued, not alarming */

  /* Utility */
  --color-border:        rgba(232, 228, 217, 0.08); /* Very subtle borders */
  --color-shadow:        rgba(0, 0, 0, 0.35);
  --color-overlay:       rgba(28, 35, 64, 0.85);    /* Modal/overlay backdrop */
}
```

**Design intent and rationale:**
- The deep indigo-navy background (`#1C2340`) replicates the psychological effect of a dimmed, nighttime environment -- the brain associates it with rest and reduced alertness.
- Warm cream text (`#E8E4D9`) is easier on eyes in a low-light emotional state than pure white, which creates tension.
- Sage teal as the primary accent is used in therapeutic and wellness design because it sits between calming blue and grounding green -- it does not excite or alarm.
- Muted periwinkle-lavender for breathing animations references color psychology research associating lavender with anxiety reduction.
- No color in the palette should exceed approximately 50% saturation. High saturation colors are stimulating; this app requires the opposite.
- The stress scale must never use pure red. `#8A6060` (muted rose) communicates urgency without triggering the fight-or-flight response that true red can activate.

Typography must also reinforce calm:
- Font family: system-ui with fallback to `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Do not load external fonts that require a network request.
- Font weight: 300 (light) for body text, 400 (regular) for labels, 500 (medium) for headings. Avoid bold (700+) except for single emphasis words.
- Line height: 1.6 minimum for all body text. Dense text is anxiety-inducing.
- Letter spacing: 0.02em on headings for an airy, unhurried feel.

---

## Screen 1 -- Stress Check-In

### Purpose
Help the user identify their current stress level so the app can recommend the right depth of intervention.

### UI
- Heading: "How are you feeling right now?"
- A large visual stress scale from 1 to 10, displayed as tappable circles or a slider.
  - 1-3: Low stress (uneasy, distracted)
  - 4-6: Moderate stress (anxious, overwhelmed)
  - 7-10: High stress (crisis, shutdown, fight-or-flight)
- Label the ranges visually so the user knows what level means what without having to think.
- A brief optional prompt beneath the scale: "You don't have to know why. Just pick the number that feels right."
- A "Continue" button that activates once a number is selected.

### Logic
- Store the selected stress level in a session variable.
- Stress level informs which tools are shown prominently in Screen 3.

---

## Screen 2 -- Category Selection

### Purpose
Identify which area of the PIES framework the user's stress is primarily affecting right now.

### UI
- Heading: "Where do you feel it most?"
- Four large tappable cards, one per PIES category, with a brief description under each label:

| Card Label | Description shown to user |
|---|---|
| Physical | "My body feels tense, tired, or out of control. I'm not sleeping or eating well." |
| Intellectual (Mental) | "My thoughts are racing. I can't think clearly or stop worrying." |
| Emotional | "My feelings are overwhelming me. I feel hopeless, sad, or like I'm drowning." |
| Spiritual | "I feel disconnected from what matters. I've lost my sense of peace and purpose." |

- Multi-select is allowed (user can pick more than one). This is important because stress is often cross-category.
- A "Build My Plan" button activates once at least one card is selected.

### Logic
- Store selected PIES categories in session.
- These selections, combined with the stress level from Screen 1, determine which tools are surfaced and in what order on Screen 3.

---

## Screen 3 -- Personalized Calm-Down Plan

### Purpose
Present the user with a curated, prioritized set of calm-down tools matched to their stress level and selected categories. The user picks one tool to begin.

### UI
- Heading: "Your Calm-Down Plan"
- Subheading: "Start with just one. You do not need to do them all."
- A list of 3 to 6 recommended tools displayed as large tappable cards.
  - Each card shows: Tool name, category badge (Physical / Mental / Emotional / Spiritual), estimated time, and a one-sentence description.
- Tools are sorted by relevance: the category the user selected ranks first; within that, simpler/faster tools rank first for high-stress levels.
- A secondary section labeled "Other tools available" can expand to show the full tool library.
- Tapping a tool card navigates to Screen 4 for that tool.

### Tool Recommendation Logic

Use the following rules to surface tools:

**High stress (7-10):** Prioritize fast, body-first tools. Box Breathing must always appear first at this level regardless of category. Follow with grounding or movement tools.

**Moderate stress (4-6):** Offer a mix of tools from the selected PIES category, with breathing included but not always first.

**Low stress (1-3):** Show category-matched tools, including longer-form options like journaling or habit loop review.

**Category matching:**
- Physical selected: Surface sleep tips, movement/walking, nutrition grounding, box breathing.
- Intellectual/Mental selected: Surface box breathing, habit loop audit, growth mindset reframe.
- Emotional selected: Surface focus on good/gratitude, name the lie/say the truth, support system prompt, journaling, resourcing/safe place visualization.
- Spiritual selected: Surface mantra/positive phrase meditation, scripture/affirmation card, prayer prompt, values alignment check.

---

## Screen 4 -- Guided Tool Experience

### Purpose
Walk the user through the selected tool in a calm, guided, step-by-step experience. The user should not have to think -- just follow along.

### Global UI Requirements for All Tools
- Full-screen calm layout, minimal distractions.
- Large readable text, one instruction at a time where possible.
- A "Done -- Return to My Plan" button always visible at the bottom.
- A gentle progress indicator where relevant (e.g., breath cycles completed).
- No timers that feel harsh or alarming. Use soft pulsing animations for breathing tools.

---

## Tool Library (Full Specifications)

All tools below must be built. Each has its own guided UI on Screen 4.

---

### Tool 1: Box Breathing (4x4 Breathing)
**Category:** Physical / Mental
**Time:** 3-4 minutes
**Source:** Lessons 5, 10, and the 7 Tools transcript

**How it works:**
The user follows a visual breathing guide through four equal phases:
1. Inhale for 4 counts
2. Hold at the top for 4 counts
3. Exhale for 4 counts
4. Hold at the bottom for 4 counts

**UI Requirements:**
- Animated box or circle that expands and contracts to guide each phase.
- Text label updates to match the current phase: "Breathe In," "Hold," "Breathe Out," "Hold."
- Countdown number displayed inside the animation (4...3...2...1).
- One completed cycle = one round. Display rounds completed (e.g., "Round 2 of 4").
- Default session: 4 rounds (approximately 64 seconds). After 4 rounds, show a soft completion message.
- Optional extended mode: user can tap "Keep Going" to continue for additional rounds.
- Include the coaching note: "Try to breathe into your whole trunk -- chest AND belly. Place one hand on your chest and one on your stomach to feel both expand."
- Optional toggle: "Extended Exhale Mode" shifts to 4-count inhale, 6-count exhale (supported by source material as an enhancement).

---

### Tool 2: Full Trunk Deep Breathing
**Category:** Physical / Mental
**Time:** 2-3 minutes
**Source:** Lesson 10

**How it works:**
A slower, body-awareness-focused breathing exercise. The user lies down (or sits) and focuses on breathing into the entire trunk, front and back.

**UI Requirements:**
- Step-by-step text instructions, one at a time, advancing on a gentle tap.
- Steps:
  1. "Find a comfortable position -- lying down is ideal, but sitting works too."
  2. "Place one hand on your chest and one on your belly."
  3. "When you breathe in, feel BOTH your chest and your belly expand. Your back should expand too."
  4. "Breathe in slowly for 4 counts." (animated counter)
  5. "Hold for 4 counts." (animated counter)
  6. "Breathe out fully for 4-6 counts." (animated counter, user picks 4 or 6)
  7. "Hold empty for 4 counts." (animated counter)
  8. Repeat prompt after each cycle. Run 4 cycles minimum.

---

### Tool 3: Growth Mindset Reframe
**Category:** Mental / Intellectual
**Time:** 3-5 minutes
**Source:** Lessons 1 and 2

**How it works:**
A guided journaling/reflection prompt that walks the user from a fixed mindset statement to a growth mindset question.

**UI Requirements:**
- Prompt sequence displayed one at a time:
  1. "What is the thought that is overwhelming you right now? (You don't have to type it -- just hold it in mind.)"
  2. "Now ask yourself: Is this a permanent fact, or is it a temporary situation?"
  3. "What is one thing within this situation that you DO have control over?"
  4. "What could this experience be teaching you, even if it is painful?"
  5. "Write down or hold in mind one small action you can take today that is within your control."
- Optional: each prompt has a text input box so the user can write their answers. These clear on session end.
- Closing affirmation: "You are not stuck. You are in a moment that will pass. Growth happens in hard seasons."

---

### Tool 4: Habit Loop Audit
**Category:** Mental / Intellectual
**Time:** 5-7 minutes
**Source:** Lesson 5

**How it works:**
Guides the user to identify a negative habit loop they are currently caught in (trigger, behavior, result) and begin designing a replacement behavior.

**UI Requirements:**
- Explain the concept briefly: "A habit loop has three parts: a Trigger (what sets it off), a Behavior (what you do), and a Result (what you feel after, short term and long term)."
- Walk the user through three fill-in prompts:
  1. "What is your trigger right now? (A feeling, a time of day, a place, a person?)"
  2. "What behavior do you default to when that trigger hits?"
  3. "What is the short-term result? What is the long-term result?"
- Then ask: "What is a healthier behavior you could try instead the next time this trigger appears?"
- Closing note: "You don't have to fix the whole loop today. Just noticing it is the first step."

---

### Tool 5: Gratitude / Focus on the Good
**Category:** Emotional
**Time:** 2-4 minutes
**Source:** Lesson 6

**How it works:**
A gentle prompt to shift attention toward what is still good, to counteract the emotional spiral.

**UI Requirements:**
- Instruction: "This is not about denying that things are hard. It is about reminding your brain that hard is not the whole picture."
- Prompt the user to think of (or type) answers to three questions, shown one at a time:
  1. "What is one thing that happened today that was not terrible -- even if it was small?"
  2. "Who is one person in your life who is on your side?"
  3. "What is one thing about yourself you are not giving yourself credit for right now?"
- After all three, display a soft completion message: "Your brain needed that. Come back here any time."
- Optional: a "Three Good Things" daily habit card the user can revisit with the same prompts.

---

### Tool 6: Name the Lie, Say the Truth
**Category:** Emotional / Mental
**Time:** 5-8 minutes
**Source:** Lesson 6 (Coach Jared Pratt's method, cognitive behavioral restructuring)

**How it works:**
The user identifies a negative thought they are believing about themselves or their situation, examines it, and replaces it with a statement that is actually true.

**UI Requirements:**
- Brief framing: "Right now you are probably telling yourself things that are not true. Let's look at one of them."
- Step-by-step prompts:
  1. "What is the harshest thing you are currently saying to yourself? Write it down." (text input)
  2. "Wait a moment. Breathe. Now ask: Is this statement 100% true, or is it a story I am telling myself?" (pause with breathing animation, 30 seconds)
  3. "What would you say to your best friend if they said this to you?"
  4. "Now write the truth. Not a fake positive spin -- the actual truth about yourself and this situation." (text input)
- Closing: "That truth is the thing worth listening to. Screenshot it if you want to keep it."

---

### Tool 7: Resourcing / Safe Place Visualization
**Category:** Emotional
**Time:** 3-5 minutes
**Source:** Lesson 6

**How it works:**
Guides the user to mentally visit a safe, calming place they create in their imagination to reduce emotional overwhelm in the moment.

**UI Requirements:**
- Gentle ambient intro: "Close your eyes after reading each step. Take your time."
- Steps shown one at a time, user taps to advance:
  1. "Think of a place -- real or imagined -- where you feel completely safe and at peace."
  2. "What does it look like? Notice the colors, the light."
  3. "What sounds are there? Or is it quiet?"
  4. "Feel the temperature. Feel the surface beneath you."
  5. "You are here. Nothing can reach you in this place. Stay as long as you need."
  6. (After a 60-second hold screen) "When you are ready, take a slow breath and come back."
- Include a soft, pulsing background animation (no audio required, but an optional ambient sound toggle could be added).

---

### Tool 8: Positive Mantra / Scripture Affirmation
**Category:** Spiritual
**Time:** 2-3 minutes
**Source:** Lesson 7

**How it works:**
The user selects or writes a mantra, scripture, or positive phrase and is guided to sit with it intentionally.

**UI Requirements:**
- Present a pre-loaded library of affirmations the user can scroll through and select. Include a mix of:
  - Faith-based options (e.g., "God, help me. I need you right now." / "I can do all things through Christ who strengthens me.")
  - Universal options (e.g., "This feeling is temporary." / "I am not my circumstances." / "I am stronger than this moment.")
- User can also type their own phrase.
- Once selected, display the phrase large on screen.
- Prompt: "Read it slowly. Read it again. Breathe between each reading."
- Run a 2-minute timed session where the phrase stays on screen with a gentle pulse animation.

---

### Tool 9: Prayer Prompt
**Category:** Spiritual
**Time:** 2-5 minutes
**Source:** Lesson 7

**How it works:**
A gentle prompt that encourages the user to pray, with optional example prayers provided.

**UI Requirements:**
- Opening note: "Prayer does not have to be long or eloquent. Honest and heartfelt is enough."
- Display three short starter prayers the user can use as-is or as a springboard:
  - "God, be with me right now."
  - "God, if you are real, make yourself real to me."
  - "Jesus, I need you. Help me get through this moment."
- Below the starters: "Or just talk to God in your own words. You do not have to have it figured out."
- A quiet hold screen follows (60-90 seconds, soft pulse) to give the user space.
- Closing: "He meets you exactly where you are."

---

### Tool 10: Values Alignment Check
**Category:** Spiritual
**Time:** 4-6 minutes
**Source:** Lesson 7

**How it works:**
Helps the user reconnect with what they genuinely care about and notice where their life is currently out of alignment with those values.

**UI Requirements:**
- Prompt sequence:
  1. "What are the three things in life you care about most? (Examples: my kids, my faith, my health, being a good person)"
  2. "Looking at the past week -- how aligned were your actions with those three things?"
  3. "Is there one thing you are doing right now that is working against what you care about?"
  4. "What is one small thing you could do in the next 24 hours that would move you closer to what you care about?"
- Closing: "Clarity about what matters is itself a form of calm. You know who you want to be."

---

### Tool 11: Sleep Hygiene Quick Guide
**Category:** Physical
**Time:** 2 minutes (reference guide)
**Source:** Lesson 4 and 7 Tools transcript

**How it works:**
A clean, scannable reference card with the top evidence-based sleep tips from the toolkit.

**UI Requirements:**
- Display as a card-based checklist the user taps through:
  - "Set a consistent bedtime and stick to it."
  - "Start dimming lights 1 hour before bed."
  - "Avoid screens 30-60 minutes before sleep."
  - "Try a calming pre-sleep routine: light reading, gentle stretching, or a warm bath."
  - "7-9 hours is the research-supported target. If you toss and turn, allow extra time in bed."
  - "If racing thoughts keep you up: try box breathing in bed, or listen to something calm and distracting."
- Note at the bottom: "Sleep is the single biggest lever for your ability to handle stress. Prioritize it even when it feels impossible."

---

### Tool 12: Movement Prompt
**Category:** Physical
**Time:** 2 minutes (prompt only)
**Source:** Lesson 4 and 7 Tools transcript

**How it works:**
A simple prompt encouraging the user to move their body, with low-barrier options suited to someone who is overwhelmed.

**UI Requirements:**
- Opening: "Your body is holding stress. Movement releases it. You do not need a gym."
- Present a tap-to-choose list of low-barrier options:
  - "A 10-minute walk outside (even slow, even around the block)"
  - "5 minutes of light stretching"
  - "Put on a song and move however feels right"
  - "Do 10 slow squats or 10 wall push-ups -- just to move"
- After selection: "Go do it now. Come back when you are done."
- On return: "Nice work. Your cortisol just dropped a little. That mattered."

---

### Tool 13: Journaling Prompt
**Category:** Emotional
**Time:** 5-10 minutes
**Source:** Lesson 6

**How it works:**
An open-ended journaling session to help the user externalize and process what they are feeling.

**UI Requirements:**
- A simple, distraction-free text area (full screen, large font).
- Opening prompt: "Write whatever is in your head. Nobody will see this. It does not have to make sense."
- Optional secondary prompts the user can tap if they are stuck:
  - "What am I most afraid of right now?"
  - "What do I wish someone would say to me?"
  - "What is one thing I need to let go of today?"
- A timer option (5 or 10 minutes) the user can turn on or off.
- At session end: a clear/discard option (no data is saved unless the user copies it).

---

## Screening / Safety Feature

This is not a clinical app, and no diagnostic language should be used. However, the following safety awareness must be present.

When the user selects stress level 8, 9, or 10:

- Before moving to Screen 2, display a soft interstitial message:
  > "It sounds like you are in a really hard moment. This app can help you calm down step by step. If at any point you feel like you might hurt yourself, please reach out to the 988 Suicide and Crisis Lifeline by calling or texting 988. You do not have to be suicidal to call -- they help with any mental health crisis."

- Display this message in a non-alarming, non-clinical tone. It should feel like a caring friend mentioning it, not a legal disclaimer.
- A simple "I'm okay, continue" button moves the user forward.
- This message appears only once per session.

---

## Progress and Completion

After completing a tool on Screen 4:
- Show a brief completion card: "You did something hard. That matters."
- Two options:
  - "Try another tool" (returns to Screen 3)
  - "I'm done for now" (returns to Screen 1, resets session state)

No data is stored between sessions. Each open of the app is a fresh start.

---

## Mobile-First Design Requirements

- Minimum tap target size: 44x44px for all buttons and interactive elements.
- No horizontal scrolling.
- Text minimum: 16px body, 22px headings.
- All tool sessions must be usable with one hand on a phone.
- Animated elements must respect `prefers-reduced-motion` media query (reduce or remove animations when the user has that accessibility setting enabled).
- The stress scale on Screen 1 must be fully usable with a thumb (large touch targets, high contrast).

---

## File Structure

```
/calm-down-app
  index.html         -- main app shell, all screens
  style.css          -- all styles (uses CSS custom properties defined in :root)
  app.js             -- all logic, screen transitions, tool timers
  manifest.json      -- REQUIRED: PWA manifest for "Add to Home Screen"
  sw.js              -- REQUIRED: service worker for offline caching
  /assets
    icon-192.png     -- REQUIRED: app icon at 192x192px (calming design, matches color palette)
    icon-512.png     -- REQUIRED: app icon at 512x512px (same design, larger)
    icon-apple.png   -- REQUIRED: 180x180px Apple touch icon for iOS home screen
```

All PWA files are required, not optional. The app is not considered complete until it passes the following checks:
- Lighthouse PWA audit score of 90 or above.
- "Add to Home Screen" prompt appears on Android Chrome on first visit.
- App launches in standalone mode (no browser chrome) after installation on both iOS and Android.
- App loads and functions fully with no network connection after the first visit.

---

## Out of Scope for This Build

- User accounts or login
- Cloud sync or data storage
- Push notifications
- Audio files (optional ambient sound toggle is acceptable but not required)
- Any integration with external APIs
- App store distribution

---

## Success Criteria

The app is successful when a person in acute emotional distress can:
1. Open the URL on their phone.
2. Complete the check-in and selection in under 60 seconds.
3. Begin a guided tool session within 90 seconds of opening the app.
4. Complete at least one full tool session and feel measurably more grounded than when they started.

The standard set by the source material is: "Start with one. Pick the one that gives you the biggest bang for your buck right now. Focus on doing that. Add more as you can."

The app must embody that principle in everything it does -- never overwhelming, always one clear next step.
