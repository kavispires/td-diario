import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import {
  AudioLines,
  CheckCheck,
  Grid2x2,
  Heart,
  ScanEye,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { DailyInvestigacaoStatement } from 'types/games';
import {
  STATEMENT_CARD_ANIMATION_DELAY_STEP,
  STATEMENT_CARD_ANIMATION_DURATION_SECONDS,
  STATEMENT_CARD_ANIMATION_Y_OFFSET,
} from '../utils/constants';
import { isStatementComplete } from '../utils/helpers';

/**
 * Props accepted by the {@link Statements} component.
 */
type StatementsProps = {
  /**
   * Main clue list currently visible to the player.
   */
  statements: DailyInvestigacaoStatement[];
  /**
   * Extra clue list currently revealed by hearts.
   */
  additionalStatements: DailyInvestigacaoStatement[];
  /**
   * Suspect ids already released in the current run.
   */
  released: string[];
};

/**
 * Renders Investigação's currently visible clue cards, preserving the
 * original game's reversed reveal order and completion highlighting.
 *
 * @param props Visible clue lists plus the current released suspects.
 * @returns The rendered statement stack.
 */
export function Statements({
  statements,
  additionalStatements,
  released,
}: StatementsProps) {
  return (
    <div className="flex flex-col gap-2">
      {statements.map((statement, index) => (
        <StatementCard
          key={statement.key}
          statement={statement}
          released={released}
          index={index}
          variant="main"
        />
      ))}

      {additionalStatements.map((statement, index) => (
        <StatementCard
          key={statement.key}
          statement={statement}
          released={released}
          index={statements.length + index}
          variant="bonus"
        />
      ))}
    </div>
  );
}

/**
 * Props accepted by the {@link StatementCard} component.
 */
type StatementCardProps = {
  /**
   * Statement data to render.
   */
  statement: DailyInvestigacaoStatement;
  /**
   * Suspect ids already released in the current run.
   */
  released: string[];
  /**
   * Position used to stagger the entry animation.
   */
  index: number;
  /**
   * Whether the card is a normal clue or a heart-spent bonus clue.
   */
  variant: 'main' | 'bonus';
};

function StatementCard({
  statement,
  released,
  index,
  variant,
}: StatementCardProps) {
  const complete = isStatementComplete(statement.excludes, released);
  const Icon = complete
    ? CheckCheck
    : getStatementIcon(statement.type, variant);

  return (
    <motion.div
      initial={{ opacity: 0, y: STATEMENT_CARD_ANIMATION_Y_OFFSET }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: STATEMENT_CARD_ANIMATION_DURATION_SECONDS,
        ease: 'easeOut',
        delay: index * STATEMENT_CARD_ANIMATION_DELAY_STEP,
      }}
      className={cn(
        'flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm',
        complete
          ? 'border-secondary bg-secondary-soft'
          : variant === 'bonus'
            ? 'border-destructive/20 bg-destructive/8'
            : 'border-border bg-surface',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          complete
            ? 'bg-secondary text-chrome'
            : variant === 'bonus'
              ? 'bg-destructive/12 text-destructive'
              : 'bg-primary-soft text-primary',
        )}
      >
        <Icon
          className="h-4 w-4"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        <Text
          strong
          className="block text-sm"
        >
          {statement.text}
        </Text>
      </div>
    </motion.div>
  );
}

function getStatementIcon(
  type: DailyInvestigacaoStatement['type'],
  variant: StatementCardProps['variant'],
) {
  if (variant === 'bonus') {
    return Heart;
  }

  switch (type) {
    case 'testimony':
      return AudioLines;
    case 'feature':
      return ScanEye;
    case 'grid':
      return Grid2x2;
    default:
      return Search;
  }
}
