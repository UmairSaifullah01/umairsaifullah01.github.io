// Dark mode initialization
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.add('dark')
}

// Global data storage
let contentData = null;
let portfolioData = null;
let blogsData = null;

// Load JSON files
async function loadData() {
    try {
        console.log('Loading JSON data...');
        const [contentRes, portfolioRes, blogsRes] = await Promise.all([
            fetch('./assets/json/content.json'),
            fetch('./assets/json/portfolio.json'),
            fetch('./assets/json/blogs.json')
        ]);

        if (!contentRes.ok) throw new Error(`Content JSON failed: ${contentRes.status}`);
        if (!portfolioRes.ok) throw new Error(`Portfolio JSON failed: ${portfolioRes.status}`);
        if (!blogsRes.ok) throw new Error(`Blogs JSON failed: ${blogsRes.status}`);

        contentData = await contentRes.json();
        portfolioData = await portfolioRes.json();
        blogsData = await blogsRes.json();

        console.log('Data loaded successfully:', { contentData, portfolioData, blogsData });

        // Wait for DOM to be fully ready before rendering
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                renderAllSections();
            });
        } else {
            // DOM is already ready, but use requestAnimationFrame to ensure all elements exist
            requestAnimationFrame(() => {
                renderAllSections();
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Hide loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        // Show error message on page
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: red; color: white; padding: 20px; z-index: 9999;';
        errorDiv.textContent = `Error loading data: ${error.message}. Check console for details.`;
        document.body.appendChild(errorDiv);
    }
}

// Render all sections - separated for better control
function renderAllSections() {
    try {
        // Render all sections
        renderSidebar();
        renderAbout();
        renderClients();
        renderPortfolio();
        renderResume();
        renderBlogs();
        renderTestimonials();
        updateContact();
        renderContactInfo();

        console.log('All sections rendered');

        // Start clients auto-scroll
        startClientsAutoScroll();

        // Use double requestAnimationFrame to ensure DOM is fully updated before showing page
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Small delay to ensure all elements are in DOM
                setTimeout(() => {
                    // Show home page by default
                    showPage('home');

                    // Re-initialize animations after content is loaded
                    setTimeout(() => {
                        initAnimations();
                    }, 300);

                    // Hide loading indicator
                    const loadingIndicator = document.getElementById('loading-indicator');
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                }, 50);
            });
        });
    } catch (error) {
        console.error('Error rendering sections:', error);
        // Hide loading indicator even on error
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        // Retry rendering after a short delay
        setTimeout(() => {
            renderAllSections();
        }, 500);
    }
}

// Render Sidebar
function renderSidebar() {
    if (!contentData?.sidebar) return;

    const sidebar = contentData.sidebar;

    // Avatar
    const avatarImg = document.getElementById('sidebar-avatar');
    if (avatarImg) {
        avatarImg.src = sidebar.avatar;
        avatarImg.alt = `Profile of ${sidebar.name}`;
    }

    // Name and Title
    const nameEl = document.getElementById('sidebar-name');
    if (nameEl) nameEl.textContent = sidebar.name;

    const titleEl = document.getElementById('sidebar-title');
    if (titleEl) titleEl.textContent = sidebar.title;

    // Location (set to Pakistan)
    const locationEl = document.getElementById('sidebar-location');
    if (locationEl) locationEl.textContent = 'Pakistan';

    // Social Links - combine contacts and social
    const socialEl = document.getElementById('sidebar-social');
    if (socialEl) {
        const allLinks = [];

        // Add contact icons (email, github, linkedin)
        if (sidebar.contacts) {
            sidebar.contacts.forEach(contact => {
                if (contact.type === 'email' || contact.type === 'github' || contact.type === 'linkedin') {
                    allLinks.push({
                        link: contact.link,
                        icon: contact.icon,
                        type: contact.type,
                        platform: contact.type
                    });
                }
            });
        }

        // Add social media icons
        if (sidebar.social) {
            sidebar.social.forEach(social => {
                allLinks.push(social);
            });
        }

        // Map platforms to Font Awesome icon classes
        const fontAwesomeMap = {
            'email': 'fas fa-envelope',
            'github': 'fab fa-github',
            'linkedin': 'fab fa-linkedin-in',
            'instagram': 'fab fa-instagram',
            'facebook': 'fab fa-facebook-f',
            'twitter': 'fab fa-twitter',
            'google-plus': 'fab fa-google-plus-g'
        };

        // Get Font Awesome class based on platform/type
        const getFontAwesomeClass = (item) => {
            const platform = (item.platform || item.type || '').toLowerCase();
            return fontAwesomeMap[platform] || fontAwesomeMap['email'];
        };

        socialEl.innerHTML = `
            <ul class="social-icons-list">
                ${allLinks.map(item => {
                    const platform = (item.platform || item.type || 'email').toLowerCase();
                    return `
                        <li>
                            <a href="${item.link}" aria-label="${platform}" target="_blank" rel="noopener noreferrer" data-platform="${platform}">
                                <i class="${getFontAwesomeClass(item)} icon"></i>
                            </a>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }
}

// Render About Section
function renderAbout() {
    if (!contentData?.about) return;

    const about = contentData.about;

    // Title
    const titleEl = document.getElementById('about-title');
    if (titleEl) titleEl.textContent = about.title;

    // Update statistics
    updateStatistics();

    // Services
    const servicesEl = document.getElementById('services-grid');
    if (servicesEl && about.services) {
        // Map service titles to Material Symbols icons
        const iconMap = {
            'Game Development': 'sports_esports',
            'AR/VR Development': 'view_in_ar',
            'Mobile Development': 'phone_android',
            'Technical Leadership': 'groups'
        };

        servicesEl.innerHTML = about.services.map(service => {
            const iconName = iconMap[service.title] || 'code';
            return `
            <div class="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 card-hover">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <span class="material-symbols-outlined text-primary text-3xl">${iconName}</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-lg mb-2">${service.title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${service.description}</p>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
}

// Update Statistics
function updateStatistics() {
    // Set fixed statistics values
    const yearsEl = document.getElementById('stat-years');
    if (yearsEl) yearsEl.textContent = '+8';

    const projectsEl = document.getElementById('stat-projects');
    if (projectsEl) projectsEl.textContent = '+100';

    const clientsEl = document.getElementById('stat-clients');
    if (clientsEl) clientsEl.textContent = '+10';
}

// Render Clients
let currentClientIndex = 0;
let clientsPerView = 4; // Number of logos visible at once

function renderClients() {
    if (!contentData?.about?.clients) return;

    const clientsEl = document.getElementById('clients-section');
    if (clientsEl) {
        clientsEl.innerHTML = contentData.about.clients.map(client => `
            <a href="${client.link}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center flex-shrink-0 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img src="${client.logo}" alt="${client.name}" class="h-20 max-w-[230px] object-contain rounded-xl" />
            </a>
        `).join('');

        // Wait for images to load, then update position
        setTimeout(() => {
            updateClientsPerView();
            updateClientsPosition();
        }, 100);
    }
}

// Update clients per view based on screen size
function updateClientsPerView() {
    if (window.innerWidth >= 1024) {
        clientsPerView = 5;
    } else if (window.innerWidth >= 768) {
        clientsPerView = 4;
    } else if (window.innerWidth >= 640) {
        clientsPerView = 3;
    } else {
        clientsPerView = 2;
    }
}

// Scroll clients slider
function scrollClients(direction) {
    if (!contentData?.about?.clients) return;

    const totalClients = contentData.about.clients.length;
    const maxIndex = getMaxClientIndex();

    currentClientIndex += direction;

    if (currentClientIndex < 0) {
        currentClientIndex = maxIndex;
    } else if (currentClientIndex > maxIndex) {
        currentClientIndex = 0;
    }

    updateClientsPosition();
}

// Get maximum scroll index to ensure last item is visible
function getMaxClientIndex() {
    const clientsEl = document.getElementById('clients-section');
    const containerEl = document.getElementById('clients-container');
    if (!clientsEl || !containerEl || !contentData?.about?.clients) return 0;

    const firstItem = clientsEl.querySelector('a');
    if (!firstItem) return 0;

    const containerWidth = containerEl.offsetWidth;
    const itemWidth = firstItem.offsetWidth;
    const totalWidth = clientsEl.scrollWidth;

    // Calculate how many items can fit in the container
    const itemsThatFit = Math.floor(containerWidth / itemWidth);

    // Calculate max index to ensure last item is fully visible
    const totalClients = contentData.about.clients.length;
    const maxIndex = Math.max(0, totalClients - itemsThatFit);

    return maxIndex;
}

// Update clients position
function updateClientsPosition() {
    const clientsEl = document.getElementById('clients-section');
    const containerEl = document.getElementById('clients-container');
    if (!clientsEl || !containerEl || !contentData?.about?.clients) return;

    // Get the first client item to calculate width
    const firstItem = clientsEl.querySelector('a');
    if (!firstItem) return;

    // Calculate item width
    const itemWidth = firstItem.offsetWidth;
    const containerWidth = containerEl.offsetWidth;
    const totalWidth = clientsEl.scrollWidth;

    // Calculate the maximum translateX to ensure last item is visible
    const maxTranslateX = -(totalWidth - containerWidth);

    // Calculate desired translateX
    let translateX = -(currentClientIndex * itemWidth);

    // Ensure we don't scroll past the last item
    if (Math.abs(translateX) > Math.abs(maxTranslateX)) {
        translateX = maxTranslateX;
    }

    // Ensure we don't scroll before the first item
    if (translateX > 0) {
        translateX = 0;
    }

    clientsEl.style.transform = `translateX(${translateX}px)`;
}

// Auto-scroll clients (optional)
let clientsAutoScrollInterval = null;

function startClientsAutoScroll() {
    if (clientsAutoScrollInterval) clearInterval(clientsAutoScrollInterval);

    clientsAutoScrollInterval = setInterval(() => {
        if (!contentData?.about?.clients) return;
        const maxIndex = getMaxClientIndex();

        if (currentClientIndex >= maxIndex) {
            currentClientIndex = 0;
        } else {
            currentClientIndex++;
        }
        updateClientsPosition();
    }, 3000); // Auto-scroll every 3 seconds
}

function stopClientsAutoScroll() {
    if (clientsAutoScrollInterval) {
        clearInterval(clientsAutoScrollInterval);
        clientsAutoScrollInterval = null;
    }
}

// Update on window resize
window.addEventListener('resize', () => {
    // Recalculate slider position on resize
    if (projectScreenshots.length > 0) {
        updateProjectScreenshotSlider();
    }
    updateClientsPerView();
    // Ensure current index doesn't exceed max after resize
    const maxIndex = getMaxClientIndex();
    if (currentClientIndex > maxIndex) {
        currentClientIndex = maxIndex;
    }
    updateClientsPosition();
    // Update sidebar visibility on resize
    const currentPage = document.querySelector('.page-content:not(.hidden)');
    if (currentPage) {
        const pageId = currentPage.id.replace('page-', '');
        const sidebar = document.getElementById('sidebar-profile');
        if (sidebar) {
            if (window.innerWidth < 1024) { // lg breakpoint
                if (pageId === 'home') {
                    sidebar.classList.remove('hidden');
                } else {
                    sidebar.classList.add('hidden');
                }
            } else {
                sidebar.classList.remove('hidden');
            }
        }
    }
});

// Get category filter value from item
function getCategoryFilter(category, type) {
    if (type === 'video' || category === 'GameVideos') {
        return 'videos';
    }
    if (category === 'Mobile Puzzle') {
        return 'puzzle';
    }
    if (category === 'Mobile Casual') {
        return 'casual';
    }
    return 'all';
}

// Render Portfolio
function renderPortfolio(filter = 'all') {
    if (!portfolioData) return;

    const portfolioEl = document.getElementById('portfolio-grid');
    if (!portfolioEl) return;

    // Filter items based on selected category
    const filteredItems = filter === 'all'
        ? portfolioData
        : portfolioData.filter(item => getCategoryFilter(item.category, item.type) === filter);

    portfolioEl.innerHTML = filteredItems.map((item, index) => {
        const categoryFilter = getCategoryFilter(item.category, item.type);
        if (item.type === 'video') {
            return `
                <div class="portfolio-item group cursor-pointer card-hover bg-gray-900 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 dark:border-gray-800 flex flex-col" data-category="${categoryFilter}" onclick="openPortfolioItem(${item.id})">
                    <div class="bg-[#151515] rounded-t-2xl overflow-hidden relative aspect-[4/3]">
                        <video class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" muted loop>
                            <source src="${item.video}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                            <span class="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition">play_circle</span>
                        </div>
                    </div>
                    <div class="bg-gray-900 dark:bg-gray-900 p-4 flex flex-col justify-center">
                        <h3 class="font-bold text-lg text-white dark:text-white mb-1">${item.title}</h3>
                        <p class="text-sm text-gray-400 dark:text-gray-400">${item.category}</p>
                    </div>
                </div>
            `;
        } else {
            // Always use openPortfolioItem to show detail page
            return `
                <div class="portfolio-item group cursor-pointer card-hover bg-gray-900 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 dark:border-gray-800 flex flex-col" data-category="${categoryFilter}" onclick="openPortfolioItem(${item.id})">
                    <div class="bg-[#151515] rounded-t-2xl overflow-hidden relative aspect-[4/3]">
                        <img alt="${item.alt || item.title}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" src="${item.image}" />
                    </div>
                    <div class="bg-gray-900 dark:bg-gray-900 p-4 flex flex-col justify-center">
                        <h3 class="font-bold text-lg text-white dark:text-white mb-1">${item.title}</h3>
                        <p class="text-sm text-gray-400 dark:text-gray-400">${item.category}</p>
                    </div>
                </div>
            `;
        }
    }).join('');

    // Auto-play videos on hover
    portfolioEl.querySelectorAll('video').forEach(video => {
        const parent = video.closest('.group');
        if (parent) {
            parent.addEventListener('mouseenter', () => video.play());
            parent.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}

// Filter Portfolio by Category
function filterPortfolio(category) {
    // Update active tab
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-filter') === category) {
            tab.classList.add('active', 'bg-primary', 'text-white');
            tab.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
        } else {
            tab.classList.remove('active', 'bg-primary', 'text-white');
            tab.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-200', 'dark:hover:bg-gray-700');
        }
    });

    // Re-render portfolio with filter
    renderPortfolio(category);

    // Re-add stagger animations after filtering
    setTimeout(() => {
        addStaggerAnimations();
        initScrollAnimations();
    }, 100);
}

// Render Resume Section
function renderResume() {
    if (!contentData?.resume) return;

    const resume = contentData.resume;

    // Main Title
    const mainTitleEl = document.getElementById('resume-main-title');
    if (mainTitleEl && resume.mainTitle) {
        mainTitleEl.textContent = resume.mainTitle;
    }

    // Experience
    const expEl = document.getElementById('experience-list');
    if (expEl && resume.experience) {
        expEl.innerHTML = resume.experience.map((exp, index) => {
            // Get company name - prefer explicit company field, otherwise extract from position
            const company = exp.company || (() => {
                const companyMatch = exp.position.match(/at\s+(.+)$/i);
                return companyMatch ? companyMatch[1] : exp.position;
            })();
            // Combine description items into a single paragraph, removing bullet points
            const description = exp.description ? exp.description
                .filter(item => item && item.trim())
                .map(item => item.replace(/^[•\-\*]\s*/, '').trim())
                .join(' ') : '';

            // Logo HTML if available
            const logoHtml = exp.logo ? `<img src="${exp.logo}" alt="${company} Logo" class="w-12 h-12 object-contain rounded-lg mr-4" />` : '';

            return `
            <div class="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 relative cursor-pointer hover:shadow-lg transition card-hover group overflow-hidden" onclick="openExperience(${index})">
                <!-- Progress Line -->
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full"></div>
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center">
                        ${logoHtml}
                        <h4 class="text-2xl font-bold text-white dark:text-white">${company}</h4>
                    </div>
                    <button class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-primary/50 flex-shrink-0">
                        <span class="material-symbols-outlined text-lg transform -rotate-45">arrow_forward</span>
                    </button>
                </div>
                <p class="text-sm text-gray-300 dark:text-gray-300 mb-5 leading-relaxed">${description}</p>
                <div class="text-xs text-gray-400 dark:text-gray-400">${exp.period}</div>
            </div>
        `;
        }).join('');
    }

    // Education
    const eduEl = document.getElementById('education-list');
    if (eduEl && resume.education) {
        eduEl.innerHTML = resume.education.map(edu => {
            const logoHtml = edu.logo ? `<img src="${edu.logo}" alt="Education Logo" class="w-12 h-12 object-contain rounded-lg mr-4" />` : '';
            return `
            <div class="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:shadow-lg transition">
                <!-- Progress Line -->
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full"></div>
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center">
                        ${logoHtml}
                        <h4 class="font-bold text-base">${edu.degree}</h4>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">${edu.period}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">${edu.description}</p>
            </div>
        `;
        }).join('');
    }

    // Skills Title
    const skillsTitleEl = document.getElementById('skills-main-title');
    if (skillsTitleEl && resume.skillsTitle) {
        skillsTitleEl.textContent = resume.skillsTitle;
    }

    // Skills
    const skillsEl = document.getElementById('skills-list');
    if (skillsEl && resume.skills) {
        skillsEl.innerHTML = resume.skills.map(skill => `
            <div class="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-sm">${skill.name}</span>
                    <span class="skill-percentage text-xs text-gray-500 dark:text-gray-400">0%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="skill-bar bg-primary h-2 rounded-full transition-all duration-1000 ease-out" style="width: 0%" data-percentage="${skill.percentage}"></div>
                </div>
            </div>
        `).join('');

        // Initialize scroll animation for skills
        initSkillsAnimation();
    }

    // Tools
    const toolsEl = document.getElementById('tools-grid');
    if (toolsEl && resume.tools) {
        toolsEl.innerHTML = resume.tools.map(tool => `
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="bg-card-light dark:bg-card-dark p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:border-primary transition group">
                <img src="${tool.logo}" alt="${tool.name}" class="w-10 h-10 object-contain flex-shrink-0" />
                <div>
                    <h4 class="font-bold text-sm leading-tight">${tool.name}</h4>
                </div>
            </a>
        `).join('');
    }
}

// Render Blogs
function renderBlogs() {
    if (!blogsData) return;

    const blogsEl = document.getElementById('blog-grid');
    if (!blogsEl) return;

    blogsEl.innerHTML = blogsData.map(blog => `
        <article class="bg-card-light dark:bg-card-dark rounded-2xl p-4 border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition card-hover" onclick="openBlog(${blog.id})">
            <div class="rounded-xl overflow-hidden h-40 mb-4 relative">
                <img alt="${blog.alt || blog.title}" class="w-full h-full object-cover" src="${blog.image}" />
                <div class="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">${formatDate(blog.date)}</div>
                <div class="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">${blog.category}</div>
            </div>
            <h3 class="font-bold text-lg leading-snug mb-1">${blog.title}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">${blog.description}</p>
        </article>
    `).join('');
}

// Render Testimonials
function renderTestimonials() {
    if (!contentData?.about?.testimonials) return;

    const testimonials = contentData.about.testimonials;

    // Update testimonials array
    window.testimonials = testimonials.map(t => ({
        name: t.name,
        text: t.text,
        img: t.avatar,
        role: t.role
    }));

    // Initialize first testimonial
    if (testimonials.length > 0) {
        const first = testimonials[0];
        const nameEl = document.getElementById('testimonial-name');
        const textEl = document.getElementById('testimonial-text');
        const imgEl = document.getElementById('testimonial-img');

        if (nameEl) nameEl.textContent = first.name;
        if (textEl) textEl.textContent = first.text;
        if (imgEl) {
            imgEl.src = first.avatar;
            imgEl.alt = `Client ${first.name}`;
        }
    }
}

// Update Contact Section
function updateContact() {
    if (!contentData?.sidebar?.contacts) return;

    const emailContact = contentData.sidebar.contacts.find(c => c.type === 'email');
    if (emailContact) {
        const btn = document.getElementById('contact-email-btn');
        if (btn) {
            btn.onclick = () => window.location.href = emailContact.link;
        }
    }
}

// Open Blog Post
async function openBlog(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    if (!blog) return;

    const titleEl = document.getElementById('blog-post-title');
    const imageEl = document.getElementById('blog-post-image');
    const dateEl = document.getElementById('blog-post-date');
    const contentEl = document.getElementById('blog-post-content');
    const relatedPostsEl = document.getElementById('blog-post-related-grid');

    if (titleEl) titleEl.textContent = blog.title;
    if (imageEl) {
        imageEl.src = blog.image;
        imageEl.alt = blog.alt || blog.title;
    }
    if (dateEl) dateEl.textContent = formatDate(blog.date);

    // Load markdown content
    try {
        // Add cache-busting parameter to ensure fresh content
        const cacheBuster = `?v=${Date.now()}`;
        const markdownUrl = blog.markdown + cacheBuster;
        console.log('Loading markdown from:', markdownUrl);

        const response = await fetch(markdownUrl, {
            cache: 'no-store', // Prevent caching
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load markdown: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();
        console.log('Markdown loaded, length:', markdown.length);

        // Convert markdown to HTML
        const html = convertMarkdownToHTML(markdown);
        if (contentEl) {
            contentEl.innerHTML = html;
            console.log('Blog content rendered successfully');
        }
    } catch (error) {
        console.error('Error loading markdown:', error);
        console.error('Markdown URL:', blog.markdown);
        if (contentEl) {
            contentEl.innerHTML = `<p class="text-red-500">Error loading blog content: ${error.message}<br/>Please try refreshing the page (Ctrl+Shift+R for hard refresh).</p>`;
        }
    }

    // Render related posts (exclude current blog)
    const relatedPostsSection = document.getElementById('blog-post-related');
    if (relatedPostsEl && blogsData) {
        const relatedBlogs = blogsData.filter(b => b.id !== blogId).slice(0, 2);
        if (relatedBlogs.length > 0) {
            relatedPostsEl.innerHTML = relatedBlogs.map(relatedBlog => `
                <article class="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition card-hover" onclick="openBlog(${relatedBlog.id})">
                    <div class="rounded-t-2xl overflow-hidden h-48 relative">
                        <img alt="${relatedBlog.alt || relatedBlog.title}" class="w-full h-full object-cover" src="${relatedBlog.image}" />
                    </div>
                    <div class="p-4">
                        <div class="text-xs text-gray-400 mb-2">${formatDate(relatedBlog.date)}</div>
                        <h3 class="font-bold text-lg leading-snug text-white">${relatedBlog.title}</h3>
                    </div>
                </article>
            `).join('');
            if (relatedPostsSection) relatedPostsSection.style.display = 'block';
        } else {
            if (relatedPostsSection) relatedPostsSection.style.display = 'none';
        }
    } else {
        if (relatedPostsSection) relatedPostsSection.style.display = 'none';
    }

    // Show blog post page
    showPage('blog-post');
    // Scroll to top
    window.scrollTo(0, 0);
}

// Convert Markdown to HTML using marked.js if available, otherwise simple conversion
function convertMarkdownToHTML(markdown) {
    if (typeof marked !== 'undefined') {
        // Use marked.js for proper markdown parsing
        marked.setOptions({
            breaks: true,
            gfm: true,
            highlight: null // We'll handle syntax highlighting styling manually
        });
        let html = marked.parse(markdown);

        // Process code blocks first (before inline code) - use placeholder approach
        const codeBlockPlaceholders = [];
        let placeholderIndex = 0;

        // Replace code blocks with placeholders
        html = html.replace(/<pre><code(?: class="language-(\w+)")?>(.*?)<\/code><\/pre>/gs, (match, lang, code) => {
            const placeholder = `__CODE_BLOCK_${placeholderIndex}__`;
            const langClass = lang ? `language-${lang}` : '';
            codeBlockPlaceholders[placeholderIndex] = `<pre class="bg-[#1A1A1A] dark:bg-[#0F0F0F] border border-gray-800 dark:border-gray-700 p-4 rounded-lg mb-6 overflow-x-auto"><code class="text-sm font-mono text-gray-200 dark:text-gray-300 ${langClass}">${code}</code></pre>`;
            placeholderIndex++;
            return placeholder;
        });

        // Now handle inline code (all remaining <code> tags)
        html = html.replace(/<code(?: class="[^"]*")?>(.*?)<\/code>/g, '<code class="inline-code">$1</code>');

        // Restore code blocks
        codeBlockPlaceholders.forEach((block, index) => {
            html = html.replace(`__CODE_BLOCK_${index}__`, block);
        });

        // Add Tailwind classes to the generated HTML
        html = html
            // Headings - white text for dark theme
            .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-white">')
            .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-white">')
            .replace(/<h3>/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-white">')
            .replace(/<h4>/g, '<h4 class="text-lg font-bold mt-4 mb-2 text-white">')
            .replace(/<h5>/g, '<h5 class="text-base font-bold mt-4 mb-2 text-white">')
            .replace(/<h6>/g, '<h6 class="text-sm font-bold mt-4 mb-2 text-white">')
            // Paragraphs - gray-300 for readability
            .replace(/<p>/g, '<p class="mb-4 text-gray-300 leading-relaxed">')
            // Lists
            .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-2 text-gray-300">')
            .replace(/<ol>/g, '<ol class="list-decimal ml-6 mb-4 space-y-2 text-gray-300">')
            .replace(/<li>/g, '<li class="mb-2 leading-relaxed">')
            // Links - primary color
            .replace(/<a href=/g, '<a class="text-primary hover:text-primary-hover hover:underline transition-colors" href=')
            // Strong/Bold - white
            .replace(/<strong>/g, '<strong class="font-bold text-white">')
            // Emphasis/Italic
            .replace(/<em>/g, '<em class="italic text-gray-300">')
            // Blockquotes
            .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-gray-400 bg-gray-900/30 dark:bg-gray-800/30 py-2 rounded-r">')
            // Images
            .replace(/<img/g, '<img class="rounded-lg my-6 max-w-full shadow-lg"')
            // Horizontal rules
            .replace(/<hr>/g, '<hr class="my-8 border-gray-700 dark:border-gray-800">')
            // Tables (if any)
            .replace(/<table>/g, '<table class="w-full mb-6 border-collapse">')
            .replace(/<thead>/g, '<thead class="bg-gray-800 dark:bg-gray-900">')
            .replace(/<th>/g, '<th class="px-4 py-2 text-left border border-gray-700 text-white font-bold">')
            .replace(/<td>/g, '<td class="px-4 py-2 border border-gray-700 text-gray-300">')
            .replace(/<tbody>/g, '<tbody>');

        return html;
    } else {
        // Fallback simple implementation with improved styling
        let html = markdown;

        // Handle code blocks first (```code```)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const langClass = lang ? `language-${lang}` : '';
            const escapedCode = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            return `<pre class="bg-[#1A1A1A] dark:bg-[#0F0F0F] border border-gray-800 dark:border-gray-700 p-4 rounded-lg mb-6 overflow-x-auto"><code class="text-sm font-mono text-gray-200 dark:text-gray-300 ${langClass}">${escapedCode}</code></pre>`;
        });

        // Handle headings
        html = html
            .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2 text-white">$1</h4>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-white">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-white">$1</h1>');

        // Handle inline code (backticks) - but not inside code blocks
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Handle bold and italic
        html = html
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-300">$1</em>');

        // Handle lists - numbered
        html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="mb-2 leading-relaxed text-gray-300">$1</li>');
        // Handle lists - bulleted
        html = html.replace(/^[-*]\s+(.*$)/gim, '<li class="mb-2 leading-relaxed text-gray-300">$1</li>');

        // Wrap consecutive list items in ul/ol
        html = html.replace(/(<li class="mb-2 leading-relaxed text-gray-300">.*<\/li>\n?)+/gim, (match) => {
            // Check if it's a numbered list by looking for numbers before
            const isNumbered = /^\d+\./.test(match);
            const listTag = isNumbered ? 'ol' : 'ul';
            return `<${listTag} class="list-${isNumbered ? 'decimal' : 'disc'} ml-6 mb-4 space-y-2 text-gray-300">${match}</${listTag}>`;
        });

        // Handle paragraphs
        html = html.replace(/\n\n/gim, '</p><p class="mb-4 text-gray-300 leading-relaxed">');
        html = html.replace(/^(?!<[h|u|o|l|p|p|b|i|t|d])(.+)$/gim, '<p class="mb-4 text-gray-300 leading-relaxed">$1</p>');

        return html;
    }
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Global variable for project screenshot slider
let currentProjectScreenshotIndex = 0;
let projectScreenshots = [];

// Open Portfolio Item
function openPortfolioItem(itemId) {
    const item = portfolioData.find(p => p.id === itemId);
    if (!item) {
        console.error('Project not found:', itemId);
        return;
    }

    // Handle videos - show detail page instead of opening in new tab
    // Videos will be displayed in the screenshot slider

    console.log('Opening project:', item);

    // Get all elements
    const titleEl = document.getElementById('project-title');
    const logoEl = document.getElementById('project-logo');
    const descriptionEl = document.getElementById('project-description');
    const descriptionSection = document.getElementById('project-description-section');
    const screenshotsSection = document.getElementById('project-screenshots-section');
    const screenshotsSlider = document.getElementById('project-screenshots-slider');
    const screenshotsContainer = document.getElementById('project-screenshots-container');
    const prevBtn = document.getElementById('project-screenshot-prev');
    const nextBtn = document.getElementById('project-screenshot-next');
    const dotsContainer = document.getElementById('project-screenshot-dots');
    const googlePlayLink = document.getElementById('project-google-play');
    const appStoreLink = document.getElementById('project-app-store');
    const customLink = document.getElementById('project-custom-link');
    const linksSection = document.getElementById('project-links-section');

    // Set project title
    if (titleEl) titleEl.textContent = item.title;

    // Set project logo
    if (logoEl) {
        if (item.logo) {
            // Check if logo is a video file, if so use a placeholder or hide it
            const isVideoFile = item.logo.includes('.mp4') || item.logo.includes('.webm') || item.logo.includes('.mov');
            if (isVideoFile && item.image) {
                logoEl.src = item.image;
            } else if (!isVideoFile) {
                logoEl.src = item.logo;
            } else {
                logoEl.classList.add('hidden');
            }
            if (!isVideoFile || item.image) {
                logoEl.classList.remove('hidden');
            }
        } else if (item.image) {
            logoEl.src = item.image;
            logoEl.classList.remove('hidden');
        } else {
            logoEl.classList.add('hidden');
        }
    }

    // Set description
    if (descriptionEl && item.description) {
        descriptionEl.textContent = item.description;
        if (descriptionSection) descriptionSection.classList.remove('hidden');
    } else if (descriptionSection) {
        descriptionSection.classList.add('hidden');
    }

    // Handle screenshots/videos slider - show 3 at a time, move by 1
    projectScreenshots = item.screenshots || [];
    // If it's a video and no screenshots, use the video itself
    if (item.type === 'video' && item.video && projectScreenshots.length === 0) {
        projectScreenshots = [item.video];
    }
    currentProjectScreenshotIndex = 0;
    const screenshotsPerView = 3;

    if (screenshotsSection && projectScreenshots.length > 0) {
        screenshotsSection.classList.remove('hidden');

        // Render screenshots or videos - each takes ~26.67% of container width (20% smaller than 33.33%)
        if (screenshotsSlider) {
            // Original would be 33.33% for 3 items
            const itemWidthPercent = (100 / screenshotsPerView);
            // gap-4 is 1rem (16px), calculate item width accounting for gap
            // Formula: (containerWidth * itemWidthPercent / 100) - gap
            // But we'll use CSS calc for better accuracy
            const itemWidthCalc = `calc(${itemWidthPercent}% - 0.67rem)`;

            // Set slider to auto width (flex will handle it)
            screenshotsSlider.style.width = 'auto';

            // Center if only 1 screenshot
            if (projectScreenshots.length === 1) {
                screenshotsSlider.classList.add('justify-center');
            } else {
                screenshotsSlider.classList.remove('justify-center');
            }

            screenshotsSlider.innerHTML = projectScreenshots.map((media, index) => {
                // Check if it's a video file
                const isVideo = media.includes('.mp4') || media.includes('.webm') || media.includes('.mov') || item.type === 'video';
                if (isVideo) {
                    return `
                        <div class="flex-shrink-0 rounded-lg overflow-hidden" style="width: ${itemWidthCalc}; min-width: 0;">
                            <video class="w-full h-auto object-cover rounded-lg" controls autoplay muted loop>
                                <source src="${media}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `;
                } else {
                    return `
                        <div class="flex-shrink-0 rounded-lg overflow-hidden" style="width: ${itemWidthCalc}; min-width: 0;">
                            <img src="${media}" alt="Screenshot ${index + 1}" class="w-full h-auto object-cover rounded-lg" />
                        </div>
                    `;
                }
            }).join('');
        }

        // Show/hide navigation buttons - only show if more than 3 screenshots
        if (prevBtn) {
            if (projectScreenshots.length > screenshotsPerView) {
                prevBtn.classList.remove('hidden');
            } else {
                prevBtn.classList.add('hidden');
            }
        }
        if (nextBtn) {
            if (projectScreenshots.length > screenshotsPerView) {
                nextBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.add('hidden');
            }
        }

        // Render dots - one per screenshot (since we move by 1)
        if (dotsContainer) {
            const maxIndex = Math.max(0, projectScreenshots.length - screenshotsPerView);

            if (projectScreenshots.length > screenshotsPerView) {
                // Only create dots for valid starting positions (0 to maxIndex)
                const numDots = maxIndex + 1;
                const dotsArray = Array.from({ length: numDots }, (_, i) => i);

                dotsContainer.innerHTML = dotsArray.map((index) => `
                    <button onclick="goToProjectScreenshot(${index})" class="w-2 h-2 rounded-full transition ${index === 0 ? 'bg-primary' : 'bg-gray-600'}" data-index="${index}"></button>
                `).join('');
            } else {
                dotsContainer.innerHTML = '';
            }
        }

        // Update slider position - use setTimeout to ensure DOM is ready
        setTimeout(() => {
            updateProjectScreenshotSlider();
        }, 100);
    } else if (screenshotsSection) {
        screenshotsSection.classList.add('hidden');
    }

    // Handle links - only show if they exist
    let hasAnyLink = false;

    if (googlePlayLink && item.googlePlayLink) {
        googlePlayLink.href = item.googlePlayLink;
        googlePlayLink.classList.remove('hidden');
        hasAnyLink = true;
    } else if (googlePlayLink) {
        googlePlayLink.classList.add('hidden');
    }

    if (appStoreLink && item.appStoreLink) {
        appStoreLink.href = item.appStoreLink;
        appStoreLink.classList.remove('hidden');
        hasAnyLink = true;
    } else if (appStoreLink) {
        appStoreLink.classList.add('hidden');
    }

    if (customLink && item.customLink) {
        customLink.href = item.customLink;
        customLink.classList.remove('hidden');
        hasAnyLink = true;
    } else if (customLink) {
        customLink.classList.add('hidden');
    }

    // Show/hide links section
    if (linksSection) {
        if (hasAnyLink) {
            linksSection.classList.remove('hidden');
        } else {
            linksSection.classList.add('hidden');
        }
    }

    // Show project page
    showPage('project');
    // Scroll to top
    window.scrollTo(0, 0);
}

// Change project screenshot - moves by 1 screenshot at a time
function changeProjectScreenshot(direction) {
    if (projectScreenshots.length === 0) return;

    const screenshotsPerView = 3;

    // Move by 1 screenshot
    currentProjectScreenshotIndex += direction;

    // Clamp to valid range
    const maxIndex = Math.max(0, projectScreenshots.length - screenshotsPerView);
    if (currentProjectScreenshotIndex < 0) {
        currentProjectScreenshotIndex = 0;
    } else if (currentProjectScreenshotIndex > maxIndex) {
        currentProjectScreenshotIndex = maxIndex;
    }

    updateProjectScreenshotSlider();
}

// Go to specific screenshot
function goToProjectScreenshot(index) {
    const screenshotsPerView = 3;
    const maxIndex = Math.max(0, projectScreenshots.length - screenshotsPerView);

    if (index >= 0 && index <= maxIndex) {
        currentProjectScreenshotIndex = index;
        updateProjectScreenshotSlider();
    }
}

// Update project screenshot slider position
function updateProjectScreenshotSlider() {
    const slider = document.getElementById('project-screenshots-slider');
    const container = document.getElementById('project-screenshots-container');
    const dots = document.querySelectorAll('#project-screenshot-dots button');

    if (slider && container && projectScreenshots.length > 0) {
        const screenshotsPerView = 3;

        // Get container width in pixels
        const containerWidth = container.offsetWidth;
        if (containerWidth === 0) {
            // Container not yet rendered, retry after a short delay
            setTimeout(updateProjectScreenshotSlider, 50);
            return;
        }

        // Get the first item to measure actual width
        const firstItem = slider.querySelector('div');
        if (!firstItem) {
            setTimeout(updateProjectScreenshotSlider, 50);
            return;
        }

        // Get actual item width including margin/padding
        const itemWidthPx = firstItem.offsetWidth;
        // Get computed gap (from gap-4 = 1rem = 16px typically)
        const gapPx = 16; // gap-4 is 1rem
        // Total width per item including gap
        const itemWithGapPx = itemWidthPx + gapPx;

        // Calculate translateX in pixels - move by 1 screenshot at a time
        const translateXPx = -(currentProjectScreenshotIndex * itemWithGapPx);
        slider.style.transform = `translateX(${translateXPx}px)`;
    }

    // Update dots - highlight the current starting screenshot
    if (dots && projectScreenshots.length > 3) {
        dots.forEach((dot, index) => {
            if (index === currentProjectScreenshotIndex) {
                dot.classList.remove('bg-gray-600');
                dot.classList.add('bg-primary');
            } else {
                dot.classList.remove('bg-primary');
                dot.classList.add('bg-gray-600');
            }
        });
    }
}

// Page Navigation System
function showPage(pageId) {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            showPageInternal(pageId);
        });
        return;
    }

    showPageInternal(pageId);
}

function showPageInternal(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        
        // Ensure portfolio is rendered when showing projects page
        if (pageId === 'projects') {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                const portfolioGrid = document.getElementById('portfolio-grid');
                if (portfolioGrid) {
                    // Check if portfolio is empty or if portfolioData exists but grid is empty
                    const isEmpty = !portfolioGrid.innerHTML || portfolioGrid.innerHTML.trim() === '';
                    if (isEmpty && portfolioData) {
                        // Portfolio grid is empty, render it
                        renderPortfolio('all');
                        // Re-add stagger animations after rendering
                        setTimeout(() => {
                            addStaggerAnimations();
                            initScrollAnimations();
                        }, 100);
                    }
                }
            });
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.warn(`Page element not found: page-${pageId}, retrying...`);
        // Retry after a short delay if element not found
        setTimeout(() => {
            showPageInternal(pageId);
        }, 100);
    }

    // Handle sidebar visibility on mobile
    const sidebar = document.getElementById('sidebar-profile');
    if (sidebar) {
        // On mobile: show only on home page, on desktop: always show
        if (window.innerWidth < 1024) { // lg breakpoint
            if (pageId === 'home') {
                sidebar.classList.remove('hidden');
            } else {
                sidebar.classList.add('hidden');
            }
        } else {
            // Desktop: always show (lg:block handles this via CSS)
            sidebar.classList.remove('hidden');
        }
    }

    // Restart typing animation if showing home page
    if (pageId === 'home') {
        typingAnimationActive = false;
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTimeout(() => {
            initTypingAnimation();
        }, 300);
    }

    // Update active navigation
    updateActiveNav(pageId);
}

// Smooth scroll to section (kept for backward compatibility)
function scrollToSection(sectionId) {
    showPage(sectionId);
}

// Open Experience Detail
function openExperience(index) {
    if (!contentData?.resume?.experience) {
        console.error('No experience data available');
        return;
    }

    const experience = contentData.resume.experience[index];
    if (!experience) {
        console.error('Experience not found at index:', index);
        return;
    }

    console.log('Opening experience:', experience);

    // Get company name - prefer explicit company field, otherwise extract from position
    const company = experience.company || (() => {
        const companyMatch = experience.position.match(/at\s+(.+)$/i);
        return companyMatch ? companyMatch[1] : experience.position;
    })();

    // Get all elements
    const companyEl = document.getElementById('experience-company');
    const periodEl = document.getElementById('experience-period');
    const logoEl = document.getElementById('experience-logo');
    const overviewEl = document.getElementById('experience-overview');
    const roleEl = document.getElementById('experience-role');
    const skillsEl = document.getElementById('experience-skills');
    const impactEl = document.getElementById('experience-impact');
    const linkEl = document.getElementById('experience-link');
    const descriptionEl = document.getElementById('experience-description');

    // Section containers
    const overviewSection = document.getElementById('experience-overview-section');
    const roleSection = document.getElementById('experience-role-section');
    const skillsSection = document.getElementById('experience-skills-section');
    const impactSection = document.getElementById('experience-impact-section');
    const linkSection = document.getElementById('experience-link-section');

    // Set company name and period
    if (companyEl) companyEl.textContent = company;
    if (periodEl) periodEl.textContent = experience.period;

    // Set company logo
    if (logoEl && experience.logo) {
        logoEl.src = experience.logo;
        logoEl.classList.remove('hidden');
        console.log('Logo set:', experience.logo);
    } else if (logoEl) {
        logoEl.classList.add('hidden');
    }

    // Set overview
    if (overviewEl && experience.overview) {
        overviewEl.textContent = experience.overview;
        if (overviewSection) {
            overviewSection.classList.remove('hidden');
            console.log('Overview section displayed');
        }
    } else if (overviewSection) {
        overviewSection.classList.add('hidden');
    }

    // Set my role
    if (roleEl && experience.myRole) {
        roleEl.textContent = experience.myRole;
        if (roleSection) {
            roleSection.classList.remove('hidden');
            console.log('Role section displayed');
        }
    } else if (roleSection) {
        roleSection.classList.add('hidden');
    }

    // Set skills acquired
    if (skillsEl && experience.skillsAcquired) {
        skillsEl.textContent = experience.skillsAcquired;
        if (skillsSection) {
            skillsSection.classList.remove('hidden');
            console.log('Skills section displayed');
        }
    } else if (skillsSection) {
        skillsSection.classList.add('hidden');
    }

    // Set impact
    if (impactEl && experience.impact) {
        impactEl.textContent = experience.impact;
        if (impactSection) {
            impactSection.classList.remove('hidden');
            console.log('Impact section displayed');
        }
    } else if (impactSection) {
        impactSection.classList.add('hidden');
    }

    // Set company link
    if (linkEl && experience.link) {
        linkEl.href = experience.link;
        if (linkSection) {
            linkSection.classList.remove('hidden');
            console.log('Link section displayed');
        }
    } else if (linkSection) {
        linkSection.classList.add('hidden');
    }

    // Fallback: Use description if new format fields are not available
    if (!experience.overview && descriptionEl && experience.description) {
        const formattedDescription = experience.description
            .filter(item => item && item.trim())
            .map(item => {
                // Check if it's a heading (no bullet, ends with colon)
                if (item.match(/^[A-Z][^•\-\*]*:$/)) {
                    return `<h3 class="text-xl font-bold mt-6 mb-3 text-white">${item.replace(':', '')}</h3>`;
                }
                // Regular bullet point
                const cleanText = item.replace(/^[•\-\*]\s*/, '').trim();
                return `<p class="mb-4 text-gray-300 leading-relaxed">${cleanText}</p>`;
            })
            .join('');
        descriptionEl.innerHTML = formattedDescription;
        descriptionEl.classList.remove('hidden');
    } else if (descriptionEl) {
        descriptionEl.classList.add('hidden');
    }

    // Show experience page
    showPage('experience');
    // Scroll to top
    window.scrollTo(0, 0);

    console.log('Experience page displayed');
}

// Update active navigation button
function updateActiveNav(activeSection) {
    const navItems = document.querySelectorAll('.nav-icon-item');
    navItems.forEach(item => {
        const section = item.getAttribute('data-section');
        // If on blog post or experience page, highlight appropriate nav button
        const sectionToCheck = activeSection === 'blog-post' ? 'blog' :
            activeSection === 'experience' ? 'resume' : activeSection;
        if (section === sectionToCheck) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update contact info rendering
function renderContactInfo() {
    if (!contentData?.sidebar?.contacts) return;

    const contactInfoEl = document.getElementById('contact-info');
    if (contactInfoEl) {
        const iconMap = {
            'mail-outline': './assets/images/email-icon.svg',
            'logo-github': './assets/images/github-icon.svg',
            'logo-linkedin': './assets/images/linkedin-icon.svg'
        };

        contactInfoEl.innerHTML = contentData.sidebar.contacts.map(contact => {
            const iconPath = iconMap[contact.icon] || `./assets/images/${contact.type}-icon.svg`;
            return `
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <img src="${iconPath}" alt="${contact.title}" class="w-5 h-5" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                    <span class="material-symbols-outlined text-primary" style="display:none;">${contact.icon}</span>
                    <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${contact.title}</p>
                        <a href="${contact.link}" class="text-sm font-medium hover:text-primary transition" target="_blank" rel="noopener noreferrer">${contact.value}</a>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Testimonials carousel
let currentTestimonial = 0;

function changeTestimonial(direction) {
    if (!window.testimonials || window.testimonials.length === 0) return;

    currentTestimonial += direction;
    if (currentTestimonial < 0) {
        currentTestimonial = window.testimonials.length - 1;
    } else if (currentTestimonial >= window.testimonials.length) {
        currentTestimonial = 0;
    }

    const testimonial = window.testimonials[currentTestimonial];
    const nameEl = document.getElementById('testimonial-name');
    const textEl = document.getElementById('testimonial-text');
    const imgEl = document.getElementById('testimonial-img');

    if (nameEl) nameEl.textContent = testimonial.name;
    if (textEl) textEl.textContent = testimonial.text;
    if (imgEl) {
        imgEl.src = testimonial.img;
        imgEl.alt = `Client ${testimonial.name}`;
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('blog-modal');
    if (modal && e.target === modal) {
        closeBlogModal();
    }
});

// Contact Form Handler
// Contact Form Handler
async function handleContactForm(event) {
    event.preventDefault();

    const form = event.target;
    // Explicitly select the submit button to ensure we get the right element
    const submitBtn = form.querySelector('button[type="submit"]');

    // Save original button state
    const originalContent = submitBtn.innerHTML;
    const originalText = submitBtn.textContent;

    // Create FormData
    const formData = new FormData(form);
    // Access key is already in the HTML, but we can append it here if needed, 
    // or rely on the hidden input. The user's snippet appends it manually, 
    // so we'll ensure it's there.
    if (!formData.has('access_key')) {
        formData.append("access_key", "c086f078-f1c0-4d10-8531-0d26c4539f1d");
    }

    // Update UI to sending state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            // Success state
            submitBtn.innerHTML = '<span>Message Sent!</span><span class="material-symbols-outlined">check_circle</span>';
            submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            submitBtn.classList.remove('bg-primary', 'hover:bg-primary-hover');

            // Reset form
            form.reset();

            // Reset button after 5 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                submitBtn.classList.add('bg-primary', 'hover:bg-primary-hover');
                submitBtn.disabled = false;
            }, 5000);
        } else {
            console.error('Web3Forms Error:', data);
            alert("Error: " + data.message);
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }

    } catch (error) {
        console.error('Submission Error:', error);
        alert("Something went wrong. Please try again.");
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }
}



// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.classList.contains('animated')) {
            observer.observe(el);
        }
    });

    // Observe all elements with animate-stagger class
    document.querySelectorAll('.animate-stagger').forEach((el) => {
        if (!el.classList.contains('animated')) {
            observer.observe(el);
        }
    });
}

// Add stagger delays to grid items
function addStaggerAnimations() {
    // Portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Blog items
    const blogItems = document.querySelectorAll('#blog-grid article');
    blogItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Service cards
    const serviceCards = document.querySelectorAll('#services-grid > div');
    serviceCards.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
        item.classList.add('animate-stagger');
    });

    // Tools grid items
    const toolItems = document.querySelectorAll('#tools-grid a');
    toolItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });

    // Experience items
    const expItems = document.querySelectorAll('#experience-list > div');
    expItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Education items
    const eduItems = document.querySelectorAll('#education-list > div');
    eduItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Skills items
    const skillItems = document.querySelectorAll('#skills-list > div');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize skills progress bar animation on scroll
function initSkillsAnimation() {
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;

    const skillBars = skillsList.querySelectorAll('.skill-bar');
    const skillPercentages = skillsList.querySelectorAll('.skill-percentage');

    if (skillBars.length === 0) return;

    // Check if already animated
    if (skillsList.classList.contains('skills-animated')) return;

    // Function to animate skills
    const animateSkills = () => {
        skillsList.classList.add('skills-animated');

        skillBars.forEach((bar, index) => {
            const percentage = parseInt(bar.getAttribute('data-percentage'));
            const percentageEl = skillPercentages[index];

            // Animate the bar
            setTimeout(() => {
                bar.style.width = `${percentage}%`;

                // Animate the percentage text
                let current = 0;
                const increment = percentage / 50; // 50 steps for smooth animation
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= percentage) {
                        current = percentage;
                        clearInterval(interval);
                    }
                    if (percentageEl) {
                        percentageEl.textContent = `${Math.round(current)}%`;
                    }
                }, 20); // Update every 20ms
            }, index * 100); // Stagger animation by 100ms per bar
        });
    };

    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Check if element is already visible
    const rect = skillsList.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        // Small delay to ensure DOM is ready
        setTimeout(animateSkills, 100);
    } else {
        // Observe the skills list container
        observer.observe(skillsList);
    }
}

// Initialize animations after content loads
// Initialize animations after content loads
function initAnimations() {
    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });

    // Add stagger animations first so elements have the class
    addStaggerAnimations();

    // THEN initialize scroll animations to observe all elements including staggered ones
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}


// Typing Animation for Hero Text
let typingTimeout = null;
let typingAnimationActive = false;

function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    // Clear any existing animation
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }

    // Reset to first word
    typingElement.textContent = 'Reality';

    const words = ['Reality', 'Success', 'Excellence', 'Innovation', 'Perfection', 'Greatness', 'Mastery'];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    typingAnimationActive = true;

    function type() {
        if (!typingAnimationActive) return;

        const currentWord = words[currentWordIndex];
        let typingSpeed = 100; // milliseconds per character

        if (isDeleting) {
            // Delete characters
            typingElement.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Type characters
            typingElement.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // Normal speed when typing
        }

        // When word is complete
        if (!isDeleting && currentCharIndex === currentWord.length) {
            // Wait before starting to delete
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        }
        // When word is deleted
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length; // Move to next word
            typingSpeed = 500; // Pause before typing next word
        }

        typingTimeout = setTimeout(type, typingSpeed);
    }

    // Start typing animation after a short delay
    typingTimeout = setTimeout(type, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // showPage will be called after data loads

    // Add form submit handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Initialize typing animation
    initTypingAnimation();

    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        initAnimations();
    }, 500);
});
