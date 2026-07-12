import Script from "next/script";

// Session recording is gated to production so local dev sessions are not
// recorded.
export function ThirdPartyScripts() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script id="clarity-loader" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "xi8makl22u");`}
    </Script>
  );
}
