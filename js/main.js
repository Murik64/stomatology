/**
 * Немецкая семейная клиника - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initHeader();
    initSmoothScroll();
    initAnimations();
    initSliders();
    initBackToTop();
    initMobileMenu();
    initDirectionsTabs();
    initHistoryTimeline();
    initPreventiveProgramsFilters();
    initJourneyTimeline();
    initPrinciplesCarousel();
    initStepsTimeline();
    initOphthalmologyReviewsTabs();
    initBenefitsCarousel();
});

/**
 * Header functionality
 */
function initHeader() {
    const header = document.getElementById('header');
    const root = document.documentElement;
    let lastScroll = 0;

    const updateHeaderHeight = () => {
        root.style.setProperty('--header-height', `${header.offsetHeight}px`);

        if (window.innerWidth <= 768) {
            document.body.style.paddingTop = '0px';
            return;
        }

        document.body.style.paddingTop = `${header.offsetHeight}px`;
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // При скролле вверх показываем шапку, вниз — скрываем (только после прокрутки за высоту хедера)
        if (currentScroll <= 0 || currentScroll < lastScroll) {
            header.classList.remove('header-hidden');
        } else if (currentScroll > header.offsetHeight) {
            header.classList.add('header-hidden');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll animations
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.section-header, .section-standards__card, .competence-card, .doctor-card, ' +
        '.program-card, .offer-card, .news-card, .review-card, .clinic-card'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-target {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animations for grid items */
        .animate-in:nth-child(1) { transition-delay: 0s; }
        .animate-in:nth-child(2) { transition-delay: 0.1s; }
        .animate-in:nth-child(3) { transition-delay: 0.2s; }
        .animate-in:nth-child(4) { transition-delay: 0.3s; }
        .animate-in:nth-child(5) { transition-delay: 0.4s; }
        .animate-in:nth-child(6) { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
}

/**
 * Hero Slider functionality
 */
function initHeroSlider() {
    const heroSection = document.querySelector('.hero-section');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtns = document.querySelectorAll('.hero-nav .arrow-prev');
    const nextBtns = document.querySelectorAll('.hero-nav .arrow-next');
    console.log('Hero Slider Init:', {
        heroSection: !!heroSection,
        slides: slides.length,
        prevBtns: prevBtns.length,
        nextBtns: nextBtns.length
    });

    if (!slides.length) {
        console.warn('Hero Slider: No slides found');
        return;
    }

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval = null;
    const autoSlideDelay = 70000; // 7 секунд между слайдами

    // Функция переключения слайда
    function goToSlide(index) {
        console.log('Going to slide:', index, 'from:', currentSlide);

        // Убираем активный класс у текущего слайда
        slides[currentSlide].classList.remove('active');

        // Вычисляем новый индекс (с зацикливанием)
        currentSlide = (index + totalSlides) % totalSlides;

        // Добавляем активный класс новому слайду
        slides[currentSlide].classList.add('active');

        console.log('Now on slide:', currentSlide);
    }

    // Следующий слайд
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Предыдущий слайд
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Запуск автопрокрутки
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    // Остановка автопрокрутки
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Обработчики кликов - все кнопки prev/next
    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button clicked');
            prevSlide();
            startAutoSlide();
        });
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            nextSlide();
            startAutoSlide();
        });
    });

    console.log('Hero Slider: Event listeners attached');

    // Пауза автопрокрутки при наведении
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);

    // Поддержка свайпов на мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoSlide();
        }
    }

    // Поддержка клавиатуры
    document.addEventListener('keydown', (e) => {
        // Проверяем, что hero секция видна
        const heroRect = heroSection.getBoundingClientRect();
        const isVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoSlide();
            }
        }
    });

    // Запускаем автопрокрутку
    startAutoSlide();
}

/**
 * Simple slider functionality for arrows
 */
function initSliders() {
    // Инициализация Hero слайдера
    initHeroSlider();

    // Reviews slider arrows
    const reviewsArrows = document.querySelector('.reviews-section .slider-arrows');
    if (reviewsArrows) {
        const section = reviewsArrows.closest('.reviews-section');
        const prevBtn = reviewsArrows.querySelector('.arrow-prev');
        const nextBtn = reviewsArrows.querySelector('.arrow-next');

        function getScrollableGrid() {
            const videoGrid = section?.querySelector('.ophthalmology-reviews__video-grid');
            const textGrid = section?.querySelector('.reviews-grid');
            if (videoGrid && !videoGrid.hidden) return videoGrid;
            if (textGrid && !textGrid.hidden) return textGrid;
            return textGrid || videoGrid;
        }

        function getCardStep() {
            const grid = getScrollableGrid();
            if (!grid) return 280;
            const card = grid.querySelector('.ophthalmology-reviews__video-card, .review-card');
            return card ? card.offsetWidth + 24 : 280;
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const grid = getScrollableGrid();
                if (grid) grid.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                const grid = getScrollableGrid();
                if (grid) grid.scrollBy({ left: getCardStep(), behavior: 'smooth' });
            });
        }
    }

    // Doctor reviews slider arrows (mobile)
    const doctorReviewsArrows = document.querySelector('.doctor-reviews-arrows');
    if (doctorReviewsArrows) {
        const grid = document.querySelector('.doctor-reviews-grid');
        const prevBtn = doctorReviewsArrows.querySelector('.doctor-reviews-arrow--prev');
        const nextBtn = doctorReviewsArrows.querySelector('.doctor-reviews-arrow--next');

        if (prevBtn && nextBtn && grid) {
            const getCardStep = () => {
                const card = grid.querySelector('.doctor-review-card');
                return card ? card.offsetWidth + 10 : 230;
            };

            prevBtn.addEventListener('click', () => {
                grid.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                grid.scrollBy({ left: getCardStep(), behavior: 'smooth' });
            });
        }
    }

    // Programs slider arrows (mobile)
    const programsArrows = document.querySelector('.programs-arrows');
    if (programsArrows) {
        const programsGrid = document.querySelector('.programs-grid');
        const prevBtn = programsArrows.querySelector('.arrow-prev');
        const nextBtn = programsArrows.querySelector('.arrow-next');

        if (prevBtn && nextBtn && programsGrid) {
            const cardWidth = 210; // 200px card + 10px gap

            prevBtn.addEventListener('click', () => {
                programsGrid.scrollBy({
                    left: -cardWidth,
                    behavior: 'smooth'
                });
            });

            nextBtn.addEventListener('click', () => {
                programsGrid.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            });
        }
    }
}

/**
 * Back to top functionality
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('a[href="#header"]');

    if (!backToTopBtn) {
        // Create back to top button from footer
        const footerBtns = document.querySelectorAll('.btn-footer-outline');
        footerBtns.forEach(btn => {
            if (btn.textContent.includes('Наверх')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        });
    }
}

/**
 * Tab functionality enhancement
 */
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function (e) {
        // Re-trigger animations for newly visible content
        const target = document.querySelector(e.target.dataset.bsTarget);
        if (target) {
            const elements = target.querySelectorAll('.animate-target');
            elements.forEach((el, index) => {
                el.classList.remove('animate-in');
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 100);
            });
        }
    });
});

/**
 * Mobile menu toggle and accordion functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-nav-submenu a, .mobile-menu-departments a, .mobile-nav-link');
    const accordionToggles = document.querySelectorAll('.mobile-nav-toggle');

    if (!mobileMenu) {
        return;
    }

    const panel = mobileMenu.querySelector('.mobile-menu-panel');

    // Открытие меню
    function openMenu() {
        mobileMenu.classList.add('active');
        document.documentElement.classList.add('menu-open');
        document.body.classList.add('menu-open');
        // Фокус на первый элемент для accessibility
        setTimeout(() => {
            const firstFocusable = mobileMenu.querySelector('a, button');
            if (firstFocusable) firstFocusable.focus();
        }, 300);
    }

    // Закрытие меню
    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        // Закрываем все аккордеоны при закрытии меню
        accordionToggles.forEach(toggle => {
            toggle.closest('.mobile-nav-item')?.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    }

    // Открытие/закрытие меню по кнопке бургера
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Закрытие по кнопке крестика (новая и старая версия)
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    // Обратная совместимость со старой кнопкой закрытия
    const oldCloseBtn = document.querySelector('.menu-toggle-close');
    if (oldCloseBtn && oldCloseBtn !== menuClose) {
        oldCloseBtn.addEventListener('click', closeMenu);
    }

    // Закрытие при клике на оверлей
    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    });

    // Предотвращаем закрытие при клике на панель
    if (panel) {
        panel.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Закрытие при клике на ссылки (кроме кнопок аккордеона)
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Аккордеон функционал
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const navItem = toggle.closest('.mobile-nav-item');
            const isActive = navItem.classList.contains('active');
            
            // Опционально: закрыть другие открытые аккордеоны
            // accordionToggles.forEach(otherToggle => {
            //     otherToggle.closest('.mobile-nav-item')?.classList.remove('active');
            //     otherToggle.setAttribute('aria-expanded', 'false');
            // });
            
            // Переключаем текущий аккордеон
            if (isActive) {
                navItem.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                navItem.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Touch swipe для закрытия меню (свайп влево)
    let touchStartX = 0;
    let touchEndX = 0;

    if (panel) {
        panel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        panel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            // Свайп влево закрывает меню
            if (diff > 80) {
                closeMenu();
            }
        }, { passive: true });
    }

    // Trap focus внутри модального окна для accessibility
    mobileMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = mobileMenu.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    });
}

/**
 * Form validation (for future forms)
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

/**
 * Phone number formatting
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
        }

        let formatted = '+7';
        if (value.length > 0) formatted += ' (' + value.substring(0, 3);
        if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
        if (value.length >= 6) formatted += '-' + value.substring(6, 8);
        if (value.length >= 8) formatted += '-' + value.substring(8, 10);

        input.value = formatted;
    }
}

/**
 * History Timeline Carousel
 * Секция 7: История клиники — горизонтальная прокрутка линии таймлайна и карточек
 */
function initHistoryTimeline() {
    const scrollContainer = document.querySelector('.about-history__scroll');
    const prevBtn = document.querySelector('.about-history__nav-btn--prev');
    const nextBtn = document.querySelector('.about-history__nav-btn--next');

    if (!scrollContainer || !prevBtn || !nextBtn) {
        return;
    }

    // Динамический расчёт шага: 1 карточка (ширина + gap)
    function getStep() {
        const card = scrollContainer.querySelector('.about-history__card');
        if (!card) return 270;
        const gap = parseInt(getComputedStyle(scrollContainer.querySelector('.about-history__cards')).gap) || 20;
        return card.offsetWidth + gap;
    }

    // Кнопка «Назад» — на 1 карточку
    prevBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    // Кнопка «Вперёд» — на 1 карточку
    nextBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    // Touch/swipe поддержка для мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    scrollContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            scrollContainer.scrollBy({
                left: diff > 0 ? getStep() : -getStep(),
                behavior: 'smooth'
            });
        }
    }

    // Поддержка перетаскивания мышью
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
}

/**
 * Directions Section Tabs
 */
function initDirectionsTabs() {
    const tabs = document.querySelectorAll('.directions-tab');
    const panes = document.querySelectorAll('.directions-pane');

    if (!tabs.length || !panes.length) {
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Убираем активный класс у всех вкладок и панелей
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс выбранной вкладке
            tab.classList.add('active');

            // Показываем соответствующую панель
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/**
 * Preventive medicine program filters
 */
function initPreventiveProgramsFilters() {
    const tabs = document.querySelectorAll('.preventive-programs__tab');

    if (!tabs.length) {
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const parent = tab.closest('.preventive-programs');
            if (parent) {
                parent.querySelectorAll('.preventive-programs__tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');
        });
    });
}

/**
 * Journey timeline — arrow navigation highlights active step
 * Поддержка: preventive-medicine, ophthalmology
 */
function initJourneyTimeline() {
    const section = document.querySelector('.preventive-journey');
    if (!section) return;

    const prevBtn = section.querySelector('.preventive-journey__arrow--prev');
    const nextBtn = section.querySelector('.preventive-journey__arrow--next');
    const stepsTrack = section.querySelector('.preventive-journey__steps');
    const dotsTrack = section.querySelector('.preventive-journey__track');
    const dots = section.querySelectorAll('.preventive-journey__dot');
    const steps = section.querySelectorAll('.preventive-journey__step');
    const viewport = section.querySelector('.preventive-journey__viewport');

    if (!prevBtn || !nextBtn || !stepsTrack || !steps.length || !viewport) return;

    const TOTAL = steps.length;
    let position = 0;

    function getVisible() {
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 992) return 3;
        return 4;
    }

    function getStepOffsets() {
        var offsets = [];
        var x = 0;
        for (var i = 0; i < TOTAL; i++) {
            offsets.push(x);
            x += steps[i].offsetWidth + (i < TOTAL - 1 ? 20 : 0);
        }
        offsets.totalWidth = x;
        return offsets;
    }

    function slideTo(pos) {
        var visible = getVisible();
        var info = getStepOffsets();
        var totalWidth = info.totalWidth;
        var maxOffset = Math.max(0, totalWidth - viewport.clientWidth);
        var maxPos = 0;
        var vw = viewport.clientWidth;
        for (var i = 0; i < TOTAL; i++) {
            if (info[i] + steps[i].offsetWidth > vw) {
                maxPos = i;
            }
        }

        position = Math.max(0, Math.min(pos, maxPos));

        var offset = Math.min(info[position], maxOffset);

        stepsTrack.style.transform = 'translateX(-' + offset + 'px)';

        if (dotsTrack) {
            dotsTrack.style.transform = 'translateX(-' + offset + 'px)';
        }

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i >= position && i < position + visible);
        });

        prevBtn.disabled = position === 0;
        nextBtn.disabled = position >= maxPos;
    }

    prevBtn.addEventListener('click', function() { slideTo(position - 1); });
    nextBtn.addEventListener('click', function() { slideTo(position + 1); });

    window.addEventListener('resize', function() { slideTo(position); });

    slideTo(0);
}

/**
 * Principles carousel — horizontal scroll via arrow buttons
 * Поддержка: preventive-medicine
 */
function initPrinciplesCarousel() {
    const grids = document.querySelectorAll('.preventive-principles__grid');

        grids.forEach(grid => {
        const arrows = grid.closest('section')?.querySelectorAll('.preventive-principles__arrow');
        if (!arrows?.length) return;

        arrows.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = grid.querySelector('.preventive-principles__card');
                if (!card) return;
                const step = card.offsetWidth + 10;
                const dir = btn.dataset.dir === 'next' ? 1 : -1;
                grid.scrollBy({ left: step * dir, behavior: 'smooth' });
            });
        });
    });
}

/**
 * Program steps timeline — arrow navigation for horizontal scroll
 */
/**
 * Ophthalmology reviews tabs (Видео-отзывы / Текстовые отзывы)
 */
function initOphthalmologyReviewsTabs() {
    const tabs = document.querySelectorAll('.ophthalmology-reviews__tab');
    const videoPanel = document.querySelector('.ophthalmology-reviews__video-grid');
    const textPanel = document.querySelector('.ophthalmology-reviews [data-review-panel="text"]');

    if (!tabs.length || !videoPanel || !textPanel) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.reviewTab;
            tabs.forEach((t) => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab);
            });
            videoPanel.hidden = target !== 'video';
            textPanel.hidden = target !== 'text';
        });
    });
}

function initStepsTimeline() {
    const timeline = document.querySelector('.program-steps__timeline');
    const leftBtn = document.querySelector('.program-steps__arrow--left');
    const rightBtn = document.querySelector('.program-steps__arrow--right');

    if (!timeline || !leftBtn || !rightBtn) return;

    function getStep() {
        const col = timeline.querySelector('.col');
        if (!col) return 222;
        return col.offsetWidth + 30;
    }

    leftBtn.addEventListener('click', () => {
        timeline.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        timeline.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
}

function initBenefitsCarousel() {
    const grid = document.querySelector('.ophthalmology-benefits__grid');
    const leftBtn = document.querySelector('.ophthalmology-benefits__arrow--left');
    const rightBtn = document.querySelector('.ophthalmology-benefits__arrow--right');

    if (!grid || !leftBtn || !rightBtn) return;

    function getStep() {
        const card = grid.querySelector('.ophthalmology-benefits__card');
        if (!card) return 230;
        return card.offsetWidth + 10;
    }

    leftBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        grid.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
}

window.GermanClinic = {
    initHeader,
    initSmoothScroll,
    initAnimations,
    initSliders,
    validateForm,
    formatPhoneNumber,
    initDirectionsTabs,
    initHistoryTimeline,
    initPreventiveProgramsFilters,
    initJourneyTimeline,
    initPrinciplesCarousel,
    initStepsTimeline,
    initBenefitsCarousel
};
