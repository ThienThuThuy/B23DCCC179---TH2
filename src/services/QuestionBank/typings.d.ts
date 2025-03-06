// Interface cho Môn học
interface Subject {
    id: number;
    name: string;
    credit: number;  // Số tín chỉ của môn học
    knowledgeAreas: string[];  // Các khối kiến thức của môn học (có thể là tên hoặc ID của khối kiến thức)
    color: string;  // Màu sắc đại diện cho môn học
}

// Interface cho Khối Kiến Thức
interface KnowledgeArea {
    id: number;
    name: string;
    subjectId: number;  // Môn học mà khối kiến thức này thuộc về
}

// Interface cho Câu hỏi
interface Question {
    id: number;
    content: string;  // Nội dung câu hỏi
    difficulty: "Easy" | "Medium" | "Hard";  // Mức độ khó của câu hỏi
    knowledgeArea: string;  // Tên hoặc ID khối kiến thức mà câu hỏi này thuộc về
    subjectId: number;  // Môn học mà câu hỏi này thuộc về
}

// Interface cho Cấu trúc Đề thi
interface ExamStructure {
    subjectId: number;  // Môn học của đề thi
    questions: Question[];  // Các câu hỏi trong đề thi
    structure: {
        knowledgeAreas: string[];  // Các khối kiến thức yêu cầu trong đề thi (có thể là tên hoặc ID)
        difficulties: string[];  // Các mức độ khó của câu hỏi
        questionsCount: {
            Easy: number;
            Medium: number;
            Hard: number;
        };  // Số lượng câu hỏi theo mức độ khó
    };
}

// Hàm hỗ trợ lọc câu hỏi theo các điều kiện
const filterQuestions = (questions: Question[], filters: { subjectId: number, knowledgeAreas: string[], difficulties: string[] }): Question[] => {
    return questions.filter((question) =>
        question.subjectId === filters.subjectId &&
        filters.knowledgeAreas.includes(question.knowledgeArea) &&
        filters.difficulties.includes(question.difficulty)
    );
};
