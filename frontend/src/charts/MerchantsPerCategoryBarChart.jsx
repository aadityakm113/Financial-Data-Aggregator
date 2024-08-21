// MerchantsPerCategoryBarChart.jsx
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const MerchantsPerCategoryBarChart = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/financial-data/merchants-per-category');
        drawBarChart(response.data);
      } catch (error) {
        console.error('Error fetching merchants per category data:', error);
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

    const svg = d3.select('#merchants-per-category-bar-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d._id));
    y.domain([0, d3.max(data.flatMap(d => d.merchants.map(m => m.count)))]);

    svg.selectAll('.category')
      .data(data)
      .enter().append('g')
      .attr('class', 'category')
      .attr('transform', d => `translate(0, ${y(d.merchants.length)})`)
      .selectAll('rect')
      .data(d => d.merchants)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', m => x(m.merchant))
      .attr('y', m => y(m.count))
      .attr('width', x.bandwidth())
      .attr('height', m => height - y(m.count))
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  };

  return <svg id="merchants-per-category-bar-chart"></svg>;
};

export default MerchantsPerCategoryBarChart;
