const STORAGE_KEY = "questionBankSubjects";

// Dữ liệu ảo ban đầu
const defaultSubjects = [
  {
    id: 1,
    code: "CS101",
    name: "Lập trình cơ bản",
    credits: 3,
    knowledgeBlockId: 1,
    questions: [
      { id: 1, content: "Biến trong lập trình là gì?", difficulty: "Dễ" },
      { id: 2, content: "Giải thích khái niệm vòng lặp.", difficulty: "Trung bình" }
    ]
  },
  {
    id: 2,
    code: "CS102",
    name: "Cấu trúc dữ liệu",
    credits: 4,
    knowledgeBlockId: 2,
    questions: [
      { id: 3, content: "Danh sách liên kết hoạt động như thế nào?", difficulty: "Khó" }
    ]
  }
];

export const knowledgeBlocks = [
  { id: 0, name: "Không có" },
  { id: 1, name: "Tổng quan" },
  { id: 2, name: "Chuyên sâu" },
  { id: 3, name: "Nâng cao" },
  { id: 4, name: "Ứng dụng thực tế" }
];

// Hàm load dữ liệu từ localStorage hoặc dùng dữ liệu mặc định
function loadSubjects() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubjects));
    return defaultSubjects;
  }
}

function saveSubjects(subjects: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export class questionBank {
  static subjects = loadSubjects();

  static getSubjects() {
    return this.subjects;
  }

  static getQuestions() {
    return this.subjects.flatMap((s: { id: number; code: string; name: string; credits: number; knowledgeBlockId: number; questions: { id: number; content: string; difficulty: string }[] }) =>
      s.questions.map((q) => ({
        ...q,
        subject: s.name
      }))
    );
  }

  static getQuestionsBySubject(subjectId: number) {
    const subject = this.subjects.find((s: { id: number; code: string; name: string; credits: number; knowledgeBlockId: number; questions: { id: number; content: string; difficulty: string }[] }) => s.id === subjectId);
    return subject ? subject.questions : [];
  }

  static addQuestion({ subjectId, content, difficulty }: { subjectId: number; content: string; difficulty: string }) {
    const subject = this.subjects.find((s: { id: number; code: string; name: string; credits: number; knowledgeBlockId: number; questions: { id: number; content: string; difficulty: string }[] }) => s.id === subjectId);
    if (subject) {
      const newQuestion = {
        id: subject.questions.length ? Math.max(...subject.questions.map((q: { id: number; content: string; difficulty: string }) => q.id)) + 1 : 1,
        content,
        difficulty
      };
      subject.questions.push(newQuestion);
      saveSubjects(this.subjects);
      return newQuestion;
    }
    return null;
  }

  static updateKnowledgeBlock(subjectId: number, newBlockId: number) {
    const subject = this.subjects.find((s: { id: number; code: string; name: string; credits: number; knowledgeBlockId: number; questions: { id: number; content: string; difficulty: string }[] }) => s.id === subjectId);
    if (subject) {
      subject.knowledgeBlockId = newBlockId;
      saveSubjects(this.subjects);
    }
    return [...this.subjects];
  }

  static removeKnowledgeBlock(subjectId: number) {
    const subject = this.subjects.find((s: { id: number; code: string; name: string; credits: number; knowledgeBlockId: number; questions: { id: number; content: string; difficulty: string }[] }) => s.id === subjectId);
    if (subject) {
      subject.knowledgeBlockId = 0;
      saveSubjects(this.subjects);
    }
    return [...this.subjects];
  }

  static addSubject(code: string, name: string, credits: number, knowledgeBlockId: number) {
    const newSubject = {
      id: this.subjects.length ? Math.max(...this.subjects.map((s: { id: number }) => s.id)) + 1 : 1,
      code,
      name,
      credits,
      knowledgeBlockId,
      questions: []
    };
    this.subjects.push(newSubject);
    saveSubjects(this.subjects);
    return [...this.subjects];
  }
}
