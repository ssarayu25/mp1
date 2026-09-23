const nav = document.querySelector('.site-nav');
const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
const scrollLinks = Array.prototype.slice.call(document.querySelectorAll('.scroll-link'));
const sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

const carouselTrack = document.querySelector('.carousel-track');
const slides = Array.prototype.slice.call(document.querySelectorAll('.carousel-slide'));
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');

const modalTriggers = Array.prototype.slice.call(document.querySelectorAll('.open-modal'));
const modals = Array.prototype.slice.call(document.querySelectorAll('.modal'));
const videoMedia = document.querySelector('.video-media');
const actionVideo = document.querySelector('.action-video');

let currentSlide = 0;
let openModal = null;

function getNavHeight() {
	return nav ? nav.offsetHeight : 0;
}

function updateNavSize() {
	if (!nav) {
		return;
	}

	if (window.scrollY > 10) {
		nav.classList.add('scrolled');
	} else {
		nav.classList.remove('scrolled');
	}
}

function setActiveLink(sectionId) {
	navLinks.forEach(function (link) {
		const href = link.getAttribute('href');
		const isMatch = href === '#' + sectionId;
		link.classList.toggle('active', isMatch);
		link.setAttribute('aria-current', isMatch ? 'page' : 'false');
	});
}

function updateActiveSection() {
	if (!sections.length) {
		return;
	}

	const navHeight = getNavHeight();
	const position = window.scrollY + navHeight + 4;
	const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

	let currentId = sections[0].id;

	sections.forEach(function (section) {
		if (position >= section.offsetTop) {
			currentId = section.id;
		}
	});

	if (atBottom) {
		currentId = sections[sections.length - 1].id;
	}

	setActiveLink(currentId);
}

function scrollToSection(event) {
	const href = event.currentTarget.getAttribute('href');
	if (!href || href.charAt(0) !== '#') {
		return;
	}

	const target = document.querySelector(href);
	if (!target) {
		return;
	}

	event.preventDefault();
	const offsetTop = target.offsetTop - getNavHeight() + 1;

	window.scrollTo({
		top: offsetTop,
		behavior: 'smooth',
	});
}

function updateCarousel() {
	if (!carouselTrack || !slides.length) {
		return;
	}

	carouselTrack.style.transform = 'translateX(' + -currentSlide * 100 + '%)';
}

function moveCarousel(step) {
	if (!slides.length) {
		return;
	}

	currentSlide = (currentSlide + step + slides.length) % slides.length;
	updateCarousel();
}

function closeModal(modal) {
	if (!modal) {
		return;
	}

	modal.classList.remove('open');
	modal.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-open');
	openModal = null;
}

function openModalById(id) {
	const modal = document.getElementById(id);
	if (!modal) {
		return;
	}

	modal.classList.add('open');
	modal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-open');
	openModal = modal;
}

navLinks.forEach(function (link) {
	link.addEventListener('click', scrollToSection);
});

scrollLinks.forEach(function (link) {
	link.addEventListener('click', scrollToSection);
});

if (prevButton) {
	prevButton.addEventListener('click', function () {
		moveCarousel(-1);
	});
}

if (nextButton) {
	nextButton.addEventListener('click', function () {
		moveCarousel(1);
	});
}

modalTriggers.forEach(function (trigger) {
	trigger.addEventListener('click', function (event) {
		const targetId = event.currentTarget.getAttribute('data-modal-target');
		openModalById(targetId);
	});
});

modals.forEach(function (modal) {
	const closeButton = modal.querySelector('.modal-close');

	if (closeButton) {
		closeButton.addEventListener('click', function () {
			closeModal(modal);
		});
	}

	modal.addEventListener('click', function (event) {
		if (event.target === modal) {
			closeModal(modal);
		}
	});
});

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && openModal) {
		closeModal(openModal);
	}
});

window.addEventListener('scroll', function () {
	updateNavSize();
	updateActiveSection();
});

window.addEventListener('resize', updateActiveSection);

updateNavSize();
updateActiveSection();
updateCarousel();

if (actionVideo) {
	const loopStart = 0;
	const loopEnd = 8;
	const showFallback = function () {
		if (videoMedia) {
			videoMedia.classList.add('no-video');
		}
	};

	actionVideo.addEventListener('error', showFallback);

	actionVideo.addEventListener('loadedmetadata', function () {
		actionVideo.currentTime = loopStart;
		actionVideo.play().catch(showFallback);
	});

	actionVideo.addEventListener('timeupdate', function () {
		if (actionVideo.currentTime >= loopEnd) {
			actionVideo.currentTime = loopStart;
			actionVideo.play().catch(showFallback);
		}
	});
}
