# Fala Brazil — Updated CSS Files
## How to apply these to your codebase

These 5 files replace the existing CSS in your `FalaBrazil-` repo.
Drop them in and you're done — all class names are preserved.

---

### Files to replace

| This file → | Replaces |
|---|---|
| `App.css` | `App.css` (root of repo) |
| `TodayScreen.css` | `TodayScreen.css` (root of repo) |
| `WelcomeScreen.css` | `WelcomeScreen.css` (root of repo) |
| `BottomNav.css` | `BottomNav.css` (root of repo) |
| `OnboardingScreen.css` | `OnboardingScreen.css` (root of repo) |

---

### One change needed in your TSX files

The new `WelcomeScreen.css` uses **Fraunces** instead of Playfair Display.
Remove the Google Fonts import from `WelcomeScreen.css` (already done here)
and make sure `App.css` is imported in your `main.tsx` or `App.tsx` — it
already loads both Fraunces + DM Sans via Google Fonts.

The `OnboardingScreen.tsx` already uses inline styles for Fraunces/Figtree —
those will still work. The CSS updates the class-based elements around them.

---

### Design tokens (CSS custom properties)

All set in `:root` inside `App.css`. Override any per-screen if needed:

```css
--accent:       #1a3d2b;   /* Forest green */
--accent-hover: #2d6647;   /* Mid green */
--accent-light: #eaf4ee;   /* Light green tint */
--gold:         #c49a0a;   /* Solar gold */
--gold-light:   #fdf6dc;   /* Light gold tint */
--bg:           #faf9f5;   /* Warm off-white */
--card-bg:      #ffffff;
--text-main:    #181816;   /* Warm near-black */
--text-dim:     #8a8a72;   /* Warm mid-gray */
--border:       rgba(26,61,43,0.1);
--font-display: 'Fraunces', Georgia, serif;
--font-body:    'DM Sans', system-ui, sans-serif;
```

---

### What changed visually

- **Typography**: Fraunces serif for all display headings, DM Sans (light weights) for body
- **Colors**: Refined deep green + solar gold accent system
- **Progress bars**: Green → gold gradient
- **Cards**: Cleaner, less aggressive borders, softer shadows
- **Bottom nav**: Gold underline active indicator (replaces multi-color icon system)
- **Welcome screen**: Full-bleed photo with green scrim + card sliding up
- **Quotes**: Gold left border blockquote treatment throughout
- **Buttons**: Refined green CTA, gold for final/special actions
