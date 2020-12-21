$(document).ready(function () {

    /*
    
    navigation on script.js  

    1. preloader
    2. menu
    3. smooth scrolling to the section
    4. scroll up
    5. the transformation of the text in the section "about"
    6. slider in the "services" section
    7. styling the cursor
    8. opening the left sidebar when clicking on the ".left-sidebar__btn" button
    9. blocks with prices in the mobile version

    */


    // "use strict";


    // preloader
    var $preloader = $('.preloader-wrapper'),
        $spinner = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(550).fadeOut('slow');


    // menu
    var last_id;
    var $left_menu = $('.header-menu');
    var menu_height = $left_menu.outerHeight(false);
    var $menu_items = $left_menu.find('a');
    var $scroll_items = $menu_items.map(function () {
        var item = $($(this).attr('href'));
        if (item.length) {
            return item;
        }
    });

    $(window).scroll(function () {
        var from_top = $(this).scrollTop() + menu_height;
        var mar = parseInt($left_menu.css('margin-bottom'));
        var cur = $scroll_items.map(function () {
            if ($(this).offset().top < from_top + mar) {
                return this;
            }
        });
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : '';
        if (last_id !== id) {
            last_id = id;
            $menu_items.parent()
                .removeClass('active')
                .end()
                .filter("[href='#" + id + "']")
                .parent()
                .addClass('active');
        }
    });


    // smooth page movement to the section
    $("a.scroll-section").click(function (e) {
        e.preventDefault();
        elementClick = $(this).attr("href");
        destination = $(elementClick).offset().top;
        $("body,html").animate({
            scrollTop: destination
        }, 800);
    });


    // scroll up
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
        return false;
    });


    // the transformation of the text in the section "about"

    //set animation timing
    var animationDelay = 2500,
        //loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        lettersDelay = 50,
        //type effect
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
        //clip effect
        revealDuration = 600,
        revealAnimationDelay = 1500;

    initHeadline();


    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($('.cd-headline.letters').find('b'));
        //initialise headline animation
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function () {
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function () {
            var headline = $(this);

            if (headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function () {
                    headline.find('.cd-words-wrapper').addClass('is-loading')
                }, barWaiting);
            } else if (headline.hasClass('clip')) {
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type')) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function () {
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            };

            //trigger animation
            setTimeout(function () {
                hideWord(headline.find('.is-visible').eq(0))
            }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);

        if ($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function () {
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function () {
                showWord(nextWord, typeLettersDelay)
            }, typeAnimationDelay);

        } else if ($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({
                width: '2px'
            }, revealDuration, function () {
                switchWord($word, nextWord);
                showWord(nextWord);
            });

        } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function () {
                hideWord(nextWord)
            }, barAnimationDelay);
            setTimeout(function () {
                $word.parents('.cd-words-wrapper').addClass('is-loading')
            }, barWaiting);

        } else {
            switchWord($word, nextWord);
            setTimeout(function () {
                hideWord(nextWord)
            }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if ($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');

        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({
                'width': $word.width() + 10
            }, revealDuration, function () {
                setTimeout(function () {
                    hideWord($word)
                }, revealAnimationDelay);
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                hideLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else if ($bool) {
            setTimeout(function () {
                hideWord(takeNext($word))
            }, animationDelay);
        }

        if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                showLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else {
            if ($word.parents('.cd-headline').hasClass('type')) {
                setTimeout(function () {
                    $word.parents('.cd-words-wrapper').addClass('waiting');
                }, 200);
            }
            if (!$bool) {
                setTimeout(function () {
                    hideWord($word)
                }, animationDelay)
            }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }


    // slider in the "services" section
    $('.services-sliders').slick({
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: $('.sliders-arrow__prev'),
        nextArrow: $('.sliders-arrow__next'),
        speed: 300,
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
            }
        },
        {
            breakpoint: 577,
            settings: {
                slidesToShow: 1,
            }
        }
        ]
    });


    // styling the cursor

    //https://pcvector.net/scripts/other/699-izmenenie-formy-kursora-pri-navedenii-na-ssylku.html

    window.onload = function () {
        trackMouse('.cursor', '.js-pointer');
    }

    function trackMouse(hover, pointer) {

        var $hover = document.querySelectorAll(hover);
        var $pointer = document.querySelector(pointer);
        var off = 50;
        var first = !0;

        function mouseX(evt) {
            if (!evt) evt = window.event;
            if (evt.pageX) return evt.pageX;
            else if (evt.clientX) return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            else return 0
        }

        function mouseY(evt) {
            if (!evt) evt = window.event;
            if (evt.pageY) return evt.pageY;
            else if (evt.clientY) return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            else return 0
        }

        function follow(evt) {
            if (first) {
                first = !1;
                $pointer.style.opacity = 1;
            }

            TweenMax.to($pointer, .7, {
                left: (parseInt(mouseX(evt)) - off) + 'px',
                top: (parseInt(mouseY(evt)) - off) + 'px',
                ease: Power3.easeOut
            });
        }
        document.onmousemove = follow;

        (function linkCursor() {
            $hover.forEach(function (item) {
                item.addEventListener('mouseover', function () {
                    $pointer.classList.add('hide');
                });
                item.addEventListener('mouseout', function () {
                    $pointer.classList.remove('hide');
                });
            })
        })();

    }


    // opening the left sidebar when clicking on the ".left-sidebar__btn" button
    $('.left-sidebar__btn').on('click', function () {
        $('.left-sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    $('.menu__item').on('click', function () {
        $('.left-sidebar').toggleClass('active');
        $('.left-sidebar__btn').toggleClass('active');
    });


    // blocks with prices in the mobile version
    $.easing.def = "ease";
    $('.price-more a').click(function (e) {
        var dropDown = $(this).parent().next();
        $('.dropdown').not(dropDown).slideUp('slow');
        dropDown.slideToggle('slow');
        var $parentProgram = $(this).closest('.price');
        $('.price.activated').not($parentProgram).removeClass('activated');
        $parentProgram.toggleClass('activated');
        e.preventDefault();
    });

    // $.easing.def = 'ease';
    // $('.program-more a').click(function (e) {
    //     var dropDown = $(this).parent().next();
    //     $('.program-dropdown').not(dropDown).slideUp('slow');
    //     dropDown.slideToggle('slow');
    //     var $parentProgram = $(this).closest('.program');
    //     $('.program.activated').not($parentProgram).removeClass('activated');
    //     $parentProgram.toggleClass('activated');
    //     e.preventDefault();
    // });


});