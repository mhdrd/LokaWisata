"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, saveToken, saveUser } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.accessToken) {
      saveToken(data.accessToken);
    }
    if (data.user) {
      saveUser(data.user);
    }
    
    if (data.accessToken && data.user) {
      router.push('/dashboard');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">LokaWisata</h1>
          <p className="mt-2 text-sm text-gray-600">Masuk ke Dashboard Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" 
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Masuk</button>
        </form>
      </div>
    </div>
  );
}
