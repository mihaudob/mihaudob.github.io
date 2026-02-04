'use strict';

// theme toggle variables
const themeToggleBtn = document.querySelector("[data-theme-toggle]");

// check for saved theme preference or default to 'light-theme' mode
const currentTheme = localStorage.getItem('theme') || 'light-theme';
document.body.classList.add(currentTheme);

// theme toggle functionality
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    // toggle light-theme class on body
    document.body.classList.toggle("light-theme");

    // save theme preference to localStorage
    if (document.body.classList.contains("light-theme")) {
      localStorage.setItem('theme', 'light-theme');
    } else {
      localStorage.setItem('theme', 'dark-theme');
    }
  });
}

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formResponse = document.querySelector("[data-form-response]");

// check for success message in URL
if (window.location.search.includes('contact=success')) {
  // show success message
  if (formResponse) {
    formResponse.style.display = "block";
    formResponse.style.background = "linear-gradient(135deg, rgba(89, 98, 53, 0.2), rgba(89, 98, 53, 0.1))";
    formResponse.style.border = "1px solid rgba(89, 98, 53, 0.5)";
    formResponse.style.color = "#596235";
    formResponse.innerHTML = "✓ Thank you! Your message has been sent successfully. I'll get back to you soon!";

    // navigate to contact page if not already there
    const navLinks = document.querySelectorAll('[data-nav-link]');
    for (let i = 0; i < navLinks.length; i++) {
      if (navLinks[i].textContent.toLowerCase() === 'contact') {
        navLinks[i].click();
        break;
      }
    }

    // clean URL
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 100);

    // hide message after 8 seconds
    setTimeout(() => {
      formResponse.style.display = "none";
    }, 8000);
  }
}

// add event to all form input field
if (form && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Remove active from all nav links first
    for (let k = 0; k < navigationLinks.length; k++) {
      navigationLinks[k].classList.remove("active");
    }

    // Add active to clicked nav link
    this.classList.add("active");

    // Handle pages
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
      }
    }

  });
}



// Contact reveal functionality (anti-scraping protection)
const contactRevealLinks = document.querySelectorAll('.contact-reveal');

contactRevealLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // Get encoded contact info
    const encodedContact = this.getAttribute('data-contact');
    const contactType = this.getAttribute('data-type');

    // Decode from base64
    const decodedContact = atob(encodedContact);

    // Update the link
    if (contactType === 'email') {
      this.href = 'mailto:' + decodedContact;
      this.innerHTML = decodedContact;
    } else if (contactType === 'phone') {
      this.href = 'tel:' + decodedContact.replace(/\s/g, '');
      this.innerHTML = decodedContact;
    }

    // Remove the click handler and reveal class
    this.classList.remove('contact-reveal');
    this.removeAttribute('data-contact');
    this.removeAttribute('data-type');

    // Trigger the link immediately after reveal
    if (contactType === 'email' || contactType === 'phone') {
      // For email/phone, just keep it revealed without auto-clicking
      // User can click again if they want to use the link
    }
  });
});



// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Observe elements for scroll animation
window.addEventListener('load', () => {
  const animateElements = document.querySelectorAll('.blog-post-item, .skill-category, .timeline-item, .service-item, .company-logo');
  animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Trigger typing effect on desktop (sidebar visible by default)
  setTimeout(() => {
    const bioText = document.querySelector('.bio-text');
    const sidebar = document.querySelector("[data-sidebar]");
    if (bioText && !bioText.classList.contains('typing-complete') && sidebar && sidebar.classList.contains('active')) {
      const text = bioText.textContent;
      bioText.textContent = '';
      bioText.classList.add('typing');

      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          bioText.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          bioText.classList.remove('typing');
          bioText.classList.add('typing-complete');
        }
      }, 30);
    }
  }, 500);
});

// Timeline enhancements
// Calculate duration for timeline items
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate + '-01');
  const end = endDate === 'present' ? new Date() : new Date(endDate + '-01');

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0) {
    return '(< 1 month)';
  }

  let duration = '(';
  if (years > 0) {
    duration += years + (years === 1 ? ' year' : ' years');
  }
  if (months > 0) {
    if (years > 0) duration += ' ';
    duration += months + (months === 1 ? ' month' : ' months');
  }
  duration += ')';

  return duration;
}

// Add duration to timeline items
window.addEventListener('load', () => {
  const timelineItems = document.querySelectorAll('.timeline-item[data-start]');

  timelineItems.forEach(item => {
    const startDate = item.getAttribute('data-start');
    const endDate = item.getAttribute('data-end');
    const durationSpan = item.querySelector('.timeline-duration');

    if (startDate && endDate && durationSpan) {
      durationSpan.textContent = calculateDuration(startDate, endDate);
    }
  });
});

// Timeline toggle functionality
const timelineToggles = document.querySelectorAll('.timeline-toggle');

timelineToggles.forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const timelineItem = this.closest('.timeline-item');
    timelineItem.classList.toggle('collapsed');
  });
});

// Make timeline header clickable
const timelineHeaders = document.querySelectorAll('.timeline-item-header');

timelineHeaders.forEach(header => {
  header.addEventListener('click', function() {
    const timelineItem = this.closest('.timeline-item');
    timelineItem.classList.toggle('collapsed');
  });
});

// Parallax scrolling effects
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.parallax-bg');

  parallaxElements.forEach((element, index) => {
    const speed = 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });

  // Parallax effect for article titles
  const articleTitles = document.querySelectorAll('.article-title');
  articleTitles.forEach(title => {
    const rect = title.getBoundingClientRect();
    const scrollPercent = rect.top / window.innerHeight;

    if (scrollPercent < 1 && scrollPercent > -1) {
      const translateY = (1 - scrollPercent) * 10;
      title.style.transform = `translateY(${translateY}px)`;
    }
  });

  ticking = false;
}

function requestParallaxTick() {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

// Only add parallax on devices that support it well
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}

// Contact Form Enhancements
// Topic selection
const topicButtons = document.querySelectorAll('.topic-btn');
const topicInput = document.querySelector('[data-topic-input]');

topicButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active from all buttons
    topicButtons.forEach(btn => btn.classList.remove('active'));

    // Add active to clicked button
    this.classList.add('active');

    // Set hidden input value
    if (topicInput) {
      topicInput.value = this.getAttribute('data-topic');
    }
  });
});

// Character counter for message field
const messageField = document.querySelector('textarea[name="message"]');
const charCount = document.querySelector('.char-count');
const charCounter = document.querySelector('.char-counter');

if (messageField && charCount) {
  messageField.addEventListener('input', function() {
    const currentLength = this.value.length;
    const maxLength = this.getAttribute('maxlength');

    charCount.textContent = currentLength;

    // Warning color when approaching limit
    if (currentLength > maxLength * 0.9) {
      charCounter.classList.add('warning');
    } else {
      charCounter.classList.remove('warning');
    }
  });
}

// Enhanced form validation with helpful messages
function validateInput(input) {
  const validationMessage = input.parentElement.querySelector('.form-validation-message');

  if (!validationMessage) return true;

  if (input.validity.valid) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    validationMessage.textContent = '';
    return true;
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');

    // Custom validation messages
    if (input.validity.valueMissing) {
      validationMessage.textContent = `Please enter your ${input.name}`;
    } else if (input.validity.typeMismatch && input.type === 'email') {
      validationMessage.textContent = 'Please enter a valid email address';
    } else if (input.validity.tooShort) {
      validationMessage.textContent = `Minimum ${input.minLength} characters required`;
    } else {
      validationMessage.textContent = 'Please check this field';
    }

    return false;
  }
}

function checkFormValidity() {
  let isValid = true;

  formInputs.forEach(input => {
    if (!input.validity.valid) {
      isValid = false;
    }
  });

  if (formBtn) {
    if (isValid) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', '');
    }
  }

  return isValid;
}

// Real-time validation
formInputs.forEach(input => {
  // Validate on blur (when user leaves the field)
  input.addEventListener('blur', function() {
    validateInput(this);
    checkFormValidity();
  });

  // Check form validity on input
  input.addEventListener('input', function() {
    // Remove invalid class while typing
    if (this.classList.contains('invalid')) {
      if (this.validity.valid) {
        validateInput(this);
      }
    }
    checkFormValidity();
  });
});

// Form submission handling
if (form && formBtn) {
  form.addEventListener('submit', function(e) {
    let isValid = true;

    formInputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
    }
  });
}

// Blog Enhancements
// Blog search functionality
const blogSearchInput = document.querySelector('.blog-search-input');
const blogPosts = document.querySelectorAll('.blog-post-item');

if (blogSearchInput) {
  blogSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    blogPosts.forEach(post => {
      const title = post.querySelector('.blog-item-title').textContent.toLowerCase();
      const text = post.querySelector('.blog-text').textContent.toLowerCase();
      const category = post.querySelector('.blog-category').textContent.toLowerCase();

      if (title.includes(searchTerm) || text.includes(searchTerm) || category.includes(searchTerm)) {
        post.classList.remove('hidden');
      } else {
        post.classList.add('hidden');
      }
    });
  });
}

// Blog filter functionality
const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');

blogFilterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const filterValue = this.getAttribute('data-filter');

    // Update active button
    blogFilterBtns.forEach(button => button.classList.remove('active'));
    this.classList.add('active');

    // Clear search when filtering
    if (blogSearchInput) {
      blogSearchInput.value = '';
    }

    // Filter posts
    blogPosts.forEach(post => {
      const category = post.getAttribute('data-category');

      if (filterValue === 'all' || category === filterValue) {
        post.classList.remove('hidden');
      } else {
        post.classList.add('hidden');
      }
    });
  });
});

// About section expand/collapse
const aboutExpandBtn = document.querySelector('[data-expand-about]');
const aboutExpandable = document.querySelector('.about-expandable');

if (aboutExpandBtn && aboutExpandable) {
  aboutExpandBtn.addEventListener('click', function() {
    aboutExpandable.classList.toggle('expanded');

    // Update button text
    const expandText = this.querySelector('.expand-text');
    if (aboutExpandable.classList.contains('expanded')) {
      expandText.textContent = 'Show less';
    } else {
      expandText.textContent = 'Read more about my journey';
    }
  });
}

