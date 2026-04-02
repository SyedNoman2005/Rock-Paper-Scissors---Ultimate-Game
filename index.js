(function(){
    const choices = ['rock','paper','scissors'];
    const buttons = Array.from(document.querySelectorAll('.choice-button'));
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const tiesEl = document.getElementById('ties');
    const userChoiceEl = document.getElementById('user-choice');
    const compChoiceEl = document.getElementById('computer-choice');
    const resultEl = document.getElementById('result');
    const resetBtn = document.getElementById('reset');

    let state = {wins:0, losses:0, ties:0};
    try{ const s = localStorage.getItem('rps-state'); if(s) state = JSON.parse(s); }catch(e){}
    
    const renderScores = ()=>{
        winsEl.textContent = state.wins;
        lossesEl.textContent = state.losses;
        tiesEl.textContent = state.ties;
    };
    renderScores();

    function randomChoice(){ return choices[Math.floor(Math.random()*choices.length)]; }
    function decide(u,c){ 
        if(u===c) return 'tie';
        if((u==='rock'&&c==='scissors') || (u==='paper'&&c==='rock') || (u==='scissors'&&c==='paper')) return 'win';
        return 'loss';
    }

    function play(user){
        const comp = randomChoice();
        const outcome = decide(user,comp);
        
        // Visual feedback - highlight the chosen button
        buttons.forEach(btn => btn.classList.remove('choice-btn-active', 'pulse-glow'));
        const selectedBtn = buttons.find(btn => btn.dataset.choice === user);
        if(selectedBtn) {
            selectedBtn.classList.add('choice-btn-active', 'pulse-glow');
        }

        // Display choices
        const choiceEmojis = {rock: '🪨', paper: '📄', scissors: '✂️'};
        userChoiceEl.textContent = choiceEmojis[user];
        compChoiceEl.textContent = choiceEmojis[comp];
        
        // Update result
        let resultText = '';
        let resultColor = '';
        if(outcome==='win'){ 
            state.wins++; 
            resultText='🎉 You Win!'; 
            resultColor='text-green-400';
        }
        else if(outcome==='loss'){ 
            state.losses++; 
            resultText='😢 You Lose'; 
            resultColor='text-red-400';
        }
        else { 
            state.ties++; 
            resultText='🤝 It\'s a Tie'; 
            resultColor='text-yellow-400';
        }
        
        resultEl.textContent = resultText;
        resultEl.className = `text-2xl font-bold ${resultColor} mb-2`;
        
        try{ localStorage.setItem('rps-state', JSON.stringify(state)); }catch(e){}
        renderScores();
    }

    buttons.forEach(btn => btn.addEventListener('click', () => play(btn.dataset.choice)));
    
    resetBtn.addEventListener('click', ()=>{ 
        state = {wins:0,losses:0,ties:0}; 
        try{ localStorage.removeItem('rps-state'); }catch(e){} 
        renderScores(); 
        userChoiceEl.textContent='—'; 
        compChoiceEl.textContent='—'; 
        resultEl.textContent='Result: —';
        resultEl.className='text-2xl font-bold text-blue-300 mb-2';
        buttons.forEach(btn => btn.classList.remove('choice-btn-active', 'pulse-glow'));
    });

    // Keyboard shortcuts: R, P, S
    window.addEventListener('keydown', (e)=>{
        if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
        const key = e.key.toLowerCase();
        if(key==='r' || key==='1') play('rock');
        if(key==='p' || key==='2') play('paper');
        if(key==='s' || key==='3') play('scissors');
    });
})();
