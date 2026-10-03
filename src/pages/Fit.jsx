import React from 'react';

const Fit = () => {
  const [result, setResult] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const input1 = e.target.input1.value;
    const input2 = e.target.input2.value;

    const fitScore = ((input1.length + input2.length) * Math.random()).toFixed(2);
    setResult(`Fit calculado: ${fitScore}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input1">Entrada 1:</label>
      <input type="text" id="input1" name="input1" required />

      <label htmlFor="input2">Entrada 2:</label>
      <input type="text" id="input2" name="input2" required />

      <button type="submit">Calcular</button>
      <div>{result}</div>
    </form>
  );
};

export default Fit;