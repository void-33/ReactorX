import { motion } from "framer-motion";
import { Check, Zap, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: Zap, value: "40%", label: "Faster Response Times", color: "text-yellow-600", bg: "bg-yellow-50" },
  { icon: TrendingUp, value: "60%", label: "Cost Reduction", color: "text-green-600", bg: "bg-green-50" },
  { icon: Award, value: "98%", label: "Certification Rate", color: "text-blue-600", bg: "bg-blue-50" },
];

const benefits = [
  "Zero-risk training environment",
  "Scalable for any team size",
  "Customizable scenarios for your facility",
  "Real-time performance feedback",
  "Industry-standard compliance tracking",
  "24/7 accessible from anywhere"
];

export function AboutSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6"
              >
                <span className="text-blue-900 text-sm font-medium">Why Choose Us</span>
              </motion.div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Train Smarter with
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Advanced Simulation
                </span>
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                Our platform delivers realistic computer-based training scenarios that prepare 
                your team for critical situations. Experience the most comprehensive simulation 
                software designed specifically for industrial emergency response.
              </p>
            </div>

            {/* Benefits checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-4"
            >
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group text-lg"
              >
                Explore our technology
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="space-y-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                      <div className="text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Large image card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-xl group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1605434896704-336c825fe58e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY29udHJvbCUyMHBhbmVsfGVufDF8fHx8MTc2ODc2Mzg0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Control Panel Training"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-semibold text-lg mb-1">Interactive Control Systems</div>
                    <div className="text-sm text-slate-300">Hands-on training with real equipment interfaces</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
