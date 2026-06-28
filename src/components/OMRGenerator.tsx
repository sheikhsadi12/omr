import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { convertToBengali } from '../utils';

const OPTIONS = ['ক', 'খ', 'গ', 'ঘ'];
const MCQ_COUNTS = [10, 20, 25, 30, 50];

export function OMRGenerator() {
  const [subjectName, setSubjectName] = useState('');
  const [modelTestNo, setModelTestNo] = useState('');
  const [mcqCount, setMcqCount] = useState(10);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleAnswerChange = (questionIndex: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: prev[questionIndex] === option ? '' : option, // Toggle off if clicked again
    }));
  };

  const handleMcqCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(e.target.value, 10);
    setMcqCount(newCount);
    // Optionally clear answers that are now out of bounds
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      Object.keys(newAnswers).forEach((key) => {
        if (parseInt(key) > newCount) {
          delete newAnswers[parseInt(key)];
        }
      });
      return newAnswers;
    });
  };

  const resetSheet = () => {
    setAnswers({});
    setGeneratedText(null);
  };

  const generateText = () => {
    const subject = subjectName.trim() || '[Subject Name]';
    const testNo = modelTestNo.trim()
      ? convertToBengali(modelTestNo)
      : '[Model Test No]';

    let header = `${subject}\nমডেল টেস্ট ${testNo}\n`;

    const answersLine = [];
    for (let i = 1; i <= mcqCount; i++) {
      const num = convertToBengali(i);
      const ans = answers[i] || '_';
      answersLine.push(`${num}. ${ans}`);
    }

    setGeneratedText(header + answersLine.join('  '));
  };

  const copyToClipboard = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setToast('কপি করা হয়েছে! (Copied to clipboard!)');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast('কপি করতে সমস্যা হয়েছে! (Failed to copy)');
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#3d0c02]/40 backdrop-blur-xl border border-amber-500/20 p-6 rounded-3xl shadow-2xl gap-6">
        <div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto">
          <div className="space-y-1 flex-1 md:flex-none">
            <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-1">বিষয় (Subject)</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Physics"
              className="block bg-[#4E070C]/50 border border-amber-900/50 rounded-lg px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-amber-50 placeholder-amber-900/50"
            />
          </div>
          <div className="space-y-1 flex-1 md:flex-none">
            <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-1">মডেল টেস্ট নং</label>
            <input
              type="text"
              value={modelTestNo}
              onChange={(e) => setModelTestNo(e.target.value)}
              placeholder="e.g. 1"
              className="block bg-[#4E070C]/50 border border-amber-900/50 rounded-lg px-4 py-2 text-sm w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-amber-50 placeholder-amber-900/50"
            />
          </div>
          <div className="space-y-1 flex-1 md:flex-none">
            <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-1">প্রশ্ন সংখ্যা (MCQs)</label>
            <select
              value={mcqCount}
              onChange={handleMcqCountChange}
              className="block bg-[#4E070C]/50 border border-amber-900/50 rounded-lg px-4 py-2 text-sm w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all appearance-none text-amber-50 cursor-pointer"
            >
              {MCQ_COUNTS.map((count) => (
                <option key={count} value={count} className="bg-[#3d0c02]">
                  {count} Questions
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:items-end w-full md:w-auto">
          <h1 className="text-2xl font-black tracking-tighter text-white font-serif italic">Mutu <span className="text-amber-500">OMR</span></h1>
          <p className="text-[10px] text-amber-500/50">PREMIUM EDITION</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
        {/* OMR Sheet Grid */}
        <section className="md:col-span-8 bg-[#3d0c02]/40 backdrop-blur-xl border border-amber-500/20 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col min-h-[50vh]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500/70">
              Answer Sheet
            </h2>
            <button
              onClick={resetSheet}
              className="flex items-center gap-2 text-xs text-amber-500/70 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-900/30 border border-transparent hover:border-amber-700/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent">
            {Array.from({ length: mcqCount }).map((_, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={qNum}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#4E070C]/30 border border-transparent hover:border-amber-900/50 transition-colors"
                >
                  <span className="text-sm font-mono text-amber-500/50 w-8">
                    {convertToBengali(qNum)}.
                  </span>
                  <div className="flex gap-2">
                    {OPTIONS.map((opt) => {
                      const isSelected = answers[qNum] === opt;
                      return (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAnswerChange(qNum, opt)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-[#3d0c02] font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] transform scale-110'
                              : 'border-amber-900/50 text-amber-700 hover:border-amber-500/50 hover:text-amber-500 bg-white/5'
                          }`}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Output Section */}
        <aside className="md:col-span-4 flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateText}
            className="w-full py-5 md:py-6 rounded-2xl bg-gradient-to-r from-[#4E070C] to-amber-600 hover:from-[#3d0c02] hover:to-amber-500 text-amber-50 font-bold text-lg shadow-xl shadow-amber-900/30 transition-all border border-amber-500/30 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-white/20 to-amber-400/0 -translate-x-full group-hover:animate-shimmer" />
            <Sparkles className="w-5 h-5" />
            টেক্সট জেনারেট করুন
          </motion.button>

          <div className="flex-1 bg-[#3d0c02]/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 flex flex-col relative min-h-[250px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500/70">জেনারেটেড টেক্সট</h3>
              <button
                onClick={copyToClipboard}
                disabled={!generatedText}
                className="bg-[#4E070C] hover:bg-[#3d0c02] text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Copy className="w-3 h-3" />
                কপি করুন
              </button>
            </div>
            
            <div className="flex-1 font-mono text-sm text-amber-100/90 bg-black/40 rounded-xl p-4 border border-amber-900/30 overflow-y-auto">
              {generatedText ? (
                <pre className="whitespace-pre-wrap leading-loose selection:bg-amber-500/40 font-mono text-sm">
                  {generatedText.split('\n').map((line, i) => {
                    if (i === 0) return <p key={i} className="font-bold text-amber-400">[{line}]</p>;
                    if (i === 1) return <p key={i} className="mb-3 text-amber-200">{line}</p>;
                    return <p key={i} className="leading-loose text-amber-50">{line}</p>;
                  })}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-amber-900 text-xs text-center">
                  Select answers and click generate to see output here.
                </div>
              )}
            </div>

            {/* Toast Alert Overlay */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-amber-500/90 text-[#3d0c02] px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-amber-900/40 z-50 whitespace-nowrap"
                >
                  <Check className="w-4 h-4" />
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </main>

      {/* Footer Info */}
      <footer className="flex items-center justify-between px-2 text-[10px] text-amber-900 uppercase tracking-[0.2em] mt-auto hidden md:flex">
        <span>Cloud Sync Active</span>
        <span>Designed for Academic Excellence</span>
        <span>© 2024 Mutu OMR Labs</span>
      </footer>
    </>
  );
}
