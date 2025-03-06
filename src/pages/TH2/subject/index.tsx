import React, { useState } from "react";
import { Table, Button } from "antd";
import SubjectForm from "./SubjectForm";
import { questionBank, knowledgeBlocks } from "@/models/TH2/questionBank";

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState(questionBank.getSubjects());
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getKnowledgeBlockName = (id: number) => {
    return knowledgeBlocks.find((block) => block.id === id)?.name || "Không xác định";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách môn học</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm môn học
      </Button>
      <Table
        columns={[
          { title: "Mã môn", dataIndex: "code", key: "code" },
          { title: "Tên môn", dataIndex: "name", key: "name" },
          { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
          {
            title: "Khối kiến thức",
            dataIndex: "knowledgeBlockId",
            key: "knowledgeBlockId",
            render: (id: number) => getKnowledgeBlockName(id)
          }
        ]}
        dataSource={subjects}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <SubjectForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={(newSubjects) => {
          setSubjects(newSubjects);
          setIsModalVisible(false);
        }}
      />
    </div>
  );
};

export default SubjectsPage;
