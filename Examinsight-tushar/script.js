// ===========================
// ExamInsight - Main JavaScript
// ===========================

// Mock Exam Questions Database
const examQuestions = {
    'jee-physics': [
        { q: 'A projectile is launched at angle 45° with velocity 50 m/s. Find range (g=10 m/s²)?', a: ['200 m', '150 m', '250 m', '100 m'], correct: 2 },
        { q: 'What is the SI unit of force?', a: ['Dyne', 'Ampere', 'Newton', 'Joule'], correct: 2 },
        { q: 'At what temperature Celsius and Fahrenheit are equal?', a: ['-40°', '-50°', '0°', '100°'], correct: 0 },
        { q: 'A body moving with constant acceleration travels 10 m in 1st second and 20 m in 2nd second. Initial velocity is?', a: ['0 m/s', '5 m/s', '10 m/s', '15 m/s'], correct: 0 },
        { q: 'Photon theory was given by?', a: ['Newton', 'Einstein', 'Planck', 'Young'], correct: 1 },
        { q: 'The angle of dip at the equator is?', a: ['0°', '45°', '60°', '90°'], correct: 0 },
        { q: 'Which of the following is scalar quantity?', a: ['Force', 'Velocity', 'Acceleration', 'Temperature'], correct: 3 },
        { q: 'What is the primary SI unit of energy?', a: ['Erg', 'Joule', 'Calorie', 'Watt'], correct: 1 },
        { q: 'Hooke\'s Law applies to?', a: ['All materials', 'Elastic materials within limits', 'Plastic materials', 'Brittle materials'], correct: 1 },
        { q: 'Speed of light in vacuum is approximately?', a: ['3×10⁵ m/s', '3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s'], correct: 2 },
    ],
    'jee-chemistry': [
        { q: 'What is the atomic number of Carbon?', a: ['4', '6', '8', '12'], correct: 1 },
        { q: 'Which acid is used in car batteries?', a: ['Phosphoric', 'Hydrochloric', 'Sulfuric', 'Acetic'], correct: 2 },
        { q: 'What is the pH of neutral solution?', a: ['0', '7', '14', '10'], correct: 1 },
        { q: 'Alkali metal that floats on water?', a: ['Sodium', 'Potassium', 'Lithium', 'Cesium'], correct: 2 },
        { q: 'What is the molar mass of H₂O₂?', a: ['32', '34', '36', '38'], correct: 1 },
    ],
    'neet-biology': [
        { q: 'What is the powerhouse of the cell?', a: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], correct: 2 },
        { q: 'How many chambers does a human heart have?', a: ['2', '3', '4', '5'], correct: 2 },
        { q: 'Which blood group is universal donor?', a: ['A', 'B', 'AB', 'O'], correct: 3 },
        { q: 'DNA stands for?', a: ['Deoxyribose Nucleic Acid', 'Deoxyribulose Nucleic Acid', 'Dextrose Nucleic Acid', 'Dioxide Nucleic Acid'], correct: 0 },
        { q: 'What is the basic unit of life?', a: ['Tissue', 'Organ', 'Cell', 'Atom'], correct: 2 },
    ],
    'gate-cs': [
        { q: 'What is the time complexity of binary search?', a: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'], correct: 1 },
        { q: 'Which sorting algorithm is most efficient for nearly sorted data?', a: ['Quick sort', 'Insertion sort', 'Merge sort', 'Heap sort'], correct: 1 },
        { q: 'What is the primary advantage of hash tables?', a: ['Sorted data', 'O(1) average access', 'Space efficiency', 'Simple implementation'], correct: 1 },
        { q: 'Stack operates on which principle?', a: ['FIFO', 'LIFO', 'Random', 'Priority'], correct: 1 },
        { q: 'What is the worst case of quicksort?', a: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2 },
    ],
};

// ===== Section Navigation =====

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHamburgerMenu();
    initializeMockExam();
    initializeSyllabusManagement();
    initializeResourceManagement();
    initializeResourceFilter();
    initializeCalendar();
    animateDashboardOnScroll();

    // Calendar event modal handlers
    const eventModal = document.getElementById('eventModal');
    const eventForm = document.getElementById('eventForm');
    const modalClose = eventModal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelEvent');

    modalClose.addEventListener('click', closeEventModal);
    cancelBtn.addEventListener('click', closeEventModal);
    eventForm.addEventListener('submit', saveCalendarEvent);

    // Close modal when clicking outside
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeEventModal();
        }
    });

    // Type selector handlers
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            option.classList.add('selected');

            // Update hidden input
            const typeValue = option.getAttribute('data-value');
            document.getElementById('eventType').value = typeValue;
        });
    });
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ===== Mock Exam Functionality =====

let currentExam = {
    questions: [],
    currentQuestion: 0,
    answers: [],
    timeLimit: 600, // 10 minutes default
    timeRemaining: 600,
    timerInterval: null,
};

function initializeMockExam() {
    const startBtn = document.getElementById('startExamBtn');
    const endBtn = document.getElementById('endExamBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitExamBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const examSelect = document.getElementById('examSelect');
    const questionCountInput = document.getElementById('questionCount');

    startBtn.addEventListener('click', startMockExam);
    endBtn.addEventListener('click', endExamEarly);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', previousQuestion);
    submitBtn.addEventListener('click', submitExam);
    retakeBtn.addEventListener('click', startMockExam);

    // Update exam select
    examSelect.addEventListener('change', function() {
        // Update available questions based on exam type
    });
}

function startMockExam() {
    const examSelect = document.getElementById('examSelect').value;
    const questionCount = parseInt(document.getElementById('questionCount').value) || 10;

    if (!examSelect) {
        alert('Please select an exam type');
        return;
    }

    const questions = examQuestions[examSelect];
    if (!questions) {
        alert('Exam questions not found');
        return;
    }

    // Shuffle and limit questions
    currentExam.questions = questions.sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, questions.length));
    currentExam.currentQuestion = 0;
    currentExam.answers = new Array(currentExam.questions.length).fill(null);
    currentExam.timeLimit = questionCount * 60; // 1 minute per question
    currentExam.timeRemaining = currentExam.timeLimit;

    // Show exam interface
    document.getElementById('examInterface').style.display = 'flex';
    document.querySelector('.exam-selector').style.display = 'none';
    document.getElementById('examResult').style.display = 'none';

    // Load first question
    loadQuestion(0);
    startTimer();
    buildQuestionNavigator();
}

function loadQuestion(index) {
    if (index < 0 || index >= currentExam.questions.length) return;

    currentExam.currentQuestion = index;
    const question = currentExam.questions[index];

    // Update question display
    document.getElementById('questionText').textContent = question.q;
    document.getElementById('optA').textContent = question.a[0];
    document.getElementById('optB').textContent = question.a[1];
    document.getElementById('optC').textContent = question.a[2];
    document.getElementById('optD').textContent = question.a[3];

    // Clear previous selection
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.checked = false;
    });

    // Restore previous answer if exists
    if (currentExam.answers[index] !== null) {
        document.querySelector(`input[value="${currentExam.answers[index]}"]`).checked = true;
    }

    // Update question number
    document.getElementById('questionNumber').textContent = `Question ${index + 1} of ${currentExam.questions.length}`;

    // Update navigation
    updateQuestionNavigator(index);

    // Update button states
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === currentExam.questions.length - 1;
}

function nextQuestion() {
    saveAnswer();
    if (currentExam.currentQuestion < currentExam.questions.length - 1) {
        loadQuestion(currentExam.currentQuestion + 1);
    }
}

function previousQuestion() {
    saveAnswer();
    if (currentExam.currentQuestion > 0) {
        loadQuestion(currentExam.currentQuestion - 1);
    }
}

function saveAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        currentExam.answers[currentExam.currentQuestion] = selected.value;
    }
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');

    currentExam.timerInterval = setInterval(() => {
        currentExam.timeRemaining--;

        const minutes = Math.floor(currentExam.timeRemaining / 60);
        const seconds = currentExam.timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (currentExam.timeRemaining <= 0) {
            clearInterval(currentExam.timerInterval);
            submitExam();
        }

        // Change color to red when time is running out
        if (currentExam.timeRemaining < 60) {
            timerDisplay.style.color = '#ef4444';
        }
    }, 1000);
}

function submitExam() {
    saveAnswer();
    clearInterval(currentExam.timerInterval);

    // Calculate results
    let correct = 0;
    currentExam.answers.forEach((answer, index) => {
        if (answer !== null) {
            const answerIndex = answer.charCodeAt(0) - 'a'.charCodeAt(0);
            if (answerIndex === currentExam.questions[index].correct) {
                correct++;
            }
        }
    });

    const score = Math.round((correct / currentExam.questions.length) * 100);
    const incorrect = currentExam.questions.length - correct;

    // Show results
    document.getElementById('examInterface').style.display = 'none';
    document.getElementById('examResult').style.display = 'block';
    document.getElementById('finalScore').textContent = score + '%';
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('incorrectCount').textContent = incorrect;
}

function endExamEarly() {
    if (confirm('Are you sure you want to end the exam? Your answers will be submitted.')) {
        submitExam();
    }
}

function buildQuestionNavigator() {
    const nav = document.getElementById('questionNav');
    nav.innerHTML = '';

    currentExam.questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-nav-btn';
        btn.textContent = index + 1;
        btn.addEventListener('click', () => {
            saveAnswer();
            loadQuestion(index);
        });
        nav.appendChild(btn);
    });

    updateQuestionNavigator(0);
}

function updateQuestionNavigator(currentIndex) {
    const buttons = document.querySelectorAll('.question-nav-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('current', 'answered');
        if (index === currentIndex) {
            btn.classList.add('current');
        } else if (currentExam.answers[index] !== null) {
            btn.classList.add('answered');
        }
    });
}

// ===== Syllabus Management =====

let customSyllabusItems = [];
let predefinedSyllabusItems = {
    'physics': {
        id: 'physics',
        exam: 'jee',
        subject: 'Physics',
        topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity', 'Magnetism'],
        completedTopics: [],
        progress: 0
    },
    'chemistry': {
        id: 'chemistry',
        exam: 'jee',
        subject: 'Chemistry',
        topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biomolecules'],
        completedTopics: [],
        progress: 0
    },
    'biology': {
        id: 'biology',
        exam: 'neet',
        subject: 'Biology',
        topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology'],
        completedTopics: [],
        progress: 0
    },
    'history': {
        id: 'history',
        exam: 'upsc',
        subject: 'History & Culture',
        topics: ['Ancient India', 'Medieval India', 'Modern India', 'World History'],
        completedTopics: [],
        progress: 0
    },
    'cs': {
        id: 'cs',
        exam: 'gate',
        subject: 'Data Structures',
        topics: ['Arrays & Lists', 'Trees & Graphs', 'Sorting', 'Searching', 'Dynamic Programming'],
        completedTopics: [],
        progress: 0
    }
};

function initializeSyllabusManagement() {
    // Load saved syllabus states from localStorage
    loadPredefinedSyllabusState();
    loadSyllabusItems();

    // Initialize predefined syllabus click handlers
    initializePredefinedSyllabus();

    const addBtn = document.getElementById('addSyllabusBtn');
    const modal = document.getElementById('addSyllabusModal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelAddSyllabus');
    const form = document.getElementById('addSyllabusForm');

    // Event listeners
    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addSyllabusItem();
        modal.style.display = 'none';
        form.reset();
    });
}

function initializePredefinedSyllabus() {
    // Add click handlers to predefined syllabus topics
    const predefinedItems = document.querySelectorAll('.syllabus-item[data-predefined]');

    predefinedItems.forEach(item => {
        const predefinedId = item.getAttribute('data-predefined');
        const topicTags = item.querySelectorAll('.topic-tag');

        topicTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const topic = tag.getAttribute('data-topic');
                togglePredefinedTopicCompletion(predefinedId, topic);
            });
        });
    });

    // Update initial display
    updatePredefinedSyllabusDisplay();
}

function togglePredefinedTopicCompletion(predefinedId, topic) {
    const item = predefinedSyllabusItems[predefinedId];
    if (!item) return;

    const topicIndex = item.completedTopics.indexOf(topic);
    if (topicIndex > -1) {
        item.completedTopics.splice(topicIndex, 1);
    } else {
        item.completedTopics.push(topic);
    }

    // Update progress
    item.progress = Math.round((item.completedTopics.length / item.topics.length) * 100);

    savePredefinedSyllabusState();
    updatePredefinedSyllabusDisplay();
}

function updatePredefinedSyllabusDisplay() {
    Object.keys(predefinedSyllabusItems).forEach(predefinedId => {
        const item = predefinedSyllabusItems[predefinedId];
        const itemElement = document.querySelector(`[data-predefined="${predefinedId}"]`);

        if (itemElement) {
            // Update progress bar and text
            const progressBar = itemElement.querySelector('.progress');
            const progressText = itemElement.querySelector('.progress-text');

            if (progressBar) progressBar.style.width = `${item.progress}%`;
            if (progressText) progressText.textContent = `${item.progress}%`;

            // Update topic tags
            const topicTags = itemElement.querySelectorAll('.topic-tag');
            topicTags.forEach(tag => {
                const topic = tag.getAttribute('data-topic');
                const isCompleted = item.completedTopics.includes(topic);

                tag.classList.toggle('completed', isCompleted);
                tag.innerHTML = `${isCompleted ? '✓ ' : ''}${topic}`;
            });
        }
    });
}

function savePredefinedSyllabusState() {
    localStorage.setItem('examInsightPredefinedSyllabus', JSON.stringify(predefinedSyllabusItems));
}

function loadPredefinedSyllabusState() {
    const saved = localStorage.getItem('examInsightPredefinedSyllabus');
    if (saved) {
        const savedState = JSON.parse(saved);
        // Merge saved state with default state
        Object.keys(savedState).forEach(key => {
            if (predefinedSyllabusItems[key]) {
                predefinedSyllabusItems[key].completedTopics = savedState[key].completedTopics || [];
                predefinedSyllabusItems[key].progress = savedState[key].progress || 0;
            }
        });
    }
}

function addSyllabusItem() {
    const exam = document.getElementById('syllabusExam').value;
    const subject = document.getElementById('syllabusSubject').value.trim();
    const topicsText = document.getElementById('syllabusTopics').value.trim();
    const progress = parseInt(document.getElementById('syllabusProgress').value);

    if (!exam || !subject || !topicsText) {
        alert('Please fill in all required fields');
        return;
    }

    const topics = topicsText.split(',').map(topic => topic.trim()).filter(topic => topic);

    const newItem = {
        id: Date.now(),
        exam: exam,
        subject: subject,
        topics: topics,
        progress: progress,
        completedTopics: []
    };

    customSyllabusItems.push(newItem);
    saveSyllabusItems();
    renderSyllabusItems();

    // Show success message
    showNotification('Syllabus added successfully!', 'success');
}

function renderSyllabusItems() {
    const syllabusList = document.querySelector('.syllabus-list');

    // Clear existing custom items (keep the default ones)
    const customItems = syllabusList.querySelectorAll('.syllabus-item[data-custom="true"]');
    customItems.forEach(item => item.remove());

    // Add custom items
    customSyllabusItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'syllabus-item';
        itemDiv.setAttribute('data-exam', item.exam);
        itemDiv.setAttribute('data-custom', 'true');

        const topicsHtml = item.topics.map(topic => {
            const isCompleted = item.completedTopics.includes(topic);
            return `<span class="topic-tag ${isCompleted ? 'completed' : ''}" data-topic="${topic}">${isCompleted ? '✓ ' : ''}${topic}</span>`;
        }).join('');

        itemDiv.innerHTML = `
            <div class="syllabus-header">
                <h3>${item.subject}</h3>
                <span class="progress-bar"><span class="progress" style="width: ${item.progress}%"></span></span>
                <span class="progress-text">${item.progress}%</span>
                <button class="delete-syllabus-btn" data-id="${item.id}" title="Delete syllabus">🗑️</button>
            </div>
            <div class="topics">
                ${topicsHtml}
            </div>
        `;

        syllabusList.appendChild(itemDiv);

        // Add event listeners for topic completion
        const topicTags = itemDiv.querySelectorAll('.topic-tag');
        topicTags.forEach(tag => {
            tag.addEventListener('click', () => {
                toggleTopicCompletion(item.id, tag.getAttribute('data-topic'));
            });
        });

        // Add event listener for delete button
        const deleteBtn = itemDiv.querySelector('.delete-syllabus-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSyllabusItem(item.id);
        });
    });

    // Re-initialize filtering for new items
    updateSyllabusFilter();
}

function toggleTopicCompletion(itemId, topic) {
    const item = customSyllabusItems.find(item => item.id === itemId);
    if (!item) return;

    const topicIndex = item.completedTopics.indexOf(topic);
    if (topicIndex > -1) {
        item.completedTopics.splice(topicIndex, 1);
    } else {
        item.completedTopics.push(topic);
    }

    // Update progress
    item.progress = Math.round((item.completedTopics.length / item.topics.length) * 100);

    saveSyllabusItems();
    renderSyllabusItems();
}

function deleteSyllabusItem(itemId) {
    if (confirm('Are you sure you want to delete this syllabus?')) {
        customSyllabusItems = customSyllabusItems.filter(item => item.id !== itemId);
        saveSyllabusItems();
        renderSyllabusItems();
        showNotification('Syllabus deleted successfully!', 'success');
    }
}

function saveSyllabusItems() {
    localStorage.setItem('examInsightSyllabus', JSON.stringify(customSyllabusItems));
}

function loadSyllabusItems() {
    const saved = localStorage.getItem('examInsightSyllabus');
    if (saved) {
        customSyllabusItems = JSON.parse(saved);
        renderSyllabusItems();
    }
}

function updateSyllabusFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const syllabusItems = document.querySelectorAll('.syllabus-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            const exam = btn.getAttribute('data-exam');
            syllabusItems.forEach(item => {
                if (exam === 'all' || item.getAttribute('data-exam') === exam) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Resource Filter & Search =====

// ===== Resource Management =====

let customResources = [];
let hiddenPredefinedResources = [];

function initializeResourceManagement() {
    const addBtn = document.getElementById('addResourceBtn');
    const modal = document.getElementById('addResourceModal');
    const closeBtn = document.querySelector('#addResourceModal .modal-close');
    const cancelBtn = document.getElementById('cancelAddResource');
    const form = document.getElementById('addResourceForm');

    // Load saved resources
    loadCustomResources();
    loadHiddenPredefinedResources();

    // Initialize predefined resource delete handlers
    initializePredefinedResourceHandlers();

    // Event listeners
    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addCustomResource();
        modal.style.display = 'none';
        form.reset();
    });
}

function initializePredefinedResourceHandlers() {
    // Add delete event listeners to predefined resources
    const deleteButtons = document.querySelectorAll('.delete-resource-btn[data-resource-id]');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const resourceId = btn.getAttribute('data-resource-id');
            deletePredefinedResource(resourceId);
        });
    });

    // Hide already deleted predefined resources
    updatePredefinedResourceVisibility();
}

function deletePredefinedResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        if (!hiddenPredefinedResources.includes(resourceId)) {
            hiddenPredefinedResources.push(resourceId);
            saveHiddenPredefinedResources();
            updatePredefinedResourceVisibility();
            showNotification('Resource deleted successfully!', 'success');
        }
    }
}

function updatePredefinedResourceVisibility() {
    const predefinedResources = document.querySelectorAll('.resource-card[data-predefined]');

    predefinedResources.forEach(resource => {
        const resourceId = resource.getAttribute('data-predefined');
        if (hiddenPredefinedResources.includes(resourceId)) {
            resource.style.display = 'none';
        } else {
            resource.style.display = 'block';
        }
    });
}

function saveHiddenPredefinedResources() {
    localStorage.setItem('examInsightHiddenResources', JSON.stringify(hiddenPredefinedResources));
}

function loadHiddenPredefinedResources() {
    const saved = localStorage.getItem('examInsightHiddenResources');
    if (saved) {
        hiddenPredefinedResources = JSON.parse(saved);
    }
}

function addCustomResource() {
    const type = document.getElementById('resourceTypeSelect').value;
    const title = document.getElementById('resourceTitle').value.trim();
    const description = document.getElementById('resourceDescription').value.trim();
    const difficulty = document.getElementById('resourceDifficulty').value;
    const meta = document.getElementById('resourceMeta').value.trim();
    const url = document.getElementById('resourceUrl').value.trim();

    if (!type || !title || !description) {
        alert('Please fill in all required fields');
        return;
    }

    const newResource = {
        id: Date.now(),
        type: type,
        title: title,
        description: description,
        difficulty: difficulty,
        meta: meta || getDefaultMeta(type),
        url: url
    };

    customResources.push(newResource);
    saveCustomResources();
    renderCustomResources();

    showNotification('Resource added successfully!', 'success');
}

function getDefaultMeta(type) {
    const defaults = {
        'video': '🎥 Video',
        'notes': '📄 Notes',
        'pdf': '📕 PDF',
        'article': '📰 Article'
    };
    return defaults[type] || '📚 Resource';
}

function renderCustomResources() {
    const resourcesGrid = document.querySelector('.resources-grid');

    // Remove existing custom resources
    const customCards = resourcesGrid.querySelectorAll('.resource-card.custom');
    customCards.forEach(card => card.remove());

    // Add custom resources
    customResources.forEach(resource => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'resource-card custom';
        cardDiv.setAttribute('data-type', resource.type);

        const buttonText = getButtonText(resource.type);
        const typeBadgeClass = resource.type === 'video' ? 'video' :
                              resource.type === 'pdf' ? 'pdf' :
                              resource.type === 'article' ? 'article' : '';

        cardDiv.innerHTML = `
            <div class="resource-header">
                <span class="resource-type-badge ${typeBadgeClass}">${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                <span class="resource-difficulty">${resource.difficulty}</span>
            </div>
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="resource-meta">
                <span>${resource.meta}</span>
                <span>⭐ New</span>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm" onclick="handleResourceAction('${resource.url}', '${resource.type}')">${buttonText}</button>
                <button class="delete-resource-btn" data-id="${resource.id}" title="Delete resource">🗑️</button>
            </div>
        `;

        resourcesGrid.appendChild(cardDiv);

        // Add delete event listener
        const deleteBtn = cardDiv.querySelector('.delete-resource-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomResource(resource.id);
        });
    });
}

function getButtonText(type) {
    const buttons = {
        'video': 'Watch',
        'notes': 'Download',
        'pdf': 'Download',
        'article': 'Read'
    };
    return buttons[type] || 'View';
}

function handleResourceAction(url, type) {
    if (url) {
        window.open(url, '_blank');
    } else {
        alert(`This ${type} resource doesn't have a URL yet. You can add one when editing.`);
    }
}

function deleteCustomResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        customResources = customResources.filter(resource => resource.id !== resourceId);
        saveCustomResources();
        renderCustomResources();
        showNotification('Resource deleted successfully!', 'success');
    }
}

function saveCustomResources() {
    localStorage.setItem('examInsightCustomResources', JSON.stringify(customResources));
}

function loadCustomResources() {
    const saved = localStorage.getItem('examInsightCustomResources');
    if (saved) {
        customResources = JSON.parse(saved);
        renderCustomResources();
    }
}

function initializeResourceFilter() {
    const searchInput = document.getElementById('resourceSearch');
    const typeFilter = document.getElementById('resourceType');

    function filterResources() {
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const resources = document.querySelectorAll('.resource-card');

        resources.forEach(resource => {
            const title = resource.querySelector('h3').textContent.toLowerCase();
            const desc = resource.querySelector('p').textContent.toLowerCase();
            const resourceType = resource.getAttribute('data-type');

            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesType = type === 'all' || resourceType === type;

            resource.style.display = (matchesSearch && matchesType) ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', filterResources);
    typeFilter.addEventListener('change', filterResources);
}

// ===== Calendar Functionality =====

let calendarEvents = [];

function loadCalendarEvents() {
    const saved = localStorage.getItem('examInsightCalendarEvents');
    if (saved) {
        calendarEvents = JSON.parse(saved);
    } else {
        // start with empty calendar (no predefined events)
        calendarEvents = [];
        saveCalendarEvents();
    }
}

function saveCalendarEvents() {
    localStorage.setItem('examInsightCalendarEvents', JSON.stringify(calendarEvents));
}

function initializeCalendar() {
    loadCalendarEvents();
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    prevBtn.addEventListener('click', () => {
        currentMonth--;
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        renderCalendar();
    });

    renderCalendar();
    renderUpcomingExams();
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        // Highlight today
        const today = new Date();
        if (today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
            dayDiv.classList.add('today');
        }

        // Check for events on this date
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = calendarEvents.filter(event => event.date === dateStr);
        
        if (dayEvents.length > 0) {
            dayDiv.classList.add('event');
            dayDiv.title = dayEvents.map(e => e.title).join(', ');
        }

        // Add click handler to add/edit events
        dayDiv.addEventListener('click', () => openEventModal(dateStr, dayEvents));

        calendarDays.appendChild(dayDiv);
    }
}

function renderUpcomingExams() {
    const upcomingList = document.getElementById('upcomingList');
    upcomingList.innerHTML = '';

    const today = new Date();
    const upcomingEvents = calendarEvents
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // Show next 5 events

    if (upcomingEvents.length === 0) {
        upcomingList.innerHTML = '<p>No upcoming exams scheduled</p>';
        return;
    }

    upcomingEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'exam-event';
        eventDiv.innerHTML = `
            <div class="event-date">${formatDate(event.date)}</div>
            <div class="event-info">
                <h5>${event.title}</h5>
                <p>${event.description}</p>
                <div class="event-actions">
                    <button class="edit-event-btn" data-id="${event.id}">Edit</button>
                    <button class="delete-event-btn" data-id="${event.id}">Delete</button>
                </div>
            </div>
        `;
        upcomingList.appendChild(eventDiv);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.getAttribute('data-id'));
            const event = calendarEvents.find(e => e.id === eventId);
            if (event) openEventModal(event.date, [event], true);
        });
    });

    document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.getAttribute('data-id'));
            deleteCalendarEvent(eventId);
        });
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

function openEventModal(dateStr, existingEvents = [], isEdit = false) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const title = document.getElementById('modalTitle');
    const titleInput = document.getElementById('eventTitle');
    const descInput = document.getElementById('eventDescription');
    const typeInput = document.getElementById('eventType');
    const dateInput = document.getElementById('eventDate');

    // Set date
    dateInput.value = dateStr;

    // Reset type selector
    document.querySelectorAll('.type-option').forEach(option => {
        option.classList.remove('selected');
    });

    if (isEdit && existingEvents.length > 0) {
        const event = existingEvents[0];
        title.textContent = 'Edit Event';
        titleInput.value = event.title;
        descInput.value = event.description;
        typeInput.value = event.type;

        // Select the appropriate type option
        const selectedOption = document.querySelector(`.type-option[data-value="${event.type}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        form.setAttribute('data-edit-id', event.id);
    } else {
        title.textContent = 'Add New Event';
        form.reset();
        form.removeAttribute('data-edit-id');

        // Default to exam type
        const defaultOption = document.querySelector('.type-option[data-value="exam"]');
        if (defaultOption) {
            defaultOption.classList.add('selected');
            typeInput.value = 'exam';
        }
    }

    modal.style.display = 'flex';

    // Focus on title input
    setTimeout(() => titleInput.focus(), 100);
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
    document.getElementById('eventForm').reset();
}

function saveCalendarEvent(event) {
    event.preventDefault();

    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const type = document.getElementById('eventType').value;
    const date = document.getElementById('eventDate').value;
    const editId = document.getElementById('eventForm').getAttribute('data-edit-id');

    if (!title || !date) {
        alert('Please fill in the title and date');
        return;
    }

    if (editId) {
        // Edit existing event
        const eventIndex = calendarEvents.findIndex(e => e.id == editId);
        if (eventIndex !== -1) {
            calendarEvents[eventIndex] = {
                ...calendarEvents[eventIndex],
                title,
                description,
                type,
                date
            };
        }
    } else {
        // Add new event
        const newEvent = {
            id: Date.now(),
            title,
            description,
            type,
            date
        };
        calendarEvents.push(newEvent);
    }

    saveCalendarEvents();
    renderCalendar();
    renderUpcomingExams();
    closeEventModal();
    showNotification(editId ? 'Event updated successfully!' : 'Event added successfully!', 'success');
}

function deleteCalendarEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        calendarEvents = calendarEvents.filter(event => event.id !== eventId);
        saveCalendarEvents();
        renderCalendar();
        renderUpcomingExams();
        showNotification('Event deleted successfully!', 'success');
    }
}

// ===== Dashboard Animations =====

function animateDashboardOnScroll() {
    const statCards = document.querySelectorAll('.stat-card');
    const goalBars = document.querySelectorAll('.goal-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    statCards.forEach(card => observer.observe(card));
    goalBars.forEach(bar => observer.observe(bar));
}

// ===== Hamburger Menu for Mobile =====

function initializeHamburgerMenu() {
    // Check if screen is mobile
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu on link click
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    initializeHamburgerMenu();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.startsWith('#')) {
            e.preventDefault();
        }
    });
});

// Initialize on load
console.log('ExamInsight Portal loaded successfully!');