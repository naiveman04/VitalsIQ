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

// Mouse scroll indicator click
$(".mouse-scroll").click(function () {
  var nextSection = $(".banner_section").next();
  $("html, body").animate(
    {
      scrollTop: nextSection.offset().top - 80,
    },
    800
  );
});

// Animated text in banner
$(document).ready(function () {
  // Text animation for banner title
  const animateText = $("#animateText");
  const text = animateText.html(); // Use .html() to preserve <br> tags
  let html = "";

  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      html += " ";
    } else if (text[i] === "<") {
      // Handle <br> tag
      const brTag = text.substring(i, i + 4);
      if (brTag === "<br>") {
        html += "<br>";
        i += 3; // Skip the next 3 characters
      }
    } else {
      html += '<span class="animate-text">' + text[i] + "</span>";
    }
  }

  animateText.html(html);

  // Show letters with delay
  setTimeout(function () {
    $(".animate-text").each(function (index) {
      const letter = $(this);
      setTimeout(function () {
        letter.addClass("visible");
      }, 100 * index);
    });
  }, 500);
});

// Carousel auto-play settings
$(document).ready(function () {
  $("#main_slider").carousel({
    interval: 5000,
    pause: "hover",
  });
});
