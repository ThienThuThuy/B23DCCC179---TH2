import React, { useState } from "react";
import { questionBank } from "@/models/TH2/questionBank";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import QuestionFilterForm from "./QuestionFilterForm"; // Import form lọc câu hỏi

const { Option } = Select;

const QuestionPage: React.FC = () => {
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const subjects = questionBank.getSubjects();

  const handleFilterQuestions = (selectedSubject: number | null, selectedDifficulty: string | null) => {
    if (selectedSubject !== null) {
      const questions = questionBank.getQuestionsBySubject(selectedSubject);
      const filtered = questions.filter((q: { difficulty: string }) =>
        selectedDifficulty ? q.difficulty === selectedDifficulty : true
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions([]);
    }
  };

  const handleAddQuestion = () => {
    form.validateFields().then(values => {
      questionBank.addQuestion(values); // Thêm câu hỏi vào ngân hàng dữ liệu
      setFilteredQuestions(prev => [...prev, values]); // Cập nhật danh sách câu hỏi
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Question Bank</h1>
      <h2>❓ Danh sách Câu hỏi</h2>

      <QuestionFilterForm subjects={subjects} onFilter={handleFilterQuestions} />

      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        ➕ Thêm Câu hỏi
      </Button>

      <Table
        columns={[
          { title: "Câu hỏi", dataIndex: "content", key: "content" },
          { title: "Độ khó", dataIndex: "difficulty", key: "difficulty" },
        ]}
        dataSource={filteredQuestions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Thêm Câu hỏi"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddQuestion}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học" }]}>
            <Select placeholder="Chọn môn học">
              {subjects.map((subject: { id: number; name: string }) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}>
            <Select placeholder="Chọn độ khó">
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionPage;
