<script lang="ts">
  // Dummy user activity data for graph
  type UserActivity = {
    id: number;
    name: string;
    logins: number;
    uploads: number;
    reportsReviewed: number;
  };

  let userActivities: UserActivity[] = [
    {
      id: 1,
      name: "Alice Johnson",
      logins: 12,
      uploads: 0,
      reportsReviewed: 0
    },
    {
      id: 2,
      name: "Bob Smith",
      logins: 3,
      uploads: 0,
      reportsReviewed: 0
    },
    {
      id: 3,
      name: "Charlie Brown",
      logins: 0,
      uploads: 5,
      reportsReviewed: 0
    },
    {
      id: 4,
      name: "Diana Prince",
      logins: 0,
      uploads: 0,
      reportsReviewed: 8
    },
    {
      id: 5,
      name: "sam Johnson",
      logins: 12,
      uploads: 0,
      reportsReviewed: 0
    },
    {
      id: 6,
      name: "flin Smith",
      logins: 3,
      uploads: 0,
      reportsReviewed: 0
    },
    {
      id: 7,
      name: "Charl Brown",
      logins: 0,
      uploads: 5,
      reportsReviewed: 0
    },
    {
      id: 8,
      name: "Diaa Prince",
      logins: 0,
      uploads: 0,
      reportsReviewed: 8
    }
  ];

  // For chart colors
  const colors = ["#6c47ff", "#ffd600", "#1a7f1a"];
  const yTicks = [0, 2, 4, 6, 8, 10, 12];
</script>

<h2 class="insights-heading"><b>User Insights</b></h2>
<div class="insights-scroll-container">
  <div class="user-insights-grid">
    {#each userActivities as user (user.id)}
      <div class="user-graph-container">
        <h3 class="user-graph-title">{user.name}</h3>
        <svg viewBox="0 0 300 220" width="100%" height="220" class="bar-chart">
          <!-- Y axis labels and grid -->
          {#each yTicks as y (y)}
            <text x="25" y={200 - y * 15 + 5} font-size="11" fill="#888">{y}</text>
            <line x1="40" y1={200 - y * 15} x2="280" y2={200 - y * 15} stroke="#ece9fc" stroke-width="1" />
          {/each}
          <!-- Logins bar -->
          <rect
            x="70"
            y={200 - user.logins * 15}
            width="32"
            height={user.logins * 15}
            fill={colors[0]}
            rx="4"
          />
          <!-- Uploads bar -->
          <rect
            x="120"
            y={200 - user.uploads * 15}
            width="32"
            height={user.uploads * 15}
            fill={colors[1]}
            rx="4"
          />
          <!-- Reports Reviewed bar -->
          <rect
            x="170"
            y={200 - user.reportsReviewed * 15}
            width="32"
            height={user.reportsReviewed * 15}
            fill={colors[2]}
            rx="4"
          />
          <!-- X axis labels -->
          <text x="86" y="215" font-size="12" fill="#333" text-anchor="middle">Logins</text>
          <text x="136" y="215" font-size="12" fill="#333" text-anchor="middle">Uploads</text>
          <text x="186" y="215" font-size="12" fill="#333" text-anchor="middle">Reports</text>
          <!-- Y axis -->
          <line x1="40" y1="0" x2="40" y2="200" stroke="#bbb" stroke-width="2" />
          <!-- X axis -->
          <line x1="40" y1="200" x2="280" y2="200" stroke="#bbb" stroke-width="2" />
        </svg>
        <div class="legend">
          <div class="legend-item"><span class="legend-color" style="background: #6c47ff"></span>Logins</div>
          <div class="legend-item"><span class="legend-color" style="background: #ffd600"></span>Uploads</div>
          <div class="legend-item"><span class="legend-color" style="background: #1a7f1a"></span>Reports Reviewed</div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .insights-heading {
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    margin-top: 1.2rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
    color: #333;
  }
  .insights-scroll-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    /* Height: fill available space but not too tall, adjust as needed */
    max-height: 55vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    /* For smooth scrolling on webkit browsers */
    scrollbar-width: thin;
    scrollbar-color: #b9aaff #ece9fc;
    background: transparent;
    box-sizing: border-box;
  }
  .insights-scroll-container::-webkit-scrollbar {
    width: 8px;
    background: #ece9fc;
    border-radius: 8px;
  }
  .insights-scroll-container::-webkit-scrollbar-thumb {
    background: #b9aaff;
    border-radius: 8px;
  }
  .user-insights-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2rem;
    padding: 1.5rem 0;
    margin: 0;
    /* Remove vertical overflow from grid itself, handled by parent */
    overflow: visible;
    box-sizing: border-box;
  }
  .user-graph-container {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }
  .user-graph-title {
    font-size: 1.18rem;
    font-weight: 600;
    color: #6c47ff;
    margin-bottom: 0.7rem;
    text-align: center;
    letter-spacing: 0.01em;
  }
  .bar-chart {
    width: 100%;
    max-width: 300px;
    background: transparent;
    display: block;
    margin-bottom: 1.1rem;
  }
  .legend {
    display: flex;
    gap: 1.2rem;
    margin-top: 0.2rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 0.98rem;
    color: #444;
    gap: 0.5rem;
  }
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: inline-block;
    margin-right: 0.3rem;
    border: 1.5px solid #ece9fc;
  }
  @media (max-width: 900px) {
    .insights-scroll-container {
      max-height: 60vh;
    }
    .user-insights-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
      padding: 0.7rem 0;
    }
    .user-graph-container {
      padding: 1.1rem 0.5rem;
    }
    .bar-chart {
      max-width: 100vw;
      height: 180px;
    }
    .legend {
      gap: 0.7rem;
      font-size: 0.95rem;
    }
  }
</style>
