import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Download, FileText, TrendingUp, Users, Target, DollarSign, Calendar, Award, Phone, Mail } from 'lucide-react';
import StatCard from '../../components/StatCard';
import ActionButton from '../../components/ActionButton';
import SearchFilter from '../../components/SearchFilter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const SalesReports: React.FC = () => {
  const { leads } = useData();
  const { authState } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [sourceFilter, setSourceFilter] = useState('');

  // Filter leads assigned to current sales user
  const myLeads = leads.filter(lead => lead.assignedTo === authState.user?.id.toString());

  const filteredLeads = myLeads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const matchesDate = leadDate >= startDate && leadDate <= endDate;
    const matchesSource = sourceFilter === '' || lead.source === sourceFilter;
    
    return matchesDate && matchesSource;
  });

  // Calculate comprehensive metrics
  const totalLeads = filteredLeads.length;
  const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length;
  const qualifiedLeads = filteredLeads.filter(l => l.status === 'qualified').length;
  const contactedLeads = filteredLeads.filter(l => l.status === 'contacted').length;
  const lostLeads = filteredLeads.filter(l => l.status === 'lost').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const totalRevenue = filteredLeads.filter(l => l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0);
  const avgDealSize = convertedLeads > 0 ? (totalRevenue / convertedLeads).toFixed(0) : '0';

  // Lead status distribution
  const statusData = [
    { name: 'New', value: filteredLeads.filter(l => l.status === 'new').length, color: '#10B981' },
    { name: 'Contacted', value: contactedLeads, color: '#F59E0B' },
    { name: 'Qualified', value: qualifiedLeads, color: '#3B82F6' },
    { name: 'Converted', value: convertedLeads, color: '#8B5CF6' },
    { name: 'Lost', value: lostLeads, color: '#EF4444' }
  ];

  // Source distribution with performance metrics
  const sourceData = [
    {
      source: 'Website',
      leads: filteredLeads.filter(l => l.source === 'website').length,
      converted: filteredLeads.filter(l => l.source === 'website' && l.status === 'converted').length,
      revenue: filteredLeads.filter(l => l.source === 'website' && l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0)
    },
    {
      source: 'Referral',
      leads: filteredLeads.filter(l => l.source === 'referral').length,
      converted: filteredLeads.filter(l => l.source === 'referral' && l.status === 'converted').length,
      revenue: filteredLeads.filter(l => l.source === 'referral' && l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0)
    },
    {
      source: 'Call',
      leads: filteredLeads.filter(l => l.source === 'call').length,
      converted: filteredLeads.filter(l => l.source === 'call' && l.status === 'converted').length,
      revenue: filteredLeads.filter(l => l.source === 'call' && l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0)
    },
    {
      source: 'Other',
      leads: filteredLeads.filter(l => l.source === 'other').length,
      converted: filteredLeads.filter(l => l.source === 'other' && l.status === 'converted').length,
      revenue: filteredLeads.filter(l => l.source === 'other' && l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0)
    }
  ];

  // Daily performance data for the last 30 days
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayLeads = filteredLeads.filter(lead => {
      const createdAt = new Date(lead.createdAt);
      return format(createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });

    return {
      date: format(date, 'MMM dd'),
      leads: dayLeads.length,
      converted: dayLeads.filter(l => l.status === 'converted').length,
      revenue: dayLeads.filter(l => l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0),
      contacted: dayLeads.filter(l => l.status === 'contacted').length
    };
  });

  // Monthly comparison data
  const monthlyComparison = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const monthLeads = myLeads.filter(lead => {
      const createdAt = new Date(lead.createdAt);
      return format(createdAt, 'yyyy-MM') === format(month, 'yyyy-MM');
    });

    return {
      month: format(month, 'MMM yyyy'),
      leads: monthLeads.length,
      converted: monthLeads.filter(l => l.status === 'converted').length,
      revenue: monthLeads.filter(l => l.status === 'converted').reduce((sum, lead) => sum + lead.price, 0),
      conversionRate: monthLeads.length > 0 ? ((monthLeads.filter(l => l.status === 'converted').length / monthLeads.length) * 100).toFixed(1) : 0
    };
  });

  // Activity timeline with detailed activities
  const activities = [
    { 
      date: format(new Date(), 'yyyy-MM-dd'), 
      activity: 'Converted lead: TechStartup.com', 
      value: '$4,500',
      type: 'conversion',
      description: 'Successfully closed premium domain sale after 3 follow-up calls'
    },
    { 
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), 
      activity: 'Demo completed: E-commerce Pro', 
      value: '$7,200',
      type: 'demo',
      description: 'Product demonstration went well, proposal sent'
    },
    { 
      date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), 
      activity: 'Qualified lead: Fintech Solutions', 
      value: '$12,500',
      type: 'qualification',
      description: 'Lead meets all criteria, budget confirmed'
    },
    { 
      date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), 
      activity: 'Follow-up call: AI Consulting', 
      value: '$15,000',
      type: 'follow-up',
      description: 'Discussed pricing options and timeline'
    },
    { 
      date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), 
      activity: 'New lead assigned: Green Energy', 
      value: '$18,500',
      type: 'new-lead',
      description: 'High-value prospect in renewable energy sector'
    }
  ];

  // Performance insights
  const insights = [
    {
      title: 'Best Performing Day',
      value: dailyData.reduce((best, current) => current.converted > best.converted ? current : best).date,
      description: `${dailyData.reduce((best, current) => current.converted > best.converted ? current : best).converted} conversions`
    },
    {
      title: 'Top Revenue Source',
      value: sourceData.reduce((best, current) => current.revenue > best.revenue ? current : best).source,
      description: `$${sourceData.reduce((best, current) => current.revenue > best.revenue ? current : best).revenue.toLocaleString()} generated`
    },
    {
      title: 'Conversion Trend',
      value: monthlyComparison[5].conversionRate > monthlyComparison[4].conversionRate ? 'Improving' : 'Declining',
      description: `${Math.abs(parseFloat(monthlyComparison[5].conversionRate) - parseFloat(monthlyComparison[4].conversionRate)).toFixed(1)}% change from last month`
    }
  ];

  const exportData = (format: 'csv' | 'pdf') => {
    console.log(`Exporting personal report as ${format}`);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const reportStats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users size={24} />,
      color: 'blue'
    },
    {
      title: 'Converted',
      value: convertedLeads,
      icon: <Target size={24} />,
      color: 'green'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: <TrendingUp size={24} />,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={24} />,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">My Sales Reports</h2>
          <p className="text-gray-600">Comprehensive performance analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <ActionButton
            label="Export CSV"
            icon={<FileText size={18} />}
            onClick={() => exportData('csv')}
            variant="secondary"
          />
          <ActionButton
            label="Export PDF"
            icon={<Download size={18} />}
            onClick={() => exportData('pdf')}
            variant="primary"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <SearchFilter
            searchPlaceholder=""
            onSearch={() => {}}
            filters={[
              {
                label: 'Source',
                value: sourceFilter,
                onChange: setSourceFilter,
                options: [
                  { value: 'website', label: 'Website' },
                  { value: 'referral', label: 'Referral' },
                  { value: 'call', label: 'Call' },
                  { value: 'other', label: 'Other' }
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-1">{insight.title}</h4>
              <p className="text-lg font-bold text-indigo-600">{insight.value}</p>
              <p className="text-sm text-indigo-700">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Performance (Last 30 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Leads" />
                <Area type="monotone" dataKey="converted" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Converted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Lead Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance by Source</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : name === 'leads' ? 'Total Leads' : 'Converted'
                ]} />
                <Legend />
                <Bar dataKey="leads" name="Total Leads" fill="#e5e7eb" />
                <Bar dataKey="converted" name="Converted" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">6-Month Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : 
                  name === 'conversionRate' ? `${value}%` : value,
                  name === 'revenue' ? 'Revenue' : 
                  name === 'conversionRate' ? 'Conversion Rate' : 
                  name === 'leads' ? 'Total Leads' : 'Converted'
                ]} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#8884d8" name="Total Leads" />
                <Line yAxisId="left" type="monotone" dataKey="converted" stroke="#82ca9d" name="Converted" />
                <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#ff7300" name="Conversion Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${avgDealSize}</div>
            <div className="text-sm text-gray-600">Avg Deal Size</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ${sourceData.reduce((best, current) => current.revenue > best.revenue ? current : best).revenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Highest Source Revenue</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round((totalRevenue / (totalLeads * parseInt(avgDealSize))) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Revenue Efficiency</div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity Timeline</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                {activity.type === 'conversion' && <Award className="text-indigo-600\" size={20} />}
                {activity.type === 'demo' && <Calendar className="text-indigo-600" size={20} />}
                {activity.type === 'qualification' && <Target className="text-indigo-600\" size={20} />}
                {activity.type === 'follow-up' && <Phone className="text-indigo-600" size={20} />}
                {activity.type === 'new-lead' && <Users className="text-indigo-600\" size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{activity.activity}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(activity.date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">{activity.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Performance Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Detailed Source Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-right py-3 px-4">Total Leads</th>
                <th className="text-right py-3 px-4">Converted</th>
                <th className="text-right py-3 px-4">Conversion Rate</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">Avg Deal Size</th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((source, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{source.source}</td>
                  <td className="py-3 px-4 text-right">{source.leads}</td>
                  <td className="py-3 px-4 text-right">{source.converted}</td>
                  <td className="py-3 px-4 text-right">
                    {source.leads > 0 ? Math.round((source.converted / source.leads) * 100) : 0}%
                  </td>
                  <td className="py-3 px-4 text-right">${source.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    ${source.converted > 0 ? Math.round(source.revenue / source.converted).toLocaleString() : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;