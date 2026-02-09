
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UserRole, Quiz, Submission, User } from './types';
import FacultyDashboard from './views/FacultyDashboard';
import CreateQuiz from './views/CreateQuiz';
import QuizAnalytics from './views/QuizAnalytics';
import StudentDashboard from './views/StudentDashboard';
import TakeQuiz from './views/TakeQuiz';
import ResultView from './views/ResultView';
import { LayoutDashboard, PlusCircle, User as UserIcon, LogOut, BookOpen, GraduationCap } from 'lucide-react';

const INITIAL_USER: User = { id: 'u1', name: 'Dr. Smith', role: UserRole.FACULTY };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const switchRole = () => {
    const newRole = currentUser.role === UserRole.FACULTY ? UserRole.STUDENT : UserRole.FACULTY;
    const newName = newRole === UserRole.FACULTY ? 'Dr. Smith' : 'Alex Student';
    setCurrentUser({ ...currentUser, role: newRole, name: newName });
  };

  const handleCreateQuiz = (quiz: Quiz) => {
    setQuizzes([quiz, ...quizzes]);
  };

  const handleSubmitQuiz = (submission: Submission) => {
    setSubmissions([...submissions, submission]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold tracking-tight text-slate-800">MyQuizBuddy</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={switchRole}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1 rounded-full border border-slate-200"
                >
                  Switch to {currentUser.role === UserRole.FACULTY ? 'Student' : 'Faculty'}
                </button>
                
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {currentUser.role === UserRole.FACULTY ? <GraduationCap size={18} /> : <UserIcon size={18} />}
                  <span className="text-sm font-semibold">{currentUser.name}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {currentUser.role === UserRole.FACULTY ? (
              <>
                <Route path="/" element={<FacultyDashboard quizzes={quizzes} submissions={submissions} />} />
                <Route path="/create" element={<CreateQuiz onCreate={handleCreateQuiz} />} />
                <Route path="/analytics/:id" element={<QuizAnalytics quizzes={quizzes} submissions={submissions} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<StudentDashboard quizzes={quizzes} submissions={submissions} />} />
                <Route path="/take/:id" element={<TakeQuiz quizzes={quizzes} onSubmit={handleSubmitQuiz} user={currentUser} />} />
                <Route path="/result/:submissionId" element={<ResultView quizzes={quizzes} submissions={submissions} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
