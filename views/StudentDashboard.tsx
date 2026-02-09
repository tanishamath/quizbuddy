
import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz, Submission } from '../types';
import { Clock, Calendar, CheckCircle2, PlayCircle, Trophy, BookOpen } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface StudentDashboardProps {
  quizzes: Quiz[];
  submissions: Submission[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ quizzes, submissions }) => {
  const availableQuizzes = quizzes.filter(q => !submissions.find(s => s.quizId === q.id && s.studentId === 'u1'));
  const completedSubmissions = submissions.filter(s => s.studentId === 'u1');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Check your assigned tasks and progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Clock size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Pending Tasks</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">{availableQuizzes.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">{completedSubmissions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Trophy size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Success Rate</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">
            {completedSubmissions.length > 0 
              ? `${Math.round((completedSubmissions.reduce((acc, s) => acc + (s.score / s.totalPossible), 0) / completedSubmissions.length) * 100)}%`
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Quizzes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlayCircle className="text-indigo-600" /> Available Quizzes
          </h2>
          <div className="space-y-4">
            {availableQuizzes.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                All caught up! No pending quizzes.
              </div>
            ) : (
              availableQuizzes.map(quiz => (
                <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
                      <p className="text-sm text-slate-500">{quiz.topic}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isPast(new Date(quiz.dueDate)) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isPast(new Date(quiz.dueDate)) ? 'Overdue' : 'Active'}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1"><Clock size={16}/> {quiz.durationMinutes} mins</span>
                    <span className="flex items-center gap-1"><Calendar size={16}/> Due: {format(new Date(quiz.dueDate), 'MMM d, h:mm a')}</span>
                  </div>
                  <Link 
                    to={`/take/${quiz.id}`}
                    className="block w-full text-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Start Quiz
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Previous Results */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="text-indigo-600" /> Previous Results
          </h2>
          <div className="space-y-4">
            {completedSubmissions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                You haven't completed any quizzes yet.
              </div>
            ) : (
              completedSubmissions.map(sub => {
                const quiz = quizzes.find(q => q.id === sub.quizId);
                return (
                  <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{quiz?.title || 'Unknown Quiz'}</h3>
                      <p className="text-sm text-slate-500">Submitted: {format(new Date(sub.timestamp), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-black text-indigo-600">{sub.score}/{sub.totalPossible}</div>
                        <div className="text-xs font-bold uppercase text-slate-400">Score</div>
                      </div>
                      <Link 
                        to={`/result/${sub.id}`}
                        className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
