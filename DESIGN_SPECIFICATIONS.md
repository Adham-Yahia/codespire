# Design Specifications - Field Details Page

## 📐 Component Specifications

### Career Opportunities Card

#### Dimensions
- **Card Width**: Min 380px (responsive)
- **Grid Gap**: 24px
- **Padding**: 28px (desktop), 20px (tablet), 16px (mobile)
- **Border Radius**: 16px

#### Typography
- **Title**: 1.3rem, weight 700
- **Description**: 14px, weight 400, opacity 0.85
- **Region Name**: 12px, uppercase, weight 600
- **Salary Amount**: 12px, weight 700

#### Colors

**Light Mode:**
- Background: #fff
- Border: rgba(102, 126, 234, 0.15)
- Text Primary: #202124
- Text Secondary: #5f6368

**Dark Mode:**
- Background: linear-gradient(#1a1f2e, #1d222f)
- Border: rgba(102, 126, 234, 0.25)
- Text Primary: #e8eaed
- Text Secondary: #bdc1c6

#### Shadows
- Default: 0 4px 12px rgba(0, 0, 0, 0.08)
- Hover (Light): 0 12px 32px rgba(102, 126, 234, 0.15)
- Hover (Dark): 0 12px 32px rgba(102, 126, 234, 0.25)

---

### Hiring Rate Badge

#### Size
- **Width**: 70px (min)
- **Height**: Auto
- **Padding**: 10px 16px

#### Colors by Rate
```
Rate ≥ 80%: #51cf66 (Green)
Rate 70-79%: #ffd43b (Yellow)
Rate < 70%: #ff8787 (Red)
```

#### Typography
- **Label**: 11px, uppercase, weight 600
- **Value**: 18px, weight 800

#### Effects
- Border-radius: 12px
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Animation: slideInRight (0.4s)

---

### Salary Column

#### Layout
- **Grid**: 3 equal columns
- **Gap**: 14px
- **Responsive**: Stacks to 1 column on mobile

#### Styling
- **Background**: rgba(102, 126, 234, 0.04-0.12)
- **Border**: 1px solid rgba(102, 126, 234, 0.12-0.2)
- **Border-radius**: 12px
- **Padding**: 14px

#### Hover Effect
- **Background**: Darkens by 8-12%
- **Transform**: scale(1.05)
- **Transition**: 0.3s cubic-bezier

#### Icons
- **Size**: 24px
- **Margin-bottom**: 6px
- **Options**: 🇪🇬 (Egypt), 🏢 (GCC), 🌍 (Global)

---

### Salary Comparison Bar

#### Dimensions
- **Height**: 8px
- **Border-radius**: 4px
- **Segments**: 3

#### Colors
- **Egypt**: #667eea (blue)
- **GCC**: #764ba2 (purple)
- **Global**: gradient #f093fb → #f5576c (pink-red)

#### Sizing
- **Egypt**: flex 0.5
- **GCC**: flex 1
- **Global**: flex 1.2

#### Effects
- **Box-shadow**: 0 2px 8px rgba(0, 0, 0, 0.15)
- **Appears on hover**: Yes

---

### Section Header

#### Title
- **Font-size**: 2rem
- **Font-weight**: 700
- **Background**: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- **Effect**: -webkit-background-clip: text
- **Color**: Gradient (transparent text)

#### Subtitle
- **Font-size**: 1rem
- **Font-weight**: 400
- **Color**: #666 (light), #bdc1c6 (dark)
- **Opacity**: 0.8

---

### Career Card Legend

#### Layout
- **Display**: flex, wrap
- **Gap**: 20px
- **Padding**: 20px
- **Background**: rgba(102, 126, 234, 0.05)
- **Border**: 1px solid rgba(102, 126, 234, 0.1)
- **Border-radius**: 12px

#### Legend Item
- **Display**: flex, gap 10px
- **Font-size**: 13px
- **Font-weight**: 500

#### Indicator
- **Size**: 16x16px
- **Border-radius**: 3px

---

## 🎬 Animation Specifications

### Global Transition
```css
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Hover Effects

**Career Card:**
- **Duration**: 0.3s
- **Transform**: translateY(-8px)
- **Shadow**: Increases 4x
- **Border**: Highlights with gradient color

**Salary Column (on card hover):**
- **Transform**: scale(1.05)
- **Background**: Darkens slightly

**Topic Tags:**
- **Transform**: translateY(-2px)
- **Background**: Darkens
- **Shadow**: Appears

### Entry Animations

**Page Load:**
```css
.field-title: fadeInDown 0.6s ease-out
.field-description: fadeInUp 0.6s ease-out 0.1s
```

**Badge:**
```css
.hiring-rate-badge: slideInRight 0.4s ease-out
```

**Skill Badges:**
```css
.skill-badge: slideIn 0.4s ease-out (staggered)
```

---

## 📱 Responsive Breakpoints

### Mobile (< 576px)
- Career cards: Single column
- Salary columns: Stack vertically
- Padding: 16px
- Font sizes: -10%
- Header flex: Column

### Tablet (576px - 768px)
- Career cards: 2 columns
- Salary columns: 3 columns (inline)
- Padding: 20px
- Font sizes: -5%

### Desktop (768px - 1024px)
- Career cards: 3 columns
- Full features enabled
- Padding: 24px
- All animations enabled

### Wide (> 1024px)
- Career cards: 3+ columns
- Padding: 28px
- Full spacing

---

## 🌓 Dark Mode Specifications

### Colors
```
--bg-primary: #0f1419
--bg-secondary: #1a1f2e
--bg-tertiary: #262d3d
--text-primary: #e8eaed
--text-secondary: #bdc1c6
--text-tertiary: #9aa0a6
--border-color: #36454f
```

### Contrast Ratios
- Primary text on dark bg: 11.6:1 (WCAG AAA)
- Secondary text on dark bg: 8.2:1 (WCAG AA)
- All interactive elements: 4.5:1+ (WCAG AA)

### Background Adjustments
- Base darker (more navy blue)
- Card backgrounds gradient
- Subtle shadows with increased opacity
- Enhanced borders for visibility

---

## ♿ Accessibility Specifications

### Keyboard Navigation
- Tab order: Logical flow (top to bottom)
- Focus outline: 3px solid #667eea
- Focus offset: 2px

### Color Independence
- Hiring rates use: Color + Text + Percentage
- Salary regions use: Region names + Icons + Flags
- Regions use: Icons + Labels + Colors

### Motion Preferences
- Respect `prefers-reduced-motion: reduce`
- Disable animations for users who prefer
- Keep instant interactions

### Text Specifications
- Min font size: 12px
- Line height: 1.4-1.8
- Letter spacing: 0-0.5px
- Contrast: WCAG AA+

---

## 🖼️ Visual Hierarchy

### Size Priority
1. **Titles**: 2-3rem (Highest)
2. **Descriptions**: 1-1.15rem (High)
3. **Body text**: 14-15px (Medium)
4. **Labels**: 12-13px (Low)
5. **Meta**: 11px (Lowest)

### Color Priority
1. **Primary text**: #202124 / #e8eaed (Highest)
2. **Accent gradient**: #667eea → #764ba2 (High)
3. **Secondary text**: #5f6368 / #bdc1c6 (Medium)
4. **Muted text**: #9aa0a6 (Low)
5. **Disabled**: #999 (Lowest)

### Emphasis
- **Gradients**: Most emphasis
- **Bold weight**: Strong emphasis
- **Color**: Moderate emphasis
- **Opacity**: Low emphasis

---

## 📊 Spacing Specifications

### Padding
- Extra large: 32px
- Large: 28px
- Medium: 20-24px
- Small: 16px
- Extra small: 12px

### Margins
- Section gap: 48px
- Component gap: 24px
- Element gap: 12-16px

### Border Radius
- Large: 16px
- Medium: 12px
- Small: 8px
- Tiny: 4px

---

## 🎨 Shadow System

### Light Mode
- sm: `0 1px 3px rgba(0, 0, 0, 0.12)`
- md: `0 4px 12px rgba(0, 0, 0, 0.08)`
- lg: `0 8px 24px rgba(0, 0, 0, 0.06)`

### Dark Mode
- sm: `0 1px 3px rgba(0, 0, 0, 0.4)`
- md: `0 4px 12px rgba(0, 0, 0, 0.5)`
- lg: `0 8px 24px rgba(0, 0, 0, 0.6)`

---

## 📏 Sizing

### Cards
- Min width: 340px
- Max width: 100% (responsive)
- Aspect ratio: Auto

### Badges
- Height: 40px (hiring rate)
- Padding: 10px 16px

### Icons
- Large: 24px
- Medium: 18px
- Small: 12px

---

## 🔤 Font Specifications

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
```

### Weights
- Thin: 100 (unused)
- Regular: 400
- Medium: 500 (for labels)
- Semi-bold: 600 (headings)
- Bold: 700 (titles)
- Extra-bold: 800 (badges)

### Line Heights
- Tight: 1.1 (titles)
- Normal: 1.4-1.6 (body)
- Relaxed: 1.8 (descriptions)

---

## 📈 Scalability

### Grid System
- Auto-fit: min(380px, 1fr)
- Gap: 24px
- Scales from 1-4 columns

### Responsive Scaling
- Desktop to Mobile: Linear reduction
- Max scaling: -25% at smallest breakpoint
- Min scaling: 100% at largest

### Typography Scaling
- Headings: Scale with screen size
- Body: Fixed minimum size
- Maintains readability at all sizes

---

**Design System Version**: 1.0
**Last Updated**: September 3, 2026
**Status**: Production Ready
