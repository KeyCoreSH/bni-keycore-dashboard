document.addEventListener('DOMContentLoaded', () => {
  const membersList = document.getElementById('members-list');

  async function fetchMembers() {
    try {
      const response = await fetch('/api/members'); // Atualize para o endpoint real.
      const members = await response.json();

      members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.innerHTML = `
          <h3>${member.name}</h3>
          <p>${member.cadeira}</p>
          <p>${member.vertical}</p>
        `;
        membersList.appendChild(memberCard);
      });
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    }
  }

  fetchMembers();
});