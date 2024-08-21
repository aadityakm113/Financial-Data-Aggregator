// LineChart.jsx
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const LineChart = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/financial-data/customers-by-age-gender');
        drawLineChart(response.data);
      } catch (error) {
        console.error('Error fetching customers by age and gender data:', error);
      }
    };

    fetchData();
  }, []);

  const drawLineChart = (data) => {
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select('#line-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().range([0, width]).padding(0.5);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
      .x(d => x(d.gender))
      .y(d => y(d.count));

    const ageGroups = Array.from(new Set(data.map(d => d._id)));
    x.domain(ageGroups);
    y.domain([0, d3.max(data.flatMap(d => d.genders.map(g => g.count)))]);

    svg.selectAll('.line')
      .data(data)
      .enter().append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.genders))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue');

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  };

  return <svg id="line-chart"></svg>;
};

export default LineChart;
