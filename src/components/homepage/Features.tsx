import { motion } from "framer-motion";
import { Flame, Shield, Monitor, Users, BarChart3, Cpu, AlertTriangle, FileText } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "Fire & Emergency Response",
    description: "Realistic fire and hazardous material scenarios with accurate physics and chemical reaction modeling.",
    gradient: "from-red-500/10 to-orange-500/10",
    iconGradient: "from-red-500 to-orange-500",
    iconBg: "bg-red-50"
  },
  {
    icon: Monitor,
    title: "Process Control Training",
    description: "Interactive simulations of complex industrial control systems and monitoring interfaces.",
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconGradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50"
  },
  {
    icon: AlertTriangle,
    title: "Crisis Management",
    description: "Practice decision-making under pressure with escalating emergency scenarios and time constraints.",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconGradient: "from-yellow-500 to-orange-500",
    iconBg: "bg-yellow-50"
  },
  {
    icon: Users,
    title: "Multi-User Collaboration",
    description: "Team-based scenarios supporting communication and coordination between multiple operators.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconGradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-50"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Comprehensive metrics tracking response times, decision accuracy, and skill progression.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconGradient: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-50"
  },
  {
    icon: FileText,
    title: "Compliance & Certification",
    description: "Automated reporting and certification tracking for industry safety standards and regulations.",
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconGradient: "from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-50"
  }
];

export function Features() {
  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm font-medium">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need for
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Effective Training
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced simulation technology designed for industrial safety and emergency response training
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-slate-200 hover:border-slate-300 transition-all duration-300 h-full backdrop-blur-sm`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-7 h-7 bg-gradient-to-br ${feature.iconGradient} rounded-lg flex items-center justify-center`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect - arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center text-sm font-medium text-blue-600"
                >
                  Learn more →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
