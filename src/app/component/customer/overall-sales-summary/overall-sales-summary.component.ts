import { Component, inject, OnInit, signal, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from "uuid";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import SalesSummary from '../../../types/salesSummaryData';

interface Summary {
  data: SalesSummary;
  id: string;
  expanded: boolean;
}

@Component({
  selector: 'app-overall-sales-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './overall-sales-summary.component.html',
  styleUrl: './overall-sales-summary.component.css'
})
export class OverallSalesSummaryComponent implements OnInit {
  http = inject(HttpClient);
  data = signal<Summary[]>([]);
  filteredData = signal<Summary[]>([]);
  secondaryColor = "#0075ff";
  customerId = '';
  totalOrders = 0;
  totalRevenue = 0;
  avgOrderValue = 0;
  primaryCurrency = '';
  colorLengths = 0;
  timeFilter = 'all';
  
  // Chart instances
  revenueChart: echarts.ECharts | null = null;
  productChart: echarts.ECharts | null = null;
  channelChart: echarts.ECharts | null = null;

  constructor() {
    afterNextRender(() => {
      this.initCharts();
    });
  }

  ngOnInit(): void {
    this.customerId = localStorage.getItem("customer-id") ?? '';
    this.fetchSalesData();
  }

  fetchSalesData(): void {
    try {
      this.http.post<{ data: SalesSummary[]}>('http://localhost:3000/customer/sales-summary', {
        id: this.customerId
      }).subscribe({
        next: (response) => {
          const updatedData: Summary[] = response.data.map(item => ({
            id: uuid(),
            data: item,
            expanded: false,
          }));
          this.data.set(updatedData);
          this.filteredData.set(updatedData);
          this.calculateSummaryMetrics(updatedData);
          this.updateCharts(updatedData);
        },
        error: (err) => {
          console.error("Fetch failed", err);
        }
      });
    } catch (err: any) {
      console.log(err);
    }
  }

  calculateSummaryMetrics(data: Summary[]): void {
    this.totalOrders = data.length;
    
    const numericValues = data.map(item => parseFloat(item.data.Netwr));
    this.totalRevenue = numericValues.reduce((sum, val) => sum + val, 0);
    this.avgOrderValue = this.totalRevenue / (this.totalOrders || 1);
    
    if (data.length > 0) {
      this.primaryCurrency = data[0].data.Waerk;
    }
  }

  getRandomColor(): string {
  const colors = [
  '#309898',  // Teal - complements blue well
  '#6366f1',  // Soft indigo - matches blue theme
  '#94a3b8',  // Cool gray - neutral accent
  '#FF9F00',  // Vibrant orange - for contrast
  '#F4631E',  // Burnt orange - warm contrast
  '#7C4585',  // Muted purple - harmonious
  '#C95792',  // Soft pink - for variety
  '#732255',  // Deep magenta - rich accent
  '#E55050',  // Coral red - for attention
  '#CB0404'   // Pure red - for emphasis
];
  let index = this.colorLengths;
  this.colorLengths += 1;
  return colors[index % colors.length];
}

  initCharts(): void {
    this.revenueChart = echarts.init(document.getElementById('revenueChart'));
    this.productChart = echarts.init(document.getElementById('productChart'));
    this.channelChart = echarts.init(document.getElementById('channelChart'));
    
    window.addEventListener('resize', () => {
      this.revenueChart?.resize();
      this.productChart?.resize();
      this.channelChart?.resize();
    });
  }

  updateCharts(data: Summary[]): void {
    if (!data.length) return;
    
    // Process data for charts
    const dateMap = new Map<string, number>();
    const productMap = new Map<string, number>();
    const channelMap = new Map<string, number>();
    
    data.forEach(item => {
      const date = new Date(item.data.Audat).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const product = item.data.Arktx || 'Unknown Product';
      const channel = item.data.Vtweg || 'Unknown Channel';
      const value = parseFloat(item.data.Netwr);
      
      dateMap.set(date, (dateMap.get(date) || 0) + value);
      productMap.set(product, (productMap.get(product) || 0) + value);
      channelMap.set(channel, (channelMap.get(channel) || 0) + value);
    });
    
    // Revenue Trend Chart
    const revenueOption = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>{a}: {c}' + (this.primaryCurrency ? ' ' + this.primaryCurrency : '')
      },
      xAxis: {
        type: 'category',
        data: Array.from(dateMap.keys()),
        axisLabel: {
          color: '#a3b3d8'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#a3b3d8',
          formatter: '{value}' + (this.primaryCurrency ? ' ' + this.primaryCurrency : '')
        }
      },
      series: [{
        data: Array.from(dateMap.values()),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#2563eb'
        },
        itemStyle: {
          color: '#2563eb'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.8)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.1)' }
          ])
        }
      }],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
    
    // Product Sales Chart
    const productOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ' + (this.primaryCurrency ? this.primaryCurrency + ' ' : '') + '({d}%)'
      },
      legend: {
        show: false,
        textStyle: {
          color: 'white',
          fontSize: 12
        },
        type: 'scroll',  
        itemWidth: 10,   // Enable scrolling
        scrollDataIndex: 0, // Initial scroll position
        pageButtonItemGap: 5, // Gap between page buttons
        pageButtonGap: 10,    // Gap between buttons and legend
        pageButtonPosition: 'end', // 'start' | 'end'
        pageIconColor: '#6366f1',      // Arrow color
        pageIconInactiveColor: '#94a3b8', // Inactive arrow color
        pageIconSize: 15,              // Arrow size (px)
        pageTextStyle: {
          color: '#a3b3d8',            // Page text color
          fontSize: 12,
          fontWeight: 'normal',
          fontFamily: 'sans-serif'
        }
      },
      series: [{
        name: 'Sales by Product',
        type: 'pie',
        radius: ['30%', '70%'], // Adjusted radius for better spacing
        center: ['40%', '50%'], // Move pie left to make space for legend
        avoidLabelOverlap: true, // Changed to true
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a192f',
          borderWidth: 2
        },
        label: {
          show: true, // Show labels on the chart
          position: 'outside', // Position labels outside the pie
          formatter: function(params: any) {
            // Show only name if percentage is significant
            return params.name;
            return params.percent > 5 ? params.name : '';
          },
          color: '#a3b3d8',
          fontSize: 12,
          fontWeight: 'normal'
        },
        labelLine: {
          show: true, // Show lines connecting labels to pie slices
          length: 10, // Length of first segment
          length2: 15, // Length of second segment
          smooth: true
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          scale: true,
          scaleSize: 5
        },
        data: Array.from(productMap.entries())
          .map(([name, value]) => ({
            // name: name.length > 15 ? name.substring(0, 12) + '...' : name, // Truncate long names
            name: name,
            value,
            // Add itemStyle for individual slices if needed
            itemStyle: {
              color: this.getRandomColor() // You can implement a color generator
            }
          }))
          .sort((a, b) => b.value - a.value) // Sort by value descending
      }],
      // Add responsive options
      responsive: true,
      media: [{
        query: {
          maxWidth: 600
        },
        option: {
          legend: {
            orient: 'horizontal',
            bottom: 0,
            right: 'center'
          },
          series: [{
            center: ['50%', '40%'],
            radius: ['30%', '60%']
          }]
        }
    }]
  };
    
    // Channel Sales Chart
    const channelOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#a3b3d8'
        }
      },
      yAxis: {
        type: 'category',
        data: Array.from(channelMap.keys()),
        axisLabel: {
          color: '#a3b3d8'
        }
      },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: Array.from(channelMap.values()),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1e3a8a' },
              { offset: 1, color: '#3b82f6' }
            ])
          }
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
    
    this.revenueChart?.setOption(revenueOption);
    this.productChart?.setOption(productOption);
    this.channelChart?.setOption(channelOption);
  }

  onExpand(summary: Summary): void {
    const updatedData = this.filteredData().map(item => {
      if (item.id === summary.id) {
        return {...item, expanded: !item.expanded};
      }
      return item;
    });
    this.filteredData.set(updatedData);
  }

  applyFilters(): void {
    let filtered = this.data();
    
    const now = new Date();
    if (this.timeFilter !== 'all') {
      let cutoffDate = new Date();
      
      switch (this.timeFilter) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data.Audat);
        return itemDate >= cutoffDate;
      });
    }
    
    this.filteredData.set(filtered);
    this.calculateSummaryMetrics(filtered);
    this.updateCharts(filtered);
  }
}