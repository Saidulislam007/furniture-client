'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, CheckCircle2, UserCheck, Loader2, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
// সার্ভিস ফাংশনসমূহ
import { getAllUsers } from '@/services/api/getUsers';
import { updateProfileInBackend } from '@/services/api/updateProfile';

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'manager' | 'user';
}

const ITEMS_PER_PAGE = 6;

export default function RoleGovernancePage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const data = await getAllUsers();
        if (data) setUsers(data);
      } catch (error) {
        console.error("❌ Failed to resolve user governance pipeline:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  // রোল পরিবর্তনের হ্যান্ডলার
  const handleRoleChange = async (id: string, newRole: PlatformUser['role']) => {
    const userToUpdate = users.find(u => u._id === id);
    if (!userToUpdate) return;

    const payload = {
      name: userToUpdate.name,
      email: userToUpdate.email,
      role: newRole,
      ...(userToUpdate.image && { image: userToUpdate.image })
    };

    try {
      const success = await updateProfileInBackend(id, payload);
      if (success) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
        triggerToast(`Role for ${userToUpdate.name} updated to ${newRole.toUpperCase()}.`);
      } else {
        triggerToast("❌ Failed to sync role with server.");
      }
    } catch (error) {
      triggerToast("❌ Critical exception during role modification.");
    }
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query));
    }
    if (selectedRole !== 'all') {
      result = result.filter(u => u.role === selectedRole);
    }
    return result;
  }, [users, searchQuery, selectedRole]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
    <main className="w-full mx-auto px-4 py-8 font-sans min-h-screen">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 right-4 z-50 p-4 bg-stone-950 text-white text-xs border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <h3 className="font-serif text-2xl font-light text-stone-950 flex items-center gap-2 mb-6">
          <Users className="w-6 h-6" /> Dedicated Role Management
        </h3>

        {/* সার্চ ও ফিল্টার */}
        <div className="bg-white/60 border border-stone-200 rounded-xl p-3.5 flex flex-wrap gap-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="flex-1 h-10 px-4 bg-white border border-stone-200 text-xs rounded-lg" />
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="h-10 px-3 bg-white border border-stone-200 text-xs rounded-lg cursor-pointer">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* টেবিল */}
        {isLoading ? (
          <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[11px] uppercase font-semibold text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="p-6">AVATAR</th>
                  <th className="p-6">IDENTITY SPECS (USER)</th>
                  <th className="p-6">GOVERNANCE ROLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-200">
                        <img src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-stone-900">{user.name}</div>
                      <div className="text-sm text-stone-500">{user.email}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        {user.role === 'admin' ? <Shield className="w-4 h-4 text-stone-500" /> : <UserCheck className="w-4 h-4 text-stone-400" />}
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user._id, e.target.value as PlatformUser['role'])}
                          className="h-10 px-3 bg-white border border-stone-200 rounded-md text-sm cursor-pointer hover:border-stone-400 transition-colors"
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </main>
  );
}