<script type="ts">
    export let segments: number;
    export let filled: number;

    const radius = 50;

    function slices(segments: number, filled: number) {
        const ss = [];

        for (let i = 0; i < segments; ++i) {
            const x1 = radius * Math.sin((2 * Math.PI * i) / segments) + radius;
            const x2 =
                radius * Math.sin((2 * Math.PI * (i + 1)) / segments) + radius;

            const y1 =
                -radius * Math.cos((2 * Math.PI * i) / segments) + radius;
            const y2 =
                -radius * Math.cos((2 * Math.PI * (i + 1)) / segments) + radius;

            ss.push({
                x1,
                x2,
                y1,
                y2,
                isFilled: i < filled,
            });
        }

        return ss;
    }

    function increment() {
        filled += 1;
        if (filled > segments) {
            filled = 0;
        }
    }

    function decrement() {
        filled -= 1;
        if (filled < 0) {
            filled = segments;
        }
    }

    function handleClick(e) {
        console.log(e);
    }
</script>

<div class="counters-clock">
    <svg
        data-counters-segments={segments}
        data-counters-filled={filled}
        xmlns="http://www.w3.org/2000/svg"
        viewbox="0 0 {2 * radius} {2 * radius}"
        width="10em"
        height="10em"
        on:click={increment}
        on:contextmenu={decrement}
    >
        {#each slices(segments, filled) as { x1, x2, y1, y2, isFilled }, i}
            <!-- TODO: figure out how to add white-stroked lines between filled-in segments -->
            <path
                data-counters-segment-index={i}
                data-counters-filled={isFilled}
                fill={isFilled ? "black" : "white"}
                stroke="black"
                d="
            M {radius} {radius}
            L {x1} {y1}
            A {radius} {radius} 0 0 1 {x2} {y2}
            Z"
            />
        {/each}
    </svg>
</div>
