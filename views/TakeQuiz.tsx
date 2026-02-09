
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, Submission, User } from '../types';
import { Clock, CheckCircle, Circle, AlertCircle, Volume2, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TakeQuizProps {
  quizzes: Quiz[];
  onSubmit: (submission: Submission) => void;
  user: User;
}

const TakeQuiz: React.FC<TakeQuizProps> = ({ quizzes, onSubmit, user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = quizzes.find(q => q.id === id);
  
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(quiz ? quiz.durationMinutes * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleFinish = useCallback(() => {
    if (!quiz) return;
    
    let totalScore = 0;
    quiz.questions.forEach(q => {
      const studentAns = answers[q.id] || [];
      const isCorrect = 
        studentAns.length === q.correctAnswers.length &&
        studentAns.every(val => q.correctAnswers.includes(val));
      if (isCorrect) totalScore++;
    });

    const submission: Submission = {
      id: uuidv4(),
      quizId: quiz.id,
      studentId: user.id,
      studentName: user.name,
      answers,
      score: totalScore,
      totalPossible: quiz.questions.length,
      timestamp: new Date().toISOString(),
      completed: true,
    };

    onSubmit(submission);
    navigate(`/result/${submission.id}`);
  }, [quiz, answers, user, onSubmit, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinish]);

  if (!quiz) return <div>Quiz not found.</div>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleAnswer = (qId: string, oIndex: number, type: 'single' | 'multiple') => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (type === 'single') {
        return { ...prev, [qId]: [oIndex] };
      } else {
        const next = current.includes(oIndex) 
          ? current.filter(i => i !== oIndex)
          : [...current, oIndex];
        return { ...prev, [qId]: next };
      }
    });
  };

  const readAloud = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToQuestion = (qId: string) => {
    scrollRefs.current[qId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {/* Question Status Sidebar */}
      <aside className="lg:w-80 lg:sticky lg:top-24 h-fit space-y-4 order-2 lg:order-1">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Progress</h3>
            <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((q, i) => {
              const answered = (answers[q.id] || []).length > 0;
              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all border
                    ${answered ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'}
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Attempted</span>
              <span className="font-bold">{Object.keys(answers).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Remaining</span>
              <span className="font-bold">{quiz.questions.length - Object.keys(answers).length}</span>
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </aside>

      {/* Questions Area (Google Form Style) */}
      <div className="flex-grow space-y-6 order-1 lg:order-2 pb-24">
        <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-indigo-100">{quiz.topic}</p>
        </div>

        {quiz.questions.map((q, idx) => (
          /* Fixed ref callback to return void by using braces, preventing TypeScript from seeing the assignment result as a return value */
          <div 
            key={q.id} 
            ref={el => { scrollRefs.current[q.id] = el; }}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-500"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                  {idx + 1}
                </span>
                <h3 className="text-xl font-medium leading-tight">{q.text}</h3>
              </div>
              <button 
                onClick={() => readAloud(q.text)}
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Read aloud"
              >
                <Volume2 size={20} />
              </button>
            </div>

            <div className="space-y-3 pl-12">
              {q.options.map((opt, oIdx) => {
                const isSelected = (answers[q.id] || []).includes(oIdx);
                return (
                  <button
                    key={oIdx}
                    onClick={() => toggleAnswer(q.id, oIdx, q.type)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                    `}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pl-12 text-xs font-bold uppercase tracking-wider text-slate-400">
              {q.type === 'single' ? 'Select one answer' : 'Select all that apply'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TakeQuiz;
