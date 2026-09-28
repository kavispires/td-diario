/**
 * Renders the initial splash screen shown while the app boots and the
 * user's authentication state is being resolved.
 *
 * @returns The splash screen element.
 */
export function SplashScreen() {
  return (
    <main
      className="flex w-full flex-col items-center justify-center gap-4 overflow-hidden text-sm text-foreground"
      aria-busy="true"
      aria-live="polite"
    >
      ...
    </main>
  );
}
