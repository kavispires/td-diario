import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMillisecondsUntilTomorrow, getToday } from '@utils/helpers';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Added setDoc
import { useEffect } from 'react';
import { firestore } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { DailyUser } from '../types/user';

export function useGetDailyUserData() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // The user is refreshed every midnight, so we need to invalidate the query at that time
  useEffect(() => {
    if (!user?.uid) return;
    const msUntilMidnight = getMillisecondsUntilTomorrow();

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['dailyUser', user.uid] });
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [user?.uid, queryClient]);

  return useQuery({
    queryKey: ['dailyUser', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('No user ID');

      const docRef = doc(firestore, 'dailyUsers', user.uid);
      const docSnap = await getDoc(docRef).catch((error) => {
        // TODO: Use try/catch
        throw error;
      });

      if (docSnap.exists()) {
        return docSnap.data() as DailyUser;
      }

      const todayString = getToday();

      const newUser: DailyUser = {
        uid: user.uid,
        displayName: user.displayName || 'Jogador',
        avatarUrl: user.photoURL || '',
        createdAt: Date.now(),
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDate: '',
        today: {
          date: todayString,
          results: {},
        },
        stats: {},
      };

      await setDoc(docRef, newUser);
      return newUser;
    },
    enabled: !!user?.uid,
  });
}
