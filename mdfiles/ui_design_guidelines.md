# 📱 Core UI/UX Mandate: Strict Mobile-Parity

**CRITICAL RULE: The desktop view MUST mirror the mobile view.** 

This project follows a strict "Mobile-Parity" design system. We do not build separate, expanded layouts for desktop screens. The application is designed to feel like a native mobile app or a focused terminal, regardless of the device it is being viewed on.

## 📌 Core Principles

1. **No Desktop-Specific Layouts:** 
   Do not add sidebars, multi-column grids, or expanded navigation menus just because there is extra screen space on a desktop monitor.
2. **Constrained Width:** 
   The main application container must have a strict maximum width and remain centered on larger screens. The UI should never stretch to fill a 1080p or 4K monitor.
3. **Consistent Interactions:** 
   Buttons, modals, and navigation (like bottom tabs or hamburger menus) must behave exactly the same on desktop as they do on mobile. Avoid desktop-only hover states if they hide crucial information from mobile users.

## 🛠️ Implementation Rules (Tailwind CSS Example)

All main page layouts must be wrapped in a centralized, constrained container. 

**DO NOT do this:**
```html
<!-- Fills the whole screen, breaks mobile parity -->
<main class="w-full min-h-screen grid grid-cols-3">...</main>
```

**DO THIS:**
```html
<!-- Centers the app, maintains mobile dimensions on desktop -->
<div class="min-h-screen bg-black flex justify-center">
  <main class="w-full max-w-md bg-gradient-to-br from-[#2a080c] to-[#120204] relative shadow-2xl overflow-hidden border-x border-gray-800">
    <!-- App content goes here -->
  </main>
</div>
```

## 🧪 Testing Checklist
Before merging any new feature or UI update, verify the following:
- [ ] Does the new feature fit perfectly within a mobile viewport?
- [ ] If viewed on a desktop monitor, does the app remain constrained to the center column?
- [ ] Are touch targets (buttons, inputs) large enough for mobile thumbs, even when clicked with a desktop mouse?
- [ ] Is there absolutely zero horizontal scrolling?

**If the desktop version looks different from the mobile version, it is considered a bug and must be fixed.**