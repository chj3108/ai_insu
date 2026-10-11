/**
 * 생명보험 vs 손해보험 비교 웹사이트 - script.js
 * 
 * 구현 기능:
 * 1. 헤더 메뉴의 부드러운 섹션 이동 및 활성 링크 감지
 * 2. 메인 히어로 버튼 클릭 시 해당 섹션으로 이동
 * 3. 상품 카드의 상세 설명 열기/닫기 토글 (키보드 지원)
 * 4. FAQ 아코디언 토글 (키보드 지원)
 * 5. 3문제 객관식 퀴즈 정답 판정, 해설 표시 및 점수 계산
 * 6. 퀴즈 다시 풀기
 * 7. 모바일 반응형 메뉴 토글
 * 8. 키보드 접근성 및 포커스 관리
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
  initProductCardToggles();
  initFaqAccordion();
  initQuizSystem();
});

/* ==========================================================================
   1. 모바일 메뉴 토글
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileNav) return;

  function toggleMenu(isOpen) {
    const shouldOpen = isOpen !== undefined ? isOpen : menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      mobileNav.removeAttribute('hidden');
    } else {
      mobileNav.setAttribute('hidden', '');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // 메뉴 링크 클릭 시 닫기
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
      if (menuBtn.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    }
  });

  // ESC 키 닫기 지원
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      menuBtn.focus();
    }
  });
}

/* ==========================================================================
   2. 스무스 스크롤 & 메인 CTA 버튼 섹션 이동
   ========================================================================== */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 72;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // 웹 접근성 초점 이동
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

/* ==========================================================================
   3. 스크롤 위치 감지 헤더 스타일 & 활성 메뉴 하이라이트
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function onScroll() {
    // 1. 헤더 그림자 제어
    if (window.scrollY > 10) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // 2. 현재 스크롤 위치에 따른 네비게이션 활성화
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   4. 대표 상품 카드의 상세 설명 열기/닫기 토글
   ========================================================================== */
function initProductCardToggles() {
  const toggleButtons = document.querySelectorAll('.product-card-toggle');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const controlsId = button.getAttribute('aria-controls');
      const detailsEl = document.getElementById(controlsId);

      if (!detailsEl) return;

      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        detailsEl.setAttribute('hidden', '');
        const toggleText = button.querySelector('.toggle-text');
        if (toggleText) toggleText.textContent = '상세보기';
      } else {
        button.setAttribute('aria-expanded', 'true');
        detailsEl.removeAttribute('hidden');
        const toggleText = button.querySelector('.toggle-text');
        if (toggleText) toggleText.textContent = '접기';
      }
    });
  });
}

/* ==========================================================================
   5. FAQ 아코디언 UI
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const controlsId = button.getAttribute('aria-controls');
      const answerEl = document.getElementById(controlsId);
      const parentItem = button.closest('.faq-item');

      if (!answerEl) return;

      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        answerEl.setAttribute('hidden', '');
        parentItem?.classList.remove('is-open');
      } else {
        button.setAttribute('aria-expanded', 'true');
        answerEl.removeAttribute('hidden');
        parentItem?.classList.add('is-open');
      }
    });
  });
}

/* ==========================================================================
   6. 3문제 객관식 이해도 퀴즈 시스템
   ========================================================================== */
function initQuizSystem() {
  // 퀴즈 데이터 명세
  const quizData = [
    {
      question: "1. 일반적으로 사망보험금과 평생 보장을 중심으로 설계되는 대표 상품은?",
      options: ["자동차보험", "종신보험", "화재보험"],
      answer: 1, // '종신보험'
      explanation: "종신보험은 피보험자의 사망 시기를 한정하지 않고 평생 동안 보장하며 사망 시 약관에 따라 사망보험금을 지급하는 생명보험의 대표적인 상품입니다."
    },
    {
      question: "2. 실손의료보험의 일반적인 보상 방식은?",
      options: [
        "실제 부담한 보장 대상 의료비를 기준으로 보상",
        "모든 병원비를 무조건 전액 지급",
        "가입할 때마다 의료비를 중복으로 전액 지급"
      ],
      answer: 0, // '실제 부담한 보장 대상 의료비를 기준으로 보상'
      explanation: "실손의료보험은 실제 발생한 치료비 중 약관 및 자기부담금을 감안하여 실제 손해액을 기준으로 보상하는 '실손비례보상' 방식이 기본 원칙입니다."
    },
    {
      question: "3. 손해보험사와 생명보험사에 관한 설명 중 올바른 것은?",
      options: [
        "건강보험은 반드시 생명보험사에서만 가입할 수 있다.",
        "실손의료보험은 손해보험사에서만 가입할 수 있다.",
        "두 업권 모두 다양한 질병 보장 상품을 취급할 수 있다."
      ],
      answer: 2, // '두 업권 모두 다양한 질병 보장 상품을 취급할 수 있다.'
      explanation: "암, 뇌혈관, 심장질환 등 질병 및 상해와 실손의료보험을 아우르는 제3보험 영역은 생명보험사와 손해보험사 모두 취급할 수 있습니다."
    }
  ];

  let currentQuestionIndex = 0;
  let selectedOptionIndex = null;
  let score = 0;
  let hasCheckedAnswer = false;

  // DOM 요소 참조
  const currentNumEl = document.getElementById('currentQuestionNum');
  const totalNumEl = document.getElementById('totalQuestionsNum');
  const progressFillEl = document.getElementById('quizProgressFill');
  const questionTextEl = document.getElementById('questionText');
  const optionsGroupEl = document.getElementById('optionsGroup');
  const feedbackBoxEl = document.getElementById('quizFeedbackBox');
  const feedbackBadgeEl = document.getElementById('feedbackBadge');
  const feedbackExplanationEl = document.getElementById('feedbackExplanation');
  const checkBtn = document.getElementById('quizCheckBtn');
  const nextBtn = document.getElementById('quizNextBtn');

  const quizContentEl = document.getElementById('quizContent');
  const quizProgressWrapEl = document.getElementById('quizProgressWrap');
  const quizResultViewEl = document.getElementById('quizResultView');
  const finalScoreEl = document.getElementById('finalScoreText');
  const resultCommentEl = document.getElementById('resultCommentText');
  const restartBtn = document.getElementById('quizRestartBtn');

  if (!questionTextEl || !optionsGroupEl || !checkBtn) return;

  if (totalNumEl) totalNumEl.textContent = String(quizData.length);

  // 문제 렌더링
  function loadQuestion(index) {
    const q = quizData[index];
    selectedOptionIndex = null;
    hasCheckedAnswer = false;

    // 상단 진행 상태
    if (currentNumEl) currentNumEl.textContent = String(index + 1);
    if (progressFillEl) {
      const progressPercent = ((index + 1) / quizData.length) * 100;
      progressFillEl.style.width = `${progressPercent}%`;
    }

    // 질문 텍스트
    questionTextEl.textContent = q.question;

    // 선지 렌더링
    optionsGroupEl.innerHTML = '';
    q.options.forEach((optText, optIdx) => {
      const optionBtn = document.createElement('button');
      optionBtn.type = 'button';
      optionBtn.className = 'quiz-option-btn';
      optionBtn.setAttribute('data-index', String(optIdx));
      optionBtn.setAttribute('role', 'radio');
      optionBtn.setAttribute('aria-checked', 'false');

      const marker = document.createElement('span');
      marker.className = 'option-marker';
      marker.textContent = String(optIdx + 1);

      const label = document.createElement('span');
      label.className = 'option-text';
      label.textContent = optText;

      optionBtn.appendChild(marker);
      optionBtn.appendChild(label);

      optionBtn.addEventListener('click', () => {
        if (hasCheckedAnswer) return;
        selectOption(optIdx);
      });

      optionsGroupEl.appendChild(optionBtn);
    });

    // 피드백 영역 숨김 초기화
    if (feedbackBoxEl) {
      feedbackBoxEl.setAttribute('hidden', '');
      feedbackBoxEl.classList.remove('is-correct', 'is-wrong');
    }

    // 버튼 상태 초기화
    checkBtn.removeAttribute('hidden');
    checkBtn.disabled = true;
    checkBtn.textContent = '정답 확인';

    if (nextBtn) {
      nextBtn.setAttribute('hidden', '');
      nextBtn.textContent = index === quizData.length - 1 ? '결과 확인하기' : '다음 문제';
    }
  }

  // 선지 선택
  function selectOption(index) {
    selectedOptionIndex = index;
    const optionButtons = optionsGroupEl.querySelectorAll('.quiz-option-btn');

    optionButtons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    checkBtn.disabled = false;
  }

  // 정답 확인
  function checkAnswer() {
    if (selectedOptionIndex === null || hasCheckedAnswer) return;

    hasCheckedAnswer = true;
    const q = quizData[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === q.answer;

    if (isCorrect) {
      score += 1;
    }

    const optionButtons = optionsGroupEl.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedOptionIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // 피드백 메시지 표시
    if (feedbackBoxEl && feedbackBadgeEl && feedbackExplanationEl) {
      feedbackBoxEl.removeAttribute('hidden');
      if (isCorrect) {
        feedbackBoxEl.classList.add('is-correct');
        feedbackBadgeEl.textContent = '🎉 정답입니다!';
      } else {
        feedbackBoxEl.classList.add('is-wrong');
        feedbackBadgeEl.textContent = '아쉽지만 오답입니다.';
      }
      feedbackExplanationEl.textContent = q.explanation;
    }

    // 버튼 전환: "정답 확인" 숨기고 "다음 문제" 표시
    checkBtn.setAttribute('hidden', '');
    if (nextBtn) {
      nextBtn.removeAttribute('hidden');
      nextBtn.focus();
    }
  }

  // 다음 문제 진행
  function goToNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex += 1;
      loadQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  }

  // 결과 화면 표시
  function showResults() {
    if (quizContentEl) quizContentEl.setAttribute('hidden', '');
    if (quizProgressWrapEl) quizProgressWrapEl.setAttribute('hidden', '');

    if (quizResultViewEl) {
      quizResultViewEl.removeAttribute('hidden');

      if (finalScoreEl) finalScoreEl.textContent = String(score);

      let comment = '';
      if (score === 3) {
        comment = '완벽합니다! 생명보험과 손해보험의 핵심 차이를 정확하게 이해하셨습니다.';
      } else if (score === 2) {
        comment = '훌륭합니다! 대부분의 핵심 개념을 잘 파악하고 계십니다.';
      } else {
        comment = '좋은 시작입니다! 본문의 핵심 비교와 상세 비교표를 다시 한번 가볍게 살펴보세요.';
      }

      if (resultCommentEl) resultCommentEl.textContent = comment;
      restartBtn?.focus();
    }
  }

  // 퀴즈 다시 풀기
  function restartQuiz() {
    currentQuestionIndex = 0;
    selectedOptionIndex = null;
    score = 0;
    hasCheckedAnswer = false;

    if (quizResultViewEl) quizResultViewEl.setAttribute('hidden', '');
    if (quizProgressWrapEl) quizProgressWrapEl.removeAttribute('hidden');
    if (quizContentEl) quizContentEl.removeAttribute('hidden');

    loadQuestion(0);
  }

  // 이벤트 등록
  checkBtn.addEventListener('click', checkAnswer);
  nextBtn?.addEventListener('click', goToNextQuestion);
  restartBtn?.addEventListener('click', restartQuiz);

  // 첫 문제 로드
  loadQuestion(0);
}
