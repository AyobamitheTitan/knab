<script>
  const {history} = $props();
</script>

<div
  class="max-h-56 relative flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
  <table class="w-full text-left min-w-max rtl:text-right">
    <thead class="text-xs uppercase bg-gray-50 sticky top-0">
      <tr>
        <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
          <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
            S/N
          </p>
        </th>
        <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
          <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
            Transaction Type
          </p>
        </th>
        <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
          <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
            Amount
          </p>
        </th>
        <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
          <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
            Status
          </p>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 overflow-y-auto">
      {#each history as item, i }
        <tr>
        <td class="p-4">
          <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {i+1}
          </p>
        </td>
        <td class="p-4">
          <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {item.type}
          </p>
        </td>
        <td class="p-4">
          <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {item.amount}
          </p>
        </td>
                <td class="p-4">
          <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {item.status}
          </p>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>