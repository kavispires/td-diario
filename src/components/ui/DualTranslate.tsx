import { useDualTranslate } from '@hooks/useDualTranslate';

type DualTranslateProps = {
  /**
   * The dual language text object
   */
  children:
    | DualLanguageValue<string>
    | { en: React.ReactNode; pt: React.ReactNode };
};

/**
 * Renders the appropriate text or element based on the current active language (English or Portuguese)
 */
export function DualTranslate({ children }: DualTranslateProps) {
  const translate = useDualTranslate();

  return <>{translate(children)}</>;
}
