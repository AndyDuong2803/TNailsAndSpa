(function ($) {
  "use strict";

  var sliderOptions = {
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    dots: true,
    pauseOnDotsHover: true,
    cssEase: "linear",
    draggable: true,
    swipe: true,
    touchMove: true,
    prevArrow: '<button class="PrevArrow"></button>',
    nextArrow: '<button class="NextArrow"></button>',
  };

  function bindMobileMenu() {
    $(".menu-trigger")
      .off("click.mobileMenu")
      .on("click.mobileMenu", function (event) {
        event.preventDefault();
        $(this).toggleClass("active");
        $(".header-area .nav").stop(true, true).slideToggle(200);
      });
  }

  function initModernSlider() {
    if (!$.fn.slick) {
      return;
    }

    $(".Modern-Slider").each(function () {
      var $slider = $(this);

      if ($slider.hasClass("slick-initialized")) {
        return;
      }

      $slider.slick(sliderOptions);
    });
  }

  function initSpecialtiesCarousel() {
    if (!$.fn.owlCarousel) {
      return;
    }

    $(".owl-menu-item").each(function () {
      var $carousel = $(this);

      if ($carousel.hasClass("owl-loaded")) {
        return;
      }

      $carousel.owlCarousel({
        items: 5,
        loop: true,
        dots: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        smartSpeed: 600,
        margin: 30,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
          1200: {
            items: 5,
          },
        },
      });
    });
  }

  function initDatepicker() {
    if ($.fn.datepicker && $(".input-group.date").length) {
      $(".input-group.date").datepicker({ format: "dd.mm.yyyy" });
    }
  }

  function initFilters() {
    var $grid = $(".grid");

    if (!$.fn.isotope || !$grid.length) {
      return;
    }

    $grid.isotope({
      itemSelector: ".all",
      percentPosition: true,
      masonry: {
        columnWidth: ".all",
      },
    });

    $(".filters ul li")
      .off("click.filters")
      .on("click.filters", function () {
        $(".filters ul li").removeClass("active");
        $(this).addClass("active");

        $grid.isotope({
          filter: $(this).attr("data-filter"),
        });
      });
  }

  function initSearch() {
    $(".search-icon a")
      .off("click.search")
      .on("click.search", function (event) {
        event.preventDefault();
        $("#search").addClass("open");
        $('#search > form > input[type="search"]').focus();
      });

    $("#search, #search button.close")
      .off("click.search keyup.search")
      .on("click.search keyup.search", function (event) {
        if (
          event.target === this ||
          event.target.className === "close" ||
          event.keyCode === 27
        ) {
          $(this).removeClass("open");
        }
      });

    $("#search-box")
      .off("submit.search")
      .on("submit.search", function (event) {
        event.preventDefault();
        return false;
      });
  }

  function initTabs() {
    if ($.fn.tabs && $("#tabs").length) {
      $("#tabs").tabs();
    }
  }

  function initScrollReveal() {
    if (typeof scrollReveal !== "undefined") {
      window.sr = new scrollReveal();
    }
  }

  function bindSmoothScroll() {
    $(".scroll-to-section a[href^='#']")
      .off("click.smoothScroll")
      .on("click.smoothScroll", function (event) {
        var targetHash = this.hash;
        var $target = $(targetHash);

        if (!$target.length) {
          return;
        }

        event.preventDefault();
        $(document).off("scroll.activeNav");

        $(".scroll-to-section a").removeClass("active");
        $(this).addClass("active");

        if ($(window).width() < 991) {
          $(".menu-trigger").removeClass("active");
          $(".header-area .nav").slideUp(200);
        }

        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $target.offset().top - 79,
            },
            500,
            "swing",
            function () {
              window.location.hash = targetHash === "#top" ? "#home" : targetHash;
              $(document).on("scroll.activeNav", onScroll);
            }
          );
      });
  }

  function onScroll() {
    var scrollPos = $(document).scrollTop();

    $(".nav a").each(function () {
      var $link = $(this);
      var href = $link.attr("href");

      if (!href || href.charAt(0) !== "#") {
        return;
      }

      var $section = $(href);
      if (!$section.length) {
        return;
      }

      if (
        $section.position().top <= scrollPos &&
        $section.position().top + $section.height() > scrollPos
      ) {
        $(".nav a").removeClass("active");
        $link.addClass("active");
      } else {
        $link.removeClass("active");
      }
    });
  }

  function mobileNav() {
    var width = $(window).width();

    $(".submenu")
      .off("click.submenu")
      .on("click.submenu", function () {
        if (width < 767) {
          $(".submenu ul").removeClass("active");
          $(this).find("ul").toggleClass("active");
        }
      });
  }

  bindMobileMenu();

  $(window).on("scroll.header", function () {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height() || 0;
    var header = $("header").height() || 0;

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });

  initDatepicker();
  initFilters();
  initModernSlider();
  initSearch();
  initTabs();
  initSpecialtiesCarousel();
  mobileNav();
  initScrollReveal();
  bindSmoothScroll();

  $(document).ready(function () {
    $(document).on("scroll.activeNav", onScroll);
  });

  $(window).on("load", function () {
    initModernSlider();
    initSpecialtiesCarousel();

    if ($(".cover").length && $.fn.parallax) {
      $(".cover").parallax({
        imageSrc: $(".cover").data("image"),
        zIndex: "1",
      });
    }

    $("#preloader").animate(
      {
        opacity: "0",
      },
      600,
      function () {
        setTimeout(function () {
          $("#preloader").css("visibility", "hidden").fadeOut();
        }, 300);
      }
    );
  });

  $(window).on("resize.mobileNav", function () {
    mobileNav();
  });
})(window.jQuery);
