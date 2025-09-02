document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            document.body.classList.add('bg-gray-900');
            document.body.classList.remove('bg-gray-50');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            document.body.classList.remove('bg-gray-900');
            document.body.classList.add('bg-gray-50');
        }
    });

    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsSection = document.getElementById('resultsSection');
    const loadingState = document.getElementById('loadingState');
    
    analyzeBtn.addEventListener('click', async function() {
        const url = document.getElementById('articleUrl').value;
        const text = document.getElementById('articleText').value;
        const mindfulMode = document.getElementById('mindfulMode').checked;
        
        if (!url && !text) {
            alert('Please enter a URL or paste some text to analyze');
            return;
        }
        
        resultsSection.classList.add('hidden');
        loadingState.classList.remove('hidden');
        analyzeBtn.disabled = true;
        
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, text, mindful_mode: mindfulMode })
            });
            
            const data = await response.json();
            updateResults(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error analyzing content. Please try again.');
        } finally {
            loadingState.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            analyzeBtn.disabled = false;
        }
    });
    
    function updateResults(data) {
        document.getElementById('biasScore').textContent = data.bias_score + '%';
        document.querySelector('#biasScore').closest('div').querySelector('.bg-primary').style.width = data.bias_score + '%';
        
        document.getElementById('reliabilityScore').textContent = data.reliability_score + '%';
        document.querySelector('#reliabilityScore').closest('div').querySelector('.bg-success').style.width = data.reliability_score + '%';
        
        document.getElementById('emotionalTone').textContent = data.emotional_tone;
        const toneIcon = document.querySelector('#emotionalTone').closest('div').querySelector('i');
        if (data.emotional_tone === 'Positive') toneIcon.className = 'fas fa-smile text-warning text-xl';
        else if (data.emotional_tone === 'Negative') toneIcon.className = 'fas fa-frown text-warning text-xl';
        else toneIcon.className = 'fas fa-meh text-warning text-xl';
        
        document.getElementById('biasExplanation').textContent = data.bias_explanation;
        
        const perspectivesContainer = document.getElementById('perspectivesContainer');
        perspectivesContainer.innerHTML = '';
        data.perspectives.forEach(perspective => {
            const card = document.createElement('div');
            card.className = perspective-card ${perspective.bias.toLowerCase()} bg-white p-4 rounded-lg shadow-sm;
            card.innerHTML = `
                <div class="flex items-start mb-3">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <i class="fas fa-newspaper text-${perspective.bias === 'Left' ? 'blue' : perspective.bias === 'Right' ? 'red' : 'green'}-500"></i>
                    </div>
                    <div>
                        <h5 class="font-semibold text-gray-800">${perspective.source}</h5>
                        <span class="text-xs px-2 py-1 rounded-full ${perspective.bias === 'Left' ? 'bg-blue-100 text-blue-800' : perspective.bias === 'Right' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">${perspective.bias}</span>
                    </div>
                </div>
                <p class="text-gray-600 text-sm">${perspective.summary}</p>
            `;
            perspectivesContainer.appendChild(card);
        });
        
        const factCheckContainer = document.getElementById('factCheckResults');
        factCheckContainer.innerHTML = '';
        data.fact_checks.forEach(fact => {
            const factElement = document.createElement('div');
            factElement.className = 'flex items-start p-3 bg-gray-50 rounded-lg';
            factElement.innerHTML = `
                <div class="flex-shrink-0 w-5 h-5 rounded-full ${fact.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center justify-center mr-3 mt-1">
                    <i class="fas ${fact.verified ? 'fa-check' : 'fa-times'} text-xs"></i>
                </div>
                <div>
                    <p class="text-gray-800 font-medium">${fact.claim}</p>
                    <p class="text-gray-600 text-sm">${fact.explanation}</p>
                </div>
            `;
            factCheckContainer.appendChild(factElement);
        });
        
        if (data.mindful_mode && data.mindful_mode.enabled) {
            setTimeout(() => {
                alert('Mindful Mode: You\'ve been reading for a while. Consider taking a short break!');
            }, 3000);
        }
    }
    
    document.getElementById('shareResults').addEventListener('click', function() {
        alert('Share functionality would connect to social media APIs here');
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});