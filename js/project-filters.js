document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.career-card[data-category]');
    const count = document.getElementById('project-count');
    buttons.forEach(button => button.addEventListener('click', () => {
        let visible = 0;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        cards.forEach(card => {
            card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter;
            if (!card.hidden) visible++;
        });
        count.textContent = `${visible} project${visible === 1 ? '' : 's'}`;
    }));
});
