/**
 * Strategic Transformation Tracker
 * Assessment Module
 */

// Assessment state
let assessmentState = {
    currentStep: 1,
    totalSteps: 3,
    scores: {
        strategy: {},
        technical: {},
        ecosystem: {}
    },
    results: null
};

/**
 * Initialize the assessment
 */
function initializeAssessment() {
    console.log('Initializing assessment module...');
    
    // Check if assessment has been completed previously
    if (appState.userData && appState.userData.assessment && appState.userData.assessment.completed) {
        showAssessmentResults(appState.userData.assessment);
    } else {
        resetAssessment();
    }
    
    // Set up assessment event listeners
    setupAssessmentEvents();
}

/**
 * Set up assessment-specific event listeners
 */
function setupAssessmentEvents() {
    // Next/Previous step buttons
    document.getElementById('step-1-next').addEventListener('click', () => moveToStep(2));
    document.getElementById('step-2-next').addEventListener('click', () => moveToStep(3));
    document.getElementById('step-2-prev').addEventListener('click', () => moveToStep(1));
    document.getElementById('step-3-prev').addEventListener('click', () => moveToStep(2));
    
    // Submit assessment button
    document.getElementById('assessment-submit').addEventListener('click', submitAssessment);
}

/**
 * Move to a specific step in the assessment
 */
function moveToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.assessment-step').forEach(step => {
        step.classList.add('d-none');
    });
    
    // Show the target step
    document.getElementById(`assessment-step-${stepNumber}`).classList.remove('d-none');
    
    // Update progress bar
    const progressPercentage = ((stepNumber - 1) / assessmentState.totalSteps) * 100;
    const progressBar = document.getElementById('assessment-progress');
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
    
    // Update current step
    assessmentState.currentStep = stepNumber;
    
    // Save current values if moving forward
    if (stepNumber > 1) {
        saveCurrentStepValues(stepNumber - 1);
    }
}

/**
 * Save values from the current step
 */
function saveCurrentStepValues(stepNumber) {
    switch(stepNumber) {
        case 1: // Strategic Intent
            assessmentState.scores.strategy = {
                clarity: parseInt(document.getElementById('strategic-clarity').value),
                leadership: parseInt(document.getElementById('leadership-alignment').value),
                roadmap: parseInt(document.getElementById('roadmap-maturity').value)
            };
            break;
            
        case 2: // Technical Capabilities
            assessmentState.scores.technical = {
                architecture: parseInt(document.getElementById('architecture-readiness').value),
                scalability: parseInt(document.getElementById('scalability').value),
                data: parseInt(document.getElementById('data-capabilities').value)
            };
            break;
            
        case 3: // Ecosystem Readiness
            assessmentState.scores.ecosystem = {
                partners: parseInt(document.getElementById('partner-strategy').value),
                processes: parseInt(document.getElementById('partner-processes').value),
                value: parseInt(document.getElementById('value-proposition').value)
            };
            break;
    }
}

/**
 * Submit the assessment
 */
function submitAssessment() {
    // Save values from the last step
    saveCurrentStepValues(3);
    
    // Calculate results
    const results = calculateAssessmentResults();
    assessmentState.results = results;
    
    // Save to user data
    appState.userData.assessment = {
        completed: true,
        date: new Date().toISOString(),
        scores: assessmentState.scores,
        overallScore: results.overallScore,
        dimensionScores: results.dimensionScores,
        recommendations: results.recommendations
    };
    
    appState.assessmentCompleted = true;
    saveUserData();
    
    // Show results
    showAssessmentResults(appState.userData.assessment);
}

/**
 * Calculate assessment results
 */
function calculateAssessmentResults() {
    // Calculate dimension scores (average of each category)
    const strategyScore = calculateAverageScore(assessmentState.scores.strategy);
    const technicalScore = calculateAverageScore(assessmentState.scores.technical);
    const ecosystemScore = calculateAverageScore(assessmentState.scores.ecosystem);
    
    // Calculate overall score (weighted average of dimensions)
    const overallScore = ((strategyScore * 0.4) + (technicalScore * 0.35) + (ecosystemScore * 0.25)).toFixed(1);
    
    // Determine recommendations based on scores
    const recommendations = generateRecommendations(strategyScore, technicalScore, ecosystemScore);
    
    return {
        overallScore: parseFloat(overallScore),
        dimensionScores: {
            strategy: strategyScore,
            technical: technicalScore,
            ecosystem: ecosystemScore
        },
        recommendations: recommendations
    };
}

/**
 * Calculate the average score for a dimension
 */
function calculateAverageScore(scoreObject) {
    const values = Object.values(scoreObject);
    const sum = values.reduce((total, current) => total + current, 0);
    return parseFloat((sum / values.length).toFixed(1));
}

/**
 * Generate recommendations based on scores
 */
function generateRecommendations(strategyScore, technicalScore, ecosystemScore) {
    const recommendations = [];
    
    // Strategy recommendations
    if (strategyScore < 4) {
        recommendations.push({
            category: 'strategy',
            text: 'Develop a clear platform vision and strategy with executive alignment',
            priority: 'high'
        });
    } else if (strategyScore < 7) {
        recommendations.push({
            category: 'strategy',
            text: 'Refine your platform strategy and ensure comprehensive roadmap development',
            priority: 'medium'
        });
    } else {
        recommendations.push({
            category: 'strategy',
            text: 'Focus on measuring and optimizing platform strategy outcomes',
            priority: 'low'
        });
    }
    
    // Technical recommendations
    if (technicalScore < 4) {
        recommendations.push({
            category: 'technical',
            text: 'Invest in modernizing core architecture for API-readiness and modularity',
            priority: 'high'
        });
    } else if (technicalScore < 7) {
        recommendations.push({
            category: 'technical',
            text: 'Enhance technical capabilities with focus on scalability and developer experience',
            priority: 'medium'
        });
    } else {
        recommendations.push({
            category: 'technical',
            text: 'Optimize platform performance metrics and advanced analytics capabilities',
            priority: 'low'
        });
    }
    
    // Ecosystem recommendations
    if (ecosystemScore < 4) {
        recommendations.push({
            category: 'ecosystem',
            text: 'Define partner strategy and develop initial ecosystem onboarding processes',
            priority: 'high'
        });
    } else if (ecosystemScore < 7) {
        recommendations.push({
            category: 'ecosystem',
            text: 'Expand partner programs and enhance ecosystem value proposition',
            priority: 'medium'
        });
    } else {
        recommendations.push({
            category: 'ecosystem',
            text: 'Focus on ecosystem network effects and optimizing partner success metrics',
            priority: 'low'
        });
    }
    
    return recommendations;
}

/**
 * Show the assessment results
 */
function showAssessmentResults(assessmentData) {
    // Hide all steps
    document.querySelectorAll('.assessment-step').forEach(step => {
        step.classList.add('d-none');
    });
    
    // Show results section
    document.getElementById('assessment-results').classList.remove('d-none');
    
    // Update progress bar to 100%
    const progressBar = document.getElementById('assessment-progress');
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);
    progressBar.textContent = '100%';
    
    // Update overall score
    document.getElementById('overall-score').textContent = assessmentData.overallScore;
    
    // Set score description
    let scoreDescription = '';
    if (assessmentData.overallScore < 4) {
        scoreDescription = 'Early stage platform readiness. Focus on foundational elements.';
    } else if (assessmentData.overallScore < 7) {
        scoreDescription = 'Developing platform capabilities. Build on existing strengths.';
    } else if (assessmentData.overallScore < 9) {
        scoreDescription = 'Advanced platform readiness. Optimize for ecosystem growth.';
    } else {
        scoreDescription = 'Mature platform capabilities. Focus on innovation and leadership.';
    }
    document.getElementById('score-description').textContent = scoreDescription;
    
    // Create dimension chart
    createDimensionChart(assessmentData.dimensionScores);
    
    // Populate recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    assessmentData.recommendations.forEach(rec => {
        const priorityClass = rec.priority === 'high' ? 'text-danger' : 
                             (rec.priority === 'medium' ? 'text-warning' : 'text-success');
        
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge bg-${rec.category === 'strategy' ? 'primary' : 
                                           (rec.category === 'technical' ? 'info' : 'secondary')} me-2">
                        ${rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                    </span>
                    ${rec.text}
                </div>
                <span class="badge bg-light ${priorityClass}">${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority</span>
            </div>
        `;
        
        recommendationsList.appendChild(li);
    });
}

/**
 * Create the dimension chart for assessment results
 */
function createDimensionChart(dimensionScores) {
    const ctx = document.getElementById('dimension-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.dimensionChart) {
        window.dimensionChart.destroy();
    }
    
    // Create new chart
    window.dimensionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Strategy', 'Technical', 'Ecosystem'],
            datasets: [{
                label: 'Your Score',
                data: [dimensionScores.strategy, dimensionScores.technical, dimensionScores.ecosystem],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }, {
                label: 'Industry Average',
                data: [6.7, 6.5, 6.3],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0.1
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}

/**
 * Reset the assessment to initial state
 */
function resetAssessment() {
    // Reset state
    assessmentState = {
        currentStep: 1,
        totalSteps: 3,
        scores: {
            strategy: {},
            technical: {},
            ecosystem: {}
        },
        results: null
    };
    
    // Reset form elements
    document.querySelectorAll('.form-range').forEach(range => {
        range.value = 5; // Set default value
    });
    
    // Show first step
    document.querySelectorAll('.assessment-step').forEach(step => {
        step.classList.add('d-none');
    });
    document.getElementById('assessment-step-1').classList.remove('d-none');
    document.getElementById('assessment-results').classList.add('d-none');
    
    // Reset progress bar
    const progressBar = document.getElementById('assessment-progress');
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', 0);
    progressBar.textContent = '0%';
}