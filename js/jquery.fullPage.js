(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {
    'use strict';
    var WRAPPER = 'fullpage-wrapper';
    var WRAPPER_SEL = '.' + WRAPPER;
    var SCROLLABLE = 'fp-scrollable';
    var SCROLLABLE_SEL = '.' + SCROLLABLE;
    var RESPONSIVE = 'fp-responsive';
    var NO_TRANSITION = 'fp-notransition';
    var DESTROYED = 'fp-destroyed';
    var ENABLED = 'fp-enabled';
    var VIEWING_PREFIX = 'fp-viewing';
    var ACTIVE = 'active';
    var ACTIVE_SEL = '.' + ACTIVE;
    var COMPLETELY = 'fp-completely';
    var COMPLETELY_SEL = '.' + COMPLETELY;
    var SECTION_DEFAULT_SEL = '.section';
    var SECTION = 'fp-section';
    var SECTION_SEL = '.' + SECTION;
    var SECTION_ACTIVE_SEL = SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL = SECTION_SEL + ':first';
    var SECTION_LAST_SEL = SECTION_SEL + ':last';
    var TABLE_CELL = 'fp-tableCell';
    var TABLE_CELL_SEL = '.' + TABLE_CELL;
    var AUTO_HEIGHT = 'fp-auto-height';
    var AUTO_HEIGHT_SEL = '.fp-auto-height';
    var NORMAL_SCROLL = 'fp-normal-scroll';
    var NORMAL_SCROLL_SEL = '.fp-normal-scroll';
    var SECTION_NAV = 'fp-nav';
    var SECTION_NAV_SEL = '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP = 'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL = '.' + SECTION_NAV_TOOLTIP;
    var SHOW_ACTIVE_TOOLTIP = 'fp-show-active';
    var SLIDE_DEFAULT_SEL = '.slide';
    var SLIDE = 'fp-slide';
    var SLIDE_SEL = '.' + SLIDE;
    var SLIDE_ACTIVE_SEL = SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER = 'fp-slides';
    var SLIDES_WRAPPER_SEL = '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER = 'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL = '.' + SLIDES_CONTAINER;
    var TABLE = 'fp-table';
    var SLIDES_NAV = 'fp-slidesNav';
    var SLIDES_NAV_SEL = '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL = SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW = 'fp-controlArrow';
    var SLIDES_ARROW_SEL = '.' + SLIDES_ARROW;
    var SLIDES_PREV = 'fp-prev';
    var SLIDES_PREV_SEL = '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV = SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT = 'fp-next';
    var SLIDES_NEXT_SEL = '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT = SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;
    var $window = $(window);
    var $document = $(document);
    var iscrollOptions = {
        scrollbars: true,
        mouseWheel: true,
        hideScrollbars: false,
        fadeScrollbars: false,
        disableMouse: true
    };
    $.fn.fullpage = function (options) {
        if ($('html').hasClass(ENABLED)) {
            displayWarnings();
            return;
        }
        var $htmlBody = $('html, body');
        var $body = $('body');
        var FP = $.fn.fullpage;
        options = $.extend({
            menu: false,
            anchors: [],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowHandler: iscrollHandler,
            scrollOverflowOptions: null,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,
            bigSectionsDestination: null,
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            sectionsColor: [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0,
            responsiveWidth: 0,
            responsiveHeight: 0,
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null
        }, options);
        var slideMoving = false;
        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var controlPressed;
        var isScrollAllowed = {};
        isScrollAllowed.m = {
            'up': true,
            'down': true,
            'left': true,
            'right': true
        };
        isScrollAllowed.k = $.extend(true, {}, isScrollAllowed.m);
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;
        var originals = $.extend(true, {}, options);
        displayWarnings();
        iscrollOptions.click = isTouch;
        iscrollOptions = $.extend(iscrollOptions, options.scrollOverflowOptions);
        $.extend($.easing, {
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        });
        FP.setAutoScrolling = function (value, type) {
            setVariableState('autoScrolling', value, type);
            var element = $(SECTION_ACTIVE_SEL);
            if (options.autoScrolling && !options.scrollBar) {
                $htmlBody.css({
                    'overflow': 'hidden',
                    'height': '100%'
                });
                FP.setRecordHistory(originals.recordHistory, 'internal');
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });
                if (element.length) {
                    silentScroll(element.position().top);
                }
            } else {
                $htmlBody.css({
                    'overflow': 'visible',
                    'height': 'initial'
                });
                FP.setRecordHistory(false, 'internal');
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });
                silentScroll(0);
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        };
        FP.setRecordHistory = function (value, type) {
            setVariableState('recordHistory', value, type);
        };
        FP.setScrollingSpeed = function (value, type) {
            setVariableState('scrollingSpeed', value, type);
        };
        FP.setFitToSection = function (value, type) {
            setVariableState('fitToSection', value, type);
        };
        FP.setLockAnchors = function (value) {
            options.lockAnchors = value;
        };
        FP.setMouseWheelScrolling = function (value) {
            if (value) {
                addMouseWheelHandler();
                addMiddleWheelHandler();
            } else {
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        };
        FP.setAllowScrolling = function (value, directions) {
            if (typeof directions !== 'undefined') {
                directions = directions.replace(/ /g, '').split(',');
                $.each(directions, function (index, direction) {
                    setIsScrollAllowed(value, direction, 'm');
                });
            } else if (value) {
                FP.setMouseWheelScrolling(true);
                addTouchHandler();
            } else {
                FP.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };
        FP.setKeyboardScrolling = function (value, directions) {
            if (typeof directions !== 'undefined') {
                directions = directions.replace(/ /g, '').split(',');
                $.each(directions, function (index, direction) {
                    setIsScrollAllowed(value, direction, 'k');
                });
            } else {
                options.keyboardScrolling = value;
            }
        };
        FP.moveSectionUp = function () {
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }
            if (prev.length) {
                scrollPage(prev, null, true);
            }
        };
        FP.moveSectionDown = function () {
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);
            if (!next.length && (options.loopBottom || options.continuousVertical)) {
                next = $(SECTION_SEL).first();
            }
            if (next.length) {
                scrollPage(next, null, false);
            }
        };
        FP.silentMoveTo = function (sectionAnchor, slideAnchor) {
            FP.setScrollingSpeed(0, 'internal');
            FP.moveTo(sectionAnchor, slideAnchor);
            FP.setScrollingSpeed(originals.scrollingSpeed, 'internal');
        };
        FP.moveTo = function (sectionAnchor, slideAnchor) {
            var destiny = getSectionByAnchor(sectionAnchor);
            if (typeof slideAnchor !== 'undefined') {
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            } else if (destiny.length > 0) {
                scrollPage(destiny);
            }
        };
        FP.moveSlideRight = function (section) {
            moveSlide('next', section);
        };
        FP.moveSlideLeft = function (section) {
            moveSlide('prev', section);
        };
        FP.reBuild = function (resizing) {
            if (container.hasClass(DESTROYED)) {
                return;
            }
            isResizing = true;
            windowsHeight = $window.height();
            $(SECTION_SEL).each(function () {
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);
                if (options.verticalCentered) {
                    $(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }
                $(this).css('height', windowsHeight + 'px');
                if (options.scrollOverflow) {
                    if (slides.length) {
                        slides.each(function () {
                            createSlimScrolling($(this));
                        });
                    } else {
                        createSlimScrolling($(this));
                    }
                }
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });
            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);
            if (sectionIndex) {
                FP.silentMoveTo(sectionIndex + 1);
            }
            isResizing = false;
            $.isFunction(options.afterResize) && resizing && options.afterResize.call(container);
            $.isFunction(options.afterReBuild) && !resizing && options.afterReBuild.call(container);
        };
        FP.setResponsive = function (active) {
            var isResponsive = $body.hasClass(RESPONSIVE);
            if (active) {
                if (!isResponsive) {
                    FP.setAutoScrolling(false, 'internal');
                    FP.setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    $body.addClass(RESPONSIVE);
                }
            } else if (isResponsive) {
                FP.setAutoScrolling(originals.autoScrolling, 'internal');
                FP.setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                $body.removeClass(RESPONSIVE);
            }
        };
        if ($(this).length) {
            init();
            bindEvents();
        }

        function init() {
            if (options.css3) {
                options.css3 = support3d();
            }
            options.scrollBar = options.scrollBar || options.hybrid;
            setOptionsFromDOM();
            prepareDom();
            FP.setAllowScrolling(true);
            FP.setAutoScrolling(options.autoScrolling, 'internal');
            var activeSlide = $(SECTION_ACTIVE_SEL).find(SLIDE_ACTIVE_SEL);
            if (activeSlide.length && ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && activeSlide.index() !== 0))) {
                silentLandscapeScroll(activeSlide);
            }
            responsive();
            setBodyClass();
            if (document.readyState === 'complete') {
                scrollToAnchor();
            }
            $window.on('load', scrollToAnchor);
        }

        function bindEvents() {
            $window.on('scroll', scrollHandler).on('hashchange', hashChangeHandler).blur(blurHandler).resize(resizeHandler);
            $document.keydown(keydownHandler).keyup(keyUpHandler).on('click touchstart', SECTION_NAV_SEL + ' a', sectionBulletHandler).on('click touchstart', SLIDES_NAV_LINK_SEL, slideBulletHandler).on('click', SECTION_NAV_TOOLTIP_SEL, tooltipTextHandler);
            $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, slideArrowHandler);
            if (options.normalScrollElements) {
                $document.on('mouseenter', options.normalScrollElements, function () {
                    FP.setMouseWheelScrolling(false);
                });
                $document.on('mouseleave', options.normalScrollElements, function () {
                    FP.setMouseWheelScrolling(true);
                });
            }
        }

        function setOptionsFromDOM() {
            var sections = container.find(options.sectionSelector);
            if (!options.anchors.length) {
                options.anchors = sections.filter('[data-anchor]').map(function () {
                    return $(this).data('anchor').toString();
                }).get();
            }
            if (!options.navigationTooltips.length) {
                options.navigationTooltips = sections.filter('[data-tooltip]').map(function () {
                    return $(this).data('tooltip').toString();
                }).get();
            }
        }

        function prepareDom() {
            container.css({
                'height': '100%',
                'position': 'relative'
            });
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);
            windowsHeight = $window.height();
            container.removeClass(DESTROYED);
            addInternalSelectors();
            $(SECTION_SEL).each(function (index) {
                var section = $(this);
                var slides = section.find(SLIDE_SEL);
                var numSlides = slides.length;
                styleSection(section, index);
                styleMenu(section, index);
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                } else {
                    if (options.verticalCentered) {
                        addTableClass(section);
                    }
                }
            });
            if (options.fixedElements && options.css3) {
                $(options.fixedElements).appendTo($body);
            }
            if (options.navigation) {
                addVerticalNavigation();
            }
            enableYoutubeAPI();
            enableVidemoAPI();
            if (options.scrollOverflow) {
                if (document.readyState === 'complete') {
                    createSlimScrollingHandler();
                }
                $window.on('load', createSlimScrollingHandler);
            } else {
                afterRenderActions();
            }
        }

        function styleSlides(section, slides, numSlides) {
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;
            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');
            section.find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');
            if (numSlides > 1) {
                if (options.controlArrows) {
                    createSlideArrows(section);
                }
                if (options.slidesNavigation) {
                    addSlidesNavigation(section, numSlides);
                }
            }
            slides.each(function (index) {
                $(this).css('width', slideWidth + '%');
                if (options.verticalCentered) {
                    addTableClass($(this));
                }
            });
            var startingSlide = section.find(SLIDE_ACTIVE_SEL);
            if (startingSlide.length && ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))) {
                silentLandscapeScroll(startingSlide);
            } else {
                slides.eq(0).addClass(ACTIVE);
            }
        }

        function styleSection(section, index) {
            if (!index && $(SECTION_ACTIVE_SEL).length === 0) {
                section.addClass(ACTIVE);
            }
            section.css('height', windowsHeight + 'px');
            if (options.paddingTop) {
                section.css('padding-top', options.paddingTop);
            }
            if (options.paddingBottom) {
                section.css('padding-bottom', options.paddingBottom);
            }
            if (typeof options.sectionsColor[index] !== 'undefined') {
                section.css('background-color', options.sectionsColor[index]);
            }
            if (typeof options.anchors[index] !== 'undefined') {
                section.attr('data-anchor', options.anchors[index]);
            }
        }

        function styleMenu(section, index) {
            if (typeof options.anchors[index] !== 'undefined') {
                if (section.hasClass(ACTIVE)) {
                    activateMenuAndNav(options.anchors[index], index);
                }
            }
            if (options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length) {
                $(options.menu).appendTo($body);
            }
        }

        function addInternalSelectors() {
            container.find(options.sectionSelector).each(function () {
                $(this).addClass(SECTION);
            });
            container.find(options.slideSelector).each(function () {
                $(this).addClass(SLIDE);
            });
        }

        function createSlideArrows(section) {
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');
            if (options.controlArrowColor != '#fff') {
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent ' + options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent ' + options.controlArrowColor + ' transparent transparent');
            }
            if (!options.loopHorizontal) {
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        function addVerticalNavigation() {
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);
            nav.addClass(function () {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });
            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }
                var li = '<li><a href="#' + link + '"><span></span></a>';
                var tooltip = options.navigationTooltips[i];
                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }
                li += '</li>';
                nav.find('ul').append(li);
            }
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height() / 2) + 'px');
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
        }

        function createSlimScrollingHandler() {
            $(SECTION_SEL).each(function () {
                var slides = $(this).find(SLIDE_SEL);
                if (slides.length) {
                    slides.each(function () {
                        createSlimScrolling($(this));
                    });
                } else {
                    createSlimScrolling($(this));
                }
            });
            afterRenderActions();
        }

        function enableYoutubeAPI() {
            container.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var sign = getUrlParamSign($(this).attr('src'));
                $(this).attr('src', $(this).attr('src') + sign + 'enablejsapi=1');
            });
        }

        function enableVidemoAPI() {
            container.find('iframe[src*="player.vimeo.com/"]').each(function () {
                var sign = getUrlParamSign($(this).attr('src'));
                $(this).attr('src', $(this).attr('src') + sign + 'api=1');
            });
        }

        function getUrlParamSign(url) {
            return (!/\?/.test(url)) ? '?' : '&';
        }

        function afterRenderActions() {
            var section = $(SECTION_ACTIVE_SEL);
            section.addClass(COMPLETELY);
            if (options.scrollOverflowHandler.afterRender) {
                options.scrollOverflowHandler.afterRender(section);
            }
            lazyLoad(section);
            playMedia(section);
            $.isFunction(options.afterLoad) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            $.isFunction(options.afterRender) && options.afterRender.call(container);
        }
        var isScrolling = false;
        var lastScroll = 0;

        function scrollHandler() {
            var currentSection;
            if (!options.autoScrolling || options.scrollBar) {
                var currentScroll = $window.scrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + ($window.height() / 2.0);
                var isAtBottom = $body.height() - $window.height() === currentScroll;
                var sections = document.querySelectorAll(SECTION_SEL);
                if (isAtBottom) {
                    visibleSectionIndex = sections.length - 1;
                } else {
                    for (var i = 0; i < sections.length; ++i) {
                        var section = sections[i];
                        if (section.offsetTop <= screen_mid) {
                            visibleSectionIndex = i;
                        }
                    }
                }
                if (isCompletelyInViewPort(scrollDirection)) {
                    if (!$(SECTION_ACTIVE_SEL).hasClass(COMPLETELY)) {
                        $(SECTION_ACTIVE_SEL).addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
                    }
                }
                currentSection = $(sections).eq(visibleSectionIndex);
                if (!currentSection.hasClass(ACTIVE)) {
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);
                    if (activeSlide.length) {
                        var slideAnchorLink = activeSlide.data('anchor');
                        var slideIndex = activeSlide.index();
                    }
                    if (canScroll) {
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);
                        $.isFunction(options.onLeave) && options.onLeave.call(leavingSection, leavingSectionIndex, sectionIndex, yMovement);
                        $.isFunction(options.afterLoad) && options.afterLoad.call(currentSection, anchorLink, sectionIndex);
                        stopMedia(leavingSection);
                        lazyLoad(currentSection);
                        playMedia(currentSection);
                        activateMenuAndNav(anchorLink, sectionIndex - 1);
                        if (options.anchors.length) {
                            lastScrolledDestiny = anchorLink;
                            setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                        }
                    }
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function () {
                        isScrolling = false;
                    }, 100);
                }
                if (options.fitToSection) {
                    clearTimeout(scrollId2);
                    scrollId2 = setTimeout(function () {
                        if (canScroll && options.fitToSection) {
                            if ($(SECTION_ACTIVE_SEL).is(currentSection)) {
                                isResizing = true;
                            }
                            scrollPage($(SECTION_ACTIVE_SEL));
                            isResizing = false;
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        function isCompletelyInViewPort(movement) {
            var top = $(SECTION_ACTIVE_SEL).position().top;
            var bottom = top + $window.height();
            if (movement == 'up') {
                return bottom >= ($window.scrollTop() + $window.height());
            }
            return top <= $window.scrollTop();
        }

        function getScrollDirection(currentScroll) {
            var direction = currentScroll > lastScroll ? 'down' : 'up';
            lastScroll = currentScroll;
            previousDestTop = currentScroll;
            return direction;
        }

        function scrolling(type, scrollable) {
            if (!isScrollAllowed.m[type]) {
                return;
            }
            var check, scrollSection;
            if (type == 'down') {
                check = 'bottom';
                scrollSection = FP.moveSectionDown;
            } else {
                check = 'top';
                scrollSection = FP.moveSectionUp;
            }
            if (scrollable.length > 0) {
                if (options.scrollOverflowHandler.isScrolled(check, scrollable)) {
                    scrollSection();
                } else {
                    return true;
                }
            } else {
                scrollSection();
            }
        }
        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        function touchMoveHandler(event) {
            var e = event.originalEvent;
            if (!checkParentForNormalScrollElement(event.target) && isReallyTouch(e)) {
                if (options.autoScrolling) {
                    event.preventDefault();
                }
                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = options.scrollOverflowHandler.scrollable(activeSection);
                if (canScroll && !slideMoving) {
                    var touchEvents = getEventsPage(e);
                    touchEndY = touchEvents.y;
                    touchEndX = touchEvents.x;
                    if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {
                        if (Math.abs(touchStartX - touchEndX) > ($window.outerWidth() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                if (isScrollAllowed.m.right) {
                                    FP.moveSlideRight();
                                }
                            } else {
                                if (isScrollAllowed.m.left) {
                                    FP.moveSlideLeft();
                                }
                            }
                        }
                    } else if (options.autoScrolling) {
                        if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                scrolling('down', scrollable);
                            } else if (touchEndY > touchStartY) {
                                scrolling('up', scrollable);
                            }
                        }
                    }
                }
            }
        }

        function checkParentForNormalScrollElement(el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();
            if (hop < options.normalScrollElementTouchThreshold && parent.is(options.normalScrollElements)) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }

        function isReallyTouch(e) {
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        function touchStartHandler(event) {
            var e = event.originalEvent;
            if (options.fitToSection) {
                $htmlBody.stop();
            }
            if (isReallyTouch(e)) {
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        function getAverage(elements, number) {
            var sum = 0;
            var lastElements = elements.slice(Math.max(elements.length - number, 1));
            for (var i = 0; i < lastElements.length; i++) {
                sum = sum + lastElements[i];
            }
            return Math.ceil(sum / number);
        }
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();
            var isNormalScroll = $(COMPLETELY_SEL).hasClass(NORMAL_SCROLL);
            if (options.autoScrolling && !controlPressed && !isNormalScroll) {
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));
                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);
                if (scrollings.length > 149) {
                    scrollings.shift();
                }
                scrollings.push(Math.abs(value));
                if (options.scrollBar) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }
                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = options.scrollOverflowHandler.scrollable(activeSection);
                var timeDiff = curTime - prevTime;
                prevTime = curTime;
                if (timeDiff > 200) {
                    scrollings = [];
                }
                if (canScroll) {
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;
                    if (isAccelerating && isScrollingVertically) {
                        if (delta < 0) {
                            scrolling('down', scrollable);
                        } else {
                            scrolling('up', scrollable);
                        }
                    }
                }
                return false;
            }
            if (options.fitToSection) {
                $htmlBody.stop();
            }
        }

        function moveSlide(direction, section) {
            var activeSection = typeof section === 'undefined' ? $(SECTION_ACTIVE_SEL) : section;
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }
            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;
            if (direction === 'prev') {
                destiny = currentSlide.prev(SLIDE_SEL);
            } else {
                destiny = currentSlide.next(SLIDE_SEL);
            }
            if (!destiny.length) {
                if (!options.loopHorizontal) return;
                if (direction === 'prev') {
                    destiny = currentSlide.siblings(':last');
                } else {
                    destiny = currentSlide.siblings(':first');
                }
            }
            slideMoving = true;
            landscapeScroll(slides, destiny);
        }

        function keepSlidesPosition() {
            $(SLIDE_ACTIVE_SEL).each(function () {
                silentLandscapeScroll($(this), 'internal');
            });
        }
        var previousDestTop = 0;

        function getDestinationPosition(element) {
            var elemPosition = element.position();
            var position = elemPosition.top;
            var isScrollingDown = elemPosition.top > previousDestTop;
            var sectionBottom = position - windowsHeight + element.outerHeight();
            var bigSectionsDestination = options.bigSectionsDestination;
            if (element.outerHeight() > windowsHeight) {
                if (!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom') {
                    position = sectionBottom;
                }
            } else if (isScrollingDown || (isResizing && element.is(':last-child'))) {
                position = sectionBottom;
            }
            previousDestTop = position;
            return position;
        }

        function scrollPage(element, callback, isMovementUp) {
            if (typeof element === 'undefined') {
                return;
            }
            var dtop = getDestinationPosition(element);
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,
                localIsResizing: isResizing
            };
            if ((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop && !element.hasClass(AUTO_HEIGHT))) {
                return;
            }
            if (v.activeSlide.length) {
                var slideAnchorLink = v.activeSlide.data('anchor');
                var slideIndex = v.activeSlide.index();
            }
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" && ((!v.isMovementUp && v.yMovement == 'up') || (v.isMovementUp && v.yMovement == 'down'))) {
                v = createInfiniteSections(v);
            }
            if ($.isFunction(options.onLeave) && !v.localIsResizing) {
                if (options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.yMovement) === false) {
                    return;
                }
            }
            stopMedia(v.activeSection);
            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(element);
            options.scrollOverflowHandler.onLeave();
            canScroll = false;
            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);
            performMovement(v);
            lastScrolledDestiny = v.anchorLink;
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        function performMovement(v) {
            if (options.css3 && options.autoScrolling && !options.scrollBar) {
                var translate3d = 'translate3d(0px, -' + v.dtop + 'px, 0px)';
                transformContainer(translate3d, true);
                if (options.scrollingSpeed) {
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                } else {
                    afterSectionLoads(v);
                }
            } else {
                var scrollSettings = getScrollSettings(v);
                $(scrollSettings.element).animate(scrollSettings.options, options.scrollingSpeed, options.easing).promise().done(function () {
                    if (options.scrollBar) {
                        setTimeout(function () {
                            afterSectionLoads(v);
                        }, 30);
                    } else {
                        afterSectionLoads(v);
                    }
                });
            }
        }

        function getScrollSettings(v) {
            var scroll = {};
            if (options.autoScrolling && !options.scrollBar) {
                scroll.options = {
                    'top': -v.dtop
                };
                scroll.element = WRAPPER_SEL;
            } else {
                scroll.options = {
                    'scrollTop': v.dtop
                };
                scroll.element = 'html, body';
            }
            return scroll;
        }

        function createInfiniteSections(v) {
            if (!v.isMovementUp) {
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            } else {
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }
            silentScroll($(SECTION_ACTIVE_SEL).position().top);
            keepSlidesPosition();
            v.wrapAroundElements = v.activeSection;
            v.dtop = v.element.position().top;
            v.yMovement = getYmovement(v.element);
            return v;
        }

        function continuousVerticalFixSectionOrder(v) {
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }
            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            } else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }
            silentScroll($(SECTION_ACTIVE_SEL).position().top);
            keepSlidesPosition();
        }

        function afterSectionLoads(v) {
            continuousVerticalFixSectionOrder(v);
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));
            options.scrollOverflowHandler.afterLoad();
            playMedia(v.element);
            v.element.addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
            canScroll = true;
            $.isFunction(v.callback) && v.callback.call(this);
        }

        function lazyLoad(destiny) {
            var destiny = getSlideOrSection(destiny);
            destiny.find('img[data-src], source[data-src], audio[data-src], iframe[data-src]').each(function () {
                $(this).attr('src', $(this).data('src'));
                $(this).removeAttr('data-src');
                if ($(this).is('source')) {
                    $(this).closest('video').get(0).load();
                }
            });
        }

        function playMedia(destiny) {
            var destiny = getSlideOrSection(destiny);
            destiny.find('video, audio').each(function () {
                var element = $(this).get(0);
                if (element.hasAttribute('data-autoplay') && typeof element.play === 'function') {
                    element.play();
                }
            });
            destiny.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);
                if (/youtube\.com\/embed\//.test($(this).attr('src')) && element.hasAttribute('data-autoplay')) {
                    element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
            });
        }

        function stopMedia(destiny) {
            var destiny = getSlideOrSection(destiny);
            destiny.find('video, audio').each(function () {
                var element = $(this).get(0);
                if (!element.hasAttribute('data-keepplaying') && typeof element.pause === 'function') {
                    element.pause();
                }
            });
            destiny.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);
                if (/youtube\.com\/embed\//.test($(this).attr('src')) && !element.hasAttribute('data-keepplaying')) {
                    $(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            });
        }

        function getSlideOrSection(destiny) {
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if (slide.length) {
                destiny = $(slide);
            }
            return destiny;
        }

        function scrollToAnchor() {
            var value = window.location.hash.replace('#', '').split('/');
            var section = decodeURIComponent(value[0]);
            var slide = decodeURIComponent(value[1]);
            if (section) {
                if (options.animateAnchor) {
                    scrollPageAndSlide(section, slide);
                } else {
                    FP.silentMoveTo(section, slide);
                }
            }
        }

        function hashChangeHandler() {
            if (!isScrolling && !options.lockAnchors) {
                var value = window.location.hash.replace('#', '').split('/');
                var section = decodeURIComponent(value[0]);
                var slide = decodeURIComponent(value[1]);
                var isFirstSlideMove = (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);
                if (section.length) {
                    if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide)) {
                        scrollPageAndSlide(section, slide);
                    }
                }
            }
        }

        function keydownHandler(e) {
            clearTimeout(keydownId);
            var activeElement = $(':focus');
            if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') && activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' && options.keyboardScrolling && options.autoScrolling) {
                var keyCode = e.which;
                var keyControls = [40, 38, 32, 33, 34];
                if ($.inArray(keyCode, keyControls) > -1) {
                    e.preventDefault();
                }
                controlPressed = e.ctrlKey;
                keydownId = setTimeout(function () {
                    onkeydown(e);
                }, 150);
            }
        }

        function tooltipTextHandler() {
            $(this).prev().trigger('click');
        }

        function keyUpHandler(e) {
            if (isWindowFocused) {
                controlPressed = e.ctrlKey;
            }
        }

        function mouseDownHandler(e) {
            if (e.which == 2) {
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        }

        function mouseUpHandler(e) {
            if (e.which == 2) {
                container.off('mousemove');
            }
        }

        function slideArrowHandler() {
            var section = $(this).closest(SECTION_SEL);
            if ($(this).hasClass(SLIDES_PREV)) {
                if (isScrollAllowed.m.left) {
                    FP.moveSlideLeft(section);
                }
            } else {
                if (isScrollAllowed.m.right) {
                    FP.moveSlideRight(section);
                }
            }
        }

        function blurHandler() {
            isWindowFocused = false;
            controlPressed = false;
        }

        function sectionBulletHandler(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        }

        function slideBulletHandler(e) {
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());
            landscapeScroll(slides, destiny);
        }

        function onkeydown(e) {
            var shiftPressed = e.shiftKey;
            switch (e.which) {
                case 38:
                case 33:
                    if (isScrollAllowed.k.up) {
                        FP.moveSectionUp();
                    }
                    break;
                case 32:
                    if (shiftPressed && isScrollAllowed.k.up) {
                        FP.moveSectionUp();
                        break;
                    }
                    case 40:
                    case 34:
                        if (isScrollAllowed.k.down) {
                            FP.moveSectionDown();
                        }
                        break;
                    case 36:
                        if (isScrollAllowed.k.up) {
                            FP.moveTo(1);
                        }
                        break;
                    case 35:
                        if (isScrollAllowed.k.down) {
                            FP.moveTo($(SECTION_SEL).length);
                        }
                        break;
                    case 37:
                        if (isScrollAllowed.k.left) {
                            FP.moveSlideLeft();
                        }
                        break;
                    case 39:
                        if (isScrollAllowed.k.right) {
                            FP.moveSlideRight();
                        }
                        break;
                    default:
                        return;
            }
        }
        var oldPageY = 0;

        function mouseMoveHandler(e) {
            if (canScroll) {
                if (e.pageY < oldPageY && isScrollAllowed.m.up) {
                    FP.moveSectionUp();
                } else if (e.pageY > oldPageY && isScrollAllowed.m.down) {
                    FP.moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        function landscapeScroll(slides, destiny) {
            var destinyPos = destiny.position();
            var slideIndex = destiny.index();
            var section = slides.closest(SECTION_SEL);
            var sectionIndex = section.index(SECTION_SEL);
            var anchorLink = section.data('anchor');
            var slidesNav = section.find(SLIDES_NAV_SEL);
            var slideAnchor = getAnchor(destiny);
            var prevSlide = section.find(SLIDE_ACTIVE_SEL);
            var localIsResizing = isResizing;
            if (options.onSlideLeave) {
                var prevSlideIndex = prevSlide.index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);
                if (!localIsResizing && xMovement !== 'none') {
                    if ($.isFunction(options.onSlideLeave)) {
                        if (options.onSlideLeave.call(prevSlide, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement, slideIndex) === false) {
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }
            stopMedia(prevSlide);
            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            if (!localIsResizing) {
                lazyLoad(destiny);
            }
            if (!options.loopHorizontal && options.controlArrows) {
                section.find(SLIDES_ARROW_PREV_SEL).toggle(slideIndex !== 0);
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }
            if (section.hasClass(ACTIVE)) {
                setState(slideIndex, slideAnchor, anchorLink, sectionIndex);
            }
            var afterSlideLoads = function () {
                if (!localIsResizing) {
                    $.isFunction(options.afterSlideLoad) && options.afterSlideLoad.call(destiny, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                }
                playMedia(destiny);
                slideMoving = false;
            };
            if (options.css3) {
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';
                addAnimation(slides.find(SLIDES_CONTAINER_SEL), options.scrollingSpeed > 0).css(getTransforms(translate3d));
                afterSlideLoadsId = setTimeout(function () {
                    afterSlideLoads();
                }, options.scrollingSpeed, options.easing);
            } else {
                slides.animate({
                    scrollLeft: Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function () {
                    afterSlideLoads();
                });
            }
            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }
        var previousHeight = windowsHeight;

        function resizeHandler() {
            responsive();
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();
                    if (Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100)) {
                        FP.reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            } else {
                clearTimeout(resizeId);
                resizeId = setTimeout(function () {
                    FP.reBuild(true);
                }, 350);
            }
        }

        function responsive() {
            var widthLimit = options.responsive || options.responsiveWidth;
            var heightLimit = options.responsiveHeight;
            var isBreakingPointWidth = widthLimit && $window.outerWidth() < widthLimit;
            var isBreakingPointHeight = heightLimit && $window.height() < heightLimit;
            if (widthLimit && heightLimit) {
                FP.setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            } else if (widthLimit) {
                FP.setResponsive(isBreakingPointWidth);
            } else if (heightLimit) {
                FP.setResponsive(isBreakingPointHeight);
            }
        }

        function addAnimation(element) {
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;
            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        function removeAnimation(element) {
            return element.addClass(NO_TRANSITION);
        }

        function activateNavDots(name, sectionIndex) {
            if (options.navigation) {
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if (name) {
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                } else {
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        function activateMenuElement(name) {
            if (options.menu) {
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="' + name + '"]').addClass(ACTIVE);
            }
        }

        function activateMenuAndNav(anchor, index) {
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        function getYmovement(destiny) {
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if (fromIndex == toIndex) {
                return 'none';
            }
            if (fromIndex > toIndex) {
                return 'up';
            }
            return 'down';
        }

        function getXmovement(fromIndex, toIndex) {
            if (fromIndex == toIndex) {
                return 'none';
            }
            if (fromIndex > toIndex) {
                return 'left';
            }
            return 'right';
        }

        function createSlimScrolling(element) {
            if (element.hasClass('fp-noscroll')) return;
            element.css('overflow', 'hidden');
            var scrollOverflowHandler = options.scrollOverflowHandler;
            var wrap = scrollOverflowHandler.wrapContent();
            var section = element.closest(SECTION_SEL);
            var scrollable = scrollOverflowHandler.scrollable(element);
            var contentHeight;
            if (scrollable.length) {
                contentHeight = scrollOverflowHandler.scrollHeight(element);
            } else {
                contentHeight = element.get(0).scrollHeight;
                if (options.verticalCentered) {
                    contentHeight = element.find(TABLE_CELL_SEL).get(0).scrollHeight;
                }
            }
            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));
            if (contentHeight > scrollHeight) {
                if (scrollable.length) {
                    scrollOverflowHandler.update(element, scrollHeight);
                } else {
                    if (options.verticalCentered) {
                        element.find(TABLE_CELL_SEL).wrapInner(wrap);
                    } else {
                        element.wrapInner(wrap);
                    }
                    scrollOverflowHandler.create(element, scrollHeight);
                }
            } else {
                scrollOverflowHandler.remove(element);
            }
            element.css('overflow', '');
        }

        function addTableClass(element) {
            element.addClass(TABLE).wrapInner('<div class="' + TABLE_CELL + '" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element) {
            var sectionHeight = windowsHeight;
            if (options.paddingTop || options.paddingBottom) {
                var section = element;
                if (!section.hasClass(SECTION)) {
                    section = element.closest(SECTION_SEL);
                }
                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }
            return sectionHeight;
        }

        function transformContainer(translate3d, animated) {
            if (animated) {
                addAnimation(container);
            } else {
                removeAnimation(container);
            }
            container.css(getTransforms(translate3d));
            setTimeout(function () {
                container.removeClass(NO_TRANSITION);
            }, 10);
        }

        function getSectionByAnchor(sectionAnchor) {
            var section = container.find(SECTION_SEL + '[data-anchor="' + sectionAnchor + '"]');
            if (!section.length) {
                section = $(SECTION_SEL).eq((sectionAnchor - 1));
            }
            return section;
        }

        function getSlideByAnchor(slideAnchor, section) {
            var slides = section.find(SLIDES_WRAPPER_SEL);
            var slide = slides.find(SLIDE_SEL + '[data-anchor="' + slideAnchor + '"]');
            if (!slide.length) {
                slide = slides.find(SLIDE_SEL).eq(slideAnchor);
            }
            return slide;
        }

        function scrollPageAndSlide(destiny, slide) {
            var section = getSectionByAnchor(destiny);
            if (typeof slide === 'undefined') {
                slide = 0;
            }
            if (destiny !== lastScrolledDestiny && !section.hasClass(ACTIVE)) {
                scrollPage(section, function () {
                    scrollSlider(section, slide);
                });
            } else {
                scrollSlider(section, slide);
            }
        }

        function scrollSlider(section, slideAnchor) {
            if (typeof slideAnchor !== 'undefined') {
                var slides = section.find(SLIDES_WRAPPER_SEL);
                var destiny = getSlideByAnchor(slideAnchor, section);
                if (destiny.length) {
                    landscapeScroll(slides, destiny);
                }
            }
        }

        function addSlidesNavigation(section, numSlides) {
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);
            nav.addClass(options.slidesNavPosition);
            for (var i = 0; i < numSlides; i++) {
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }
            nav.css('margin-left', '-' + (nav.width() / 2) + 'px');
            nav.find('li').first().find('a').addClass(ACTIVE);
        }

        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex) {
            var sectionHash = '';
            if (options.anchors.length && !options.lockAnchors) {
                if (slideIndex) {
                    if (typeof anchorLink !== 'undefined') {
                        sectionHash = anchorLink;
                    }
                    if (typeof slideAnchor === 'undefined') {
                        slideAnchor = slideIndex;
                    }
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);
                } else if (typeof slideIndex !== 'undefined') {
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                } else {
                    setUrlHash(anchorLink);
                }
            }
            setBodyClass();
        }

        function setUrlHash(url) {
            if (options.recordHistory) {
                location.hash = url;
            } else {
                if (isTouchDevice || isTouch) {
                    window.history.replaceState(undefined, undefined, '#' + url);
                } else {
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace(baseUrl + '#' + url);
                }
            }
        }

        function getAnchor(element) {
            var anchor = element.data('anchor');
            var index = element.index();
            if (typeof anchor === 'undefined') {
                anchor = index;
            }
            return anchor;
        }

        function setBodyClass() {
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);
            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);
            var text = String(sectionAnchor);
            if (slide.length) {
                text = text + '-' + slideAnchor;
            }
            text = text.replace('/', '-').replace('#', '');
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        function support3d() {
            var el = document.createElement('p'),
                has3d, transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        function removeMouseWheelHandler() {
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false);
                document.removeEventListener('wheel', MouseWheelHandler, false);
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false);
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler);
            }
        }

        function addMouseWheelHandler() {
            var prefix = '';
            var _addEventListener;
            if (window.addEventListener) {
                _addEventListener = "addEventListener";
            } else {
                _addEventListener = "attachEvent";
                prefix = 'on';
            }
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
            if (support == 'DOMMouseScroll') {
                document[_addEventListener](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
            } else {
                document[_addEventListener](prefix + support, MouseWheelHandler, false);
            }
        }

        function addMiddleWheelHandler() {
            container.on('mousedown', mouseDownHandler).on('mouseup', mouseUpHandler);
        }

        function removeMiddleWheelHandler() {
            container.off('mousedown', mouseDownHandler).off('mouseup', mouseUpHandler);
        }

        function addTouchHandler() {
            if (isTouchDevice || isTouch) {
                var MSPointer = getMSPointer();
                $(WRAPPER_SEL).off('touchstart ' + MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        function removeTouchHandler() {
            if (isTouchDevice || isTouch) {
                var MSPointer = getMSPointer();
                $(WRAPPER_SEL).off('touchstart ' + MSPointer.down);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move);
            }
        }

        function getMSPointer() {
            var pointer;
            if (window.PointerEvent) {
                pointer = {
                    down: 'pointerdown',
                    move: 'pointermove'
                };
            } else {
                pointer = {
                    down: 'MSPointerDown',
                    move: 'MSPointerMove'
                };
            }
            return pointer;
        }

        function getEventsPage(e) {
            var events = [];
            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);
            if (isTouch && isReallyTouch(e) && options.scrollBar) {
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }
            return events;
        }

        function silentLandscapeScroll(activeSlide, noCallbacks) {
            FP.setScrollingSpeed(0, 'internal');
            if (typeof noCallbacks !== 'undefined') {
                isResizing = true;
            }
            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);
            if (typeof noCallbacks !== 'undefined') {
                isResizing = false;
            }
            FP.setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        function silentScroll(top) {
            if (options.scrollBar) {
                container.scrollTop(top);
            } else if (options.css3) {
                var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
                transformContainer(translate3d, false);
            } else {
                container.css('top', -top);
            }
        }

        function getTransforms(translate3d) {
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform': translate3d,
                'transform': translate3d
            };
        }

        function setIsScrollAllowed(value, direction, type) {
            switch (direction) {
                case 'up':
                    isScrollAllowed[type].up = value;
                    break;
                case 'down':
                    isScrollAllowed[type].down = value;
                    break;
                case 'left':
                    isScrollAllowed[type].left = value;
                    break;
                case 'right':
                    isScrollAllowed[type].right = value;
                    break;
                case 'all':
                    if (type == 'm') {
                        FP.setAllowScrolling(value);
                    } else {
                        FP.setKeyboardScrolling(value);
                    }
            }
        }
        FP.destroy = function (all) {
            FP.setAutoScrolling(false, 'internal');
            FP.setAllowScrolling(false);
            FP.setKeyboardScrolling(false);
            container.addClass(DESTROYED);
            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);
            $window.off('scroll', scrollHandler).off('hashchange', hashChangeHandler).off('resize', resizeHandler);
            $document.off('click', SECTION_NAV_SEL + ' a').off('mouseenter', SECTION_NAV_SEL + ' li').off('mouseleave', SECTION_NAV_SEL + ' li').off('click', SLIDES_NAV_LINK_SEL).off('mouseover', options.normalScrollElements).off('mouseout', options.normalScrollElements);
            $(SECTION_SEL).off('click', SLIDES_ARROW_SEL);
            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            if (all) {
                destroyStructure();
            }
        };

        function destroyStructure() {
            silentScroll(0);
            container.find('img[data-src], source[data-src], audio[data-src], iframe[data-src]').each(function () {
                $(this).attr('src', $(this).data('src'));
                $(this).removeAttr('data-src');
            });
            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL + ', ' + SLIDES_ARROW_SEL).remove();
            $(SECTION_SEL).css({
                'height': '',
                'background-color': '',
                'padding': ''
            });
            $(SLIDE_SEL).css({
                'width': ''
            });
            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });
            $htmlBody.css({
                'overflow': '',
                'height': ''
            });
            $('html').removeClass(ENABLED);
            $body.removeClass(RESPONSIVE);
            $.each($body.get(0).className.split(/\s+/), function (index, className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    $body.removeClass(className);
                }
            });
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function () {
                options.scrollOverflowHandler.remove($(this));
                $(this).removeClass(TABLE + ' ' + ACTIVE);
            });
            removeAnimation(container);
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function () {
                $(this).replaceWith(this.childNodes);
            });
            $htmlBody.scrollTop(0);
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            $.each(usedSelectors, function (index, value) {
                $('.' + value).removeClass(value);
            });
        }

        function setVariableState(variable, value, type) {
            options[variable] = value;
            if (type !== 'internal') {
                originals[variable] = value;
            }
        }

        function displayWarnings() {
            if ($('html').hasClass(ENABLED)) {
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }
            if (options.continuousVertical && (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }
            if (options.scrollBar && options.scrollOverflow) {
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }
            if (options.continuousVertical && options.scrollBar) {
                options.continuousVertical = false;
                showError('warn', 'Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }
            $.each(options.anchors, function (index, name) {
                var nameAttr = $document.find('[name]').filter(function () {
                    return $(this).attr('name') && $(this).attr('name').toLowerCase() == name.toLowerCase();
                });
                var idAttr = $document.find('[id]').filter(function () {
                    return $(this).attr('id') && $(this).attr('id').toLowerCase() == name.toLowerCase();
                });
                if (idAttr.length || nameAttr.length) {
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    idAttr.length && showError('error', '"' + name + '" is is being used by another element `id` property');
                    nameAttr.length && showError('error', '"' + name + '" is is being used by another element `name` property');
                }
            });
        }

        function showError(type, text) {
            console && console[type] && console[type]('fullPage: ' + text);
        }
    };
    if (typeof IScroll !== 'undefined') {
        IScroll.prototype.wheelOn = function () {
            this.wrapper.addEventListener('wheel', this);
            this.wrapper.addEventListener('mousewheel', this);
            this.wrapper.addEventListener('DOMMouseScroll', this);
        };
        IScroll.prototype.wheelOff = function () {
            this.wrapper.removeEventListener('wheel', this);
            this.wrapper.removeEventListener('mousewheel', this);
            this.wrapper.removeEventListener('DOMMouseScroll', this);
        };
    }
    var iscrollHandler = {
        refreshId: null,
        iScrollInstances: [],
        onLeave: function () {
            var scroller = $(SECTION_ACTIVE_SEL).find(SCROLLABLE_SEL).data('iscrollInstance');
            if (typeof scroller !== 'undefined' && scroller) {
                scroller.wheelOff();
            }
        },
        afterLoad: function () {
            var scroller = $(SECTION_ACTIVE_SEL).find(SCROLLABLE_SEL).data('iscrollInstance');
            if (typeof scroller !== 'undefined' && scroller) {
                scroller.wheelOn();
            }
        },
        create: function (element, scrollHeight) {

            var scrollable = element.find(SCROLLABLE_SEL);
            scrollable.height(scrollHeight);
            scrollable.each(function () {
                var $this = jQuery(this);
                var iScrollInstance = $this.data('iscrollInstance');
                if (iScrollInstance) {
                    $.each(iscrollHandler.iScrollInstances, function () {
                        $(this).destroy();
                    });
                }
                iScrollInstance = new IScroll($this.get(0), iscrollOptions);
                iscrollHandler.iScrollInstances.push(iScrollInstance);
                $this.data('iscrollInstance', iScrollInstance);
            });
        },
        isScrolled: function (type, scrollable) {


            var scroller = scrollable.data('iscrollInstance');
            if (!scroller) {
                return true;
            }
            if (type === 'top') {
                return scroller.y >= 0 && !scrollable.scrollTop();
            } else if (type === 'bottom') {
                return (0 - scroller.y) + scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        },
        scrollable: function (activeSection) {

            if (activeSection.find(SLIDES_WRAPPER_SEL).length) {
                return activeSection.find(SLIDE_ACTIVE_SEL).find(SCROLLABLE_SEL);
            }
            return activeSection.find(SCROLLABLE_SEL);
        },
        scrollHeight: function (element) {
            return element.find(SCROLLABLE_SEL).children().first().get(0).scrollHeight;
        },
        remove: function (element) {
            var scrollable = element.find(SCROLLABLE_SEL);
            if (scrollable.length) {
                var iScrollInstance = scrollable.data('iscrollInstance');
                iScrollInstance.destroy();
                scrollable.data('iscrollInstance', null);
            }
            element.find(SCROLLABLE_SEL).children().first().children().first().unwrap().unwrap();
        },
        update: function (element, scrollHeight) {
            clearTimeout(iscrollHandler.refreshId);
            iscrollHandler.refreshId = setTimeout(function () {
                $.each(iscrollHandler.iScrollInstances, function () {
                    $(this).get(0).refresh();
                });
            }, 150);
            element.find(SCROLLABLE_SEL).css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
        },
        wrapContent: function () {
            return '<div class="' + SCROLLABLE + '"><div class="fp-scroller"></div></div>';
        }
    };
});