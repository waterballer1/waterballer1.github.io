/* =========================================================
   WEBSITE TRACKER
   Google Apps Script endpoint
========================================================= */

const TRACKING_URL =
  "https://script.google.com/macros/s/AKfycbwqGxnBTWbRuOG-l2xVRGOP2PVn4X63KjFtIY76ft3_pDDDqCij9OYl6VcQf6hrCqdJ/exec";


/* =========================================================
   SESSION ID
========================================================= */

let sessionId =
  sessionStorage.getItem("new_site_session_id");

if (!sessionId) {

  sessionId =
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2);

  sessionStorage.setItem(
    "new_site_session_id",
    sessionId
  );
}


/* =========================================================
   SEND EVENT TO GOOGLE SHEETS
========================================================= */

function track(
  event,
  field = "",
  value = ""
) {

  if (!TRACKING_URL) {
    return;
  }


  const params =
    new URLSearchParams();


  params.set(
    "session_id",
    sessionId
  );


  params.set(
    "event",
    event
  );


  params.set(
    "field",
    field
  );


  params.set(
    "value",
    String(value ?? "")
  );


  /*
    First attempt:
    sendBeacon is useful when the browser is
    about to navigate to another page.
  */

  try {

    const blob =
      new Blob(
        [
          params.toString()
        ],
        {
          type:
            "application/x-www-form-urlencoded;charset=UTF-8"
        }
      );


    if (
      navigator.sendBeacon &&
      navigator.sendBeacon(
        TRACKING_URL,
        blob
      )
    ) {

      return;

    }

  } catch (error) {

    /*
      Ignore beacon errors and use fetch fallback.
    */

  }


  /*
    Fallback:
    normal POST request.
  */

  try {

    fetch(
      TRACKING_URL,
      {
        method: "POST",
        mode: "no-cors",
        body: params,
        keepalive: true
      }
    ).catch(
      () => {}
    );

  } catch (error) {

    /*
      Tracking should never break the website itself.
    */

  }

}


/* =========================================================
   AUTOMATIC BUTTON / LINK TRACKING
========================================================= */

/*
  This catches every clickable button automatically.

  Therefore, even if we forget to manually write:

      track(...)

  for a button on a page, the click still gets logged.
*/

document.addEventListener(
  "click",
  function (event) {

    const clickable =
      event.target.closest(
        "button, input[type='button'], input[type='submit'], a"
      );


    if (!clickable) {
      return;
    }


    /*
      Try to get a useful name for the clicked element.
    */

    let label =
      clickable.innerText ||
      clickable.value ||
      clickable.getAttribute(
        "aria-label"
      ) ||
      clickable.getAttribute(
        "title"
      ) ||
      "Unnamed clickable element";


    label =
      label
        .trim()
        .replace(/\s+/g, " ");


    /*
      Record the page where the click happened.
    */

    const page =
      window.location.pathname ||
      "index.html";


    track(
      "Button Clicked",
      "page",
      page
    );


    track(
      "Button Clicked",
      "button",
      label
    );

  },
  true
);


/* =========================================================
   PAGE OPEN TRACKING
========================================================= */

window.addEventListener(
  "load",
  function () {

    const page =
      window.location.pathname ||
      "index.html";


    track(
      "Website Opened",
      "page",
      page
    );

  }
);
