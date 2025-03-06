import React, { useState } from "react";
import { Table, Select, Button, Modal, message } from "antd";
import { questionBank } from "@/models/TH2/questionBank";

const { Option } = Select;

// Danh sách khối kiến thức
const knowledgeBlocks = [
  { id: 0, name: "Không có" },
  { id: 1, name: "Tổng quan" },
  { id: 2, name: "Chuyên sâu" },
  { id: 3, name: "Nâng cao" },
  { id: 4, name: "Ứng dụng thực tế" }
];

const KnowledgeBlockPage: React.FC = () => {
  const [subjects, setSubjects] = useState(questionBank.getSubjects());
  const [editingSubject, setEditingSubject] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mở modal chỉnh sửa
  const showEditModal = (subjectId: number, currentBlockId: number) => {
    setEditingSubject(subjectId);
    setSelectedBlock(currentBlockId);
    setIsModalVisible(true);
  };

  // Lưu chỉnh sửa khối kiến thức
  const handleSave = () => {
    if (editingSubject !== null && selectedBlock !== null) {
      const updatedSubjects = questionBank.updateKnowledgeBlock(editingSubject, selectedBlock);
      setSubjects([...updatedSubjects]); // Cập nhật danh sách môn học
      message.success("Cập nhật khối kiến thức thành công!");
      setIsModalVisible(false);
    }
  };

  // Xóa khối kiến thức
  const handleDelete = (subjectId: number) => {
    const updatedSubjects = questionBank.removeKnowledgeBlock(subjectId);
    setSubjects([...updatedSubjects]); // Cập nhật danh sách môn học
    message.success("Xóa khối kiến thức thành công!");
  };

  // Cột hiển thị dữ liệu
  const columns = [
    { title: "Tên môn học", dataIndex: "name", key: "name" },
    {
      title: "Khối kiến thức",
      dataIndex: "knowledgeBlockId",
      key: "knowledgeBlockId",
      render: (knowledgeBlockId: number) =>
        knowledgeBlocks.find((kb) => kb.id === knowledgeBlockId)?.name || "Chưa có"
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => showEditModal(record.id, record.knowledgeBlockId)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Khối Kiến Thức</h2>
      <Table columns={columns} dataSource={subjects} rowKey="id" />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa Khối Kiến Thức"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          style={{ width: "100%" }}
          value={selectedBlock}
          onChange={(value) => setSelectedBlock(value)}
        >
          {knowledgeBlocks.map((kb) => (
            <Option key={kb.id} value={kb.id}>
              {kb.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default KnowledgeBlockPage;
