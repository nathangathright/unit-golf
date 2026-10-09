# Unit Golf

Shortens CSS lengths for [CSSBattle](https://cssbattle.dev/).

> **Fork notice:** `nathangathright/unit-golf` is Nathan Gathright's maintained fork of
> [Alex Zaworski's original project](https://github.com/alexzaworski/unit-golf).
> The fork isn't published to npm. Installing `unit-golf` from npm installs the
> original release.

## Installation

Install this fork directly from GitHub:

```sh
npm install --global github:nathangathright/unit-golf
```

Requires Node.js 22.12 or newer.

## Usage

`$ unit-golf [VALUE_TO_CONVERT]`

Where `VALUE_TO_CONVERT` is any signed whole or fractional number of the following units:

`px, vw, vh, in, cm, mm, pt, pc, em, ex, q, ch, lh, cap`

If the unit is omitted (for example, `unit-golf 325`), it defaults to pixels.

### Options

#### `--tolerance`

Maximum difference in pixels that will be considered a match for a value. Defaults to `0.2`. Decreasing will yield more exact but less concise results and vice versa.

#### `--width`

Viewport width for the purpose of calculating vw units. Defaults to `400`, which is what CSSBattle currently uses.

#### `--height`

Viewport height for the purpose of calculating vh units. Defaults to `300`, which is what CSSBattle currently uses.

### Examples

```
$ unit-golf 57.3vw

⛳  172pt (+0.13px)

229px (-0.2px)
57.3vw
76.4vh
242.6q (+0.03px)
60.6mm (-0.16px)
6.06cm (-0.16px)
…
```

```
$ unit-golf 57.3vw --tolerance 0

⛳  57.3vw

76.4vh
229.2px
171.9pt
…
```

Parentheses indicate how many pixels each suggestion differs from the target.

Unit Golf calculates absolute and viewport units from their CSS-defined ratios.
Font-relative units use a checked-in profile calibrated against Chromium's
default document styles. This keeps normal conversions deterministic and avoids
launching a browser.

## Development

Unit Golf requires Node.js 22.12 or newer.

```sh
yarn install
yarn test
```

To print a freshly calibrated font-unit profile:

```sh
yarn calibrate:profile
```

## License

[MIT](LICENSE) © 2019 Alex Zaworski.
