# Contratti dei componenti del design system

Estratto da `_adherence.oxlintrc.json` del progetto Claude Design.

Quel file è una configurazione oxlint con selettori `JSXOpeningElement`: valida codice
React e **non può lintare Svelte**, quindi non è stato vendorizzato verbatim. La parte
che conta — le prop ammesse e i valori ammessi per ciascuna prop — è qui, ed è la
specifica autorevole dell'API di ogni componente per i task di porting (9-14).

Regola generale del design system: **ogni componente accetta anche `style`**, e le prop
elencate sono le uniche dichiarate. Una prop non in elenco è un errore, non un'estensione.

## Core

| Componente | Prop | Valori vincolati |
|---|---|---|
| `Badge` | `tone`, `uppercase`, `icon`, `children`, `style` | `tone`: neutral · brand · accent · success · warning · danger · foil · invert |
| `Button` | `variant`, `size`, `icon`, `iconRight`, `fullWidth`, `disabled`, `as`, `href`, `onClick`, `children`, `style` | `variant`: primary · secondary · ghost · foil · invert<br>`size`: sm · md · lg<br>`as`: button · a |
| `Chip` | `selected`, `count`, `icon`, `onClick`, `onRemove`, `disabled`, `children`, `style` | — |
| `Icon` | `name`, `size`, `color`, `label`, `style` | — |
| `IconButton` | `icon`, `variant`, `size`, `label`, `active`, `disabled`, `onClick`, `style` | `variant`: secondary · ghost · brand · invert<br>`size`: sm · md · lg |
| `Panel` | `variant`, `padding`, `hoverLift`, `as`, `children`, `style` | `variant`: card · sunken · sticker · invert · foil<br>`as`: div · section · article · a · li |
| `Tooltip` | `label`, `side`, `children`, `style` | `side`: top · bottom · left · right |

## Catalogo

| Componente | Prop | Valori vincolati |
|---|---|---|
| `CardArt` | `src`, `alt`, `rarity`, `code`, `foil`, `sheen`, `radius`, `style` | `rarity`: common · uncommon · rare · holo · ultra · secret |
| `CardTile` | `name`, `code`, `set`, `rarity`, `src`, `liked`, `onLike`, `onClick`, `badge`, `tilt`, `style` | `rarity`: come sopra |
| `RarityBadge` | `rarity`, `showLabel`, `size`, `style` | `rarity`: come sopra<br>`size`: sm · md |
| `ConditionBadge` | `condition`, `compact`, `style` | `condition`: mint · near-mint · excellent · good · played |
| `SpecList` | `items`, `dense`, `style` | — |
| `FilterGroup` | `title`, `activeCount`, `defaultOpen`, `children`, `style` | — |

## Form

| Componente | Prop | Valori vincolati |
|---|---|---|
| `Input` | `label`, `hint`, `error`, `icon`, `suffix`, `size`, `placeholder`, `value`, `defaultValue`, `type`, `disabled`, `onChange`, `style` | `size`: sm · md · lg |
| `SearchField` | `value`, `onChange`, `onClear`, `placeholder`, `size`, `suggestions`, `onPick`, `style` | `size`: md · lg |
| `Select` | `label`, `value`, `options`, `onChange`, `size`, `disabled`, `style` | `size`: sm · md |
| `Checkbox` | `checked`, `label`, `description`, `count`, `disabled`, `onChange`, `style` | — |
| `Switch` | `checked`, `label`, `disabled`, `onChange`, `style` | — |

## Feedback

| Componente | Prop | Valori vincolati |
|---|---|---|
| `Dialog` | `open`, `title`, `eyebrow`, `footer`, `onClose`, `width`, `children`, `style` | — |
| `Toast` | `tone`, `title`, `description`, `action`, `onClose`, `style` | `tone`: neutral · success · brand · danger |
| `EmptyState` | `icon`, `title`, `description`, `action`, `compact`, `style` | — |
| `Skeleton` | `shape`, `width`, `height`, `count`, `style` | `shape`: line · title · circle · card |

## Navigazione

| Componente | Prop | Valori vincolati |
|---|---|---|
| `NavBar` | `items`, `active`, `onNavigate`, `right`, `logoSrc`, `brand`, `sticky`, `style` | — |
| `Tabs` | `items`, `value`, `onChange`, `variant`, `style` | `variant`: underline · pill |
| `Pagination` | `page`, `pages`, `onChange`, `style` | — |
| `Breadcrumb` | `items`, `onNavigate`, `style` | — |

## Regole di aderenza che restano valide nel porting

Il file originale imponeva anche tre vincoli sul codice, che valgono ancora, tradotti:

1. **Niente colori esadecimali grezzi.** Ogni colore passa da un token via `var(--…)`.
   Unica eccezione: i file in `src/styles/tokens/`, che i token li definiscono.
2. **Niente valori `px` grezzi** dove esiste un token di spaziatura. Restano ammessi i
   valori che la sorgente stessa scrive come numeri nudi (per esempio `gap: 12` in
   `CardTile`): la regola è fedeltà alla sorgente, non normalizzazione.
3. **Solo tre famiglie di caratteri**: Bricolage Grotesque, Plus Jakarta Sans,
   JetBrains Mono — sempre via `var(--font-display|body|mono)`.
