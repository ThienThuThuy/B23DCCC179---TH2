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
    subjectId: number;
}
interface Question {
    id: number;
    content: string;
    difficulty: string;
    knowledgeArea: string;
    subjectId: number;
}
interface ExamStructure {
    subjectId: number;
    questions: Question[];  // Dữ liệu câu hỏi
    structure: {
        knowledgeAreas: string[];
        difficulties: string[];
        questionsCount: {
            Easy: number;
            Medium: number;
            Hard: number;
        };
    };
}

