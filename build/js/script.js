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


    "use strict";

    const redBtn = document.querySelector('.red');
    const blueBtn = document.querySelector('.blue');
    const turquoiseBtn = document.querySelector('.turquoise');
    const orangeBtn = document.querySelector('.orange');

    orangeBtn.addEventListener('click', (e) => {
        document.documentElement.style.setProperty('--color-one', '228, 147, 121');
        document.documentElement.style.setProperty('--color-two', '203, 113, 85');
    });

    blueBtn.addEventListener('click', (e) => {
        document.documentElement.style.setProperty('--color-one', '155, 184, 232');
        document.documentElement.style.setProperty('--color-two', '139, 155, 226');
    });

    turquoiseBtn.addEventListener('click', (e) => {
        document.documentElement.style.setProperty('--color-one', '122, 168, 183');
        document.documentElement.style.setProperty('--color-two', '83, 142, 161');
    });

    redBtn.addEventListener('click', (e) => {
        document.documentElement.style.setProperty('--color-one', '209, 126, 126');
        document.documentElement.style.setProperty('--color-two', '192, 89, 89');
    });

    // preloader
    let $preloader = $('.preloader-wrapper'),
        $spinner = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(550).fadeOut('slow');

    // menu
    let last_id;
    let $left_menu = $('.header-menu');
    let menu_height = $left_menu.outerHeight(false);
    let $menu_items = $left_menu.find('a');
    let $scroll_items = $menu_items.map(function () {
        let item = $($(this).attr('href'));
        if (item.length) {
            return item;
        }
    });

    $(window).scroll(function () {
        let from_top = $(this).scrollTop() + menu_height;
        let mar = parseInt($left_menu.css('margin-bottom'));
        let cur = $scroll_items.map(function () {
            if ($(this).offset().top < from_top + mar) {
                return this;
            }
        });
        cur = cur[cur.length - 1];
        let id = cur && cur.length ? cur[0].id : '';
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

    //smooth page movement to the section
    Array.from(document.querySelectorAll('.menu__item a')).forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let sectionId = e.target.getAttribute('href');
            let section = document.querySelector(sectionId);
            let sectionPosition = section.getBoundingClientRect().top;
            let scrollPosition = window.pageYOffset + sectionPosition;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        });
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
    let animationDelay = 2500,
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
            let word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            let newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function animateHeadline($headlines) {
        let duration = animationDelay;
        $headlines.each(function () {
            let headline = $(this);

            if (headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function () {
                    headline.find('.cd-words-wrapper').addClass('is-loading')
                }, barWaiting);
            } else if (headline.hasClass('clip')) {
                let spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type')) {
                //assign to .cd-words-wrapper the width of its longest word
                let words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function () {
                    let wordWidth = $(this).width();
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
        let nextWord = takeNext($word);

        if ($word.parents('.cd-headline').hasClass('type')) {
            let parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function () {
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function () {
                showWord(nextWord, typeLettersDelay)
            }, typeAnimationDelay);

        } else if ($word.parents('.cd-headline').hasClass('letters')) {
            let bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
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
            let nextWord = takeNext($word);
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
    function trackMouse(hover, pointer) {

        let $hover = document.querySelectorAll(hover);
        let $pointer = document.querySelector(pointer);
        let off = 50;
        let first = !0;

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

            TweenMax.to($pointer, 0.7, {
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
    $(window).on('load', function () {
        trackMouse('.cursor', '.js-pointer');
    });


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
    $('.price-more a').click(function (e) {
        let dropDown = $(this).parent().next();
        $('.dropdown').not(dropDown).slideUp('slow');
        dropDown.slideToggle('slow');
        let $parentProgram = $(this).closest('.price');
        $('.price.activated').not($parentProgram).removeClass('activated');
        $parentProgram.toggleClass('activated');
        e.preventDefault();
    });
});