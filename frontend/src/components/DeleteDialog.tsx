import { Modal, Button } from "react-bootstrap";

interface DeleteDialogProps {
  show: boolean;
  entityType: "User" | "DegreeCourse" | "DegreeCourseApplication";
  entityId: string;
  entityName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog = ({
  show,
  entityType,
  entityId,
  entityName,
  onConfirm,
  onCancel,
}: DeleteDialogProps) => {
  // Generate the correct ID according to requirements:
  // DeleteDialogUser{userID}, DeleteDialogDegreeCourse{id}, etc.
  const dialogId = `DeleteDialog${entityType}${entityId}`;

  return (
    <Modal id={dialogId} show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {entityName}?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {entityName}?</Modal.Body>
      <Modal.Footer>
        <Button
          id="DeleteDialogCancelButton"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          id="DeleteDialogConfirmButton"
          variant="danger"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteDialog;
