// Initialize AOS animations
AOS.init();

// Page loader
$(window).on("load", function () {
  setTimeout(function () {
    $(".page-loader").addClass("fade-out");
  }, 1000);
});

// Toggle overlay navigation
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  setTimeout(function () {
    document.getElementById("myNav").classList.add("open");
  }, 100);
}

function closeNav() {
  document.getElementById("myNav").classList.remove("open");
  setTimeout(function () {
    document.getElementById("myNav").style.width = "0%";
  }, 300);
}

// Sticky header
$(window).scroll(function () {
  if ($(this).scrollTop() > 50) {
    $(".header_section").addClass("scrolled");
    $(".scroll-to-top").addClass("active");
  } else {
    $(".header_section").removeClass("scrolled");
    $(".scroll-to-top").removeClass("active");
  }
});

// Scroll to top functionality
$(".scroll-to-top").click(function () {
  $("html, body").animate({ scrollTop: 0 }, 800);
  return false;
});
