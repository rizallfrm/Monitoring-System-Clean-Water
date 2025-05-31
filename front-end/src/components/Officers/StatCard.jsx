import { Clock, Activity, CheckCircle, XCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, trend }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

export const StatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Clock}
        title="Menunggu"
        value={stats.pending}
        color="text-yellow-600"
        trend="+2 hari ini"
      />
      <StatCard
        icon={Activity}
        title="Dikerjakan"
        value={stats.onGoing}
        color="text-blue-600"
        trend="+3 hari ini"
      />
      <StatCard
        icon={CheckCircle}
        title="Selesai"
        value={stats.completed}
        color="text-green-600"
        trend="+5 hari ini"
      />
      <StatCard
        icon={XCircle}
        title="Dibatalkan"
        value={stats.cancelled}
        color="text-red-600"
      />
    </div>
  );
};
