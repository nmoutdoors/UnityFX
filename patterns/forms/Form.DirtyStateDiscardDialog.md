# Form - Dirty State / Unsaved Changes Dialog

**Category:** form  
**Status:** stable  
**Pattern ID:** form.dirty-state-discard-dialog

---

## 1. Intent

Prevent users from accidentally losing unsaved changes when closing a modal or navigating away. Provides a **consistent UX pattern** for detecting dirty state and prompting users to confirm before discarding changes.

The goal is to:

- Detect when a form has been modified from its initial state
- Intercept all dismiss attempts (Cancel button, X button, click outside modal)
- Show a confirmation dialog before discarding unsaved changes
- Support multiple pending actions (e.g., cancel vs. navigate to another view)

---

## 2. When to Use

Use this pattern when:

- Building modal-based edit forms where data loss is a concern
- Users can dismiss the modal via multiple paths (X button, Cancel, click outside)
- The form has state that takes effort to enter (multi-field forms, file uploads)
- Navigating away would trigger a different action (e.g., open another modal)

Do NOT use this pattern when:

- The form is trivial (single field, quick input)
- Changes are auto-saved
- The modal is read-only (view mode)

---

## 3. The Problem

### Multiple Dismiss Paths

A modal can be closed in several ways:
1. **Cancel button** - User explicitly cancels
2. **X button** - User clicks the modal close icon
3. **Click outside** - User clicks the overlay/backdrop
4. **ESC key** - User presses Escape (handled by modal)
5. **Navigation action** - User clicks a link that opens another view

Without coordination, each path would need its own dirty check, leading to duplicated logic or missed cases.

### Parent-Child Coordination

The modal shell (parent) handles some dismiss events, but the form content (child) owns the dirty state. They must coordinate.

---

## 4. Solution Architecture

### The dismissAttempt Pattern

Parent signals a dismiss attempt via prop; child checks dirty state and responds:

1. User clicks X or outside modal - Parent sets dismissAttempt = true
2. Child useEffect detects dismissAttempt:
   - If NOT dirty: call onCancel() immediately
   - If dirty: show discard confirmation dialog
   - Call onDismissAttemptHandled() to reset flag
3. User responds to dialog:
   - Discard: call onCancel() to close modal
   - Keep Editing: close dialog, stay in modal

---

## 5. Inputs

### Props for Form Component

| Prop | Type | Description |
|------|------|-------------|
| onCancel | () => void | Called to close the modal (actual close) |
| dismissAttempt | boolean | When true, parent is requesting a close |
| onDismissAttemptHandled | () => void | Called after handling the dismiss attempt |

### Optional Props (for multiple actions)

| Prop | Type | Description |
|------|------|-------------|
| onNavigateToX | () => void | Called when user confirms navigation to X |

---

## 6. Outputs

- **Visual:** Confirmation dialog with Keep Editing and Discard buttons
- **Behavior:** All dismiss paths respect dirty state
- **UX:** Consistent experience regardless of how user attempts to leave


---

## 7. Behavior and Rules

### Dirty Detection

Compare current form state to initial state using JSON serialization:

`	ypescript
// Store initial state on mount
const initialStateRef = useRef<string>(JSON.stringify(initFormState(item)));

// Check if form has changed
const isDirty = useCallback((): boolean => {
  const current = JSON.stringify(formState);
  return current !== initialStateRef.current;
}, [formState]);
`

**Tip:** Exclude non-serializable values (File objects) from comparison:

`	ypescript
const currentForCompare = { ...formState, pendingImageFile: undefined };
`

### Reset Initial State

When the source item changes, reset the initial state reference:

`	ypescript
useEffect(() => {
  initialStateRef.current = JSON.stringify(initFormState(item));
  setShowDiscardConfirm(false);
}, [item]);
`

### Handle Dismiss Attempt

`	ypescript
useEffect(() => {
  if (dismissAttempt) {
    if (isDirty()) {
      setShowDiscardConfirm(true);
    } else {
      onCancel();
    }
    onDismissAttemptHandled?.();
  }
}, [dismissAttempt, isDirty, onCancel, onDismissAttemptHandled]);
`

### Handle Cancel Button

`	ypescript
const handleCancelClick = (): void => {
  if (isDirty()) {
    setShowDiscardConfirm(true);
  } else {
    onCancel();
  }
};
`

---

## 8. Implementation Checklist

When implementing this pattern:

1. **Add state for discard dialog visibility**
   `	ypescript
   const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);
   `

2. **Add ref for initial state comparison**
   `	ypescript
   const initialStateRef = useRef<string>(JSON.stringify(initFormState(item)));
   `

3. **Create isDirty function**
   - Compare current state to initial state
   - Exclude non-serializable fields

4. **Add useEffect for dismissAttempt prop**
   - Check dirty state
   - Show dialog or close immediately
   - Reset the dismissAttempt flag

5. **Wire up Cancel button to handleCancelClick**
   - Not directly to onCancel

6. **Add the Dialog component**
   - Title: Discard changes?
   - Subtext: You have unsaved changes...
   - Buttons: Keep Editing, Discard

7. **Update parent component**
   - Add dismissAttempt state
   - Pass dismissAttempt and onDismissAttemptHandled props
   - ModalShell onDismiss sets dismissAttempt = true


---

## 9. Complete Implementation

### Parent Component (State Management)

`	ypescript
interface IState {
  isEditModalOpen: boolean;
  editModalDismissAttempt: boolean;
  // ... other state
}

// Initial state
this.state = {
  isEditModalOpen: false,
  editModalDismissAttempt: false
};

// Called when user clicks outside modal or X button
private _handleEditModalDismiss = (): void => {
  this.setState({ editModalDismissAttempt: true });
};

// Called by child after handling dismiss attempt
private _handleEditModalDismissAttemptHandled = (): void => {
  this.setState({ editModalDismissAttempt: false });
};

// Called to actually close the modal
private _closeEditModal = (): void => {
  this.setState({
    isEditModalOpen: false,
    editModalDismissAttempt: false
  });
};

// In render:
<ModalShell
  isOpen={this.state.isEditModalOpen}
  onDismiss={this._handleEditModalDismiss}  // NOT _closeEditModal
>
  <EditModalContent
    onCancel={this._closeEditModal}
    dismissAttempt={this.state.editModalDismissAttempt}
    onDismissAttemptHandled={this._handleEditModalDismissAttemptHandled}
  />
</ModalShell>
`

### Child Component (Form with Dirty Check)

`	ypescript
interface IFormProps {
  item: IItem;
  onSave: (data: IFormState) => void;
  onCancel: () => void;
  dismissAttempt?: boolean;
  onDismissAttemptHandled?: () => void;
}

const EditForm: React.FC<IFormProps> = ({
  item,
  onSave,
  onCancel,
  dismissAttempt,
  onDismissAttemptHandled
}) => {
  const [formState, setFormState] = useState<IFormState>(() => initFormState(item));
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);
  
  // Store initial state for dirty comparison
  const initialStateRef = useRef<string>(JSON.stringify(initFormState(item)));
  
  // Check if form has been modified
  const isDirty = useCallback((): boolean => {
    const current = JSON.stringify(formState);
    return current !== initialStateRef.current;
  }, [formState]);
  
  // Reset when item changes
  useEffect(() => {
    initialStateRef.current = JSON.stringify(initFormState(item));
    setShowDiscardConfirm(false);
  }, [item]);
  
  // Handle dismiss attempt from parent
  useEffect(() => {
    if (dismissAttempt) {
      if (isDirty()) {
        setShowDiscardConfirm(true);
      } else {
        onCancel();
      }
      onDismissAttemptHandled?.();
    }
  }, [dismissAttempt, isDirty, onCancel, onDismissAttemptHandled]);
  
  // Handle Cancel button click
  const handleCancelClick = (): void => {
    if (isDirty()) {
      setShowDiscardConfirm(true);
    } else {
      onCancel();
    }
  };
  
  // Handle discard confirmation
  const handleDiscardConfirm = (): void => {
    setShowDiscardConfirm(false);
    onCancel();
  };
  
  const handleDiscardCancel = (): void => {
    setShowDiscardConfirm(false);
  };
  
  return (
    <div>
      {/* Form fields here */}
      
      <DefaultButton text="Cancel" onClick={handleCancelClick} />
      <PrimaryButton text="Save" onClick={handleSave} />
      
      {/* Discard Confirmation Dialog */}
      <Dialog
        hidden={!showDiscardConfirm}
        onDismiss={handleDiscardCancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Discard changes?',
          subText: 'You have unsaved changes. Are you sure you want to discard them?'
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 400 } }
        }}
      >
        <DialogFooter>
          <DefaultButton onClick={handleDiscardCancel} text="Keep Editing" />
          <PrimaryButton onClick={handleDiscardConfirm} text="Discard" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
`


---

## 10. Advanced: Multiple Pending Actions

When the form has multiple exit paths (e.g., Cancel vs. Navigate to Rankings), track which action is pending:

`	ypescript
// Track pending action for after discard confirmation
const [pendingAction, setPendingAction] = useState<'cancel' | 'ranking'>('cancel');

// Handle Edit Rankings link click (admin only)
const handleEditRankingsClick = (): void => {
  if (isDirty()) {
    setPendingAction('ranking');
    setShowDiscardConfirm(true);
  } else {
    onNavigateToRanking?.();
  }
};

// Handle Cancel button click
const handleCancelClick = (): void => {
  if (isDirty()) {
    setPendingAction('cancel');
    setShowDiscardConfirm(true);
  } else {
    onCancel();
  }
};

// Handle discard confirmation - executes pending action
const handleDiscardConfirm = (): void => {
  setShowDiscardConfirm(false);
  if (pendingAction === 'ranking') {
    onNavigateToRanking?.();
  } else {
    onCancel();
  }
};
`

---

## 11. Visual Indicator (Optional)

Show users they have unsaved changes in the UI:

`	ypescript
// In header or status area
{hasChanges && (
  <span className={styles.unsavedIndicator}>(unsaved changes)</span>
)}
`

`scss
.unsavedIndicator {
  color: #d83b01;  // Orange/red warning color
  font-weight: 600;
}
`

---

## 12. Notes for AI Assistants

- **Always use the dismissAttempt pattern** for modal forms with dirty state
- **JSON.stringify comparison** works well for most form states
- **Exclude File objects** from serialization (they don't compare correctly)
- **Reset initial state ref** when the source item changes
- **Call onDismissAttemptHandled** immediately after checking dirty state
- **Use isBlocking: true** on the dialog to prevent clicking outside to dismiss
- **Button order matters**: Keep Editing (secondary) first, Discard (primary) second

---

## 13. Related Patterns

- **Form.ModalItemEditor** - Parent pattern for modal-based editing
- **UiShell.FullscreenLite** - Modal shell that triggers dismiss events
- **DataService.PnPjsListRepository** - For save operations

