/*===================================================
Project: AI2BC SmartLet Property Managament
====================================================*/

//GLOBAL VARIBALES

//selector constants
var root = $("html, body");
const main_window = $(window),
  pageBody = $("body"),
  bdyOnePage = $("body.landing-page-demo "),
  hasSubMenu = $(".has-sub-menu"),
  pageHeader = $("#page-header"),
  navMain = $("#main-nav"),
  toTopBtn = $(".back-to-top"),
  heroVegasSlider = $(".page-hero.hero-vegas-slider"),
  textInput = $("form.main-form .text-input"),
  tabLink = $(".ma-tabs .tabs-links .tab-link");
  // portfolioGroup = $(".portfolio .portfolio-group");

$(function () {
  ("use strict");

  // function to fire the conter plugin
  let counterShowsUp = false;

  function fireCounter() {
    if ($(".js-stats-counter").length) {
      if (jQuery().countTo && counterShowsUp === false) {
        let pos = $(".js-stats-counter").offset().top;
        if (main_window.scrollTop() + main_window.innerHeight() - 50 >= pos) {
          $(".counter").countTo();
          counterShowsUp = true;
        }
      }
    }
  }

  // Start open/close navbar search box
  // $(".header-search-box form").on("click", function (e) {
  //   e.stopPropagation();
  // });

  // $(".header-search-btn").on("click", function () {
  //   $(".header-search-box").addClass("show");

  //   setTimeout(function () {
  //     $(".search-input").focus();
  //   }, 1000);
  // });

  /* ********* Start dark mode switcher ***********/

  // const modeSwitcher = $(".mode-switcher");
  const themeStoredKey = "ThemeColor";
  const darkTheme_class = "dark-theme";
  const lightTheme_class = "light-theme";
  const themeStoredItem = localStorage.getItem(themeStoredKey);

  /*********  Custom functions Area *********/

   function setThemeMode(themeColor) {
     if (themeColor !== lightTheme_class) {
       pageBody.addClass(lightTheme_class)
      //  modeSwitcher.addClass(darkTheme_class).removeClass(lightTheme_class);
       localStorage.setItem(themeStoredKey, lightTheme_class);
       localStorage.removeItem(darkTheme_class);
     }
   }

  /* *******  Set the theme according to the local storage value ********/
   //if local storge not set or the body has class value of .dark-theme THEN default theme is dark
   if (!themeStoredItem && !pageBody.hasClass(lightTheme_class)) {
     setThemeMode(lightTheme_class);
   }
  // the only case to be light mode is when the local storge has he value of light-theme
  // if (themeStoredItem === lightTheme_class) {
  //   setThemeMode(lightTheme_class);
  // }

  // if local storge or the body has class value of .dark-theme
  if (
    themeStoredItem === lightTheme_class ||
    pageBody.hasClass(lightTheme_class)
  ) {
    setThemeMode(lightTheme_class);
  }

  // /* ******* Set the theme by clicking the theme switcher ********/
  // $(modeSwitcher).on("click", function () {
  //   if ($(this).is("." + darkTheme_class)) {
  //     setThemeMode(lightTheme_class);
  //   } else if ($(this).is("." + lightTheme_class)) {
  //     setThemeMode(darkTheme_class);
  //   }
  // });

  /********************************
   *  START #page-header js rules
   *********************************/

  /* *******  start open/close navbar search box   ********/
  // $(".header-search-box .close-search , .header-search-box").on("click", () => {
  //   $(".header-search-box").removeClass("show");
  // });

  if (navMain) {
    $(bdyOnePage).scrollspy({
      target: navMain,
      offset: navMain.innerHeight() + 1,
    });
  }

  // make the menu stick on top whlie reloading
  if ($(this).scrollTop() > 50) {
    if (!$(pageHeader).hasClass("is-sticky")) {
      pageHeader.addClass("is-sticky");
    }
  }

  /* *******  make the menu stick on top upon the page scrolling   ********/
  main_window.on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      if (!$(pageHeader).hasClass("is-sticky")) {
        pageHeader.addClass("is-sticky");
      }
    } else {
      if ($(pageHeader).hasClass("is-sticky")) {
        pageHeader.removeClass("is-sticky");
      }
    }
  });

  /* *******  show/hide navbar links menu  ********/
  $(".menu-toggler").on("click", function () {
    pageHeader.find(".show:not(.menu-wrapper) ").removeClass("show");
    pageHeader.find(".menu-wrapper").toggleClass("show");
    $(".menu-toggler").toggleClass("close-menu");
  });

  /* ******* close the currnt opend menu when click on its wrapper ********/
  $(".links-list").on("click", function (e) {
    e.stopPropagation();
  });

  $(".menu-wrapper").on("click", function () {
    $(this).removeClass("show");
    if ($(".menu-toggler").hasClass("close-menu")) {
      $(".menu-toggler").removeClass("close-menu");
    }
  });

  /* ******* showing navbar sub-menus on mobile ********/
  hasSubMenu.on("click", function (e) {
    e.stopPropagation();
    if (!(main_window.innerWidth() > 1199)) {
      $(this).children(".sub-menu").slideToggle();
    }
  });

  /* ******* Start Smooth Scrolling To page sections Area********/
  $(".landing-page-demo .menu-navbar .menu-link").on("click", function (e) {
    const link = $(this).attr("href");
    let currentMainNavHeight = navMain.innerHeight();
    if (link.charAt(0) === "#") {
      e.preventDefault();
      const target = this.hash;
      $(root).animate(
        {
          scrollTop: $(target).offset().top - currentMainNavHeight + 1,
        },
        500
      );

      if (!$(this).parent(".menu-item").hasClass("has-sub-menu")) {
        // to close the menu after going to crossponding section
        if ($(".menu-wrapper").hasClass("show")) {
          $(".menu-wrapper").removeClass("show");
        }

        // to change the menu toggler buttn icon
        if ($(".menu-toggler").hasClass("close-menu")) {
          $(".menu-toggler").removeClass("close-menu");
        }
      }
    }
  });

  /*********************************
   END #page-header js rules
  *********************************/
  if ($(textInput).length) {
    let inputHasText = "has-text";

    if ($(textInput).val().trim() !== "")
      $(textInput).parent().addClass(inputHasText);
    else $(textInput).parent().removeClass(inputHasText);

    /*
        check if the form input has data or not while focusing out
        from the input to set the label
        in the right place by the css rules.
        */
    $(textInput).on("focusout", function () {
      if ($(this).val().trim() !== "") {
        $(this).parent().addClass(inputHasText);
      } else {
        $(this).parent().removeClass(inputHasText);
      }
    });
  }

  // Start Smooth Scrolling To Window Top When Clicking on Back To Top Button
  $(toTopBtn).on("click", function () {
    root.css("scroll-behavior", "smooth").scrollTop(0);
  });
  // End Smooth Scrolling To Window Top When Clicking on Back To Top Button

  /* Start Portfolio btns  */
  // if ($(".portfolio .portfolio-btn").length) {
  //   $(".portfolio .portfolio-btn").on("click", function () {
  //     $(this).addClass("active").siblings().removeClass("active");

  //     const $filterValue = $(this).attr("data-filter");
  //     portfolioGroup.isotope({
  //       filter: $filterValue,
  //     });
  //   });
  // }

  /* *******   initialize Counter plugin ********/
   fireCounter();

  /* ********* set the Background Image path and opacity for elements that has the  a vlaue for data-bg-img attribute***********/
  const bg_img = $("*");
  bg_img.each(function () {
    if ($(this).attr("data-bg-img")) {
      $(this).css("background-image", `url(${$(this).attr("data-bg-img")}`);
    }
    if ($(this).attr("data-bg-opacity")) {
      $(this).css("opacity", `${$(this).attr("data-bg-opacity")}`);
    }
  });

  /* *******  Start skills Bars  ********/
  $(window).on("scroll", function () {
    $(".skills .skill .skill-bar .bar").each(function () {
      let barOriginalPosition = $(this).offset().top + $(this).outerHeight();
      let barCurrPosition = $(window).scrollTop() + $(window).height();
      let widthValue = $(this).attr("data-skill-val");
      if (barCurrPosition > barOriginalPosition) {
        $(this).css({
          width: widthValue + "%",
        });
      }
    });
  });

   main_window.on("scroll", function () {
     if ($(this).scrollTop() > 50) {
       //show back to top btn
       toTopBtn.addClass("show");
     } else {
       //hide back to top btn
       toTopBtn.removeClass("show");
     }
    
    // to make sure the counter will start counting while its section apear on the screen
     fireCounter();
   });

  /*************Start Contact Form Functionality************/

  const contactForm = $("#contact-us-form"),
    userName = $("#user-name"),
    userEmail = $("#user-email"),
    msgSubject = $("#msg-subject"),
    msgText = $("#msg-text"),
    submitBtn = $("#submit-btn");

  let isValidInput = false,
    isValidEmail = false;

  function ValidateNotEmptyInput(input, errMsg) {
    if (input.length) {
      if (input.val().trim() === "") {
        $(input).siblings(".error-msg").text(errMsg).css("display", "block");
        isValidInput = false;
      } else {
        $(input).siblings(".error-msg").text("").css("display", "none");
        isValidInput = true;
      }
    }
  }

  function validateEmailInput(emailInput) {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (pattern.test(emailInput.val()) === false) {
      $(emailInput)
        .siblings(".error-msg")
        .text("Please Enter a valid Email")
        .css("display", "block");
      isValidEmail = false;
    } else {
      $(emailInput).siblings(".error-msg").text("").css("display", "none");
      isValidEmail = true;
    }
  }

  submitBtn.on("click", function (e) {
    e.preventDefault();

    ValidateNotEmptyInput(userName, "Please Enter Your Name");
    ValidateNotEmptyInput(userEmail, "Please Enter Your Email");
    ValidateNotEmptyInput(msgSubject, "Please Enter Your subject");
    ValidateNotEmptyInput(msgText, "Please Enter Your Message");
    validateEmailInput(userEmail);

    if (isValidInput && isValidEmail) {
      $.ajax({
        type: "POST",
        url: contactForm.attr("action"),
        data: contactForm.serialize(),

        success: function (data) {
          $(".done-msg")
            .text("Thank you, Your Message Was Received!")
            .toggleClass("show");
          setTimeout(function () {
            $(".done-msg").text("").toggleClass("show");
          }, 3000);
          contactForm[0].reset();
        },
      });
      return false;
    }
  });

  /*************End Contact Form Functionality************/

  /* ********************************
    Start Vendors plugins options Area 
    *********************************/

  //initialize swiper [Hero Section] //fade slider
  if ($(".hero-swiper-slider.fade-effect .swiper-container").length) {
    const heroSlider = new Swiper(
      ".hero-swiper-slider.fade-effect .swiper-container",
      {
        speed: 1000,
        loop: true,
        reverseDirection: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        on: {
          init: function () {
            let thisSlider = this;
            $(".slides-count").html("0" + (this.slides.length - 2));
            $(".curent-slide").html("0" + (this.realIndex + 1));
          },
          slideChange: function () {
            $(".curent-slide").html("0" + (this.realIndex + 1));
          },
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },
        pagination: {
          el: ".hero-swiper-slider.fade-effect .swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        navigation: {
          nextEl: ".hero-swiper-slider.fade-effect .swiper-button-next",
          prevEl: ".hero-swiper-slider.fade-effect .swiper-button-prev",
        },
      }
    );
  }
  if ($(".hero-swiper-slider.slide-effect .swiper-container").length) {
    const heroSlider = new Swiper(
      ".hero-swiper-slider.slide-effect .swiper-container",
      {
        speed: 1000,
        loop: true,
        reverseDirection: true,
        effect: "slide",
        fadeEffect: {
          crossFade: true,
        },
        on: {
          init: function () {
            let thisSlider = this;
            $(".slides-count").html("0" + (this.slides.length - 2));
            $(".curent-slide").html("0" + (this.realIndex + 1));
          },
          slideChange: function () {
            $(".curent-slide").html("0" + (this.realIndex + 1));
          },
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },
        pagination: {
          el: ".hero-swiper-slider.slide-effect .swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        navigation: {
          nextEl: ".hero-swiper-slider.slide-effect .swiper-button-next",
          prevEl: ".hero-swiper-slider.slide-effect .swiper-button-prev",
        },
      }
    );
  }

  // // initialize swiper [Testimonials with 1 Column]
  // if ($(".testimonials-1-col  .swiper-container").length) {
  //   const testimonialsSlider_1 = new Swiper(
  //     ".testimonials-1-col  .swiper-container",
  //     {
  //       // Optional parameters
  //       speed: 500,
  //       loop: true,
  //       grabCursor: true,
  //       slidesPerView: 1,
  //       spaceBetween: 50,
  //       delay: 5000,
  //       autoplay: {
  //         delay: 5000,
  //       },
  //       navigation: {
  //         nextEl: ".testimonials-1-col .swiper-button-next",
  //         prevEl: ".testimonials-1-col .swiper-button-prev",
  //       },
  //       on: {
  //         resize: function () {
  //           this.update();
  //         },
  //       },
  //     }
  //   );
  // }

  // //initialize swiper [clients Section]
  // if ($(".our-clients .swiper-container").length) {
  //   const partenersSlider = new Swiper(".our-clients .swiper-container", {
  //     // Optional parameters
  //     speed: 600,
  //     loop: true,
  //     spaceBetween: 20,
  //     grabCursor: true,
  //     delay: 5000,
  //     autoplay: {
  //       delay: 5000,
  //     },
  //     slidesPerView: 3,
  //     breakpoints: {
  //       991: {
  //         slidesPerView: 6,
  //         spaceBetween: 30,
  //       },
  //     },
  //   });
  // }

  /* *******  loading  wow.js  Options ********/
  const wow = new WOW({
    animateClass: "animated",
    offset: 100,
  });
  wow.init();

  /* *******  loading fancybox.js library ********/
  if ($("*").fancybox) {
    $().fancybox({
      selector: '[data-fancybox=".show-in-fancybox "]:visible',
      loop: true,
      buttons: ["zoom", "close"],
    });
  }

  /* *******  loading Splitting.js library ********/
  if (!(typeof window.Splitting === "undefined")) {
    if ($("[data-splitting]").length) {
      Splitting();
    }
  }

  /* *******  loading simpleParallax.js library ********/
  if (!(typeof window.simpleParallax === "undefined")) {
    let parallaxblock = document.querySelectorAll(".parallax-img ");
    if (parallaxblock.length) {
      new simpleParallax(parallaxblock, {
        delay: 1,
      });
      
    }
  }
  /************************************
    End Vendors plugins options Area 
     ******************************** */
});