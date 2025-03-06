interface Subject {
    id: number;
    name: string;
    credit: number;
    knowledgeAreas: string[];
    color: string;
}

interface KnowledgeArea {
    id: number;
    name: string;
    subjectId: number; // Kiểu number để đồng nhất với Subject
}

interface Question {
    id: number;
    subjectId: number; // Kiểu number để đồng nhất với Subject
    content: string;
    difficulty: string;
    knowledgeArea: string;
}
interface ExamStructure {
    id: number; // Mỗi cấu trúc đề thi có id riêng
    difficulty: string;
    knowledgeArea: string; // Đổi từ knowledgeBlock thành knowledgeArea để thống nhất
    count: number;
}

interface Exam {
    id: number; // Mỗi đề thi có id riêng
    name: string;
    subjectId: number; // Môn học của đề thi
    questions: number[]; // Dùng number thay vì string, vì question id là number
    structure: ExamStructure[]; // Cấu trúc của đề thi, bao gồm các yêu cầu về mức độ khó, khối kiến thức và số câu hỏi
    createdAt: string; // Thời gian tạo đề thi
}

