import Script from 'next/script';
 
export const GoogleAdSense = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  const PID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${PID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );