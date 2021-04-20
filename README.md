# locobss-privacy-sampling
An explorable explanation for understanding the identification of individuals from anonymized data sets 

This project is part of the research project LoCobSS. Learn more about the project in the central [documentation repository](https://github.com/sebastian-meier/locobss-documentation).

## Install

```bash
npm install
```

The website is build using [Svelte](https://svelte.dev/), written in [TypeScript](https://www.typescriptlang.org).

## Run

During development:

```bash
npm run dev
```

Build for deploy:

```bash
npm run build
```

## Note

Removing summary statistics from csv files
```regex
^.*\b(;Insgesamt;)\b.*$
```