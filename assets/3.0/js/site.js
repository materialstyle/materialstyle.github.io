function getHighlightedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

$(function() {
    $('.adspace').html(
        `<a class="d-flex flex-column align-items-center" href="/" style="text-decoration:none;">
            <img src="/assets/images/MSIconNewColorV2.svg" alt="Logo" style="width:150px; height:150px;">
            <span class="text-dark text-center m-1">Material Style 2.0 is here!</span>
        </a>`
    );

    $('.code-container').append('<span class="copy-btn"><b>click</b> or <b>highlight</b> to copy</span>');

    $('.code-container').on('click', function(){
        var clip = $("<textarea>");
        $("body").append(clip);

        var highlightedText = getHighlightedText();

        if (highlightedText.length) {
            clip.val(highlightedText.replace(/\u00a0/g, " ")).select();
        } else {
            clip.val($(this).find('code').find('br').prepend('\r\n').end().text().replace(/\u00a0/g, " ")).select();
        }

        document.execCommand("copy");
        $(this).find('.copy-btn').html('<b>copied</b>');

        $(this).find('code').find('br').text('');

        clip.remove();
    });

    $('.code-container').on('mouseenter', function(){
        $(this).find('.copy-btn').html('<b>click</b> or <b>highlight</b> to copy');
    });

    $('.this-page-links a').on('click', function(){
        $('html, body').animate({scrollTop:$('#' + $(this).data('link')).offset().top - 120}, 500, 'swing');
    });

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};
    scrollFunction();
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            $('#top-btn').css('display', 'inline-block');
        } else {
            $('#top-btn').css('display', 'none');
        }
    }

    $('#top-btn').on('click', function(){
        $('html, body').animate({scrollTop:0}, 500, 'swing');
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    var active = false;

    const lazyLoad = function() {
        if (active === false) {
            active = true;

            setTimeout(function() {
                lazyImages.forEach(function(lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.classList.remove("lazy");

                        lazyImages = lazyImages.filter(function(image) {
                            return image !== lazyImage;
                        });

                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });

                active = false;
            }, 200);
        }
    };

    lazyLoad();
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);

  // Remember offcanvas scroll position
  let offcanvas = document.querySelector("#siteOffcanvas .offcanvas-body");

  let positionTop = localStorage.getItem("offcanvas-scroll");
  if (positionTop !== null) {
    offcanvas.scrollTop = parseInt(positionTop, 10);
  }

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("offcanvas-scroll", offcanvas.scrollTop);
  });
});
