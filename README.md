# Screen Time (Chrome Extension)

## Overview

**Timeline**: November 30, 2024 - January 25, 2025 (2 months)  
**Approach**: Feature-driven development - began with core time tracking functionality and expanded to a detailed dashboard to display data

[overview paragraph]

---

## Development Flow

### Phase 1: Core Tracking System (November 30 - December 3, 2024)
**Goal**: Implement basic time tracking on a per tab basis

**Components Built**:
1. **Background Service Worker** (worker.js)
   - Time tracking and Chrome storage integration for data
   - Logic to determine focused tab
   - Idle state monitoring to determine computer state

2. **Manifest Configuration** (manifest.json)
   - Basic manifest v3 setup for popup, background worker, and permissions

**Key Features Introduced**:
- Automatic time tracking on tab changes
- Data storage using Chrome storage API
- Idle state detection
- Window focus tracking

---

### Phase 2: Basic Popup Interface (December 6 - December 8, 2024)
**Goal**: Design and create popup for viewing summary of tracked time

**Components Built**:
1. **Popup Interface** (popup/index.html, popup/style.css)
   - Compact 300px width popup
   - Top 5 sites displayed with progress bars for visualization
   - Total time displayed
   - Settings and power toggle buttons

2. **Popup Logic** (popup/script.js)
   - Data retrieval from storage
   - Adaptive time formatting (only display relevant information)
   - Top 5 sites sorting and progress bar size calculations
   - Update every 30 seconds

**Key Features Introduced**:
- View of top 5 most-used sites
- Progress bars for visuals
- Total time display
- Power (monitoring on/off - in progress)
- Settings panel (with ability to clear data)

---

### Phase 3: Enhanced Popup (December 31, 2024)
**Goal**: Improve popup functionality

**Components Enhanced**:
1. **Popup Script** (popup/script.js)
   - Better data handling
   - Date displayed at top

**Key Features Introduced**:
- Improved data sorting and display
- Enhanced time formatting

---

### Phase 4: Background Service Worker Refinement (January 6 - January 11, 2025)
**Goal**: Refine and improve time tracking accuracy

**Components Enhanced**:
1. **Background Service Worker** (worker.js)
   - Domain extraction (for better displaying)
   - Better time accumulation logic
   - Improved idle state handling
   - Window focus change handling
   - More frequent update interval (5 seconds)
   - Last access time tracking

**Key Features Introduced**:
- More accurate time tracking
- Domain extraction from URLs
   - Removes prefixes and protocol to extract base domain
- Better state handling
- Window focus change detection
- Periodic time updates (every 5 seconds)

---

### Phase 5: Detailed Dashboard (January 18 - January 25, 2025)
**Goal**: Create comprehensive dashboard interface structure with extended functionality for displaying important data

**Components Built**:
1. **Info Page HTML** (info/index.html)
   - Detailed full-page layout
   - Weekly bar chart container with daily total display
   - Complete site list container
   - Navigation controls (prev/next week)
   - Gradient background design
   - Last updated timestamp area
2. **Info Page CSS** (info/style.css)
   - Gradient background animation
   - Weekly chart styling with grid
   - Bar chart visualization for total daily usage
   - Progress bars for each site
   - Smooth animations and transitions
3. **Info Page Script** (info/script.js)
   - Weekly data aggregation
   - Bar chart rendering
   - Average calculation and display
   - Day selection functionality
   - Week navigation (prev/next)
   - Site list with time breakdowns
   - Progress bar calculations
   - Last updated timestamp
   - Automatic updates every 30 seconds
   - Gradient animation system
4. **Icons** (left.png, right.png)
   - Arrows for week navigation

**Components Enhanced**:
1. **Background Service Worker** (worker.js)
   - Refined data structure to store data in weekly chunks

**Enhancement Drawback**: Popup functionality broken - fix in progress

**Key Features Introduced**:
- Professional, modern UI design
- Smooth transitions and hover effects
- Weekly usage chart with 7-day bars and week-to-week navigation
- Average usage line with hover tooltip
- Day selection by clicking bars
- Complete site list with time spent
- Progress bars proportional to total time per site
- Real-time timestamp updates
- Animated gradient background
- Dynamic chart scaling

---

## Development Strategy

### Feature-Driven Architecture
```
Core Tracking System (Background Worker)
    ↓
Basic Interface (Popup)
    ↓
Enhanced Popup
    ↓
Tracking Refinement
    ↓
Detailed Dashboard Interface
```

### Key Principles
- **Core First**: Time tracking system established before UI
- **Incremental UI**: Simple popup before complex dashboard
- **Data Accuracy**: Prioritized accurate tracking logic before focusing on visuals
- **User Experience**: Professional design and smooth interactions

---

## Timeline

| Date | Focus | Major Changes |
|------|-------|---------------|
| **Nov 30, 2024** | Configuration | Manifest v3 setup |
| **Dec 1 - 3, 2024** | Foundation | Initial background script |
| **Dec 6 - 8, 2024** | Popup UI | Basic popup interface |
| **Dec 31, 2024** | Enhancement | Popup improvements |
| **Jan 6 - 11, 2025** | Tracking | Background worker refinement |
| **Jan 18 - 25, 2025** | Dashboard | Complete dashboard implementation and data storage rework |

---

## Development Decisions

1. **Chrome Storage API**: Efficient and convenient way to store data
3. **Two-Interface Design**: Quick popup and detailed dashboard for different use cases
4. **Dark Theme**: Professional dark UI with gradient backgrounds
5. **Weekly View**: Chart-based weekly overview for pattern recognition

---