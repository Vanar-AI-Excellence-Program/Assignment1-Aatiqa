<script lang="ts">
  let cards: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
  let hoveredIdx: number | null = null;
</script>

<div class="centered-viewport">
  <div class="carousel-outer-centered">
    <div class="container-row-centered">
      {#each cards as card, idx (card)}
        <div
          class="center-container
            {idx === 1 && hoveredIdx !== 2 && hoveredIdx !== 0 ? 'center-front' : ''}
            {idx === 0 && hoveredIdx !== 2 && hoveredIdx !== 0 ? 'side left-container' : ''}
            {idx === 2 && hoveredIdx !== 2 && hoveredIdx !== 0 ? 'side right-container' : ''}
            {hoveredIdx === idx ? 'neon-front' : ''}
            {hoveredIdx !== null && hoveredIdx !== idx && (hoveredIdx === 2 || hoveredIdx === 0 || hoveredIdx === 1) ? 'side-dim' : ''}"
          tabindex="0"
          style="
            z-index: {hoveredIdx === 2
              ? (idx === 2 ? 3 : 1)
              : hoveredIdx === 0
                ? (idx === 0 ? 3 : 1)
                : hoveredIdx === 1
                  ? (idx === 1 ? 3 : 1)
                : (idx === 1 ? 2 : 1)};
            left: unset;
            margin-left: {idx === 0 ? '0' : idx === 1 ? '24px' : '24px'};
            margin-right: {idx === 2 ? '0' : '0'};
            transform: none;
            {card === 'center' ? "background-image: url('/secure.svg'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;" : ''}
            {card === 'left' ? "background-image: url('/left.svg'); background-size: 100% 100%; background-position:left; background-repeat: no-repeat; background-color: white;" : ''}
            {card === 'right' ? "background-image: url('/insight.svg'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;" : ''}
          "
          on:mouseenter={() => hoveredIdx = idx}
          on:mouseleave={() => hoveredIdx = null}
        >
          <div class="container-content-bottom">
            <h1 class="container-title">
              {#if card === 'left'}Your dashboard, your data — always in your hands.{/if}
              {#if card === 'center'}Your identity. Your control. Anytime{/if}
              {#if card === 'right'}One sign-in. Endless insights.{/if}
            </h1>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(html), :global(body) {
    background: url('/background.svg') no-repeat center center fixed !important;
    background-size: cover !important;
    overflow: hidden !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    overscroll-behavior: none !important;
  }

  .centered-viewport {
    min-height: 100vh;
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .carousel-outer-centered {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: auto;
    background: transparent;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .container-row-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin: 0 auto;
    position: relative;
    z-index: 0;
    width: auto;
    max-width: 98vw;
    min-height: 200px;
    overflow: visible;
  }

  .center-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    min-height: 32vh;
    max-width: 5100px;
    width: 460px;
    height: 250px;
    border-radius: 18px;
    flex: 0 0 460px;
    position: relative;
    top: 0;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 rgba(80, 0, 120, 0.08);
    background: #f9f9f9;
    border: 2.5px solid #e0e0e0;
    transition: box-shadow 0.5s cubic-bezier(0.4,0,0.2,1), border 0.3s, filter 0.3s, opacity 0.3s;
    will-change: box-shadow, filter, opacity;
    margin-left: 0 !important;
    margin-right: 0 !important;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
  }

  .container-content-bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 1.5rem;
    box-sizing: border-box;
    flex: 0 0 auto;
  }

   .secure-bg {
    background-image: url('/safesign.svg');
    position: relative;
    z-index: 0;
    } 
    

  .center-front {
    box-shadow: 0 12px 40px 0 rgba(80, 0, 120, 0.25), 0 2px 8px 0 rgba(80, 0, 120, 0.10);
    background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
    border: 2.5px solid #a084e8;
    z-index: 2;
    opacity: 1;
    filter: none;
  }
  .side.left-container {
    background: linear-gradient(120deg, #e0e7ff 0%, #f3e7fa 100%);
    filter: blur(1.5px) brightness(0.93);
    opacity: 0.82;
    z-index: 0;
    box-shadow: 0 2px 8px 0 rgba(80, 0, 120, 0.08);
    border: 2.5px solid #d1c4e9;
  }
  .side.right-container {
    background: linear-gradient(120deg, #e0e7ff 0%, #f3e7fa 100%);
    filter: blur(1.5px) brightness(0.93);
    opacity: 0.82;
    z-index: 0;
    box-shadow: 0 2px 8px 0 rgba(80, 0, 120, 0.08);
    border: 2.5px solid #d1c4e9;
  }

  .neon-front {
    box-shadow:
      0 0 16px 4px #a084e8,
      0 0 32px 8px #8ec5fc,
      0 12px 40px 0 rgba(80, 0, 120, 0.25),
      0 2px 8px 0 rgba(80, 0, 120, 0.10);
    background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
    border: 2.5px solid #a084e8;
    z-index: 3;
    opacity: 1;
    filter: none;
    transition: box-shadow 0.4s, border 0.3s, filter 0.3s, opacity 0.3s;
  }
  
  .side-dim {
    filter: blur(1px) brightness(0.85);
    opacity: 0.6;
    z-index: 1;
    transition: filter 0.3s, opacity 0.3s;
  }
  .hovered-effect {
    box-shadow: 0 8px 24px 0 rgba(80, 0, 120, 0.13);
    border-color: #a084e8;
    filter: brightness(1.05) blur(0.5px);
    opacity: 1;
  }
  
  .container-title {
    font-size: 1.5rem;
    color: #333;
    font-weight: 700;
    text-font:bold;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(160, 132, 232, 0.08);
    margin: 0;
    padding: 0 1rem;
    text-align: center;
    line-height: 1.1;
    width: 100%;
  }
  @media (max-width: 900px) {
    .container-row-centered {
      width: 98vw;
      gap: 8px;
    }
    .center-container {
      max-width: 98vw;
      width: 98vw;
      min-width: 220px;
      height: 120px;
      min-height: 80px;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .container-content-bottom {
      padding-bottom: 0.7rem;
    }
    .centered-viewport {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
