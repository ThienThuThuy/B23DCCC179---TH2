import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button, Card, Col, Row, Modal, Form, Input, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined } from "@ant-design/icons";
import {
    getStoredSubjects,
    addSubject,
    editSubject,
    deleteSubject,
    deleteAllSubjects
} from "@/services/QuestionBank";

const { Option } = Select;



interface SubjectFormProps {
    visible: boolean;
    onCancel: () => void;
    onFinish: (values: Omit<Subject, "id">) => void;
    initialValues?: Subject;
}

const SubjectFormModal: React.FC<SubjectFormProps> = ({ visible, onCancel, onFinish, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Chỉnh sửa Môn Học" : "Thêm Môn Học"}
            visible={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            width={600}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="name" label="Tên Môn Học" rules={[{ required: true, message: "Nhập tên môn học!" }]}>
                    <Input placeholder="Nhập tên môn học" />
                </Form.Item>
                <Form.Item name="credit" label="Số Tín Chỉ" rules={[{ required: true, message: "Nhập số tín chỉ!" }]}>
                    <Input type="number" min={1} placeholder="Nhập số tín chỉ" />
                </Form.Item>
                <Form.Item name="knowledgeAreas" label="Khối Kiến Thức" rules={[{ required: true, message: "Nhập khối kiến thức!" }]}>
                    <Select mode="tags" placeholder="Nhập khối kiến thức" />
                </Form.Item>
                <Form.Item name="color" label="Màu Sắc" rules={[{ required: true, message: "Chọn màu sắc!" }]}>
                    <Input type="color" style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const SubjectList: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>(getStoredSubjects());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const showModal = useCallback((subject?: Subject) => {
        setEditingSubject(subject || null);
        setIsModalOpen(true);
    }, []);

    const handleSubmit = useCallback((values: Omit<Subject, "id">) => {
        if (editingSubject) {
            const updatedSubjects = editSubject(editingSubject.id, values);
            setSubjects(updatedSubjects);
        } else {
            const updatedSubjects = addSubject(values);
            setSubjects(updatedSubjects);
        }
        setIsModalOpen(false);
    }, [editingSubject]);

    const handleDelete = useCallback((id: number) => {
        setSubjects(deleteSubject(id));
    }, []);

    const handleDeleteAll = useCallback(() => {
        deleteAllSubjects();
        setSubjects([]);
    }, []);



    const subjectCards = useMemo(() => subjects.map((subject) => (
        <Col span={8} key={subject.id}>
            <Card
                title={<div style={{ textAlign: "center" }}>{subject.name}</div>}
                bordered={true}
                style={{ borderTop: `4px solid ${subject.color}`, textAlign: "left" }}
                actions={[
                    <EditOutlined onClick={() => showModal(subject)} key="edit" style={{ cursor: "pointer" }} />,
                    <DeleteOutlined onClick={() => handleDelete(subject.id)} key="delete" style={{ color: "red", cursor: "pointer" }} />,
                ]}
            >
                <p><strong>ID:</strong> {subject.id}</p>
                <p><strong>Số tín chỉ:</strong> {subject.credit}</p>
                <p><strong>Khối kiến thức:</strong> {Array.isArray(subject.knowledgeAreas) ? subject.knowledgeAreas.join(", ") : "Không có dữ liệu"}</p>
            </Card>
        </Col>
    )), [subjects, showModal, handleDelete]);

    return (
        <div style={{ padding: 20, backgroundColor: "#f0f8ff", textAlign: "center" }}>
            <h1>Danh Mục Môn Học</h1>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 20 }} onClick={() => showModal()}>
                Thêm Môn Học
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDeleteAll}>
                Xóa Tất Cả
            </Button>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {subjectCards}
            </Row>

            <SubjectFormModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onFinish={handleSubmit}
                initialValues={editingSubject || undefined}
            />
        </div>
    );
};

export default SubjectList;
