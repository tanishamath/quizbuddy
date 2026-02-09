
import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz, Submission } from '../types';
import { Plus, BarChart3, Clock, Calendar, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface FacultyDashboardProps {
  quizzes: Quiz[];
  submissions: Submission[];
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ quizzes, submissions }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your quizzes and track student performance.</p>
        </div>
        <Link 
          to="/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Create New Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <FileText size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Total Quizzes</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">{quizzes.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Total Submissions</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">{submissions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <BarChart3 size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Avg. Class Score</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">
            {submissions.length > 0 
              ? `${Math.round((submissions.reduce((acc, s) => acc + (s.score / s.totalPossible), 0) / submissions.length) * 100)}%`
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">Your Quizzes</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {quizzes.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Plus size={48} className="mx-auto mb-4 opacity-20" />
              <p>You haven't created any quizzes yet.</p>
              <Link to="/create" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">Create your first quiz</Link>
            </div>
          ) : (
            quizzes.map((quiz) => {
              const quizSubmissions = submissions.filter(s => s.quizId === quiz.id);
              return (
                <div key={quiz.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={14}/> {quiz.durationMinutes} mins</span>
                      <span className="flex items-center gap-1"><Calendar size={14}/> Due: {format(new Date(quiz.dueDate), 'MMM d, h:mm a')}</span>
                      <span className="flex items-center gap-1"><Users size={14}/> {quizSubmissions.length} submissions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/analytics/${quiz.id}`}
                      className="flex items-center gap-2 text-indigo-600 font-semibold px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors"
                    >
                      <BarChart3 size={18} />
                      View Analysis
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
