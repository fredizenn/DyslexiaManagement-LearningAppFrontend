<script>
    import { onMount } from 'svelte';
    import 'gridstack/dist/gridstack.min.css';
  
    let grid;
  
    const items = [
      { content: 'My first widget' },
      { w: 2, content: 'Another widget!' },
    ];
  
    onMount(async () => {
      const { GridStack } = await import('gridstack'); // Dynamically import gridstack
      grid = GridStack.init();
      grid.load(items);
  
      // Cleanup when component is destroyed
      return () => {
        if (grid) {
          grid.destroy();
        }
      };
    });
  </script>
  
  <style>
   
    .grid-stack-item-content {
      background-color: #18bc9c;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      padding: 10px;
      border-radius: 4px;
    }
  </style>
  
  <div class="grid-stack"></div>
  