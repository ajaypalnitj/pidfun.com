const API_URL = 'https://yt-transcript-412760520228.us-central1.run.app';

async function extractTranscript() {
    const videoUrl = document.getElementById('video-url').value;
    const resultDiv = document.getElementById('result');
    const button = document.getElementById('extract-button');
    
    if (!videoUrl) {
        resultDiv.innerHTML = '<div class="error">Please enter a YouTube URL</div>';
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Processing...';
        resultDiv.innerHTML = '<div class="loading">Analyzing video...</div>';
        
        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `video_url=${encodeURIComponent(videoUrl)}`
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        let downloadHtml = '<div class="results-container">';
        if (data.transcript_file) {
            downloadHtml += `
                <a href="${API_URL}/download/${data.session_id}/transcript.txt" 
                   class="download-button">
                   <span class="icon">📄</span>
                   Download Transcript
                </a>`;
        }
        if (data.analysis_file) {
            downloadHtml += `
                <a href="${API_URL}/download/${data.session_id}/analysis.txt" 
                   class="download-button">
                   <span class="icon">📊</span>
                   Download Analysis
                </a>`;
        }
        downloadHtml += '</div>';
        
        resultDiv.innerHTML = downloadHtml;
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">${error.message}</div>`;
    } finally {
        button.disabled = false;
        button.textContent = 'Extract Transcript';
    }
} 