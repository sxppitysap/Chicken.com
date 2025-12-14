

const checkbox = document.getElementById("MyCheckbox");
const jumpscareContainer = document.getElementById("jumpscareContainer");

function playScreamSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        
        const osc = audioContext.createOscillator();
        osc.type = 'sawtooth';

        const osc2 = audioContext.createOscillator();
        osc2.type = 'square';

        const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.0, audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = false;

        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0, now);

        const masterGain = audioContext.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.connect(audioContext.destination);

        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(1, now);

        osc.connect(filter);
        osc2.connect(filter);
        noise.connect(noiseGain);
        noiseGain.connect(filter);
        filter.connect(masterGain);

       
        const totalDuration = 3.0; 
        const attackPeak = 0.5; 
        const releaseEnd = totalDuration; 

        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(2500, now + attackPeak);
        osc.frequency.exponentialRampToValueAtTime(600, now + releaseEnd);

        osc2.frequency.setValueAtTime(200, now);
        osc2.frequency.exponentialRampToValueAtTime(1200, now + attackPeak);
        osc2.frequency.exponentialRampToValueAtTime(300, now + releaseEnd);

    
        masterGain.gain.linearRampToValueAtTime(1.0, now + 0.02);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseEnd);

       
        noiseGain.gain.setValueAtTime(0.6, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (totalDuration - 0.5));

        osc.start(now);
        osc2.start(now);
        noise.start(now);

       
        osc.stop(now + totalDuration);
        osc2.stop(now + totalDuration);
        noise.stop(now + totalDuration);
    } catch (e) {
        console.log('Audio error', e);
    }
}

checkbox.addEventListener("change", function() {
    if(this.checked) {
        playScreamSound();
        
        jumpscareContainer.classList.remove("jumpscare-hidden");
        jumpscareContainer.classList.add("jumpscare-show");
        
        setTimeout(() => {
            jumpscareContainer.classList.add("jumpscare-hidden");
            jumpscareContainer.classList.remove("jumpscare-show");
            checkbox.checked = false;
        }, 2000);
    }
});
