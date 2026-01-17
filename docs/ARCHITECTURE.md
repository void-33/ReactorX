# 🏗️ System Architecture & Visual Specifications

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     EMERGENCY RESPONSE SIMULATION (page.tsx)                │
│                          Main State Container                               │
└──────────────┬──────────────────────────┬──────────────────────┬────────────┘
               │                          │                      │
      ┌────────▼────────┐      ┌─────────▼─────────┐    ┌──────▼───────────┐
      │ STATE MANAGER   │      │  EVENT HANDLERS   │    │  EFFECT HOOKS    │
      ├─────────────────┤      ├───────────────────┤    ├──────────────────┤
      │ • isRunning     │      │ • Toggle Valve    │    │ • Simulation     │
      │ • elapsedTime   │      │ • Toggle Pump     │    │   Loop (1s)      │
      │ • gasConc       │      │ • Toggle Spray    │    │ • Auto-Complete  │
      │ • leakRadius    │      │ • Evacuate        │    │   Procedures     │
      │ • valvesOpen    │      │ • PPE Select      │    │ • Condition      │
      │ • pumpsRunning  │      │ • Component Click │    │   Checks         │
      │ • currentPPE    │      │ • Reset           │    │ • Log Actions    │
      │ • actionLog     │      │ • Save State      │    │                  │
      │ • procedureSteps│      └───────────────────┘    └──────────────────┘
      │ • evacuationTriggered
      └────────┬────────┘
               │ (Props Distribution)
      ┌────────┴──────────────────────────────────────────────────────────────┐
      │                                                                         │
      ├──────────────────┬──────────────────────┬─────────────────────────────┤
      │                  │                      │                             │
    ┌─▼──────────┐  ┌───▼──────────┐  ┌───────▼────┐  ┌────────────────────┐
    │HEADER      │  │MAIN LAYOUT   │  │OVERLAY     │  │MODALS              │
    │            │  │              │  │            │  │                    │
    │ • Save     │  │ • 3-col grid │  │ • Control  │  │ • PPESelection     │
    │ • Reset    │  │ • Responsive │  │   Panel    │  │ • Evacuation      │
    │ • Branding │  │             │  │ • Backdrop │  │   Banner          │
    └────────────┘  └───┬──────────┘  └─────┬──────┘  └────────────────────┘
                        │                    │
          ┌─────────────┴───────────────┬────┴─────────────┐
          │                             │                  │
      ┌───▼──────────────┐  ┌──────────▼────────┐  ┌─────▼───────────┐
      │ PLANT SCHEMATIC  │  │  RIGHT SIDEBAR    │  │  CONTROL PANEL  │
      │ (Main Canvas)    │  │ (Monitoring)      │  │ (Interactions)  │
      ├──────────────────┤  ├───────────────────┤  ├─────────────────┤
      │                  │  │ • Alarms          │  │ • Valves        │
      │ SVG Components:  │  │ • Timer           │  │ • Pumps         │
      │ • Tank           │  │ • Gas Meter       │  │ • Spray System  │
      │ • Pipelines      │  │ • SOP Steps       │  │ • PPE Status    │
      │ • Valves         │  │ • Activity Log    │  │ • Evacuation    │
      │ • Towers         │  │ • Auto-Scrolling  │  │ • Quick Ref     │
      │ • Safety         │  └───────────────────┘  └─────────────────┘
      │ • Gas Plume      │
      │ • Spray Effects  │
      └──────────────────┘
```

---

## Component Tree

```
EmergencyResponseSimulation
│
├─ Header
│  ├─ Logo & Title
│  ├─ Save Button
│  └─ Reset Button
│
├─ Main Layout (Grid)
│  │
│  ├─ PlantSchematic (Canvas Area)
│  │  ├─ SVG Container
│  │  ├─ Grid Pattern (Background)
│  │  ├─ Ammonia Tank (Interactive)
│  │  │  ├─ Tank Body (Ellipse + Rect)
│  │  │  ├─ Label Text
│  │  │  └─ Warning Indicator (Conditional)
│  │  ├─ Pipeline Network (Static + Interactive)
│  │  │  ├─ Valve 1 (Green/Red Toggle)
│  │  │  ├─ Valve 2 (Green/Red Toggle)
│  │  │  ├─ Connection Lines
│  │  │  └─ Rupture Point
│  │  ├─ Gas Plume Animation (Conditional)
│  │  │  ├─ Inner Circle (Motion)
│  │  │  ├─ Outer Circle (Motion)
│  │  │  └─ Gradient Definitions
│  │  ├─ Water Spray Animation (Conditional)
│  │  │  ├─ Spray Cones
│  │  │  ├─ Particle Cascade (Motion)
│  │  │  └─ Opacity Pulse
│  │  ├─ Safety Stations (Interactive)
│  │  │  ├─ Eyewash Station
│  │  │  ├─ Emergency Shower
│  │  │  ├─ PPE Locker
│  │  │  └─ Emergency Exit
│  │  ├─ Legend (Fixed, Bottom-Left)
│  │  └─ Leak Alert Badge (Conditional)
│  │
│  ├─ RightSidebar (Fixed, 1 column)
│  │  ├─ Alarm Indicators
│  │  │  ├─ Gas Leak Alert (Pulsing)
│  │  │  ├─ Spray System Status
│  │  │  └─ Evacuation Alert (Conditional)
│  │  ├─ Simulation Timer
│  │  │  └─ MM:SS Display (Animated)
│  │  ├─ Gas Concentration Meter
│  │  │  ├─ Numeric Display
│  │  │  ├─ Bar Gauge (Animated)
│  │  │  └─ Status Indicator
│  │  ├─ SOP Instructions (Scrollable)
│  │  │  ├─ Progress Counter
│  │  │  └─ Step Items (6 total)
│  │  │     ├─ Status Icon
│  │  │     ├─ Instruction Text
│  │  │     └─ PPE Requirement
│  │  └─ Activity Log (Scrollable)
│  │     └─ Log Entries (Reverse Order)
│  │
│  └─ ControlPanel (Fixed Overlay, Bottom-Left)
│     ├─ Valve Controls
│     │  ├─ Valve 1 Button
│     │  └─ Valve 2 Button
│     ├─ Pump Controls
│     │  └─ Pump 1 Button
│     ├─ Spray System Button (Prominent)
│     ├─ PPE Status Button
│     ├─ Emergency Evacuation Button
│     └─ Quick Reference Card
│
├─ PPESelectionPanel (Modal, Conditional)
│  ├─ Backdrop (Click to close)
│  ├─ Modal Card (Spring animation)
│  │  ├─ Header
│  │  │  ├─ Title
│  │  │  └─ Close Button
│  │  ├─ Required PPE Alert (Conditional)
│  │  ├─ PPE Grid (2 columns)
│  │  │  ├─ None Option
│  │  │  ├─ Gloves Option
│  │  │  ├─ Mask Option
│  │  │  ├─ Suit Option
│  │  │  └─ Full Gear Option
│  │  ├─ Info Box
│  │  └─ Confirm Button
│  │
│  └─ (Each Option)
│     ├─ Icon (Emoji)
│     ├─ Name
│     ├─ Description
│     └─ Selection Indicator (Conditional)
│
└─ Evacuation Banner (Full-Screen, Conditional)
   ├─ Backdrop (Red semi-transparent)
   ├─ Alert Icon (Bouncing)
   ├─ Title Text (Pulsing)
   ├─ Description
   └─ Timer Display
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────┐
│     Initial State (T=0)                     │
├─────────────────────────────────────────────┤
│ gasConcentration: 0                         │
│ leakRadius: 0                               │
│ spraySystemActive: false                    │
│ valvesOpen: Set()                           │
│ currentPPE: 'none'                          │
│ elapsedTime: 0                              │
│ evacuationTriggered: false                  │
│ procedureSteps: [6 items, all incomplete]  │
│ actionLog: []                               │
└──────────────┬──────────────────────────────┘
               │
         ┌─────▼──────┐
         │ T=1 to T=5s│ (Waiting)
         │ No changes │
         └─────┬──────┘
               │
         ┌─────▼──────────────┐
         │ T=5-6s: Leak Starts│
         └──────┬─────────────┘
               │
   ┌───────────┴───────────────┐
   │ gasConcentration += 0.5    │
   │ (Growth continues per sec) │
   │ leakRadius += 0.5          │
   │ Gas plume animates         │
   │ Alarms activate            │
   └───────────────┬────────────┘
                   │
         ┌─────────▼──────────────────┐
         │ User Interacts (Any Action)│
         └──────────────┬─────────────┘
                        │
         ┌──────────────┼──────────────────────┐
         │              │                      │
    ┌────▼────┐  ┌─────▼─────┐  ┌────────┬───▼────┐
    │Toggle   │  │Equip PPE  │  │Trigger │Other   │
    │Valve/   │  │or Click   │  │Evacua  │Interact│
    │Pump     │  │Component  │  │tion    │        │
    └────┬────┘  └─────┬─────┘  └───┬────┴────┬───┘
         │              │            │         │
    Gas dynamics    Modal opens  Full cascade Other
    changes         PPE updates  Stop time    effects
    Log action      Validate PPE  Show banner
    (success/       Check SOP     Log action
     warning)       Auto-complete
                    step if ready
                    Log action

         │              │            │         │
         └──────────────┴────────────┴────────┘
                        │
                 ┌──────▼──────┐
                 │ State Update │
                 │ & Re-render  │
                 └──────┬───────┘
                        │
         ┌──────────────┴──────────────┐
         │    Component Updates         │
         ├──────────────┬───────────────┤
         │              │               │
    ┌────▼────┐  ┌─────▼─────┐  ┌──────▼──────┐
    │Schematic│  │Sidebar    │  │ControlPanel│
    │         │  │           │  │            │
    │• Plume  │  │• Meter    │  │• Button    │
    │• Colors │  │• Log      │  │  states    │
    │• Spray  │  │• Alarms   │  │• Disabled? │
    │• Alerts │  │• Progress │  │• Feedback  │
    └─────────┘  └───────────┘  └────────────┘
         │              │               │
         └──────────────┴───────────────┘
                        │
              ┌─────────▼─────────┐
              │ User Sees Results │
              │ (Visual Feedback) │
              └────────────────────┘
```

---

## Data Flow Diagram

```
                    USER INTERACTION
                          ↓
                    ┌─────────────┐
                    │ Event Click │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
        ┌───▼────┐  ┌──────▼────┐  ┌────▼──────┐
        │Handler │  │Validation │  │Check State│
        │Function│  │ & Guards  │  │Conditions │
        └───┬────┘  └──────┬────┘  └────┬──────┘
            │              │             │
            └──────────────┼─────────────┘
                           │
                    ┌──────▼──────┐
                    │ State Update │
                    │   (setState) │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼───┐   ┌──────▼────┐   ┌────▼──────┐
      │Update   │   │Update     │   │Update     │
      │Gas/Valve│   │Spray/PPE  │   │Action Log │
      │State    │   │State      │   │& Procedure│
      └─────┬───┘   └──────┬────┘   └────┬──────┘
            │              │             │
            └──────────────┼─────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │         useEffect Triggers          │
        ├──────────────────┬──────────────────┤
        │                  │                  │
    ┌───▼────┐     ┌───────▼────┐     ┌──────▼──────┐
    │Gas Loop │     │PPE/Valve   │     │Component    │
    │(per 1s) │     │Checked for │     │Re-renders   │
    │         │     │Procedures  │     │             │
    │Updates: │     │            │     │Updates UI   │
    │• conc   │     │Updates:    │     │             │
    │• radius │     │• Steps     │     │Animations   │
    └─────────┘     │• Logs      │     └─────────────┘
                    └────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     Component State Updated         │
        │      (Triggers Animations)          │
        ├──────────────────┬──────────────────┤
        │                  │                  │
    ┌───▼────┐     ┌───────▼────┐     ┌──────▼──────┐
    │Plume    │     │Meter       │     │Badge        │
    │Animates │     │Animates    │     │Animates     │
    │         │     │            │     │             │
    │Size/Rad │     │Width/Color │     │Pulse/Color  │
    │Opacity  │     │Opacity     │     │Opacity      │
    └─────────┘     └────────────┘     └─────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │         User Sees Result            │
        │    (Visual Feedback Complete)       │
        └─────────────────────────────────────┘
```

---

## Responsive Layout Diagram

### Desktop (lg: 1024px+)
```
┌────────────────────────────────────────────────────────────┐
│  HEADER (Full Width)                                       │
├─────┬─────────────────────────────┬────────────────────────┤
│     │                             │                        │
│ Con │                             │   RIGHT SIDEBAR        │
│ tro │      MAIN CANVAS            │   (Monitoring)         │
│ l   │    (PlantSchematic)         │                        │
│ Pan │                             │                        │
│ el  │                             │                        │
│ (Bo │                             │                        │
│ tto │                             │                        │
│ m)  │                             │                        │
│     │ 3 columns (lg:col-span-3)  │ 1 column (lg:col-span-1)
│     │                             │                        │
└─────┴─────────────────────────────┴────────────────────────┘
  1/4         3/4                           1/4
(fixed)      (flex)                       (fixed)
```

### Tablet (md: 768px)
```
┌─────────────────────────────────────┐
│  HEADER                             │
├──────────────────┬──────────────────┤
│                  │                  │
│  MAIN CANVAS     │  RIGHT SIDEBAR   │
│  (PlantSchematic)│  (Monitoring)    │
│  (Adjusted size) │  (Adjusted size) │
│                  │                  │
│                  │                  │
│                  │  [Control Panel] │
│                  │  (Repositioned)  │
│                  │                  │
└──────────────────┴──────────────────┘
    ~60%              ~40%
```

### Mobile (sm: < 640px)
```
┌──────────────────────┐
│  HEADER              │
├──────────────────────┤
│ MAIN CANVAS          │
│ (Full Width,         │
│  Scrollable)         │
│                      │
│  [Touch Friendly]    │
│                      │
├──────────────────────┤
│ RIGHT SIDEBAR        │
│ (Tab Panel or        │
│  Bottom Sheet)       │
│ (Scrollable)         │
│                      │
├──────────────────────┤
│ CONTROL PANEL        │
│ (Repositioned to     │
│  Bottom / Floating)  │
│                      │
└──────────────────────┘
     100%
```

---

## Animation Timeline

```
┌─ Simulation Start ────────────────────────────────────────────────────────┐
│                                                                            │
│ T=0s    Initial State                                                      │
│ ├─ All systems offline                                                    │
│ ├─ Timer shows 0:00                                                       │
│ ├─ Gas concentration: 0 ppm                                               │
│ ├─ No visual effects                                                      │
│                                                                            │
│ T=1-4s  Waiting State                                                      │
│ ├─ Timer increments                                                       │
│ ├─ No hazard visible                                                      │
│ ├─ Procedures inactive                                                    │
│                                                                            │
│ T=5s    Leak Initiates                                                     │
│ ├─ Gas appears: First animation frames                                    │
│ ├─ Alert badges flash: `animate-pulse`                                    │
│ ├─ Plume grows: `r` increases 2-3px per second                           │
│ ├─ Color intensifies: Opacity increases                                   │
│ ├─ Action log: "⚠ Gas leak detected"                                     │
│                                                                            │
│ T=5-10s Response Window                                                    │
│ ├─ User must equip PPE (within 10 sec ideal)                             │
│ ├─ Gas concentration reaching 5 ppm                                       │
│ ├─ Procedure step 1 available                                             │
│                                                                            │
│ T=10-15s Critical Window                                                   │
│ ├─ If spray not active: Gas continues growing exponentially               │
│ ├─ Concentration: 10-20 ppm                                               │
│ ├─ Alarms intensify                                                       │
│ ├─ User should close valve                                                │
│                                                                            │
│ User Action: Close Valve                                                   │
│ ├─ Valve button color: Red → Green                                        │
│ ├─ Valve in schematic: Color change animation                            │
│ ├─ Gas growth slows (but continues)                                       │
│ ├─ Action log: "✓ Valve closed - isolated"                               │
│ ├─ SOP step 2: Mark completed                                             │
│                                                                            │
│ User Action: Activate Spray                                                │
│ ├─ Spray button: OFF → ON (cyan glow activates)                          │
│ ├─ Water particle animation starts: `cascade`                             │
│ ├─ Gas plume begins shrinking: `radius -= 1` per second                  │
│ ├─ Concentration reduces: `*= 0.85` per second                           │
│ ├─ Visual feedback: Spray cone + particles fall                           │
│ ├─ Action log: "💧 Spray activated - containment"                       │
│ ├─ SOP step 3: Mark completed                                             │
│                                                                            │
│ T=30s    Resolution Window                                                │
│ ├─ If spray active: Gas declining                                         │
│ ├─ User triggers evacuation                                               │
│ ├─ Full-screen banner: Red pulsing (`pulse` animation)                   │
│ ├─ Siren icon: Bouncing (`animate-bounce`)                               │
│ ├─ Action log: "🚨 Evacuation initiated"                                 │
│ ├─ SOP step 4: Mark completed                                             │
│                                                                            │
│ T=30+s   Optional Phase                                                    │
│ ├─ User can equip full PPE                                                │
│ ├─ Continue advanced response procedures                                   │
│ ├─ SOP step 5: Mark completed (if full gear)                             │
│                                                                            │
│ T=End    Scenario Complete                                                 │
│ ├─ Final score calculated                                                 │
│ ├─ Results displayed                                                      │
│ ├─ User can reset for next attempt                                        │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Color Palette Visual Reference

```
┌─ Background Gradient ──────────────────┐
│ from: #020617 (slate-950)              │
│ via:  #172554 (blue-950)               │
│ to:   #020617 (slate-950)              │
│ [Dark, professional, tech-forward]     │
└────────────────────────────────────────┘

┌─ Primary Colors ───────────────────────┐
│ ◼ #3b82f6  (Blue-500)    - Water, OK   │
│ ◼ #10b981  (Green-600)   - Safe, Open  │
│ ◼ #fbbf24  (Yellow-500)  - Warning     │
│ ◼ #ef4444  (Red-500)     - Danger      │
└────────────────────────────────────────┘

┌─ Gas Plume Gradient ───────────────────┐
│ Center: #fca5a5 (Red-300)              │
│ Middle: #fb7185 (Red-400)              │
│ Edge:   #fecaca (Red-200)              │
│ Out:    Transparent (0%)               │
│ [Realistic ammonia vapor effect]       │
└────────────────────────────────────────┘

┌─ Component States ────────────────────┐
│ Active:    #06b6d4 (Cyan-500)         │
│ Protected: #8b5cf6 (Purple-600)       │
│ Emergency: #f97316 (Orange-500)       │
│ Neutral:   #64748b (Slate-500)        │
└────────────────────────────────────────┘
```

---

**End of Architecture Documentation**
