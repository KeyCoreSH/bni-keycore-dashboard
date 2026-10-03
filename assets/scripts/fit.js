document.getElementById('fit-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const input1 = document.getElementById('input1').value;
  const input2 = document.getElementById('input2').value;

  const result = `Fit calculado: ${(input1.length + input2.length) * Math.random().toFixed(2)}`;
  document.getElementById('result').innerText = result;
});