import React from "react";
import { Form, Input, Button } from "antd";

interface KnowledgeBlockFormProps {
  onSubmit: (values: { name: string }) => void;
}

const KnowledgeBlockForm: React.FC<KnowledgeBlockFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { name: string }) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish}>
      <Form.Item name="name" label="Tên khối kiến thức" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
        <Input placeholder="Nhập tên khối kiến thức" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KnowledgeBlockForm;
