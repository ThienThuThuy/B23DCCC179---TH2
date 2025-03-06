import React, { useState } from "react";
import { Select, InputNumber, Button } from "antd";
import { questionBank } from "@/models/TH2/questionBank";


const { Option } = Select;

interface ExamFormProps {
  onGenerateExam: (subject: string | null, difficultyCounts: { [key: string]: number }) => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ onGenerateExam }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [difficultyCounts, setDifficultyCounts] = useState({
    Dễ: 0,
    "Trung bình": 0,
    Khó: 0,
  });

  return (
    <div className="exam-form-container">
      <Select
        placeholder="Chọn môn học"
        className="subject-select"
        onChange={setSelectedSubject}
      >
        {questionBank.getSubjects().map((subject: { id: string; name: string }) => (
          <Option key={subject.id} value={subject.id}>{subject.name}</Option>
        ))}
      </Select>
      <div className="difficulty-select">
        {Object.keys(difficultyCounts).map((level) => (
          <div key={level} className="difficulty-item">
            {level}: <InputNumber min={0} onChange={(value) => setDifficultyCounts({ ...difficultyCounts, [level]: value })} />
          </div>
        ))}
      </div>
      <Button type="primary" className="generate-btn" onClick={() => onGenerateExam(selectedSubject, difficultyCounts)}>
        Tạo đề thi
      </Button>
    </div>
  );
};

export default ExamForm;
