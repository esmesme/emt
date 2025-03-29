// Contact form state management
let formState = {
    projectDescription: '',
    captchaVerified: false,
    images: [],
    dimensions: '',
    email: ''
};

// Form steps
const steps = [
    {
        id: 'project-description',
        prompt: 'In about 5-10 words, describe your project e.g. elevated dog bed with stairs',
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
    scrollingText.textContent = 'PITCH ME ON YOUR PROJECT - LET ME SEE HOW I CAN HELP';
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
            // Add reCAPTCHA widget here
            const captchaScript = document.createElement('script');
            captchaScript.src = 'https://www.google.com/recaptcha/api.js';
            document.head.appendChild(captchaScript);
            captchaContainer.innerHTML = '<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>';
            inputContainer.appendChild(captchaContainer);
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
    nextButton.addEventListener('click', () => {
        if (validateStep(stepIndex)) {
            if (stepIndex === steps.length - 1) {
                submitForm();
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
            return formState.captchaVerified;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
        default:
            return true;
    }
}

// Submit the form
async function submitForm() {
    // Here you would typically send the form data to your backend
    // For now, we'll just log it to the console
    console.log('Form submitted:', formState);
    
    // You could use a service like Formspree, Netlify Forms, or set up your own backend
    // Example using Formspree:
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState)
        });
        
        if (response.ok) {
            alert('Thank you for your submission! I will get back to you soon.');
            // Reset form
            formState = {
                projectDescription: '',
                captchaVerified: false,
                images: [],
                dimensions: '',
                email: ''
            };
            showStep(0);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again later.');
    }
}

// Initialize the contact section when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createContactSection();
}); 