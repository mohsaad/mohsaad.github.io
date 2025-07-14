const { useState, useEffect, useMemo } = React;

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-03');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    Promise.all([
      fetch('./mock_data.json').then(response => response.json()),
      fetch('./scheduled.json').then(response => response.json())
    ])
      .then(([mockData, scheduledData]) => {
        setHealthData(mockData.healthData);
        setActivities(mockData.activities || []);
        setPlannedWorkouts(mockData.plannedWorkouts || []);
        setScheduledWorkouts(scheduledData.scheduledWorkouts || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const aggregatedData = useMemo(() => {
    if (!healthData.length) return [];

    const filteredData = healthData.filter(item => {
      const itemDate = new Date(item.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return itemDate >= start && itemDate <= end;
    });

    const groupBy = (data, interval) => {
      const groups = {};
      
      data.forEach(item => {
        const date = new Date(item.timestamp);
        let key;
        
        switch (interval) {
          case 'hourly':
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            break;
          case 'daily':
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            break;
          case 'weekly':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
            break;
          case 'monthly':
            key = `${date.getFullYear()}-${date.getMonth()}`;
            break;
          case 'yearly':
            key = `${date.getFullYear()}`;
            break;
          default:
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }
        
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
      });

      return Object.entries(groups).map(([key, items]) => {
        const avgHeartRate = items.reduce((sum, item) => sum + item.heartRate, 0) / items.length;
        const totalCalories = items.reduce((sum, item) => sum + item.caloriesBurned, 0);
        const avgWeight = items.reduce((sum, item) => sum + item.weight, 0) / items.length;
        const avgBodyFat = items.reduce((sum, item) => sum + item.bodyFatPercentage, 0) / items.length;
        const avgHRV = items.reduce((sum, item) => sum + item.heartRateVariability, 0) / items.length;
        const avgFatFreeBodyWeight = items.reduce((sum, item) => sum + item.fatFreeBodyWeight, 0) / items.length;
        const avgSubcutaneousFat = items.reduce((sum, item) => sum + item.subcutaneousFatPercentage, 0) / items.length;
        const avgBodyWater = items.reduce((sum, item) => sum + item.bodyWaterPercentage, 0) / items.length;
        const avgRestingHeartRate = items.reduce((sum, item) => sum + item.restingHeartRate, 0) / items.length;
        const avgVO2Max = items.reduce((sum, item) => sum + item.vo2Max, 0) / items.length;
        const avgCyclingFTP = items.reduce((sum, item) => sum + item.cyclingFTP, 0) / items.length;
        const totalSteps = items.reduce((sum, item) => sum + item.stepCount, 0);
        const pace5k = items[Math.floor(items.length / 2)].pace5k;
        const pace10k = items[Math.floor(items.length / 2)].pace10k;
        const paceHalfMarathon = items[Math.floor(items.length / 2)].paceHalfMarathon;
        const paceMarathon = items[Math.floor(items.length / 2)].paceMarathon;
        
        return {
          period: key,
          timestamp: items[0].timestamp,
          heartRate: Math.round(avgHeartRate * 100) / 100,
          caloriesBurned: selectedInterval === 'hourly' ? Math.round(totalCalories / items.length) : totalCalories,
          weight: Math.round(avgWeight * 100) / 100,
          bodyFatPercentage: Math.round(avgBodyFat * 100) / 100,
          heartRateVariability: Math.round(avgHRV * 100) / 100,
          fatFreeBodyWeight: Math.round(avgFatFreeBodyWeight * 100) / 100,
          subcutaneousFatPercentage: Math.round(avgSubcutaneousFat * 100) / 100,
          bodyWaterPercentage: Math.round(avgBodyWater * 100) / 100,
          restingHeartRate: Math.round(avgRestingHeartRate * 100) / 100,
          vo2Max: Math.round(avgVO2Max * 100) / 100,
          cyclingFTP: Math.round(avgCyclingFTP * 100) / 100,
          stepCount: selectedInterval === 'hourly' ? Math.round(totalSteps / items.length) : totalSteps,
          pace5k: pace5k,
          pace10k: pace10k,
          paceHalfMarathon: paceHalfMarathon,
          paceMarathon: paceMarathon
        };
      }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    return groupBy(filteredData, selectedInterval);
  }, [healthData, selectedInterval, startDate, endDate]);

  const currentMetrics = useMemo(() => {
    if (!aggregatedData.length) return null;
    
    const latest = aggregatedData[aggregatedData.length - 1];
    const previous = aggregatedData.length > 1 ? aggregatedData[aggregatedData.length - 2] : null;
    
    const calculateChange = (current, prev) => {
      if (!prev) return 0;
      return ((current - prev) / prev * 100).toFixed(1);
    };

    return {
      general: {
        heartRate: {
          value: latest.heartRate,
          change: previous ? calculateChange(latest.heartRate, previous.heartRate) : 0,
          unit: 'bpm'
        },
        calories: {
          value: latest.caloriesBurned,
          change: previous ? calculateChange(latest.caloriesBurned, previous.caloriesBurned) : 0,
          unit: 'cal'
        },
        heartRateVariability: {
          value: latest.heartRateVariability,
          change: previous ? calculateChange(latest.heartRateVariability, previous.heartRateVariability) : 0,
          unit: 'ms'
        },
        restingHeartRate: {
          value: latest.restingHeartRate,
          change: previous ? calculateChange(latest.restingHeartRate, previous.restingHeartRate) : 0,
          unit: 'bpm'
        }
      },
      cardio: {
        vo2Max: {
          value: latest.vo2Max,
          change: previous ? calculateChange(latest.vo2Max, previous.vo2Max) : 0,
          unit: 'ml/kg/min'
        },
        pace5k: {
          value: latest.pace5k,
          change: 0,
          unit: 'min/mi'
        },
        pace10k: {
          value: latest.pace10k,
          change: 0,
          unit: 'min/mi'
        },
        paceHalfMarathon: {
          value: latest.paceHalfMarathon,
          change: 0,
          unit: 'min/mi'
        },
        paceMarathon: {
          value: latest.paceMarathon,
          change: 0,
          unit: 'min/mi'
        },
        cyclingFTP: {
          value: latest.cyclingFTP,
          change: previous ? calculateChange(latest.cyclingFTP, previous.cyclingFTP) : 0,
          unit: 'watts'
        },
        stepCount: {
          value: latest.stepCount,
          change: previous ? calculateChange(latest.stepCount, previous.stepCount) : 0,
          unit: 'steps'
        }
      },
      weight: {
        weight: {
          value: latest.weight,
          change: previous ? calculateChange(latest.weight, previous.weight) : 0,
          unit: 'lbs'
        },
        bodyFat: {
          value: latest.bodyFatPercentage,
          change: previous ? calculateChange(latest.bodyFatPercentage, previous.bodyFatPercentage) : 0,
          unit: '%'
        },
        fatFreeBodyWeight: {
          value: latest.fatFreeBodyWeight,
          change: previous ? calculateChange(latest.fatFreeBodyWeight, previous.fatFreeBodyWeight) : 0,
          unit: 'lbs'
        },
        subcutaneousFat: {
          value: latest.subcutaneousFatPercentage,
          change: previous ? calculateChange(latest.subcutaneousFatPercentage, previous.subcutaneousFatPercentage) : 0,
          unit: '%'
        },
        bodyWater: {
          value: latest.bodyWaterPercentage,
          change: previous ? calculateChange(latest.bodyWaterPercentage, previous.bodyWaterPercentage) : 0,
          unit: '%'
        }
      }
    };
  }, [aggregatedData]);

  if (loading) {
    return React.createElement('div', { className: 'loading' }, 'Loading health data...');
  }

  return React.createElement('div', { className: 'dashboard' },
    React.createElement('header', { className: 'dashboard-header' },
      React.createElement('h1', null, 'Health Dashboard'),
      React.createElement('div', { className: 'controls-container' },
        React.createElement('div', { className: 'date-range-selector' },
          React.createElement('label', null, 'Date Range: '),
          React.createElement('input', {
            type: 'date',
            value: startDate,
            onChange: (e) => setStartDate(e.target.value),
            className: 'date-input'
          }),
          React.createElement('span', { className: 'date-separator' }, ' to '),
          React.createElement('input', {
            type: 'date',
            value: endDate,
            onChange: (e) => setEndDate(e.target.value),
            className: 'date-input'
          })
        ),
        React.createElement('div', { className: 'interval-selector' },
          React.createElement('label', null, 'View: '),
          React.createElement('select', {
            value: selectedInterval,
            onChange: (e) => setSelectedInterval(e.target.value)
          },
            React.createElement('option', { value: 'hourly' }, 'Hourly'),
            React.createElement('option', { value: 'daily' }, 'Daily'),
            React.createElement('option', { value: 'weekly' }, 'Weekly'),
            React.createElement('option', { value: 'monthly' }, 'Monthly'),
            React.createElement('option', { value: 'yearly' }, 'Yearly')
          )
        )
      )
    ),
    
    React.createElement('div', { className: 'tabs-container' },
      React.createElement('div', { className: 'tabs' },
        React.createElement('button', {
          className: `tab ${activeTab === 'general' ? 'active' : ''}`,
          onClick: () => setActiveTab('general')
        }, 'General Health'),
        React.createElement('button', {
          className: `tab ${activeTab === 'cardio' ? 'active' : ''}`,
          onClick: () => setActiveTab('cardio')
        }, 'Cardio & Performance'),
        React.createElement('button', {
          className: `tab ${activeTab === 'weight' ? 'active' : ''}`,
          onClick: () => setActiveTab('weight')
        }, 'Weight & Body Composition'),
        React.createElement('button', {
          className: `tab ${activeTab === 'activities' ? 'active' : ''}`,
          onClick: () => setActiveTab('activities')
        }, 'Activities'),
        React.createElement('button', {
          className: `tab ${activeTab === 'calendar' ? 'active' : ''}`,
          onClick: () => setActiveTab('calendar')
        }, 'Calendar'),
        React.createElement('button', {
          className: `tab ${activeTab === 'recovery' ? 'active' : ''}`,
          onClick: () => setActiveTab('recovery')
        }, 'Recovery')
      )
    ),
    
    currentMetrics && activeTab === 'general' && React.createElement('div', { className: 'metrics-grid' },
      React.createElement(MetricCard, {
        title: 'Heart Rate',
        value: currentMetrics.general.heartRate.value,
        unit: currentMetrics.general.heartRate.unit,
        change: currentMetrics.general.heartRate.change,
        icon: '❤️'
      }),
      React.createElement(MetricCard, {
        title: 'Resting Heart Rate',
        value: currentMetrics.general.restingHeartRate.value,
        unit: currentMetrics.general.restingHeartRate.unit,
        change: currentMetrics.general.restingHeartRate.change,
        icon: '🫀'
      }),
      React.createElement(MetricCard, {
        title: 'Calories Burned',
        value: currentMetrics.general.calories.value,
        unit: currentMetrics.general.calories.unit,
        change: currentMetrics.general.calories.change,
        icon: '🔥'
      }),
      React.createElement(MetricCard, {
        title: 'Heart Rate Variability',
        value: currentMetrics.general.heartRateVariability.value,
        unit: currentMetrics.general.heartRateVariability.unit,
        change: currentMetrics.general.heartRateVariability.change,
        icon: '💓'
      })
    ),
    
    currentMetrics && activeTab === 'cardio' && React.createElement('div', { className: 'metrics-grid' },
      React.createElement(MetricCard, {
        title: 'VO₂ Max',
        value: currentMetrics.cardio.vo2Max.value,
        unit: currentMetrics.cardio.vo2Max.unit,
        change: currentMetrics.cardio.vo2Max.change,
        icon: '🫁'
      }),
      React.createElement(MetricCard, {
        title: '5K Pace',
        value: currentMetrics.cardio.pace5k.value,
        unit: currentMetrics.cardio.pace5k.unit,
        change: currentMetrics.cardio.pace5k.change,
        icon: '🏃‍♂️'
      }),
      React.createElement(MetricCard, {
        title: '10K Pace',
        value: currentMetrics.cardio.pace10k.value,
        unit: currentMetrics.cardio.pace10k.unit,
        change: currentMetrics.cardio.pace10k.change,
        icon: '🏃'
      }),
      React.createElement(MetricCard, {
        title: 'Half Marathon Pace',
        value: currentMetrics.cardio.paceHalfMarathon.value,
        unit: currentMetrics.cardio.paceHalfMarathon.unit,
        change: currentMetrics.cardio.paceHalfMarathon.change,
        icon: '🏃‍♀️'
      }),
      React.createElement(MetricCard, {
        title: 'Marathon Pace',
        value: currentMetrics.cardio.paceMarathon.value,
        unit: currentMetrics.cardio.paceMarathon.unit,
        change: currentMetrics.cardio.paceMarathon.change,
        icon: '🏃'
      }),
      React.createElement(MetricCard, {
        title: 'Cycling FTP',
        value: currentMetrics.cardio.cyclingFTP.value,
        unit: currentMetrics.cardio.cyclingFTP.unit,
        change: currentMetrics.cardio.cyclingFTP.change,
        icon: '🚴‍♂️'
      }),
      React.createElement(MetricCard, {
        title: 'Step Count',
        value: currentMetrics.cardio.stepCount.value,
        unit: currentMetrics.cardio.stepCount.unit,
        change: currentMetrics.cardio.stepCount.change,
        icon: '👟'
      })
    ),
    
    currentMetrics && activeTab === 'weight' && React.createElement('div', { className: 'metrics-grid' },
      React.createElement(MetricCard, {
        title: 'Weight',
        value: currentMetrics.weight.weight.value,
        unit: currentMetrics.weight.weight.unit,
        change: currentMetrics.weight.weight.change,
        icon: '⚖️'
      }),
      React.createElement(MetricCard, {
        title: 'Body Fat',
        value: currentMetrics.weight.bodyFat.value,
        unit: currentMetrics.weight.bodyFat.unit,
        change: currentMetrics.weight.bodyFat.change,
        icon: '📊'
      }),
      React.createElement(MetricCard, {
        title: 'Fat Free Body Weight',
        value: currentMetrics.weight.fatFreeBodyWeight.value,
        unit: currentMetrics.weight.fatFreeBodyWeight.unit,
        change: currentMetrics.weight.fatFreeBodyWeight.change,
        icon: '💪'
      }),
      React.createElement(MetricCard, {
        title: 'Subcutaneous Fat',
        value: currentMetrics.weight.subcutaneousFat.value,
        unit: currentMetrics.weight.subcutaneousFat.unit,
        change: currentMetrics.weight.subcutaneousFat.change,
        icon: '🔍'
      }),
      React.createElement(MetricCard, {
        title: 'Body Water',
        value: currentMetrics.weight.bodyWater.value,
        unit: currentMetrics.weight.bodyWater.unit,
        change: currentMetrics.weight.bodyWater.change,
        icon: '💧'
      })
    ),
    
    activeTab === 'activities' && React.createElement(ActivitiesPage, {
      activities: activities,
      startDate: startDate,
      endDate: endDate
    }),
    
    activeTab === 'calendar' && React.createElement(CalendarPage, {
      activities: activities,
      plannedWorkouts: plannedWorkouts,
      scheduledWorkouts: scheduledWorkouts
    }),
    
    activeTab === 'recovery' && React.createElement(RecoveryPage, {
      activities: activities,
      plannedWorkouts: plannedWorkouts,
      scheduledWorkouts: scheduledWorkouts
    }),
    
    activeTab === 'general' && React.createElement('div', { className: 'charts-container' },
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'heartRate',
        title: 'Heart Rate Trend',
        color: '#e74c3c',
        unit: 'bpm',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'restingHeartRate',
        title: 'Resting Heart Rate Trend',
        color: '#c0392b',
        unit: 'bpm',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'caloriesBurned',
        title: 'Calories Burned Trend',
        color: '#f39c12',
        unit: 'cal',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'heartRateVariability',
        title: 'Heart Rate Variability Trend',
        color: '#e91e63',
        unit: 'ms',
        interval: selectedInterval
      })
    ),
    
    activeTab === 'cardio' && React.createElement('div', { className: 'charts-container' },
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'vo2Max',
        title: 'VO₂ Max Trend',
        color: '#27ae60',
        unit: 'ml/kg/min',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'cyclingFTP',
        title: 'Cycling FTP Trend',
        color: '#3498db',
        unit: 'watts',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'stepCount',
        title: 'Step Count Trend',
        color: '#9b59b6',
        unit: 'steps',
        interval: selectedInterval
      })
    ),
    
    activeTab === 'weight' && React.createElement('div', { className: 'charts-container' },
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'weight',
        title: 'Weight Trend',
        color: '#3498db',
        unit: 'lbs',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'bodyFatPercentage',
        title: 'Body Fat Percentage Trend',
        color: '#9b59b6',
        unit: '%',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'fatFreeBodyWeight',
        title: 'Fat Free Body Weight Trend',
        color: '#2ecc71',
        unit: 'lbs',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'subcutaneousFatPercentage',
        title: 'Subcutaneous Fat Trend',
        color: '#f39c12',
        unit: '%',
        interval: selectedInterval
      }),
      React.createElement(TrendChart, {
        data: aggregatedData,
        metric: 'bodyWaterPercentage',
        title: 'Body Water Percentage Trend',
        color: '#00bcd4',
        unit: '%',
        interval: selectedInterval
      })
    )
  );
};

const MetricCard = ({ title, value, unit, change, icon }) => {
  const changeClass = parseFloat(change) > 0 ? 'positive' : parseFloat(change) < 0 ? 'negative' : 'neutral';
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
  const formattedChange = typeof change === 'number' ? change : parseFloat(change);
  const showChange = !isNaN(formattedChange) && formattedChange !== 0;
  
  return React.createElement('div', { className: 'metric-card' },
    React.createElement('div', { className: 'metric-header' },
      React.createElement('span', { className: 'metric-icon' }, icon),
      React.createElement('h3', null, title)
    ),
    React.createElement('div', { className: 'metric-value' },
      React.createElement('span', { className: 'value' }, formattedValue),
      React.createElement('span', { className: 'unit' }, unit)
    ),
    React.createElement('div', { className: `metric-change ${changeClass}` },
      showChange && React.createElement('span', null, 
        `${formattedChange > 0 ? '+' : ''}${formattedChange}%`
      )
    )
  );
};

const TrendChart = ({ data, metric, title, color, unit, interval }) => {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (!data.length || !canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => {
          const date = new Date(item.timestamp);
          switch(interval) {
            case 'hourly':
              return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }) + ' ' + date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
              });
            case 'daily':
              return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              });
            case 'weekly':
              return 'Week of ' + date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              });
            case 'monthly':
              return date.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              });
            case 'yearly':
              return date.getFullYear().toString();
            default:
              return date.toLocaleDateString();
          }
        }),
        datasets: [{
          label: title,
          data: data.map(item => item[metric]),
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: '#e0e0e0'
            },
            ticks: {
              callback: function(value) {
                return value + ' ' + unit;
              }
            }
          },
          x: {
            grid: {
              color: '#e0e0e0'
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, metric, title, color, unit, interval]);

  return React.createElement('div', { className: 'chart-container' },
    React.createElement('h3', { className: 'chart-title' }, title),
    React.createElement('canvas', { ref: canvasRef })
  );
};

const ActivitiesPage = ({ activities, startDate, endDate }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const filteredActivities = useMemo(() => {
    if (!activities.length) return [];
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      const withinDateRange = activityDate >= start && activityDate <= end;
      const matchesType = selectedActivityType === 'all' || activity.type === selectedActivityType;
      
      return withinDateRange && matchesType;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities, startDate, endDate, selectedActivityType]);

  const activityTypes = useMemo(() => {
    const types = [...new Set(activities.map(a => a.type))];
    return ['all', ...types];
  }, [activities]);

  const getActivityIcon = (type) => {
    const icons = {
      run: '🏃‍♂️',
      cycling: '🚴‍♂️',
      swim: '🏊‍♂️',
      weightlifting: '🏋️‍♂️',
      rowing: '🚣‍♂️'
    };
    return icons[type] || '💪';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return React.createElement('div', { className: 'activities-page' },
    React.createElement('div', { className: 'activities-header' },
      React.createElement('div', { className: 'activity-filters' },
        React.createElement('label', null, 'Activity Type: '),
        React.createElement('select', {
          value: selectedActivityType,
          onChange: (e) => setSelectedActivityType(e.target.value),
          className: 'activity-type-select'
        },
          ...activityTypes.map(type =>
            React.createElement('option', { key: type, value: type },
              type === 'all' ? 'All Activities' : type.charAt(0).toUpperCase() + type.slice(1)
            )
          )
        )
      )
    ),
    
    React.createElement('div', { className: 'activities-grid' },
      ...filteredActivities.map(activity =>
        React.createElement(ActivityCard, {
          key: activity.id,
          activity: activity,
          onClick: () => setSelectedActivity(activity),
          formatDuration: formatDuration,
          getActivityIcon: getActivityIcon
        })
      )
    ),
    
    selectedActivity && React.createElement(ActivityDetail, {
      activity: selectedActivity,
      onClose: () => setSelectedActivity(null),
      formatDuration: formatDuration,
      getActivityIcon: getActivityIcon
    })
  );
};

const ActivityCard = ({ activity, onClick, formatDuration, getActivityIcon }) => {
  return React.createElement('div', { 
    className: 'activity-card',
    onClick: onClick
  },
    React.createElement('div', { className: 'activity-header' },
      React.createElement('div', { className: 'activity-left' },
        React.createElement('span', { className: 'activity-icon' }, getActivityIcon(activity.type)),
        React.createElement('div', { className: 'activity-info' },
          React.createElement('h3', null, activity.name),
          React.createElement('p', { className: 'activity-type' }, activity.type.charAt(0).toUpperCase() + activity.type.slice(1)),
          React.createElement('p', { className: 'activity-date' }, 
            new Date(activity.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })
          )
        )
      ),
      
      React.createElement('div', { className: 'activity-stats' },
        React.createElement('div', { className: 'stat' },
          React.createElement('span', { className: 'stat-value' }, formatDuration(activity.duration)),
          React.createElement('span', { className: 'stat-label' }, 'Duration')
        ),
        React.createElement('div', { className: 'stat' },
          React.createElement('span', { className: 'stat-value' }, activity.calories),
          React.createElement('span', { className: 'stat-label' }, 'Calories')
        ),
        activity.distance && React.createElement('div', { className: 'stat' },
          React.createElement('span', { className: 'stat-value' }, activity.distance.toFixed(1)),
          React.createElement('span', { className: 'stat-label' }, activity.type === 'swim' ? 'km' : 'mi')
        ),
        React.createElement('div', { className: 'stat' },
          React.createElement('span', { className: 'stat-value' }, activity.avgHeartRate),
          React.createElement('span', { className: 'stat-label' }, 'Avg HR')
        )
      )
    )
  );
};

const ActivityDetail = ({ activity, onClose, formatDuration, getActivityIcon }) => {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (activity.isOutdoor && activity.gpsData && activity.gpsData.length > 0 && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([activity.gpsData[0].lat, activity.gpsData[0].lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const polyline = L.polyline(activity.gpsData.map(point => [point.lat, point.lng]), {
        color: '#667eea',
        weight: 4
      }).addTo(map);

      L.marker([activity.gpsData[0].lat, activity.gpsData[0].lng])
        .addTo(map)
        .bindPopup('Start');
      
      L.marker([activity.gpsData[activity.gpsData.length - 1].lat, activity.gpsData[activity.gpsData.length - 1].lng])
        .addTo(map)
        .bindPopup('Finish');

      map.fitBounds(polyline.getBounds());
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activity]);

  return React.createElement('div', { className: 'activity-detail-overlay' },
    React.createElement('div', { className: 'activity-detail' },
      React.createElement('div', { className: 'activity-detail-header' },
        React.createElement('div', { className: 'activity-title' },
          React.createElement('span', { className: 'activity-icon-large' }, getActivityIcon(activity.type)),
          React.createElement('div', null,
            React.createElement('h2', null, activity.name),
            React.createElement('p', null, new Date(activity.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }))
          )
        ),
        React.createElement('button', { 
          className: 'close-button',
          onClick: onClose
        }, '×')
      ),
      
      React.createElement('div', { className: 'activity-detail-content' },
        React.createElement('div', { className: 'activity-metrics' },
          React.createElement('div', { className: 'metric-row' },
            React.createElement(ActivityMetric, { 
              label: 'Duration', 
              value: formatDuration(activity.duration),
              icon: '⏱️'
            }),
            React.createElement(ActivityMetric, { 
              label: 'Calories', 
              value: activity.calories,
              icon: '🔥'
            }),
            activity.distance && React.createElement(ActivityMetric, { 
              label: 'Distance', 
              value: `${activity.distance.toFixed(1)} ${activity.type === 'swim' ? 'km' : 'mi'}`,
              icon: '📏'
            })
          ),
          
          React.createElement('div', { className: 'metric-row' },
            React.createElement(ActivityMetric, { 
              label: 'Avg Heart Rate', 
              value: `${activity.avgHeartRate} bpm`,
              icon: '❤️'
            }),
            React.createElement(ActivityMetric, { 
              label: 'Max Heart Rate', 
              value: `${activity.maxHeartRate} bpm`,
              icon: '💓'
            }),
            activity.avgPace && React.createElement(ActivityMetric, { 
              label: 'Avg Pace', 
              value: activity.avgPace,
              icon: '⚡'
            })
          ),
          
          activity.avgPower && React.createElement('div', { className: 'metric-row' },
            React.createElement(ActivityMetric, { 
              label: 'Avg Power', 
              value: `${activity.avgPower}W`,
              icon: '💪'
            })
          ),
          
          React.createElement('div', { className: 'muscles-used' },
            React.createElement('h4', null, 'Muscles Used'),
            React.createElement('div', { className: 'muscle-tags' },
              ...activity.musclesUsed.map(muscle =>
                React.createElement('span', { 
                  key: muscle, 
                  className: 'muscle-tag' 
                }, muscle)
              )
            )
          ),
          
          activity.exercises && React.createElement('div', { className: 'exercises' },
            React.createElement('h4', null, 'Exercises'),
            React.createElement('div', { className: 'exercise-list' },
              ...activity.exercises.map((exercise, index) =>
                React.createElement('div', { key: index, className: 'exercise-item' },
                  React.createElement('span', { className: 'exercise-name' }, exercise.name),
                  React.createElement('span', { className: 'exercise-details' }, 
                    `${exercise.sets} sets × ${exercise.reps} reps` + 
                    (exercise.weight > 0 ? ` @ ${exercise.weight}lbs` : '')
                  )
                )
              )
            )
          )
        ),
        
        activity.isOutdoor && activity.gpsData && activity.gpsData.length > 0 && 
        React.createElement('div', { className: 'activity-map' },
          React.createElement('h4', null, 'Route'),
          React.createElement('div', { 
            ref: mapRef, 
            className: 'map-container'
          })
        )
      )
    )
  );
};

const ActivityMetric = ({ label, value, icon }) => {
  return React.createElement('div', { className: 'activity-metric' },
    React.createElement('span', { className: 'activity-metric-icon' }, icon),
    React.createElement('div', { className: 'activity-metric-content' },
      React.createElement('span', { className: 'activity-metric-value' }, value),
      React.createElement('span', { className: 'activity-metric-label' }, label)
    )
  );
};

const CalendarPage = ({ activities, plannedWorkouts, scheduledWorkouts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const getActivityIcon = (type) => {
    const icons = {
      run: '🏃‍♂️',
      cycling: '🚴‍♂️',
      swim: '🏊‍♂️',
      weightlifting: '🏋️‍♂️',
      rowing: '🚣‍♂️'
    };
    return icons[type] || '💪';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getWorkoutsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const completedActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      return activityDate === dateStr;
    }).map(activity => ({ ...activity, isCompleted: true, workoutType: 'completed' }));

    const plannedActivities = plannedWorkouts.filter(planned => {
      const plannedDate = new Date(planned.date).toISOString().split('T')[0];
      return plannedDate === dateStr;
    }).map(planned => ({ ...planned, isCompleted: false, workoutType: 'planned' }));

    const scheduledActivities = scheduledWorkouts.filter(scheduled => {
      const scheduledDate = new Date(scheduled.date).toISOString().split('T')[0];
      return scheduledDate === dateStr;
    }).map(scheduled => ({ 
      ...scheduled, 
      isCompleted: false, 
      workoutType: 'scheduled',
      name: scheduled.name,
      plannedDuration: scheduled.scheduledDuration,
      plannedDistance: scheduled.scheduledDistance
    }));

    return [...completedActivities, ...plannedActivities, ...scheduledActivities];
  };

  const navigate = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction * 7));
      } else {
        newDate.setMonth(prev.getMonth() + direction);
      }
      return newDate;
    });
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = viewMode === 'week' ? getWeekDays(currentDate) : getDaysInMonth(currentDate);
  const headerTitle = viewMode === 'week' 
    ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return React.createElement('div', { className: 'calendar-page' },
    React.createElement('div', { className: 'calendar-header' },
      React.createElement('div', { className: 'view-toggle' },
        React.createElement('button', {
          className: `view-button ${viewMode === 'week' ? 'active' : ''}`,
          onClick: () => setViewMode('week')
        }, 'Week'),
        React.createElement('button', {
          className: `view-button ${viewMode === 'month' ? 'active' : ''}`,
          onClick: () => setViewMode('month')
        }, 'Month')
      ),
      React.createElement('div', { className: 'calendar-navigation' },
        React.createElement('button', {
          className: 'nav-button',
          onClick: () => navigate(-1)
        }, '‹'),
        React.createElement('h2', { className: 'period-title' }, headerTitle),
        React.createElement('button', {
          className: 'nav-button',
          onClick: () => navigate(1)
        }, '›')
      )
    ),

    viewMode === 'week' ? 
      React.createElement(WeeklyCalendar, {
        days: days,
        getWorkoutsForDate: getWorkoutsForDate,
        selectedDate: selectedDate,
        setSelectedDate: setSelectedDate,
        getActivityIcon: getActivityIcon,
        formatDuration: formatDuration
      }) :
      React.createElement('div', { className: 'calendar-container' },
        React.createElement('div', { className: 'calendar-grid' },
          // Week day headers
          React.createElement('div', { className: 'weekday-header' }, 'Sun'),
          React.createElement('div', { className: 'weekday-header' }, 'Mon'),
          React.createElement('div', { className: 'weekday-header' }, 'Tue'),
          React.createElement('div', { className: 'weekday-header' }, 'Wed'),
          React.createElement('div', { className: 'weekday-header' }, 'Thu'),
          React.createElement('div', { className: 'weekday-header' }, 'Fri'),
          React.createElement('div', { className: 'weekday-header' }, 'Sat'),

          // Calendar days
          ...days.map((day, index) => {
            if (!day) {
              return React.createElement('div', { key: `empty-${index}`, className: 'calendar-day empty' });
            }

            const workouts = getWorkoutsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

            return React.createElement('div', {
              key: day.toISOString(),
              className: `calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${workouts.length > 0 ? 'has-workouts' : ''}`,
              onClick: () => setSelectedDate(day)
            },
              React.createElement('span', { className: 'day-number' }, day.getDate()),
              workouts.length > 0 && React.createElement('div', { className: 'workout-indicators' },
                ...workouts.slice(0, 3).map((workout, idx) =>
                  React.createElement('div', {
                    key: idx,
                    className: `workout-dot ${workout.isCompleted ? 'completed' : 'planned'}`,
                    title: workout.name
                  }, getActivityIcon(workout.type))
                ),
                workouts.length > 3 && React.createElement('div', { className: 'workout-dot more' }, `+${workouts.length - 3}`)
              )
            );
          })
        )
      ),

    selectedDate && React.createElement(WorkoutDetail, {
      date: selectedDate,
      workouts: getWorkoutsForDate(selectedDate),
      onClose: () => setSelectedDate(null),
      getActivityIcon: getActivityIcon,
      formatDuration: formatDuration
    })
  );
};

const WeeklyCalendar = ({ days, getWorkoutsForDate, selectedDate, setSelectedDate, getActivityIcon, formatDuration }) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const calculateWorkoutSummary = (workout) => {
    if (workout.workoutType === 'completed') {
      return {
        duration: workout.duration,
        distance: workout.distance,
        calories: workout.calories,
        avgHeartRate: workout.avgHeartRate,
        avgPower: workout.avgPower,
        intensity: null
      };
    } else if (workout.workoutType === 'scheduled') {
      return {
        duration: workout.scheduledDuration || workout.plannedDuration,
        distance: workout.scheduledDistance || workout.plannedDistance,
        calories: null,
        avgHeartRate: null,
        avgPower: workout.targetPower,
        intensity: workout.intensity
      };
    } else {
      return {
        duration: workout.plannedDuration,
        distance: workout.plannedDistance,
        calories: null,
        avgHeartRate: null,
        avgPower: null,
        intensity: null
      };
    }
  };

  const getWorkoutColor = (type, workoutType) => {
    const colors = {
      run: {
        completed: '#28a745',
        planned: '#ffc107', 
        scheduled: '#007bff'
      },
      cycling: {
        completed: '#007bff',
        planned: '#fd7e14',
        scheduled: '#17a2b8'
      },
      swim: {
        completed: '#17a2b8',
        planned: '#6f42c1',
        scheduled: '#20c997'
      },
      weightlifting: {
        completed: '#dc3545',
        planned: '#e83e8c',
        scheduled: '#6c757d'
      },
      rowing: {
        completed: '#20c997',
        planned: '#6c757d',
        scheduled: '#28a745'
      }
    };
    
    const typeColors = colors[type] || colors.run;
    return typeColors[workoutType] || typeColors.scheduled;
  };

  return React.createElement('div', { className: 'weekly-calendar' },
    React.createElement('div', { className: 'week-grid' },
      ...days.map((day, index) => {
        const workouts = getWorkoutsForDate(day);
        const isToday = day.toDateString() === new Date().toDateString();
        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
        
        return React.createElement('div', {
          key: day.toISOString(),
          className: `week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`
        },
          React.createElement('div', { className: 'week-day-header' },
            React.createElement('div', { className: 'day-name' }, weekDays[index]),
            React.createElement('div', { className: 'day-date' }, 
              day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            )
          ),
          
          React.createElement('div', { className: 'week-day-content' },
            workouts.length === 0 ? 
              React.createElement('div', { className: 'no-workout' }, 'Rest Day') :
              React.createElement('div', { className: 'workout-cards' },
                ...workouts.map((workout, idx) => {
                  const summary = calculateWorkoutSummary(workout);
                  const color = getWorkoutColor(workout.type, workout.workoutType);
                  
                  return React.createElement('div', {
                    key: idx,
                    className: `workout-card ${workout.workoutType}`,
                    style: { borderLeftColor: color },
                    onClick: () => setSelectedDate(day)
                  },
                    React.createElement('div', { className: 'workout-card-header' },
                      React.createElement('span', { className: 'workout-icon-small' }, getActivityIcon(workout.type)),
                      React.createElement('span', { className: 'workout-name' }, workout.name),
                      React.createElement('span', { 
                        className: 'workout-time' 
                      }, new Date(workout.date).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      }))
                    ),
                    
                    React.createElement('div', { className: 'workout-card-stats' },
                      React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-value' }, formatDuration(summary.duration)),
                        React.createElement('span', { className: 'stat-label' }, 'Duration')
                      ),
                      summary.distance && React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-value' }, summary.distance.toFixed(1)),
                        React.createElement('span', { className: 'stat-label' }, workout.type === 'swim' ? 'km' : 'mi')
                      ),
                      summary.calories && React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-value' }, summary.calories),
                        React.createElement('span', { className: 'stat-label' }, 'cal')
                      ),
                      summary.avgHeartRate && React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-value' }, summary.avgHeartRate),
                        React.createElement('span', { className: 'stat-label' }, 'bpm')
                      ),
                      summary.avgPower && React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-value' }, summary.avgPower),
                        React.createElement('span', { className: 'stat-label' }, 'W')
                      )
                    ),
                    
                    summary.intensity && React.createElement('div', { className: 'workout-intensity' },
                      `Zone: ${summary.intensity}`
                    ),
                    
                    !workout.isCompleted && workout.notes && React.createElement('div', { className: 'workout-notes-preview' },
                      workout.notes
                    ),
                    
                    workout.workoutType === 'scheduled' && workout.coach && React.createElement('div', { className: 'workout-coach' },
                      `Coach: ${workout.coach}`
                    )
                  );
                })
              )
          )
        );
      })
    )
  );
};

const WorkoutDetail = ({ date, workouts, onClose, getActivityIcon, formatDuration }) => {
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return React.createElement('div', { className: 'workout-detail-overlay' },
    React.createElement('div', { className: 'workout-detail' },
      React.createElement('div', { className: 'workout-detail-header' },
        React.createElement('h3', null, dateStr),
        React.createElement('button', {
          className: 'close-button',
          onClick: onClose
        }, '×')
      ),

      React.createElement('div', { className: 'workout-detail-content' },
        workouts.length === 0 ? 
          React.createElement('p', { className: 'no-workouts' }, 'No workouts scheduled for this day') :
          React.createElement('div', { className: 'workout-list' },
            ...workouts.map((workout, index) =>
              React.createElement('div', {
                key: index,
                className: `workout-item ${workout.isCompleted ? 'completed' : 'planned'}`
              },
                React.createElement('div', { className: 'workout-icon' }, getActivityIcon(workout.type)),
                React.createElement('div', { className: 'workout-info' },
                  React.createElement('h4', null, workout.name),
                  React.createElement('p', { className: 'workout-type' }, 
                    workout.type.charAt(0).toUpperCase() + workout.type.slice(1)
                  ),
                  React.createElement('p', { className: 'workout-time' }, 
                    new Date(workout.date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })
                  )
                ),
                React.createElement('div', { className: 'workout-stats' },
                  workout.workoutType === 'completed' ? 
                    React.createElement('div', { className: 'completed-stats' },
                      React.createElement('span', null, `${formatDuration(workout.duration)}`),
                      workout.calories && React.createElement('span', null, `${workout.calories} cal`),
                      workout.distance && React.createElement('span', null, `${workout.distance.toFixed(1)} ${workout.type === 'swim' ? 'km' : 'mi'}`)
                    ) : workout.workoutType === 'scheduled' ?
                    React.createElement('div', { className: 'scheduled-stats' },
                      React.createElement('span', null, `${formatDuration(workout.scheduledDuration || workout.plannedDuration)}`),
                      (workout.scheduledDistance || workout.plannedDistance) && React.createElement('span', null, `${(workout.scheduledDistance || workout.plannedDistance).toFixed(1)} ${workout.type === 'swim' ? 'km' : 'mi'}`),
                      workout.intensity && React.createElement('span', { className: 'intensity-badge' }, `Zone: ${workout.intensity}`),
                      workout.targetPower && React.createElement('span', null, `Target: ${workout.targetPower}W`),
                      workout.coach && React.createElement('p', { className: 'workout-coach-detail' }, `Assigned by: ${workout.coach}`),
                      workout.notes && React.createElement('p', { className: 'workout-notes' }, workout.notes)
                    ) :
                    React.createElement('div', { className: 'planned-stats' },
                      React.createElement('span', null, `${formatDuration(workout.plannedDuration)}`),
                      workout.plannedDistance && React.createElement('span', null, `${workout.plannedDistance.toFixed(1)} ${workout.type === 'swim' ? 'km' : 'mi'}`),
                      workout.notes && React.createElement('p', { className: 'workout-notes' }, workout.notes)
                    )
                ),
                React.createElement('div', { className: 'workout-status' },
                  workout.workoutType === 'completed' ? 
                    React.createElement('span', { className: 'status-badge completed' }, '✓ Completed') :
                    workout.workoutType === 'scheduled' ?
                    React.createElement('span', { className: 'status-badge scheduled' }, '📋 Scheduled') :
                    React.createElement('span', { className: 'status-badge planned' }, '📅 Planned')
                )
              )
            )
          )
      )
    )
  );
};

const RecoveryPage = ({ activities, plannedWorkouts, scheduledWorkouts }) => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  
  // Calculate muscle impact from last 7 days
  const calculateMuscleImpact = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Get recent completed activities
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= sevenDaysAgo && activityDate <= today;
    });
    
    // Initialize muscle impact scores
    const muscleImpact = {
      chest: 0,
      shoulders: 0,
      triceps: 0,
      biceps: 0,
      back: 0,
      core: 0,
      legs: 0,
      quads: 0,
      hamstrings: 0,
      glutes: 0,
      calves: 0,
      fullbody: 0
    };
    
    // Calculate impact based on activities
    recentActivities.forEach(activity => {
      const daysDiff = Math.max(1, Math.ceil((today - new Date(activity.date)) / (1000 * 60 * 60 * 24)));
      const decayFactor = Math.max(0.1, 1 - (daysDiff - 1) * 0.15); // Decay over time
      
      const baseImpact = activity.duration / 3600; // Convert to hours
      const intensityMultiplier = activity.avgHeartRate > 150 ? 1.5 : activity.avgHeartRate > 120 ? 1.2 : 1.0;
      
      const totalImpact = baseImpact * intensityMultiplier * decayFactor;
      
      // Map muscle groups to impact
      if (activity.musclesUsed) {
        activity.musclesUsed.forEach(muscle => {
          const normalizedMuscle = muscle.toLowerCase().replace(/\s+/g, '');
          
          switch(normalizedMuscle) {
            case 'chest':
              muscleImpact.chest += totalImpact;
              break;
            case 'shoulders':
              muscleImpact.shoulders += totalImpact;
              break;
            case 'triceps':
              muscleImpact.triceps += totalImpact;
              break;
            case 'biceps':
              muscleImpact.biceps += totalImpact;
              break;
            case 'back':
              muscleImpact.back += totalImpact;
              break;
            case 'core':
              muscleImpact.core += totalImpact;
              break;
            case 'legs':
              muscleImpact.legs += totalImpact;
              muscleImpact.quads += totalImpact * 0.7;
              muscleImpact.hamstrings += totalImpact * 0.7;
              muscleImpact.glutes += totalImpact * 0.5;
              muscleImpact.calves += totalImpact * 0.3;
              break;
            case 'glutes':
              muscleImpact.glutes += totalImpact;
              break;
            case 'fullbody':
              Object.keys(muscleImpact).forEach(key => {
                if (key !== 'fullbody') {
                  muscleImpact[key] += totalImpact * 0.6;
                }
              });
              break;
            case 'arms':
              muscleImpact.biceps += totalImpact * 0.8;
              muscleImpact.triceps += totalImpact * 0.8;
              break;
          }
        });
      }
      
      // Activity-specific impact
      switch(activity.type) {
        case 'run':
          muscleImpact.legs += totalImpact * 0.8;
          muscleImpact.quads += totalImpact * 0.6;
          muscleImpact.hamstrings += totalImpact * 0.4;
          muscleImpact.calves += totalImpact * 0.7;
          muscleImpact.glutes += totalImpact * 0.5;
          muscleImpact.core += totalImpact * 0.3;
          break;
        case 'cycling':
          muscleImpact.legs += totalImpact * 0.9;
          muscleImpact.quads += totalImpact * 0.8;
          muscleImpact.glutes += totalImpact * 0.6;
          muscleImpact.calves += totalImpact * 0.4;
          muscleImpact.core += totalImpact * 0.4;
          break;
        case 'swim':
          muscleImpact.shoulders += totalImpact * 0.8;
          muscleImpact.back += totalImpact * 0.7;
          muscleImpact.triceps += totalImpact * 0.5;
          muscleImpact.biceps += totalImpact * 0.5;
          muscleImpact.core += totalImpact * 0.6;
          muscleImpact.legs += totalImpact * 0.4;
          break;
        case 'rowing':
          muscleImpact.back += totalImpact * 0.8;
          muscleImpact.legs += totalImpact * 0.7;
          muscleImpact.biceps += totalImpact * 0.6;
          muscleImpact.core += totalImpact * 0.7;
          muscleImpact.shoulders += totalImpact * 0.5;
          break;
      }
    });
    
    // Normalize to 0-1 scale (max impact of 10 maps to 1.0)
    const maxImpact = Math.max(...Object.values(muscleImpact), 1);
    const normalizedImpact = {};
    Object.keys(muscleImpact).forEach(key => {
      normalizedImpact[key] = Math.min(1, muscleImpact[key] / Math.max(maxImpact, 10));
    });
    
    return normalizedImpact;
  };

  const muscleImpact = calculateMuscleImpact();
  
  const getImpactColor = (impact) => {
    if (impact === 0) return 'rgba(0, 0, 0, 0)'; // Transparent
    const intensity = Math.min(1, impact);
    return `rgba(220, 53, 69, ${intensity})`; // Red with varying opacity
  };
  
  const getImpactLevel = (impact) => {
    if (impact < 0.2) return 'Low';
    if (impact < 0.5) return 'Moderate';
    if (impact < 0.8) return 'High';
    return 'Very High';
  };

  const muscleGroups = [
    { name: 'Chest', key: 'chest', x: '50%', y: '25%' },
    { name: 'Shoulders', key: 'shoulders', x: '35%', y: '20%' },
    { name: 'Triceps', key: 'triceps', x: '25%', y: '30%' },
    { name: 'Biceps', key: 'biceps', x: '75%', y: '30%' },
    { name: 'Back', key: 'back', x: '50%', y: '35%' },
    { name: 'Core', key: 'core', x: '50%', y: '45%' },
    { name: 'Quads', key: 'quads', x: '45%', y: '65%' },
    { name: 'Hamstrings', key: 'hamstrings', x: '55%', y: '65%' },
    { name: 'Glutes', key: 'glutes', x: '50%', y: '55%' },
    { name: 'Calves', key: 'calves', x: '50%', y: '85%' }
  ];

  return React.createElement('div', { className: 'recovery-page' },
    React.createElement('div', { className: 'recovery-header' },
      React.createElement('h2', null, 'Muscle Recovery Status'),
      React.createElement('p', null, 'Impact analysis from the last 7 days of activities')
    ),
    
    React.createElement('div', { className: 'recovery-content' },
      React.createElement('div', { className: 'body-diagram-container' },
        React.createElement('div', { className: 'body-diagram' },
          React.createElement('svg', {
            viewBox: '0 0 200 300',
            className: 'body-svg'
          },
            // Body outline
            React.createElement('ellipse', {
              cx: '100',
              cy: '50',
              rx: '15',
              ry: '20',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '75',
              y: '70',
              width: '50',
              height: '80',
              rx: '25',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '85',
              y: '150',
              width: '30',
              height: '80',
              rx: '15',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '88',
              y: '230',
              width: '12',
              height: '50',
              rx: '6',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '100',
              y: '230',
              width: '12',
              height: '50',
              rx: '6',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '55',
              y: '85',
              width: '15',
              height: '40',
              rx: '7',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            React.createElement('rect', {
              x: '130',
              y: '85',
              width: '15',
              height: '40',
              rx: '7',
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: '2'
            }),
            
            // Muscle overlays
            ...muscleGroups.map(muscle => 
              React.createElement('circle', {
                key: muscle.key,
                cx: muscle.x,
                cy: muscle.y,
                r: '12',
                fill: getImpactColor(muscleImpact[muscle.key]),
                stroke: muscleImpact[muscle.key] > 0 ? '#dc3545' : 'transparent',
                strokeWidth: '1',
                className: 'muscle-overlay',
                onClick: () => setSelectedMuscle(muscle),
                style: { cursor: 'pointer' }
              })
            )
          )
        ),
        
        React.createElement('div', { className: 'impact-legend' },
          React.createElement('h4', null, 'Impact Level'),
          React.createElement('div', { className: 'legend-scale' },
            React.createElement('div', { className: 'legend-item' },
              React.createElement('div', { 
                className: 'legend-color',
                style: { backgroundColor: 'rgba(0, 0, 0, 0)' }
              }),
              React.createElement('span', null, 'None')
            ),
            React.createElement('div', { className: 'legend-item' },
              React.createElement('div', { 
                className: 'legend-color',
                style: { backgroundColor: 'rgba(220, 53, 69, 0.3)' }
              }),
              React.createElement('span', null, 'Low')
            ),
            React.createElement('div', { className: 'legend-item' },
              React.createElement('div', { 
                className: 'legend-color',
                style: { backgroundColor: 'rgba(220, 53, 69, 0.6)' }
              }),
              React.createElement('span', null, 'Moderate')
            ),
            React.createElement('div', { className: 'legend-item' },
              React.createElement('div', { 
                className: 'legend-color',
                style: { backgroundColor: 'rgba(220, 53, 69, 1.0)' }
              }),
              React.createElement('span', null, 'High')
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'recovery-details' },
        React.createElement('div', { className: 'muscle-impact-list' },
          React.createElement('h3', null, 'Muscle Impact Summary'),
          ...muscleGroups.map(muscle => 
            React.createElement('div', {
              key: muscle.key,
              className: `muscle-impact-item ${selectedMuscle?.key === muscle.key ? 'selected' : ''}`,
              onClick: () => setSelectedMuscle(muscle)
            },
              React.createElement('div', { className: 'muscle-name' }, muscle.name),
              React.createElement('div', { className: 'impact-bar' },
                React.createElement('div', {
                  className: 'impact-fill',
                  style: { 
                    width: `${muscleImpact[muscle.key] * 100}%`,
                    backgroundColor: getImpactColor(muscleImpact[muscle.key]) || '#e9ecef'
                  }
                })
              ),
              React.createElement('div', { className: 'impact-level' }, 
                getImpactLevel(muscleImpact[muscle.key])
              )
            )
          )
        ),
        
        selectedMuscle && React.createElement('div', { className: 'muscle-detail-panel' },
          React.createElement('h4', null, `${selectedMuscle.name} Recovery`),
          React.createElement('div', { className: 'detail-stats' },
            React.createElement('div', { className: 'detail-stat' },
              React.createElement('span', { className: 'stat-label' }, 'Impact Level:'),
              React.createElement('span', { className: 'stat-value' }, getImpactLevel(muscleImpact[selectedMuscle.key]))
            ),
            React.createElement('div', { className: 'detail-stat' },
              React.createElement('span', { className: 'stat-label' }, 'Recovery Time:'),
              React.createElement('span', { className: 'stat-value' }, 
                muscleImpact[selectedMuscle.key] > 0.8 ? '48-72 hours' :
                muscleImpact[selectedMuscle.key] > 0.5 ? '24-48 hours' :
                muscleImpact[selectedMuscle.key] > 0.2 ? '12-24 hours' : 'Recovered'
              )
            )
          ),
          React.createElement('div', { className: 'recovery-recommendations' },
            React.createElement('h5', null, 'Recommendations:'),
            React.createElement('ul', null,
              muscleImpact[selectedMuscle.key] > 0.8 ? [
                React.createElement('li', { key: 1 }, 'Consider rest or light activity'),
                React.createElement('li', { key: 2 }, 'Focus on stretching and mobility'),
                React.createElement('li', { key: 3 }, 'Ensure adequate protein intake')
              ] : muscleImpact[selectedMuscle.key] > 0.5 ? [
                React.createElement('li', { key: 1 }, 'Light activity or active recovery'),
                React.createElement('li', { key: 2 }, 'Gentle stretching recommended')
              ] : [
                React.createElement('li', { key: 1 }, 'Ready for training'),
                React.createElement('li', { key: 2 }, 'Consider progressive loading')
              ]
            )
          )
        )
      )
    )
  );
};

window.HealthDashboard = HealthDashboard;