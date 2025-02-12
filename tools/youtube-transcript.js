const API_URL = 'https://yt-transcript-412760520228.us-central1.run.app';

async function extractTranscript() {
    const videoUrl = document.getElementById('video-url').value;
    const resultDiv = document.getElementById('result');
    const button = document.getElementById('extract-button');
    
    if (!videoUrl) {
        resultDiv.innerHTML = '<div class="error">Please enter a YouTube URL</div>';
        return;
    }

    if (!videoUrl.includes('youtube.com/') && !videoUrl.includes('youtu.be/')) {
        resultDiv.innerHTML = '<div class="error">Please enter a valid YouTube URL</div>';
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Processing...';
        resultDiv.innerHTML = '<div class="loading">Analyzing video...<div class="loader"></div></div>';
        
        console.log('Sending request:', {
            url: `${API_URL}/process`,
            videoUrl: videoUrl
        });

        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Origin': 'https://pidfun.com'
            },
            body: `video_url=${encodeURIComponent(videoUrl)}`
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            throw new Error('Invalid response format from server');
        }

        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        let downloadHtml = '<div class="results-container">';
        if (data.transcript_file) {
            downloadHtml += `
                <a href="${API_URL}/download/${data.session_id}/transcript.txt" 
                   class="download-button" target="_blank">
                   <span class="icon">📄</span>
                   Download Transcript
                </a>`;
        }
        if (data.analysis_file) {
            downloadHtml += `
                <a href="${API_URL}/download/${data.session_id}/analysis.txt" 
                   class="download-button" target="_blank">
                   <span class="icon">📊</span>
                   Download Analysis
                </a>`;
        }
        downloadHtml += '</div>';
        
        resultDiv.innerHTML = downloadHtml;
    } catch (error) {
        console.error('Error details:', error);
        resultDiv.innerHTML = `<div class="error">
            ${error.message || 'An unexpected error occurred. Please try again.'}
        </div>`;
    } finally {
        button.disabled = false;
        button.textContent = 'Extract Transcript';
    }
} 