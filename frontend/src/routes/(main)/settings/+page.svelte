<script>
    import SetPinPopup from "../../../components/SetPinPopup.svelte";
    const {data} = $props()    
</script>

<div class="px-20 py-20 flex flex-col justify-center">
    <SetPinPopup account_id={data.account._id}/>
    <hr />
</div>
