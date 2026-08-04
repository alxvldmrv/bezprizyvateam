document.addEventListener('DOMContentLoaded', () => {
    
    // 1. КОД СЛАЙДЕРА ОТЗЫВОВ
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    
    if (track && cards.length > 0) {
        let currentIndex = 0;

        function slideReviews() {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; 
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        setInterval(slideReviews, 3500);
    }

    // 2. КОД МОДАЛЬНОГО ОКНА
    const openBtn = document.querySelector('.hero__btn');
    const modal = document.querySelector('#modal-callback');
    const closeBtn = document.querySelector('.modal__close');

    if (openBtn && modal && closeBtn) {
        // Открыть окно
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-open');
        });

        // Закрыть по крестику
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('is-open');
        });

        // Закрыть по клику на темный фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-open');
            }
        });

        // Отправка формы
        const form = modal.querySelector('.modal__form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                const submitBtn = form.querySelector('.modal__btn');
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                const formData = new FormData(form);

                try {
                    const response = await fetch('mail.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        form.innerHTML = '<div style="text-align:center; padding: 20px 0;"><h4 style="color:#38a169; margin-bottom:10px; font-size:18px;">Успешно отправлено!</h4><p style="font-size:13px; color:#718096;">Мы перезвоним вам в ближайшее время.</p></div>';
                        setTimeout(() => {
                            modal.classList.remove('is-open');
                        }, 4000);
                    } else {
                        alert('Ошибка: ' + result.message);
                        submitBtn.textContent = 'Отправить заявку';
                        submitBtn.disabled = false;
                    }
                } catch (error) {
                    // Симуляция для теста на ПК
                    form.innerHTML = '<div style="text-align:center; padding: 20px 0;"><h4 style="color:#38a169; margin-bottom:10px; font-size:18px;">Тест локально: Успешно!</h4><p style="font-size:13px; color:#718096;">На хостинге письмо улетит на ваш Gmail.</p></div>';
                    setTimeout(() => {
                        modal.classList.remove('is-open');
                    }, 4000);
                }
            });
        }
    }

});

// Код для открытия формы со второй кнопки
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal'); // Находит модальное окно
    const secondBtn = document.querySelector('.step-btn'); // Находит новую серую кнопку

    if (secondBtn && modal) {
        secondBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-open'); // Добавляет класс открытия (как в строке 69/80 вашего кода)
        });
    }
});

// Код для открытия формы с кнопок тарифов
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal'); 
    const tariffBtns = document.querySelectorAll('.tariff-trigger');

    if (tariffBtns.length > 0 && modal) {
        tariffBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('is-open'); 
            });
        });
    }
});

// Код для открытия формы с кнопки контактов
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal'); 
    const contactsBtn = document.querySelector('.contacts-phone-btn'); 

    if (contactsBtn && modal) {
        contactsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-open'); 
        });
    }
});

// Код для работы аккордеона FAQ с автозакрытием
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const parentItem = this.parentElement;
                const currentAnswer = this.nextElementSibling;
                const isOpen = parentItem.classList.contains('is-open');

                const allOpenItems = document.querySelectorAll('.faq-item.is-open');
                allOpenItems.forEach(openItem => {
                    if (openItem !== parentItem) {
                        openItem.classList.remove('is-open');
                        const openAnswer = openItem.querySelector('.faq-answer');
                        if (openAnswer) {
                            openAnswer.style.maxHeight = null;
                        }
                    }
                });

                if (isOpen) {
                    parentItem.classList.remove('is-open');
                    if (currentAnswer) currentAnswer.style.maxHeight = null;
                } else {
                    parentItem.classList.add('is-open');
                    if (currentAnswer) currentAnswer.style.maxHeight = currentAnswer.scrollHeight + "px";
                }
            });
        });
    }
});

// Логика для других сворачиваемых блоков (База знаний)
document.addEventListener('DOMContentLoaded', () => {
    const knowledgeQuestions = document.querySelectorAll('.knowledge-question');
    if (knowledgeQuestions.length > 0) {
        knowledgeQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const parentItem = this.parentElement;
                const currentAnswer = this.nextElementSibling;
                parentItem.classList.toggle('is-open');
                
                if (parentItem.classList.contains('is-open')) {
                    if (currentAnswer) currentAnswer.style.maxHeight = currentAnswer.scrollHeight + "px";
                } else {
                    if (currentAnswer) currentAnswer.style.maxHeight = null;
                }
            });
        });
    }
});
