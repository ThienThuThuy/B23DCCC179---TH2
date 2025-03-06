const SUBJECT_STORAGE_KEY = "subjects";
const QUESTION_STORAGE_KEY = "questions";

//📌

const DEFAULT_SUBJECTS: Subject[] = [
    { id: 1, name: "Toán học", credit: 3, knowledgeAreas: ["Giải tích", "Đại số"], color: "#FF5733" },
    { id: 2, name: "Vật lý", credit: 4, knowledgeAreas: ["Cơ học", "Điện từ"], color: "#3498DB" },
    { id: 3, name: "Python", credit: 3, knowledgeAreas: ["Giải thuật", "OOP"], color: "#27AE60" }
];

const DEFAULT_QUESTIONS: Question[] = [
    { id: 1, subjectId: 1, content: "Tính đạo hàm của x^2", difficulty: "Dễ", knowledgeArea: "Giải tích" },
    { id: 2, subjectId: 2, content: "Định luật Newton", difficulty: "Trung bình", knowledgeArea: "Cơ học" },
];

const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getStoredSubjects = (): Subject[] => {
    try {
        const storedData = JSON.parse(localStorage.getItem(SUBJECT_STORAGE_KEY) || "[]");
        if (Array.isArray(storedData) && storedData.length > 0) return storedData;
    } catch (error) {
        console.error("Lỗi khi parse subjects:", error);
    }
    saveData(SUBJECT_STORAGE_KEY, DEFAULT_SUBJECTS);
    return DEFAULT_SUBJECTS;
};

export const addSubject = (newSubject: Omit<Subject, "id">): Subject[] => {
    const subjects = getStoredSubjects();
    const updatedSubjects = [...subjects, { id: Date.now(), ...newSubject }];
    saveData(SUBJECT_STORAGE_KEY, updatedSubjects);
    return updatedSubjects;
};

export const editSubject = (id: number, updatedData: Partial<Subject>): Subject[] => {
    const updatedSubjects = getStoredSubjects().map(sub => (sub.id === id ? { ...sub, ...updatedData } : sub));
    saveData(SUBJECT_STORAGE_KEY, updatedSubjects);
    return updatedSubjects;
};

export const deleteSubject = (id: number): Subject[] => {
    const updatedSubjects = getStoredSubjects().filter(sub => sub.id !== id);
    saveData(SUBJECT_STORAGE_KEY, updatedSubjects);
    return updatedSubjects;
};

export const deleteAllSubjects = () => saveData(SUBJECT_STORAGE_KEY, []);

//📌

export const getStoredQuestions = (): Question[] => {
    try {
        const storedData = JSON.parse(localStorage.getItem(QUESTION_STORAGE_KEY) || "[]");
        if (Array.isArray(storedData) && storedData.length > 0) return storedData;
    } catch (error) {
        console.error("Lỗi khi parse questions:", error);
    }
    saveData(QUESTION_STORAGE_KEY, DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
};

export const addQuestion = (question: Omit<Question, "id">): Question[] => {
    const questions = getStoredQuestions();
    const newQuestion: Question = { id: Date.now(), ...question };
    const updatedQuestions = [...questions, newQuestion];
    saveData(QUESTION_STORAGE_KEY, updatedQuestions);
    return updatedQuestions;
};

export const editQuestion = (updatedQuestion: Question): Question[] => {
    const updatedQuestions = getStoredQuestions().map(q =>
        q.id === updatedQuestion.id ? updatedQuestion : q
    );
    saveData(QUESTION_STORAGE_KEY, updatedQuestions);
    return updatedQuestions;
};

export const deleteQuestion = (id: number): Question[] => {
    const updatedQuestions = getStoredQuestions().filter(q => q.id !== id);
    saveData(QUESTION_STORAGE_KEY, updatedQuestions);
    return updatedQuestions;
};

export const deleteAllQuestions = () => saveData(QUESTION_STORAGE_KEY, []);

// Hàm thêm khối kiến thức vào môn học
export const addKnowledgeAreaToSubject = (subjectId: number, knowledgeArea: string) => {
    const subjects = getStoredSubjects();
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);

    if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        if (!subject.knowledgeAreas.includes(knowledgeArea)) {
            subject.knowledgeAreas.push(knowledgeArea); // Thêm khối kiến thức vào môn học
            saveData(SUBJECT_STORAGE_KEY, subjects); // Lưu lại môn học đã được cập nhật
        }
    }
};

// Chỉnh sửa khối kiến thức của môn học
export const editKnowledgeArea = (subjectId: number, oldKnowledgeArea: string, newKnowledgeArea: string) => {
    const subjects = getStoredSubjects();
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);

    if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        const knowledgeIndex = subject.knowledgeAreas.indexOf(oldKnowledgeArea);

        if (knowledgeIndex !== -1) {
            subject.knowledgeAreas[knowledgeIndex] = newKnowledgeArea; // Thay thế khối kiến thức
            saveData(SUBJECT_STORAGE_KEY, subjects); // Lưu lại môn học đã được cập nhật
        }
    }
};

// Xóa khối kiến thức khỏi môn học
export const deleteKnowledgeArea = (subjectId: number, knowledgeArea: string) => {
    const subjects = getStoredSubjects();
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);

    if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        const knowledgeIndex = subject.knowledgeAreas.indexOf(knowledgeArea);

        if (knowledgeIndex !== -1) {
            subject.knowledgeAreas.splice(knowledgeIndex, 1); // Xóa khối kiến thức
            saveData(SUBJECT_STORAGE_KEY, subjects); // Lưu lại môn học đã được cập nhật
        }
    }
};
