document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide icons
    lucide.createIcons();

    // 1. Theme Management (Light / Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            updateChartTheme(true);
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            updateChartTheme(false);
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });

    // 3. Typing Effect in Hero Section
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Aspiring Data Analyst",
        "AI & Computer Science Student",
        "Power BI & SQL Developer",
        "Cloud & ML Enthusiast"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000; // Delay between word rotations
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start the typing animation
    if (textArray.length) setTimeout(type, 1000);


    // 4. Chart.js - Domain Expertise Doughnut Chart
    const ctx = document.getElementById('interestsChart').getContext('2d');
    let interestsChart;

    const chartData = {
        labels: ['Data Analysis', 'Power BI / Visualization', 'Machine Learning', 'Cloud (Azure)'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
                '#2563EB', // Blue (Data Analysis)
                '#0EA5E9', // Sky (Power BI)
                '#10B981', // Green (Machine Learning)
                '#8B5CF6'  // Purple (Cloud)
            ],
            borderWidth: 2,
            borderColor: '#FFFFFF' // Will be updated on load/theme changes
        }]
    };

    function initChart(isDark) {
        const borderColor = isDark ? '#111827' : '#FFFFFF';
        const labelColor = isDark ? '#D1D5DB' : '#334155';

        interestsChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Using custom CSS legend for visual excellence
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        },
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        titleColor: isDark ? '#F9FAFB' : '#0F172A',
                        bodyColor: isDark ? '#D1D5DB' : '#334155',
                        borderColor: isDark ? '#374151' : '#E2E8F0',
                        borderWidth: 1
                    }
                },
                cutout: '65%'
            }
        });
        
        interestsChart.data.datasets[0].borderColor = borderColor;
        interestsChart.update();
    }

    function updateChartTheme(isDark) {
        if (!interestsChart) return;
        const borderColor = isDark ? '#111827' : '#FFFFFF';
        
        interestsChart.data.datasets[0].borderColor = borderColor;
        
        // Update tooltip config
        interestsChart.options.plugins.tooltip.backgroundColor = isDark ? '#1F2937' : '#FFFFFF';
        interestsChart.options.plugins.tooltip.titleColor = isDark ? '#F9FAFB' : '#0F172A';
        interestsChart.options.plugins.tooltip.bodyColor = isDark ? '#D1D5DB' : '#334155';
        interestsChart.options.plugins.tooltip.borderColor = isDark ? '#374151' : '#E2E8F0';
        
        interestsChart.update();
    }

    // Initialize Chart based on active theme
    initChart(body.classList.contains('dark-mode'));


    // 5. KPI Counter Animations
    const kpiElements = [
        { id: 'kpi-projects', target: 7 },
        { id: 'kpi-certifications', target: 6 },
        { id: 'kpi-internships', target: 1 }
    ];

    const kpiSection = document.querySelector('.kpi-section');
    let kpiAnimated = false;

    function animateKPIs() {
        kpiElements.forEach(kpi => {
            const element = document.getElementById(kpi.id);
            if (!element) return;
            
            let current = 0;
            const target = kpi.target;
            const duration = 1500; // 1.5 seconds
            const stepTime = Math.max(Math.floor(duration / target), 30);
            
            const timer = setInterval(() => {
                current += 1;
                element.textContent = current;
                
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }

    // Setup Intersection Observer for KPI counts
    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !kpiAnimated) {
                animateKPIs();
                kpiAnimated = true;
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (kpiSection) kpiObserver.observe(kpiSection);


    // 6. Skills Progress Bar Animation (Disabled - Switched to minimal tags layout)


    // 7. Contact Form Handlers & Submission Simulation
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const btnSubmit = document.getElementById('btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Processing...`;
            lucide.createIcons();
            
            // Collect Form Data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simulate server request delay
            setTimeout(() => {
                // Success Simulation
                formStatus.className = "form-status success";
                formStatus.innerHTML = `
                    <p>🎉 Thank you, <strong>${name}</strong>!</p>
                    <p style="font-size: 0.82rem; font-weight: 500; margin-top: 4px;">Your message has been logged. I'll get back to you at <strong>${email}</strong> shortly.</p>
                `;
                formStatus.classList.remove('hidden');
                
                // Reset form values
                contactForm.reset();
                
                // Revert submit button
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<i data-lucide="send"></i> Send Message`;
                lucide.createIcons();

                // Auto-fade status after 8 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 8000);

            }, 1800);
        });
    }

    // Header shadow on scroll
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});
