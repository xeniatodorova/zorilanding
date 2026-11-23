document.documentElement.classList.add('js');

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Menu tabs
const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach(tab =>
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', t === tab));
    panels.forEach(p => {
      p.hidden = p.id !== tab.getAttribute('aria-controls');
    });
  })
);

// Mood picker
const picks = {
  wake:  { drink: 'Double espresso', note: 'Short, strong and ready in one minute. Add a butter croissant.', price: '2.00' },
  slow:  { drink: 'V60 filter, Ethiopia Guji', note: 'Peach and jasmine. Takes five minutes to brew, so sit down.', price: '3.50' },
  sweet: { drink: 'Flat white and a cardamom bun', note: 'Velvety milk with a sticky, spiced bun from the six o\'clock bake.', price: '5.60' }
};
const result = document.getElementById('result');
const moodButtons = document.querySelectorAll('.moods button');

moodButtons.forEach(btn =>
  btn.addEventListener('click', () => {
    const pick = picks[btn.dataset.mood];
    moodButtons.forEach(b => b.classList.toggle('active', b === btn));
    result.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = pick.drink;
    const note = document.createElement('p');
    note.textContent = pick.note + ' ' + pick.price + ' EUR.';
    result.append(title, note);
    result.classList.remove('pop');
    void result.offsetWidth; // restart animation
    result.classList.add('pop');
  })
);

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

// Booking form validation
const form = document.getElementById('booking');
const status = document.getElementById('form-status');

function validate(input) {
  const error = input.parentElement.querySelector('.error');
  let message = '';
  if (input.required && !input.value.trim()) {
    message = 'This field is required.';
  } else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
    message = 'Enter a valid email, like name@example.com.';
  }
  if (error) error.textContent = message;
  input.classList.remove('invalid');
  if (message) {
    void input.offsetWidth;
    input.classList.add('invalid');
  }
  return !message;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = [...form.querySelectorAll('input')].map(validate).every(Boolean);
  status.classList.remove('done');
  if (!valid) {
    status.textContent = '';
    return;
  }
  status.textContent = 'Thanks! We will confirm your table by email.';
  void status.offsetWidth;
  status.classList.add('done');
  form.reset();
});

form.querySelectorAll('input').forEach(input =>
  input.addEventListener('blur', () => validate(input))
);
