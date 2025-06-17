/**
 * Strategic Transformation Tracker
 * Main Application JavaScript File
 */

// Global app configuration
const appConfig = {
    version: '1.0.0',
    storageKey: 'strategic-transformation-data',
    defaultAssessment: {
        completed: false,
        date: null,
        scores: {},
        overallScore: 0
    }
};

// Global application state
let appState = {
    currentView: 'dashboard',
    userData: null,
    assessmentCompleted: false,
    caseStudies: [],
    industryBenchmarks: {}
};

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Strategic Transformation Tracker...');
    
    // Load user data from local storage
    loadUserData();
    
    // Initialize navigation
    updateActiveView(getInitialView());
    
    // Load mock case studies data
    loadCaseStudies();
    
    // Load industry benchmark data
    loadBenchmarkData();
    
    console.log('Application initialized successfully.');
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetView = this.getAttribute('href').substring(1);
            updateActiveView(targetView);
        });
    });
    
    // Start assessment button
    document.getElementById('start-assessment-btn').addEventListener('click', function() {
        updateActiveView('assessment');
    });
    
    // View dashboard button (after assessment)
    document.getElementById('view-dashboard-btn').addEventListener('click', function() {
        updateActiveView('dashboard');
    });
}

/**
 * Determine the initial view to show
 */
function getInitialView() {
    // If assessment has never been completed, suggest starting there
    if (!appState.userData || !appState.userData.assessment || !appState.userData.assessment.completed) {
        // But still start at dashboard
        return 'dashboard';
    }
    
    return 'dashboard';
}

/**
 * Update the active view
 */
function updateActiveView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === `#${viewName}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Hide all views
    document.querySelectorAll('#dashboard, #assessment, #roi-calculator, #case-studies').forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show the selected view
    const targetElement = document.getElementById(viewName);
    if (targetElement) {
        targetElement.classList.remove('d-none');
        appState.currentView = viewName;
        
        // Trigger view-specific initialization if needed
        switch(viewName) {
            case 'dashboard':
                initializeDashboard();
                break;
            case 'assessment':
                initializeAssessment();
                break;
            case 'roi-calculator':
                initializeRoiCalculator();
                break;
            case 'case-studies':
                initializeCaseStudies();
                break;
        }
    }
}

/**
 * Load user data from local storage
 */
function loadUserData() {
    const storedData = localStorage.getItem(appConfig.storageKey);
    
    if (storedData) {
        try {
            appState.userData = JSON.parse(storedData);
            appState.assessmentCompleted = appState.userData.assessment && appState.userData.assessment.completed;
            console.log('User data loaded successfully.');
        } catch (e) {
            console.error('Error parsing stored user data:', e);
            appState.userData = createDefaultUserData();
        }
    } else {
        appState.userData = createDefaultUserData();
    }
}

/**
 * Save user data to local storage
 */
function saveUserData() {
    try {
        localStorage.setItem(appConfig.storageKey, JSON.stringify(appState.userData));
        console.log('User data saved successfully.');
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

/**
 * Create default user data structure
 */
function createDefaultUserData() {
    return {
        assessment: {...appConfig.defaultAssessment},
        dashboardData: {
            lastUpdated: null,
            transformationScores: {
                strategy: 0,
                technology: 0,
                ecosystem: 0,
                organization: 0,
                monetization: 0
            },
            milestones: []
        },
        roiCalculator: {
            savedCalculations: []
        },
        favorites: {
            caseStudies: []
        }
    };
}

/**
 * Load case studies data
 * In a real app, this would be fetched from a server
 */
function loadCaseStudies() {
    // Mock case studies data
    appState.caseStudies = [
        {
            id: 'cs1',
            title: 'Tech Leader's Strategic Platform Evolution',
            summary: 'How a technology company transitioned from product-focused to platform-driven strategy over 3 years.',
            industry: 'technology',
            challenges: ['ecosystem', 'technical'],
            impact: 'high',
            date: '2024-12-10'
        },
        {
            id: 'cs2',
            title: 'Retail Giant's Digital Platform Transition',
            summary: 'How a traditional retailer built a digital marketplace platform to compete with e-commerce leaders.',
            industry: 'retail',
            challenges: ['monetization', 'organizational'],
            impact: 'high',
            date: '2025-01-15'
        },
        {
            id: 'cs3',
            title: 'Healthcare Provider's Patient Ecosystem Platform',
            summary: 'How a healthcare system created an integrated patient services platform across multiple care domains.',
            industry: 'healthcare',
            challenges: ['ecosystem', 'technical'],
            impact: 'medium',
            date: '2025-03-20'
        }
    ];
}

/**
 * Load industry benchmark data
 * In a real app, this would be fetched from a server
 */
function loadBenchmarkData() {
    appState.industryBenchmarks = {
        technology: {
            strategy: 7.8,
            technology: 8.2,
            ecosystem: 7.5,
            organization: 7.0,
            monetization: 7.3
        },
        retail: {
            strategy: 6.5,
            technology: 6.2,
            ecosystem: 6.8,
            organization: 5.9,
            monetization: 6.7
        },
        financial: {
            strategy: 7.2,
            technology: 6.8,
            ecosystem: 6.5,
            organization: 6.3,
            monetization: 7.4
        },
        healthcare: {
            strategy: 6.0,
            technology: 5.8,
            ecosystem: 5.5,
            organization: 5.7,
            monetization: 5.3
        },
        manufacturing: {
            strategy: 5.8,
            technology: 5.5,
            ecosystem: 5.0,
            organization: 5.2,
            monetization: 5.6
        },
        average: {
            strategy: 6.7,
            technology: 6.5,
            ecosystem: 6.3,
            organization: 6.0,
            monetization: 6.5
        }
    };
}

/**
 * Format a date for display
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Helper function to generate a random ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Show a toast notification
 */
function showNotification(message, type = 'success') {
    // Implementation would depend on your preferred notification system
    // This is a simple example using alert
    alert(message);
}