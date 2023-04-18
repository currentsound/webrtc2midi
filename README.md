# webrtc2midi

Send and receive MIDI data using WebRTC, creating a virtual MIDI cable from one device (e.g. tablet or smartphone) to another device (e.g. your computer). 

Use this to create a wireless MIDI connection from an web-app on your smartphone to a DAW on your computer.

## Getting started

1. Create a [virtual MIDI cable](https://www.tobias-erichsen.de/software/loopmidi.html)
2. Go to https://markmarijnissen.com/webrtc2midi/ on your browser
3. Write a unique ID and configure set the virtual MIDI cable as output.
4. Go to https://markmarijnissen.com/webrtc2midi/faders/ on your (smartphone) browser.
5. Enter the unique ID and click 'connect'




## Setup

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more. 

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
