// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const mainNav = document.querySelector('nav');
    const aboutSection = document.getElementById('about');
    const sidemenu = document.getElementById('sidemenu');
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById("msg");

    // -----------------------------
    // Tab Functionality
    // -----------------------------
    window.opentab = function (tabname) {
        for (let tablink of tablinks) {
            tablink.classList.remove("active-link");
        }
        for (let tabcontent of tabcontents) {
            tabcontent.classList.remove("active-tab");
        }
        event.currentTarget.classList.add("active-link");
        document.getElementById(tabname).classList.add("active-tab");
    };

    // -----------------------------
    // Mobile Menu Functionality
    // -----------------------------
    window.openmenu = function () {
        sidemenu.style.right = "0";
    };

    window.closemenu = function () {
        sidemenu.style.right = "-200px";
    };

    // -----------------------------
    // Section Scroll Activation
    // -----------------------------
    function updateActiveSection() {
        const sections = ['header', 'about', 'experiences', 'projects', 'contact'];
        const navLinks = document.querySelectorAll('#sidemenu li a');

        const scrollPosition = window.scrollY;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section) {
                const sectionTop = section.offsetTop - 150;
                if (scrollPosition >= sectionTop) {
                    navLinks.forEach(link => link.classList.remove('active-nav'));
                    const currentLink = document.querySelector(`#sidemenu li a[href="#${sections[i]}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active-nav');
                    }
                    break;
                }
            }
        }
    }

    function toggleScrollMenu() {
        if (!aboutSection) return;
        const aboutSectionTop = aboutSection.offsetTop;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= aboutSectionTop - 100) {
            document.body.classList.add('show-scroll-menu');
        } else {
            document.body.classList.remove('show-scroll-menu');
        }

        updateActiveSection();
    }

    // -----------------------------
    // Smooth Scrolling
    // -----------------------------
    document.querySelectorAll('#sidemenu li a, .scroll-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                closemenu();

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

    // -----------------------------
    // Google Sheet Form Submission
    // -----------------------------
    if (form) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyfdPXYVQQdvA_Ap634n1_l6YCr9zw-_f3aPq0bw9dk18iRGzm0hhjgwdaD7QiaVnbx/exec';
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        form.addEventListener('submit', e => {
            e.preventDefault();
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            msg.innerHTML = "";

            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
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
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;

                    if (msg.innerHTML.includes('successfully')) {
                        setTimeout(() => { msg.innerHTML = ""; }, 5000);
                    }
                });
        });
    }

    // -----------------------------
    // Initial Scroll Setup
    // -----------------------------
    window.addEventListener('scroll', toggleScrollMenu);
    toggleScrollMenu(); // Trigger once on load
});