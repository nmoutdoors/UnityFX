# 📜 Version History Pattern

## Overview

The **Version History Pattern** provides a reusable approach for displaying SharePoint list item version history and enabling users to restore previous versions. This pattern leverages SharePoint's built-in versioning system while providing a custom, user-friendly interface that integrates seamlessly with SPFx webparts.

## What Makes It Effective

### The Dual Excellence
1. **Functional Excellence**: Tracks all field changes across versions with accurate restore capability
2. **User Experience Excellence**: Clean, intuitive interface that clearly shows what changed and when

## Core Problem

Traditional SharePoint version history has limitations:
- **Native UI is separate** - Users must leave the application context
- **Field changes unclear** - Difficult to see exactly what changed between versions
- **Restore is hidden** - Native restore functionality is not obvious
- **No integration** - Cannot embed in custom modals or forms
- **Technical field names** - Shows internal names instead of friendly labels

Users need:
- **In-context viewing** - See version history without leaving the edit form
- **Clear change tracking** - Understand exactly what changed between versions
- **Easy restore** - One-click restore with confirmation
- **Friendly display** - Human-readable field names and formatted values
- **Filtered changes** - Show only user-relevant fields, not system metadata

## Solution Architecture

### The Version History Approach

```
Edit Modal → Version History Button → Modal with Version List → Change Details → Restore Confirmation → Update Item
```

### Key Components

1. **VersionHistoryModal Component**
   - Displays list of all versions with metadata
   - Shows expandable change details per version
   - Provides restore button with confirmation dialog
   - Handles loading and error states

2. **Version Comparison Logic**
   - Compares each version to its predecessor
   - Filters to user-relevant fields only
   - Formats values for human readability
   - Handles null/undefined values gracefully

3. **Restore Functionality**
   - Copies field values from target version
   - Handles all field types (text, choice, date, lookup)
   - Properly clears fields that were empty in target version
   - Creates new version with restored data

4. **Data Service Methods**
   - `getVersionHistory(itemId)` - Fetches all versions with metadata
   - `restoreVersion(itemId, versionId)` - Restores to specific version
   - `getUserRelevantFieldNames()` - Whitelist of trackable fields

## Technical Implementation

### 1. Version History Modal Structure

```typescript
interface IVersionHistoryModalProps {
  isOpen: boolean;
  itemId: number;
  itemTitle: string;
  onClose: () => void;
  onRestore: () => void;  // Callback after successful restore
  dataService: IPromoDataService;
}

interface IVersionHistoryModalState {
  versions: IVersionInfo[];
  isLoading: boolean;
  error: string | null;
  expandedVersions: Set<number>;
  restoreConfirmVersion: IVersionInfo | null;
  isRestoring: boolean;
  restoreError: string | null;
}
```

### 2. Fetching Version History

```typescript
public async getVersionHistory(itemId: number): Promise<IVersionInfo[]> {
  const versions = await this.sp.web.lists
    .getByTitle(this.listName)
    .items.getById(itemId)
    .versions();

  return versions.map((v, index, arr) => {
    const previousVersion = arr[index + 1];
    const changes = this.compareVersions(v, previousVersion);

    return {
      versionId: v.VersionId,
      versionLabel: v.VersionLabel,
      created: new Date(v.Created),
      createdBy: v.Editor?.LookupValue || 'Unknown',
      changes: changes
    };
  });
}
```

### 3. Comparing Versions for Changes

```typescript
private compareVersions(
  current: any,
  previous: any | undefined
): IFieldChange[] {
  const changes: IFieldChange[] = [];
  const userFields = this.getUserRelevantFieldNames();

  for (const fieldName of userFields) {
    const currentValue = current[fieldName];
    const previousValue = previous ? previous[fieldName] : undefined;

    // Normalize for comparison
    const currentNorm = this.normalizeValue(currentValue);
    const previousNorm = this.normalizeValue(previousValue);

    if (currentNorm !== previousNorm) {
      changes.push({
        fieldName: this.getFieldDisplayName(fieldName),
        oldValue: this.formatDisplayValue(previousValue),
        newValue: this.formatDisplayValue(currentValue)
      });
    }
  }

  return changes;
}
```

### 4. Field Whitelist Pattern

**Critical for User Experience**

Only track fields that users care about - exclude system metadata:

```typescript
private getUserRelevantFieldNames(): string[] {
  return [
    // Basic Info
    'Title', 'Position', 'Service', 'Rank', 'Branch',
    // Dates
    'StartDate', 'EndDate', 'LastThroughDate',
    // Status fields
    'Status', 'Approved', 'Archived',
    // Comments
    'Comments', 'Notes', 'Description',
    // ... all other user-editable fields
  ];
}
```

**Why This Matters:**
- Excludes system fields (Modified, Created, ContentType, etc.)
- Excludes computed fields that users don't edit
- Focuses on meaningful changes users want to track
- Reduces noise in version comparison

### 5. Restore Version Logic

**The Key Challenge: SharePoint List Items Don't Have restoreByLabel**

Unlike document libraries, SharePoint list items don't have a direct `restoreByLabel` REST API. The solution is to copy field values from the target version:

```typescript
public async restoreVersion(itemId: number, versionId: number): Promise<void> {
  // Get all versions to find the target
  const versions = await this.sp.web.lists
    .getByTitle(this.listName)
    .items.getById(itemId)
    .versions();

  const targetVersion = versions.find(v => v.VersionId === versionId);
  if (!targetVersion) {
    throw new Error('Version not found');
  }

  // Build update object from target version
  const updateData: Record<string, any> = {};
  const userFields = this.getUserRelevantFieldNames();

  for (const fieldName of userFields) {
    const value = targetVersion[fieldName];

    // Handle lookup/user fields
    if (value?.LookupId !== undefined) {
      updateData[fieldName + 'Id'] = value.LookupId;
    } else if (typeof value === 'object' && value !== null) {
      continue; // Skip complex objects that aren't lookups
    } else {
      // CRITICAL: Include null/undefined to clear fields
      updateData[fieldName] = value === undefined ? null : value;
    }
  }

  // Update the item (creates new version with restored data)
  await this.sp.web.lists
    .getByTitle(this.listName)
    .items.getById(itemId)
    .update(updateData);
}
```

**Critical Implementation Details:**
- Must include ALL fields from whitelist, not just non-empty ones
- Set `null` for undefined values to properly clear fields
- Handle lookup fields with `Id` suffix
- Skip complex objects that aren't lookups


### 6. Modal UI Implementation

**Version List with Expandable Details**

```tsx
<DetailsList
  items={versions}
  columns={[
    { key: 'version', name: 'Version', fieldName: 'versionLabel' },
    { key: 'date', name: 'Date', onRender: (item) => formatDate(item.created) },
    { key: 'user', name: 'Modified By', fieldName: 'createdBy' },
    { key: 'changes', name: 'Changes', onRender: (item) => (
      <span className={styles.changeCount}>
        {item.changes.length} field(s) changed
      </span>
    )},
    { key: 'actions', name: '', onRender: (item, index) => (
      index > 0 && (
        <IconButton
          iconProps={{ iconName: 'History' }}
          title="Restore this version"
          onClick={() => setRestoreConfirmVersion(item)}
        />
      )
    )}
  ]}
  onItemInvoked={(item) => toggleExpanded(item.versionId)}
/>

{/* Expanded change details */}
{expandedVersions.has(version.versionId) && (
  <div className={styles.changeDetails}>
    {version.changes.map((change, i) => (
      <div key={i} className={styles.changeRow}>
        <span className={styles.fieldName}>{change.fieldName}:</span>
        <span className={styles.oldValue}>{change.oldValue || '(empty)'}</span>
        <Icon iconName="Forward" />
        <span className={styles.newValue}>{change.newValue || '(empty)'}</span>
      </div>
    ))}
  </div>
)}
```

### 7. Restore Confirmation Dialog

**Always Confirm Before Restore**

```tsx
<Dialog
  hidden={!restoreConfirmVersion}
  dialogContentProps={{
    type: DialogType.normal,
    title: 'Restore Version',
    subText: `Are you sure you want to restore to version ${restoreConfirmVersion?.versionLabel}? This will create a new version with the restored data.`
  }}
>
  <DialogFooter>
    <PrimaryButton
      text={isRestoring ? 'Restoring...' : 'Restore'}
      onClick={handleRestore}
      disabled={isRestoring}
    />
    <DefaultButton
      text="Cancel"
      onClick={() => setRestoreConfirmVersion(null)}
      disabled={isRestoring}
    />
  </DialogFooter>
</Dialog>
```

### 8. Integration with Edit Modal

**Add Version History Button to Edit Form**

```tsx
// In EditModalContent.tsx footer
<DefaultButton
  text="Version History"
  iconProps={{ iconName: 'History' }}
  onClick={() => onVersionHistoryClick(item.Id)}
  disabled={!item.Id}  // Only for existing items
/>

// In parent component
{showVersionHistory && (
  <VersionHistoryModal
    isOpen={showVersionHistory}
    itemId={selectedItemId}
    itemTitle={selectedItem?.Title || ''}
    onClose={() => setShowVersionHistory(false)}
    onRestore={() => {
      setShowVersionHistory(false);
      refreshData();  // Reload item data after restore
    }}
    dataService={dataService}
  />
)}
```

## Best Practices

### 1. Field Whitelist Management

**Always:**
- Include ALL user-editable fields in the whitelist
- Use exact SharePoint internal field names
- Update whitelist when adding new fields to forms
- Document field mappings for maintenance

**Avoid:**
- Tracking system fields (Modified, Created, etc.)
- Hardcoding display names (use a mapping function)
- Forgetting to update whitelist with new fields

### 2. Restore Implementation

**Always:**
- Include null/undefined values to clear fields
- Handle lookup fields with `Id` suffix
- Show confirmation dialog before restore
- Refresh data after successful restore
- Log restore operations for debugging

**Avoid:**
- Skipping empty/null values (breaks restore to blank state)
- Using `restoreByLabel` API (doesn't exist for list items)
- Restoring without user confirmation
- Silent failures without error messages

### 3. User Experience

**Always:**
- Show loading states during operations
- Display clear error messages
- Indicate which version is current (cannot restore)
- Show change count before expanding details
- Format dates and values for readability

**Avoid:**
- Allowing restore of current version
- Showing technical field names
- Hiding errors from users
- Long loading times without feedback

## Common Pitfalls and Solutions

### Pitfall 1: Fields Not Restoring

**Problem:** Some fields don't restore to their previous values

**Solution:** Ensure the field is in the whitelist with exact internal name:
```typescript
// Wrong
'LastAssignmentStart'  // Field doesn't exist

// Correct
'lastAssignmentDates'  // Actual SharePoint field name
```

### Pitfall 2: Empty Fields Not Clearing

**Problem:** Restoring to a version where fields were blank doesn't clear them

**Solution:** Include null values in update object:
```typescript
// Wrong - skips empty values
if (value) {
  updateData[fieldName] = value;
}

// Correct - includes null to clear fields
updateData[fieldName] = value === undefined ? null : value;
```

### Pitfall 3: Lookup Fields Fail

**Problem:** User/lookup fields throw errors on restore

**Solution:** Use the `Id` suffix for lookup fields:
```typescript
if (value?.LookupId !== undefined) {
  updateData[fieldName + 'Id'] = value.LookupId;
}
```

### Pitfall 4: restoreByLabel Returns 404

**Problem:** Trying to use SharePoint's `restoreByLabel` API fails

**Solution:** SharePoint list items don't have this API - use field copy approach instead

## Testing Checklist

### Functional Testing
- [ ] Version history loads for existing items
- [ ] All versions display with correct metadata
- [ ] Change details expand/collapse correctly
- [ ] Field changes show before/after values
- [ ] Restore confirmation dialog appears
- [ ] Restore updates item correctly
- [ ] All field types restore properly (text, choice, date, lookup)
- [ ] Empty fields restore to blank
- [ ] Data refreshes after restore
- [ ] Error states display correctly

### Edge Cases
- [ ] Item with only one version (no restore button)
- [ ] Item with many versions (performance)
- [ ] Fields with null/undefined values
- [ ] Lookup fields with deleted users
- [ ] Long text fields display properly
- [ ] Date fields format correctly

## Success Metrics

### User Experience
- Users can view version history without leaving context
- Changes between versions are immediately clear
- Restore operation completes successfully
- No confusion about what will be restored

### Technical Metrics
- Version history loads in < 2 seconds
- Restore operation completes in < 3 seconds
- Zero data loss during restore
- All field types handled correctly

## Dependencies

### Required Libraries

```json
{
  "dependencies": {
    "@pnp/sp": "^4.x",
    "@fluentui/react": "^8.x",
    "react": "^17.x"
  }
}
```

### SharePoint Requirements
- List versioning must be enabled
- User must have edit permissions for restore
- PnPjs v4 for REST API calls

## Related Documentation

- [Legendary Print Pattern](legendary-print-pattern.md)
- [BigCal List Detection and Validation System](BigCal-List-Detection-and-Validation-System.md)

---

## Summary

The **Version History Pattern** provides a complete solution for viewing and restoring SharePoint list item versions within SPFx webparts. Key elements:

1. **Field Whitelist** - Track only user-relevant fields
2. **Version Comparison** - Show exactly what changed between versions
3. **Copy-Based Restore** - Work around missing `restoreByLabel` API
4. **Null Value Handling** - Properly clear fields when restoring to blank state
5. **Confirmation Dialog** - Prevent accidental restores

**The Secret Sauce:**
- Use field whitelist to filter noise
- Copy ALL fields including nulls for proper restore
- Handle lookup fields with `Id` suffix
- Always confirm before restore

This pattern has been proven in production and handles the edge cases that trip up naive implementations. 📜

