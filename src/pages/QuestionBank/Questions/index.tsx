import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select, Table, Typography, Card, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getStoredQuestions, addQuestion, editQuestion, deleteQuestion } from "@/services/QuestionBank";
import { getStoredSubjects } from "@/services/QuestionBank"; // Lấy danh sách môn học từ localStorage

const { Title } = Typography;

const QuestionBank: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [form] = Form.useForm();
    const [filters, setFilters] = useState<{ subjectId: number | null; difficulty: string; knowledgeArea: string }>({
        subjectId: null,
        difficulty: "",
        knowledgeArea: ""
    });

    useEffect(() => {
        setQuestions(getStoredQuestions());
        setSubjects(getStoredSubjects());
    }, []);

    const showModal = (question: Question | null = null) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
        form.setFieldsValue(question || { subjectId: null, content: "", difficulty: "Dễ", knowledgeArea: "" });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = (values: Omit<Question, "id">) => {
        let updatedQuestions;
        if (editingQuestion) {
            updatedQuestions = editQuestion({ id: editingQuestion.id, ...values });
        } else {
            updatedQuestions = addQuestion(values);
        }
        setQuestions(updatedQuestions);
        handleCancel();
    };

    const handleDelete = (id: number) => {
        setQuestions(deleteQuestion(id));
    };

    const filteredQuestions = questions.filter(q =>
        (!filters.subjectId || q.subjectId === filters.subjectId) &&
        (!filters.difficulty || q.difficulty === filters.difficulty) &&
        (!filters.knowledgeArea || q.knowledgeArea.includes(filters.knowledgeArea))
    );

    const columns = [
        {
            title: "Môn học",
            dataIndex: "subjectId",
            render: (id: number) => subjects.find(s => s.id === id)?.name || "Không xác định"
        },
        { title: "Nội dung", dataIndex: "content" },
        { title: "Khối kiến thức", dataIndex: "knowledgeArea" },
        {
            title: "Mức độ",
            dataIndex: "difficulty",
        },
        {
            title: "Hành động",
            render: (_: any, record: Question) => (
                <>
                    <EditOutlined onClick={() => showModal(record)} style={{ marginRight: 8, cursor: "pointer", color: "#1890ff" }} />
                    <DeleteOutlined onClick={() => handleDelete(record.id)} style={{ color: "red", cursor: "pointer" }} />
                </>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>Quản lý câu hỏi</Title>
            <Card>
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Select
                            onChange={(value) => setFilters(prev => ({ ...prev, subjectId: value }))}
                            allowClear
                            placeholder="Chọn môn học"
                            style={{ width: "100%" }}
                        >
                            {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            onChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
                            allowClear
                            placeholder="Chọn mức độ"
                            style={{ width: "100%" }}
                        >
                            {["Dễ", "Trung bình", "Khó", "Rất khó"].map(level => <Select.Option key={level} value={level}>{level}</Select.Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            onChange={(value) => setFilters(prev => ({ ...prev, knowledgeArea: value }))}
                            placeholder="Chọn khối kiến thức"
                            style={{ width: "100%" }}
                            disabled={!filters.subjectId}
                            allowClear
                        >
                            {filters.subjectId && subjects.find(s => s.id === filters.subjectId)?.knowledgeAreas.map(area => <Select.Option key={area} value={area}>{area}</Select.Option>)}
                        </Select>
                    </Col>
                </Row>
            </Card>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>Thêm câu hỏi</Button>
            <Table dataSource={filteredQuestions} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5 }} />
            <Modal
                title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
                visible={isModalOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: "Chọn môn học!" }]}>
                        <Select placeholder="Chọn môn học">
                            {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: "Nhập nội dung!" }]}>
                        <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi" />
                    </Form.Item>
                    <Form.Item name="knowledgeArea" label="Khối kiến thức">
                        <Select placeholder="Chọn khối kiến thức">
                            {filters.subjectId && subjects.find(s => s.id === filters.subjectId)?.knowledgeAreas.map(area => (
                                <Select.Option key={area} value={area}>
                                    {area}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="difficulty" label="Mức độ khó">
                        <Select placeholder="Chọn mức độ khó">
                            {["Dễ", "Trung bình", "Khó", "Rất khó"].map(level => <Select.Option key={level} value={level}>{level}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionBank;
