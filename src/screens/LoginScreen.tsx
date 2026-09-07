import { TDLogoIcon } from '@components/TDLogoIcon';
import { Button } from '@components/ui/Button';
import { TextInput } from '@components/ui/TextInput';
import { Text, Title } from '@components/ui/Typography';
import { signIn, signInWithGoogle } from '@services/firebase';
import { useMutation } from '@tanstack/react-query';
import { isDevEnv } from '@utils/helpers';
import type { UserCredential } from 'firebase/auth';
import { motion } from 'motion/react';
import { type SyntheticEvent, useState } from 'react';

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
          <Title>TD Diário</Title>
          <Text
            type="secondary"
            className="mt-2 text-center text-sm"
          >
            Sua dose diária de desafios e quebra-cabeças.
          </Text>
        </div>
      </div>

      {isDevEnv && <DevLoginForm />}

      {/* Action Area */}
      <div className="flex w-full flex-col items-center gap-4">
        <div className="w-full max-w-xs">
          <Button
            block
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 512 512"
                className="h-5 w-5"
                aria-hidden="true"
              >
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
            }
            onClick={() => loginWithGoogle()}
            loading={isPending}
          >
            Entrar com o Google
          </Button>
        </div>
        {error && (
          <Text
            type="danger"
            className="text-center text-sm"
            role="alert"
          >
            Não foi possível entrar. Tente novamente.
          </Text>
        )}
        <Text
          type="secondary"
          className="px-4 text-center text-[11px]"
        >
          Ao entrar, você concorda em salvar seu progresso e sequências na
          plataforma.
        </Text>
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

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    loginWithCredentials({ username, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-white/75 p-4 shadow-lg backdrop-blur-sm"
    >
      <Text
        strong
        className="text-center text-sm text-slate-800"
      >
        Desenvolvimento
      </Text>
      <label
        htmlFor="dev-username"
        className="flex flex-col gap-1 text-xs font-medium text-slate-700"
      >
        Usuário
        <TextInput
          id="dev-username"
          type="email"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          className="rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
        />
      </label>
      <label
        htmlFor="dev-password"
        className="flex flex-col gap-1 text-xs font-medium text-slate-700"
      >
        Senha
        <TextInput
          id="dev-password"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
        />
      </label>
      <Button
        type="submit"
        loading={isPending}
        className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
      >
        {isPending ? 'Entrando...' : 'Entrar com usuário'}
      </Button>
      {error && (
        <Text
          type="danger"
          className="text-center text-xs"
          role="alert"
        >
          Não foi possível entrar com essas credenciais.
        </Text>
      )}
    </form>
  );
}
