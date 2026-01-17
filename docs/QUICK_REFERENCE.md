# 🎯 Quick Reference Card

## Ammonia Plant Emergency Response Simulation

---

## 🎮 QUICK START (5 Min)

```
1. Navigate to:  http://localhost:3000/emergency
2. Wait 5 sec:   Gas leak initiates
3. Click PPE:    Select "Mask" from modal
4. Click Valve:  Close Valve 1 (red → green)
5. Click Spray:  Activate water system (cyan glow)
6. Click Exit:   Emergency evacuation
✓ COMPLETE!
```

---

## 📊 GAS CONCENTRATION SCALE

| PPE Level | Color  | Action |
|-----------|--------|--------|
| 0-10 ppm  | 🟢 Green   | Safe ✓ |
| 10-100    | 🟡 Yellow  | Caution ⚠ |
| 100-500   | 🟠 Orange  | Danger ⚠⚠ |
| 500+      | 🔴 Red     | Critical 🚨 |

---

## 🛡️ PPE OPTIONS

| Option | Icon | Protection | Use Case |
|--------|------|-----------|----------|
| None | ❌ | 0% | Initial assessment only |
| Gloves | 🧤 | Hands only | Basic handling |
| Mask | 😷 | Respiratory | Identify leak, close valves |
| Suit | 👔 | Full body | Hazmat entry |
| Full | 🛡️ | Maximum | Critical response |

---

## 🎮 BUTTON CONTROLS

### Bottom-Left Control Panel

| Button | Function | Color Change |
|--------|----------|--------------|
| **V1** | Close tank valve | Red → Green |
| **V2** | Backup valve | Red → Green |
| **P1** | Power pump | Gray → Blue |
| **SPRAY** | Activate water | Gray → Cyan (Glowing) |
| **PPE Status** | Equip gear | Red → Green |
| **EVACUATION** | Emergency exit | Always Red (Pulsing) |

---

## 📋 SOP CHECKLIST (in order)

```
1. ✓ Identify leak         (Requires: Mask, Gas > 5ppm)
2. ✓ Close main valve      (Click Valve 1)
3. ✓ Activate spray        (Click Spray button)
4. ✓ Evacuate personnel    (Click Evacuation)
5. ⊙ Position rescue team  (Requires: Full Gear)
6. ⊙ Notify authorities    (Manual/Time-based)
```

---

## 📈 MONITORING DASHBOARD (Right Sidebar)

### Top Section: Alarms
- 🔴 **Gas Leak Alert** - Flashing when gas detected
- ⚠️ **Spray OFF** - Warning if spray not active
- 🚨 **Evacuation** - Purple pulse when active

### Middle Section: Real-Time Data
- ⏱️ **Timer** - Shows MM:SS format
- 📊 **Gas Meter** - Horizontal bar (0-500+ ppm)
- 📍 **Status** - Color + label (SAFE/ELEVATED/HIGH/CRITICAL)

### Bottom Sections: Procedures & Logs
- **Steps**: Auto-complete as conditions met
- **Logs**: Latest actions shown first (reverse chrono)

---

## 🎬 ANIMATIONS RUNNING

| Animation | Trigger | Effect | Speed |
|-----------|---------|--------|-------|
| Gas plume | gasConc > 0 | Pulse expand/contract | 2-3 sec |
| Water | sprayActive | Particle cascade | 1.5 sec |
| Alarms | Alert condition | Pulsing color shift | 1 sec |
| Meter | Any change | Bar grows smoothly | Spring |
| Buttons | Hover | Scale to 1.02x | 200ms |

---

## ⌚ OPTIMAL TIMELINE

```
T=0s:    Start
T=5s:    💨 Leak begins
T=10s:   🛡️ Equip PPE
T=15s:   🚪 Close valve
T=20s:   💧 Activate spray
T=25s:   🚨 Evacuate
```

**Response Time Goal: < 30 seconds for complete procedure**

---

## 💡 KEY PHYSICS

### Gas Growth Formula (Per Second)
```
concentration = current + 0.5
              + (valve open ? 0.2 : 0)
              × (spray active ? 0.85 : 1.0)
```

### Leak Radius
```
if spray: radius -= 1 px/sec   (Shrinks)
else: radius += 0.5 px/sec     (Expands)
```

---

## 🎯 SUCCESS METRICS

| Time | Rating | Performance |
|------|--------|-------------|
| <30s | ⭐⭐⭐⭐⭐ | Expert |
| 30-60s | ⭐⭐⭐⭐ | Proficient |
| 60-120s | ⭐⭐⭐ | Competent |
| >120s | ⭐⭐ | Needs Training |

---

## 🆘 EMERGENCY! WHAT TO DO

### If gas is growing (Red alert)
1. **Check spray button** - Is it ON?
2. **If OFF** - Click spray immediately
3. **If ON** - Verify valve is closed
4. **If still rising** - Trigger evacuation

### If PPE won't equip
1. Click the PPE button again
2. Select desired level
3. Click "Confirm & Close"

### If you're stuck
1. Click "Reset" (top right)
2. Try again, slower this time
3. Read the SOP steps carefully

---

## 📱 KEYBOARD TIPS

```
Press: P     (Planned) → Open PPE modal
Press: V     (Planned) → Toggle Valve 1
Press: S     (Planned) → Toggle Spray
Press: E     (Planned) → Evacuate
Press: R     (Planned) → Reset simulation
```

*Coming in next version*

---

## 🎓 LEARNING OBJECTIVES

After this simulation, you'll understand:
✓ Emergency response procedures
✓ When to use specific PPE
✓ System interdependencies
✓ Time-pressure decision making
✓ Real-time monitoring importance

---

## 📞 QUICK HELP

| Problem | Solution |
|---------|----------|
| No gas visible | Wait 5 seconds for leak to start |
| Can't close valve | Valve is already closed (try opening) |
| Spray won't activate | Check if evacuation already triggered |
| Modal won't close | Click "Confirm & Close" button |
| Animations choppy | Refresh page, close other tabs |
| Action log blank | Scroll up (oldest at bottom) |

---

## 🎨 COLOR MEANINGS

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 Green | Safe/Good | ✓ OK |
| 🟡 Yellow | Caution | ⚠️ Alert |
| 🟠 Orange | Danger | ⚠️⚠️ Warning |
| 🔴 Red | Critical | 🚨 Emergency |
| 🔵 Blue | Operational | ℹ️ Info |
| 🔷 Cyan | Active | ✨ Running |

---

## 📊 DASHBOARD INDICATORS

```
Left  Side: Status colors in circles
Right Side: Numbers with units
Bottom:    Timestamps in seconds

Example Reading:
  Gas: 42.3 ppm 🟠 HIGH
  Time: 00:23
  Actions: 5 logged
```

---

## 🚀 NEXT ACTIONS AFTER SIMULATION

1. **Review** action log for mistakes
2. **Note** timing vs. optimal timeline
3. **Try** again for better score
4. **Study** procedure documentation
5. **Practice** until consistent

---

## 📚 DOCUMENTATION MAP

```
Need quick help?
  └─→ EMERGENCY_SIMULATION_README.md

Need to understand system?
  └─→ emergency-response-simulation.md

Need animation details?
  └─→ animation-handoff-guide.md

Need architecture?
  └─→ ARCHITECTURE.md

Need everything?
  └─→ INDEX.md (Start here!)
```

---

## ✨ TIPS & TRICKS

- **Hover over components** - See what's clickable (scale up)
- **Watch the meter** - Colors match urgency level
- **Check the log** - See if actions registered
- **Read the steps** - SOP shows what's needed
- **Use time** - Pause, think, then act
- **Experiment** - Try wrong actions to learn consequences

---

## 🏆 CHALLENGE MODES

### Speed Run
Complete all steps in < 30 seconds

### No Mistakes
Execute every action correctly on first try

### Maximum PPE
Use full protective gear for all steps

### Long Response
See how high gas goes if you wait 60+ seconds

---

## 🔐 SAFETY REMINDER

**This is an educational simulation only.**

For actual chemical emergencies:
- ☎️ Call 911 (US) or local emergency
- 👥 Follow facility Emergency Response Plan
- 👨‍💼 Consult trained safety professionals
- 📖 Refer to OSHA guidelines

---

## 💾 STATE SAVING

**Click "Save"** (top right) to log simulation state:
- Gas concentration
- Valve positions
- Timer elapsed
- Actions taken
- PPE equipped

Data appears in browser console for review.

---

## 🎯 ONE-PAGE SUMMARY

| Element | What | Where | How |
|---------|------|-------|-----|
| **Canvas** | Plant layout | Center | SVG animation |
| **Sidebar** | Real-time data | Right | Scrolling panels |
| **Controls** | System toggles | Bottom-Left | Clickable buttons |
| **Modal** | PPE selection | Overlay | Spring animation |
| **Alerts** | Warnings | Various | Pulsing effects |
| **Log** | Action history | Sidebar | Reverse order |

---

**Status**: ✅ Ready to Use  
**Version**: 1.0  
**Last Updated**: January 2026

🎉 **Let's Train. Let's Be Safe.** 🚨
