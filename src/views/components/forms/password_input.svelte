<script>
  export let inputName = 'password'
  export let id = 'password'
  export let label = 'Password'
  export let value = ''
  export let error = false
  export let errorMessage = ''
  export let helpText = ''
</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <span class="helper-text">{helpText}</span>
  <span class="error-text">{errorMessage}</span>
  <input
    bind:value
    on:input={() => (error = false)}
    type="password"
    name={inputName}
    {id}
    class:invalid={error}
    on:blur />
</div>
