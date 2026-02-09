
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz, Question, QuestionType } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { Plus, Trash2, Sparkles, Save, ChevronLeft, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CreateQuizProps {
  onCreate: (quiz: Quiz) => void;
}

const CreateQuiz: React.FC<CreateQuizProps> = ({ onCreate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      text: '',
      type: 'single',
      options: ['', '', '', ''],
      correctAnswers: [0],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleAIInvite = async () => {
    if (!topic) return alert("Please enter a topic first!");
    setIsGenerating(true);
    try {
      const generated = await generateQuizQuestions(topic, 5);
      const withIds = generated.map((g: any) => ({ ...g, id: uuidv4() }));
      setQuestions([...questions, ...withIds]);
    } catch (error) {
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title || questions.length === 0) {
      alert("Please fill in the title and add at least one question.");
      return;
    }
    const newQuiz: Quiz = {
      id: uuidv4(),
      title,
      topic,
      durationMinutes: duration,
      dueDate: dueDate || new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      questions,
      createdBy: 'u1',
    };
    onCreate(newQuiz);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Quiz Title</label>
            <input 
              type="text" 
              placeholder="e.g. Modern Web Development Midterm"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Main Topic</label>
            <input 
              type="text" 
              placeholder="e.g. React Hooks"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Duration (Minutes)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Due Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold">Questions ({questions.length})</h2>
          <button 
            onClick={handleAIInvite}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Generate with AI
          </button>
        </div>

        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={q.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200 relative group animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => removeQuestion(q.id)}
                className="absolute -top-3 -right-3 p-2 bg-white text-red-500 border border-slate-200 rounded-full hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-grow space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Question {qIndex + 1}</label>
                    <input 
                      type="text" 
                      placeholder="Enter your question here..."
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    />
                  </div>
                  <div className="w-48 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                    >
                      <option value="single">Single Choice</option>
                      <option value="multiple">Multiple Choice</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input 
                        type={q.type === 'single' ? 'radio' : 'checkbox'} 
                        name={`q-${q.id}`}
                        checked={q.correctAnswers.includes(oIndex)}
                        onChange={() => {
                          let newAnswers = [...q.correctAnswers];
                          if (q.type === 'single') {
                            newAnswers = [oIndex];
                          } else {
                            if (newAnswers.includes(oIndex)) {
                              newAnswers = newAnswers.filter(a => a !== oIndex);
                            } else {
                              newAnswers.push(oIndex);
                            }
                          }
                          updateQuestion(q.id, { correctAnswers: newAnswers });
                        }}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <input 
                        type="text" 
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-grow px-3 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[oIndex] = e.target.value;
                          updateQuestion(q.id, { options: newOpts });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            onClick={addQuestion}
            className="flex-grow flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 p-4 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all font-semibold"
          >
            <Plus size={20} />
            Add Manual Question
          </button>
          <button 
            onClick={handleSave}
            className="sm:w-48 flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <Save size={20} />
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
