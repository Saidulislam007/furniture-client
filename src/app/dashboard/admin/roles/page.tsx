'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { RoleManagement, PlatformUser } from '@/components/dashboard/admin/RoleManagement';

const initialUsers: PlatformUser[] = [
  { id: "USR-01", name: "Imran Ahmed", email: "imran.hero@digitools.com", role: "Manager", hasWriteAccess: true },
  { id: "USR-02", name: "Zayan Khan", email: "zayan.design@digitools.com", role: "Manager", hasWriteAccess: false },
  { id: "USR-03", name: "Tasnim Rahman", email: "tasnim.dev@gmail.com", role: "User", hasWriteAccess: false },
];

export default function RoleGovernancePage() {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-stone-950 stroke-1" /> Dedicated Role Management
          </h3>
          <p className="text-xs text-stone-950 mt-1">Isolate and fine-tune permissions for administrative and general node access.</p>
        </div>
        <RoleManagement 
          users={users} 
          onToggleAccess={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, hasWriteAccess: !u.hasWriteAccess } : u))}
          onChangeRole={(id, role) => setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))}
        />
      </motion.div>
    </main>
  );
}