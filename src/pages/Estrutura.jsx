import React from 'react';
import { SectionCard } from '../components/SectionCard';

const Estrutura = () => {
  return (
    <div className="estrutura">
      <h2>Estrutura do Grupo</h2>
      <div className="cards">
        <SectionCard 
          title="Organização Padrão" 
          description="A estrutura de um BNI envolve presidentes, secretários e tesoureiros ..." 
        />
        <SectionCard 
          title="Reuniões Semanais" 
          description="As reuniões fixam slots de apresentação e resultados semanais..." />
      </div>
    </div>
  );
};

export default Estrutura;