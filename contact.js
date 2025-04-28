// Contact form state management
let formState = {
    projectDescription: '',
    captchaVerified: false,
    images: [],
    dimensions: '',
    email: ''
};

// Validation rules for each field
const validationRules = {
    projectDescription: {
        minLength: 1,
        maxLength: 100,
        pattern: /^[\w\s.,!?-]{1,100}$/,
        errorMessage: 'Please enter a valid project description (1-100 characters, letters, numbers, and basic punctuation only)'
    },
    dimensions: {
        minLength: 1,
        maxLength: 250,
        pattern: /^[\w\s.,!?()-]{1,250}$/,
        errorMessage: 'Please enter valid dimensions (1-250 characters, letters, numbers, and basic punctuation only)'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Please enter a valid email address'
    },
    images: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        maxCount: 5,
        errorMessage: 'Please upload 1-5 images (JPEG, PNG, or GIF) under 5MB each'
    }
};

// Add this at the top of the file, after the formState declaration
let hcaptchaLoaded = false;
let hcaptchaCallback = null;
let hcaptchaWidgetId = null;

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
    return new Promise((resolve, reject) => {
        console.log('Loading hCaptcha...');
        if (window.hcaptcha) {
            console.log('hCaptcha already loaded');
            hcaptchaLoaded = true;
            resolve();
            return;
        }

        // Set a timeout to handle loading failure
        const timeout = setTimeout(() => {
            reject(new Error('hCaptcha failed to load'));
        }, 10000); // 10 second timeout

        hcaptchaCallback = () => {
            clearTimeout(timeout);
            resolve();
        };
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

    // Add character counter for text inputs
    const addCharCounter = (input, maxLength) => {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.8rem';
        counter.style.marginTop = '0.5rem';
        counter.style.color = '#666';
        
        const updateCounter = () => {
            const current = input.value.length;
            counter.textContent = `${current}/${maxLength} characters`;
            counter.style.color = current > maxLength ? '#ff0000' : '#666';
        };
        
        input.addEventListener('input', updateCounter);
        updateCounter();
        inputContainer.appendChild(counter);
    };

    switch (step.type) {
        case 'text':
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.maxLength = step.maxLength;
            textInput.value = formState.projectDescription;
            textInput.placeholder = 'Type your project description here...';
            textInput.addEventListener('input', (e) => {
                formState.projectDescription = e.target.value;
                validateInput(textInput, 'projectDescription');
            });
            inputContainer.appendChild(textInput);
            addCharCounter(textInput, step.maxLength);
            break;

        case 'captcha':
            const captchaContainer = document.createElement('div');
            captchaContainer.className = 'captcha-container';
            captchaContainer.innerHTML = '<div class="h-captcha" data-sitekey="002647de-b9be-476c-9a02-935a8d7878ec"></div>';
            inputContainer.appendChild(captchaContainer);
            
            // Load and initialize hCaptcha
            loadHCaptcha()
                .then(() => {
                    hcaptchaWidgetId = window.hcaptcha.render('h-captcha', {
                        sitekey: '002647de-b9be-476c-9a02-935a8d7878ec',
                        callback: (token) => {
                            formState.captchaVerified = true;
                            clearError(captchaContainer);
                            validateStep(stepIndex);
                        },
                        'error-callback': () => {
                            formState.captchaVerified = false;
                            showError(captchaContainer, 'Please complete the captcha verification');
                        },
                        'expired-callback': () => {
                            formState.captchaVerified = false;
                            showError(captchaContainer, 'Captcha expired. Please verify again.');
                        }
                    });
                })
                .catch((error) => {
                    console.error('Failed to load hCaptcha:', error);
                    showError(captchaContainer, 'Failed to load captcha. Please refresh the page and try again.');
                });
            break;

        case 'file':
            const fileContainer = document.createElement('div');
            fileContainer.className = 'file-upload-container';
            
            const fileLabel = document.createElement('label');
            fileLabel.className = 'file-upload-label';
            fileLabel.textContent = 'Drag & drop images here or click to browse';
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', (e) => {
                handleFileUpload(e.target.files);
            });
            
            fileLabel.appendChild(fileInput);
            fileContainer.appendChild(fileLabel);
            inputContainer.appendChild(fileContainer);
            
            // Setup drag and drop
            setupFileUpload();
            break;

        case 'textarea':
            const textarea = document.createElement('textarea');
            textarea.maxLength = step.maxLength;
            textarea.value = formState.dimensions;
            textarea.placeholder = 'Enter dimensions here...';
            textarea.addEventListener('input', (e) => {
                formState.dimensions = e.target.value;
                validateInput(textarea, 'dimensions');
            });
            inputContainer.appendChild(textarea);
            addCharCounter(textarea, step.maxLength);
            break;

        case 'email':
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.value = formState.email;
            emailInput.placeholder = 'Enter your email address...';
            emailInput.addEventListener('input', (e) => {
                formState.email = e.target.value;
                validateInput(emailInput, 'email');
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
            return validateInput(document.querySelector(`input[name="${step.id}"]`), step.id);
        case 'captcha':
            if (!hcaptchaLoaded) {
                showError(document.querySelector('.captcha-container'), 'Captcha is still loading. Please wait.');
                return false;
            }
            if (!formState.captchaVerified) {
                showError(document.querySelector('.captcha-container'), 'Please complete the captcha verification');
                return false;
            }
            return true;
        case 'email':
            return validateInput(document.querySelector(`input[name="${step.id}"]`), step.id);
        case 'file':
            return validateFiles(formState.images);
        case 'textarea':
            return validateInput(document.querySelector(`textarea[name="${step.id}"]`), step.id);
        default:
            return true;
    }
}

// Validation functions
function validateInput(input, fieldName) {
    const rules = validationRules[fieldName];
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = `Maximum ${rules.maxLength} characters allowed`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.errorMessage;
    }

    if (!isValid) {
        showError(input, errorMessage);
    } else {
        clearError(input);
    }

    return isValid;
}

function validateFiles(files) {
    const rules = validationRules.images;
    let isValid = true;
    let errorMessage = '';

    if (files.length > rules.maxCount) {
        isValid = false;
        errorMessage = `Maximum ${rules.maxCount} files allowed`;
    } else {
        for (const file of files) {
            if (file.size > rules.maxSize) {
                isValid = false;
                errorMessage = 'File size exceeds 5MB limit';
                break;
            }
            if (!rules.allowedTypes.includes(file.type)) {
                isValid = false;
                errorMessage = 'Only JPEG, PNG, and GIF files are allowed';
                break;
            }
        }
    }

    if (!isValid) {
        showError(document.querySelector('input[type="file"]'), errorMessage);
    } else {
        clearError(document.querySelector('input[type="file"]'));
    }

    return isValid;
}

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    input.classList.remove('error');
}

// Submit the form
async function submitForm() {
    try {
        // Create FormData object
        const formData = new FormData();
        
        // Add form fields
        formData.append('form-name', 'contact-form');
        formData.append('projectDescription', formState.projectDescription);
        formData.append('email', formState.email);
        formData.append('dimensions', formState.dimensions);
        
        // Add files
        for (let i = 0; i < formState.images.length; i++) {
            formData.append('images', formState.images[i]);
        }
        
        // Add honeypot field
        formData.append('bot-field', '');

        // Show loading state
        const submitButton = document.querySelector('.form-button.next:last-child');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Submit to Netlify
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Show success message
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    <h2>Thank you!</h2>
                    <p>Your submission has been received. I'll get back to you soon.</p>
                </div>
            `;
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div class="error-message">
                <h2>Oops!</h2>
                <p>Something went wrong. Please try again later.</p>
                <button class="form-button" onclick="location.reload()">Try Again</button>
            </div>
        `;
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

// File upload handling
function handleFileUpload(files) {
    const container = document.querySelector('.file-upload-container');
    if (!container) return;

    // Validate files
    if (!validateFiles(files)) return;

    // Clear existing previews
    const previewContainer = container.querySelector('.file-preview-container');
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }

    // Create preview container if it doesn't exist
    if (!previewContainer) {
        const newPreviewContainer = document.createElement('div');
        newPreviewContainer.className = 'file-preview-container';
        container.appendChild(newPreviewContainer);
    }

    // Create previews for each file
    Array.from(files).forEach((file, index) => {
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.innerHTML = '×';
        removeButton.onclick = () => {
            preview.remove();
            formState.images.splice(index, 1);
            validateStep(currentStep);
        };
        
        preview.appendChild(img);
        preview.appendChild(removeButton);
        container.querySelector('.file-preview-container').appendChild(preview);
    });

    // Update form state
    formState.images = files;
    validateStep(currentStep);
}

// Add drag and drop handling
function setupFileUpload() {
    const container = document.querySelector('.file-upload-container');
    if (!container) return;

    const label = container.querySelector('.file-upload-label');
    if (!label) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        label.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        label.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        label.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        label.classList.add('dragover');
    }

    function unhighlight() {
        label.classList.remove('dragover');
    }

    label.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileUpload(files);
    }
}

// Test SSH connection 