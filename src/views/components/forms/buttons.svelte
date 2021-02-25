<script>
  export let cancelText = 'Cancel'
  export let cancelButton = true
  export let submitText = 'Submit'
  export let id = ''
  export let isLoading = false
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const cancelAction = event => {
    event.preventDefault()
    dispatch('cancel')
  }
</script>

<div class="field form-buttons">
  {#if cancelButton}
    <button type="button" {id} on:click={cancelAction} class="btn cancel">{cancelText}</button>
  {/if}
  {#if isLoading}
    <div class="preloader">
      Loading...
    </div>
  {:else}
    <button type="submit" {id} class="btn">{submitText} </button>
  {/if}
</div>
