import React from "react";
import { Form, Input, InputNumber, Button, Modal, Select } from "antd";
import { questionBank, knowledgeBlocks } from "@/models/TH2/questionBank";

interface SubjectFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newSubjects: any[]) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const { code, name, credits, knowledgeBlockId } = values;
    const updatedSubjects = questionBank.addSubject(code, name, credits, knowledgeBlockId);
    onSubmit(updatedSubjects);
    form.resetFields();
  };

  return (
    <Modal title="Thêm môn học" visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Mã môn" name="code" rules={[{ required: true, message: "Nhập mã môn!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tên môn" name="name" rules={[{ required: true, message: "Nhập tên môn!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số tín chỉ" name="credits" rules={[{ required: true, message: "Nhập số tín chỉ!" }]}>
          <InputNumber min={1} max={10} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Khối kiến thức" name="knowledgeBlockId" rules={[{ required: true, message: "Chọn khối kiến thức!" }]}>
          <Select>
            {knowledgeBlocks.map((block) => (
              <Select.Option key={block.id} value={block.id}>
                {block.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm môn học
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;
