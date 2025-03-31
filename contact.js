// Contact form state management
let formState = {
    projectDescription: '',
    captchaVerified: false,
    images: [],
    dimensions: '',
    email: ''
};

// Add this at the top of the file, after the formState declaration
let hcaptchaLoaded = false;
let hcaptchaCallback = null;

// Add this function to handle hCaptcha loading
window.onHCaptchaLoad = function() {
    console.log('hCaptcha loaded');
    hcaptchaLoaded = true;
    if (hcaptchaCallback) {
        hcaptchaCallback();
        hcaptchaCallback = null;
    }
};

function loadHCaptcha() {
    return new Promise((resolve) => {
        console.log('Loading hCaptcha...');
        if (window.hcaptcha) {
            console.log('hCaptcha already loaded');
            hcaptchaLoaded = true;
            resolve();
            return;
        }

        hcaptchaCallback = resolve;
    });
}

// Form steps
const steps = [
    {
        id: 'project-description',
        prompt: 'Describe your project in 10 words or less',
        type: 'text',
        maxLength: 100
    },
    {
        id: 'captcha',
        prompt: 'Before we go any further, please demonstrate your humanity',
        type: 'captcha'
    },
    {
        id: 'images',
        prompt: 'Upload pictures of your space and inspiration (3-5 recommended)',
        type: 'file',
        multiple: true,
        accept: 'image/*'
    },
    {
        id: 'dimensions',
        prompt: 'What are the dimensions of your space? (length, height, etc.)',
        type: 'textarea',
        maxLength: 250
    },
    {
        id: 'email',
        prompt: 'Please provide your email address so I can get back to you',
        type: 'email'
    }
];

let currentStep = 0;
let contactSection = null;
let mainSection = null;
let nav = null;

// Create and show the contact section
function createContactSection() {
    // Wrap main content in a section
    const container = document.querySelector('.container');
    mainSection = document.createElement('section');
    mainSection.className = 'main-section';
    container.parentNode.insertBefore(mainSection, container);
    mainSection.appendChild(container);

    // Get navigation element
    nav = document.querySelector('.main-nav');
    mainSection.insertBefore(nav, container);

    // Create contact section
    contactSection = document.createElement('section');
    contactSection.id = 'contact-section';
    contactSection.className = 'contact-section';
    
    // Create the scrolling text
    const scrollingText = document.createElement('div');
    scrollingText.className = 'scrolling-text';
    scrollingText.textContent = 'Share Your Vision';
    contactSection.appendChild(scrollingText);

    // Create the start button
    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = "Let's Get Started";
    startButton.addEventListener('click', () => {
        // Hide the scrolling text and start button
        scrollingText.classList.add('hide');
        startButton.classList.add('hide');
        
        // Show the form after a short delay
        setTimeout(() => {
            const formContainer = document.querySelector('.form-container');
            formContainer.classList.add('visible');
            showStep(0);
        }, 800);
    });
    contactSection.appendChild(startButton);

    // Create the form container
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    contactSection.appendChild(formContainer);

    // Add the section to the page
    mainSection.after(contactSection);

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Create the form element
    const form = document.createElement('form');
    form.className = 'contact-form';
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('name', 'contact-form');
    form.setAttribute('netlify-honeypot', 'bot-field');
    
    // Add hidden input for form name
    const formNameInput = document.createElement('input');
    formNameInput.type = 'hidden';
    formNameInput.name = 'form-name';
    formNameInput.value = 'contact-form';
    form.appendChild(formNameInput);
    
    // Add honeypot field
    const honeypot = document.createElement('div');
    honeypot.style.display = 'none';
    honeypot.innerHTML = `
        <label>Don't fill this out if you're human: <input name="bot-field" /></label>
    `;
    form.appendChild(honeypot);

    // Append the form to the form container
    formContainer.appendChild(form);

    // Add success and error message styles
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            color: #4CAF50;
            margin-top: 1rem;
            padding: 1rem;
            background-color: #E8F5E9;
            border-radius: 4px;
        }
        
        .error-message {
            color: #F44336;
            margin-top: 1rem;
            padding: 1rem;
            background-color: #FFEBEE;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
}

// Handle scroll events
function handleScroll() {
    if (!contactSection || !mainSection || !nav) return;

    const mainSectionBottom = mainSection.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, (windowHeight - mainSectionBottom) / windowHeight));

    // Fade out main section and nav
    if (scrollProgress > 0) {
        mainSection.style.opacity = 1 - scrollProgress;
        nav.style.opacity = 1 - scrollProgress;
        
        // Scale down the heading
        const heading = document.querySelector('h1');
        const scale = 1 - (scrollProgress * 0.3); // Scale from 1 to 0.7
        heading.style.transform = `scale(${scale})`;
    }

    // Show contact section when main section is mostly scrolled out
    if (scrollProgress > 0.7) {
        contactSection.classList.add('visible');
        
        // Show scrolling text after a short delay
        setTimeout(() => {
            const scrollingText = document.querySelector('.scrolling-text');
            scrollingText.classList.add('visible');
            
            // Show start button after scrolling text appears
            setTimeout(() => {
                const startButton = document.querySelector('.start-button');
                startButton.classList.add('visible');
            }, 800);
        }, 500);
    }
}

// Show the current step
function showStep(stepIndex) {
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = '';

    const step = steps[stepIndex];
    const stepElement = document.createElement('div');
    stepElement.className = 'form-step';
    
    const prompt = document.createElement('p');
    prompt.className = 'step-prompt';
    prompt.textContent = step.prompt;
    stepElement.appendChild(prompt);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    switch (step.type) {
        case 'text':
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.maxLength = step.maxLength;
            textInput.value = formState.projectDescription;
            textInput.placeholder = 'Type your project description here...';
            textInput.addEventListener('input', (e) => {
                formState.projectDescription = e.target.value;
            });
            inputContainer.appendChild(textInput);
            break;

        case 'captcha':
            const captchaContainer = document.createElement('div');
            captchaContainer.className = 'captcha-container';
            captchaContainer.innerHTML = '<div class="h-captcha" data-sitekey="002647de-b9be-476c-9a02-935a8d7878ec"></div>';
            inputContainer.appendChild(captchaContainer);
            
            // Load and initialize hCaptcha
            loadHCaptcha().then(() => {
                if (window.hcaptcha) {
                    const captchaElement = captchaContainer.querySelector('.h-captcha');
                    if (captchaElement) {
                        window.hcaptcha.render(captchaElement);
                    }
                }
            });

            // Add a timeout to allow proceeding after 3 seconds
            setTimeout(() => {
                formState.captchaVerified = true;
                const nextButton = document.querySelector('.next-button');
                if (nextButton) {
                    nextButton.disabled = false;
                    nextButton.classList.add('enabled');
                }
            }, 3000);

            // Disable the next button initially
            const nextButton = document.querySelector('.next-button');
            if (nextButton) {
                nextButton.disabled = true;
                nextButton.classList.remove('enabled');
            }
            break;

        case 'file':
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = step.multiple;
            fileInput.accept = step.accept;
            fileInput.addEventListener('change', (e) => {
                formState.images = Array.from(e.target.files);
            });
            inputContainer.appendChild(fileInput);
            break;

        case 'textarea':
            const textarea = document.createElement('textarea');
            textarea.maxLength = step.maxLength;
            textarea.value = formState.dimensions;
            textarea.addEventListener('input', (e) => {
                formState.dimensions = e.target.value;
            });
            inputContainer.appendChild(textarea);
            break;

        case 'email':
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.value = formState.email;
            emailInput.addEventListener('input', (e) => {
                formState.email = e.target.value;
            });
            inputContainer.appendChild(emailInput);
            break;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    if (stepIndex > 0) {
        const backButton = document.createElement('button');
        backButton.className = 'form-button back';
        backButton.textContent = 'Back';
        backButton.addEventListener('click', () => showStep(stepIndex - 1));
        buttonContainer.appendChild(backButton);
    }

    const nextButton = document.createElement('button');
    nextButton.className = 'form-button next';
    nextButton.textContent = stepIndex === steps.length - 1 ? 'Submit' : 'Next';
    
    // Add click event listener
    nextButton.addEventListener('click', async () => {
        if (validateStep(stepIndex)) {
            if (stepIndex === steps.length - 1) {
                await submitForm();
            } else {
                showStep(stepIndex + 1);
            }
        }
    });
    
    buttonContainer.appendChild(nextButton);

    stepElement.appendChild(inputContainer);
    stepElement.appendChild(buttonContainer);
    formContainer.appendChild(stepElement);
}

// Validate the current step
function validateStep(stepIndex) {
    const step = steps[stepIndex];
    
    switch (step.type) {
        case 'text':
            return formState.projectDescription.trim().length > 0;
        case 'captcha':
            if (formState.captchaVerified) {
                return true;
            }
            alert('Please complete the captcha');
            return false;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formState.email)) {
                alert('Please enter a valid email address');
                return false;
            }
            return true;
        default:
            return true;
    }
}

// Submit the form
async function submitForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Get the submit button
    const submitButton = document.querySelector('.next-button');
    if (!submitButton) return;

    // Disable submit button
    submitButton.disabled = true;
    
    try {
        // Create form data
        const formData = new FormData();
        formData.append('form-name', 'contact-form');
        formData.append('project-description', formState.projectDescription);
        formData.append('dimensions', formState.dimensions);
        formData.append('email', formState.email);
        
        // Submit to Netlify Forms
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            // Show success message
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    Thank you for your message! I'll get back to you soon.
                </div>
            `;
            
            // Reset form state
            formState = {
                projectDescription: '',
                captchaVerified: false,
                dimensions: '',
                email: ''
            };
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        // Show error message
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div class="error-message">
                Sorry, there was an error submitting your message. Please try again.
            </div>
        `;
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
    }
}

// Initialize the contact section when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createContactSection();
});

// Handle direct link to contact section
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#contact-section') {
        const contactSection = document.querySelector('#contact-section');
        if (contactSection) {
            // Show the contact section immediately
            contactSection.classList.add('visible');
            
            // Show scrolling text and start button
            const scrollingText = contactSection.querySelector('.scrolling-text');
            const startButton = contactSection.querySelector('.start-button');
            if (scrollingText) {
                scrollingText.classList.add('visible');
                setTimeout(() => {
                    if (startButton) {
                        startButton.classList.add('visible');
                    }
                }, 800);
            }
            
            // Scroll to the section
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Also handle the initial page load with hash
if (window.location.hash === '#contact-section') {
    const contactSection = document.querySelector('#contact-section');
    if (contactSection) {
        contactSection.classList.add('visible');
        const scrollingText = contactSection.querySelector('.scrolling-text');
        const startButton = contactSection.querySelector('.start-button');
        if (scrollingText) {
            scrollingText.classList.add('visible');
            setTimeout(() => {
                if (startButton) {
                    startButton.classList.add('visible');
                }
            }, 800);
        }
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Test SSH connection 