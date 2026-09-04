# add-ts-expect-error

Adds a `@ts-expect-error` comment above every type error in a TypeScript project,
with the error message inline.

Useful when you turn on `strict` (or bump TypeScript) and get a few hundred errors
at once: this gets the project compiling again and leaves each error documented in
place, so you can work through them one file at a time.

## Install

```sh
npm i -D add-ts-expect-error
```

Or run it once without installing:

```sh
npx add-ts-expect-error
```

## Usage

Run it from the directory holding your `tsconfig.json`:

```sh
npx add-ts-expect-error
```

It reads that `tsconfig.json`, collects the diagnostics for every source file in the
project, and rewrites the files in place. There are no flags.

**It edits your files.** Commit or stash first.

## What it does to your code

Before:

```ts
const total: number = getTotal()
```

After:

```ts
// @ts-expect-error: FIX: Type 'string' is not assignable to type 'number'.
const total: number = getTotal()
```

In JSX it uses the brace form, so the comment does not render as text:

```tsx
<div>
  {/* @ts-expect-error: FIX: Type 'string' is not assignable to type 'number'. */}
  <Widget count="not a number" />
</div>
```

Details:

- Comments are indented to match the line they annotate.
- Only errors are commented. Warnings and suggestions are left alone.
- When a line has more than one error, the comment reads
  `Multiple errors, uncomment to see.` Remove the comment to see them all.
- Lines that already carry the comment are skipped, so a second run does not stack
  them up.

## What it does not do

- No flags, no config, no file or directory filtering. It processes the whole project.
- It does not fix anything. Every comment it writes is a `FIX:` you still owe.
- It does not reformat. Run your formatter afterward if the inserted lines bother it.

## Why this exists

Airbnb's [ts-migrate](https://github.com/airbnb/ts-migrate) has a `reignore` command
that covers similar ground, as part of a larger JavaScript to TypeScript migration
framework. This is the narrow version: one command, one job, no migration pipeline
around it.

## Development

```sh
npm install
npm test
npm run build
```

Tests are Vitest, including end to end runs against a temporary project on disk.

## License

ISC, Steve Rodriguez.
