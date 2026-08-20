<script lang="ts">
  import { ICONS, type IconName } from '~/lib/icons'

  let {
    name = 'sparkles' as IconName,
    size = 20,
    label = undefined as string | undefined,
    style = '',
  } = $props()
</script>

<!--
  {@html} qui è sicuro: il contenuto arriva da src/lib/icons/index.ts, un file
  generato in fase di build da lucide-static (pacchetto npm), mai da input utente.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : 'presentation'}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  style="display:inline-block;flex:none;{style}">{@html ICONS[name]}</svg
>
