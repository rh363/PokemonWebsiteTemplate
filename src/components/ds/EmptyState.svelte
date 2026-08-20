<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './Icon.svelte'
  import type { IconName } from '~/lib/icons'

  let {
    icon = 'search' as IconName,
    title = undefined as string | undefined,
    description = undefined as string | undefined,
    action = undefined as Snippet | undefined,
    compact = false,
    style = '',
  } = $props()
</script>

<div class="ds-emptystate" class:ds-emptystate--compact={compact} {style}>
  <span class="ds-emptystate__icon">
    <Icon name={icon} size={24} />
  </span>
  <div class="ds-emptystate__text">
    <span class="ds-emptystate__title">{title}</span>
    {#if description}
      <span class="ds-emptystate__desc">{description}</span>
    {/if}
  </div>
  {@render action?.()}
</div>
