import Script from "next/script";

// Session-recording and visitor-tracking scripts carried over from the Framer
// site. Gated to production so local dev sessions are not recorded.
export function ThirdPartyScripts() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script id="smartlook" strategy="afterInteractive">
        {`window.smartlook||(function(d) {
var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
})(document);
smartlook('init', 'e4de8446333c51964db0618e808f9f215ac6192a', { region: 'eu' });`}
      </Script>

      <Script id="apollo" strategy="afterInteractive">
        {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
o.onload=function(){window.trackingFunctions.onLoad({appId:"682a44b18139bf0015d32b7a"})},
document.head.appendChild(o)}initApollo();`}
      </Script>

      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "tcwxr2bvry");`}
      </Script>
    </>
  );
}
