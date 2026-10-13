/* =========================================================
   WEBSITE TRACKER
========================================================= */

const TRACKING_URL =
  "https://script.google.com/macros/s/AKfycbzNhUAAxHMWWW5uOweh0lSJlrgY-mUA9Crr__6cmXU2KhFIg2HCNb6wI0lx9luqQ_Ft/exec";


/* =========================================================
   SESSION ID
========================================================= */

let sessionId =
  sessionStorage.getItem("website_session_id");

if (!sessionId) {

  sessionId =
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .substring(2);

  sessionStorage.setItem(
    "website_session_id",
    sessionId
  );

}


/* =========================================================
   SEND TRACKING DATA
========================================================= */

function track(
  event,
  field = "",
  value = ""
) {

  const data =
    new URLSearchParams();

  data.append(
    "session_id",
    sessionId
  );

  data.append(
    "event",
    event
  );

  data.append(
    "field",
    field
  );

  data.append(
    "value",
    String(value ?? "")
  );


  /*
    Send as a normal URL-encoded POST.
  */

  try {

    fetch(
      TRACKING_URL,
      {
        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8"
        },

        body: data,

        keepalive: true

      }
    ).catch(
      function () {}
    );

  } catch (error) {

    /*
      Tracking errors must never
      break the website.
    */

  }

}


/* =========================================================
   AUTOMATIC BUTTON TRACKING
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const element =
      event.target.closest(
        "button, input[type='button'], input[type='submit'], a"
      );


    if (!element) {
      return;
    }


    let label =
      element.innerText ||
      element.value ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      "Unnamed element";


    label =
      label
        .trim()
        .replace(/\s+/g, " ");


    /*
      Record which page the click happened on.
    */

    track(
      "Button Clicked",
      "page",
      window.location.pathname
    );


    /*
      Record exactly what was clicked.
    */

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

    track(
      "Website Opened",
      "page",
      window.location.pathname ||
        "index.html"
    );

  }
);
