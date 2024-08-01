import { Modal, Input, Form } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState } from "react";

type EditRoleModalProps = {
  isOpen: boolean;
  onSubmit(args: { roleName: string }): void;
  onCancel(): void;
};

export function EditRoleModal(props: EditRoleModalProps) {
  const { isOpen, onSubmit, onCancel } = props;
  const [roleName, setRoleName] = useState("");

  return (
    <Modal
      title="Thêm vị trí"
      open={isOpen}
      onOk={() => onSubmit({ roleName })}
      onCancel={onCancel}
    >
      <Form>
        <FormItem>
          <Input
            placeholder="Tên vị trí"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
