# Component Interaction Map & State Flow

## 🔗 Component Hierarchy

```
EmergencyResponseSimulation (Main Container)
├── Header (Shared)
│   ├── onSave() → Log simulation state
│   └── onReset() → Clear all state
│
├── PlantSchematic (Canvas)
│   ├── Ammonia Tank [INTERACTIVE]
│   │   └── onComponentClick('tank-1', 'tank')
│   ├── Valves [INTERACTIVE]
│   │   ├── Valve 1 → Main storage isolation
│   │   └── Valve 2 → Backup/auxiliary
│   ├── Cooling Tower [Display]
│   ├── Control Room [Display]
│   ├── Spray System [INTERACTIVE]
│   │   └── onComponentClick('spray-1', 'spray')
│   ├── Safety Stations [INTERACTIVE - Display Only]
│   │   ├── Eyewash Station
│   │   ├── Emergency Shower
│   │   └── PPE Locker
│   ├── Emergency Exit [INTERACTIVE]
│   │   └── onComponentClick('exit-1', 'exit')
│   ├── Gas Plume Animation (Reactive)
│   │   ├── Responds to: gasConcentration
│   │   ├── Responds to: spraySystemActive
│   │   └── Responds to: leakRadius
│   └── Water Spray Animation (Conditional)
│       └── Renders when: spraySystemActive === true
│
├── ControlPanel (Fixed Overlay - Bottom Left)
│   ├── Valve Buttons
│   │   ├── Button: valve-1
│   │   │   └── onToggleValve('valve-1')
│   │   │       ├── Updates: valvesOpen
│   │   │       └── Logs: Action
│   │   └── Button: valve-2
│   │       └── onToggleValve('valve-2')
│   │
│   ├── Pump Buttons
│   │   └── Button: pump-1
│   │       └── onTogglePump('pump-1')
│   │           ├── Updates: pumpsRunning
│   │           └── Logs: Action
│   │
│   ├── Spray System Button
│   │   └── onToggleSpray()
│   │       ├── Updates: spraySystemActive
│   │       ├── Triggers: Gas reduction physics
│   │       └── Triggers: Procedure step completion
│   │
│   ├── PPE Status Button
│   │   └── onClick() → Opens PPESelectionPanel
│   │
│   ├── Emergency Evacuation Button
│   │   └── onEvacuate()
│   │       ├── Sets: evacuationTriggered = true
│   │       ├── Sets: isRunning = false
│   │       ├── Triggers: Full-screen banner
│   │       └── Logs: CRITICAL action
│   │
│   └── Quick Reference Card (Display)
│
├── RightSidebar (Fixed Overlay - Right)
│   ├── Alarm Indicators
│   │   ├── Gas Leak Alert (Pulsing)
│   │   │   └── Condition: gasConcentration > 0
│   │   ├── Spray System Status
│   │   │   └── Condition: !spraySystemActive && gas > 10
│   │   └── Evacuation Alert (Pulsing)
│   │       └── Condition: evacuationTriggered === true
│   │
│   ├── Simulation Timer
│   │   ├── Source: elapsedTime (updates every 1s)
│   │   └── Display: MM:SS format
│   │
│   ├── Gas Concentration Meter
│   │   ├── Source: gasConcentration
│   │   ├── Visual: Horizontal bar gauge
│   │   ├── Status Mapping:
│   │   │   ├── 0-10 ppm → Green (SAFE)
│   │   │   ├── 10-100 ppm → Yellow (ELEVATED)
│   │   │   ├── 100-500 ppm → Orange (HIGH)
│   │   │   └── 500+ ppm → Red (CRITICAL)
│   │   └── Color: Dynamic based on threshold
│   │
│   ├── SOP Instructions (Scrollable)
│   │   ├── Step Source: procedureSteps[]
│   │   ├── Auto-completion triggers:
│   │   │   ├── step-1: gasConcentration > 5 AND currentPPE === 'mask'
│   │   │   ├── step-2: !valvesOpen.has('valve-1')
│   │   │   ├── step-3: spraySystemActive === true
│   │   │   ├── step-4: evacuationTriggered === true
│   │   │   ├── step-5: currentPPE === 'full'
│   │   │   └── step-6: (manual or time-based)
│   │   ├── Visual states:
│   │   │   ├── Completed: Green bg + checkmark + strikethrough
│   │   │   ├── Critical: Red pulsing icon + animated border
│   │   │   └── Pending: Numbered circle + normal text
│   │   └── PPE callout: Yellow text if required
│   │
│   └── Activity Log (Scrollable, Reverse Chronological)
│       ├── Source: actionLog[]
│       ├── Entries: max 20 (auto-trim)
│       ├── Status colors:
│       │   ├── success (green)
│       │   ├── warning (yellow)
│       │   ├── error (red)
│       │   └── info (blue)
│       ├── Auto-populated from:
│       │   ├── handleToggleValve()
│       │   ├── handleTogglePump()
│       │   ├── handleToggleSpray()
│       │   ├── handleEvacuation()
│       │   ├── Procedure step completion
│       │   └── Gas concentration thresholds
│       └── Display: Newest entry at top
│
├── PPESelectionPanel (Modal - Overlay)
│   ├── Trigger: "PPE Status" button in ControlPanel
│   ├── State: isOpen (ppeModalOpen)
│   ├── Options: 5 equipment levels
│   │   ├── none → Red
│   │   ├── gloves → Blue
│   │   ├── mask → Green
│   │   ├── suit → Purple
│   │   └── full → Indigo
│   ├── Validation:
│   │   ├── Checks: requiredPPE vs currentPPE
│   │   ├── Alert: Yellow border if insufficient
│   │   └── Block: Won't proceed with wrong gear
│   ├── Action: onPPESelect(ppe)
│   │   ├── Updates: currentPPE
│   │   ├── Triggers: Procedure completion check
│   │   └── Closes: Modal
│   └── Close: onClose() button or backdrop click
│
└── Emergency Evacuation Banner (Full-Screen Overlay)
    ├── Trigger: evacuationTriggered === true
    ├── Backdrop: Red semi-transparent + blur
    ├── Content: Large "EVACUATION IN PROGRESS" text
    ├── Animation: Pulsing opacity + background color shift
    ├── Timer: Shows elapsed time
    └── Z-index: 50 (Above all other overlays)
```

---

## 🔄 State Update Flow

### Gas Concentration Loop (Every 1 second)

```
useEffect(() => {
  if (!isRunning) return;
  
  setInterval(() => {
    // 1. Update elapsed time
    setElapsedTime(prev => prev + 1)
    
    // 2. Calculate gas dynamics
    setGasConcentration(prev => {
      let newConc = prev + 0.5;  // Base growth
      
      // Leak accelerator if valve open
      if (valvesOpen.has('valve-1')) {
        newConc += 0.2;
      }
      
      // Spray reduces concentration
      if (spraySystemActive) {
        newConc *= 0.85;  // 15% reduction per second
      }
      
      return Math.max(0, newConc);
    });
    
    // 3. Update leak radius
    setLeakRadius(prev => {
      if (spraySystemActive) {
        return Math.max(0, prev - 1);  // Containment
      }
      return prev + 0.5;  // Expansion
    });
  }, 1000);
}, [isRunning, spraySystemActive, valvesOpen]);
```

---

## 🎯 Procedure Step Completion Logic

### Auto-Completion System

```typescript
useEffect(() => {
  setProcedureSteps(prev =>
    prev.map(step => {
      // STEP 1: Identify leak
      if (
        step.id === 'step-1' &&
        gasConcentration > 5 &&
        currentPPE === 'mask' &&
        !step.completed
      ) {
        addActionLog('✓ Gas leak identified', 'success');
        return { ...step, completed: true };
      }
      
      // STEP 2: Close valve
      if (
        step.id === 'step-2' &&
        !valvesOpen.has('valve-1') &&
        !step.completed
      ) {
        addActionLog('✓ Main valve closed', 'success');
        return { ...step, completed: true };
      }
      
      // STEP 3: Activate spray
      if (
        step.id === 'step-3' &&
        spraySystemActive &&
        !step.completed
      ) {
        addActionLog('✓ Spray activated', 'success');
        return { ...step, completed: true };
      }
      
      // STEP 4: Evacuation
      if (
        step.id === 'step-4' &&
        evacuationTriggered &&
        !step.completed
      ) {
        addActionLog('✓ Evacuation initiated', 'success');
        return { ...step, completed: true };
      }
      
      // STEP 5: Full PPE
      if (
        step.id === 'step-5' &&
        currentPPE === 'full' &&
        !step.completed
      ) {
        addActionLog('✓ Full gear equipped', 'success');
        return { ...step, completed: true };
      }
      
      return step;
    })
  );
}, [
  gasConcentration,
  valvesOpen,
  spraySystemActive,
  currentPPE,
  evacuationTriggered,
  addActionLog
]);
```

---

## 👥 User Action Handlers

### Handler: Toggle Valve

```typescript
const handleToggleValve = (valveId: string) => {
  setValvesOpen(prev => {
    const newSet = new Set(prev);
    
    if (newSet.has(valveId)) {
      // Already open → close it
      newSet.delete(valveId);
      addActionLog(
        `${valveId.toUpperCase()} OPENED - ⚠ Leak flow increased!`,
        'warning',
        valveId
      );
    } else {
      // Closed → open it (isolate)
      newSet.add(valveId);
      addActionLog(
        `${valveId.toUpperCase()} CLOSED - Leak source isolated`,
        'success',
        valveId
      );
    }
    
    return newSet;
  });
};

// Consequence:
// - Gas concentration increases if valve opened (mistake)
// - Gas concentration slowed if valve closed (correct)
// - Affects SOP step-2 completion
```

### Handler: Toggle Spray

```typescript
const handleToggleSpray = () => {
  setSpraySystemActive(prev => {
    const newState = !prev;
    
    if (newState) {
      addActionLog(
        '💧 WATER SPRAY ACTIVATED - Gas containment in progress',
        'success'
      );
      // Triggers: 15% gas reduction per second
      //           Leak radius shrinkage
      //           SOP step-3 completion
    } else {
      addActionLog(
        '💧 Water spray deactivated',
        'warning'
      );
      // Triggers: Gas expansion resumes
    }
    
    return newState;
  });
};
```

### Handler: Evacuation

```typescript
const handleEvacuation = () => {
  setEvacuationTriggered(true);
  setIsRunning(false);  // Pause time
  addActionLog(
    '🚨 EMERGENCY EVACUATION PROTOCOL INITIATED',
    'error'
  );
  toast({
    title: 'Evacuation Started',
    description: 'All personnel must leave immediately.'
  });
  // Triggers: Full-screen red banner with pulsing animation
  //           SOP step-4 completion (if triggered)
  //           Disables all control panel interactions
};
```

---

## 📊 Data Flow Diagram

```
User Input (Click/Tap)
    ↓
Handler Function (handleToggleValve, etc.)
    ↓
State Update (setValvesOpen, setGasConcentration, etc.)
    ↓
↙─────────────────────────────────────────┐
                                          ↓
Component Re-render                    useEffect Triggers
    ↓                                      ↓
PlantSchematic updates                 addActionLog()
  - Gas cloud animation                   ↓
  - Valve color changes                ActionLog updated
  - Leak radius changes                   ↓
    ↓                                  RightSidebar Re-render
RightSidebar updates                      ↓
  - Concentration meter                Activity Log updates
  - Procedure completion checks
  - Alarm indicators toggle
    ↓
User sees immediate visual feedback
```

---

## 🎬 Animation Trigger Map

| Trigger | Component | Animation | Duration |
|---------|-----------|-----------|----------|
| `gasConcentration > 0` | Gas Plume | Expand/Contract circles | 2-3s loop |
| `spraySystemActive === true` | Water Spray | Particle fall effect | 1.5s repeat |
| `alarmStatus.gasLeak === true` | Alert Badge | Pulse scale & color | 0.8s loop |
| `gasConcentration > threshold` | Meter Bar | Width growth | Spring physics |
| `step.critical && !completed` | Procedure Step | Icon pulse | 1.5s loop |
| Hover component | Any button | Scale 1.02x | 200ms |
| Hover spray button | Spray Button | Glow shadow | 2s loop |
| evacuationTriggered | Full Banner | Opacity pulse + color shift | 1.5s loop |
| PPE selection | Modal | Scale up + fade | 300ms |

---

## ⚡ Performance Considerations

### Optimization Strategies

1. **useCallback Hooks**
   - `addActionLog()` memoized with `[elapsedTime]`
   - Prevents unnecessary re-renders

2. **Set Data Structures**
   - `valvesOpen: Set<string>`
   - `pumpsRunning: Set<string>`
   - O(1) lookup for component states

3. **Limited Action Log**
   - Max 20 entries (`.slice(-20)`)
   - Prevents memory bloat

4. **Conditional Rendering**
   - Gas plume only renders if `gasIntensity > 0`
   - Water spray only renders if `sprayActive`
   - Emergency banner only renders if `evacuationTriggered`

5. **SVG Optimization**
   - Use `viewBox` for responsive scaling
   - Minimal DOM nodes per component

---

## 🧪 Testing Scenarios

### Scenario: Successful Response

```
Initial State:
  gasConcentration: 0
  valvesOpen: {}
  spraySystemActive: false
  currentPPE: 'none'

T=5s: Gas leak initiates
  → gasConcentration: 2-3 ppm
  → Leak detected alert appears

User Action 1: Select PPE (mask)
  → currentPPE: 'mask'
  → Alarm color changes

User Action 2: Close Valve 1
  → valvesOpen: {'valve-1'}
  → Action log: "Valve closed - isolated"
  → SOP step-2 marked ✓

User Action 3: Activate spray
  → spraySystemActive: true
  → Gas reduction begins (-15%/s)
  → Water particle animation starts
  → SOP step-3 marked ✓

User Action 4: Evacuate
  → evacuationTriggered: true
  → Red banner displays
  → SOP step-4 marked ✓

Result: SUCCESS - All critical steps completed
```

### Scenario: Delayed Response

```
Initial → T=30s: No action taken
  → gasConcentration: 15-20 ppm
  → Multiple alarms flashing
  → Air quality CRITICAL

User finally acts at T=30s:
  → Steps can still be completed
  → But with higher consequence/learning
  → Emphasizes importance of rapid response
```

---

**End of Component Interaction Map**
