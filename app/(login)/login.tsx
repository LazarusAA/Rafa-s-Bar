'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  
  const action = mode === 'signin' ? signIn : signUp;
  
  const [state, formAction, pending] = useActionState(action, { error: '' });

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-rafa-base text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
           <h1 className="text-4xl font-black tracking-tighter text-white">
              RAFA'S <span className="text-imperial">BAR</span>
           </h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-100">
          {mode === 'signin'
            ? 'Staff Login'
            : 'Staff Registration'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-rafa-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-800">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-500 bg-zinc-900 text-white focus:outline-none focus:ring-imperial focus:border-imperial sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-500 bg-zinc-900 text-white focus:outline-none focus:ring-imperial focus:border-imperial sm:text-sm"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm text-center">{state.error}</div>
            )}
            {/* @ts-ignore - handling success property dynamically */}
            {state?.success && (
               // @ts-ignore
              <div className="text-green-500 text-sm text-center">{state.success}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-imperial hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-imperial disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : mode === 'signin' ? (
                  'Sign in'
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-rafa-card text-zinc-500">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
               <Link
                 href={mode === 'signin' ? '/sign-up' : '/sign-in'}
                 className="w-full flex justify-center py-2 px-4 border border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
               >
                 {mode === 'signin' ? 'Create account' : 'Sign in'}
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
