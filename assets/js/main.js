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
        
        const iconMap = {
            'mail-outline': './assets/images/email-icon.svg',
            'logo-github': './assets/images/github-icon.svg',
            'logo-linkedin': './assets/images/linkedin-icon.svg',
            'logo-instagram': './assets/images/instagram-icon.svg',
            'logo-facebook': './assets/images/facebook-icon.svg',
            'logo-twitter': './assets/images/twitter-icon.svg'
        };
        
        socialEl.innerHTML = allLinks.map(item => {
            const iconPath = iconMap[item.icon] || `./assets/images/${item.platform || item.type}-icon.svg`;
            return `
                <a href="${item.link}" class="text-white dark:text-white hover:text-primary transition" aria-label="${item.platform || item.type}" target="_blank" rel="noopener noreferrer">
                    <img src="${iconPath}" alt="${item.platform || item.type}" class="w-6 h-6 opacity-80 hover:opacity-100" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                    <span class="material-symbols-outlined text-xl" style="display:none;">${item.icon}</span>
                </a>
            `;
        }).join('');
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
    const maxIndex = Math.max(0, totalClients - clientsPerView);
    
    currentClientIndex += direction;
    
    if (currentClientIndex < 0) {
        currentClientIndex = maxIndex;
    } else if (currentClientIndex > maxIndex) {
        currentClientIndex = 0;
    }
    
    updateClientsPosition();
}

// Update clients position
function updateClientsPosition() {
    const clientsEl = document.getElementById('clients-section');
    if (!clientsEl || !contentData?.about?.clients) return;
    
    // Get the first client item to calculate width
    const firstItem = clientsEl.querySelector('a');
    if (!firstItem) return;
    
    // Calculate item width (no gap)
    const itemWidth = firstItem.offsetWidth;
    const translateX = -(currentClientIndex * itemWidth);
    
    clientsEl.style.transform = `translateX(${translateX}px)`;
}

// Auto-scroll clients (optional)
let clientsAutoScrollInterval = null;

function startClientsAutoScroll() {
    if (clientsAutoScrollInterval) clearInterval(clientsAutoScrollInterval);
    
    clientsAutoScrollInterval = setInterval(() => {
        if (!contentData?.about?.clients) return;
        const totalClients = contentData.about.clients.length;
        const maxIndex = Math.max(0, totalClients - clientsPerView);
        
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
    updateClientsPerView();
    updateClientsPosition();
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
                const clickHandler = item.link ? `window.open('${item.link}', '_blank')` : `openPortfolioItem(${item.id})`;
                return `
                <div class="portfolio-item group cursor-pointer card-hover bg-gray-900 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 dark:border-gray-800 flex flex-col" data-category="${categoryFilter}" onclick="${clickHandler}">
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
    }, 100);
}

// Render Resume Section
function renderResume() {
    if (!contentData?.resume) return;
    
    const resume = contentData.resume;
    
    // Title
    const titleEl = document.getElementById('resume-title');
    if (titleEl) titleEl.textContent = resume.title;
    
    // Experience
    const expEl = document.getElementById('experience-list');
    if (expEl && resume.experience) {
        expEl.innerHTML = resume.experience.map((exp, index) => {
            // Extract company name from position (e.g., "Senior Game Developer at ZPlay" -> "ZPlay")
            const companyMatch = exp.position.match(/at\s+(.+)$/i);
            const company = companyMatch ? companyMatch[1] : exp.position;
            // Combine description items into a single paragraph, removing bullet points
            const description = exp.description ? exp.description
                .filter(item => item && item.trim())
                .map(item => item.replace(/^[•\-\*]\s*/, '').trim())
                .join(' ') : '';
            
            return `
            <div class="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 relative cursor-pointer hover:shadow-lg transition card-hover" onclick="openExperience(${index})">
                <div class="flex justify-between items-start mb-4">
                    <h4 class="text-2xl font-bold text-white dark:text-white">${company}</h4>
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
        eduEl.innerHTML = resume.education.map(edu => `
            <div class="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-base">${edu.degree}</h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">${edu.period}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">${edu.description}</p>
            </div>
        `).join('');
    }
    
    // Skills
    const skillsEl = document.getElementById('skills-list');
    if (skillsEl && resume.skills) {
        skillsEl.innerHTML = resume.skills.map(skill => `
            <div class="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-sm">${skill.name}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">${skill.percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: ${skill.percentage}%"></div>
                </div>
            </div>
        `).join('');
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
        const response = await fetch(blog.markdown);
        const markdown = await response.text();
        
        // Convert markdown to HTML
        const html = convertMarkdownToHTML(markdown);
        if (contentEl) contentEl.innerHTML = html;
    } catch (error) {
        console.error('Error loading markdown:', error);
        if (contentEl) contentEl.innerHTML = '<p class="text-red-500">Error loading blog content.</p>';
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
            gfm: true
        });
        let html = marked.parse(markdown);
        // Add Tailwind classes to the generated HTML
        html = html
            .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">')
            .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">')
            .replace(/<h3>/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">')
            .replace(/<h4>/g, '<h4 class="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">')
            .replace(/<p>/g, '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
            .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">')
            .replace(/<ol>/g, '<ol class="list-decimal ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">')
            .replace(/<li>/g, '<li class="mb-1">')
            .replace(/<code(?! class)/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">')
            .replace(/<pre>/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"><code class="text-sm">')
            .replace(/<\/pre>/g, '</code></pre>')
            .replace(/<a href=/g, '<a class="text-primary hover:underline" href=')
            .replace(/<strong>/g, '<strong class="font-bold text-gray-900 dark:text-white">')
            .replace(/<em>/g, '<em class="italic">')
            .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-gray-600 dark:text-gray-400">')
            .replace(/<img/g, '<img class="rounded-lg my-4 max-w-full"');
        return html;
    } else {
        // Fallback simple implementation
        let html = markdown
            .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">$1</h4>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
            .replace(/^-\s+(.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
            .replace(/\n\n/gim, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
            .replace(/^(?!<[h|u|l|p])(.+)$/gim, '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">$1</p>');
        html = html.replace(/(<li.*?<\/li>\n?)+/gim, '<ul class="list-disc ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">$&</ul>');
        return html;
    }
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Open Portfolio Item (for videos or items without links)
function openPortfolioItem(itemId) {
    const item = portfolioData.find(p => p.id === itemId);
    if (!item) return;
    
    if (item.type === 'video') {
        // Could open in a modal or fullscreen
        window.open(item.video, '_blank');
    }
}

// Page Navigation System
function showPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!contentData?.resume?.experience) return;
    
    const experience = contentData.resume.experience[index];
    if (!experience) return;
    
    // Extract company name from position
    const companyMatch = experience.position.match(/at\s+(.+)$/i);
    const company = companyMatch ? companyMatch[1] : experience.position;
    
    const companyEl = document.getElementById('experience-company');
    const periodEl = document.getElementById('experience-period');
    const descriptionEl = document.getElementById('experience-description');
    
    if (companyEl) companyEl.textContent = company;
    if (periodEl) periodEl.textContent = experience.period;
    
    // Format description with proper HTML
    if (descriptionEl && experience.description) {
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
    }
    
    // Show experience page
    showPage('experience');
    // Scroll to top
    window.scrollTo(0, 0);
}

// Update active navigation button
function updateActiveNav(activeSection) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const section = btn.getAttribute('data-section');
        // If on blog post or experience page, highlight appropriate nav button
        const sectionToCheck = activeSection === 'blog-post' ? 'blog' : 
                               activeSection === 'experience' ? 'resume' : activeSection;
        if (section === sectionToCheck) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('hover:bg-gray-100', 'dark:hover:bg-white/10', 'text-gray-500', 'dark:text-gray-400');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('hover:bg-gray-100', 'dark:hover:bg-white/10', 'text-gray-500', 'dark:text-gray-400');
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
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Get email from contact data
    const emailContact = contentData?.sidebar?.contacts?.find(c => c.type === 'email');
    const email = emailContact ? emailContact.value : 'contact@example.com';
    
    // Create mailto link
    const subject = encodeURIComponent(data.subject ? `${data.subject} - ${data.name}` : `Contact from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message (optional)
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Message Sent!</span><span class="material-symbols-outlined">check_circle</span>';
    button.classList.add('bg-green-500', 'hover:bg-green-600');
    button.classList.remove('bg-primary', 'hover:bg-primary-hover');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-500', 'hover:bg-green-600');
        button.classList.add('bg-primary', 'hover:bg-primary-hover');
        form.reset();
    }, 3000);
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
        observer.observe(el);
    });
    
    // Observe all elements with animate-stagger class
    document.querySelectorAll('.animate-stagger').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
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

// Initialize animations after content loads
function initAnimations() {
    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add stagger animations
    setTimeout(() => {
        addStaggerAnimations();
    }, 100);
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
    
    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        initAnimations();
    }, 500);
});
