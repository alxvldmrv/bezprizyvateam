
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

        const slider = track.closest('.reviews-slider');

        if (slider) {
            slider.addEventListener('mouseenter', stopSlider);
            slider.addEventListener('mouseleave', startSlider);
            slider.addEventListener('touchstart', stopSlider, { passive: true });
            slider.addEventListener('touchend', startSlider, { passive: true });
        }

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

        menuToggle.addEventListener('click', event => {
            event.preventDefault();
            toggleMenu();
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

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

        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal();
            }
        });

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
    // 4. ТЕЛЕФОН И ОТПРАВКА ФОРМЫ
    // ==================================================

    if (modal) {
        const form = modal.querySelector('.modal__form');
        const phoneInput = form
            ? form.querySelector('input[name="user_phone"]')
            : null;

             // Форматирование российского номера телефона
        function formatPhone(value) {
            let digits = value.replace(/\D/g, '');

            if (digits.startsWith('8')) {
                digits = '7' + digits.slice(1);
            } else if (digits.startsWith('9')) {
                digits = '7' + digits;
            } else if (!digits.startsWith('7')) {
                digits = '7' + digits;
            }

            digits = digits.slice(0, 11);

            let result = '+7';

            if (digits.length > 1) {
                result += ' (' + digits.slice(1, 4);
            }

            if (digits.length >= 4) {
                result += ') ' + digits.slice(4, 7);
            }

            if (digits.length >= 8) {
                result += '-' + digits.slice(7, 9);
            }

            if (digits.length >= 10) {
                result += '-' + digits.slice(9, 11);
            }

            return result;
        }

        if (phoneInput) {
            phoneInput.setAttribute('type', 'tel');
            phoneInput.setAttribute('inputmode', 'numeric');
            phoneInput.setAttribute('autocomplete', 'tel');
            phoneInput.setAttribute('maxlength', '18');
            phoneInput.setAttribute('placeholder', '+7 (999) 999-99-99');

            function setPhonePosition(count) {
                let position = 0;
                let found = 0;

                while (position < phoneInput.value.length && found < count) {
                    if (/\d/.test(phoneInput.value[position])) found++;
                    position++;
                }

                phoneInput.setSelectionRange(position, position);
            }

            phoneInput.addEventListener('input', () => {
                const caret = phoneInput.selectionStart;
                const count = phoneInput.value.slice(0, caret)
                    .replace(/\D/g, '').length;

                phoneInput.value = formatPhone(phoneInput.value);
                setPhonePosition(Math.min(count, 11));
                phoneInput.setCustomValidity('');
            });

            phoneInput.addEventListener('focus', () => {
                if (!phoneInput.value) {
                    phoneInput.value = '+7';
                    phoneInput.setSelectionRange(2, 2);
                }
            });

            phoneInput.addEventListener('keydown', (e) => {
                if (!['Backspace', 'Delete'].includes(e.key)) return;

                e.preventDefault();

                let digits = phoneInput.value.replace(/\D/g, '');
                const start = phoneInput.selectionStart;
                const end = phoneInput.selectionEnd;

                let before = phoneInput.value.slice(0, start)
                    .replace(/\D/g, '').length;

                let after = phoneInput.value.slice(0, end)
                    .replace(/\D/g, '').length;

                if (start === end) {
                    if (e.key === 'Backspace') {
                        if (before <= 1) return;
                        before--;
                        after = before + 1;
                    } else {
                        if (before >= digits.length) return;
                        after = before + 1;
                    }
                }

                digits = digits.slice(0, Math.max(1, before)) +
                         digits.slice(Math.max(1, after));

                phoneInput.value = formatPhone(digits);
                setPhonePosition(Math.max(1, before));
                phoneInput.setCustomValidity('');
            });

            phoneInput.addEventListener('blur', () => {
                if (phoneInput.value === '+7') {
                    phoneInput.value = '';
                }
            });
        }

        if (form) {
            form.addEventListener('submit', async event => {
                event.preventDefault();

                // Проверяем номер до отправки формы
                if (phoneInput) {
                    const digits = phoneInput.value.replace(/\D/g, '');

                    if (digits.length !== 11 || !digits.startsWith('7')) {
                        phoneInput.setCustomValidity(
                            'Введите полный номер в формате +7 (999) 999-99-99'
                        );
                        phoneInput.reportValidity();
                        phoneInput.focus();
                        return;
                    }

                    phoneInput.setCustomValidity('');
                }

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

            document.querySelectorAll('.faq-item.is-open').forEach(item => {
                closeAccordionItem(item);
            });

            if (!wasOpen) {
                openAccordionItem(parentItem, question);
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-item.is-open .faq-answer')
            .forEach(answer => {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            });
    });

});
