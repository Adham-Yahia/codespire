# Dark Mode Implementation Guide

## Overview

CodeSpire now features a premium dark mode system with carefully tuned colors, smooth transitions, and consistent styling across all components.

---

## 🎨 Color Palette

### Light Mode
- **Primary Background**: `#ffffff` (White)
- **Secondary Background**: `#f8f9fa` (Light Gray)
- **Tertiary Background**: `#e8eaed` (Lighter Gray)
- **Primary Text**: `#202124` (Dark Gray/Near Black)
- **Secondary Text**: `#5f6368` (Medium Gray)
- **Tertiary Text**: `#80868b` (Light Gray)
- **Border Color**: `#dadce0` (Very Light Gray)

### Dark Mode
- **Primary Background**: `#0f1419` (Deep Navy Blue)
- **Secondary Background**: `#1a1f2e` (Navy Blue)
- **Tertiary Background**: `#262d3d` (Lighter Navy)
- **Primary Text**: `#e8eaed` (Off-White)
- **Secondary Text**: `#bdc1c6` (Light Gray)
- **Tertiary Text**: `#9aa0a6` (Medium Gray)
- **Border Color**: `#36454f` (Dark Slate Gray)

### Accent Colors (Both Modes)
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Secondary Gradient (Dark)**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`

---

## 🔧 Technical Implementation

### CSS Variables System

Dark mode uses CSS custom properties for dynamic theming:

```css
[data-theme='dark'] {
  --bg-primary: #0f1419;
  --bg-secondary: #1a1f2e;
  --text-primary: #e8eaed;
  --border-color: #36454f;
  /* ... more variables */
}
```

### Theme Provider

The `ThemeContext.js` manages:
- Theme state (isDarkMode boolean)
- localStorage persistence
- System preference detection
- Document-level theme attribute

```javascript
// Apply theme
document.documentElement.setAttribute('data-theme', 'dark');
```

### Global Dark Mode CSS

All dark mode styles are centralized in `src/components/DarkMode.css`:
- Bootstrap component overrides
- Custom component styling
- Form elements
- Tables, cards, modals
- Scrollbar customization
- Smooth transitions

---

## 🎯 Component-Specific Styling

### Cards & Surfaces
```css
.dark-mode .card {
  background-color: #1a1f2e;
  border-color: #36454f;
  color: #e8eaed;
}
```

### Form Elements
```css
.dark-mode .form-control {
  background-color: #262d3d;
  color: #e8eaed;
  border-color: #36454f;
}

.dark-mode .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
```

### Buttons
```css
.dark-mode .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark-mode .btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

### Tables
```css
.dark-mode .table-striped > tbody > tr:nth-of-type(odd) {
  background-color: rgba(102, 126, 234, 0.08);
}
```

---

## 🔄 How Dark Mode Works

### 1. **Theme Toggle**
User clicks the toggle button in the navbar (top-right):
```
Light Mode ☀️ → Dark Mode 🌙
```

### 2. **State Update**
```javascript
const toggleTheme = () => {
  setIsDarkMode(prev => !prev);
};
```

### 3. **DOM Update**
```javascript
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
```

### 4. **CSS Application**
```css
[data-theme='dark'] /* All dark mode styles apply */
```

### 5. **Persistence**
```javascript
localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
```

### 6. **Auto-Detection**
On first load, checks:
1. localStorage for saved preference
2. System preference via `prefers-color-scheme`
3. Defaults to light mode if neither available

---

## 🎭 Visual Features

### Smooth Transitions
All theme changes include 0.3s transitions:
```css
[data-theme='dark'] * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### Hover Effects
Enhanced hover states in dark mode:
- Elevated shadows
- Gradient shifts
- Subtle background changes

### Shadows & Depth
```css
.dark-mode .shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.dark-mode .shadow-md {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
```

### Scrollbar Styling
```css
.dark-mode::-webkit-scrollbar-thumb {
  background: #36454f;
}

.dark-mode::-webkit-scrollbar-thumb:hover {
  background: #4a5568;
}
```

---

## 📱 Responsive Dark Mode

All dark mode styles are responsive:
- Mobile: Adjusted shadows and spacing
- Tablet: Optimized card layouts
- Desktop: Full feature-rich experience

---

## 🛠️ Extending Dark Mode

### Adding Styles to a New Component

1. **Use global CSS variables**:
```css
.my-component.dark {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

2. **Or add specific dark mode rules** in DarkMode.css:
```css
.dark-mode .my-component {
  background: #1a1f2e;
  color: #e8eaed;
}
```

3. **Import useTheme hook**:
```javascript
import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      {/* Content */}
    </div>
  );
};
```

---

## 🎨 Customization Guide

### Changing Colors

1. **Update ThemeContext.js** for base colors
2. **Update DarkMode.css** for component-specific colors
3. **Test thoroughly** across all pages

### Example: Change dark background

```css
/* Before */
--bg-primary: #0f1419;

/* After */
--bg-primary: #0a0e1a; /* Darker */
```

### Adding New Color Themes

```css
[data-theme='dark-purple'] {
  --primary-gradient: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  /* ... more variables */
}
```

---

## 🚀 Performance

- **Minimal CSS overhead**: All dark mode styles in single CSS file
- **Fast theme switching**: No re-render of entire app
- **Optimized shadows**: Uses rgba for transparency
- **Smooth transitions**: Hardware-accelerated CSS

---

## ✅ Quality Checklist

- [x] Contrast ratio meets WCAG AA standards
- [x] All Bootstrap components styled
- [x] Custom components have dark variants
- [x] Form inputs are readable
- [x] Borders are visible
- [x] Text colors are accessible
- [x] Links are distinguishable
- [x] Hover states visible
- [x] Smooth transitions applied
- [x] Scrollbar styled

---

## 📚 CSS File Organization

```
DarkMode.css
├── CSS Variables (Light & Dark)
├── Global Dark Mode Styles
├── Text Colors
├── Cards & Surfaces
├── Forms & Inputs
├── Buttons
├── Tables
├── Accordion
├── Navbar
├── Dropdowns
├── Links & Borders
├── Scrollbar
├── Shadows
├── Code Blocks
├── Modals
├── Progress Bars
├── Component-Specific Styles
│   ├── Community Page
│   ├── Field Detail
│   ├── Comments
│   ├── Skills
│   ├── Video Links
│   ├── Course Cards
│   └── Forms
└── Transitions & Effects
```

---

## 🔍 Testing Dark Mode

### Manual Testing Checklist

- [ ] Toggle dark mode button works
- [ ] Theme persists after page reload
- [ ] All text is readable in dark mode
- [ ] Borders are visible
- [ ] Form inputs are accessible
- [ ] Buttons have visible hover states
- [ ] Cards have proper contrast
- [ ] Comments section looks good
- [ ] Tables are readable
- [ ] Modals are styled correctly
- [ ] Links are distinguishable
- [ ] No flickering on theme switch

### Browser DevTools

1. Open DevTools → Elements
2. Add `data-theme="dark"` to `<html>`
3. Verify all styles apply correctly

---

## 🐛 Troubleshooting

### Dark mode not applying
- Check if `data-theme` attribute is set on `<html>`
- Verify DarkMode.css is imported in correct order
- Clear browser cache and localStorage

### Text not readable
- Check color contrast in DevTools
- Ensure text-primary color is being applied
- Verify --text-primary CSS variable is defined

### Borders disappearing
- Check border-color is set to --border-color
- Verify opacity is not 0
- Use `!important` if overridden by Bootstrap

---

## 📖 Resources

- **CSS Variables**: MDN - CSS Custom Properties
- **Dark Mode**: Web.dev - Dark mode and the web
- **Accessibility**: WCAG 2.1 - Contrast Requirements

---

## 💡 Future Enhancements

- [ ] Add more color theme options (purple, green, etc.)
- [ ] User-selectable accent colors
- [ ] Per-component theme overrides
- [ ] Animation speed controls
- [ ] High contrast mode for accessibility
- [ ] System-sync theme updates

---

**Dark Mode Implementation Complete** ✨

All components styled with premium dark mode support. Users can seamlessly switch between light and dark themes with persistent storage.
