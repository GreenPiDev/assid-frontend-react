import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function JoinSection() {
  return (
    <section id="uyelik" className="flex scroll-mt-[78px] flex-col py-15 lg:h-[calc(100vh-78px)] lg:py-11">
      <div className="mx-auto grid w-[min(calc(100%-40px),1240px)] flex-1 grid-cols-1 items-stretch overflow-hidden rounded-[32px] bg-assid-sand md:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center p-8 md:p-13.5">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
            ASSİD ailesine katılın
          </div>
          <h2 className="my-3.5 text-[clamp(2rem,3.6vw,3.55rem)] leading-[1.02] tracking-[-.055em]">
            Firmanızı doğru iş bağlantılarıyla buluşturun.
          </h2>
          <p className="mb-6 max-w-lg text-[#59635c]">
            Markanızı dijital firma rehberinde görünür kılın, yeni iş birliklerine erişin ve
            sektörünüzdeki gelişmeleri yakından takip edin.
          </p>
          <Button as={Link} to="/uyelik-basvurusu" variant="primary">
            Üyelik Başvurusu <span>→</span>
          </Button>
        </div>
        <div className="min-h-96.5 bg-[linear-gradient(20deg,rgba(9,32,54,.78),rgba(9,32,54,.02)),url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center lg:min-h-0" />
      </div>
    </section>
  );
}
