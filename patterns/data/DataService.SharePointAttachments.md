# Data Service - SharePoint Attachments

**Category:** data-service  
**Status:** stable  
**Pattern ID:** dataservice.sharepoint-attachments

---

## 1. Intent

Extend the PnPjs List Repository pattern with **attachment CRUD operations** for SharePoint list items.

The goal is to:

- Provide a clean API for managing file attachments on list items
- Handle PnPjs attachment API setup and error handling
- Keep attachment logic encapsulated in the data service layer
- Support the FileAttachmentsDropzone UI component pattern

---

## 2. When to Use

✅ **Use this pattern when:**

- Adding file attachment capability to an existing list-based feature
- Need to upload/download/delete files attached to list items
- Building forms that include document attachments
- Using the FileAttachmentsDropzone UI component

❌ **Don't use this pattern when:**

- Storing files in document libraries (use document library APIs instead)
- Files need versioning or check-in/check-out (use document libraries)
- Files exceed SharePoint's attachment size limit (~250MB)

---

## 3. The Problem

### SharePoint List Item Attachments

SharePoint list items can have files attached directly to them. This is simpler than document libraries for small files associated with individual records.

**Considerations:**
- Attachments are stored in a hidden folder per list item
- Each attachment filename must be unique within an item
- No versioning - uploading same filename overwrites
- Size limits apply (~250MB per file)

---

## 4. Solution Architecture

### Service Layer Attachment Methods

Add three methods to your existing PnPjs data service:

```
┌─────────────────────────────────────────────────────────┐
│ getAttachments(itemId)                                  │
│   - Returns array of IAttachment objects                │
│   - Includes filename, URL, optional size               │
└─────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ uploadAttachment(itemId, file)                          │
│   - Converts File to ArrayBuffer                        │
│   - Uploads via PnPjs attachmentFiles.add()             │
│   - Returns IAttachment with URL                        │
└─────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ deleteAttachment(itemId, fileName)                      │
│   - Deletes via PnPjs attachmentFiles.getByName().delete()│
│   - Returns void on success                             │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Inputs

| Method | Parameters | Description |
|--------|------------|-------------|
| `getAttachments` | `itemId: number` | SharePoint list item ID |
| `uploadAttachment` | `itemId: number, file: File` | Item ID and File object from browser |
| `deleteAttachment` | `itemId: number, fileName: string` | Item ID and exact filename to delete |

---

## 6. Outputs

### IAttachment Interface

```typescript
export interface IAttachment {
  /** Filename (unique within item) */
  fileName: string;
  /** Full URL to download/access the file */
  url: string;
  /** File size in bytes (if available) */
  size?: number;
}
```

| Method | Returns | Description |
|--------|---------|-------------|
| `getAttachments` | `Promise<IAttachment[]>` | All attachments for the item |
| `uploadAttachment` | `Promise<IAttachment>` | The newly uploaded attachment metadata |
| `deleteAttachment` | `Promise<void>` | Resolves on success, throws on error |

---

## 7. Behavior & Rules

### Import Requirements

PnPjs requires explicit import for attachment methods:

```typescript
import '@pnp/sp/attachments';
```

Without this import, `attachmentFiles` methods will not be available.

### URL Construction

The `ServerRelativeUrl` returned by PnPjs is relative. Construct absolute URL:

```typescript
const absoluteUrl = att.ServerRelativeUrl.indexOf('http') === 0
  ? att.ServerRelativeUrl
  : `${window.location.origin}${att.ServerRelativeUrl}`;
```

### File Reading

Use `File.arrayBuffer()` to read file content for upload:

```typescript
const arrayBuffer = await file.arrayBuffer();
await item.attachmentFiles.add(file.name, arrayBuffer);
```

### Error Handling

- `getAttachments` - Return empty array if item has no attachments
- `uploadAttachment` - Let errors bubble (duplicate filename, size limit, etc.)
- `deleteAttachment` - Let errors bubble (file not found, permissions, etc.)

### Filename Conflicts

If uploading a file with the same name as existing attachment:
- SharePoint overwrites the existing file
- No error is thrown
- Consider adding timestamp prefix if uniqueness is needed

---

## 8. Implementation Checklist

When implementing this pattern:

1. **Add PnPjs attachment import**
   ```typescript
   import '@pnp/sp/attachments';
   ```

2. **Define IAttachment interface**
   - In your types file alongside other domain models
   - Export for use by UI components

3. **Implement getAttachments**
   - Query `item.attachmentFiles()`
   - Map to IAttachment interface
   - Construct absolute URLs

4. **Implement uploadAttachment**
   - Read file as ArrayBuffer
   - Call `item.attachmentFiles.add()`
   - Return IAttachment with metadata

5. **Implement deleteAttachment**
   - Call `item.attachmentFiles.getByName(fileName).delete()`
   - No return value needed

6. **Add logging**
   - Log method entry, item ID, filename
   - Log success/failure with counts
   - Use existing LoggerService pattern

---

## 9. Complete Implementation

### Add to Existing Data Service

```typescript
import '@pnp/sp/attachments';

// In your data service class...

/**
 * Get all attachments for a list item
 */
public async getAttachments(itemId: number): Promise<IAttachment[]> {
  this.logger.log('getAttachments - itemId:', itemId);

  try {
    const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
    const attachments = await item.attachmentFiles();

    const result: IAttachment[] = attachments.map(att => ({
      fileName: att.FileName,
      url: att.ServerRelativeUrl.indexOf('http') === 0
        ? att.ServerRelativeUrl
        : `${window.location.origin}${att.ServerRelativeUrl}`,
      size: undefined // Size not available from basic API
    }));

    this.logger.log('getAttachments - found', result.length, 'attachments');
    return result;
  } catch (error) {
    this.logger.error('getAttachments - error:', error);
    return [];
  }
}

/**
 * Upload a file as an attachment to a list item
 */
public async uploadAttachment(itemId: number, file: File): Promise<IAttachment> {
  this.logger.log('uploadAttachment - itemId:', itemId, 'fileName:', file.name);

  const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
  const arrayBuffer = await file.arrayBuffer();

  const result = await item.attachmentFiles.add(file.name, arrayBuffer);

  const attachment: IAttachment = {
    fileName: result.data.FileName,
    url: result.data.ServerRelativeUrl.indexOf('http') === 0
      ? result.data.ServerRelativeUrl
      : `${window.location.origin}${result.data.ServerRelativeUrl}`,
    size: file.size
  };

  this.logger.log('uploadAttachment - success:', attachment.fileName);
  return attachment;
}

/**
 * Delete an attachment from a list item
 */
public async deleteAttachment(itemId: number, fileName: string): Promise<void> {
  this.logger.log('deleteAttachment - itemId:', itemId, 'fileName:', fileName);

  const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
  await item.attachmentFiles.getByName(fileName).delete();

  this.logger.log('deleteAttachment - success');
}
```

---

## 10. Integration with UI Components

### Parent Component State

```typescript
interface IState {
  // ... other state
  editModalAttachments: IAttachment[];
  deletingAttachments: string[];
}
```

### Load Attachments on Modal Open

```typescript
private _handleEditClick = async (profile: IProfileCardProps): Promise<void> => {
  const promoItem = this._findPromoItem(profile);
  
  this.setState({
    isEditModalOpen: true,
    selectedPromoItem: promoItem,
    editModalAttachments: [],
    deletingAttachments: []
  });

  // Load attachments for existing items
  if (promoItem && this._dataService) {
    const attachments = await this._dataService.getAttachments(promoItem.id);
    this.setState({ editModalAttachments: attachments });
  }
};
```

### Handle Delete

```typescript
private _handleDeleteAttachment = async (fileName: string): Promise<void> => {
  const { selectedPromoItem } = this.state;
  if (!selectedPromoItem || !this._dataService) return;

  // Show deleting spinner
  this.setState(prev => ({
    deletingAttachments: [...prev.deletingAttachments, fileName]
  }));

  try {
    await this._dataService.deleteAttachment(selectedPromoItem.id, fileName);
    
    // Remove from local state
    this.setState(prev => ({
      editModalAttachments: prev.editModalAttachments.filter(a => a.fileName !== fileName),
      deletingAttachments: prev.deletingAttachments.filter(f => f !== fileName)
    }));
  } catch (error) {
    this._logger.error('Delete attachment failed:', error);
    this.setState(prev => ({
      deletingAttachments: prev.deletingAttachments.filter(f => f !== fileName)
    }));
  }
};
```

### Upload Pending on Save

```typescript
private _handleSaveEdit = async (formData: IEditFormState): Promise<void> => {
  // Save item first (create or update)
  let itemId = formData.id;
  if (itemId) {
    await this._dataService.updateItemFromForm(itemId, formData);
  } else {
    const newItem = await this._dataService.createItemFromForm(formData);
    itemId = newItem.id;
  }

  // Upload pending attachments
  if (formData.pendingAttachments && formData.pendingAttachments.length > 0) {
    for (const pending of formData.pendingAttachments) {
      await this._dataService.uploadAttachment(itemId, pending.file);
    }
  }
};
```

---

## 11. Notes for AI Assistants

- **Always import `@pnp/sp/attachments`** - Methods won't exist without it
- **Attachments require item ID** - Can't attach to items before they're created
- **For new items:** Create item first, then upload attachments in save flow
- **ServerRelativeUrl needs origin prefix** - Construct absolute URL for downloads
- **File.arrayBuffer() is async** - Await it before upload
- **Duplicate filenames overwrite** - No error, just replacement
- **Size limit ~250MB** - Document libraries better for large files

---

## 12. Related Patterns

- **UiComponent.FileAttachmentsDropzone** - UI component that consumes these methods
- **DataService.PnPjsListRepository** - Base pattern this extends
- **Form.ModalItemEditor** - Forms that include attachment functionality

