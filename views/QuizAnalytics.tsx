
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Quiz, Submission } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ChevronLeft, Info, CheckCircle2, XCircle } from 'lucide-react';

interface QuizAnalyticsProps {
  quizzes: Quiz[];
  submissions: Submission[];
}

const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ quizzes, submissions }) => {
  const { id } = useParams<{ id: string }>();
  const quiz = quizzes.find(q => q.id === id);
  const quizSubmissions = submissions.filter(s => s.quizId === id);

  const stats = useMemo(() => {
    if (!quiz) return null;
    
    // Per question performance
    const questionAnalysis = quiz.questions.map(q => {
      let correct = 0;
      let attempted = 0;
      quizSubmissions.forEach(sub => {
        const studentAnswers = sub.answers[q.id] || [];
        if (studentAnswers.length > 0) attempted++;
        
        const isCorrect = 
          studentAnswers.length === q.correctAnswers.length &&
          studentAnswers.every(val => q.correctAnswers.includes(val));
        
        if (isCorrect) correct++;
      });
      return {
        name: q.text.substring(0, 20) + '...',
        fullText: q.text,
        correct,
        incorrect: quizSubmissions.length - correct,
        percentage: quizSubmissions.length > 0 ? (correct / quizSubmissions.length) * 100 : 0
      };
    });

    const avgScore = quizSubmissions.length > 0 
      ? (quizSubmissions.reduce((acc, s) => acc + (s.score / s.totalPossible), 0) / quizSubmissions.length) * 100
      : 0;

    return { questionAnalysis, avgScore };
  }, [quiz, quizSubmissions]);

  if (!quiz) return <div className="p-12 text-center">Quiz not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{quiz.title} Analytics</h1>
          <p className="text-slate-500">{quizSubmissions.length} Students responded</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Question-wise Accuracy (%)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.questionAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={12} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="percentage" name="Accuracy %" radius={[4, 4, 0, 0]}>
                    {stats?.questionAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentage > 70 ? '#10b981' : entry.percentage > 40 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold">Detailed Question Breakdown</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats?.questionAnalysis.map((qa, idx) => (
                <div key={idx} className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-medium text-slate-900">Q{idx + 1}: {qa.fullText}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${qa.percentage > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {Math.round(qa.percentage)}% Correct
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> {qa.correct} Correct</span>
                    <span className="flex items-center gap-1"><XCircle size={14} className="text-red-500" /> {qa.incorrect} Incorrect</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg shadow-indigo-200">
            <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Average Score</div>
            <div className="text-5xl font-black mb-4">{Math.round(stats?.avgScore || 0)}%</div>
            <p className="text-indigo-100 text-sm">Average achievement across all student submissions for this quiz.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Submission List</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {quizSubmissions.length === 0 ? (
                <p className="text-slate-400 text-center py-8 italic">No submissions yet.</p>
              ) : (
                quizSubmissions.sort((a, b) => b.score - a.score).map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-50 hover:bg-slate-50">
                    <div className="font-medium">{sub.studentName}</div>
                    <div className="text-indigo-600 font-bold">{sub.score}/{sub.totalPossible}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
