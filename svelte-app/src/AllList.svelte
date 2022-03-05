<script>
    import data_all from './data_all.js';
</script>

<h3>All Patch List</h3>
<table class="s-table">
    <thead>
        <tr><th>Name</th><th>Version</th><th>Entry Date</th></tr>    
    </thead>
    <tbody>
        {#each data_all as { name, version, check_date }, i}
        <tr><th>{name}</th><th>{version}</th><th>{check_date}</th></tr>    
        {/each}
    </tbody>
</table>

<style>
  .s-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
  .s-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    text-transform: uppercase;
  }
  .s-table th,
  .s-table td {
    padding: 12px 15px;
    text-align: left;
  }

  .s-table tbody tr {
    border-bottom: 1px solid #dddddd;
    }

    .s-table tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }

    .s-table tbody tr:last-of-type {
        border-bottom: 2px solid #009879;
    }  
</style>
