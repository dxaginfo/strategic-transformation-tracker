/**
 * Strategic Transformation Tracker
 * Dashboard Module
 */

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
    console.log('Initializing dashboard module...');
    
    // If assessment has been completed, show dashboard data
    if (appState.assessmentCompleted) {
        createDashboardCharts();
    } else {
        // Show placeholder/welcome message
        showDashboardPlaceholder();
    }
}

/**
 * Create the dashboard charts
 */
function createDashboardCharts() {
    createTransformationRadarChart();
    createBenchmarkBarChart();
    createTimelineChart();
}

/**
 * Create the transformation radar chart
 */
function createTransformationRadarChart() {
    const ctx = document.getElementById('transformation-radar-chart').getContext('2d');
    
    // Prepare data from assessment results
    let transformationData = [5, 5, 5, 5, 5]; // Default placeholder values
    
    if (appState.userData && appState.userData.assessment && appState.userData.assessment.completed) {
        // Map assessment scores to the radar chart dimensions
        // In a real app, this would be more sophisticated
        transformationData = [
            appState.userData.assessment.scores.strategy.clarity || 5, // Strategy
            appState.userData.assessment.scores.technical.architecture || 5, // Technology
            appState.userData.assessment.scores.ecosystem.partners || 5, // Ecosystem
            (appState.userData.assessment.scores.strategy.leadership || 5), // Organization
            (appState.userData.assessment.scores.technical.data || 5) // Monetization
        ];
    }
    
    // Destroy existing chart if it exists
    if (window.transformationRadarChart) {
        window.transformationRadarChart.destroy();
    }
    
    // Create new chart
    window.transformationRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Strategy', 'Technology', 'Ecosystem', 'Organization', 'Monetization'],
            datasets: [{
                label: 'Your Organization',
                data: transformationData,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
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
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Create the benchmark bar chart
 */
function createBenchmarkBarChart() {
    const ctx = document.getElementById('benchmark-bar-chart').getContext('2d');
    
    // Get user's overall score
    let userScore = 5; // Default placeholder
    
    if (appState.userData && appState.userData.assessment && appState.userData.assessment.completed) {
        userScore = appState.userData.assessment.overallScore;
    }
    
    // Get industry benchmarks (in a real app, these would be fetched)
    const industryScores = [
        appState.industryBenchmarks.technology.strategy, // Technology
        appState.industryBenchmarks.retail.strategy, // Retail
        appState.industryBenchmarks.financial.strategy, // Financial
        appState.industryBenchmarks.healthcare.strategy, // Healthcare
        appState.industryBenchmarks.manufacturing.strategy, // Manufacturing
        appState.industryBenchmarks.average.strategy // Industry Average
    ];
    
    // Destroy existing chart if it exists
    if (window.benchmarkBarChart) {
        window.benchmarkBarChart.destroy();
    }
    
    // Create new chart
    window.benchmarkBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Technology', 'Retail', 'Financial', 'Healthcare', 'Manufacturing', 'Industry Avg'],
            datasets: [{
                label: 'Industry Benchmarks',
                data: industryScores,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }, {
                label: 'Your Organization',
                data: [userScore, userScore, userScore, userScore, userScore, userScore],
                type: 'line',
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Platform Maturity Score'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Create the timeline chart
 */
function createTimelineChart() {
    const ctx = document.getElementById('timeline-chart').getContext('2d');
    
    // Generate sample timeline data
    // In a real app, this would be based on actual data
    const today = new Date();
    const labels = [];
    const platformData = [];
    
    // Create 12 monthly points
    for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - 11 + i);
        labels.push(date.toLocaleDateString('default', { month: 'short', year: 'numeric' }));
        
        // Generate some sample data for the chart
        if (i < 6) {
            // Past data (actual)
            platformData.push((i * 0.5) + 3);
        } else {
            // Future data (projected)
            platformData.push(null);
        }
    }
    
    // Add projection data
    const projectionData = new Array(12).fill(null);
    for (let i = 6; i < 12; i++) {
        projectionData[i] = ((i - 6) * 0.7) + 5.5;
    }
    // Connect the projection to the actual data
    projectionData[5] = platformData[5];
    
    // Destroy existing chart if it exists
    if (window.timelineChart) {
        window.timelineChart.destroy();
    }
    
    // Create new chart
    window.timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Platform Maturity',
                data: platformData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3
            }, {
                label: 'Projected Growth',
                data: projectionData,
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Platform Maturity Score'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: 5.5,
                            xMax: 5.5,
                            borderColor: 'rgba(255, 99, 132, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Today',
                                enabled: true,
                                position: 'top'
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Show dashboard placeholder for users who haven't completed assessment
 */
function showDashboardPlaceholder() {
    // This function would customize the dashboard to show appropriate placeholders
    // and prompts for users who haven't completed the assessment yet
    
    // For simplicity, we'll still show the charts with default data
    createDashboardCharts();
}