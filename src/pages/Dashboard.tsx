// src/pages/analytics/dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, 
  ComposedChart, Area, Scatter, ZAxis
} from 'recharts';
import { useApiService } from '@/services/api';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Calendar, DollarSign, ShoppingBag, Package, Users, 
  Clock, Repeat, TrendingUp, PieChart as PieChartIcon 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#4f46e5', '#22d3ee', '#8b5cf6', '#ec4899', '#f97316', 
               '#84cc16', '#10b981', '#ef4444', '#06b6d4', '#d946ef'];
const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

const Dashboard: React.FC = () => {
  const { analyticsApi } = useApiService();
  const [data, setData] = useState<any>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getDashboard({ year, month, startDate, endDate });
      setData(res);
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [year, month, startDate, endDate]);

  const currencyFormatter = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.name.includes('Revenue') 
                ? currencyFormatter(item.value)
                : item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <DashboardSkeleton />;
  if (!data) return <p className="mt-10 text-center">No analytics data available</p>;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Business Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full max-w-5xl">
          <Input 
            type="number" 
            value={year} 
            onChange={e => setYear(+e.target.value)} 
            placeholder="Year" 
            className="bg-white shadow-sm"
          />
          
          <Select 
  value={month ? month.toString() : 'all'} 
  onValueChange={v => setMonth(v === 'all' ? undefined : +v)}
>
  <SelectTrigger className="bg-white shadow-sm">
    <SelectValue placeholder="All Months" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Months</SelectItem> {/* FIXED VALUE */}
    {MONTHS.map(m => (
      <SelectItem key={m.value} value={m.value.toString()}>
        {m.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          
          <div className="relative col-span-2">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="pl-10 bg-white shadow-sm"
              placeholder="Start date"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="pl-10 bg-white shadow-sm"
              placeholder="End date"
            />
          </div>
          
          <Select value={timeframe} onValueChange={v => setTimeframe(v as any)}>
            <SelectTrigger className="bg-white shadow-sm">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Revenue" 
          value={data.summary.totalRevenue} 
          icon={<DollarSign className="h-5 w-5" />}
          formatted={currencyFormatter(data.summary.totalRevenue)}
          color="bg-gradient-to-r from-indigo-500 to-purple-600"
          trend={`+12.5% from last period`}
        />
        
        <SummaryCard 
          title="Avg Order Value" 
          value={data.summary.averageOrderValue} 
          icon={<ShoppingBag className="h-5 w-5" />}
          formatted={currencyFormatter(data.summary.averageOrderValue)}
          color="bg-gradient-to-r from-sky-500 to-cyan-600"
          trend={`+3.2% from last period`}
        />
        
        <SummaryCard 
          title="Total Bookings" 
          value={data.summary.totalBookings} 
          icon={<Package className="h-5 w-5" />}
          formatted={data.summary.totalBookings.toString()}
          color="bg-gradient-to-r from-amber-500 to-orange-500"
          trend={`+8.7% from last period`}
        />
        
        <SummaryCard 
          title="Repeat Customers" 
          value={data.summary.repeatCustomerRate} 
          icon={<Repeat className="h-5 w-5" />}
          formatted={`${data.summary.repeatCustomerRate.toFixed(1)}%`}
          color="bg-gradient-to-r from-emerald-500 to-green-500"
          trend={`+2.3% from last period`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard 
          title="Avg Delivery Time" 
          value={data.summary.avgDeliveryHours} 
          icon={<Clock className="h-5 w-5" />}
          formatted={`${data.summary.avgDeliveryHours.toFixed(1)} hours`}
          color="bg-gradient-to-r from-blue-500 to-indigo-500"
          trend={`-1.5 hours from last period`}
        />
        
        <SummaryCard 
          title="On-Time Delivery" 
          value={data.summary.onTimeDeliveryRate} 
          icon={<Clock className="h-5 w-5" />}
          formatted={`${data.summary.onTimeDeliveryRate.toFixed(1)}%`}
          color="bg-gradient-to-r from-violet-500 to-purple-500"
          trend={`+4.2% from last period`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Bookings Timeline */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Revenue & Bookings Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={currencyFormatter} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="bookings" 
                  name="Bookings" 
                  fill="#22d3ee" 
                  barSize={24} 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-emerald-500" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.categoryPerformance} 
                  dataKey="totalRevenue" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.categoryPerformance.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currencyFormatter(Number(value))} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              Top Performing Products
            </CardTitle>
            <CardDescription>By revenue and quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={data.productPerformance}
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis 
                    type="number" 
                    tickFormatter={currencyFormatter} 
                    domain={[0, 'dataMax + 100']}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalRevenue') return currencyFormatter(Number(value));
                      return value;
                    }}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="totalRevenue" 
                    name="Revenue" 
                    fill="#4f46e5" 
                    barSize={20} 
                    radius={[0, 4, 4, 0]}
                  />
                  <Scatter 
                    dataKey="totalSold" 
                    name="Units Sold" 
                    fill="#f97316" 
                    shape="circle"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-500" />
              Customer Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800">Total Customers</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {data.summary.totalCustomers}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800">Repeat Customers</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {Math.round(data.summary.totalCustomers * (data.summary.repeatCustomerRate / 100))}
                </p>
                <p className="text-sm text-emerald-700">
                  ({data.summary.repeatCustomerRate.toFixed(1)}%)
                </p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={currencyFormatter} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip formatter={(value) => currencyFormatter(Number(value))} />
                  <Bar 
                    dataKey="totalRevenue" 
                    name="Revenue" 
                    fill="#10b981" 
                    barSize={24} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Performance */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Clock className="h-5 w-5 text-violet-500" />
            Delivery Performance
          </CardTitle>
          <CardDescription>
            Average delivery time: {data.summary.avgDeliveryHours.toFixed(1)} hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                <span className="text-sm font-semibold">{data.summary.onTimeDeliveryRate.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${data.summary.onTimeDeliveryRate}%` }}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Avg Delivery Time</span>
                <span className="text-sm font-semibold">{data.summary.avgDeliveryHours.toFixed(1)} hours</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${Math.min(100, data.summary.avgDeliveryHours / 72 * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
const SummaryCard = ({ title, value, formatted, icon, color, trend }: any) => (
  <Card className={`${color} text-white border-0 overflow-hidden`}>
    <CardContent className="p-6 relative">
      <div className="absolute right-4 top-4 opacity-20">
        {React.cloneElement(icon, { className: "h-12 w-12" })}
      </div>
      <h3 className="text-lg font-medium opacity-90 flex items-center gap-2">
        {icon} {title}
      </h3>
      <p className="text-3xl font-bold mt-2">{formatted}</p>
      <p className="text-sm opacity-90 mt-1">{trend}</p>
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full max-w-5xl">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 col-span-2" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-96 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
    
    <Skeleton className="h-40 rounded-xl" />
  </div>
);

export default Dashboard;