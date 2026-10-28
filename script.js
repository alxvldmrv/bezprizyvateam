document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. КАРУСЕЛЬ ОТЗЫВОВ
    // ==================================================

    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');

    if (track && cards.length > 1) {
        let currentIndex = 0;
        let sliderInterval;

        function slideReviews() {
            currentIndex = (currentIndex + 1) % cards.length;

            // Перемещение на ширину одной карточки
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function startSlider() {
            stopSlider();
            sliderInterval = setInterval(slideReviews, 3500);
        }

        function stopSlider() {
            if (sliderInterval) {
                clearInterval(sliderInterval);
            }
        }

        // Останавливаем карусель, пока пользователь читает отзыв
        const slider = track.closest('.reviews-slider');

        if (slider) {
            slider.addEventListener('mouseenter', stopSlider);
            slider.addEventListener('mouseleave', startSlider);

            // Поддержка сенсорных экранов
            slider.addEventListener('touchstart', stopSlider, { passive: true });
            slider.addEventListener('touchend', startSlider, { passive: true });
        }

        // Адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        startSlider();
    }


    // ==================================================
    // 2. МОБИЛЬНОЕ МЕНЮ
    // ==================================================

    const menuToggle = document.querySelector(
        '.menu-toggle, .bp-menu-toggle'
    );

    const menu = document.querySelector(
        '#site-menu, #bp-navigation, .menu'
    );

    if (menuToggle && menu) {

        function closeMenu() {
            menu.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Открыть меню');
        }

        function toggleMenu() {
            const isOpen = menu.classList.toggle('is-open');

            menuToggle.classList.toggle('is-active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute(
                'aria-label',
                isOpen ? 'Закрыть меню' : 'Открыть меню'
            );
        }

        menuToggle.addEventListener('click', (event) => {
            event.preventDefault();
            toggleMenu();
        });

        // Закрываем меню после выбора раздела
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Закрываем меню клавишей Escape
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        // При переходе на широкую версию сбрасываем мобильное состояние
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }


    // ==================================================
    // 3. МОДАЛЬНОЕ ОКНО
    // ==================================================

    const modal = document.querySelector('#modal-callback, .modal');
    const closeBtn = modal
        ? modal.querySelector('.modal__close')
        : null;

    const openButtons = document.querySelectorAll(
        '.hero__btn, .btn-trigger, .step-btn, ' +
        '.tariff-trigger, .contacts-phone-btn'
    );

    function openModal(event) {
        if (event) {
            event.preventDefault();
        }

        if (!modal) {
            return;
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        if (closeBtn) {
            closeBtn.focus();
        }
    }

    function closeModal() {
        if (!modal) {
            return;
        }

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    if (modal) {
        openButtons.forEach(button => {
            button.addEventListener('click', openModal);
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Закрытие нажатием на затемнённый фон
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', event => {
            if (
                event.key === 'Escape' &&
                modal.classList.contains('is-open')
            ) {
                closeModal();
            }
        });
    }


    // ==================================================
    // 4. ОТПРАВКА ФОРМЫ
    // Сохраняем отправку через mail.php.
    // При ошибке не показываем ложное сообщение об успехе.
    // ==================================================

    if (modal) {
        const form = modal.querySelector('.modal__form');

        if (form) {
            form.addEventListener('submit', async event => {
                event.preventDefault();

                const submitBtn = form.querySelector('.modal__btn');

                if (!submitBtn) {
                    return;
                }

                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                const formData = new FormData(form);

                try {
                    const response = await fetch('mail.php', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка HTTP: ' + response.status);
                    }

                    const result = await response.json();

                    if (result.status === 'success') {
                        form.innerHTML = `
                            <div class="form-success">
                                <h4>Заявка отправлена!</h4>
                                <p>Мы перезвоним вам в ближайшее время.</p>
                            </div>
                        `;

                        setTimeout(() => {
                            closeModal();
                        }, 4000);

                    } else {
                        alert(
                            'Не удалось отправить заявку: ' +
                            (result.message || 'попробуйте ещё раз')
                        );

                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }

                } catch (error) {
                    console.error('Ошибка отправки формы:', error);

                    alert(
                        'Не удалось подтвердить отправку заявки. ' +
                        'Проверьте подключение и попробуйте ещё раз ' +
                        'или позвоните по телефону +7 (992) 092-77-11.'
                    );

                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }


    // ==================================================
    // 5. FAQ И БАЗА ЗНАНИЙ
    // При открытии одного ответа остальные закрываются.
    // ==================================================

    const questions = document.querySelectorAll(
        '.faq-question, .knowledge-question'
    );

    function closeAccordionItem(item) {
        item.classList.remove('is-open');

        const button = item.querySelector(
            '.faq-question, .knowledge-question'
        );

        const answer = item.querySelector('.faq-answer');

        if (button) {
            button.setAttribute('aria-expanded', 'false');
        }

        if (answer) {
            answer.style.maxHeight = null;
            answer.hidden = true;
        }
    }

    function openAccordionItem(item, button) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');

        const answer = item.querySelector('.faq-answer');

        if (answer) {
            answer.hidden = false;
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    }

    questions.forEach(question => {
        question.setAttribute(
            'aria-expanded',
            question.closest('.faq-item')?.classList.contains('is-open')
                ? 'true'
                : 'false'
        );

        question.addEventListener('click', () => {
            const parentItem = question.closest('.faq-item');

            if (!parentItem) {
                return;
            }

            const wasOpen = parentItem.classList.contains('is-open');

            // Закрываем открытые ответы в FAQ и базе знаний
            document.querySelectorAll('.faq-item.is-open').forEach(item => {
                closeAccordionItem(item);
            });

            // Если выбранный ответ был закрыт, открываем его
            if (!wasOpen) {
                openAccordionItem(parentItem, question);
            }
        });
    });

    // Пересчитываем высоту открытого ответа при повороте телефона
    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-item.is-open .faq-answer')
            .forEach(answer => {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            });
    });

});
