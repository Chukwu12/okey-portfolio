'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");
const revealDelayElements = document.querySelectorAll("[data-reveal-delay]");

const reveal = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
      revealElements[i].classList.add("revealed");
    }
  }
}

for (let i = 0, len = revealDelayElements.length; i < len; i++) {
  revealDelayElements[i].style.transitionDelay = revealDelayElements[i].dataset.revealDelay;
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);



/**
 * CONTACT FORM
 * submit to Netlify and show inline status
 */

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const encodeFormData = function (data) {
  return Object.keys(data)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", function (event) {
    if (!contactForm.checkValidity()) {
      return;
    }

    event.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const payload = {
      "form-name": contactForm.getAttribute("name") || "contact"
    };

    formData.forEach(function (value, key) {
      payload[key] = value;
    });

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    formStatus.className = "form-status";
    formStatus.textContent = "";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(payload)
    })
      .then(function () {
        formStatus.classList.add("is-success");
        formStatus.textContent = "Thanks, your message was sent successfully.";
        contactForm.reset();
      })
      .catch(function () {
        formStatus.classList.add("is-error");
        formStatus.textContent = "Something went wrong. Please try again.";
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      });
  });
}