'use client';

import React from 'react';
import { Users, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'User';
  hasWriteAccess: boolean;
}

interface RoleManagementProps {
  users: PlatformUser[];
  onToggleAccess: (id: string) => void;
  onChangeRole: (id: string, newRole: PlatformUser['role']) => void;
}

export function RoleManagement({ users, onToggleAccess, onChangeRole }: RoleManagementProps) {
  return (
    <div className="bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
      <div>
        <h4 className="font-serif text-base sm:text-lg text-stone-900 font-light flex items-center gap-2">
          <Users className="w-5 h-5 text-stone-400 stroke-1" /> Governance System Roles
        </h4>
        <p className="text-[11px] text-stone-400 mt-0.5">Toggle live platform privileges and modify system authorization nodes.</p>
      </div>

      <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto pr-1">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-3 first:pt-0 last:pb-0">
            
            {/* ইউজার আইডি এবং ডিটেইলস */}
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 bg-stone-50 border border-stone-100 rounded-sm text-stone-400 shrink-0">
                <Shield className={`w-4 h-4 ${user.role === 'Manager' ? 'text-amber-700' : 'text-stone-400'}`} />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs sm:text-sm font-medium text-stone-900 truncate tracking-wide">{user.name}</h5>
                <p className="text-[10px] sm:text-xs text-stone-400 truncate font-mono">{user.email}</p>
              </div>
            </div>

            {/* ইন্টারেক্টিভ কন্ট্রোল টগলস */}
            <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-stone-50 pt-2 sm:border-t-0 sm:pt-0">
              
              {/* রোল ড্রপডাউন */}
              <select 
                value={user.role} 
                onChange={(e) => onChangeRole(user.id, e.target.value as PlatformUser['role'])}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-[10px] uppercase font-medium px-2 py-1 rounded-sm focus:outline-none"
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
              </select>

              {/* রাইট অ্যাক্সেস সুইচ নোড */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Write Mod</span>
                <button 
                  onClick={() => onToggleAccess(user.id)} 
                  className={`transition-colors focus:outline-none ${user.hasWriteAccess ? 'text-stone-950' : 'text-stone-300'}`}
                >
                  {user.hasWriteAccess ? (
                    <ToggleRight className="w-7 h-7 stroke-1" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 stroke-1" />
                  )}
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}