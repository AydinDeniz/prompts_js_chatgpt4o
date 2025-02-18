// HTML for Interactive Online Education Platform (assumed to be in your HTML file)
/*
<div id="education-platform">
  <h2>Interactive Learning Experience</h2>
  <div id="course-selection">
    <label for="course-list">Select Course:</label>
    <select id="course-list">
      <option value="math">Mathematics</option>
      <option value="science">Science</option>
      <option value="history">History</option>
    </select>
    <button id="start-course">Start Course</button>
  </div>
  <div id="course-content" style="display: none;">
    <h3 id="lesson-title"></h3>
    <div id="lesson-content"></div>
    <button id="next-lesson">Next Lesson</button>
  </div>
  <div id="progress-tracker">
    <h3>Progress Tracker</h3>
    <ul id="progress-list"></ul>
  </div>
  <div id="quiz-section" style="display: none;">
    <h3>Quiz Time!</h3>
    <div id="quiz-question"></div>
    <input type="text" id="quiz-answer" placeholder="Your answer"/>
    <button id="submit-answer">Submit</button>
    <div id="quiz-feedback"></div>
  </div>
</div>
*/

class InteractiveEducationPlatform {
  constructor() {
    this.courses = this.loadCourses();
    this.currentCourse = null;
    this.currentLessonIndex = 0;
    this.progress = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('start-course').addEventListener('click', () => this.startCourse());
    document.getElementById('next-lesson').addEventListener('click', () => this.nextLesson());
    document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
  }

  loadCourses() {
    return {
      math: {
        lessons: [
          { title: "Algebra Basics", content: "Introduction to algebra..." },
          { title: "Geometry Fundamentals", content: "Understanding shapes..." }
        ],
        quiz: { question: "What is 2+2?", answer: "4" }
      },
      science: {
        lessons: [
          { title: "Physics 101", content: "Basics of motion and force..." },
          { title: "Chemistry Insights", content: "Atoms and molecules..." }
        ],
        quiz: { question: "What is H2O?", answer: "water" }
      },
      history: {
        lessons: [
          { title: "Ancient Civilizations", content: "The story of early humans..." },
          { title: "World Wars Overview", content: "Impact of global conflicts..." }
        ],
        quiz: { question: "Who was Julius Caesar?", answer: "Roman general" }
      }
    };
  }

  startCourse() {
    const courseList = document.getElementById('course-list');
    const selectedCourse = courseList.value;

    if (selectedCourse in this.courses) {
      this.currentCourse = selectedCourse;
      this.currentLessonIndex = 0;
      this.progress[this.currentCourse] = [];

      document.getElementById('course-content').style.display = 'block';
      this.displayCurrentLesson();
      this.updateProgress();
    }
  }

  displayCurrentLesson() {
    const lesson = this.courses[this.currentCourse].lessons[this.currentLessonIndex];
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-content').textContent = lesson.content;
  }

  nextLesson() {
    this.progress[this.currentCourse].push(this.currentLessonIndex);
    this.currentLessonIndex++;

    if (this.currentLessonIndex < this.courses[this.currentCourse].lessons.length) {
      this.displayCurrentLesson();
      this.updateProgress();
    } else {
      this.showQuiz();
    }
  }

  updateProgress() {
    const progressList = document.getElementById('progress-list');
    progressList.innerHTML = this.progress[this.currentCourse].map(index => {
      const lesson = this.courses[this.currentCourse].lessons[index];
      return `<li>Completed: ${lesson.title}</li>`;
    }).join('');
  }

  showQuiz() {
    const quizSection = document.getElementById('quiz-section');
    quizSection.style.display = 'block';

    const quiz = this.courses[this.currentCourse].quiz;
    document.getElementById('quiz-question').textContent = quiz.question;
  }

  submitAnswer() {
    const userAnswer = document.getElementById('quiz-answer').value.trim().toLowerCase();
    const correctAnswer = this.courses[this.currentCourse].quiz.answer.toLowerCase();
    const feedbackDiv = document.getElementById('quiz-feedback');

    if (userAnswer === correctAnswer) {
      feedbackDiv.textContent = "Correct! Well done!";
    } else {
      feedbackDiv.textContent = `Incorrect. The right answer is "${correctAnswer}".`;
    }
  }
}

const educationPlatform = new InteractiveEducationPlatform();