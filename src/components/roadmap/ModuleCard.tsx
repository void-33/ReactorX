import Link from 'next/link';
import { CheckCircle2, Circle, Clock, Lock, PlayCircle } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  progress: number;
  category: string;
  image: string;
  icon: any;
}

interface ModuleCardProps {
  module: TrainingModule;
  index: number;
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const Icon = module.icon;

  const getNavigationUrl = () => {
    if (module.status === 'locked') return '#';
    return module.title.includes('Emergency') ? '/emergency' : '/lab';
  };

  const getStatusColor = () => {
    switch (module.status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'available':
        return 'bg-amber-500';
      case 'locked':
        return 'bg-slate-300';
    }
  };

  const getStatusIcon = () => {
    switch (module.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'available':
        return <Circle className="w-5 h-5 text-amber-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (module.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'available':
        return 'Available';
      case 'locked':
        return 'Locked';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg ${
        module.status === 'locked' ? 'opacity-60' : 'hover:-translate-y-1'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Header */}
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img
          src={module.image}
          alt={module.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-md`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md">
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-slate-900 font-medium leading-tight">{module.title}</h3>
        </div>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{module.description}</p>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Clock className="w-4 h-4" />
          <span>{module.duration}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
            {module.category}
          </span>
        </div>

        {/* Progress Bar */}
        {module.status === 'in-progress' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={getNavigationUrl()}
          className={`block w-full py-2.5 px-4 rounded-lg transition-all text-center ${
            module.status === 'locked'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              : module.status === 'completed'
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              : module.status === 'in-progress'
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          {module.status === 'locked' && 'Complete prerequisites'}
          {module.status === 'available' && 'Start Training'}
          {module.status === 'in-progress' && 'Continue Training'}
          {module.status === 'completed' && 'Review Module'}
        </Link>
      </div>
    </div>
  );
}
