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
        
        // Log the full request details
        const requestDetails = {
            url: `${API_URL}/process`,
            videoUrl: videoUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        };
        console.log('Request details:', requestDetails);

        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            headers: requestDetails.headers,
            body: `video_url=${encodeURIComponent(videoUrl)}`,
            credentials: 'omit'
        });
        
        // Log response details
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.error('Raw response that failed to parse:', responseText);
            throw new Error(`Failed to parse server response: ${responseText}`);
        }

        if (!response.ok) {
            console.error('Server error details:', data);
            throw new Error(data.error || `Server error: ${response.status}. ${responseText}`);
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
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        resultDiv.innerHTML = `<div class="error">
            ${error.message || 'An unexpected error occurred. Please try again.'}
        </div>`;
    } finally {
        button.disabled = false;
        button.textContent = 'Extract Transcript';
    }
} 