# Wobb Frontend Assignment


## 1. Find & Fix Issues ✅

The starter project intentionally contained several bugs and inconsistencies.

### Major fixes

- Removed incompatible dependency preventing installation
- Fixed incorrect engagement rate calculation
- Fixed broken profile routing caused by missing usernames
- Implemented case-insensitive searching
- Fixed non-responsive profile cards
- Removed duplicated formatting utilities
- Removed dead code and unused assets
- Fixed infinite render loop in Zustand selectors
- Fixed non-functional search icon
- Added missing navigation from shortlist page

Each fix is covered by regression tests where applicable.

---

## 2. UI / UX Redesign ✅

The entire interface was redesigned with a modern dark theme while improving usability.

### Improvements

- Modern visual hierarchy
- Responsive layouts
- Animated ambient background
- Consistent spacing and typography
- Improved navigation
- Better empty states
- Skeleton loading
- Accessible interactions
- Keyboard navigation
- Focus-visible styling

---

## 3. Zustand Migration ✅

Replaced React Context with **Zustand**.

### Why Zustand?

- Less boilerplate
- Better performance
- Selective subscriptions
- Built-in persistence
- Cleaner architecture

The application uses Zustand's **persist** middleware to store selected profiles in localStorage.

---

## 4. Add to List Feature ✅

Implemented the complete feature from scratch.

### Features

- Add profiles
- Remove profiles
- Duplicate prevention
- Persistent storage
- Live counter
- Campaign summary
- Platform statistics
- Estimated reach
- Editable campaign name

---

## 5. Code Quality Improvements ✅

The project was refactored for maintainability.

### Improvements

- Feature-based folder structure
- Shared UI components
- Shared utility functions
- Better TypeScript types
- Consistent formatting helpers
- Removed duplicated code
- Cleaner component responsibilities

---

## 6. Performance Optimizations ✅

Several optimizations were added throughout the application.

- Memoized filtering
- Debounced search (200ms)
- Lazy-loaded profile data
- React.memo
- Optimized Zustand selectors
- Reduced unnecessary renders

---

# 🧪 Testing

Added **38 automated tests** covering:

- Utility functions
- Store logic
- Persistence
- Regression tests
- Search functionality
- Routing
- Campaign seeding
- UI rendering
- Navigation

Testing focuses on preventing regressions for every major bug fixed during development.

---

# 🔒 Security Improvements

Although this is a static frontend application, several best practices were implemented.

- No dangerouslySetInnerHTML
- Content Security Policy
- Referrer Policy
- Safe external links
- Query parameter validation
- LocalStorage validation
- Dependency audit (0 known vulnerabilities)

---

# 🚀 Highlights

### ✅ Modern UI Redesign
- Complete dark-theme redesign
- Responsive layout for desktop, tablet, and mobile
- Improved visual hierarchy and spacing
- Smooth animations with reduced-motion support
- Better navigation and user flow

### ✅ Feature Completion
- Implemented **Add to List**
- Duplicate prevention
- Persistent shortlist using localStorage
- Campaign summary with live statistics
- Editable campaign name
- Remove individual profiles
- Clear all profiles

### ✅ Engineering Improvements
- Replaced React Context with Zustand
- Refactored into feature-based architecture
- Removed duplicated logic
- Improved TypeScript safety
- Reusable UI components
- Cleaner utilities and helpers

### ✅ Performance
- Lazy-loaded profile pages
- Memoized filtering
- Debounced searching
- Optimized Zustand selectors
- React.memo where appropriate

### ✅ Quality
- 38 automated tests
- Accessibility improvements
- Security hardening
- Responsive design
- Production build passes successfully

---

# 🛠 Tech Stack

| Category | Technology |
|------------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| State Management | Zustand |
| Testing | Vitest + Testing Library |

---

# 📦 Getting Started

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Production build

```bash
npm run build
```

Run tests

```bash
npm run test
```

Lint project

```bash
npm run lint
```

---

# 📂 Project Structure

```
src/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── search/
│   ├── profile/
│   └── list/
├── store/
├── utils/
├── lib/
└── types/
```

# 📚 Libraries Added

| Library | Purpose |
|------------|------------|
| Zustand | State management |
| Zustand Persist | Local persistence |
| Vitest | Unit testing |
| Testing Library | Component testing |

---

# Assumptions

- Kept `/profile/:username` routing for compatibility with existing JSON files.
- Used static JSON data since backend integration wasn't part of the assignment.
- Chose a 200ms debounce as a reasonable default for the dataset size.
- Focused on a polished dark theme instead of implementing theme switching.

---

# Trade-offs

- Drag-and-drop ordering was intentionally omitted because it wasn't required.
- No backend or authentication since the assignment uses static data.
- Search remains client-side because the dataset is small.
- Profile data loading is abstracted to simplify future API integration.

---

# Future Improvements

If this project were productionized, the next steps would include:

- Backend API integration
- Authentication
- React Query for server state
- Infinite scrolling
- Virtualized profile lists
- Campaign sharing
- Image optimization
- Analytics dashboard
- Server-side search
- End-to-end testing

