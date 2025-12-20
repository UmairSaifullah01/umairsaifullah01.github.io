// Content Loader - Loads content from JSON file
(function () {
    'use strict';

    // Fetch and load content
    async function loadContent() {
        try {
            const response = await fetch('./assets/json/content.json');
            const data = await response.json();

            // Load all sections
            loadSidebar(data.sidebar);
            loadAbout(data.about);
            loadResume(data.resume);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Load Sidebar Content
    function loadSidebar(sidebar) {
        // Update name and title
        const nameElement = document.querySelector('.sidebar-info .name');
        const titleElement = document.querySelector('.sidebar-info .title');
        const avatarElement = document.querySelector('.sidebar-info .avatar-box img');

        if (nameElement) nameElement.textContent = sidebar.name;
        if (titleElement) titleElement.textContent = sidebar.title;
        if (avatarElement) {
            avatarElement.src = sidebar.avatar;
            avatarElement.alt = sidebar.name;
        }

        // Update contacts
        const contactsList = document.querySelector('.contacts-list');
        if (contactsList && sidebar.contacts) {
            contactsList.innerHTML = '';
            sidebar.contacts.forEach(contact => {
                const li = document.createElement('li');
                li.className = 'contact-item';
                li.innerHTML = `
          <div class="icon-box">
            <ion-icon name="${contact.icon}"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">${contact.title}</p>
            <a href="${contact.link}" class="contact-link">${contact.value}</a>
          </div>
        `;
                contactsList.appendChild(li);
            });
        }

        // Update social links
        const socialList = document.querySelector('.social-list');
        if (socialList && sidebar.social) {
            socialList.innerHTML = '';
            sidebar.social.forEach(social => {
                const li = document.createElement('li');
                li.className = 'social-item';
                li.innerHTML = `
          <a href="${social.link}" class="social-link">
            <ion-icon name="${social.icon}"></ion-icon>
          </a>
        `;
                socialList.appendChild(li);
            });
        }
    }

    // Load About Content
    function loadAbout(about) {
        // Update about title
        const aboutTitle = document.querySelector('.about .article-title');
        if (aboutTitle) aboutTitle.textContent = about.title;

        // Update about text
        const aboutText = document.querySelector('.about-text');
        if (aboutText && about.description) {
            aboutText.innerHTML = '';
            about.description.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                aboutText.appendChild(p);
            });
        }

        // Update services
        const serviceList = document.querySelector('.service-list');
        if (serviceList && about.services) {
            serviceList.innerHTML = '';
            about.services.forEach(service => {
                const li = document.createElement('li');
                li.className = 'service-item';
                li.innerHTML = `
          <div class="service-icon-box">
            <img src="${service.icon}" alt="${service.title} icon" width="40" />
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${service.title}</h4>
            <p class="service-item-text">${service.description}</p>
          </div>
        `;
                serviceList.appendChild(li);
            });
        }

        // Update testimonials
        const testimonialsList = document.querySelector('.testimonials-list');
        if (testimonialsList && about.testimonials) {
            testimonialsList.innerHTML = '';
            about.testimonials.forEach(testimonial => {
                const li = document.createElement('li');
                li.className = 'testimonials-item';
                li.innerHTML = `
          <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
              <img src="${testimonial.avatar}" alt="${testimonial.name}" width="60" data-testimonials-avatar />
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>${testimonial.name}</h4>
            <div class="testimonials-text" data-testimonials-text>
              <p>${testimonial.text}</p>
              <p class="testimonial-role">${testimonial.role}</p>
            </div>
          </div>
        `;
                testimonialsList.appendChild(li);
            });

            // Reinitialize testimonial modal functionality
            initTestimonialModal(about.testimonials);
        }

        // Update clients
        const clientsList = document.querySelector('.clients-list');
        if (clientsList && about.clients) {
            clientsList.innerHTML = '';
            about.clients.forEach(client => {
                const li = document.createElement('li');
                li.className = 'clients-item';
                li.innerHTML = `
          <a href="${client.link}" target="_blank">
            <img src="${client.logo}" alt="${client.name} logo" />
          </a>
        `;
                clientsList.appendChild(li);
            });
        }
    }

    // Load Resume Content
    function loadResume(resume) {
        // Update resume title
        const resumeTitle = document.querySelector('.resume .article-title');
        if (resumeTitle) resumeTitle.textContent = resume.title;

        // Update experience
        const experienceList = document.querySelector('.timeline-list');
        if (experienceList && resume.experience) {
            experienceList.innerHTML = '';
            resume.experience.forEach(exp => {
                const li = document.createElement('li');
                li.className = 'timeline-item';

                // Convert description array to HTML with line breaks
                const descriptionHTML = exp.description.map(line =>
                    line ? line + '<br />' : '<br />'
                ).join('');

                li.innerHTML = `
          <h4 class="h4 timeline-item-title">${exp.position}</h4>
          <span>${exp.period}</span>
          <p class="timeline-text">${descriptionHTML}</p>
        `;
                experienceList.appendChild(li);
            });
        }

        // Update education
        const educationSection = document.querySelectorAll('.timeline')[1];
        if (educationSection && resume.education) {
            const educationList = educationSection.querySelector('.timeline-list');
            if (educationList) {
                educationList.innerHTML = '';
                resume.education.forEach(edu => {
                    const li = document.createElement('li');
                    li.className = 'timeline-item';
                    li.innerHTML = `
            <h4 class="h4 timeline-item-title">${edu.degree}</h4>
            <span>${edu.period}</span>
            <p class="timeline-text">${edu.description}</p>
          `;
                    educationList.appendChild(li);
                });
            }
        }

        // Update tools
        const toolsList = document.querySelector('.tools-list');
        if (toolsList && resume.tools) {
            toolsList.innerHTML = '';
            resume.tools.forEach(tool => {
                const li = document.createElement('li');
                li.className = 'tools-item';
                li.innerHTML = `
          <a href="${tool.link}" target="_blank">
            <img src="${tool.logo}" alt="${tool.name}" />
          </a>
        `;
                toolsList.appendChild(li);
            });
        }

        // Update skills
        const skillsList = document.querySelector('.skills-list');
        if (skillsList && resume.skills) {
            skillsList.innerHTML = '';
            resume.skills.forEach(skill => {
                const li = document.createElement('li');
                li.className = 'skills-item';
                li.innerHTML = `
          <div class="title-wrapper">
            <h5 class="h5">${skill.name}</h5>
            <data value="${skill.percentage}">${skill.percentage}%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: ${skill.percentage}%"></div>
          </div>
        `;
                skillsList.appendChild(li);
            });
        }
    }

    // Initialize testimonial modal functionality
    function initTestimonialModal(testimonials) {
        const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
        const modalContainer = document.querySelector('[data-modal-container]');
        const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
        const overlay = document.querySelector('[data-overlay]');

        if (!modalContainer) return;

        const modalImg = document.querySelector('[data-modal-img]');
        const modalTitle = document.querySelector('[data-modal-title]');
        const modalText = document.querySelector('[data-modal-text]');

        const toggleModal = function () {
            modalContainer.classList.toggle('active');
        };

        testimonialsItems.forEach((item, index) => {
            item.addEventListener('click', function () {
                const testimonial = testimonials[index];
                if (modalImg) modalImg.src = testimonial.avatar;
                if (modalImg) modalImg.alt = testimonial.name;
                if (modalTitle) modalTitle.textContent = testimonial.name;
                if (modalText) {
                    modalText.innerHTML = `
            <p>${testimonial.text}</p>
            <p class="testimonial-role">${testimonial.role}</p>
          `;
                }
                toggleModal();
            });
        });

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleModal);
        if (overlay) overlay.addEventListener('click', toggleModal);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
