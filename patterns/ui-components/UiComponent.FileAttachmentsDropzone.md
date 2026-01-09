# UI Component - File Attachments Dropzone

**Category:** ui-component  
**Status:** stable  
**Pattern ID:** uicomponent.file-attachments-dropzone

---

## 1. Intent

Provide a **multi-file drag-and-drop upload component** with file list management that works reliably in SPFx environments. Handles both pending files (staged for upload) and existing attachments (already uploaded to SharePoint).

The goal is to:

- Allow users to upload multiple files via drag/drop OR file picker
- Display a list of existing attachments with download/delete actions
- Stage pending files locally before upload on form save
- Handle SPFx-specific iframe limitations gracefully

---

## 2. When to Use

✅ **Use this pattern when:**

- Building document/file attachment functionality for list items
- Need to attach multiple files to a single SharePoint list item
- Want drag/drop file selection in SPFx where react-dropzone fails
- Need to stage files locally before committing on save

❌ **Don't use this pattern when:**

- Uploading single images with preview (use ImageDropzone pattern instead)
- Uploading to document libraries (use Files pattern)
- Files should upload immediately without staging

---

## 3. The Problem

### react-dropzone Fails in SPFx

The popular `react-dropzone` library has issues in SharePoint Framework's iframe environment:

```typescript
// ❌ This often fails silently in SPFx
const { getRootProps, getInputProps } = useDropzone({
  onDrop: (files) => {
    // Never fires when dragging files in SPFx workbench
    console.log('Dropped:', files);
  }
});
```

**Symptoms:**
- Drag events fire but `onDrop` never receives files
- File picker opens but `onChange` doesn't fire after selection
- No errors in console - fails silently

**Root Cause:** SharePoint's iframe security context interferes with react-dropzone's internal event handling.

---

## 4. Solution Architecture

### Fully Native Approach

Bypass react-dropzone entirely and use native browser APIs:

```
┌─────────────────────────────────────────────────────────┐
│ Hidden <input type="file" multiple>                     │
│   - Ref-based access for programmatic click             │
│   - Direct onChange handler for file selection          │
└─────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ Native Drag/Drop Handlers                               │
│   - onDragEnter, onDragLeave, onDragOver, onDrop        │
│   - Work reliably in SPFx iframe                        │
│   - Use drag counter pattern for proper leave detection │
└─────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ Two-List Display                                        │
│   - Existing attachments (from SharePoint)              │
│   - Pending files (staged locally, not yet uploaded)    │
└─────────────────────────────────────────────────────────┘
```

### Key Components

1. **Native file input** - Hidden input with ref for programmatic access
2. **Native drag/drop handlers** - Handle drag events directly on dropzone div
3. **Drag counter ref** - Track dragEnter/dragLeave for child elements
4. **Pending files state** - Files staged for upload (managed by parent)
5. **Existing attachments prop** - Already-uploaded files from SharePoint

---

## 5. Inputs

| Prop | Type | Description |
|------|------|-------------|
| `existingAttachments` | `IAttachment[]` | Attachments already uploaded to SharePoint |
| `pendingFiles` | `IPendingFile[]` | Files staged locally awaiting upload |
| `onFilesAdded` | `(files: File[]) => void` | Callback when new files are dropped/selected |
| `onPendingFileRemoved` | `(id: string) => void` | Callback to remove a pending file |
| `onExistingAttachmentDeleted` | `(fileName: string) => void` | Callback to delete an existing attachment |
| `deletingAttachments` | `string[]` | Filenames currently being deleted (for spinner) |
| `disabled` | `boolean` | Disable all interactions (during save) |

---

## 6. Outputs

- **Visual:** Rectangular dropzone with drag states, file list with icons
- **Data:** File objects passed to parent via `onFilesAdded` callback
- **Behavior:** Drag/drop works in SPFx, file picker works, delete/download actions

---

## 7. Behavior & Rules

### Drag/Drop

- Use drag counter pattern (increment on dragEnter, decrement on dragLeave)
- Only set `isDraggingOver: false` when counter reaches 0
- This handles child element enter/leave events correctly

### File Selection via Click

- Click on dropzone triggers `fileInputRef.current.click()`
- Direct `onChange` handler on hidden input captures selected files
- Reset input value after processing so same file can be selected again

### Pending vs Existing Files

| Aspect | Pending Files | Existing Attachments |
|--------|---------------|---------------------|
| **Source** | User just dropped/selected | Already in SharePoint |
| **Storage** | In-memory File objects | SharePoint attachment URLs |
| **Remove action** | Removes from local state | Calls delete API |
| **Upload timing** | On form save | Already uploaded |

### Delete Behavior

- **Pending files:** Remove immediately from local state (no API call)
- **Existing attachments:** Call delete API immediately (not on save)
- Show spinner on attachment being deleted

### File Icons

Map file extensions to Fluent UI icon names:
- PDF → `PDF`
- DOC/DOCX → `WordDocument`
- XLS/XLSX → `ExcelDocument`
- PPT/PPTX → `PowerPointDocument`
- PNG/JPG/GIF → `Photo2`
- ZIP/RAR → `ZipFolder`
- Default → `Document`

---

## 8. Implementation Checklist

When implementing this pattern:

1. **Create hidden file input**
   - `<input type="file" multiple>` with ref
   - Style with `display: none`
   - Direct `onChange` handler

2. **Create dropzone container**
   - Visual area for drag/drop
   - Click handler triggers file input
   - Drag-active visual state

3. **Implement native drag handlers**
   - `onDragEnter` - increment counter, set dragging state
   - `onDragLeave` - decrement counter, clear state when 0
   - `onDragOver` - prevent default (required for drop)
   - `onDrop` - process files, reset counter

4. **Render file lists**
   - Existing attachments with download link + delete button
   - Pending files with remove button
   - File type icons based on extension

5. **Wire to parent form**
   - Parent manages `pendingFiles` state
   - Parent calls data service on save to upload pending files
   - Parent handles delete confirmation if needed

---

## 9. Complete Implementation

### Interfaces

```typescript
/** Pending file waiting to be uploaded on save */
export interface IPendingFile {
  /** Unique ID for React key */
  id: string;
  /** The actual File object */
  file: File;
  /** Display name */
  name: string;
  /** Size in bytes */
  size: number;
}

/** File attachment metadata from SharePoint */
export interface IAttachment {
  /** Filename (unique within item) */
  fileName: string;
  /** Full URL to download/access the file */
  url: string;
  /** File size in bytes (if available) */
  size?: number;
}
```

### Component: FileAttachmentsDropzone.tsx

```typescript
/**
 * FileAttachmentsDropzone - Multi-file drag and drop with file list display
 * Pattern: UnityFX.FileAttachmentsDropzone
 */
import * as React from 'react';
import { useCallback, useState, useRef } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';
import { IconButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import styles from './FileAttachmentsDropzone.module.scss';

export interface IFileAttachmentsDropzoneProps {
  existingAttachments: IAttachment[];
  pendingFiles: IPendingFile[];
  onFilesAdded: (files: File[]) => void;
  onPendingFileRemoved: (id: string) => void;
  onExistingAttachmentDeleted: (fileName: string) => void;
  deletingAttachments?: string[];
  disabled?: boolean;
}

/** Get Fluent UI icon name based on file extension */
const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf': return 'PDF';
    case 'doc': case 'docx': return 'WordDocument';
    case 'xls': case 'xlsx': return 'ExcelDocument';
    case 'ppt': case 'pptx': return 'PowerPointDocument';
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp': return 'Photo2';
    case 'zip': case 'rar': case '7z': return 'ZipFolder';
    default: return 'Document';
  }
};

/** Format bytes to human-readable size */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const FileAttachmentsDropzone: React.FC<IFileAttachmentsDropzoneProps> = ({
  existingAttachments,
  pendingFiles,
  onFilesAdded,
  onPendingFileRemoved,
  onExistingAttachmentDeleted,
  deletingAttachments = [],
  disabled = false
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    // Convert FileList to array (ES5 compatible)
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [onFilesAdded]);

  // Handle click on dropzone
  const handleDropzoneClick = useCallback((): void => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Native drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleNativeDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounterRef.current = 0;

    if (disabled) return;

    const fileList = e.dataTransfer.files;
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }

    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [disabled, onFilesAdded]);

  const hasFiles = existingAttachments.length > 0 || pendingFiles.length > 0;

  return (
    <div className={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      {/* Dropzone area */}
      <div
        className={`${styles.dropzone} ${isDraggingOver ? styles.dragActive : ''}`}
        onClick={handleDropzoneClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleNativeDrop}
      >
        <Icon iconName={isDraggingOver ? 'CloudUpload' : 'Attach'} />
        <Text>{isDraggingOver ? 'Drop files here' : 'Drag files here or click to browse'}</Text>
      </div>

      {/* File list */}
      {hasFiles && (
        <div className={styles.fileList}>
          {/* Existing attachments */}
          {existingAttachments.map((att) => {
            const isDeleting = deletingAttachments.indexOf(att.fileName) !== -1;
            return (
              <div key={`existing-${att.fileName}`} className={styles.fileItem}>
                <Icon iconName={getFileIcon(att.fileName)} />
                <a href={att.url} target="_blank" rel="noopener noreferrer">
                  {att.fileName}
                </a>
                {isDeleting ? (
                  <Spinner size={SpinnerSize.small} />
                ) : (
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    onClick={() => onExistingAttachmentDeleted(att.fileName)}
                    disabled={disabled}
                  />
                )}
              </div>
            );
          })}

          {/* Pending files */}
          {pendingFiles.map((pf) => (
            <div key={`pending-${pf.id}`} className={styles.fileItem}>
              <Icon iconName={getFileIcon(pf.name)} />
              <Text>{pf.name}</Text>
              <Text className={styles.pending}>(pending)</Text>
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onPendingFileRemoved(pf.id)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 10. Integration with Data Service

### Attachment Methods in Data Service

```typescript
import '@pnp/sp/attachments';

// Get all attachments for an item
public async getAttachments(itemId: number): Promise<IAttachment[]> {
  const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
  const attachments = await item.attachmentFiles();
  
  return attachments.map(att => ({
    fileName: att.FileName,
    url: att.ServerRelativeUrl.indexOf('http') === 0 
      ? att.ServerRelativeUrl 
      : `${window.location.origin}${att.ServerRelativeUrl}`,
    size: undefined // Not available from basic API
  }));
}

// Upload a single attachment
public async uploadAttachment(itemId: number, file: File): Promise<IAttachment> {
  const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await item.attachmentFiles.add(file.name, arrayBuffer);
  
  return {
    fileName: result.data.FileName,
    url: `${window.location.origin}${result.data.ServerRelativeUrl}`,
    size: file.size
  };
}

// Delete an attachment
public async deleteAttachment(itemId: number, fileName: string): Promise<void> {
  const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
  await item.attachmentFiles.getByName(fileName).delete();
}
```

### Parent Component Save Flow

```typescript
private _handleSaveEdit = async (formData: IEditFormState): Promise<void> => {
  // Save the item first
  if (formData.id) {
    await this._dataService.updateItemFromForm(formData.id, formData);
  } else {
    const newItem = await this._dataService.createItemFromForm(formData);
    formData.id = newItem.id;
  }

  // Upload any pending attachments
  if (formData.pendingAttachments && formData.pendingAttachments.length > 0) {
    for (const pending of formData.pendingAttachments) {
      await this._dataService.uploadAttachment(formData.id, pending.file);
    }
  }
};
```

---

## 11. Notes for AI Assistants

- **Never use react-dropzone** in SPFx - it fails silently in iframe context
- **Always use native file input** with ref for click-to-browse functionality
- **Use drag counter pattern** - dragEnter/dragLeave fire for child elements
- **Use `indexOf` not `includes`** - SPFx ES5 target compatibility
- **Convert FileList to array manually** - `Array.from()` not available in ES5
- **Import `@pnp/sp/attachments`** - Required for PnPjs attachment methods
- **Reset input value after selection** - Allows same file to be selected again
- **Pending files are ephemeral** - Only exist in memory until save

---

## 12. Related Patterns

- **UiComponent.ImageDropzone** - Single image upload with circular preview
- **Form.ModalItemEditor** - Parent pattern for forms containing dropzone
- **DataService.PnPjsListRepository** - For attachment service methods

