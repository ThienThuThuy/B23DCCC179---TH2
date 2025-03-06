import React, { useEffect, useState, useMemo } from "react";
import { Table, Typography, Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getStoredSubjects, addKnowledgeAreaToSubject, editKnowledgeArea, deleteKnowledgeArea } from "@/services/QuestionBank"; // Import các hàm đã tạo

const { Title } = Typography;
const { Option } = Select;

const KnowledgeAreasPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingKnowledgeArea, setEditingKnowledgeArea] = useState<string | null>(null);
    const [currentSubjectId, setCurrentSubjectId] = useState<number | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const storedSubjects = getStoredSubjects();
        setSubjects(storedSubjects);
    }, []);

    // Lọc tất cả các khối kiến thức
    const allKnowledgeAreas = useMemo(() => {
        const knowledgeAreas = subjects.flatMap(subject => subject.knowledgeAreas);
        return [...new Set(knowledgeAreas)]; // Loại bỏ các khối kiến thức trùng lặp
    }, [subjects]);

    // Lọc các khối kiến thức theo môn học
    const handleSubjectChange = (value: number) => {
        setCurrentSubjectId(value);
    };

    const filteredKnowledgeAreas = useMemo(() => {
        if (currentSubjectId) {
            const subject = subjects.find(s => s.id === currentSubjectId);
            return subject ? subject.knowledgeAreas : [];
        }
        return allKnowledgeAreas;
    }, [currentSubjectId, subjects]);

    // Mở modal thêm hoặc chỉnh sửa khối kiến thức
    const showModal = (knowledgeArea: string | null = null) => {
        setEditingKnowledgeArea(knowledgeArea);
        setIsEditing(!!knowledgeArea);
        setIsModalOpen(true);
        form.setFieldsValue({ knowledgeArea: knowledgeArea || "" });
    };

    // Xử lý thêm hoặc chỉnh sửa khối kiến thức
    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                if (isEditing && editingKnowledgeArea) {
                    // Chỉnh sửa khối kiến thức
                    editKnowledgeArea(currentSubjectId!, editingKnowledgeArea, values.knowledgeArea);
                    message.success("Chỉnh sửa khối kiến thức thành công!");
                } else {
                    // Thêm khối kiến thức
                    addKnowledgeAreaToSubject(currentSubjectId!, values.knowledgeArea);
                    message.success("Thêm khối kiến thức thành công!");
                }
                setIsModalOpen(false);
                form.resetFields();
            })
            .catch(info => {
                console.log("Validate Failed:", info);
            });
    };

    // Xử lý đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // Xử lý xóa khối kiến thức
    const handleDelete = (knowledgeArea: string) => {
        deleteKnowledgeArea(currentSubjectId!, knowledgeArea);
        message.success("Khối kiến thức đã bị xóa!");
    };

    return (
        <div style={{ padding: 20 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
                Tất Cả Khối Kiến Thức
            </Title>

            {/* Bộ lọc theo môn học */}
            <Select
                style={{ width: 200, marginBottom: 20 }}
                placeholder="Chọn Môn Học"
                onChange={handleSubjectChange}
                allowClear
            >
                {subjects.map(subject => (
                    <Option key={subject.id} value={subject.id}>
                        {subject.name}
                    </Option>
                ))}
            </Select>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Thêm Khối Kiến Thức
            </Button>

            <Table
                dataSource={filteredKnowledgeAreas.map((area, index) => ({
                    key: index,
                    knowledgeArea: area,
                    subjectName: currentSubjectId,
                }))}
                columns={[
                    {
                        title: "Khối Kiến Thức",
                        dataIndex: "knowledgeArea",
                        key: "knowledgeArea",
                    },
                    {
                        title: "Hành Động",
                        key: "action",
                        render: (_: any, record: any) => (
                            <>
                                <EditOutlined onClick={() => showModal(record.knowledgeArea)} style={{ marginRight: 8, cursor: "pointer", color: "#1890ff" }} />
                                <DeleteOutlined onClick={() => handleDelete(record.knowledgeArea)} style={{ cursor: "pointer", color: "red" }} />
                            </>
                        )
                    }
                ]}
                pagination={false}
                bordered
            />

            {/* Modal để thêm hoặc chỉnh sửa khối kiến thức */}
            <Modal
                title={isEditing ? "Chỉnh Sửa Khối Kiến Thức" : "Thêm Khối Kiến Thức"}
                visible={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="knowledgeArea"
                        label="Khối Kiến Thức"
                        rules={[{ required: true, message: "Vui lòng nhập khối kiến thức!" }]}
                    >
                        <Input placeholder="Nhập khối kiến thức" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default KnowledgeAreasPage;
