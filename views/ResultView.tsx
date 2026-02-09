
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Quiz, Submission } from '../types';
import { CheckCircle2, XCircle, ChevronLeft, ArrowRight, Trophy } from 'lucide-react';
import { format } from 'date-fns';

interface ResultViewProps {
  quizzes: Quiz[];
  submissions: Submission[];
}

const ResultView: React.FC<ResultViewProps> = ({ quizzes, submissions }) => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = submissions.find(s => s.id === submissionId);
  const quiz = quizzes.find(q => q.id === submission?.quizId);

  if (!submission || !quiz) return <div className="p-12 text-center">Result not found.</div>;

  const percentage = Math.round((submission.score / submission.totalPossible) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Quiz Result</h1>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-50 text-center space-y-6">
        <div className="inline-flex p-6 bg-indigo-50 rounded-full mb-4">
          <Trophy size={64} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900">{percentage}%</h2>
          <p className="text-lg text-slate-500 font-medium">You scored {submission.score} out of {submission.totalPossible}</p>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="pt-4 flex justify-center gap-8 text-sm font-bold uppercase tracking-widest">
          <div className="text-green-600 flex items-center gap-2"><CheckCircle2 size={18} /> {submission.score} Correct</div>
          <div className="text-red-500 flex items-center gap-2"><XCircle size={18} /> {submission.totalPossible - submission.score} Incorrect</div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold px-4">Review Your Answers</h3>
        {quiz.questions.map((q, idx) => {
          const studentAns = submission.answers[q.id] || [];
          const isCorrect = 
            studentAns.length === q.correctAnswers.length &&
            studentAns.every(val => q.correctAnswers.includes(val));

          return (
            <div key={q.id} className={`p-8 rounded-2xl border ${isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {idx + 1}
                  </span>
                  <h4 className="text-lg font-bold">{q.text}</h4>
                </div>
                {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                {q.options.map((opt, oIdx) => {
                  const selectedByStudent = studentAns.includes(oIdx);
                  const isActuallyCorrect = q.correctAnswers.includes(oIdx);
                  
                  let style = "bg-white border-slate-200 text-slate-500";
                  if (isActuallyCorrect) style = "border-green-500 bg-green-100 text-green-900 ring-1 ring-green-500 font-bold";
                  if (selectedByStudent && !isActuallyCorrect) style = "border-red-500 bg-red-100 text-red-900 ring-1 ring-red-500 font-bold";

                  return (
                    <div key={oIdx} className={`p-4 rounded-xl border text-sm flex items-center justify-between ${style}`}>
                      {opt}
                      {isActuallyCorrect && <CheckCircle2 size={14} />}
                      {selectedByStudent && !isActuallyCorrect && <XCircle size={14} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-8">
        <Link 
          to="/"
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          Return to Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default ResultView;
