import React from "react";
import { Select, Form } from "antd";

const { Option } = Select;

interface Props {
  subjects: { id: number; name: string }[];
  onFilter: (subjectId: number | null, difficulty: string | null) => void;
}

const QuestionFilterForm: React.FC<Props> = ({ subjects, onFilter }) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    const values = form.getFieldsValue();
    onFilter(values.subjectId || null, values.difficulty || null);
  };

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{ subjectId: null, difficulty: null }}
    >
      <Form.Item label="Chọn môn" name="subjectId">
        <Select
          style={{ width: 200 }}
          onChange={handleFilter}
          allowClear
          placeholder="Chọn môn học"
        >
          {subjects.map((subject) => (
            <Option key={subject.id} value={subject.id}>
              {subject.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Chọn độ khó" name="difficulty">
        <Select
          style={{ width: 150 }}
          onChange={handleFilter}
          allowClear
          placeholder="Chọn độ khó"
        >
          <Option value="Dễ">Dễ</Option>
          <Option value="Trung bình">Trung bình</Option>
          <Option value="Khó">Khó</Option>
          <Option value="Rất khó">Rất khó</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default QuestionFilterForm;
