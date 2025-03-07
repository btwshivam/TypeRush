import CodeMode from './CodeMode';
import QuoteMode from './QuoteMode';
import ZenMode from './ZenMode';
import SurvivalMode from './SurvivalMode';
import RaceMode from './RaceMode';

export const gameModes = [
  {
    id: 'code',
    name: 'Code Mode',
    description: 'Practice typing code snippets in various programming languages',
    component: CodeMode,
    icon: 'FaCode',
    color: 'blue'
  },
  {
    id: 'quote',
    name: 'Quote Mode',
    description: 'Type famous quotes from historical figures and literature',
    component: QuoteMode,
    icon: 'FaQuoteRight',
    color: 'purple'
  },
  {
    id: 'zen',
    name: 'Zen Mode',
    description: 'Relaxed typing practice without pressure or time limits',
    component: ZenMode,
    icon: 'FaLeaf',
    color: 'teal'
  },
  {
    id: 'survival',
    name: 'Survival Mode',
    description: 'Type words before time runs out, with increasing difficulty',
    component: SurvivalMode,
    icon: 'FaHeartbeat',
    color: 'red'
  },
  {
    id: 'race',
    name: 'Race Mode',
    description: 'Race against time to complete entire paragraphs',
    component: RaceMode,
    icon: 'FaFlag',
    color: 'yellow'
  }
];

export {
  CodeMode,
  QuoteMode,
  ZenMode,
  SurvivalMode,
  RaceMode
};

export default gameModes; 