# Obsidian Counters

Counters, clocks and stopwatches for [Obsidian.md](https://obsidian.md/).

## Types of Counters

### Clock

"Clocks" are pie-chart-style counters with a configurable number of segments,
useful for tracking progress/steps. They were introduced in the
[Blades in the Dark](https://evilhat.com/product/blades-in-the-dark/) RPG
by [John Harper](https://twitter.com/john_harper).

TODO: Example clocks

### Counter

A number (defaulting to zero) with increment/decrement buttons next to it.
Further options let you configure what the starting value is, whether it can
go negative, and what increment/decrement quantities there are.

Alternately, you can explicitly add/subtract a specific number from the counter's
current value, similarly to adding/removing HP on your character sheet.

### Stopwatch

Keeps track of time. Duh. Initially at least, this will just be a "starting at
0:00:00" stopwatch, but might add lap times, timers, etc later on. You can add
multiple stopwatches, each with their own name. You should be able to pause or
reset them with a single click.

## Goals (work-in-progress)

### Counters Codeblock

Currently in work (because I know how to build these...)

Usage:
```counters
```

To render a panel with selectable counters, clocks, etc.

### Counters Sidebar

An Obsidian view/sidebar, like https://github.com/javalent/initiative-tracker,
that lets you add and remove counters of various kinds and give them names.
These counters are "global" to the plugin, and aren't tied to any specific page
or note, unlike the inline counters (see below).

This sidebar should support sections and make it really fast to add new counters,
since this is something that users need to be able to do on the fly at game time,
without slowing things down.

There should probably be commands for this as well so you can add (and increment)
counters without having to take your hands off of the keyboard.

### Inline Counters

#### Clocks

TODO: Inline examples

`clock 4` - Create a 4-segment clock, initially empty. The text will
automatically be updated to `clock 1/4`, `clock 2/4`, and so on as the clock
is incremented.

`clock 2/6` - Create a clock with 6 segments, 2 of them filled in.

`clock 4x6` - Create a series of 4 6-segment clocks (in a row), to track progress
over multiple-stages with sub-events.

`clock 2/4, 8, 4/6, 4` - Create a series of clocks: a 4-segment clock with 2
segments already filled, an empty 8-segment clock, a 6-segment clock with 4
segments filled, and a 4-segment clock.


`counter`

Creates a simple counter, with increment/decrement buttons and basic arithmetic
support.

`stopwatch`

Creates a stopwatch with start/pause/reset buttons.
