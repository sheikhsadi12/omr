/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OMRGenerator } from './components/OMRGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans overflow-hidden flex flex-col items-center justify-center relative p-4 md:p-8 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full h-full max-w-6xl flex flex-col gap-6">
        <OMRGenerator />
      </div>
    </div>
  );
}
