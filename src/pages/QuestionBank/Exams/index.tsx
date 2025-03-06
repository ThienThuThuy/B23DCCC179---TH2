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
    const [exams, setExams] = useState<ExamStructure[]>([]);  // Lưu trữ các đề thi đã tạo
    const [form] = Form.useForm();

    useEffect(() => {
        // Lấy danh sách môn học, câu hỏi và đề thi từ localStorage
        const storedSubjects = getStoredSubjects();
        const storedQuestions = getStoredQuestions();
        const storedExams = getStoredExams(); // Lấy danh sách đề thi đã lưu

        setSubjects(storedSubjects); // Cập nhật state subjects
        setQuestions(storedQuestions); // Cập nhật state questions



    }, []);


    const handleCreateExam = (values: any) => {
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

        // Lưu cấu trúc đề thi vào localStorage
        const newExamStructure: ExamStructure = {
            subjectId: selectedSubject,
            questions: selectedQuestions,
            structure: values,
        };

        // Cập nhật danh sách đề thi
        saveData("exams", [...getStoredExams(), newExamStructure]);
        setExams([...getStoredExams(), newExamStructure]);  // Cập nhật state với đề thi mới

        message.success("Đề thi đã được tạo thành công!");
        setExamStructure(newExamStructure);  // Cập nhật đề thi đã tạo
    };

    return (
        <div style={{ padding: 20 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
                Tạo Đề Thi
            </Title>
            <Form
                form={form}
                onFinish={handleCreateExam}
                layout="vertical"
                initialValues={{ questionsCount: { Easy: 0, Medium: 0, Hard: 0 } }}
            >
                <Form.Item name="subject" label="Chọn Môn Học" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}>
                    <Select
                        placeholder="Chọn môn học"
                        onChange={(value) => setSelectedSubject(value)}
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
                        {Array.from(new Set(questions.map((q) => q.knowledgeArea))).map((area, index) => (
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
                    <div>
                        {["Easy", "Medium", "Hard"].map((difficulty) => (
                            <Form.Item key={difficulty} name={["questionsCount", difficulty]}>
                                <InputNumber min={0} placeholder={`Số câu hỏi ${difficulty}`} />
                            </Form.Item>
                        ))}
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo Đề Thi
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
                                <Button onClick={() => console.log("Xóa đề thi", record)}>Xóa</Button>
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
