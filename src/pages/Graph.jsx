import React from 'react';
import * as d3 from 'd3';

const Graph = () => {
  const svgRef = React.useRef();

  React.useEffect(() => {
    const data = {
      nodes: [
        { id: "Membro 1" },
        { id: "Membro 2" },
        { id: "Membro 3" }
      ],
      links: [
        { source: "Membro 1", target: "Membro 2" },
        { source: "Membro 2", target: "Membro 3" }
      ]
    };

    const width = 800, height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link');

    const node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('class', 'node');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default Graph;