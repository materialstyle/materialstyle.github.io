function getHighlightedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function validateFeedback(form) {
    form.validate({
        rules: {
            'feed-name': {
                required: true,
                maxlength: 30
            },
            'feed-email': {
                required: true,
                myEmail: true
            },
            'feed-feedback': {
                required: true,
                maxlength: 200
            }
        },
        messages: {
            'feed-name': {
                required: 'Name is required.',
                maxlength: 'Name may not be greater than 30 characters.'
            },
            'feed-email': {
                required: 'Email is required.',
                myEmail: 'Please enter a valid email address.'
            },
            'feed-feedback': {
                required: 'Feedback is required.',
                maxlength: 'Feedback may not be greater than 200 characters.'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest(".form-group"));
            element.closest(".form-group").addClass('has-error');
        },
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    return form.valid();
};

function saveFeedback() {
    if (validateFeedback($('#feed-form'))) {

        if ($("#g-recaptcha-response").val() === "") {
            $('#cap-error').show();
        } else {
            $('#cap-error').hide();
            $('#feed-form-container').addClass('d-none').removeClass('d-flex');
            $('#feed-wait').addClass('d-flex').removeClass('d-none');

            $.ajax({
                url: '/feedback',
                type: 'POST',
                data: $('#feed-form').serializeArray(),
                dataType: 'JSON',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    grecaptcha.reset();
                    $('#feed-wait').addClass('d-none').removeClass('d-flex');
                    if ('success' === response) {
                        $('#feed-thanks').addClass('d-flex').removeClass('d-none');
                    } else if ('unauthorized' === response) {
                        $('#feed-error').addClass('d-flex').removeClass('d-none');
                    }
                },
                error: function (response) {
                    grecaptcha.reset();
                    $('#feed-wait').addClass('d-none').removeClass('d-flex');

                    if ('errors' in response.responseJSON) {
                        $('#feed-form-container').addClass('d-flex').removeClass('d-none');
                        $.each(response.responseJSON.errors, function (key, val) {
                            $('#' + key).closest('.form-group').addClass('has-error')
                                .append('<label id="' + key + '-error" class="error" for="' + key + '">'
                                    + val + '</label>');
                        });
                    } else {
                        $('#feed-error').addClass('d-flex').removeClass('d-none');
                    }
                }
            });
        }
    }
}

$(function() {
    $('.adspace').hide();

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
});
