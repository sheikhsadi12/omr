/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OMRGenerator } from './components/OMRGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-[#3d0c02] bg-[radial-gradient(ellipse_at_top,_#4E070C,_#3d0c02_80%)] text-amber-50 font-sans flex flex-col items-center justify-center relative p-4 md:p-8 selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl flex flex-col gap-6 flex-1 relative">
        <OMRGenerator />
      </div>
    </div>
  );
}
