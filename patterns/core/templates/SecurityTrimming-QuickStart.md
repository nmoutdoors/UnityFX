# Security Trimming Pattern - Quick Start Guide

**Pattern ID:** `UFX-SEC-TRIM-001`  
**Full Documentation:** `patterns/core/15-Security-Trimming-Pattern.md`

---

## 5-Minute Implementation

### Step 1: Copy the PermissionChecker Utility

Copy `patterns/core/templates/PermissionChecker.ts` to your project:

```bash
# From your project root
cp unityfx/patterns/core/templates/PermissionChecker.ts src/utils/PermissionChecker.ts
```

### Step 2: Customize Group Names

Edit `src/utils/PermissionChecker.ts` and customize the `hasAdminPermissions()` method:

```typescript
public static async hasAdminPermissions(
  context: WebPartContext
): Promise<IPermissionCheckResult> {
  try {
    // Check if user is a site admin
    const siteAdminResult = await this.isSiteAdmin(context);
    if (siteAdminResult.isGroupMember) {
      return { isGroupMember: true };
    }
    
    // CUSTOMIZE: Replace with your group name
    return await this.checkGroupMembership(context, 'Your Admin Group Name');
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return { isGroupMember: false, error: error.message };
  }
}
```

### Step 3: Add Permission State to Component

```typescript
import { PermissionChecker } from '../utils/PermissionChecker';

interface IYourComponentState {
  // ... other state
  isSiteAdmin: boolean;
  hasAdminPermissions: boolean;
}

constructor(props: IYourProps) {
  super(props);
  this.state = {
    // ... other initial state
    isSiteAdmin: false,
    hasAdminPermissions: false
  };
}
```

### Step 4: Check Permissions on Mount

```typescript
public componentDidMount(): void {
  this.checkUserPermissions().catch(console.error);
  // ... other initialization
}

private checkUserPermissions = async (): Promise<void> => {
  try {
    const adminResult = await PermissionChecker.isSiteAdmin(this.props.context);
    const combinedResult = await PermissionChecker.hasAdminPermissions(this.props.context);
    
    this.setState({ 
      isSiteAdmin: adminResult.isGroupMember,
      hasAdminPermissions: combinedResult.isGroupMember
    });
    
    console.log('Permission check results:', {
      isSiteAdmin: adminResult.isGroupMember,
      hasAdminPermissions: combinedResult.isGroupMember
    });
  } catch (error) {
    console.error('Unexpected error checking permissions:', error);
    this.setState({ 
      isSiteAdmin: false,
      hasAdminPermissions: false
    });
  }
}
```

### Step 5: Apply Security Trimming in UI

```tsx
public render(): React.ReactElement {
  return (
    <div>
      <h1>My Dashboard</h1>
      
      {/* Admin-only button */}
      {this.state.hasAdminPermissions && (
        <PrimaryButton 
          text="Admin Settings" 
          onClick={this.handleSettings} 
        />
      )}
      
      {/* Regular content */}
      <div>Content visible to all users</div>
    </div>
  );
}
```

---

## Common Patterns

### Conditional Edit Buttons

```tsx
{this.state.hasAdminPermissions && (
  <IconButton
    iconProps={{ iconName: 'Edit' }}
    onClick={() => this.handleEdit(item)}
    title="Edit item"
  />
)}
```

### Conditional Table Columns

```tsx
<thead>
  <tr>
    <th>Title</th>
    <th>Description</th>
    {this.state.hasAdminPermissions && <th>Actions</th>}
  </tr>
</thead>
<tbody>
  {items.map(item => (
    <tr key={item.id}>
      <td>{item.title}</td>
      <td>{item.description}</td>
      {this.state.hasAdminPermissions && (
        <td>
          <IconButton iconProps={{ iconName: 'Edit' }} />
        </td>
      )}
    </tr>
  ))}
</tbody>
```

### Conditional Form Fields

```tsx
<Stack tokens={{ childrenGap: 10 }}>
  <TextField label="Title" value={title} onChange={...} />
  <TextField label="Description" value={description} onChange={...} />
  
  {this.state.hasAdminPermissions && (
    <TextField 
      label="Admin Notes" 
      value={adminNotes} 
      onChange={...} 
    />
  )}
</Stack>
```

---

## SharePoint Group Setup

Create these groups in SharePoint Site Settings > People and Groups:

1. **"Site Owners"** - Already exists (standard SharePoint group)
2. **"Your Admin Group Name"** - Create custom group for your app

Add users to the appropriate groups to grant permissions.

---

## Testing Checklist

- [ ] Site admin sees all admin features
- [ ] Custom group member sees group-specific features
- [ ] Regular user sees only public features
- [ ] Permission check errors are handled gracefully
- [ ] Console logs show permission check results

---

## Next Steps

For advanced features like impersonation mode, see the full pattern documentation:
`patterns/core/15-Security-Trimming-Pattern.md`

