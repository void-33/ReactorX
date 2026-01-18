"use client";
import { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  HardHat, 
  AlertTriangle, 
  Shield, 
  BookOpen,
  Target,
  TrendingUp,
  Lock
} from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { ProgressBar } from './ProgressBar';

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

export function TrainingRoadmap() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const modules: TrainingModule[] = [
    {
      id: '1',
      title: 'Safety Fundamentals',
      description: 'Essential safety protocols and procedures for industrial environments',
      duration: '4 hours',
      status: 'completed',
      progress: 100,
      category: 'Foundation',
      image: 'https://images.unsplash.com/photo-1641893823219-38b433f736c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhbnQlMjB3b3JrZXJ8ZW58MXx8fHwxNzY4NzcwNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: HardHat,
    },
    {
      id: '2',
      title: 'Personal Protective Equipment (PPE)',
      description: 'Proper selection, use, and maintenance of safety equipment',
      duration: '3 hours',
      status: 'completed',
      progress: 100,
      category: 'Foundation',
      image: 'https://plus.unsplash.com/premium_photo-1667509227075-3fc7efcf149e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: Shield,
    },
    {
      id: '3',
      title: 'Ammonia Fertilizer Plant',
      description: 'Learn the structure of an ammonia fertilizer plant',
      duration: '3 hours',
      status: 'available',
      progress: 0,
      category: 'Foundation',
      image: 'https://images.unsplash.com/photo-1562069540-6b8ea3a2def7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: AlertTriangle,
    },
    {
      id: '4',
      title: 'Fire Safety & Prevention',
      description: 'Fire prevention strategies and emergency response procedures',
      duration: '6 hours',
      status: 'completed',
      progress: 100,
      category: 'Emergency Response',
      image: 'https://images.unsplash.com/photo-1690973692388-239878450c7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: Flame,
    },
    {
      id: '5',
      title: 'Emergency Evacuation Procedures',
      description: 'Critical protocols for safe and efficient emergency evacuations',
      duration: '4 hours',
      status: 'completed',
      progress: 100,
      category: 'Emergency Response',
      image: 'https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjByZXNwb25zZSUyMHRlYW18ZW58MXx8fHwxNzY4NzY2MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: AlertTriangle,
    },
    {
      id: '6',
      title: 'Ammonia Emergency Response',
      description: ' Standard Operating Procedures for ammonia leaks and spills',
      duration: '4 hours',
      status: 'available',
      progress: 0,
      category: 'Emergency Response',
      image: 'https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjByZXNwb25zZSUyMHRlYW18ZW58MXx8fHwxNzY4NzY2MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: AlertTriangle,
    },
    {
      id: '7',
      title: 'First Aid & Medical Response',
      description: 'Essential first aid skills for industrial workplace incidents',
      duration: '8 hours',
      status: 'locked',
      progress: 0,
      category: 'Emergency Response',
      image: 'https://images.unsplash.com/photo-1765040448743-853f1802e4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZldHklMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njg3NzA3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Shield,
    },
    {
      id: '8',
      title: 'Chemical Handling & HAZMAT',
      description: 'Safe handling, storage, and disposal of hazardous materials',
      duration: '7 hours',
      status: 'locked',
      progress: 0,
      category: 'Advanced',
      image: 'https://images.unsplash.com/photo-1641893823219-38b433f736c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhbnQlMjB3b3JrZXJ8ZW58MXx8fHwxNzY4NzcwNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: AlertTriangle,
    },
    {
      id: '9',
      title: 'Incident Command System',
      description: 'Leadership and coordination during emergency situations',
      duration: '10 hours',
      status: 'locked',
      progress: 0,
      category: 'Advanced',
      image: 'https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjByZXNwb25zZSUyMHRlYW18ZW58MXx8fHwxNzY4NzY2MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Target,
    },
  ];

  const categories = ['all', 'Foundation', 'Emergency Response', 'Advanced'];

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const overallProgress = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl tracking-tight text-slate-900">Training Roadmap</h1>
              <p className="mt-1 text-slate-600">Industrial Plant & Emergency Response Certification</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-900">{completedModules} / {totalModules} Completed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl text-slate-900">Your Progress</h2>
              <p className="text-sm text-slate-600 mt-1">Keep up the great work!</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl">{overallProgress}%</span>
            </div>
          </div>
          <ProgressBar progress={overallProgress} />
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700">Completed</p>
                  <p className="text-2xl text-emerald-900">{completedModules}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">In Progress</p>
                  <p className="text-2xl text-blue-900">
                    {modules.filter(m => m.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Available</p>
                  <p className="text-2xl text-amber-900">
                    {modules.filter(m => m.status === 'available').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No modules found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
