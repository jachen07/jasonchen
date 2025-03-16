// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get the main navigation and the about section
    const mainNav = document.querySelector('nav');
    const aboutSection = document.getElementById('about');
    
    // Tab functionality for About section
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");
    
    function opentab(tabname) {
        for(let tablink of tablinks) {
            tablink.classList.remove("active-link");
        }
        for(let tabcontent of tabcontents) {
            tabcontent.classList.remove("active-tab");
        }
        event.currentTarget.classList.add("active-link");
        document.getElementById(tabname).classList.add("active-tab");
    }
    
    // Create a scroll indicator to show which section is active
    function updateActiveSection() {
        const sections = ['header', 'about', 'experiences', 'projects', 'contact'];
        const navLinks = document.querySelectorAll('#sidemenu li a');
        
        // Get current scroll position
        const scrollPosition = window.scrollY;
        
        // Find the current section
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section) {
                const sectionTop = section.offsetTop - 150; // Offset to trigger earlier
                
                if (scrollPosition >= sectionTop) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active-nav'));
                    
                    // Add active class to current section link
                    const currentLink = document.querySelector(`#sidemenu li a[href="#${sections[i]}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active-nav');
                    }
                    break;
                }
            }
        }
    }
    
    // Check if we need to show/hide menu based on scroll position
    function toggleScrollMenu() {
        if (!aboutSection) return;
        
        const aboutSectionTop = aboutSection.offsetTop;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= aboutSectionTop - 100) {
            // We've scrolled past the About section, show the floating menu
            document.body.classList.add('show-scroll-menu');
        } else {
            // We're still at the top, hide the floating menu
            document.body.classList.remove('show-scroll-menu');
        }
        
        // Update which navigation item is active
        updateActiveSection();
    }
    
    // Listen to scroll events
    window.addEventListener('scroll', toggleScrollMenu);
    
    // Mobile menu toggle
    var sidemenu = document.getElementById("sidemenu");
    
    function openmenu() {
        sidemenu.style.right = "0";
    }
    
    function closemenu() {
        sidemenu.style.right = "-200px";
    }
    
    // Make sure these functions are available globally
    window.opentab = opentab;
    window.openmenu = openmenu;
    window.closemenu = closemenu;
    
    // Add click event listeners to menu items
    document.querySelectorAll('#sidemenu li a, .scroll-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close the menu first on mobile
                closemenu();
                
                // Scroll to the section
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form submission
    const form = document.forms['submit-to-google-sheet'];
    if (form) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyfdPXYVQQdvA_Ap634n1_l6YCr9zw-_f3aPq0bw9dk18iRGzm0hhjgwdaD7QiaVnbx/exec';
        const msg = document.getElementById("msg");
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            msg.innerHTML = "";
            
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response;
                })
                .then(() => {
                    msg.innerHTML = "<span style='color: green;'>Message sent successfully!</span>";
                    form.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    msg.innerHTML = "<span style='color: red;'>Failed to send message. Please try again.</span>";
                })
                .finally(() => {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    // Clear success message after 5 seconds
                    if (msg.innerHTML.includes('successfully')) {
                        setTimeout(function(){
                            msg.innerHTML = "";
                        }, 5000);
                    }
                });
        });
    }
    // Initial check for page load position
    toggleScrollMenu();
});