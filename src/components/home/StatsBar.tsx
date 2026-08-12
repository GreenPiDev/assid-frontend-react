import { stats } from "../../data/stats";

const borderClasses = [
  "border-b border-r border-assid-line md:border-b-0",
  "border-b border-assid-line md:border-b-0 md:border-r",
  "border-r border-assid-line",
  "",
];

export default function StatsBar() {
  return (
    <div className="relative z-3 mx-auto w-[min(calc(100%-40px),1240px)] pb-11">
      <div className="grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-card md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.label} className={`px-5 py-5 md:px-7 ${borderClasses[index]}`}>
            <strong className="block text-[clamp(1.75rem,3.1vw,2.65rem)] leading-none tracking-tighter text-assid-green">
              {stat.value}
            </strong>
            <span className="mt-2 block text-[0.84rem] font-semibold text-assid-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
