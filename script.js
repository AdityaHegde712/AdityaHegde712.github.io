/* =============================================
   Aditya Hegde — Portfolio
   Interactivity & Animations
   ============================================= */

// TODO: Replace with your actual Hugging Face Space URL after deployment
// Example: https://adityahegde712-portfolio-ai.hf.space
const HF_SPACE_URL = "https://adityahegde712-my-ai.hf.space";
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initNavigation();
  initNavScrollEffect();
  initActiveNavTracking();
  initResumeModal();
  initChat();
});

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Mobile Navigation ---------- */
function initNavigation() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add("nav__links--open");
    if (overlay) overlay.classList.add("nav__overlay--visible");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    links.classList.remove("nav__links--open");
    if (overlay) overlay.classList.remove("nav__overlay--visible");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("nav__links--open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  /* Close menu when a nav link is clicked */
  const navAnchors = links.querySelectorAll(".nav__link");
  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Nav Background on Scroll ---------- */
function initNavScrollEffect() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
      nav.style.background = "rgba(7, 7, 13, 0.95)";
    } else {
      nav.style.borderBottomColor = "";
      nav.style.background = "";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true },
  );
}

/* ---------- Active Nav Link Tracking ---------- */
function initActiveNavTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("nav__link--active");
            if (link.getAttribute("href") === "#" + sectionId) {
              link.classList.add("nav__link--active");
            }
          });
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "-72px 0px -50% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Resume Modal ---------- */
function initResumeModal() {
  const btn = document.getElementById('resume-btn');
  const overlay = document.getElementById('resume-modal-overlay');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!btn || !overlay) return;

  function openModal() {
    overlay.classList.add('resume-modal-overlay--open');
  }

  function closeModal() {
    overlay.classList.remove('resume-modal-overlay--open');
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('resume-modal-overlay--open')) {
      closeModal();
    }
  });
}

/* ---------- Chat Widget ---------- */
function initChat() {
  const fab = document.getElementById('chat-fab');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const expandBtn = document.getElementById('chat-expand');
  const expandIcon = document.getElementById('expand-icon');
  const collapseIcon = document.getElementById('collapse-icon');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesEl = document.getElementById('chat-messages');

  if (!fab || !chatWindow) return;

  let isOpen = false;
  let isExpanded = false;

  function toggleExpand() {
    isExpanded = !isExpanded;
    chatWindow.classList.toggle('chat-window--expanded', isExpanded);
    expandIcon.classList.toggle('hidden', isExpanded);
    collapseIcon.classList.toggle('hidden', !isExpanded);
  }

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('chat-window--open', isOpen);
    fab.classList.toggle('chat-fab--open', isOpen);
    if (isOpen) input.focus();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const typing = showTyping();

    try {
      const guardrail = "\n\n(IMPORTANT: Answer in 1-2 concise, conversational paragraphs. Do NOT use markdown points, bolding, or lists. NO ASTERISKS. Respond in plain text only.)";

      const response = await fetch(`${HF_SPACE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text + guardrail })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      typing.remove();
      addMessage(data.response, 'ai');
    } catch (error) {
      console.error('Chat Error:', error);
      typing.remove();
      // Fallback to mock response if backend is offline or URL is wrong
      const fallback = getMockResponse(text);
      addMessage(fallback, 'ai');
    }
  }

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = 'chat-message chat-message--' + type;

    if (type === 'ai') {
      const sender = document.createElement('div');
      sender.className = 'chat-message__sender';
      sender.textContent = "Aditya's AI";
      msg.appendChild(sender);
    }

    const content = document.createTextNode(text);
    msg.appendChild(content);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    for (let i = 0; i < 3; i++) {
      typing.appendChild(document.createElement('span'));
    }
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typing;
  }

  function getMockResponse(userInput) {
    const lower = userInput.toLowerCase();

    if (lower.includes('project') || lower.includes('built') || lower.includes('build')) {
      return "Aditya has built several production-grade systems including a Geospatial ML Inference Pipeline at SUHORA, a Marine Debris Detector, the Seg2Box Annotation Tool, and a Denoising Autoencoder. Check the Projects section for detailed case studies!";
    }
    if (lower.includes('experience') || lower.includes('work') || lower.includes('intern') || lower.includes('job')) {
      return "Aditya worked as a Data Scientist Intern at SUHORA Technologies, where he built a large-scale geospatial ML inference system processing 15B+ pixels. He also served as a Research Assistant at Woxsen University. See the Experience section for details.";
    }
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('language') || lower.includes('tool')) {
      return "Aditya's core stack includes Python, PyTorch, TensorFlow, FastAPI, Docker, and AWS/GCP. He specializes in ML infrastructure, GPU inference systems, and backend engineering. Check the Skills section for the full breakdown.";
    }
    if (lower.includes('education') || lower.includes('school') || lower.includes('university') || lower.includes('degree') || lower.includes('gpa')) {
      return "He's pursuing an MS in Artificial Intelligence at San Jose State University (4.0 GPA), and holds a B.Tech in Computer Science from Woxsen University (3.73 GPA, Dean's List 8 semesters).";
    }
    if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('hire') || lower.includes('connect')) {
      return "You can reach Aditya at aditya.hegde@sjsu.edu, or connect via GitHub (AdityaHegde712) and LinkedIn. He's open to ML Infrastructure, Applied ML, and Backend Engineering opportunities!";
    }
    if (lower.includes('paper') || lower.includes('publication') || lower.includes('research')) {
      return "Aditya has 2 peer-reviewed publications: 'ML-Based Space Risk Management' (IEEE ICEPES 2024) and 'Deep Learning Based Dementia Detection on MRI Data' (Springer ICETSS 2024). See the Publications section for links.";
    }
    if (lower.includes('leader') || lower.includes('club') || lower.includes('officer')) {
      return "Aditya serves as Chief Projects Officer at the SJSU AI & ML Club, managing 17 projects with 70+ contributors. He previously served as AI Projects Lead Officer, establishing workflows and coordinating recruitment.";
    }
    if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey') || lower === 'hi') {
      return "Hey there! \uD83D\uDC4B I'm here to answer questions about Aditya's experience, projects, skills, and more. What would you like to know?";
    }

    return "Great question! I'm running on a lightweight fallback right now. Once connected to a full backend, I'll be able to have deeper conversations. Try asking about Aditya's projects, experience, skills, education, or publications!";
  }

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  if (expandBtn) expandBtn.addEventListener('click', toggleExpand);
  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleChat();
  });
}
