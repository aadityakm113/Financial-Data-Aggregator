// PieChart.jsx
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PieChart = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/financial-data/categories');
        drawPieChart(response.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchData();
  }, []);

  const drawPieChart = (data) => {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('#pie-chart')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data._id))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    svg.selectAll('text')
      .data(pie(data))
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data._id);
  };

  return <svg id="pie-chart"></svg>;
};

export default PieChart;
