import React from 'react';

const Members = () => {
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    }

    fetchMembers();
  }, []);

  return (
    <div className="members-grid">
      {members.map(member => (
        <div key={member.id} className="member-card">
          <h3>{member.name}</h3>
          <p>{member.cadeira}</p>
          <p>{member.vertical}</p>
        </div>
      ))}
    </div>
  );
};

export default Members;