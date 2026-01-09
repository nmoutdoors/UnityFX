# UnityFX Pattern: Security Trimming (Permission-Based UI)

**Pattern ID:** `UFX-SEC-TRIM-001`  
**Category:** Core / Security  
**Status:** ✅ Proven (Extracted from AskTheDirector production implementation)  
**Related Patterns:** `UFX-CORE-LOGGER-001` (LoggerService)

---

## Summary

Implement role-based security trimming in SPFx web parts by checking SharePoint group membership and site permissions. Show/hide UI elements, enable/disable features, filter data by ownership, and control access based on user roles. Includes support for impersonation mode for testing user experiences.

---

## When to Use This Pattern

Use this pattern when you need to:
- **Show/hide admin-only UI elements** (edit buttons, delete actions, advanced settings)
- **Control feature access** based on SharePoint group membership
- **Filter data by ownership** (users see only their own records based on Person fields)
- **Support multiple permission tiers** (e.g., site admins, power users, regular users)
- **Test user experiences** without switching accounts (impersonation mode)
- **Gracefully degrade** when permission checks fail (fail-safe to deny access)

---

## Core Concepts

### Permission Hierarchy

1. **Site Administrators** - Users with `SPPermission.manageWeb` or in "Site Owners" group
2. **Custom Groups** - Application-specific groups (e.g., "Chief of Staff Team Members")
3. **Combined Permissions** - Logical OR of multiple permission checks
4. **Impersonation Mode** - Temporary override for testing (admin-only feature)

### Security Principles

- **Fail-safe**: Always deny access on errors
- **Client-side only**: This is UI trimming, not server-side security
- **Graceful degradation**: App remains functional with reduced features
- **Transparent logging**: Console logs for debugging permission issues

---

## Implementation Components

### 1. PermissionChecker Utility Class

**Location:** `src/utils/PermissionChecker.ts`

**Purpose:** Centralized permission checking logic with reusable methods.

**Key Methods:**
- `checkGroupMembership(context, groupName)` - Generic group membership check
- `isSiteAdmin(context)` - Check for site administrator permissions
- `hasAdminPermissions(context)` - Combined permission check (customizable)
- Custom role methods (e.g., `isCoSTeamMember()`, `isPowerUser()`)

**API Endpoint Used:**
```
/_api/web/sitegroups/getByName('{groupName}')/Users?$filter=Title eq '{userName}'
```

**SPPermission Check:**
```typescript
context.pageContext.web.permissions?.hasPermission(SPPermission.manageWeb)
```

---

## Step-by-Step Implementation

### Step 1: Create PermissionChecker Utility

Create `src/utils/PermissionChecker.ts` with the following structure:

```typescript
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPPermission } from '@microsoft/sp-page-context';

export interface IPermissionCheckResult {
  isGroupMember: boolean;
  error?: string;
}

export class PermissionChecker {
  // Core method: Check SharePoint group membership
  public static async checkGroupMembership(
    context: WebPartContext,
    groupName: string
  ): Promise<IPermissionCheckResult>
  
  // Check for site admin permissions
  public static async isSiteAdmin(
    context: WebPartContext
  ): Promise<IPermissionCheckResult>
  
  // Add custom role checks as needed
  public static async hasAdminPermissions(
    context: WebPartContext
  ): Promise<IPermissionCheckResult>
}
```

**See:** Full implementation in `Ask-The-Director/src/webparts/askTheDirector/utils/PermissionChecker.ts`

---

### Step 2: Add Permission State to Component

Add permission-related state properties to your component's state interface:

```typescript
interface IYourComponentState {
  // Permission state
  isSiteAdmin: boolean;
  hasAdminPermissions: boolean;
  
  // Optional: Impersonation support
  isImpersonating: boolean;
  impersonatedUser: string;
  
  // ... other state properties
}
```

Initialize in constructor:
```typescript
this.state = {
  isSiteAdmin: false,
  hasAdminPermissions: false,
  isImpersonating: false,
  impersonatedUser: '',
  // ... other initial state
};
```

---

### Step 3: Check Permissions on Component Mount

```typescript
public componentDidMount(): void {
  // Check user permissions
  this.checkUserPermissions()
    .catch(error => {
      console.error('Error checking user permissions:', error);
    });
  
  // ... other initialization
}

private checkUserPermissions = async (): Promise<void> => {
  try {
    // Check for site admin status
    const adminResult = await PermissionChecker.isSiteAdmin(this.props.context);
    
    // Check for combined admin permissions
    const combinedResult = await PermissionChecker.hasAdminPermissions(this.props.context);
    
    // Update state with permission results
    this.setState({ 
      isSiteAdmin: adminResult.isGroupMember,
      hasAdminPermissions: combinedResult.isGroupMember
    });
    
    // Log results for debugging
    console.log('Permission check results:', {
      isSiteAdmin: adminResult.isGroupMember,
      hasAdminPermissions: combinedResult.isGroupMember
    });
  } catch (error) {
    console.error('Unexpected error checking permissions:', error);
    // Fail-safe: deny all permissions on error
    this.setState({ 
      isSiteAdmin: false,
      hasAdminPermissions: false
    });
  }
}
```

---

### Step 4: Add Effective Permissions Method (Optional - for Impersonation)

If supporting impersonation mode for testing:

```typescript
private getEffectivePermissions = (): {
  isSiteAdmin: boolean;
  hasAdminPermissions: boolean;
} => {
  // If impersonating, return false for all admin permissions
  if (this.state.isImpersonating) {
    return {
      isSiteAdmin: false,
      hasAdminPermissions: false
    };
  }

  // Otherwise return actual permissions
  return {
    isSiteAdmin: this.state.isSiteAdmin,
    hasAdminPermissions: this.state.hasAdminPermissions
  };
}
```

---

### Step 5: Apply Security Trimming in UI

Use conditional rendering to show/hide UI elements based on permissions:

#### Example 1: Conditional Button
```tsx
{this.getEffectivePermissions().hasAdminPermissions && (
  <IconButton
    iconProps={{ iconName: 'Edit' }}
    onClick={this.handleEdit}
    title="Edit item"
  />
)}
```

#### Example 2: Conditional Table Column
```tsx
<thead>
  <tr>
    <th>Title</th>
    <th>Description</th>
    {this.getEffectivePermissions().hasAdminPermissions && (
      <th>Actions</th>
    )}
  </tr>
</thead>
```

#### Example 3: Conditional Modal Section
```tsx
{this.getEffectivePermissions().hasAdminPermissions && (
  <Stack.Item>
    <TextField
      label="Admin Notes"
      value={this.state.adminNotes}
      onChange={(e, value) => this.setState({ adminNotes: value })}
    />
  </Stack.Item>
)}
```

---

## Advanced Features

### Impersonation Mode

Allow admins to test the user experience without admin privileges:

```typescript
private handleImpersonateClick = (): void => {
  this.setState(prevState => ({
    isImpersonating: !prevState.isImpersonating,
    impersonatedUser: prevState.isImpersonating ? '' : 'Test User'
  }));
}
```

#### UI Approach 1: Separate Banner (Original)
```tsx
{this.state.isImpersonating && (
  <div className={styles.impersonationBanner}>
    <div className={styles.impersonationContent}>
      <i className="ms-Icon ms-Icon--Contact" aria-hidden="true" />
      <span>Impersonating: {this.state.impersonatedUser}</span>
    </div>
    <IconButton
      iconProps={{ iconName: 'Cancel' }}
      title="Stop impersonating"
      onClick={this.handleImpersonateClick}
    />
  </div>
)}
```

#### UI Approach 2: Inline Badge (Recommended - from Promos)

A simpler approach integrates the impersonation indicator into the existing user display:

```tsx
// In toolbar user display area
<div className={styles.currentUserDisplay}>
  <Icon iconName="Contact" className={styles.currentUserIcon} />
  <Text className={styles.currentUserName}>{currentUserName}</Text>
  {isAdmin && !isImpersonating && <Text className={styles.adminBadge}>(Admin)</Text>}
  {isAdmin && isImpersonating && <Text className={styles.impersonatingBadge}>(Impersonating)</Text>}
</div>

// Admin-only impersonate button with contextual icons
{isAdmin && onImpersonateToggle && (
  <IconButton
    iconProps={{ iconName: isImpersonating ? 'UserRemove' : 'ContactInfo' }}
    title={isImpersonating ? 'Stop impersonating (view as admin)' : 'Impersonate regular user'}
    onClick={onImpersonateToggle}
    className={isImpersonating ? styles.impersonateButtonActive : undefined}
  />
)}
```

**Icon Recommendations:**
- `ContactInfo` - Enter impersonation mode
- `UserRemove` - Exit impersonation mode
- Alternative: `Contact` / `Cancel`

#### Impersonation CSS Styling

```scss
// Pulsing badge for visibility
.impersonatingBadge {
  font-size: 12px;
  color: #d83b01; // Orange to distinguish from admin badge
  font-weight: 600;
  margin-left: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

// Active button state
.impersonateButtonActive {
  background-color: rgba(216, 59, 1, 0.1) !important;

  i {
    color: #d83b01 !important;
  }
}
```

---

### Security-Trimmed Data Filtering

When users should only see their own records (based on Person field ownership), apply client-side filtering:

```typescript
/**
 * Apply security trimming to data items
 * - Admins see all records (unless impersonating)
 * - Regular users see records where they are the owner/assignee
 */
private _applySecurityFilter(items: IMyItem[]): IMyItem[] {
  const { securityContext, isImpersonating } = this.state;

  // If security context not loaded yet, show nothing (fail-safe)
  if (!securityContext) {
    return [];
  }

  // Get effective permissions (respects impersonation mode)
  const effectivePermissions = this._getEffectivePermissions();

  // Admins see all records (unless impersonating)
  if (effectivePermissions.isAdmin) {
    return items;
  }

  // Regular users see records where they are the owner OR assignee
  const currentUserId = securityContext.currentUser.id;
  return items.filter(item => {
    const isOwner = item.owner?.id === currentUserId;
    const isAssignee = item.assignedTo?.id === currentUserId;
    return isOwner || isAssignee;
  });
}
```

**Key Points:**
- Uses SharePoint User ID (numeric) for comparison, not email or login name
- Supports multiple ownership fields (e.g., owner AND assignee)
- Respects impersonation mode via `_getEffectivePermissions()`
- Fail-safe: returns empty array if security context not loaded

---

### User Identity for Person Fields

When comparing current user against Person field values, you need the **SharePoint User ID** (numeric). This is NOT available in the standard `pageContext.user` object.

#### Getting the SharePoint User ID

```typescript
public getCurrentUser(): ICurrentUser {
  const user = this.context.pageContext.user;

  // Get user ID from legacyPageContext (SharePoint site-specific User ID)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legacyContext = this.context.pageContext.legacyPageContext as any;
  const userId = legacyContext?.userId || 0;

  return {
    id: userId,           // Numeric SharePoint User ID (e.g., 6, 12, 45)
    loginName: user.loginName,
    displayName: user.displayName,
    email: user.email
  };
}
```

**Why `legacyPageContext`?**
- `pageContext.user` contains Azure AD info but NOT the SharePoint site-specific User ID
- `legacyPageContext.userId` contains the numeric User ID used in Person field lookups
- This ID is site-specific (same user may have different IDs on different sites)

#### Related: PeoplePicker `ensureUser` Requirement

When using PeoplePicker controls to select users for Person fields, you **must** set `ensureUser={true}`:

```tsx
<PeoplePicker
  context={this.props.context}
  titleText="Assigned To"
  personSelectionLimit={1}
  ensureUser={true}  // CRITICAL: Returns SharePoint User ID instead of Azure AD ID
  defaultSelectedUsers={[existingUser?.email || '']}
  onChange={this.handleAssigneeChange}
/>
```

Without `ensureUser={true}`, the PeoplePicker returns Azure AD identifiers that cannot be written to SharePoint Person fields.

---

### Consolidated Security Context (Alternative Pattern)

Instead of separate state properties, use a consolidated `ISecurityContext` object when you need to:
- Pass security info to child components
- Include user identity for data filtering
- Simplify state management

```typescript
/** Current user information */
export interface ICurrentUser {
  id: number;           // SharePoint User ID (from legacyPageContext)
  loginName: string;
  displayName: string;
  email: string;
}

/** Consolidated security context */
export interface ISecurityContext {
  currentUser: ICurrentUser;
  isAdmin: boolean;
  // Add more permission flags as needed
}

// In component state
interface IMyComponentState {
  securityContext: ISecurityContext | undefined;
  isImpersonating: boolean;
  // ... other state
}

// Effective permissions respects impersonation
private _getEffectivePermissions(): { isAdmin: boolean } {
  if (this.state.isImpersonating) {
    return { isAdmin: false };
  }
  return { isAdmin: this.state.securityContext?.isAdmin ?? false };
}
```

**When to use consolidated context:**
- Data filtering requires current user ID
- Multiple components need security info
- Complex permission hierarchies

**When to use separate state properties:**
- Simple UI trimming only
- No data-level filtering needed
- Minimal permission checks

---

## Configuration

### Required SharePoint Groups

Create these groups in SharePoint (or customize for your needs):

1. **"Site Owners"** - Standard SharePoint site administrators
2. **Custom Groups** - Application-specific groups (e.g., "Chief of Staff Team Members", "Power Users")

**Note:** The web part will function without these groups, but some features may be limited.

---

## Behavior & Rules

### ✅ DO

- **Always check permissions on component mount**
- **Use `getEffectivePermissions()` for all UI checks** (respects impersonation)
- **Log permission check results** for debugging
- **Fail-safe to deny access** on errors
- **Use meaningful group names** that reflect business roles
- **Document required groups** in README or deployment guide

### ❌ DON'T

- **Don't rely on client-side checks for security** - This is UI trimming only
- **Don't expose sensitive data** to unauthorized users (server-side validation required)
- **Don't forget error handling** - Always catch permission check failures
- **Don't hardcode group names** in multiple places - Use constants or config
- **Don't skip logging** - Console logs are essential for troubleshooting

---

## Implementation Checklist

### Core Security Trimming
- [ ] Create `PermissionChecker.ts` or `PermissionService.ts` utility class
- [ ] Add permission state properties to component state interface
- [ ] Initialize permission state in constructor (default to `false`)
- [ ] Call `checkUserPermissions()` in `componentDidMount()`
- [ ] Add error handling with fail-safe behavior
- [ ] Implement `getEffectivePermissions()` method (if using impersonation)
- [ ] Apply conditional rendering to admin-only UI elements
- [ ] Add console logging for debugging
- [ ] Document required SharePoint groups
- [ ] Test with different user roles
- [ ] Test impersonation mode (if implemented)
- [ ] Verify fail-safe behavior (disconnect network, test errors)

### Data Filtering (if needed)
- [ ] Implement `getCurrentUser()` with `legacyPageContext.userId`
- [ ] Create `ISecurityContext` with `currentUser` and `isAdmin`
- [ ] Implement `_applySecurityFilter()` for ownership-based filtering
- [ ] Ensure PeoplePickers use `ensureUser={true}`
- [ ] Test that regular users only see their own records
- [ ] Test that admins see all records
- [ ] Test impersonation filters admin to their own records

### Impersonation UI (if implemented)
- [ ] Add impersonate button (admin-only visibility)
- [ ] Add impersonating badge/indicator
- [ ] Style impersonation indicator with distinct color (orange recommended)
- [ ] Use contextual icons (ContactInfo/UserRemove)
- [ ] Test toggle on/off behavior

---

## Testing Scenarios

### UI Trimming
1. **Site Administrator** - Should see all admin features (edit buttons, settings, etc.)
2. **Custom Group Member** - Should see group-specific features
3. **Regular User** - Should see only public features (read-only UI)
4. **Permission Check Failure** - Should gracefully deny access (fail-safe)
5. **Group Doesn't Exist** - Should handle error and deny access

### Data Filtering (when implemented)
6. **Admin User** - Should see all records in the list
7. **Record Owner** - Should see records where they are the owner (Person field match)
8. **Record Assignee** - Should see records where they are assigned (if applicable)
9. **Non-Owner User** - Should NOT see records owned by others
10. **New Record** - Person field should save with correct User ID

### Impersonation Mode
11. **Enter Impersonation** - Click button, badge changes to "(Impersonating)"
12. **Data Filtering in Impersonation** - Admin should only see their own records
13. **UI Trimming in Impersonation** - Admin-only buttons should be hidden
14. **Exit Impersonation** - Click button again, returns to full admin view

---

## Example Usage

### Scenario: Dashboard with Admin Controls

```typescript
// Component state
interface IDashboardState {
  items: IItem[];
  isSiteAdmin: boolean;
  hasAdminPermissions: boolean;
  isImpersonating: boolean;
}

// Permission check on mount
public componentDidMount(): void {
  this.checkUserPermissions().catch(console.error);
  this.loadItems();
}

// Render with security trimming
public render(): React.ReactElement {
  const permissions = this.getEffectivePermissions();

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Admin-only toolbar */}
      {permissions.hasAdminPermissions && (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton text="Add Item" onClick={this.handleAdd} />
          <DefaultButton text="Settings" onClick={this.handleSettings} />
          <IconButton
            iconProps={{ iconName: 'Contact' }}
            title="Impersonate"
            onClick={this.handleImpersonateClick}
          />
        </Stack>
      )}

      {/* Data grid with conditional edit column */}
      <DetailsList
        items={this.state.items}
        columns={this.getColumns(permissions)}
      />
    </div>
  );
}

private getColumns(permissions: IPermissions): IColumn[] {
  const columns: IColumn[] = [
    { key: 'title', name: 'Title', fieldName: 'title' },
    { key: 'description', name: 'Description', fieldName: 'description' }
  ];

  if (permissions.hasAdminPermissions) {
    columns.push({
      key: 'actions',
      name: 'Actions',
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: 'Edit' }}
          onClick={() => this.handleEdit(item)}
        />
      )
    });
  }

  return columns;
}
```

---

## Notes for AI Assistants

### When Implementing This Pattern

1. **Copy the PermissionChecker utility** from `Ask-The-Director/src/webparts/askTheDirector/utils/PermissionChecker.ts`
2. **Customize group names** to match the application's business roles
3. **Add permission state** to the component's state interface
4. **Call permission checks** in `componentDidMount()`
5. **Use `getEffectivePermissions()`** for all UI conditional rendering
6. **Add impersonation support** if the app has admin users who need to test UX

### Common Customizations

- **Multiple permission tiers**: Add more state properties (e.g., `isPowerUser`, `isViewer`)
- **Custom group checks**: Add methods like `isPowerUser()`, `isReportViewer()`
- **Combined permissions**: Customize `hasAdminPermissions()` logic
- **Caching**: Store permission results in session storage to reduce API calls

### Integration with Other Patterns

- **LoggerService** (`UFX-CORE-LOGGER-001`): Use logger for permission check results
- **Feature Modules** (`UFX-FEATURE-MODULE-001`): Each feature can have its own permission requirements
- **Data Services**: Combine with server-side validation for true security
- **Person Field Integration**: When using Person fields for ownership filtering, see the "User Identity for Person Fields" section above

---

## References

- **Production Implementation (AskTheDirector):** `Ask-The-Director/src/webparts/askTheDirector/utils/PermissionChecker.ts`
- **Production Implementation (Promos):** `Promos/src/webparts/promos/services/PermissionService.ts`
- **Component Integration (AskTheDirector):** `Ask-The-Director/src/webparts/askTheDirector/components/AskTheDirector.tsx`
- **Component Integration (Promos):** `Promos/src/webparts/promos/components/Promos.tsx`
- **SharePoint REST API:** `/_api/web/sitegroups/getByName('{groupName}')/Users`
- **SPPermission Enum:** `@microsoft/sp-page-context`
- **Legacy Page Context:** `context.pageContext.legacyPageContext.userId` for SharePoint User ID

---

## Version History

- **v1.1** (2025-12-22) - Enhanced with lessons learned from Promos implementation
  - Added: Security-trimmed data filtering section
  - Added: User Identity for Person Fields section (legacyPageContext.userId)
  - Added: Consolidated ISecurityContext alternative pattern
  - Enhanced: Impersonation UI with inline badge approach and CSS styling
  - Enhanced: Contextual icon recommendations for impersonate button
  - Added: PeoplePicker `ensureUser={true}` requirement for Person fields
  - Added: Promos as second production reference
- **v1.0** (2025-12-22) - Initial pattern extracted from AskTheDirector production implementation
  - Includes: PermissionChecker utility, component integration, impersonation mode, fail-safe behavior
