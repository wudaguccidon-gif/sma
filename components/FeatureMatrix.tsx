
import React from 'react';
import { FeatureGap } from '../types';

interface FeatureMatrixProps {
  features: FeatureGap[];
}

const FeatureMatrix: React.FC<FeatureMatrixProps> = ({ features }) => {
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'available' || s === 'yes') {
      return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
          <i className="fa-solid fa-check-circle mr-2"></i> Operational
        </div>
      );
    } else if (s === 'limited' || s === 'partial' || s === 'beta') {
      return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
          <i className="fa-solid fa-triangle-exclamation mr-2"></i> Limited
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">
          <i className="fa-solid fa-circle-xmark mr-2"></i> Signal Gap
        </div>
      );
    }
  };

  return (
    <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
      <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5">
        <div>
            <div className="flex items-center space-x-3 mb-2">
                <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Module 07. Matrix</span>
            </div>
          <h3 className="text-3xl font-black text-white tracking-tight">Capability Comparison</h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Forensic capability recognition via footprint analysis.</p>
        </div>
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational</span>
           </div>
           <div className="flex items-center space-x-2">
             <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/40"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Limited</span>
           </div>
           <div className="flex items-center space-x-2">
             <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/40"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gap</span>
           </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] w-1/3">Target Capabilities</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Operational Status</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Forensic Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {features.length > 0 ? features.map((item, i) => (
              <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-10 py-8">
                  <span className="font-black text-white text-lg block group-hover:text-indigo-400 transition-colors tracking-tight">{item.feature}</span>
                </td>
                <td className="px-10 py-8">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-10 py-8">
                  <p className="text-sm text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                    {item.description}
                  </p>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-10 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Awaiting capability signal...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureMatrix;
