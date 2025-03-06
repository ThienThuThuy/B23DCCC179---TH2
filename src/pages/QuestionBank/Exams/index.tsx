import React, { useState, useEffect } from "react";
import { Button, Select, InputNumber, Form, message, Table, Typography } from "antd";
import {
    getStoredSubjects,
    getStoredQuestions,
    getStoredExams
} from "@/services/QuestionBank";

const { Title } = Typography;
const { Option } = Select;

const ExamCreationPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [examStructure, setExamStructure] = useState<ExamStructure | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [selectedKnowledgeAreas, setSelectedKnowledgeAreas] = useState<string[]>([]); // Khối kiến thức theo môn
    const [exams, setExams] = useState<ExamStructure[]>([]);  // Lưu trữ các đề thi đã tạo
    const [editingExam, setEditingExam] = useState<ExamStructure | null>(null); // Lưu trữ đề thi đang chỉnh sửa
    const [form] = Form.useForm();

    useEffect(() => {
        // Lấy danh sách môn học, câu hỏi và đề thi từ localStorage
        const storedSubjects = getStoredSubjects();
        const storedQuestions = getStoredQuestions();
        const storedExams = getStoredExams(); // Lấy danh sách đề thi đã lưu

        setSubjects(storedSubjects); // Cập nhật state subjects
        setQuestions(storedQuestions); // Cập nhật state questions

        // Chuyển đổi từ Exam[] sang ExamStructure[]
        const formattedExams = storedExams.map((exam) => ({
            ...exam,
            structure: {}  // Cung cấp giá trị mặc định cho `structure` nếu cần
        }));

        setExams(formattedExams);  // Cập nhật state exams
    }, []);

    // Lọc khối kiến thức theo môn học đã chọn
    const handleSubjectChange = (subjectId: number) => {
        setSelectedSubject(subjectId);
        const knowledgeAreas = questions
            .filter((q) => q.subjectId === subjectId)
            .map((q) => q.knowledgeArea);
        setSelectedKnowledgeAreas([...new Set(knowledgeAreas)]);  // Loại bỏ các khối kiến thức trùng
    };

    const handleCreateOrUpdateExam = (values: any) => {
        if (!selectedSubject) {
            message.error("Vui lòng chọn môn học!");
            return;
        }

        // Lọc câu hỏi theo môn học, khối kiến thức và mức độ khó
        const filteredQuestions = questions.filter(
            (question) =>
                question.subjectId === selectedSubject &&
                values.knowledgeAreas.includes(question.knowledgeArea) &&
                values.difficulties.includes(question.difficulty)
        );

        // Kiểm tra nếu đủ số câu hỏi yêu cầu
        const totalQuestionsRequired = Object.values(values.questionsCount).reduce(
            (sum: number, count: number) => sum + count,
            0
        );
        if (filteredQuestions.length < totalQuestionsRequired) {
            message.error("Không đủ câu hỏi đáp ứng yêu cầu!");
            return;
        }

        // Chọn câu hỏi từ danh sách đã lọc
        const selectedQuestions = [];
        Object.keys(values.questionsCount).forEach((difficulty) => {
            const difficultyQuestions = filteredQuestions.filter(
                (q) => q.difficulty === difficulty
            );
            const selectedDifficultyQuestions = difficultyQuestions.slice(0, values.questionsCount[difficulty]);
            selectedQuestions.push(...selectedDifficultyQuestions);
        });

        if (selectedQuestions.length !== totalQuestionsRequired) {
            message.error("Không đủ câu hỏi theo yêu cầu của bạn!");
            return;
        }

        const newExamStructure: ExamStructure = {
            subjectId: selectedSubject,
            questions: selectedQuestions,
            structure: values,
        };

        // Cập nhật danh sách đề thi
        const updatedExams = editingExam
            ? exams.map((exam) =>
                exam === editingExam ? { ...exam, ...newExamStructure } : exam
            )
            : [...exams, newExamStructure];

        saveData("exams", updatedExams); // Lưu lại vào localStorage
        setExams(updatedExams);  // Cập nhật state exams

        message.success(editingExam ? "Đề thi đã được cập nhật!" : "Đề thi đã được tạo thành công!");

        // Reset form và state
        setExamStructure(newExamStructure);  // Cập nhật đề thi đã tạo
        setEditingExam(null);  // Reset việc chỉnh sửa
        form.resetFields();  // Đặt lại form
    };

    const handleEditExam = (exam: ExamStructure) => {
        setEditingExam(exam);  // Cập nhật exam đang chỉnh sửa
        setSelectedSubject(exam.subjectId);  // Chọn môn học
        setSelectedKnowledgeAreas(exam.structure.knowledgeAreas || []); // Chọn khối kiến thức đã có
        form.setFieldsValue({
            subject: exam.subjectId,
            knowledgeAreas: exam.structure.knowledgeAreas || [],
            difficulties: exam.structure.difficulties || [],
            questionsCount: exam.structure.questionsCount || { Easy: 0, Medium: 0, Hard: 0 }
        });
    };

    return (
        <div style={{ padding: 20 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
                {editingExam ? "Chỉnh Sửa Đề Thi" : "Tạo Đề Thi"}
            </Title>
            <Form
                form={form}
                onFinish={handleCreateOrUpdateExam}
                layout="vertical"
                initialValues={{ questionsCount: { Easy: 0, Medium: 0, Hard: 0 } }}
            >
                <Form.Item name="subject" label="Chọn Môn Học" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}>
                    <Select
                        placeholder="Chọn môn học"
                        onChange={handleSubjectChange}
                        allowClear
                    >
                        {subjects.map((subject) => (
                            <Option key={subject.id} value={subject.id}>
                                {subject.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="knowledgeAreas" label="Chọn Khối Kiến Thức" rules={[{ required: true, message: "Vui lòng chọn khối kiến thức!" }]}>
                    <Select mode="multiple" placeholder="Chọn khối kiến thức">
                        {selectedKnowledgeAreas.map((area, index) => (
                            <Option key={index} value={area}>
                                {area}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="difficulties" label="Chọn Mức Độ Khó" rules={[{ required: true, message: "Vui lòng chọn mức độ khó!" }]}>
                    <Select mode="multiple" placeholder="Chọn mức độ khó">
                        {["Easy", "Medium", "Hard"].map((difficulty) => (
                            <Option key={difficulty} value={difficulty}>
                                {difficulty}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="questionsCount" label="Số Lượng Câu Hỏi" rules={[{ required: true, message: "Vui lòng nhập số lượng câu hỏi!" }]}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {["Easy", "Medium", "Hard"].map((difficulty) => (
                            <div key={difficulty} style={{ marginBottom: 10 }}>
                                <span>{`Số câu hỏi ${difficulty}: `}</span>
                                <Form.Item
                                    name={["questionsCount", difficulty]}  // This will map to questionsCount.Easy, questionsCount.Medium, etc.
                                    initialValue={0}  // Ensure initial value is 0 if not already set
                                    style={{ display: "inline-block", marginLeft: 8 }}
                                >
                                    <InputNumber
                                        min={0}
                                        placeholder={`Số câu hỏi ${difficulty}`}
                                        style={{ width: 100 }}  // Adjust width as needed
                                    />
                                </Form.Item>
                            </div>
                        ))}
                    </div>
                </Form.Item>



                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingExam ? "Cập Nhật Đề Thi" : "Tạo Đề Thi"}
                    </Button>
                </Form.Item>
            </Form>

            {examStructure && (
                <div>
                    <Title level={3}>Cấu Trúc Đề Thi Được Tạo</Title>
                    <Table
                        columns={[
                            {
                                title: "Câu Hỏi",
                                dataIndex: "content",
                                key: "content",
                            },
                            {
                                title: "Khối Kiến Thức",
                                dataIndex: "knowledgeArea",
                                key: "knowledgeArea",
                            },
                            {
                                title: "Mức Độ Khó",
                                dataIndex: "difficulty",
                                key: "difficulty",
                            },
                        ]}
                        dataSource={examStructure.questions.map((q, index) => ({
                            key: index,
                            ...q,
                        }))}
                        pagination={false}
                        bordered
                    />
                </div>
            )}

            <div style={{ marginTop: 40 }}>
                <Title level={3}>Tất Cả Đề Thi</Title>
                <Table
                    columns={[
                        {
                            title: "Môn Học",
                            dataIndex: "subjectId",
                            key: "subjectId",
                            render: (subjectId: number) => {
                                const subject = subjects.find(s => s.id === subjectId);
                                return subject ? subject.name : "Không tìm thấy";
                            },
                        },
                        {
                            title: "Số Lượng Câu Hỏi",
                            dataIndex: "questions",
                            key: "questions",
                            render: (questions: Question[]) => questions.length,
                        },
                        {
                            title: "Thao Tác",
                            key: "action",
                            render: (_, record: ExamStructure) => (
                                <>
                                    <Button onClick={() => handleEditExam(record)}>Sửa</Button>
                                    <Button onClick={() => console.log("Xóa đề thi", record)} style={{ marginLeft: 8 }}>
                                        Xóa
                                    </Button>
                                </>
                            ),
                        },
                    ]}
                    dataSource={exams.map((exam, index) => ({
                        key: index,
                        ...exam,
                    }))}
                    pagination={false}
                    bordered
                />
            </div>
        </div>
    );
};

export default ExamCreationPage;
