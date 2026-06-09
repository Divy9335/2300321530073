import * as React from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#00897b' }
  }
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AffordMed Notifications</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
