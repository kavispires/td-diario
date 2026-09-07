import { TDLogoIcon } from '@components/TDLogoIcon';
import { signIn, signInWithGoogle } from '@services/firebase';
import { useMutation } from '@tanstack/react-query';
import { isDevEnv } from '@utils/helpers';
import type { UserCredential } from 'firebase/auth';
import { motion } from 'motion/react';
import { type ChangeEvent, useState } from 'react';

export function LoginScreen() {
  const {
    mutate: loginWithGoogle,
    isPending,
    error,
  } = useMutation<UserCredential, Error, void, unknown>({
    mutationFn: async () => await signInWithGoogle(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-full w-full flex-col items-center justify-between px-6 pb-8 pt-12 text-slate-900"
    >
      {/* Top Branding / Logo */}
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <div style={{ perspective: 1000 }}>
            <TDLogoIcon
              className="w-24 h-24 drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] mb-6"
              static
            />
          </div>
          <h1 className="text-3xl font-extxl font-bold tracking-wide text-slate-900">
            TD Diário
          </h1>
          <p className="text-sm text-slate-700 mt-2 text-center">
            Sua dose diária de desafios e quebra-cabeças.
          </p>
        </div>
      </div>

      {isDevEnv && <DevLoginForm />}

      {/* Action Area */}
      <div className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="w-full max-w-xs bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg active:scale-95 transition-transform duration-200 flex items-center justify-center gap-3"
          disabled={isPending}
        >
          {/* Google G Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 0 512 512"
            className="w-5 h-5"
          >
            <title>Google logo</title>
            <path
              fill="#fbbb00"
              d="m113.47 309.4-17.82 66.54-65.14 1.38A255 255 0 0 1 0 256c0-42.45 10.32-82.48 28.62-117.73h.02l57.99 10.63 25.4 57.64a152 152 0 0 0-8.21 49.46c0 18.8 3.4 36.8 9.65 53.4"
            />
            <path
              fill="#518ef8"
              d="M507.53 208.18A256 256 0 0 1 512 256c0 18.33-1.93 36.2-5.6 53.45a256 256 0 0 1-90.13 146.19l-.02-.02-73.04-3.72-10.34-64.54a152.6 152.6 0 0 0 65.65-77.9h-136.9V208.17h245.9"
            />
            <path
              fill="#28b446"
              d="m416.25 455.62.02.02A255 255 0 0 1 256 512c-97.5 0-182.25-54.5-225.5-134.68l82.97-67.91c21.62 57.7 77.28 98.77 142.53 98.77 28.05 0 54.32-7.58 76.87-20.82z"
            />
            <path
              fill="#f14336"
              d="m419.4 58.94-82.93 67.9A151.3 151.3 0 0 0 256 103.81c-66.73 0-123.43 42.96-143.96 102.72l-83.4-68.27h-.02C71.23 56.12 157.06 0 256 0a255 255 0 0 1 163.4 58.94"
            />
          </svg>
          Entrar com o Google
        </button>
        {error && (
          <p
            className="text-center text-sm text-red-700"
            role="alert"
          >
            Não foi possível entrar. Tente novamente.
          </p>
        )}
        <p className="text-[11px] text-slate-700 text-center px-4">
          Ao entrar, você concorda em salvar seu progresso e sequências na
          plataforma.
        </p>
      </div>
    </motion.div>
  );
}

function DevLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {
    mutate: loginWithCredentials,
    isPending,
    error,
  } = useMutation<
    UserCredential,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signIn(username, password),
  });

  function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    loginWithCredentials({ username, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-white/75 p-4 shadow-lg backdrop-blur-sm mb-4"
    >
      <p className="text-center text-sm font-semibold text-slate-800">
        Desenvolvimento
      </p>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
        Usuário
        <input
          type="email"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
        Senha
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Entrando...' : 'Entrar com usuário'}
      </button>
      {error && (
        <p
          className="text-center text-xs text-red-700"
          role="alert"
        >
          Não foi possível entrar com essas credenciais.
        </p>
      )}
    </form>
  );
}
