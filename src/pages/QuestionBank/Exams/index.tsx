import React, { useState, useEffect } from 'react';
import { Button, Select, InputNumber, Form, message, Table, Typography, Modal, Row, Col } from 'antd';
import { getStoredSubjects, getStoredQuestions } from '@/services/QuestionBank';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// Define ExamStructure interface
interface ExamStructure {
    id: number;
    subjectId: number;
    questions: Question[];
    structure: {
        knowledgeAreas: string[];
        difficulties: string[];
        questionsCount: Record<string, Record<string, number>>; // e.g., { "Easy": { "Domain1": 2 }, "Medium": { "Domain2": 1 } }
    };
}

const ExamCreationPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [exams, setExams] = useState<ExamStructure[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<ExamStructure | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Load initial data from localStorage
        const storedSubjects = getStoredSubjects();
        const storedQuestions = getStoredQuestions();
        setSubjects(storedSubjects);
        setQuestions(storedQuestions);
    }, []);

    // Handle subject selection and filter questions
    const handleSubjectChange = (value: number) => {
        setSelectedSubject(value);
        const subjectQuestions = questions.filter((q) => q.subjectId === value);
        setFilteredQuestions(subjectQuestions);
    };

    // Get available knowledge areas for the selected subject
    const getAvailableKnowledgeAreas = () => {
        return Array.from(new Set(filteredQuestions.map((q) => q.knowledgeArea)));
    };

    // Define difficulty levels
    const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Very Hard'];

    // Handle exam creation or editing
    const handleCreateExam = (values: any) => {
        if (!selectedSubject) {
            message.error('Vui lòng chọn môn học!');
            return;
        }

        const { knowledgeAreas, difficulties, questionsCount } = values;
        const selectedQuestions: Question[] = [];
        let isValid = true;

        // Validate and select questions based on structure
        difficulties.forEach((difficulty: string) => {
            knowledgeAreas.forEach((area: string) => {
                const count = questionsCount[difficulty]?.[area] || 0;
                if (count > 0) {
                    const matchingQuestions = filteredQuestions.filter(
                        (q) => q.difficulty === difficulty && q.knowledgeArea === area,
                    );
                    if (matchingQuestions.length < count) {
                        message.error(`Không đủ câu hỏi cho ${difficulty} trong ${area}!`);
                        isValid = false;
                        return;
                    }
                    selectedQuestions.push(...matchingQuestions.slice(0, count));
                }
            });
        });

        if (!isValid) return;

        // Create or update exam structure
        const newExam: ExamStructure = {
            id: editingExam ? editingExam.id : Date.now(), // Use timestamp as ID for new exams
            subjectId: selectedSubject,
            questions: selectedQuestions,
            structure: values,
        };

        // Update exams list and save to localStorage
        const updatedExams = editingExam
            ? exams.map((exam) => (exam.id === editingExam.id ? newExam : exam))
            : [...exams, newExam];
        setExams(updatedExams);

        message.success(editingExam ? 'Đề thi đã được cập nhật!' : 'Đề thi đã được tạo thành công!');
        setIsModalOpen(false);
        setEditingExam(null);
        form.resetFields();
    };

    // Handle exam deletion
    const handleDeleteExam = (id: number) => {
        const updatedExams = exams.filter((exam) => exam.id !== id);
        setExams(updatedExams);
        message.success('Đề thi đã bị xóa!');
    };

    // Handle exam editing
    const handleEditExam = (exam: ExamStructure) => {
        setEditingExam(exam);
        setSelectedSubject(exam.subjectId);
        setFilteredQuestions(questions.filter((q) => q.subjectId === exam.subjectId));
        form.setFieldsValue(exam.structure);
        setIsModalOpen(true);
    };

    // Table columns for displaying exams
    const columns = [
        {
            title: 'Môn Học',
            dataIndex: 'subjectId',
            key: 'subjectId',
            render: (subjectId: number) => subjects.find((s) => s.id === subjectId)?.name || 'Không tìm thấy',
        },
        {
            title: 'Số Lượng Câu Hỏi',
            dataIndex: 'questions',
            key: 'questions',
            render: (questions: Question[]) => questions.length,
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_: any, record: ExamStructure) => (
                <>
                    <EditOutlined onClick={() => handleEditExam(record)} style={{ marginRight: 8, color: '#1890ff' }} />
                    <DeleteOutlined onClick={() => handleDeleteExam(record.id)} style={{ color: 'red' }} />
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                Tạo và Quản Lý Đề Thi
            </Title>

            <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                Tạo Đề Thi Mới
            </Button>

            {/* Display all stored exams */}
            <Table
                columns={columns}
                dataSource={exams.map((exam) => ({ key: exam.id, ...exam }))}
                pagination={{ pageSize: 5 }}
                bordered
            />

            {/* Modal for creating/editing exams */}
            <Modal
                title={editingExam ? 'Chỉnh Sửa Đề Thi' : 'Tạo Đề Thi'}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingExam(null);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    onFinish={handleCreateExam}
                    layout='vertical'
                    initialValues={{
                        knowledgeAreas: [],
                        difficulties: [],
                        questionsCount: {},
                    }}
                >
                    <Form.Item
                        name='subject'
                        label='Chọn Môn Học'
                        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                    >
                        <Select placeholder='Chọn môn học' onChange={handleSubjectChange} allowClear>
                            {subjects.map((subject) => (
                                <Option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedSubject && (
                        <>
                            <Form.Item
                                name='knowledgeAreas'
                                label='Chọn Khối Kiến Thức'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ít nhất một khối kiến thức!',
                                    },
                                ]}
                            >
                                <Select mode='multiple' placeholder='Chọn khối kiến thức'>
                                    {getAvailableKnowledgeAreas().map((area) => (
                                        <Option key={area} value={area}>
                                            {area}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name='difficulties'
                                label='Chọn Mức Độ Khó'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ít nhất một mức độ khó!',
                                    },
                                ]}
                            >
                                <Select mode='multiple' placeholder='Chọn mức độ khó'>
                                    {difficultyLevels.map((difficulty) => (
                                        <Option key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name='questionsCount'
                                label='Số Lượng Câu Hỏi'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chỉ định số lượng câu hỏi!',
                                    },
                                ]}
                            >
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        const knowledgeAreas = getFieldValue('knowledgeAreas') || [];
                                        const difficulties = getFieldValue('difficulties') || [];
                                        return (
                                            <Row gutter={16}>
                                                {difficulties.map((difficulty: string) =>
                                                    knowledgeAreas.map((area: string) => (
                                                        <Col span={6} key={`${difficulty}-${area}`}>
                                                            <Form.Item
                                                                label={`${difficulty} - ${area}`}
                                                                name={['questionsCount', difficulty, area]}
                                                                initialValue={0}
                                                            >
                                                                <InputNumber min={0} />
                                                            </Form.Item>
                                                        </Col>
                                                    )),
                                                )}
                                            </Row>
                                        );
                                    }}
                                </Form.Item>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            {editingExam ? 'Cập Nhật Đề Thi' : 'Tạo Đề Thi'}
                        </Button>
                    </Form.Item>
                </Form>

                {/* Display generated exam structure */}
                {editingExam && (
                    <div style={{ marginTop: 20 }}>
                        <Title level={4}>Cấu Trúc Đề Thi Hiện Tại</Title>
                        <Table
                            columns={[
                                { title: 'Câu Hỏi', dataIndex: 'content', key: 'content' },
                                {
                                    title: 'Khối Kiến Thức',
                                    dataIndex: 'knowledgeArea',
                                    key: 'knowledgeArea',
                                },
                                {
                                    title: 'Mức Độ Khó',
                                    dataIndex: 'difficulty',
                                    key: 'difficulty',
                                },
                            ]}
                            dataSource={editingExam.questions.map((q, index) => ({
                                key: index,
                                ...q,
                            }))}
                            pagination={false}
                            bordered
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ExamCreationPage;
