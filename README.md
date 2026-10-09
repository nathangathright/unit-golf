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

```sh
unit-golf 57.3vw
unit-golf 57.3vw --tolerance 0
unit-golf 57.3vw --json
```

The length may be any signed whole or fractional number using one of these units:

`px, vw, vh, in, cm, mm, pt, pc, em, ex, q, ch, lh, cap`

If the unit is omitted (for example, `unit-golf 325`), it defaults to pixels.

## Options

```text
--tolerance <pixels>  Maximum permitted pixel error (default: 0.2)
--width <pixels>      Viewport width (default: 400)
--height <pixels>     Viewport height (default: 300)
--json                Print a machine-readable result
-h, --help            Show help
-V, --version         Show version
```

## Examples

```console
$ unit-golf 108px

⛳  6lh

27vw
36vh
81pt
108px
…
```

Use `--json` when calling Unit Golf from an agent or script:

```sh
unit-golf 57.3vw --json > result.json
```

The response includes the normalized request, target pixel value, best candidate,
remaining alternatives, pixel errors, and tolerance status.

Successful JSON responses exit with status `0`. Invalid input returns a structured
error on standard error and exits with status `2`. Unexpected failures exit with
status `1`.

Parentheses indicate how many pixels each suggestion differs from the target.

Unit Golf calculates absolute and viewport units from their CSS-defined ratios.
Font-relative units use a checked-in profile calibrated against Chromium's
default document styles. This keeps normal conversions deterministic and avoids
launching a browser.

## Development

```sh
yarn install
yarn test
```

Unit Golf has no runtime dependencies or build step.

## License

[MIT](LICENSE) © 2019 Alex Zaworski.
