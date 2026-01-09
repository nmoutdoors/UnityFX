# UI Component - Image Dropzone

**Category:** ui-component
**Status:** stable
**Pattern ID:** uicomponent.image-dropzone

---

## 1. Intent

Provide a **drag-and-drop image upload component** with circular preview that works reliably in SPFx environments. Solves the common problem of react-dropzone failing in SharePoint's iframe context.

The goal is to:

- Allow users to upload images via drag/drop OR file picker
- Show a circular preview with hover overlay for change/delete
- Store the File object for later upload as SharePoint attachment
- Handle SPFx-specific iframe limitations gracefully

---

## 2. When to Use

✅ **Use this pattern when:**

- Building profile photo or avatar upload functionality
- Creating any circular image picker in a form
- Need drag/drop in SPFx where react-dropzone fails
- Want to upload images as SharePoint list item attachments

❌ **Don't use this pattern when:**

- Uploading to a document library (use Files pattern instead)
- Need multi-file uploads (extend pattern or use different approach)
- Non-image file uploads (modify accepted types)

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
- File picker works, but only sometimes
- No errors in console - fails silently

**Root Cause:** SharePoint's iframe security context interferes with react-dropzone's internal event handling.

---

## 4. Solution Architecture

### Hybrid Approach

Use react-dropzone for file dialog (clicking) but implement native drag/drop handlers:

```
┌─────────────────────────────────────────────────────────┐
│ react-dropzone                                           │
│   - noDrag: true (disable its drag handling)             │
│   - Handles file dialog only (clicking to browse)        │
└────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ Native Drag/Drop Handlers                                │
│   - onDragEnter, onDragLeave, onDragOver, onDrop         │
│   - Work reliably in SPFx iframe                         │
│   - Use drag counter pattern for proper leave detection   │
└────────────────────────────────────────────────────────┘
                          +
┌─────────────────────────────────────────────────────────┐
│ Enhanced Input onChange                                  │
│   - Direct handler on <input> for file picker            │
│   - Bypasses react-dropzone's internal onChange          │
└────────────────────────────────────────────────────────┘
```

### Key Components

1. **Native drag/drop handlers** - Handle drag events directly
2. **Drag counter ref** - Track dragEnter/dragLeave for child elements
3. **File type validation** - Check MIME types manually
4. **Blob URL for preview** - Create temporary preview
5. **File object for upload** - Pass to parent for SharePoint attachment upload

---

## 5. Inputs

| Prop | Type | Description |
|------|------|-------------|
| `currentImageUrl` | `string \| undefined` | Current image URL to display (from SharePoint) |
| `onImageChange` | `(url: string \| undefined, file?: File) => void` | Callback with blob URL (preview) and File (upload) |

---

## 6. Outputs

- **Visual:** Circular dropzone with drag states and hover overlay
- **Data:** Blob URL for immediate preview + File object for later upload
- **Behavior:** Drag/drop works in SPFx, file picker works, delete clears both

---

## 7. Behavior & Rules

### Drag/Drop

- Use drag counter pattern (increment on dragEnter, decrement on dragLeave)
- Only set `isDragging: false` when counter reaches 0
- This handles child element enter/leave events correctly

### File Validation

- Check MIME type against accepted list: `['image/png', 'image/jpeg', 'image/gif', 'image/webp']`
- Use `indexOf` instead of `includes` (SPFx ES5 target)
- Reject non-image files silently (or show error message)

### Preview URL

- Create blob URL with `URL.createObjectURL(file)`
- Blob URLs are temporary - only valid for current session
- Never save blob URLs to SharePoint - they won't work on reload

### Delete Behavior

- Call `onImageChange(undefined, undefined)` to clear both URL and file
- Parent should set field to empty string `{ Url: '' }` for SharePoint hyperlink field

---

## 8. Implementation Checklist

When implementing this pattern:

1. **Create the dropzone component**
   - Circular container with border/background
   - Drag-active visual state (border color, icon change)
   - Image preview when file selected
   - Hover overlay with change/delete actions

2. **Implement native drag handlers**
   - `onDragEnter` - increment counter, set dragging state
   - `onDragLeave` - decrement counter, clear state when 0
   - `onDragOver` - prevent default (required for drop)
   - `onDrop` - process file, reset counter

3. **Configure react-dropzone**
   - Set `noDrag: true` to disable its drag handling
   - Keep `noClick: false` for file dialog
   - Set accepted types

4. **Wire up file input onChange**
   - Add direct handler that bypasses react-dropzone
   - Call same file processing function as drop handler

5. **Pass File object to parent**
   - `onImageChange(blobUrl, file)` - both values
   - Parent stores file in form state
   - On save, upload file as attachment

---

## 9. Complete Implementation

### Component: ProfileImageDropzone.tsx

```typescript
/**
 * ProfileImageDropzone - Drag and drop image upload with circular preview
 * Pattern: UnityFX.ImageDropzone
 */
import * as React from 'react';
import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';
import styles from './ProfileImageDropzone.module.scss';

// Accepted image MIME types
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

export interface IProfileImageDropzoneProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | undefined, file?: File) => void;
}

export const ProfileImageDropzone: React.FC<IProfileImageDropzoneProps> = ({
  currentImageUrl,
  onImageChange
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [isHovering, setIsHovering] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounterRef = useRef(0);

  // Validate file is an accepted image type
  const isValidImageFile = useCallback((file: File): boolean => {
    return ACCEPTED_TYPES.indexOf(file.type) !== -1;
  }, []);

  // Process a dropped/selected file
  const processFile = useCallback((file: File): void => {
    if (!isValidImageFile(file)) {
      console.log('[ImageDropzone] File rejected - invalid type:', file.type);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageChange(objectUrl, file);
  }, [isValidImageFile, onImageChange]);

  // Native drag/drop handlers for SPFx compatibility
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  // react-dropzone for file dialog only
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
    noClick: false,
    noDrag: true  // Disable react-dropzone drag - we handle it natively
  });

  // Direct handler for file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const inputProps = getInputProps();
  const enhancedInputProps = {
    ...inputProps,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputProps.onChange) {
        (inputProps.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
      }
      handleInputChange(e);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(undefined);
    onImageChange(undefined, undefined);
  };

  const hasImage = !!previewUrl;

  return (
    <div
      {...getRootProps()}
      className={`${styles.dropzone} ${isDraggingOver ? styles.dragActive : ''} ${hasImage ? styles.hasImage : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleNativeDrop}
    >
      <input {...enhancedInputProps} />

      {hasImage ? (
        <div className={styles.previewContainer}>
          <div className={styles.imageWrapper}>
            <img src={previewUrl} alt="Profile" className={styles.previewImage} />
          </div>
          {isHovering && (
            <div className={styles.hoverOverlay}>
              <Icon iconName="Camera" className={styles.overlayIcon} />
              <Text className={styles.overlayText}>Change Photo</Text>
              <button className={styles.removeButton} onClick={handleRemoveImage} title="Remove photo">
                <Icon iconName="Delete" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.iconCircle}>
            <Icon iconName={isDraggingOver ? 'CloudUpload' : 'Contact'} className={styles.uploadIcon} />
          </div>
          <Text className={styles.instructionText}>
            {isDraggingOver ? 'Drop image here' : 'Drag photo here'}
          </Text>
          <Text className={styles.subText}>or click to browse</Text>
        </div>
      )}
    </div>
  );
};
```

---

## 10. SCSS Styles

```scss
// ProfileImageDropzone.module.scss
.dropzone {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: #0078d4;
  }

  &.dragActive {
    border-color: #0078d4;
    background-color: rgba(0, 120, 212, 0.1);
  }

  &.hasImage {
    border-style: solid;
  }
}

.previewContainer {
  width: 100%;
  height: 100%;
  position: relative;
}

.imageWrapper {
  width: 100%;
  height: 100%;
}

.previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hoverOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.overlayIcon {
  font-size: 24px;
  margin-bottom: 8px;
}

.overlayText {
  font-size: 12px;
}

.removeButton {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 0, 0, 1);
  }
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
}

.iconCircle {
  margin-bottom: 8px;
}

.uploadIcon {
  font-size: 32px;
  color: #666;
}

.instructionText {
  font-size: 12px;
  color: #333;
}

.subText {
  font-size: 10px;
  color: #666;
}
```

---

## 11. Integration with Data Service

### Upload as List Item Attachment

```typescript
// In PromoDataService.ts (or your data service)
import '@pnp/sp/attachments';

public async uploadProfileImage(itemId: number, file: File): Promise<string> {
  // Generate unique filename
  const timestamp = new Date().getTime();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `profile_${timestamp}_${safeFileName}`;

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Get the item reference
  const item = this.sp.web.lists.getByTitle(LIST_NAME).items.getById(itemId);

  // Upload as attachment
  await item.attachmentFiles.add(fileName, arrayBuffer);

  // Get the web URL to construct the attachment path
  const webInfo = await this.sp.web.select('Url')();
  const attachmentUrl = `${webInfo.Url}/Lists/${LIST_NAME}/Attachments/${itemId}/${fileName}`;

  return attachmentUrl;
}
```

### Save Flow in Parent Component

```typescript
// In main component save handler
private _handleSaveEdit = async (formData: IEditFormState): Promise<void> => {
  // For existing items
  if (formData.id) {
    // If there's a pending image file, upload it first
    if (formData.pendingImageFile) {
      const imageUrl = await this._dataService.uploadProfileImage(
        formData.id,
        formData.pendingImageFile
      );
      // Update the form data with the real URL
      formData.profileImageUrl = imageUrl;
    }
    // Save the item with the real URL
    await this._dataService.updateItemFromForm(formData.id, formData);
  } else {
    // For new items: create first to get ID, then upload
    const newItem = await this._dataService.createItemFromForm(formData);
    if (formData.pendingImageFile && newItem.id) {
      const imageUrl = await this._dataService.uploadProfileImage(
        newItem.id,
        formData.pendingImageFile
      );
      await this._dataService.updateItemFromForm(newItem.id, {
        ...formData,
        profileImageUrl: imageUrl
      });
    }
  }
};
```

### Clearing Hyperlink Fields

```typescript
// In mapFormToSPItem - handle clearing the URL
RateeProfileImage: formData.profileImageUrl && formData.profileImageUrl.indexOf('blob:') !== 0
  ? { Url: formData.profileImageUrl }
  : { Url: '' }  // Empty string clears the hyperlink field
```

---

## 12. Notes for AI Assistants

- **Always use native drag handlers** in SPFx - react-dropzone's drag handling fails in iframe
- **Use drag counter pattern** - dragEnter/dragLeave fire for child elements
- **Pass both blob URL and File** - URL for preview, File for upload
- **Never persist blob URLs** - they're session-only
- **Use `indexOf` not `includes`** - SPFx ES5 target compatibility
- **Import `@pnp/sp/attachments`** - Required for PnPjs attachment methods
- **Empty string clears hyperlink** - `{ Url: '' }` works for SharePoint hyperlink fields

---

## 13. Related Patterns

- **Form.ModalItemEditor** - Parent pattern for forms containing dropzone
- **DataService.PnPjsListRepository** - For attachment upload methods
- **PropertyPane.CustomControls** - Similar custom component integration pattern

