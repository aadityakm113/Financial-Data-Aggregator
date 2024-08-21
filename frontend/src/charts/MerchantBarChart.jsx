// MerchantBarChart.jsx
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const MerchantBarChart = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/financial-data/merchants');
        drawBarChart(response.data);
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      }
    };

    fetchData();
  }, []);

  const drawBarChart = (data) => {
    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3.select('#merchant-bar-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d._id));
    y.domain([0, d3.max(data, d => d.count)]);

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d._id))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  };

  return <svg id="merchant-bar-chart"></svg>;
};

export default MerchantBarChart;
