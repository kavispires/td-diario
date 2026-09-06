import { signInWithGoogle } from '@services/firebase';
import { useMutation } from '@tanstack/react-query';
import type { UserCredential } from 'firebase/auth';

export function useLoginWithGoogle() {
  const { mutate, isPending, isError } = useMutation<
    UserCredential,
    Error,
    void,
    unknown
  >({
    mutationFn: async () => await signInWithGoogle(),
    onSuccess: () => {
      // Handle successful login here
    },
  });

  return { loginWithGoogle: mutate, isPending, isError };
}
