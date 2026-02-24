# Design System — Yongviewbot Client

**Version:** 1.0 · **Last updated:** 2025  
Desktop-first design system for a code review app. **Goal: a cute, mascot-driven UI.** 사용자는 마스코트와 대화하듯 앱을 사용한다. Target: junior developers.

---

## 0. Overview & Scope

### Purpose
This design system defines the single source of truth for visual and interaction design of Yongviewbot Client. The app is **mascot-driven and conversational**: a cute character guides the user and speaks in short, friendly messages. The aim is a **귀여운(cute)** UI/UX—친근하고, 대화 중심이며, 접근성과 명확성을 유지한다. Designers and developers share this language for implementation.

### Scope
- **In scope:** Yongviewbot Client desktop application (Windows, macOS). All UI components, patterns, and tokens used in the app.
- **Out of scope:** Marketing site, third-party integrations’ UI, yongviewbot server UI (if any).

### Audience
- **Designers:** Component specs, patterns, and usage rules for mockups and flows.
- **Developers:** Tokens, component API, and accessibility requirements for implementation.
- **Product:** Principles and content guidelines for copy and behavior.

### Design system principles (meta)
- **Token-first:** Visual decisions are expressed as tokens; avoid one-off values.
- **Documented:** Every component and pattern has usage rules and accessibility notes.
- **Living doc:** Changes are proposed, reviewed, and versioned (see Governance).

---

## 1. Design Principles

### 1.1 Clarity over decoration
Every element should answer "what is this and what does it do?" without extra visual noise. Junior developers need to understand state (running/stopped), actions (start/stop), and configuration at a glance. Avoid decorative gradients, heavy illustrations, or ambiguous icons.

### 1.2 Action hierarchy is explicit
Primary actions (Start bot, Save settings) must be visually dominant; secondary (Copy URL, Open settings) clearly secondary; destructive (Stop, Reset) recognizable but not louder than primary. Use color and weight to encode hierarchy, not only size.

### 1.3 Dense but breathable
Support compact layouts (smaller windows, side-by-side panels) without feeling cramped. Use a consistent spacing scale and avoid large padding by default; allow "comfortable" mode via spacing tokens so the same components can relax when needed.

### 1.4 Keyboard and screen-reader equal to mouse
All primary flows must be keyboard-completable. Focus order and focus visibility are part of the component spec, not an afterthought. Labels and live regions must make the app state clear to assistive tech.

### 1.5 One source of truth for state
Running/stopped, saving/error, and form state must be represented in one place in the UI (e.g., one status line, one toast area). Avoid duplicate indicators that can get out of sync.

### 1.6 Forgiving and informative
Invalid input and errors should show inline where possible, with short guidance. Buttons and fields should have clear disabled states and, when relevant, tooltips or microcopy that explain why something is disabled or what will happen on click.

---

## 2. Brand & Voice

### Brand attributes
- **Mascot-driven:** The mascot is the primary persona. The UI is organized around “talking to” the mascot: its messages, suggestions, and reactions.
- **Conversational:** Actions and feedback are framed as dialogue (e.g. 마스코트가 "봇 시작할까요?" → 사용자 [시작] → "시작했어요!").
- **Cute (귀여운):** Soft, friendly visuals: rounded corners, gentle shadows, warm tone. No cold or corporate feel.
- **Clear:** Purpose and state remain obvious; cuteness does not obscure information.
- **Supportive:** The mascot helps junior developers without sounding judgmental.

### Voice & tone (mascot & UI)
- **Mascot voice:** First-person, friendly, short sentences. e.g. "안녕! 봇 시작할까요?", "URL 복사했어요.", "앗, 봇을 먼저 빌드해 주세요."
- **Tone:** Warm, helpful, concise. Slightly casual but not slang. Avoid cold or robotic phrasing.
- **Microcopy:** Short, actionable labels. Mascot messages one sentence (or two) max.

### Terminology
- Use consistent terms in UI and docs: e.g. "Webhook URL", "설정", "봇 상태", "Review Mode".
- Prefer **동작 중심** labels for buttons: "시작", "종료", "저장", "복사".
- Errors (in mascot voice when possible): state what went wrong and what to do next. e.g. "앗, 봇 JAR를 찾을 수 없어요. yongviewbot을 빌드한 뒤 다시 시도해 주세요."

### 2.1 Mascot & conversational UI
- **Role:** The mascot is the main character. It greets the user, suggests actions, and reacts to results (success, error, state change).
- **Placement:** 마스코트 이미지는 메인 화면 상단 또는 좌측에 고정. 사용자가 스크롤해도 마스코트 영역은 보이거나, 대화 영역과 함께 한 블록으로 표시.
- **Image:** Single mascot asset; you provide the image (e.g. PNG/SVG). Recommended: transparent background, consistent style (cute, line or soft fill). Size: e.g. 120–160px for the main area; use `--ds-mascot-size` token.
- **Conversation flow:** Messages appear as **speech bubbles** (마스코트 말풍선). One or a short sequence of bubbles; newest at bottom. Buttons (시작, 종료, URL 복사, 설정 열기) are placed right after the relevant message so the flow feels like “마스코트가 물어봄 → 사용자가 버튼으로 답함”.
- **States:** Idle greeting → "봇 시작할까요?" / "봇이 돌아가고 있어요." → After action: "시작했어요!", "URL 복사했어요.", or error in mascot voice.
- **Accessibility:** Mascot image has `alt=""` if decorative, or short `alt` describing the character. Message text is real copy (no image-of-text). Bubbles have sufficient contrast.

### 2.2 Cute aesthetic (귀여운 UI)
- **Radius:** Softer corners for mascot UI: bubbles and mascot container use `--ds-radius-bubble` (e.g. 12–16px). Buttons/inputs can stay 6–8px or use slightly larger radius (8px) for a softer look.
- **Shadows:** Soft, subtle (no hard drop shadows). Use `--ds-shadow-surface` or `--ds-shadow-sm` for bubbles.
- **Copy:** Friendly and warm; avoid cold or bureaucratic wording. Mascot uses 반말 or 존댓말 consistently (pick one; e.g. "~해요" 체).

---

## 3. Color System

### Primary palette
| Token | Light (HEX) | Dark (HEX) | Usage | Contrast note |
|-------|-------------|------------|--------|----------------|
| primary-50 | #E8F4FC | #0D2840 | Primary tint, subtle bg | — |
| primary-100 | #B8DCF5 | #163A5C | Hover bg, borders | — |
| primary-200 | #7AB8E8 | #1E4A75 | Borders, dividers | — |
| primary-500 | #0A7ACA | #3B9AE8 | Primary buttons, links, focus ring | 4.5:1 on white / 4.5:1 on dark bg |
| primary-600 | #0665A1 | #5BB0F5 | Primary hover | 4.5:1+ |
| primary-700 | #044D7A | #7EC8F8 | Primary active | 4.5:1+ |

### Neutral palette
| Token | Light (HEX) | Dark (HEX) | Usage |
|-------|-------------|------------|--------|
| neutral-0 | #FFFFFF | #0F1114 | App background |
| neutral-50 | #F5F6F8 | #181B20 | Panel/card bg |
| neutral-100 | #EBEDF0 | #22262C | Elevated surface, inputs |
| neutral-200 | #DDE0E4 | #2E333A | Borders, dividers |
| neutral-300 | #C5CAD1 | #3D444D | Placeholder, disabled border |
| neutral-400 | #9CA3AF | #6B7280 | Secondary text |
| neutral-500 | #6B7280 | #9CA3AF | Body text |
| neutral-600 | #4B5563 | #D1D5DB | Emphasized text |
| neutral-900 | #111827 | #F9FAFB | Primary text (dark bg) / inverse |

### Semantic colors
| Role | Light (HEX) | Dark (HEX) | Usage | Contrast |
|------|-------------|------------|--------|----------|
| success-bg | #ECFDF5 | #064E3B | Success state bg | — |
| success-fg | #059669 | #34D399 | Success text, icon | 4.5:1 on bg |
| warning-bg | #FFFBEB | #78350F | Warning state bg | — |
| warning-fg | #D97706 | #FBBF24 | Warning text | 4.5:1 |
| error-bg | #FEF2F2 | #7F1D1D | Error state bg | — |
| error-fg | #DC2626 | #F87171 | Error text, destructive | 4.5:1 |
| info-bg | #EFF6FF | #1E3A8A | Info state bg | — |
| info-fg | #2563EB | #60A5FA | Info text, links | 4.5:1 |

### Background layers (desktop)
- **Layer 0**: App window background — `neutral-0` (light) / `neutral-0` dark (#0F1114).
- **Layer 1**: Main content area — same or `neutral-50` for slight separation.
- **Layer 2**: Cards, panels, sidebars — `neutral-50` (light) / `neutral-50` dark.
- **Layer 3**: Modals, dropdowns, popovers — `neutral-0` (light) / `neutral-50` dark with elevation.
- **Layer 4**: Toasts, tooltips — `neutral-100` with shadow so they sit above modals.

### Accessibility
- Body text on its background: at least 4.5:1 (WCAG AA). Large text: 3:1.
- Interactive elements and focus rings: at least 3:1 against adjacent colors.
- Do not rely on color alone for state (e.g., success/error); use icon or text too.

---

## 4. Typography Scale

### Font families
- **UI**: `"Segoe UI", system-ui, -apple-system, sans-serif` (Windows); `"SF Pro Text", system-ui` (macOS). Fallback: `sans-serif`.
- **Monospace**: `"Consolas", "Monaco", "Menlo", monospace` for code, URLs, tokens.

### Type scale (desktop-optimized)
| Token | Size (px) | rem | Line height | Weight | Usage |
|-------|-----------|-----|-------------|--------|--------|
| ds-display | 24px | 1.5rem | 1.25 | 600 | Window title, hero |
| ds-title-lg | 18px | 1.125rem | 1.35 | 600 | Panel title, dialog title |
| ds-title | 16px | 1rem | 1.4 | 600 | Section title |
| ds-body-lg | 15px | 0.9375rem | 1.45 | 400 | Lead body |
| ds-body | 14px | 0.875rem | 1.5 | 400 | Body, form labels |
| ds-body-sm | 13px | 0.8125rem | 1.45 | 400 | Secondary text |
| ds-caption | 12px | 0.75rem | 1.4 | 400 | Captions, hints, table metadata |
| ds-label | 12px | 0.75rem | 1.3 | 500 | Field labels, tabs |
| ds-mono | 13px | 0.8125rem | 1.5 | 400 | Code, URL, token value |

### Usage mapping
- **Window title**: ds-display.
- **Panel / dialog title**: ds-title-lg.
- **Section heading**: ds-title.
- **Body**: ds-body; longer blocks can use ds-body-lg.
- **Secondary text**: ds-body-sm.
- **Caption / hint**: ds-caption.
- **Form label**: ds-label.
- **Code, URL, config value**: ds-mono.

### 4.1 Iconography
- **Style:** Outline or subtle fill; same stroke weight as typography (1–1.5px). Prefer a single icon set across the app (e.g. Lucide, Phosphor) for consistency.
- **Sizes:** Align to type scale: 16px (inline with body), 20px (buttons, nav), 24px (section headers, empty states). Use CSS or tokens (e.g. `--icon-sm`, `--icon-md`, `--icon-lg`).
- **Usage:** Icons support the label, they don’t replace it for critical actions. Always pair primary actions with text. Use consistent metaphors (e.g. gear = 설정, play = 시작, square = 종료).
- **Color:** Inherit text color by default; use semantic colors only when meaning is clear (e.g. success, error, warning).
- **Accessibility:** Decorative icons should be `aria-hidden="true"`. Icon-only buttons must have `aria-label` or `title`.

### 4.2 Imagery & illustration
- **Role:** Use for onboarding, empty states, or confirmation screens. Not for decoration in dense workflow UI.
- **Style:** Simple, line or flat style; avoid photo-realistic or noisy illustrations. Prefer one style (e.g. line art or subtle gradient shapes) across the app.
- **Tone:** Calm, professional. No cartoonish or playful characters unless aligned with brand.
- **Placeholders:** For code or file previews, use neutral placeholders (e.g. gray blocks, “No preview”) rather than random imagery.
- **Assets:** Provide 1x and 2x; use SVG where possible for clarity and theming.

---

## 5. Spacing & Layout

### Base unit
- **4px** base. All spacing is a multiple of 4.

### Spacing scale
| Token | Value | Usage |
|-------|--------|--------|
| space-0 | 0 | Reset |
| space-1 | 4px | Tight inline (icon–text) |
| space-2 | 8px | Inline gap, compact list |
| space-3 | 12px | Form field gap, list item padding |
| space-4 | 16px | Default padding, section gap |
| space-5 | 20px | Panel padding (compact) |
| space-6 | 24px | Panel padding (comfortable), card padding |
| space-8 | 32px | Section separation |
| space-10 | 40px | Major sections |

### Grid
- **Desktop**: 4px grid. Align component edges and text baselines to grid where possible.
- **Min width**: 320px; **comfortable min**: 400px. Target window width 700–900px for main content.

### Window padding
- **Compact**: 16px (space-4) around main content.
- **Comfortable**: 24px (space-6).

### Panel / card spacing
- Internal padding: space-4 (compact) or space-6 (comfortable).
- Gap between cards/panels: space-4.
- Gap between form rows: space-3.

### Density modes
- **Compact**: space-3 / space-4 for list and form; smaller type (ds-body, ds-caption).
- **Comfortable**: space-4 / space-6; ds-body-lg acceptable for main content.

---

## 6. Elevation & Surfaces

### Surface levels
| Level | Use | Light | Dark |
|-------|-----|--------|------|
| 0 | App bg | neutral-0 | neutral-0 |
| 1 | Content, panels | neutral-50 or neutral-0 | neutral-50 |
| 2 | Cards, inputs | neutral-100 | neutral-100 |
| 3 | Dropdown, popover | neutral-0 + shadow | neutral-50 + shadow |
| 4 | Modal | neutral-0 + shadow-lg | neutral-50 + shadow-lg |
| 5 | Toast, tooltip | neutral-100 + shadow | neutral-100 + shadow |

### Shadow tokens
| Token | Light | Dark | Use |
|-------|--------|------|-----|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.06) | 0 1px 2px rgba(0,0,0,0.3) | Input focus, subtle lift |
| shadow | 0 2px 8px rgba(0,0,0,0.08) | 0 2px 8px rgba(0,0,0,0.35) | Card, dropdown |
| shadow-md | 0 4px 12px rgba(0,0,0,0.1) | 0 4px 12px rgba(0,0,0,0.4) | Modal |
| shadow-lg | 0 8px 24px rgba(0,0,0,0.12) | 0 8px 24px rgba(0,0,0,0.45) | Modal (emphasis) |

### When to use elevation vs borders
- **Borders**: Same-level separation (card from background, list rows). Use neutral-200.
- **Elevation**: Stacking (dropdown over page, modal over overlay). Use shadow so overlapping surfaces are clear. Prefer one method per context (e.g., cards: border; modals: shadow).

### Desktop layering
- Base: window chrome and main content at 0–1.
- Transient UI (dropdowns, tooltips): 3–4, with focus return to trigger.
- Modal: overlay + layer 4; trap focus and Esc to close.

---

## 7. Component Foundations

### Button
- **Variants**: Primary, Secondary, Ghost, Danger.
- **Sizes**: Small (32px height), Medium (36px), Large (40px). Padding horizontal: 12px (sm), 16px (md), 20px (lg).
- **States**: Default, Hover (bg darken / primary-600), Focus (2px ring primary-500, offset 2px), Active (slight scale or darker), Disabled (opacity 0.5, no pointer events).
- **Rules**: One primary per block; danger for destructive only. Use ds-body or ds-body-sm; icon + text: space-2 gap.
- **A11y**: Min height 32px; focus visible; `aria-disabled` when disabled.

### Text field
- **Variants**: Default, With label, With error, With hint, Password (show/hide).
- **Height**: 36px (compact), 40px (comfortable). Padding 8px 12px. Border 1px neutral-200; focus: border primary-500 + shadow-sm ring.
- **States**: Default, Hover (border neutral-300), Focus (ring), Error (border error-fg, error text below), Disabled (neutral-100 bg, neutral-400 text).
- **Label**: ds-label above, space-1; required asterisk with aria-required.
- **A11y**: label associated; error linked with aria-describedby; autocomplete where appropriate.

### Dropdown / Select
- **Trigger**: Same height as text field; right-side chevron. Opens list below (or above if no space).
- **List**: max-height 280px; scroll; option height 36px; padding 8px 12px. Hover: neutral-50.
- **States**: Closed, Open (shadow), Focus (trigger ring), Option selected (primary-50 bg + checkmark).
- **A11y**: role="listbox", option role="option", aria-expanded, keyboard arrow + Enter.

### Checkbox & Radio
- **Size**: 18px box (checkbox), 18px circle (radio). Label: ds-body, gap space-2.
- **States**: Unchecked, Checked, Indeterminate (checkbox), Focus (ring), Disabled.
- **A11y**: Native input with visible custom skin; label wraps or is linked via for/id.

### Toggle switch
- **Track**: 36×20px (or 32×18 compact). Off: neutral-200; On: primary-500. Thumb: 16px circle, neutral-0, shadow-sm.
- **States**: Off, On, Focus (ring on track), Disabled (opacity 0.5).
- **A11y**: role="switch", aria-checked; min touch 24px if ever used on touch.

### Tabs
- **Style**: Underline or pill. Underline: ds-body, bottom border 2px; active border primary-500. Gap between tabs space-4.
- **States**: Default, Hover (neutral-50), Active (border + weight 500), Focus (ring).
- **Panel**: space-4 padding; only active panel in DOM or hidden with aria-hidden.
- **A11y**: role="tablist", tab role="tab", panel role="tabpanel", aria-selected, arrow keys.

### Table
- **Header**: ds-label, background neutral-50, border-bottom neutral-200. Cell padding 8px 12px.
- **Row**: height 40px (compact) or 48px (comfortable). Border-bottom neutral-200. Hover: neutral-50.
- **Cell**: ds-body; numeric right-align when appropriate.
- **Empty state**: Centered message, ds-body-sm, neutral-400.
- **A11y**: th with scope; prefer table for tabular data; avoid table for layout.

### Sidebar / Navigation rail
- **Width**: 56px (icons only), 200–240px (with labels). Background neutral-50; border-right neutral-200.
- **Item**: height 40px; padding 12px; icon 20px + label ds-body-sm. Active: primary-50 bg + primary-500 left border or icon color.
- **States**: Hover neutral-100, Focus ring.
- **A11y**: nav with aria-label; current page aria-current="page".

### Modal / Dialog
- **Overlay**: rgba(0,0,0,0.4). Backdrop click or Esc closes (if allowed).
- **Panel**: max-width 480px typical; padding space-6; shadow-md; border neutral-200.
- **Title**: ds-title-lg; first focusable element or title.
- **Actions**: Right-align or end; primary button last; gap space-2.
- **A11y**: role="dialog", aria-modal="true", aria-labelledby (title), focus trap, Esc closes, focus return on close.

### Tooltip
- **Trigger**: Often icon button or underlined hint. Show on hover (delay ~300ms) and focus.
- **Content**: ds-caption, max-width 240px; padding 6px 8px; background neutral-900; text neutral-0; shadow.
- **Position**: Prefer above; avoid covering trigger. Arrow optional.
- **A11y**: role="tooltip"; associate with aria-describedby; show on focus for keyboard.

### Toast / Notification
- **Placement**: Bottom-right or top-right; stack vertically; gap space-2.
- **Container**: min-width 320px; padding space-4; shadow-lg; neutral-100 bg; border-left 4px semantic (success/warning/error) or neutral.
- **Content**: ds-body; optional title ds-label. Auto-dismiss 4–6s; close button.
- **A11y**: role="status" or "alert"; live region; avoid interrupting screen reader for non-critical toasts.

---

## 8. Interaction & Motion

### Motion principles
- **Purposeful**: Animation clarifies change (e.g., panel open) or feedback (e.g., button press), not decoration.
- **Short**: Desktop users expect instant feedback; animations should not slow tasks.
- **Respect reduced motion**: Honor `prefers-reduced-motion: reduce` (disable or shorten to &lt;100ms).

### Durations
- **Instant**: 0–80ms — hover highlight, focus ring.
- **Micro**: 100–150ms — button press, icon change, small expand.
- **Short**: 200–250ms — dropdown open, tab switch, toast in.
- **Medium**: 300ms — modal open/close, panel slide.

### Easing
- **Default**: ease-out for enter (e.g. dropdown); ease-in for exit.
- **Standard curve**: cubic-bezier(0.4, 0, 0.2, 1) for most UI.
- **Emphasis**: cubic-bezier(0.2, 0, 0, 1) for modals or important transitions.

### Hover (desktop)
- Buttons, links, list rows: clear hover state (bg or underline) within ~100ms.
- No hover on touch-only targets if same UI is used on touch devices; keep hit target size.

### Focus
- Visible focus ring: 2px solid primary-500, 2px offset. No ring only when keyboard focus is not in use (e.g. mouse-only).
- Focus order: tab order follows visual order; modals trap focus; focus returns to trigger when modal/dropdown closes.

### Drag
- If drag is used (e.g. reorder): cursor change (grab/grabbing); slight scale or shadow on drag; clear drop target. Prefer keyboard reorder as well.

---

## 9. Accessibility

### Contrast
- Body text: ≥4.5:1 against background.
- Large text (≥18px or 14px bold): ≥3:1.
- UI components and graphics: ≥3:1.

### Focus visibility
- All interactive elements must show a visible focus indicator when focused via keyboard.
- Ring: 2px, primary-500, 2px offset; no outline:0 without an alternative.

### Keyboard
- All actions available by mouse must be available by keyboard (Enter/Space for activate; arrows where appropriate).
- Tab order matches visual order; no positive tabindex.
- Modal and overlay: focus trap; Esc closes; focus returns to element that opened.

### Hit targets
- Minimum **32×32px** for click/tap (desktop and touch).
- Spacing between targets at least 8px to avoid mis-hits.

### Screen reader
- Images: alt text or aria-hidden if decorative.
- Form fields: label (visible or aria-label); errors with aria-describedby and aria-invalid.
- Dynamic content (toast, status): use live regions (aria-live) with appropriate politeness (polite for status, assertive for errors).
- State changes (e.g. "Bot started") announced via live region or role="status".

---

## 10. Token Structure

Engineer-ready design tokens in a flat, namespaced structure. Example JSON:

### Color tokens
```json
{
  "color": {
    "primary": {
      "50": "#E8F4FC",
      "100": "#B8DCF5",
      "500": "#0A7ACA",
      "600": "#0665A1"
    },
    "neutral": {
      "0": "#FFFFFF",
      "50": "#F5F6F8",
      "100": "#EBEDF0",
      "200": "#DDE0E4",
      "500": "#6B7280",
      "900": "#111827"
    },
    "semantic": {
      "success": "#059669",
      "warning": "#D97706",
      "error": "#DC2626",
      "info": "#2563EB"
    }
  }
}
```

### Spacing tokens
```json
{
  "spacing": {
    "0": "0",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px"
  }
}
```

### Typography tokens
```json
{
  "font": {
    "sans": "\"Segoe UI\", system-ui, sans-serif",
    "mono": "\"Consolas\", \"Monaco\", monospace"
  },
  "type": {
    "display": { "size": "24px", "lineHeight": "1.25", "weight": "600" },
    "titleLg": { "size": "18px", "lineHeight": "1.35", "weight": "600" },
    "title": { "size": "16px", "lineHeight": "1.4", "weight": "600" },
    "body": { "size": "14px", "lineHeight": "1.5", "weight": "400" },
    "bodySm": { "size": "13px", "lineHeight": "1.45", "weight": "400" },
    "caption": { "size": "12px", "lineHeight": "1.4", "weight": "400" },
    "label": { "size": "12px", "lineHeight": "1.3", "weight": "500" },
    "mono": { "size": "13px", "lineHeight": "1.5", "weight": "400" }
  }
}
```

### Elevation tokens
```json
{
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.06)",
    "md": "0 2px 8px rgba(0,0,0,0.08)",
    "lg": "0 4px 12px rgba(0,0,0,0.1)"
  }
}
```

### Component tokens (example)
```json
{
  "component": {
    "button": {
      "height": { "sm": "32px", "md": "36px", "lg": "40px" },
      "paddingX": { "sm": "12px", "md": "16px", "lg": "20px" },
      "radius": "6px"
    },
    "input": {
      "height": "36px",
      "paddingX": "12px",
      "paddingY": "8px",
      "borderWidth": "1px",
      "radius": "6px"
    },
    "focusRing": "2px solid var(--color-primary-500)",
    "focusRingOffset": "2px"
  }
}
```

Use CSS custom properties or your framework’s theme layer to map these tokens into variables (e.g. `--ds-space-4`, `--ds-color-primary-500`) for implementation.

---

## 11. Patterns

### Form layout
- **Single column** for short forms (e.g. 설정). Group related fields; use spacing (e.g. 24px) between groups.
- **Labels:** Top-aligned, ds-label; required indicator (e.g. asterisk) with `aria-required` and `required`.
- **Validation:** Inline below field; use `ds-body-sm` + semantic color (error/warning). One message per field.

### Empty state
- **Structure:** Illustration or icon (optional) + short title (ds-title or ds-title-lg) + one-line description (ds-body) + primary CTA when applicable.
- **Tone:** Helpful, not apologetic. Example: "아직 연결된 저장소가 없습니다. 아래에서 추가하세요."

### Error state
- **Page-level:** Banner at top with icon + message + optional action (e.g. "다시 시도"). Use `--color-error-bg` / `--color-error-fg`.
- **Inline:** Under the field; don’t rely on color alone (icon or "오류:" prefix). Link to recovery when possible.

### Loading state
- **Skeleton** for content that keeps layout; **spinner** for actions (e.g. "저장 중…"). Prefer deterministic progress when the steps are known.

---

## 12. Content guidelines

- **Language:** UI and in-app copy follow the same language as the product (e.g. 한국어). Keep terminology consistent with Brand & Voice.
- **Length:** Buttons 1–3 words; headings one line where possible; body copy concise.
- **Microcopy:** Hints and tooltips answer "what will happen?" or "why is this disabled?". Avoid redundant repetition of the label.
- **Errors:** What went wrong + what to do next. Avoid blame ("You did X wrong" → "X could not be completed because …").
- **Success:** Short confirmation (e.g. "저장됨", "복사됨") with optional undo when reversible.

---

## 13. Do's and Don'ts

### Color
| Do | Don’t |
|----|--------|
| Use semantic tokens for state (success, error, warning) | Use raw hex or arbitrary colors in UI |
| Ensure 4.5:1 contrast for body text on background | Use primary or accent as unique differentiator for critical info |
| Use `--color-*-muted` for secondary elements | Use full-strength semantic color for non-alerts |

### Typography
| Do | Don’t |
|----|--------|
| Use type scale tokens (ds-title, ds-body, etc.) | Invent one-off font sizes or weights |
| Prefer ds-body for long text; ds-body-sm for secondary | Use caption size for more than a line of body |
| Use ds-mono for code, URLs, tokens | Use monospace for body or headings |

### Components
| Do | Don’t |
|----|--------|
| Pair icon with label for primary actions | Rely on icon-only for critical actions without aria-label |
| Use primary button for one main action per context | Use multiple primary buttons in one view |
| Show loading/disabled state and explain when relevant | Leave buttons enabled with no feedback on click |

---

## 14. Governance & contribution

- **Owner:** [디자인 시스템 담당 팀/담당자]. Design system changes are reviewed by design and eng.
- **Updates:** Propose changes via [이슈/문서/PR 링크]. Include rationale, token/component impact, and migration notes for breaking changes.
- **Versioning:** Document version and "Last updated" at the top. For major token or component renames, bump version and list migration in release notes.
- **Adoption:** New UI should use tokens and components from this doc; legacy screens should be migrated when touched.

---

## 15. References & resources

- **Figma:** [디자인 킷/라이브러리 링크]
- **Storybook (or component catalog):** [URL]
- **Token repository:** [테마 JSON/코드 저장소 링크]
- **Accessibility:** WCAG 2.1 AA; contrast and keyboard behavior per §9.
