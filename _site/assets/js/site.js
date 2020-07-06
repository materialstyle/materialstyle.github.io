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

    // Feedback ================================================================
    $('#feed-wait, #feed-thanks, #feed-error').addClass('d-none').removeClass('d-flex');
    $('#cap-error').hide();

    $("footer .collapse").on('shown.bs.collapse', function(){
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 500, 'swing');
    });

    $('#feedback-link').on('click', function(){
        if (!$('#collapseFeedback').hasClass('show')) {
            $('#feed-form-container').addClass('d-flex').removeClass('d-none');
            $('#feed-wait, #feed-thanks, #feed-error').addClass('d-none').removeClass('d-flex');
        }
    });

    $('#feedback-submit').on('click', function(){
        saveFeedback();
    });

    $.validator.addMethod("myEmail", function(value, element) {
        return this.optional( element ) || ( /^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/.test( value ) && /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$).*/.test( value ) );
    }, 'Please enter a valid email address.');

    $('.404-page').css({
        'min-height': 'calc(100vh - ' + ($('.site-home-top-nav').outerHeight() + 100 + $('.footer').outerHeight()) + 'px)'
    });

    // if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    //     || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    //
    //     let vid = $('#home-video');
    //     vid.attr('controls', true);
    //     if (vid.paused) {
    //         vid.play();
    //     }
    // }

    $('[data-toggle="popover"]').popover();

    $('#snack').on('click', function() {
        showSnackbar($('#js_snackbar'));
    });

    $('#version-selector').on('change', function(){
        window.location.href = $(this).val();
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
