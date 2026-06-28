import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, RefreshCw, Moon, Sun } from 'lucide-react';
import { convertToBengali } from '../utils';

const OPTIONS = ['ক', 'খ', 'গ', 'ঘ'];
const MCQ_COUNTS = [10, 20, 25, 30, 50];

interface OMRGeneratorProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function OMRGenerator({ isDarkMode, toggleTheme }: OMRGeneratorProps) {
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
      <header className="flex items-center justify-between pt-8 pb-4 px-5 border-b border-[#e5d5c5] dark:border-[#4E070C] shrink-0">
        <h1 className="text-3xl font-black tracking-tighter text-[#a67c00] dark:text-[#d4af37] font-serif italic">
          Mutu OMR
        </h1>
        <button onClick={toggleTheme} className="p-2.5 rounded-full bg-[#f0e6d2] dark:bg-[#4E070C] text-[#3b1a1a] dark:text-[#d4af37] transition-colors shadow-sm">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-32">
        <div className="p-4 space-y-6">
          {/* Inputs Section */}
          <section className="bg-[#fffbf0] dark:bg-[#4E070C]/40 dark:backdrop-blur-md border border-[#f0e6d2] dark:border-[#d4af37]/20 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-[#a67c00] dark:text-[#d4af37] font-bold px-1">বিষয় (Subject)</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-[#3b1a1a] border border-[#f0e6d2] dark:border-[#6b2c2c] text-[#3b1a1a] dark:text-[#f3e5d8] focus:outline-none focus:ring-2 focus:ring-[#a67c00] dark:focus:ring-[#d4af37] transition-all shadow-sm dark:shadow-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-[#a67c00] dark:text-[#d4af37] font-bold px-1">মডেল টেস্ট নং</label>
              <input
                type="text"
                value={modelTestNo}
                onChange={(e) => setModelTestNo(e.target.value)}
                placeholder="e.g. 1"
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-[#3b1a1a] border border-[#f0e6d2] dark:border-[#6b2c2c] text-[#3b1a1a] dark:text-[#f3e5d8] focus:outline-none focus:ring-2 focus:ring-[#a67c00] dark:focus:ring-[#d4af37] transition-all shadow-sm dark:shadow-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-[#a67c00] dark:text-[#d4af37] font-bold px-1">প্রশ্ন সংখ্যা (MCQs)</label>
              <div className="relative">
                <select
                  value={mcqCount}
                  onChange={handleMcqCountChange}
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-[#3b1a1a] border border-[#f0e6d2] dark:border-[#6b2c2c] text-[#3b1a1a] dark:text-[#f3e5d8] focus:outline-none focus:ring-2 focus:ring-[#a67c00] dark:focus:ring-[#d4af37] transition-all appearance-none cursor-pointer shadow-sm dark:shadow-none"
                >
                  {MCQ_COUNTS.map((count) => (
                    <option key={count} value={count} className="bg-[#faf8f5] dark:bg-[#3b1a1a]">
                      {count} Questions
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a67c00] dark:text-[#d4af37]">
                  ▼
                </div>
              </div>
            </div>
          </section>

          {/* OMR Grid Section */}
          <section className="bg-[#fffbf0] dark:bg-[#4E070C]/40 dark:backdrop-blur-md border border-[#f0e6d2] dark:border-[#d4af37]/20 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#3b1a1a] dark:text-white/90">
                Answer Sheet
              </h2>
              <button
                onClick={resetSheet}
                className="flex items-center gap-1.5 text-xs text-[#8c6b6b] dark:text-white/50 hover:text-[#3b1a1a] dark:hover:text-white transition-colors py-1 px-2 rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="space-y-3">
              {Array.from({ length: mcqCount }).map((_, idx) => {
                const qNum = idx + 1;
                return (
                  <div key={qNum} className="flex items-center justify-between">
                    <span className="w-6 font-medium text-[#8c6b6b] dark:text-[#dcd0c0] font-mono text-sm">
                      {convertToBengali(qNum)}.
                    </span>
                    <div className="flex gap-3">
                      {OPTIONS.map((opt) => {
                        const isSelected = answers[qNum] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswerChange(qNum, opt)}
                            className={
                              isSelected
                                ? 'w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#4E070C] text-white border-none dark:bg-[#d4af37] dark:text-[#2a080c] font-bold scale-110 shadow-md transition-all cursor-pointer'
                                : 'w-[44px] h-[44px] rounded-full flex items-center justify-center bg-white border border-[#dcd0c0] text-[#5a3a3a] dark:bg-[#3b1a1a] dark:border-[#5a2a2a] dark:text-[#dcd0c0] transition-all cursor-pointer'
                            }
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Output Section */}
          <AnimatePresence>
            {generatedText && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#fffbf0] dark:bg-[#4E070C]/40 dark:backdrop-blur-md border border-[#f0e6d2] dark:border-[#d4af37]/20 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl p-5 flex flex-col relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#a67c00] dark:text-[#d4af37]">জেনারেটেড টেক্সট</h3>
                  <button
                    onClick={copyToClipboard}
                    className="bg-[#f0e6d2] hover:bg-[#e5d5c5] dark:bg-white/10 dark:hover:bg-white/20 text-[#3b1a1a] dark:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-transparent dark:border-white/10 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    কপি করুন
                  </button>
                </div>
                
                <div className="bg-white dark:bg-black/30 rounded-xl p-4 border border-[#e5d5c5] dark:border-white/5 overflow-x-auto shadow-inner dark:shadow-none">
                  <pre className="whitespace-pre-wrap leading-relaxed text-[#5a3a3a] dark:text-white/90 font-mono text-sm">
                    {generatedText}
                  </pre>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky Bottom Generate Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#faf8f5] dark:from-[#1a0505] to-transparent pt-12 pb-6 shrink-0 z-20 pointer-events-none">
        <button
          onClick={generateText}
          className="w-full bg-[#4E070C] hover:bg-[#3d0c02] dark:bg-gradient-to-r dark:from-[#b5852a] dark:to-[#d4af37] text-white dark:text-[#2a080c] font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 pointer-events-auto"
        >
          <Sparkles className="w-5 h-5" />
          টেক্সট জেনারেট করুন
        </button>
      </div>

      {/* Toast Alert Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#4E070C] dark:bg-[#2a080c] border border-transparent dark:border-[#d4af37]/30 text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl z-50 whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-[#d4af37]" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
