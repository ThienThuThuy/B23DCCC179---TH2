import React, { useState } from "react";
import { Button, Table, message, Modal } from "antd";
import { questionBank } from "@/models/TH2/questionBank";
import ExamForm from "./ExamForm";


const STORAGE_KEY_EXAMS = "examList";

const ExamCreator = () => {
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGenerateExam = (selectedSubject: string | null, difficultyCounts: { [key: string]: number }) => {
    if (!selectedSubject) {
      message.error("Vui lòng chọn môn học!");
      return;
    }

    const questions = questionBank.getQuestionsBySubject(Number(selectedSubject));
    let selectedQuestions: any[] = [];

    ["Dễ", "Trung bình", "Khó"].forEach((level) => {
      const filtered = questions.filter((q: { difficulty: string }) => q.difficulty === level);
      const count = difficultyCounts[level];
      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, count);
      selectedQuestions = [...selectedQuestions, ...shuffled];
    });

    if (selectedQuestions.length === 0) {
      message.error("Không đủ câu hỏi theo yêu cầu!");
      return;
    }

    setGeneratedQuestions(selectedQuestions);
    saveExam(selectedSubject, selectedQuestions);
    setIsModalVisible(false);
  };

  const saveExam = (selectedSubject: string, questions: any[]) => {
    const examList = JSON.parse(localStorage.getItem(STORAGE_KEY_EXAMS) || '[]');
    const newExam = {
      id: examList.length + 1,
      subjectId: selectedSubject,
      questions,
    };
    examList.push(newExam);
    localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(examList));
    message.success("Đề thi đã được lưu!");
  };

  return (
    <div className="exam-creator-container">
      <h2 className="title">Tạo đề thi</h2>
      <Button type="primary" className="toggle-form-btn" onClick={() => setIsModalVisible(true)}>
        Thêm đề thi
      </Button>
      <Modal
        title="Tạo đề thi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ExamForm onGenerateExam={handleGenerateExam} />
      </Modal>
      {generatedQuestions.length > 0 && (
        <Table
          className="question-table"
          dataSource={generatedQuestions}
          columns={[
            { title: "Câu hỏi", dataIndex: "content", key: "content" },
            { title: "Độ khó", dataIndex: "difficulty", key: "difficulty" },
          ]}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default ExamCreator;
