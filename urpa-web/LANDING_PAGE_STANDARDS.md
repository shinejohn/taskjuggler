# URPA Landing Page - Component Standards Alignment

## Overview
The URPA landing page (`src/pages/LandingPage.vue`) has been created following the component standards and design patterns from `Magic-URPA/src/components`.

## Component Standards Compliance

### ✅ Design Language
- **Background**: Dark theme with `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`
- **Cards**: `bg-slate-800/50` with `backdrop-blur-xl` for glassmorphism effects
- **Borders**: `border-2 border-slate-700/50` or `border-slate-700` for consistent styling
- **Corners**: `rounded-xl` for cards, `rounded-[2rem]` or `rounded-[3rem]` for larger sections
- **Shadows**: `shadow-lg`, `shadow-xl`, `shadow-2xl` with color-specific glows (e.g., `shadow-teal-500/30`)

### ✅ Typography
- **Primary Text**: `text-white` or `text-slate-200`
- **Secondary Text**: `text-slate-400` or `text-slate-300`
- **Headings**: `font-black` for hero sections, `font-bold` for section headings
- **Consistent sizing**: Responsive text sizes with `text-2xl`, `text-3xl`, `text-4xl`, etc.

### ✅ Color Scheme
- **Primary Accent**: Teal (`teal-400`, `teal-500`, `teal-600`)
- **Secondary Accent**: Blue (`blue-400`, `blue-500`, `blue-600`)
- **Gradients**: `bg-gradient-to-r from-teal-600 to-blue-600` for CTAs
- **Status Colors**: 
  - Green for success/positive (`green-400`, `green-500`)
  - Red for errors/negative (`red-400`, `red-500`)
  - Purple for premium features (`purple-400`, `purple-500`)

### ✅ Component Patterns

#### Cards
```vue
<Card class="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-slate-700 hover:border-teal-500/50 shadow-xl">
```

#### Buttons
```vue
<!-- Primary CTA -->
<Button class="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30">

<!-- Outline -->
<Button variant="outline" class="px-8 py-4 bg-slate-800/50 border-2 border-slate-700 text-white hover:border-teal-500">
```

#### Badges/Status Indicators
```vue
<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border-2 border-teal-500/50 text-teal-400 font-bold">
```

### ✅ Animation & Transitions
- Vue `<Transition>` components for smooth animations
- Custom transition classes: `slide-down`, `fade-slide`
- Hover effects: `hover:shadow-xl`, `hover:border-teal-500`
- Scale transforms: `hover:scale-105`, `active:scale-95`

### ✅ Responsive Design
- Mobile-first approach with `md:` and `lg:` breakpoints
- Collapsible mobile menu
- Responsive grid layouts: `grid md:grid-cols-2 lg:grid-cols-3`
- Flexible text sizing: `text-4xl md:text-6xl`

## Key Differences (Landing Page vs Dashboard Components)

The landing page uses more dramatic styling appropriate for marketing:

1. **Larger Text**: Hero sections use `text-6xl md:text-8xl` (vs `text-base` in dashboard cards)
2. **More Prominent Gradients**: Larger gradient backgrounds and CTAs
3. **Marketing Content**: Features, testimonials, pricing sections
4. **Full-Page Sections**: Each section spans full viewport height/width

Dashboard components are more compact and functional, while the landing page is designed for conversion and engagement.

## Consistency with Other URPA Pages

The landing page maintains consistency with:
- **Login.vue**: Same dark theme, glassmorphism, and button styles
- **SignUp.vue**: Matching form patterns and color schemes
- **Profile.vue**: Consistent card structures and hover effects
- **Subscribe.vue**: Aligned pricing card designs

## Component Library Usage

All components use `@taskjuggler/ui` shared components:
- `Card`, `CardContent` - Consistent card structure
- `Button` - Standardized button component
- Icons from `lucide-vue-next` - Consistent iconography

## Next Steps

1. ✅ Landing page created with all 14 sections
2. ✅ Router updated to include landing page route
3. ⏳ Build and deploy to AWS

The landing page is production-ready and follows all component standards from Magic-URPA.



