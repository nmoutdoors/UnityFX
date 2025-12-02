# eSITREP Fullscreen Implementation - Technical Reference

## THE PROBLEM
SharePoint wraps web parts in containers (.ControlZone, .CanvasZone, etc.) that you don't control.
CSS alone CANNOT style parent elements.
Therefore, JavaScript DOM manipulation is REQUIRED.

## THE SOLUTION - 3 PARTS

### PART 1: CSS Classes (Component-Level Styling)

**File:** `src/webparts/eSitrep/components/ESitrep.module.scss`

```scss
.eSitrep {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 1em;
  box-sizing: border-box;
}

.fullScreenMode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin: 0;
  padding: 1em;
  height: 100vh;
  width: 100vw;
}
```

**Applied in component:**
```typescript
const containerClassName = isFullScreen
  ? `${styles.eSitrep} ${styles.fullScreenMode}`
  : styles.eSitrep;

return <div className={containerClassName}>...</div>
```

---

### PART 2: JavaScript Service (Parent Container Manipulation)

**File:** `src/webparts/eSitrep/services/WebPartPropertyService.ts`

**KEY METHOD:**
```typescript
public applyFullScreenStyles(isFullScreen: boolean, containerSelector: string): void {
  // 1. Find YOUR component
  const eSitrepContainer = document.querySelector(containerSelector);
  
  // 2. Find SHAREPOINT'S parent container (ControlZone)
  const webpartContainer =
    document.querySelector('[data-sp-feature-tag="ESitrepWebPart"]') ||
    eSitrepContainer.closest('.ControlZone') ||
    document.querySelector('.ControlZone') ||
    eSitrepContainer.closest('[class*="webPartContainer"]') ||
    this.findWebPartContainer(eSitrepContainer);
  
  // 3. Apply inline styles to SHAREPOINT'S container
  if (webpartContainer && isFullScreen) {
    (webpartContainer as HTMLElement).style.position = 'fixed';
    (webpartContainer as HTMLElement).style.top = '0';
    (webpartContainer as HTMLElement).style.left = '0';
    (webpartContainer as HTMLElement).style.right = '0';
    (webpartContainer as HTMLElement).style.bottom = '0';
    (webpartContainer as HTMLElement).style.zIndex = '100';
    (webpartContainer as HTMLElement).style.height = '100vh';
    (webpartContainer as HTMLElement).style.width = '100vw';
    (webpartContainer as HTMLElement).style.maxWidth = '100vw';
    (webpartContainer as HTMLElement).style.padding = '0';
    (webpartContainer as HTMLElement).style.margin = '0';
    (webpartContainer as HTMLElement).style.backgroundColor = 'white';
  }
}
```

**CRITICAL:** This manipulates SharePoint's ControlZone, NOT your component.

---

### PART 3: React Lifecycle Integration

**File:** `src/webparts/eSitrep/components/ESitrep.tsx`

```typescript
export default class ESitrep extends React.Component<IESitrepProps, IESitrepState> {
  private propertyService: WebPartPropertyService;

  constructor(props: IESitrepProps) {
    super(props);
    this.state = {
      isFullScreen: props.startInFullScreen || false
    };
    this.propertyService = new WebPartPropertyService();
  }

  public componentDidMount(): void {
    // Apply fullscreen on initial mount
    if (this.state.isFullScreen) {
      this.propertyService.applyFullScreenStyles(true, `.${styles.eSitrep}`);
    }
  }

  public componentDidUpdate(prevProps: IESitrepProps): void {
    // Apply fullscreen when property changes
    if (prevProps.startInFullScreen !== this.props.startInFullScreen) {
      this.setState({ isFullScreen: this.props.startInFullScreen }, () => {
        this.propertyService.applyFullScreenStyles(this.props.startInFullScreen, `.${styles.eSitrep}`);
      });
    }
  }

  public componentWillUnmount(): void {
    // Clean up fullscreen styles
    if (this.state.isFullScreen) {
      this.propertyService.applyFullScreenStyles(false, `.${styles.eSitrep}`);
    }
  }

  private toggleFullScreen = (): void {
    this.setState(prevState => {
      const newIsFullScreen = !prevState.isFullScreen;
      this.propertyService.applyFullScreenStyles(newIsFullScreen, `.${styles.eSitrep}`);
      return { isFullScreen: newIsFullScreen };
    });
  }
}
```

---

## WHY THIS WORKS

1. **CSS** styles YOUR component (`.eSitrep` + `.fullScreenMode`)
2. **JavaScript** styles SHAREPOINT'S container (`.ControlZone`)
3. **React lifecycle** ensures styles apply at the right time

## WHY CSS-ONLY FAILS

- CSS cannot select parent elements
- SharePoint's containers are outside your component's scope
- CSS modules are scoped to your component only
- Global CSS is fragile and breaks across SharePoint versions

## THE CONTROLZONE DASHED BORDER ISSUE

If you see the dashed border, ADD these styles to the webpartContainer:

```typescript
(webpartContainer as HTMLElement).style.border = 'none';
(webpartContainer as HTMLElement).style.outline = 'none';
(webpartContainer as HTMLElement).style.boxShadow = 'none';
```

## EXECUTION ORDER

1. WebPart.onInit() - Set default `startInFullScreen = true`
2. WebPart.render() - Pass `startInFullScreen` to component
3. Component.constructor() - Initialize state with `isFullScreen`
4. Component.componentDidMount() - Apply fullscreen styles via service
5. User clicks toggle - Call `toggleFullScreen()` which updates state and applies styles

## KEY FILES

- `ESitrepWebPart.ts` - Property definition, default value
- `IESitrepProps.ts` - Props interface
- `ESitrep.tsx` - Component with state and lifecycle
- `ESitrep.module.scss` - CSS classes
- `WebPartPropertyService.ts` - DOM manipulation service

