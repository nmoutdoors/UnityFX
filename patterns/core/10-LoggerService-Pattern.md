# LoggerService Pattern (v1.0)

> **Status:** ✅ Proven  
> **ID:** UFX-CORE-LOGGER-001  
> **Category:** Core / Diagnostics

The LoggerService Pattern provides a two-tier, configurable console logging system for SPFx applications. It enables meaningful debugging output that can be toggled via webpart properties without code changes.

---

## Problem

SPFx webparts often need console logging for debugging, but:

- **Logs pollute production** - Development logs shouldn't appear in production
- **No control without code changes** - Toggling logs requires redeployment
- **Noisy debug output** - Detailed trace logs drown out meaningful messages
- **Inconsistent usage** - Scattered `console.log` calls are hard to manage
- **Performance overhead** - Even suppressed logs can impact performance if not handled correctly

Users need:

- **Administrator control** - Toggle logging via property pane
- **Two-tier output** - Standard logs vs. verbose debugging
- **Zero overhead when disabled** - No-op calls when logging is off
- **Consistent formatting** - Prefixed output for easy filtering

---

## Goals

1. **Two-Tier Logging**
   - Standard tier (log, warn, error): For outcomes and milestones
   - Verbose tier (debug): For implementation details and tracing

2. **Property Pane Control**
   - Enable Console Logging toggle (standard tier)
   - Enable Verbose Logging toggle (debug tier, requires standard enabled)

3. **Minimal Performance Impact**
   - No-op calls when disabled
   - No object evaluation when logging is off

4. **Consistent Developer Experience**
   - Prefixed output for filtering in DevTools
   - React Context for component access
   - Constructor injection for services

---

## Log Level Guidelines

| Level | Use For | Audience | Examples |
|-------|---------|----------|----------|
| **log** | Outcomes, milestones | Support person, admin | "Loaded 30 items", "Save successful" |
| **warn** | Recoverable issues | Admin, developer | "Cache miss", "Fallback used" |
| **error** | Failures | Everyone | "API error", "Validation failed" |
| **debug** | Implementation details | Developer only | "dragEnter counter: 2", "formState:" |

### Simple Rule of Thumb

> **log** = "Would a support person find this useful?"  
> **debug** = "Would only a developer tracing this specific code need this?"

**When in doubt, use `log`.** Use `debug` when output would be noisy or fires frequently.

---

## Structure

### Files

```
services/
  LoggerService.ts         # Core service class

context/
  LoggerContext.tsx        # React context provider and hook
```

### Key Interfaces

```typescript
export interface ILoggerConfig {
  /** Whether logging is enabled (log, warn, error) */
  enabled: boolean;
  /** Whether verbose/debug logging is enabled (requires enabled=true) */
  verbose?: boolean;
  /** Prefix for all log messages (e.g., 'MyWebpart') */
  prefix?: string;
}

export class LoggerService {
  constructor(config: ILoggerConfig);
  
  log(...args: unknown[]): void;    // Standard tier
  warn(...args: unknown[]): void;   // Standard tier
  error(...args: unknown[]): void;  // Standard tier
  debug(...args: unknown[]): void;  // Verbose tier (requires both flags)
}
```

---

## Behavior

| Console Logging | Verbose Logging | Output |
|-----------------|-----------------|--------|
| Off | Off | Nothing |
| On | Off | log, warn, error |
| Off | On | Nothing (verbose requires logging enabled) |
| On | On | log, warn, error, debug |

---

## Implementation

### 1. LoggerService Class

```typescript
export class LoggerService {
  private enabled: boolean;
  private verbose: boolean;
  private prefix: string;

  constructor(config: ILoggerConfig) {
    this.enabled = config.enabled;
    this.verbose = config.verbose ?? false;
    this.prefix = config.prefix ? `[${config.prefix}]` : '';
  }

  public debug(...args: unknown[]): void {
    if (!this.enabled || !this.verbose) return;
    console.log(this.prefix, ...args);
  }

  public log(...args: unknown[]): void {
    if (!this.enabled) return;
    console.log(this.prefix, ...args);
  }

  public warn(...args: unknown[]): void {
    if (!this.enabled) return;
    console.warn(this.prefix, ...args);
  }

  public error(...args: unknown[]): void {
    if (!this.enabled) return;
    console.error(this.prefix, ...args);
  }
}
```

### 2. React Context Provider

```typescript
export const LoggerProvider: React.FC<ILoggerProviderProps> = ({
  children, enabled, verbose = false, prefix = 'App'
}) => {
  const logger = useMemo(
    () => new LoggerService({ enabled, verbose, prefix }),
    [enabled, verbose, prefix]
  );
  return (
    <LoggerContext.Provider value={{ logger }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = (): LoggerService => {
  const context = useContext(LoggerContext);
  if (!context) {
    return new LoggerService({ enabled: false, verbose: false });
  }
  return context.logger;
};
```

### 3. Webpart Properties

```typescript
// Webpart properties interface
export interface IMyWebPartProps {
  // ... other props
  enableConsoleLogging: boolean;
  enableVerboseLogging: boolean;
}

// Property pane configuration
{
  groupName: 'Developer Settings',
  groupFields: [
    PropertyPaneToggle('enableConsoleLogging', {
      label: 'Enable Console Logging',
      onText: 'Enabled',
      offText: 'Disabled'
    }),
    PropertyPaneLabel('loggingWarning', {
      text: '⚠️ Console logging may degrade performance. Enable for debugging only.'
    }),
    PropertyPaneToggle('enableVerboseLogging', {
      label: 'Enable Verbose Logging',
      onText: 'Enabled',
      offText: 'Disabled',
      disabled: !this.properties.enableConsoleLogging
    }),
    PropertyPaneLabel('verboseWarning', {
      text: '⚠️ Verbose logging is very noisy. Use only when tracing specific issues.'
    })
  ]
}
```

### 4. Wiring It Up

```typescript
// Root component wrapper
<LoggerProvider
  enabled={props.enableConsoleLogging}
  verbose={props.enableVerboseLogging}
  prefix="MyWebpart"
>
  <App {...props} />
</LoggerProvider>

// In functional components
const MyComponent: React.FC = () => {
  const logger = useLogger();

  useEffect(() => {
    logger.log('Component mounted');
    logger.debug('Initial state:', someState);
  }, []);
};

// In services (constructor injection)
export class MyDataService {
  private logger: LoggerService;

  constructor(sp: SPFI, logger?: LoggerService) {
    this.logger = logger || new LoggerService({ enabled: false, verbose: false });
  }

  async loadItems(): Promise<Item[]> {
    this.logger.log('Loading items...');
    const items = await this.sp.web.lists...;
    this.logger.log('Loaded', items.length, 'items');
    this.logger.debug('Raw items:', items);
    return items;
  }
}
```

---

## Dependencies

| Library | Purpose | Required |
|---------|---------|----------|
| React | Context provider | ✅ Yes |
| @fluentui/react | PropertyPaneToggle | ✅ Yes |

---

## Checklist: Implementation

- [ ] LoggerService class with two-tier support
- [ ] LoggerContext with Provider and useLogger hook
- [ ] Webpart properties: enableConsoleLogging, enableVerboseLogging
- [ ] Property pane toggles with warning labels
- [ ] Verbose toggle disabled when logging is off
- [ ] Logger passed to services via constructor
- [ ] All console.log calls replaced with logger methods

## Checklist: Usage Guidelines

- [ ] Use `log` for outcomes and milestones
- [ ] Use `debug` for noisy/frequent output
- [ ] Use `warn` for recoverable issues
- [ ] Use `error` for failures
- [ ] When in doubt, use `log`
- [ ] Prefix identifies component/service in DevTools

---

## Related Patterns

- [Feature Module Pattern](./05-Feature-Module-Pattern.md) - LoggerService is a cross-cutting service
- [UnityFX Principles](./00-UnityFX-Principles.md) - Separation of Concerns (services handle logging)

---

**The Secret Sauce:** Two tiers of logging give administrators and developers the control they need. Standard logging for troubleshooting, verbose for deep debugging - both controllable without code changes. 🔧