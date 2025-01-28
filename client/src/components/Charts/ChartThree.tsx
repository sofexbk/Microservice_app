import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartThreeProps {
  series: number[];
  labels: string[];
  title: string; // New prop for dynamic title
}

const ChartThree: React.FC<ChartThreeProps> = ({ series, labels, title }) => {
  // Define a larger array of colors for the chart
  const colorPalette = [
    '#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#FF6F61', '#6B5B95',
    '#88B04B', '#F7CAC9', '#92A8D1', '#F5B7B1', '#D5AAFF', '#B9FBC0',
    '#B8B2F1', '#F9D8F4'
  ];

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: colorPalette, // Use the larger color palette
    labels,
    legend: {
      show: true, // Display the legend
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: true, // Show data labels
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  // Ensure series and labels are not empty
  if (series.length === 0 || labels.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title} {/* Dynamic title */}
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={350} // Adjust height as needed
          />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
